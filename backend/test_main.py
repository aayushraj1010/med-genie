import os
import unittest
import warnings
import json
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock

# Never initialize the application's tracked development database in tests.
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["ENVIRONMENT"] = "test"

warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=UserWarning)

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.models.db_models import User, HealthProfile, ChatSession, ChatMessage, ContactSubmission
from app.core.security import get_password_hash
from app.api.risk import fallback_cardiac_risk
from app.schemas.pydantic_objs import RiskFeatures

# Isolate Test Database URL
TEST_DATABASE_URL = "sqlite:///./test_runtime.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Dependency override
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

class TestWellnessBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create test tables
        Base.metadata.create_all(bind=test_engine)

    @classmethod
    def tearDownClass(cls):
        # Drop test tables and clean up DB file
        Base.metadata.drop_all(bind=test_engine)
        test_engine.dispose()
        if os.path.exists("test_runtime.db"):
            try:
                os.remove("test_runtime.db")
            except Exception:
                pass

    def setUp(self):
        self.mail_mock = patch("app.api.auth.send_password_reset_email").start()
        self.addCleanup(patch.stopall)
        patch("app.api.auth.settings.SMTP_HOST", "smtp.example.com").start()
        patch("app.api.auth.settings.SMTP_FROM_EMAIL", "noreply@example.com").start()
        self.client = TestClient(app)
        self.db = TestingSessionLocal()
        # Clean data before each test
        for table in reversed(Base.metadata.sorted_tables):
            self.db.execute(table.delete())
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Welcome to Wellness Python Backend"})

    def test_fallback_risk_calculator(self):
        # High-risk features setup
        high_risk_features = RiskFeatures(
            age=72,
            sex=1,
            chest_pain_type=2,
            resting_bp=165,
            cholesterol=280,
            fasting_blood_sugar=1,
            resting_ecg=1,
            max_heart_rate=110,
            exercise_angina=1,
            oldpeak=2.5,
            st_slope=1
        )
        result = fallback_cardiac_risk(high_risk_features)
        self.assertIn("risk_probability", result)
        self.assertIn("risk_predicted", result)
        self.assertGreater(result["risk_probability"], 0.5)
        self.assertEqual(result["risk_predicted"], 1)

        # Low-risk features setup
        low_risk_features = RiskFeatures(
            age=22,
            sex=0,
            chest_pain_type=0,
            resting_bp=110,
            cholesterol=150,
            fasting_blood_sugar=0,
            resting_ecg=0,
            max_heart_rate=175,
            exercise_angina=0,
            oldpeak=0.0,
            st_slope=2
        )
        low_result = fallback_cardiac_risk(low_risk_features)
        self.assertLess(low_result["risk_probability"], 0.4)
        self.assertEqual(low_result["risk_predicted"], 0)

    def test_user_registration_and_login(self):
        # Register new user
        reg_payload = {
            "name": "John Doe",
            "email": "john@example.com",
            "password": "strongpassword123"
        }
        response = self.client.post("/api/auth/register", json=reg_payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["email"], "john@example.com")

        # Duplicate register error
        response = self.client.post("/api/auth/register", json=reg_payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("already exists", response.json()["detail"])

        # Login successful
        login_payload = {
            "email": "john@example.com",
            "password": "strongpassword123"
        }
        response = self.client.post("/api/auth/login", json=login_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertIn("refresh_token", data)

        # Login failed invalid credentials
        login_payload = {
            "email": "john@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post("/api/auth/login", json=login_payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Incorrect email", response.json()["detail"])

    def test_user_profile(self):
        # Set up a test user
        hashed = get_password_hash("password123")
        user = User(name="Jane Doe", email="jane@example.com", password=hashed, confirmpassword=hashed)
        self.db.add(user)
        self.db.commit()

        # Login to get token
        login_response = self.client.post("/api/auth/login", json={"email": "jane@example.com", "password": "password123"})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # GET Profile
        response = self.client.get("/api/user/profile", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Jane Doe")
        self.assertEqual(response.json()["healthProfile"]["medicalHistory"], "")

        # UPDATE Profile
        update_data = {
            "medicalHistory": "Hypertension, Asthma",
            "lifestyle": "Non-smoker, active",
            "symptoms": "Chest pain on exertion",
            "allergies": "Penicillin",
            "medications": "Albuterol inhaler"
        }
        response = self.client.put("/api/user/profile", json=update_data, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["healthProfile"]["medicalHistory"], "Hypertension, Asthma")

        # GET Profile again to confirm update
        response = self.client.get("/api/user/profile", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["healthProfile"]["lifestyle"], "Non-smoker, active")

    def test_heart_risk_prediction(self):
        # Set up a test user
        hashed = get_password_hash("password123")
        user = User(name="Jane Doe", email="jane@example.com", password=hashed, confirmpassword=hashed)
        self.db.add(user)
        self.db.commit()

        # Login to get token
        login_response = self.client.post("/api/auth/login", json={"email": "jane@example.com", "password": "password123"})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        features = {
            "age": 55,
            "sex": 1,
            "chest_pain_type": 2,
            "resting_bp": 130,
            "cholesterol": 220,
            "fasting_blood_sugar": 0,
            "resting_ecg": 1,
            "max_heart_rate": 150,
            "exercise_angina": 0,
            "oldpeak": 1.2,
            "st_slope": 1
        }
        response = self.client.post("/api/risk/predict", json=features, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("risk_predicted", response.json())
        self.assertIn("risk_probability", response.json())

    @patch("app.core.gemini.settings.GOOGLE_AI_API_KEY", "test-key-not-real")
    @patch("app.core.gemini.genai.Client")
    def test_chat_flow(self, mock_generative_model):
        # Set up a test user
        hashed = get_password_hash("password123")
        user = User(name="Jane Doe", email="jane@example.com", password=hashed, confirmpassword=hashed)
        self.db.add(user)
        self.db.commit()

        # Login to get token
        login_response = self.client.post("/api/auth/login", json={"email": "jane@example.com", "password": "password123"})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Mock Gemini response
        mock_model_instance = MagicMock()
        mock_response = MagicMock()
        mock_response.candidates = [
            MagicMock(
                content=MagicMock(
                    parts=[MagicMock(text='{"answer": "Based on history, seek medical attention.", "followUpQuestion": "Do you have dizziness?"}')]
                )
            )
        ]
        mock_response.text = '{"answer": "Based on history, seek medical attention.", "followUpQuestion": "Do you have dizziness?"}'
        mock_model_instance.generate_content.return_value = mock_response
        mock_generative_model.return_value.__enter__.return_value.models = mock_model_instance

        # Create session
        sess_response = self.client.post("/api/chat/sessions", json={"title": "Test Chat"}, headers=headers)
        self.assertEqual(sess_response.status_code, 200)
        session_id = sess_response.json()["sessionId"]

        # List sessions
        list_response = self.client.get("/api/chat/sessions", headers=headers)
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()), 1)

        # Send message
        msg_payload = {"content": "I have chest tightness", "isFollowUp": False}
        msg_response = self.client.post(f"/api/chat/sessions/{session_id}/messages", json=msg_payload, headers=headers)
        self.assertEqual(msg_response.status_code, 200)
        self.assertEqual(msg_response.json()["answer"], "Based on history, seek medical attention.")
        self.assertEqual(msg_response.json()["followUpQuestion"], "Do you have dizziness?")
        self.assertEqual(msg_response.json()["source"], "gemini")

    def test_logout(self):
        # Set up a test user
        hashed = get_password_hash("password123")
        user = User(name="Jane Doe", email="jane@example.com", password=hashed, confirmpassword=hashed)
        self.db.add(user)
        self.db.commit()

        # Login to get token
        login_response = self.client.post("/api/auth/login", json={"email": "jane@example.com", "password": "password123"})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Logout
        response = self.client.post("/api/auth/logout", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["detail"], "Successfully logged out")

    def test_newsletter_subscribe(self):
        # First subscription
        response = self.client.post("/api/newsletter/subscribe", json={"email": "test@newsletter.com"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("Successfully subscribed", response.json()["message"])

        # Duplicate subscription
        response = self.client.post("/api/newsletter/subscribe", json={"email": "test@newsletter.com"})
        self.assertEqual(response.status_code, 409)
        self.assertIn("already subscribed", response.json()["detail"])

    def test_contact_form(self):
        # Valid submission
        response = self.client.post("/api/contact", json={
            "name": "John Doe",
            "email": "john@example.com",
            "message": "This is a test message that is long enough."
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

        # Invalid — message too short
        response = self.client.post("/api/contact", json={
            "name": "John",
            "email": "john@example.com",
            "message": "Hi"
        })
        self.assertEqual(response.status_code, 422)  # Pydantic validation error

    def test_specialist_recommendation(self):
        # Chest pain → cardiologist
        response = self.client.post("/api/specialist/recommend", json={
            "symptoms": "I have chest pain and heart palpitations",
            "age": "45",
            "gender": "male",
            "severity": "moderate"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("recommendations", data)
        self.assertGreater(len(data["recommendations"]), 0)
        specialties = [r["specialty"] for r in data["recommendations"]]
        self.assertIn("Cardiologist", specialties)

        # No symptoms → 422
        response = self.client.post("/api/specialist/recommend", json={
            "symptoms": ""
        })
        self.assertEqual(response.status_code, 422)

        # Unknown symptoms → fallback to Primary Care
        response = self.client.post("/api/specialist/recommend", json={
            "symptoms": "general body pain that is hard to categorize"
        })
        self.assertEqual(response.status_code, 200)
        specialties = [r["specialty"] for r in response.json()["recommendations"]]
        self.assertIn("Primary Care Physician", specialties)

    def test_check_email_endpoints(self):
        # Setup user
        hashed = get_password_hash("password123")
        user = User(name="Test Check", email="check@example.com", password=hashed, confirmpassword=hashed)
        self.db.add(user)
        self.db.commit()

        # Test GET check-email exists
        response = self.client.get("/api/auth/check-email?email=check@example.com")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["exists"])

        # Test GET check-email does not exist
        response = self.client.get("/api/auth/check-email?email=notexists@example.com")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["exists"])

        # Test POST check-email exists
        response = self.client.post("/api/auth/check-email", json={"email": "check@example.com"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["exists"])

    def test_forgot_and_reset_password_flow(self):
        # Setup user
        hashed = get_password_hash("password123")
        user = User(name="Reset User", email="reset@example.com", password=hashed, confirmpassword=hashed)
        self.db.add(user)
        self.db.commit()

        # Test forgot password (valid email)
        response = self.client.post("/api/auth/forgot-password", json={"email": "reset@example.com"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("If an account exists", response.json()["message"])

        # Retrieve user reset token from DB
        updated_user = self.db.query(User).filter(User.email == "reset@example.com").first()
        self.assertIsNotNone(updated_user.resetToken)
        self.assertIsNotNone(updated_user.resetTokenExpiry)
        token = self.mail_mock.call_args.args[1]
        self.assertNotEqual(updated_user.resetToken, token)

        # Test reset password (mismatch new/confirm passwords)
        reset_payload_mismatch = {
            "token": token,
            "email": "reset@example.com",
            "newPassword": "newpassword123",
            "confirmPassword": "mismatchpassword"
        }
        response = self.client.post("/api/auth/reset-password", json=reset_payload_mismatch)
        self.assertEqual(response.status_code, 400)
        self.assertIn("match", response.json()["detail"])

        # Test reset password (success)
        reset_payload_success = {
            "token": token,
            "email": "reset@example.com",
            "newPassword": "newpassword123",
            "confirmPassword": "newpassword123"
        }
        response = self.client.post("/api/auth/reset-password", json=reset_payload_success)
        self.assertEqual(response.status_code, 200)
        self.assertIn("success", response.json()["message"])

        # Verify password is updated & login with new password works
        login_payload = {
            "email": "reset@example.com",
            "password": "newpassword123"
        }
        response = self.client.post("/api/auth/login", json=login_payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json())

    def test_chat_session_messages_and_deletion(self):
        # Setup user and auth
        hashed = get_password_hash("password123")
        user = User(name="Chat User", email="chat_user@example.com", password=hashed, confirmpassword=hashed)
        self.db.add(user)
        self.db.commit()

        login_response = self.client.post("/api/auth/login", json={"email": "chat_user@example.com", "password": "password123"})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create session
        sess_response = self.client.post("/api/chat/sessions", json={"title": "Session to be deleted"}, headers=headers)
        session_id = sess_response.json()["sessionId"]

        # Insert a mock message directly in DB for this session
        chat_sess = self.db.query(ChatSession).filter(ChatSession.sessionId == session_id).first()
        msg = ChatMessage(sessionId=chat_sess.id, content="Hello World", sender="user")
        self.db.add(msg)
        self.db.commit()

        # Test GET /api/chat/sessions/{session_id}/messages
        response = self.client.get(f"/api/chat/sessions/{session_id}/messages", headers=headers)
        self.assertEqual(response.status_code, 200)
        messages = response.json()
        self.assertEqual(len(messages), 1)
        self.assertEqual(messages[0]["content"], "Hello World")

        # Test DELETE /api/chat/sessions/{session_id}
        response = self.client.delete(f"/api/chat/sessions/{session_id}", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

        # Verify session is no longer in listed active sessions
        list_response = self.client.get("/api/chat/sessions", headers=headers)
        self.assertEqual(len(list_response.json()), 0)

    def test_aligned_hospitals_and_specialists_endpoints(self):
        # Test new aligned hospital path
        response = self.client.get("/api/nearby-hospitals?state=Karnataka")
        self.assertEqual(response.status_code, 200)
        self.assertIn("hospitals", response.json())
        self.assertGreater(len(response.json()["hospitals"]), 0)

        # Test new aligned specialist path
        response = self.client.post("/api/specialist-recommendation", json={
            "symptoms": "chest pain",
            "age": "50",
            "gender": "male"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("recommendations", response.json())
        specialties = [r["specialty"] for r in response.json()["recommendations"]]
        self.assertIn("Cardiologist", specialties)


    def _login_tokens(self):
        response = self.client.post("/api/auth/register", json={
            "name": "Security Test", "email": "security@example.com", "password": "strongpassword123"
        })
        self.assertEqual(response.status_code, 200)
        response = self.client.post("/api/auth/login", json={
            "email": "security@example.com", "password": "strongpassword123"
        })
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_refresh_rotation_rejects_replay(self):
        tokens = self._login_tokens()
        self.client.cookies.clear()
        response = self.client.post("/api/auth/refresh", headers={"Authorization": f"Bearer {tokens['refresh_token']}"})
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.json()["refresh_token"], tokens["refresh_token"])
        self.client.cookies.clear()
        replay = self.client.post("/api/auth/refresh", headers={"Authorization": f"Bearer {tokens['refresh_token']}"})
        self.assertEqual(replay.status_code, 401)
        old_access = self.client.get("/api/user/profile", headers={"Authorization": f"Bearer {tokens['access_token']}"})
        self.assertEqual(old_access.status_code, 401)

    def test_repeated_logins_create_distinct_sessions(self):
        first = self._login_tokens()
        second = self.client.post("/api/auth/login", json={
            "email": "security@example.com", "password": "strongpassword123"
        })
        self.assertEqual(second.status_code, 200)
        self.assertNotEqual(first["access_token"], second.json()["access_token"])
        self.assertNotEqual(first["refresh_token"], second.json()["refresh_token"])

    @patch("app.core.gemini.settings.GOOGLE_AI_API_KEY", "test-key-not-real")
    @patch("app.core.gemini.genai.Client")
    def test_invalid_ai_response_uses_fallback(self, mock_model):
        tokens = self._login_tokens()
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        session = self.client.post("/api/chat/sessions", json={"title": "Invalid AI"}, headers=headers).json()
        response = MagicMock()
        response.candidates = [MagicMock()]
        for invalid in ['not json', '[]', '{"answer": null}', '{"answer": "ok", "followUpQuestion": []}']:
            response.text = invalid
            mock_model.return_value.__enter__.return_value.models.generate_content.return_value = response
            result = self.client.post(f"/api/chat/sessions/{session['sessionId']}/messages",
                                      json={"content": "test question", "isFollowUp": False}, headers=headers)
            self.assertEqual(result.status_code, 200)
            self.assertIn("trouble connecting", result.json()["answer"])
            self.assertEqual(result.json()["source"], "local_fallback")
            self.assertEqual(result.json()["fallbackReason"], "invalid_response")

    def test_unconfigured_ai_fallback_status_survives_history(self):
        from app.core.gemini import settings
        tokens = self._login_tokens()
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        session = self.client.post("/api/chat/sessions", json={"title": "Offline"}, headers=headers).json()
        with patch.object(settings, "GOOGLE_AI_API_KEY", ""), patch.object(settings, "GOOGLE_API_KEY", ""), patch.object(settings, "GEMINI_API_KEY", ""):
            response = self.client.post(f"/api/chat/sessions/{session['sessionId']}/messages",
                                        json={"content": "test question"}, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["source"], "local_fallback")
        self.assertEqual(response.json()["fallbackReason"], "not_configured")
        history = self.client.get(f"/api/chat/sessions/{session['sessionId']}/messages", headers=headers).json()
        metadata = json.loads(history[-1]["metadata"])
        self.assertEqual(metadata["source"], "local_fallback")

    @patch("app.core.gemini.settings.GOOGLE_AI_API_KEY", "test-key-not-real")
    @patch("app.core.gemini.genai.Client")
    def test_provider_timeout_is_sanitized(self, mock_client):
        from app.core.gemini import generate_health_answer, GeminiUnavailable
        import httpx
        mock_client.return_value.__enter__.return_value.models.generate_content.side_effect = httpx.ReadTimeout("private provider details")
        with self.assertRaises(GeminiUnavailable) as result:
            generate_health_answer("test")
        self.assertEqual(result.exception.reason, "timeout")
        self.assertNotIn("private", str(result.exception))

    def test_password_reset_revokes_existing_sessions(self):
        tokens = self._login_tokens()
        self.client.post("/api/auth/forgot-password", json={"email": "security@example.com"})
        user = self.db.query(User).filter(User.email == "security@example.com").first()
        response = self.client.post("/api/auth/reset-password", json={
            "email": user.email, "token": self.mail_mock.call_args.args[1],
            "newPassword": "newpassword123", "confirmPassword": "newpassword123"
        })
        self.assertEqual(response.status_code, 200)
        response = self.client.get("/api/user/profile", headers={"Authorization": f"Bearer {tokens['access_token']}"})
        self.assertEqual(response.status_code, 401)
        self.client.cookies.clear()
        response = self.client.post("/api/auth/refresh", headers={"Authorization": f"Bearer {tokens['refresh_token']}"})
        self.assertEqual(response.status_code, 401)

    def test_refresh_rejects_deactivated_user(self):
        tokens = self._login_tokens()
        user = self.db.query(User).filter(User.email == "security@example.com").first()
        user.isActive = False
        self.db.commit()
        response = self.client.post("/api/auth/refresh", headers={"Authorization": f"Bearer {tokens['refresh_token']}"})
        self.assertEqual(response.status_code, 401)

    def test_missing_auth_returns_401(self):
        self.assertEqual(self.client.get("/api/user/profile").status_code, 401)

    def test_health_endpoints(self):
        self.assertEqual(self.client.get("/health/live").json()["status"], "ok")
        self.assertEqual(self.client.get("/health/ready").status_code, 200)
        with patch("app.main.engine.connect", side_effect=RuntimeError("database offline")):
            response = self.client.get("/health/ready")
        self.assertEqual(response.status_code, 503)
        self.assertNotIn("database offline", response.text)

    def test_production_config_rejects_unsafe_defaults(self):
        from app.core.config import Settings
        from pydantic import ValidationError
        with self.assertRaises(ValidationError):
            Settings(_env_file=None, ENVIRONMENT="production", JWT_SECRET="")
        config = Settings(_env_file=None, ENVIRONMENT="production", JWT_SECRET="x" * 48,
                          COOKIE_SECURE=True, CORS_ORIGINS=["https://app.example.com"],
                          FRONTEND_URL="https://app.example.com")
        self.assertTrue(config.COOKIE_SECURE)

    def test_reset_delivery_failure_clears_token(self):
        from app.core.mail import EmailDeliveryError
        self._login_tokens()
        self.mail_mock.side_effect = EmailDeliveryError("SMTP unavailable")
        result = self.client.post("/api/auth/forgot-password", json={"email": "security@example.com"})
        self.assertEqual(result.status_code, 503)
        user = self.db.query(User).filter(User.email == "security@example.com").first()
        self.assertIsNone(user.resetToken)
        self.assertIsNone(user.resetTokenExpiry)
        self.assertNotIn("SMTP unavailable", result.text)

    def test_forgot_password_unknown_account_has_same_response(self):
        self._login_tokens()
        known = self.client.post("/api/auth/forgot-password", json={"email": "security@example.com"})
        unknown = self.client.post("/api/auth/forgot-password", json={"email": "unknown@example.com"})
        self.assertEqual(known.json(), unknown.json())
        self.assertEqual(unknown.status_code, 200)
        self.mail_mock.assert_called_once()

    def test_missing_smtp_does_not_claim_delivery(self):
        with patch("app.api.auth.settings.SMTP_HOST", ""):
            response = self.client.post("/api/auth/forgot-password", json={"email": "unknown@example.com"})
        self.assertEqual(response.status_code, 503)
        self.mail_mock.assert_not_called()

    def test_reset_token_is_single_use_and_expires(self):
        self._login_tokens()
        self.client.post("/api/auth/forgot-password", json={"email": "security@example.com"})
        payload = {"email": "security@example.com", "token": self.mail_mock.call_args.args[1],
                   "newPassword": "newpassword123", "confirmPassword": "newpassword123"}
        self.assertEqual(self.client.post("/api/auth/reset-password", json=payload).status_code, 200)
        self.assertEqual(self.client.post("/api/auth/reset-password", json=payload).status_code, 400)
        self.client.post("/api/auth/forgot-password", json={"email": "security@example.com"})
        payload["token"] = self.mail_mock.call_args.args[1]
        user = self.db.query(User).filter(User.email == "security@example.com").first()
        user.resetTokenExpiry = datetime.utcnow() - timedelta(minutes=1)
        self.db.commit()
        self.assertEqual(self.client.post("/api/auth/reset-password", json=payload).status_code, 400)

    def test_contact_submission_is_persisted(self):
        response = self.client.post("/api/contact", json={
            "name": " Test User ", "email": "test@example.com", "message": " Please help with my account. "})
        self.assertEqual(response.status_code, 200)
        submission = self.db.query(ContactSubmission).filter_by(id=response.json()["submissionId"]).one()
        self.assertEqual(submission.name, "Test User")
        self.assertEqual(submission.message, "Please help with my account.")
        self.assertEqual(submission.status, "received")

    def test_contact_database_failure_returns_error(self):
        with patch("sqlalchemy.orm.Session.commit", side_effect=SQLAlchemyError()):
            response = self.client.post("/api/contact", json={
                "name": "Test User", "email": "test@example.com", "message": "Please help with my account."})
        self.assertEqual(response.status_code, 503)

    def test_smtp_transport_and_reset_link(self):
        from app.core.mail import send_password_reset_email
        from urllib.parse import urlsplit, parse_qs
        with patch("app.core.mail.smtplib.SMTP") as transport:
            smtp = transport.return_value.__enter__.return_value
            smtp.send_message.return_value = {}
            send_password_reset_email("user+tag@example.com", "a" * 64)
            smtp.starttls.assert_called_once()
            message = smtp.send_message.call_args.args[0]
            self.assertEqual(message["To"], "user+tag@example.com")
            link = next(line for line in message.get_content().splitlines() if line.startswith("http"))
            fragment = urlsplit(link).fragment
            self.assertTrue(fragment.startswith("/reset-password?"))
            self.assertEqual(parse_qs(fragment.split("?", 1)[1])["email"], ["user+tag@example.com"])


if __name__ == "__main__":
    unittest.main()


