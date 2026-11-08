from datetime import datetime, timedelta
import uuid
import logging
import hashlib
import hmac
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Query
from sqlalchemy.orm import Session as DBSession
from sqlalchemy.exc import SQLAlchemyError
from app.core.database import get_db
from app.models.db_models import User, Session as UserSession, SecurityEvent
from app.schemas.pydantic_objs import UserRegister, UserLogin, Token, UserResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.config import settings
from app.core.mail import send_password_reset_email, EmailDeliveryError
from starlette.concurrency import run_in_threadpool

# Setup local logger
logger = logging.getLogger("auth_api")
logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/auth", tags=["auth"])

def log_security_event(db: DBSession, event_type: str, severity: str, details: str, user_id: int = None, ip: str = None, ua: str = None):
    """Utility to log security events to the database for audit tracking."""
    try:
        event = SecurityEvent(
            type=event_type,
            severity=severity,
            details=details,
            userId=user_id,
            ipAddress=ip,
            userAgent=ua
        )
        db.add(event)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to write security event: {e}")

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserRegister, request: Request, db: DBSession = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")
    
    try:
        # Check if email already exists
        user = db.query(User).filter(User.email == user_in.email.lower()).first()
        if user:
            log_security_event(db, "registration_failed", "medium", f"Attempted duplicate registration for email: {user_in.email}", ip=ip, ua=ua)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The user with this email already exists in the system.",
            )
        
        hashed_password = get_password_hash(user_in.password)
        new_user = User(
            name=user_in.name,
            email=user_in.email.lower(),
            password=hashed_password,
            confirmpassword=hashed_password,
            role="user"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        log_security_event(db, "registration_success", "low", f"New user registered: {new_user.email} (ID: {new_user.id})", user_id=new_user.id, ip=ip, ua=ua)
        return new_user
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during registration: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error. Please try again later."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during registration: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration."
        )

@router.post("/login", response_model=Token)
async def login(
    user_in: UserLogin, 
    response: Response, 
    request: Request,
    db: DBSession = Depends(get_db)
):
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")
    
    try:
        user = db.query(User).filter(User.email == user_in.email.lower()).first()
        if not user or not verify_password(user_in.password, user.password):
            log_security_event(db, "login_failed", "medium", f"Failed login attempt for email: {user_in.email}", ip=ip, ua=ua)
            
            # Increment failed attempts if user exists
            if user:
                user.failedLoginAttempts += 1
                if user.failedLoginAttempts >= 5:
                    user.lockedUntil = datetime.utcnow() + timedelta(minutes=15)
                    log_security_event(db, "account_locked", "high", f"Account locked due to consecutive failures: {user.email}", user_id=user.id, ip=ip, ua=ua)
                db.commit()
                
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect email or password"
            )
        
        # Check lock status
        if user.lockedUntil and user.lockedUntil > datetime.utcnow():
            log_security_event(db, "login_locked_attempt", "high", f"Attempted login on locked account: {user.email}", user_id=user.id, ip=ip, ua=ua)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is temporarily locked. Please try again in 15 minutes."
            )
        
        if not user.isActive:
            log_security_event(db, "login_inactive_attempt", "medium", f"Attempted login on inactive account: {user.email}", user_id=user.id, ip=ip, ua=ua)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Your account is deactivated. Please contact support."
            )

        # Reset failed attempts
        user.failedLoginAttempts = 0
        user.lockedUntil = None
        user.lastLoginAt = datetime.utcnow()
        
        # Generate tokens
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        # Create persistent session
        session_id = str(uuid.uuid4())
        db_session = UserSession(
            id=session_id,
            userId=user.id,
            token=access_token,
            refreshToken=refresh_token,
            expiresAt=expires_at,
            ipAddress=ip,
            userAgent=ua,
            isActive=True
        )
        db.add(db_session)
        db.commit()

        # Set httponly cookie for refresh token
        response.set_cookie(
            key="refreshToken",
            value=refresh_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="strict",
            max_age=60 * 60 * 24 * settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

        log_security_event(db, "login_success", "low", f"Successful login for user: {user.email}", user_id=user.id, ip=ip, ua=ua)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error. Please try again."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred."
        )

@router.post("/refresh", response_model=Token)
async def refresh(
    request: Request,
    response: Response,
    db: DBSession = Depends(get_db)
):
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")
    
    try:
        refresh_token = request.cookies.get("refreshToken")
        if not refresh_token:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                refresh_token = auth_header.split(" ")[1]

        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token missing"
            )

        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        try:
            user_id = int(payload.get("sub"))
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Find session from DB

        session = db.query(UserSession).filter(
            UserSession.refreshToken == refresh_token,
            UserSession.isActive == True,
            UserSession.expiresAt > datetime.utcnow()
        ).first()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired or invalid"
            )

        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.isActive or session.userId != user_id:
            raise HTTPException(status_code=401, detail="User inactive or session invalid")

        # Generate new tokens
        new_access_token = create_access_token(user_id)
        new_refresh_token = create_refresh_token(user_id)

        # Update session in DB
        session.token = new_access_token
        session.refreshToken = new_refresh_token
        session.lastUsedAt = datetime.utcnow()
        db.commit()

        # Reset cookie
        response.set_cookie(
            key="refreshToken",
            value=new_refresh_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="strict",
            max_age=60 * 60 * 24 * settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during refresh: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session database lookup failed."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during refresh: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh operation failed."
        )

@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: DBSession = Depends(get_db)
):
    try:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            access_token = auth_header.split(" ")[1]
            
            # Deactivate session in database
            session = db.query(UserSession).filter(UserSession.token == access_token).first()
            if session:
                session.isActive = False
                db.commit()

        # Clear refresh token cookie
        response.delete_cookie(key="refreshToken")
        return {"detail": "Successfully logged out"}
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during logout: {e}")
        return {"detail": "Logged out locally"}
    except Exception as e:
        logger.error(f"Unexpected error during logout: {e}")
        return {"detail": "Logged out"}


@router.post("/forgot-password")
async def forgot_password(
    body: ForgotPasswordRequest,
    request: Request,
    db: DBSession = Depends(get_db)
):
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")
    email = body.email.lower().strip()
    if not settings.smtp_configured:
        raise HTTPException(status_code=503, detail="Password reset email is temporarily unavailable. Please try again later.")
    generic_response = {"success": True, "message": "If an account exists for this email, a password reset link has been sent."}
    
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return generic_response
        
        import secrets
        token = secrets.token_hex(32)
        expiry = datetime.utcnow() + timedelta(hours=1)
        
        user.resetToken = hashlib.sha256(token.encode()).hexdigest()
        user.resetTokenExpiry = expiry
        db.commit()
        
        try:
            await run_in_threadpool(send_password_reset_email, email, token)
        except EmailDeliveryError:
            # A slower failed delivery must not invalidate a newer reset request.
            db.query(User).filter(User.id == user.id, User.resetToken == hashlib.sha256(token.encode()).hexdigest()).update(
                {"resetToken": None, "resetTokenExpiry": None}, synchronize_session=False)
            db.commit()
            logger.warning("Password reset email delivery failed")
            raise HTTPException(status_code=503, detail="Password reset email is temporarily unavailable. Please try again later.")
        
        log_security_event(db, "password_reset_requested", "low", f"Password reset link generated for user: {user.email}", user_id=user.id, ip=ip, ua=ua)
        
        return generic_response
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during forgot-password request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error. Please try again."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during forgot-password request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred."
        )


@router.post("/reset-password")
async def reset_password(
    body: ResetPasswordRequest,
    request: Request,
    db: DBSession = Depends(get_db)
):
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")
    email = body.email.lower().strip()
    
    if body.newPassword != body.confirmPassword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )
        
    try:
        user = db.query(User).filter(User.email == email).first()
        token_hash = hashlib.sha256(body.token.encode()).hexdigest()
        if not user or not user.resetToken or not hmac.compare_digest(user.resetToken, token_hash):
            log_security_event(db, "password_reset_failed", "medium", f"Invalid reset token or email for: {email}", ip=ip, ua=ua)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token or email"
            )
            
        if not user.resetTokenExpiry or user.resetTokenExpiry < datetime.utcnow():
            log_security_event(db, "password_reset_failed", "medium", f"Expired reset token for: {email}", user_id=user.id, ip=ip, ua=ua)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token expired"
            )
            
        hashed_password = get_password_hash(body.newPassword)
        # Consume the token in the same transaction as the password/session update.
        # This also rejects a token consumed by another worker after the read above.
        updated = db.query(User).filter(
            User.id == user.id, User.resetToken == token_hash,
            User.resetTokenExpiry > datetime.utcnow()
        ).update({
            "password": hashed_password, "confirmpassword": hashed_password,
            "resetToken": None, "resetTokenExpiry": None,
            "lastPasswordChange": datetime.utcnow(), "passwordVersion": User.passwordVersion + 1,
        }, synchronize_session=False)
        if updated != 1:
            db.rollback()
            raise HTTPException(status_code=400, detail="Reset token expired or already used")
        db.query(UserSession).filter(UserSession.userId == user.id).update({"isActive": False})
        
        db.commit()
        
        log_security_event(db, "password_reset_success", "medium", f"Password reset successfully for user: {user.email}", user_id=user.id, ip=ip, ua=ua)
        
        return {"success": True, "message": "Password updated successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during reset-password: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error. Please try again."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during reset-password: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred."
        )


@router.get("/check-email")
async def check_email_get(
    email: str = Query(..., description="Email to check availability"),
    db: DBSession = Depends(get_db)
):
    email_clean = email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    return {
        "success": True,
        "exists": user is not None,
        "message": "Email is already registered" if user else "Email is available"
    }


@router.post("/check-email")
async def check_email_post(
    body: ForgotPasswordRequest,
    db: DBSession = Depends(get_db)
):
    email_clean = body.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    return {
        "success": True,
        "exists": user is not None,
        "message": "Email is already registered" if user else "Email is available"
    }

