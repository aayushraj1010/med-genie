from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    createdAt: datetime
    role: str

    class Config:
        from_attributes = True

# Health profile schemas
class HealthProfileUpdate(BaseModel):
    medicalHistory: Optional[str] = None
    lifestyle: Optional[str] = None
    symptoms: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None

class HealthProfileResponse(BaseModel):
    userId: int
    medicalHistory: Optional[str] = None
    lifestyle: Optional[str] = None
    symptoms: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None
    updatedAt: datetime

    class Config:
        from_attributes = True

# Chat schemas
class ChatMessageCreate(BaseModel):
    content: str
    isFollowUp: Optional[bool] = False
    metadata: Optional[str] = None

class ChatMessageResponse(BaseModel):
    id: int
    content: str
    sender: str
    timestamp: datetime
    isFollowUp: bool
    metadata: Optional[str] = Field(None, validation_alias="messageMetadata", serialization_alias="metadata")

    class Config:
        from_attributes = True

class ChatSessionCreate(BaseModel):
    title: Optional[str] = "New Chat Session"

class ChatSessionResponse(BaseModel):
    sessionId: str
    title: Optional[str]
    createdAt: datetime
    messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True

# Risk prediction features
class RiskFeatures(BaseModel):
    age: int = Field(..., ge=1, le=120)
    sex: int = Field(..., ge=0, le=1)  # 0: Female, 1: Male
    chest_pain_type: int = Field(..., ge=0, le=3) # 0-3 scale
    resting_bp: int = Field(..., ge=50, le=250)
    cholesterol: int = Field(..., ge=100, le=600)
    fasting_blood_sugar: int = Field(..., ge=0, le=1) # 0: <= 120 mg/dl, 1: > 120 mg/dl
    resting_ecg: int = Field(..., ge=0, le=2)
    max_heart_rate: int = Field(..., ge=60, le=220)
    exercise_angina: int = Field(..., ge=0, le=1) # 0: No, 1: Yes
    oldpeak: float = Field(..., ge=0.0, le=10.0)
    st_slope: int = Field(..., ge=0, le=2)

# Newsletter schema
class NewsletterSubscribe(BaseModel):
    email: EmailStr

# Contact form schema
class ContactForm(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=5000)

# Specialist recommendation request
class SpecialistRequest(BaseModel):
    symptoms: str = Field(..., min_length=1, max_length=2000)
    age: Optional[str] = None
    gender: Optional[str] = None
    severity: Optional[str] = "moderate"
    duration: Optional[str] = None
    medicalHistory: Optional[str] = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=64, max_length=64)
    email: EmailStr
    newPassword: str = Field(..., min_length=8)
    confirmPassword: str = Field(..., min_length=8)


