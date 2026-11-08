import re
import logging
import uuid
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.core.database import get_db
from app.models.db_models import ContactSubmission
from app.schemas.pydantic_objs import ContactForm

logger = logging.getLogger("contact_api")

router = APIRouter(prefix="/contact", tags=["contact"])

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
MAX_MESSAGE_LEN = 5000


@router.post("")
async def submit_contact(body: ContactForm, db: Session = Depends(get_db)):
    """Accept contact form submissions from users."""
    name = body.name.strip()
    email = body.email.strip().lower()
    message = body.message.strip()

    # Basic validation
    if len(name) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name must be at least 2 characters."
        )
    if not EMAIL_REGEX.match(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address."
        )
    if len(message) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message must be at least 10 characters."
        )
    if len(message) > MAX_MESSAGE_LEN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Message cannot exceed {MAX_MESSAGE_LEN} characters."
        )

    submission_id = str(uuid.uuid4())
    try:
        db.add(ContactSubmission(id=submission_id, name=name, email=email, message=message))
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        logger.error("Failed to persist contact submission")
        raise HTTPException(status_code=503, detail="Your message could not be saved. Please try again.")

    return {
        "success": True,
        "submissionId": submission_id,
        "message": "Your message has been received. We'll get back to you shortly."
    }
