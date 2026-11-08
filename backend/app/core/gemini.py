"""Small provider boundary: structured responses and sanitized failure reasons."""
import logging
import httpx
from google import genai
from google.genai import types
from pydantic import BaseModel, Field, ValidationError
from app.core.config import settings

logger = logging.getLogger(__name__)


class HealthAnswer(BaseModel):
    answer: str = Field(min_length=1)
    followUpQuestion: str = ""


class GeminiUnavailable(Exception):
    def __init__(self, reason: str):
        self.reason = reason
        super().__init__(reason)


def generate_health_answer(prompt: str) -> HealthAnswer:
    if not settings.gemini_api_key:
        raise GeminiUnavailable("not_configured")
    try:
        with genai.Client(api_key=settings.gemini_api_key, http_options=types.HttpOptions(
            timeout=int(settings.GEMINI_TIMEOUT_SECONDS * 1000),
            retry_options=types.HttpRetryOptions(attempts=1),
        )) as client:
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json", response_schema=HealthAnswer,
                ),
            )
            if not response.text:
                raise GeminiUnavailable("empty_response")
            answer = HealthAnswer.model_validate_json(response.text)
            if not answer.answer.strip():
                raise GeminiUnavailable("invalid_response")
            return answer
    except GeminiUnavailable:
        raise
    except (httpx.TimeoutException, TimeoutError):
        raise GeminiUnavailable("timeout") from None
    except (ValidationError, ValueError, TypeError):
        raise GeminiUnavailable("invalid_response") from None
    except Exception as error:
        # Provider exceptions can contain request details: never log their text.
        logger.warning("Gemini request failed (%s)", type(error).__name__)
        raise GeminiUnavailable("service_unavailable") from None
