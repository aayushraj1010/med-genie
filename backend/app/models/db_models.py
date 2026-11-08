from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(254), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    confirmpassword = Column(String(255), nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    lastLoginAt = Column(DateTime, nullable=True)
    isActive = Column(Boolean, default=True, index=True)
    role = Column(String(20), default="user", index=True)
    failedLoginAttempts = Column(Integer, default=0)
    lockedUntil = Column(DateTime, nullable=True)
    lastPasswordChange = Column(DateTime, default=datetime.utcnow)
    passwordVersion = Column(Integer, default=1)
    resetToken = Column(String(255), nullable=True)
    resetTokenExpiry = Column(DateTime, nullable=True)

    # Relationships
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    auditLogs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")
    healthProfile = relationship("HealthProfile", uselist=False, back_populates="user", cascade="all, delete-orphan")
    chatSessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String(100), primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token = Column(String(500), unique=True, index=True, nullable=False)
    refreshToken = Column(String(500), unique=True, index=True, nullable=False)
    expiresAt = Column(DateTime, index=True, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    lastUsedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ipAddress = Column(String(45), nullable=True)
    userAgent = Column(Text, nullable=True)
    isActive = Column(Boolean, default=True, index=True)

    # Relationships
    user = relationship("User", back_populates="sessions")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    userId = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    table = Column(String(50), nullable=False, index=True)
    details = Column(Text, nullable=True)
    ipAddress = Column(String(45), nullable=True, index=True)
    userAgent = Column(Text, nullable=True)
    query = Column(Text, nullable=True)
    params = Column(Text, nullable=True)
    duration = Column(Integer, nullable=True)  # Query duration in milliseconds
    success = Column(Boolean, default=True, index=True)
    error = Column(Text, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="auditLogs")


class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    userId = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    medicalHistory = Column(Text, nullable=True)
    lifestyle = Column(Text, nullable=True)
    symptoms = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    medications = Column(Text, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, index=True)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    isActive = Column(Boolean, default=True, index=True)

    # Relationships
    user = relationship("User", back_populates="healthProfile")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    userId = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    sessionId = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, index=True)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    isActive = Column(Boolean, default=True, index=True)

    # Relationships
    user = relationship("User", back_populates="chatSessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    sessionId = Column(Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    sender = Column(String(20), nullable=False, index=True) # 'user' or 'ai'
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    isFollowUp = Column(Boolean, default=False, index=True)
    messageMetadata = Column("metadata", Text, nullable=True) # JSON string for additional data

    # Relationships
    session = relationship("ChatSession", back_populates="messages")


class RateLimit(Base):
    __tablename__ = "rate_limits"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(200), unique=True, nullable=False)
    count = Column(Integer, default=1)
    resetTime = Column(DateTime, nullable=False, index=True)
    createdAt = Column(DateTime, default=datetime.utcnow, index=True)


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(100), nullable=False, index=True)
    severity = Column(String(20), nullable=False, index=True) # 'low', 'medium', 'high', 'critical'
    details = Column(Text, nullable=False)
    ipAddress = Column(String(45), nullable=True, index=True)
    userAgent = Column(Text, nullable=True)
    userId = Column(Integer, nullable=True)
    eventMetadata = Column("metadata", Text, nullable=True) # JSON string
    createdAt = Column(DateTime, default=datetime.utcnow, index=True)
    resolved = Column(Boolean, default=False, index=True)
    resolvedAt = Column(DateTime, nullable=True)
    resolvedBy = Column(Integer, nullable=True)


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(String(100), primary_key=True)
    name = Column(String(200), nullable=False)
    email = Column(String(254), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="received", index=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)


class NewsletterSubscription(Base):
    __tablename__ = "newsletter_subscriptions"

    id = Column(String(100), primary_key=True)
    email = Column(String(254), unique=True, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    active = Column(Boolean, default=True)
