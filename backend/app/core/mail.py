"""SMTP delivery. Never log message bodies, credentials or password-reset links."""
import smtplib
import ssl
from email.message import EmailMessage
from urllib.parse import urlencode

from app.core.config import settings


class EmailDeliveryError(Exception):
    pass


def send_password_reset_email(email: str, token: str) -> None:
    if not settings.smtp_configured:
        raise EmailDeliveryError("Email delivery is not configured")
    link = (settings.FRONTEND_URL.rstrip("/") + "/#/reset-password?" +
            urlencode({"token": token, "email": email}))
    message = EmailMessage()
    message["Subject"] = "Reset your Wellness password"
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = email
    message.set_content(
        "A password reset was requested for your Wellness account.\n\n"
        f"Open this link to choose a new password:\n{link}\n\n"
        "This link expires in one hour and can only be used once.\n"
        "If you did not request this, you can ignore this email."
    )
    transport = smtplib.SMTP_SSL if settings.SMTP_USE_SSL else smtplib.SMTP
    try:
        options = {"timeout": settings.SMTP_TIMEOUT_SECONDS}
        if settings.SMTP_USE_SSL:
            options["context"] = ssl.create_default_context()
        with transport(settings.SMTP_HOST, settings.SMTP_PORT, **options) as smtp:
            if settings.SMTP_USE_TLS:
                smtp.starttls(context=ssl.create_default_context())
            if settings.SMTP_USERNAME:
                smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            refused = smtp.send_message(message)
            if refused:
                raise EmailDeliveryError("Recipient was refused")
    except EmailDeliveryError:
        raise
    except (OSError, smtplib.SMTPException, ValueError) as from_error:
        raise EmailDeliveryError("Email delivery failed") from from_error
