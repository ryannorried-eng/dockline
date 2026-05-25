from fastapi import APIRouter, Depends, Form, HTTPException, Request
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
import logging

from database import get_db
from models import Lead, Message, LeadStatus, ReviewRequest, ReviewRequestStatus
from schemas import ReviewRequestCreate, ReviewRequestOut
from services.twilio_service import send_sms
from services.claude_service import get_ai_reply, check_lead_qualified, QUALIFIED_CONFIRMATION
from routers.settings import get_or_create_settings

logger = logging.getLogger(__name__)

router = APIRouter(tags=["webhooks"])


# ─── Helper: get or create a lead by phone number ─────────────────────────────

def _get_or_create_lead(db: Session, phone_number: str, source: str = "missed-call") -> Lead:
    lead = db.query(Lead).filter(Lead.phone_number == phone_number).first()
    if not lead:
        lead = Lead(phone_number=phone_number, source=source, status=LeadStatus.new)
        db.add(lead)
        db.commit()
        db.refresh(lead)
    return lead


def _save_message(db: Session, lead_id: int, direction: str, body: str) -> Message:
    msg = Message(lead_id=lead_id, direction=direction, body=body)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


# ─── Missed Call Webhook ───────────────────────────────────────────────────────

@router.post("/webhook/missed-call", response_class=PlainTextResponse)
async def missed_call_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Twilio voice webhook. When a call is not answered (no-answer or busy),
    send an automated text-back to the caller.

    Twilio sends form-encoded POST data; we parse it from the form body.
    """
    form_data = await request.form()
    call_status = form_data.get("CallStatus", "")
    from_number = form_data.get("From", "")
    to_number = form_data.get("To", "")

    logger.info(
        "Missed call webhook: status=%s from=%s to=%s",
        call_status,
        from_number,
        to_number,
    )

    # Only act on unanswered calls
    if call_status not in ("no-answer", "busy", "failed"):
        return PlainTextResponse("ok", status_code=200)

    if not from_number:
        return PlainTextResponse("no caller id", status_code=200)

    # Get current text-back message from settings
    settings = get_or_create_settings(db)
    textback = settings.textback_message

    # Create or fetch lead
    lead = _get_or_create_lead(db, from_number, source="missed-call")

    try:
        send_sms(to=from_number, body=textback)
        # Log outbound text-back message
        _save_message(db, lead.id, "outbound", textback)

        # Update lead status to active (conversation started)
        if lead.status == LeadStatus.new:
            lead.status = LeadStatus.active
            db.commit()

        logger.info("Text-back sent to %s", from_number)
    except Exception as e:
        logger.error("Failed to send text-back to %s: %s", from_number, e)

    # Return empty TwiML — we don't want Twilio to do anything else
    return PlainTextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        status_code=200,
        media_type="text/xml",
    )


# ─── Incoming SMS Webhook ──────────────────────────────────────────────────────

@router.post("/webhook/incoming-sms", response_class=PlainTextResponse)
async def incoming_sms_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Twilio SMS webhook. Receives inbound texts, passes them to Claude,
    and sends the AI reply back via Twilio.
    """
    form_data = await request.form()
    from_number = form_data.get("From", "")
    body = form_data.get("Body", "").strip()

    logger.info("Incoming SMS from %s: %s", from_number, body)

    if not from_number or not body:
        return PlainTextResponse("ok", status_code=200)

    # Get or create lead
    lead = _get_or_create_lead(db, from_number, source="inbound-sms")

    # Save the inbound message
    _save_message(db, lead.id, "inbound", body)

    # Update lead status to active if still new
    if lead.status == LeadStatus.new:
        lead.status = LeadStatus.active
        db.commit()
        db.refresh(lead)

    # Build conversation history for Claude (all prior messages)
    prior_messages = (
        db.query(Message)
        .filter(Message.lead_id == lead.id)
        .order_by(Message.timestamp)
        .all()
    )

    # Convert to Claude message format (exclude the message we just saved as it's the new one)
    history = []
    for msg in prior_messages[:-1]:  # exclude last (the one we just saved)
        role = "user" if msg.direction == "inbound" else "assistant"
        history.append({"role": role, "content": msg.body})

    # Get AI reply
    try:
        ai_reply = get_ai_reply(history, body)
    except Exception as e:
        logger.error("Claude API error for lead %s: %s", lead.id, e)
        ai_reply = (
            "Hey! Thanks for reaching out to San Pedro Sport Fishing. "
            "We'll have someone get back to you shortly 🎣"
        )

    # Check if lead is now qualified (only if not already qualified)
    if lead.status != LeadStatus.qualified:
        # Build full history including the latest exchange for qualification check
        full_history = list(history) + [
            {"role": "user", "content": body},
            {"role": "assistant", "content": ai_reply},
        ]
        try:
            is_qualified = check_lead_qualified(full_history)
        except Exception as e:
            logger.error("Qualification check error: %s", e)
            is_qualified = False

        if is_qualified:
            lead.status = LeadStatus.qualified
            db.commit()
            # Override AI reply with confirmation message
            ai_reply = QUALIFIED_CONFIRMATION

    # Send the AI reply via Twilio
    try:
        send_sms(to=from_number, body=ai_reply)
        _save_message(db, lead.id, "outbound", ai_reply)
        logger.info("AI reply sent to %s", from_number)
    except Exception as e:
        logger.error("Failed to send SMS reply to %s: %s", from_number, e)
        # Still save the intended reply for audit trail
        _save_message(db, lead.id, "outbound", f"[SEND FAILED] {ai_reply}")

    # Return empty TwiML
    return PlainTextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        status_code=200,
        media_type="text/xml",
    )


# ─── Review Request Endpoint ───────────────────────────────────────────────────

@router.post("/api/send-review-request", response_model=ReviewRequestOut)
def send_review_request(
    payload: ReviewRequestCreate,
    db: Session = Depends(get_db),
):
    """
    Send a Google review request SMS to a customer by name and phone number.
    """
    settings = get_or_create_settings(db)
    review_link = settings.google_review_link
    business_name = settings.business_name

    message_body = (
        f"Hey {payload.customer_name}, hope you had an amazing time out on the water today! "
        f"If you enjoyed the trip, we'd really appreciate a quick Google review — "
        f"it means the world to a small business like ours: {review_link}. "
        f"Thanks for fishing with us! 🎣"
    )

    status = ReviewRequestStatus.sent
    try:
        send_sms(to=payload.phone_number, body=message_body)
        logger.info("Review request sent to %s (%s)", payload.customer_name, payload.phone_number)
    except Exception as e:
        logger.error("Failed to send review request to %s: %s", payload.phone_number, e)
        status = ReviewRequestStatus.failed

    # Log to database regardless of send success
    review_req = ReviewRequest(
        phone_number=payload.phone_number,
        customer_name=payload.customer_name,
        status=status,
    )
    db.add(review_req)
    db.commit()
    db.refresh(review_req)
    return review_req
