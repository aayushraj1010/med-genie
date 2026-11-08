from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, profile, chat, risk, newsletter, contact, specialist, hospitals
from sqlalchemy import text
from fastapi.responses import JSONResponse

# Create tables in SQLite/Postgres on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS setup
origins = settings.CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secure Response Headers Middleware (Next.js Security Middleware matching)
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none'; base-uri 'self';"
    return response

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(risk.router, prefix=settings.API_V1_STR)
app.include_router(newsletter.router, prefix=settings.API_V1_STR)
app.include_router(contact.router, prefix=settings.API_V1_STR)
app.include_router(specialist.router, prefix=settings.API_V1_STR)
app.include_router(hospitals.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Wellness Python Backend"}


@app.get("/health/live", tags=["health"])
def liveness():
    return {"status": "ok", "version": settings.VERSION}


@app.get("/health/ready", tags=["health"])
def readiness():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception:
        return JSONResponse(status_code=503, content={"status": "unavailable", "database": "unavailable"})
    return {"status": "ready", "database": "ok", "ai_configured": bool(settings.gemini_api_key)}

