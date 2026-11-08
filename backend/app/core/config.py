from pydantic_settings import BaseSettings
from pydantic import model_validator
import secrets
from urllib.parse import urlsplit

class Settings(BaseSettings):
    PROJECT_NAME: str = "Wellness API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security
    ENVIRONMENT: str = "development"
    JWT_SECRET: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:9003", "http://localhost:9004", "http://127.0.0.1:9004"]
    COOKIE_SECURE: bool = False
    FRONTEND_URL: str = "http://localhost:9004"
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False
    SMTP_TIMEOUT_SECONDS: float = 10
    
    # Database
    DATABASE_URL: str = "sqlite:///./dev.db"
    
    # Gemini AI. GOOGLE_API_KEY was used by the legacy Next.js app, while
    # GOOGLE_AI_API_KEY is used by the FastAPI migration.
    GOOGLE_AI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.5-flash"
    GEMINI_TIMEOUT_SECONDS: float = 8

    @model_validator(mode="after")
    def validate_environment(self):
        if not self.GEMINI_MODEL.strip() or self.GEMINI_TIMEOUT_SECONDS <= 0:
            raise ValueError("Gemini requires a model name and a positive timeout")
        frontend_url = urlsplit(self.FRONTEND_URL)
        if frontend_url.scheme not in {"http", "https"} or not frontend_url.netloc or frontend_url.query or frontend_url.fragment:
            raise ValueError("FRONTEND_URL must be an HTTP(S) URL without query or fragment")
        if self.SMTP_USE_TLS and self.SMTP_USE_SSL:
            raise ValueError("Choose SMTP_USE_TLS or SMTP_USE_SSL, not both")
        if not 1 <= self.SMTP_PORT <= 65535 or self.SMTP_TIMEOUT_SECONDS <= 0:
            raise ValueError("Invalid SMTP port or timeout")
        if bool(self.SMTP_USERNAME) != bool(self.SMTP_PASSWORD):
            raise ValueError("SMTP_USERNAME and SMTP_PASSWORD must be configured together")
        if self.ENVIRONMENT not in {"development", "test", "production"}:
            raise ValueError("ENVIRONMENT must be development, test, or production")
        if self.ENVIRONMENT == "production":
            if frontend_url.scheme != "https":
                raise ValueError("Production requires an HTTPS FRONTEND_URL")
            if self.SMTP_HOST and not (self.SMTP_USE_TLS or self.SMTP_USE_SSL):
                raise ValueError("Production SMTP requires TLS or SSL")
            if len(self.JWT_SECRET) < 32 or self.JWT_SECRET == "super-secret-key-change-in-production":
                raise ValueError("Production requires a unique JWT_SECRET of at least 32 characters")
            if not self.COOKIE_SECURE:
                raise ValueError("Production requires COOKIE_SECURE=true")
            if not self.CORS_ORIGINS or any(origin == "*" or not origin.startswith("https://") for origin in self.CORS_ORIGINS):
                raise ValueError("Production requires explicit HTTPS CORS_ORIGINS")
        elif not self.JWT_SECRET:
            # Local sessions expire when the server restarts unless a secret is configured.
            self.JWT_SECRET = secrets.token_urlsafe(48)
        if self.ACCESS_TOKEN_EXPIRE_MINUTES <= 0 or self.REFRESH_TOKEN_EXPIRE_DAYS <= 0:
            raise ValueError("Token lifetimes must be positive")
        return self

    # OGD Hospital API (data.gov.in)
    API_SETU_KEY: str = ""

    @property
    def smtp_configured(self) -> bool:
        return bool(self.SMTP_HOST and self.SMTP_FROM_EMAIL)

    @property
    def gemini_api_key(self) -> str:
        return self.GOOGLE_AI_API_KEY or self.GOOGLE_API_KEY or self.GEMINI_API_KEY

    class Config:
        env_file = (".env", "backend/.env", "../.env")
        case_sensitive = True
        extra = "ignore"  # Allow extra env variables without failing validation

settings = Settings()
