import json
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session as DBSession
from sqlalchemy.exc import SQLAlchemyError
from starlette.concurrency import run_in_threadpool
from app.core.gemini import generate_health_answer, GeminiUnavailable
from app.core.database import get_db
from app.models.db_models import User, ChatSession, ChatMessage, HealthProfile
from app.schemas.pydantic_objs import ChatMessageCreate, ChatSessionCreate, ChatMessageResponse
from typing import List
from app.api.deps import get_current_user

logger = logging.getLogger("chat_api")

router = APIRouter(prefix="/chat", tags=["chat"])

def _local_health_fallback(question: str) -> tuple[str, str]:
    """Safe demo fallback when Gemini is unavailable."""
    lower_question = question.lower()
    emergency_terms = [
        "chest pain",
        "shortness of breath",
        "can't breathe",
        "cannot breathe",
        "unconscious",
        "stroke",
        "seizure",
        "severe bleeding",
    ]
    if any(term in lower_question for term in emergency_terms):
        return (
            "Your symptoms may need urgent medical attention. Please contact local emergency services or go to the nearest emergency department immediately. I can only provide general information and cannot diagnose you.",
            "Are you currently experiencing severe pain, breathing difficulty, fainting, or any rapidly worsening symptoms?",
        )

    return (
        "I am having trouble connecting to the AI service right now, but here is general safety guidance: monitor your symptoms, rest, stay hydrated, avoid self-medicating beyond label instructions, and consult a qualified healthcare professional if symptoms persist, worsen, or feel unusual for you. This is general information, not a diagnosis.",
        "Could you share your age, how long this has been happening, and whether you have fever, severe pain, breathing difficulty, dizziness, or any existing medical conditions?",
    )


SYSTEM_PROMPT = """You are a medical AI assistant. Your goal is to answer the user's question or ask for more information if needed.

IMPORTANT: You have access to the conversation history. Use this context to:
- Reference previous discussions and questions
- Provide more personalized responses based on what was discussed before
- Avoid asking for information already provided in previous messages
- Build upon previous advice or recommendations

Provide a direct answer in the answer field. When more information is needed,
include a specific followUpQuestion. The API supplies the response schema.

Carefully review the user's input:
Question: {question}
Medical History: {medical_history}
Lifestyle: {lifestyle}
Symptoms: {symptoms}
Previous Conversation: {history}

Based on this, decide if you can answer directly or if a follow-up question is necessary, and then generate the JSON response as described.
You should avoid providing medical advice or diagnoses. Instead, provide general information. If you are unsure, politely suggest that the user consult a healthcare professional.
"""

@router.post("/sessions")
async def create_chat_session(
    session_in: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    try:
        import uuid
        session_id = str(uuid.uuid4())
        db_session = ChatSession(
            userId=current_user.id,
            sessionId=session_id,
            title=session_in.title,
        )
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        return {"sessionId": session_id, "title": db_session.title, "createdAt": db_session.createdAt}
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating session for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chat session in database."
        )

@router.get("/sessions")
async def list_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    try:
        sessions = db.query(ChatSession).filter(
            ChatSession.userId == current_user.id,
            ChatSession.isActive == True
        ).order_by(ChatSession.updatedAt.desc()).all()
        
        return [
            {
                "sessionId": s.sessionId,
                "title": s.title or "Chat Session",
                "createdAt": s.createdAt,
                "updatedAt": s.updatedAt
            } for s in sessions
        ]
    except SQLAlchemyError as e:
        logger.error(f"Database error listing sessions for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chat sessions."
        )

@router.post("/sessions/{session_id}/messages")
async def send_chat_message(
    session_id: str,
    message_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    try:
        # Verify session belongs to user
        chat_session = db.query(ChatSession).filter(
            ChatSession.sessionId == session_id,
            ChatSession.userId == current_user.id
        ).first()
        
        if not chat_session:
            raise HTTPException(status_code=404, detail="Chat session not found")

        # Save user message to database
        user_msg = ChatMessage(
            sessionId=chat_session.id,
            content=message_in.content,
            sender="user",
            timestamp=datetime.utcnow()
        )
        db.add(user_msg)
        db.commit() # Commit user message first to guarantee it is saved
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error writing user message: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to persist message to the database."
        )

    try:
        # Retrieve user health profile
        profile = db.query(HealthProfile).filter(HealthProfile.userId == current_user.id).first()
        med_hist = profile.medicalHistory if profile else ""
        lifestyle = profile.lifestyle if profile else ""
        symptoms = profile.symptoms if profile else ""

        # Load recent conversation history (last 10 messages)
        history_msgs = db.query(ChatMessage).filter(
            ChatMessage.sessionId == chat_session.id
        ).order_by(ChatMessage.timestamp.desc(), ChatMessage.id.desc()).limit(10).all()
        history_msgs.reverse()
        
        history_str = "\n".join([f"{m.sender.upper()}: {m.content}" for m in history_msgs])
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching context data: {e}")
        # Continue with empty context rather than crash the chat flow
        med_hist, lifestyle, symptoms, history_str = "", "", "", ""

    # Construct the full prompt
    formatted_prompt = SYSTEM_PROMPT.format(
        question=message_in.content,
        medical_history=med_hist or "None provided",
        lifestyle=lifestyle or "None provided",
        symptoms=symptoms or "None provided",
        history=history_str or "No previous messages"
    )

    source, fallback_reason = "gemini", None
    try:
        result = await run_in_threadpool(generate_health_answer, formatted_prompt)
        ai_answer, follow_up = result.answer, result.followUpQuestion
    except GeminiUnavailable as error:
        source, fallback_reason = "local_fallback", error.reason
        ai_answer, follow_up = _local_health_fallback(message_in.content)
        logger.warning("Chat returned local fallback (%s)", fallback_reason)

    try:
        ai_msg = ChatMessage(
            sessionId=chat_session.id,
            content=ai_answer,
            sender="ai",
            timestamp=datetime.utcnow(),
            isFollowUp=bool(follow_up),
            messageMetadata=json.dumps({"followUpQuestion": follow_up, "source": source, "fallbackReason": fallback_reason})
        )
        db.add(ai_msg)
        
        # Update chat session updatedAt
        chat_session.updatedAt = datetime.utcnow()
        db.commit()
        
        return {
            "answer": ai_answer,
            "followUpQuestion": follow_up,
            "source": source,
            "fallbackReason": fallback_reason,
        }
    except SQLAlchemyError:
        db.rollback()
        logger.error("Failed to persist chat response")
        raise HTTPException(status_code=500, detail="Failed to save chat response.")


@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageResponse])
async def get_chat_messages(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    try:
        chat_session = db.query(ChatSession).filter(
            ChatSession.sessionId == session_id,
            ChatSession.userId == current_user.id
        ).first()
        
        if not chat_session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )
            
        messages = db.query(ChatMessage).filter(
            ChatMessage.sessionId == chat_session.id
        ).order_by(ChatMessage.timestamp.asc()).all()
        
        return messages
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching messages for session {session_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve messages from database."
        )


@router.delete("/sessions/{session_id}")
async def delete_chat_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    try:
        chat_session = db.query(ChatSession).filter(
            ChatSession.sessionId == session_id,
            ChatSession.userId == current_user.id
        ).first()
        
        if not chat_session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )
            
        chat_session.isActive = False
        chat_session.updatedAt = datetime.utcnow()
        db.commit()
        
        return {"success": True, "message": "Session deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting session {session_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete chat session from database."
        )

