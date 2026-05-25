import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")


def get_twilio_client() -> Client:
    """Return a configured Twilio REST client."""
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        raise EnvironmentError(
            "TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in environment."
        )
    return Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_sms(to: str, body: str) -> str:
    """
    Send an outbound SMS via Twilio.

    Args:
        to: Recipient phone number in E.164 format (e.g. +13105551234)
        body: Message body

    Returns:
        Twilio message SID
    """
    if not TWILIO_PHONE_NUMBER:
        raise EnvironmentError("TWILIO_PHONE_NUMBER must be set in environment.")

    client = get_twilio_client()
    message = client.messages.create(
        body=body,
        from_=TWILIO_PHONE_NUMBER,
        to=to,
    )
    return message.sid
