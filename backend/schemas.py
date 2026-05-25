from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from models import LeadStatus, MessageDirection, ReviewRequestStatus


# ─── Message Schemas ───────────────────────────────────────────────────────────

class MessageBase(BaseModel):
    direction: MessageDirection
    body: str
    timestamp: datetime

    model_config = {"from_attributes": True}


class MessageOut(MessageBase):
    id: int
    lead_id: int


# ─── Lead Schemas ──────────────────────────────────────────────────────────────

class LeadBase(BaseModel):
    phone_number: str
    name: Optional[str] = None
    status: LeadStatus = LeadStatus.new
    source: str = "missed-call"


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[LeadStatus] = None


class LeadSummary(BaseModel):
    """Used in the leads list — includes message count and last message preview."""
    id: int
    phone_number: str
    name: Optional[str] = None
    status: LeadStatus
    source: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0
    last_message: Optional[str] = None

    model_config = {"from_attributes": True}


class LeadDetail(BaseModel):
    """Full lead detail including all messages."""
    id: int
    phone_number: str
    name: Optional[str] = None
    status: LeadStatus
    source: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageOut] = []

    model_config = {"from_attributes": True}


# ─── Stats Schemas ─────────────────────────────────────────────────────────────

class StatsOut(BaseModel):
    total_leads: int
    qualified_leads: int
    new_today: int
    messages_sent: int


# ─── Review Request Schemas ────────────────────────────────────────────────────

class ReviewRequestCreate(BaseModel):
    phone_number: str
    customer_name: str


class ReviewRequestOut(BaseModel):
    id: int
    phone_number: str
    customer_name: str
    sent_at: datetime
    status: ReviewRequestStatus

    model_config = {"from_attributes": True}


# ─── Settings Schemas ──────────────────────────────────────────────────────────

class SettingsOut(BaseModel):
    id: int
    business_name: str
    google_review_link: str
    textback_message: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SettingsUpdate(BaseModel):
    business_name: Optional[str] = None
    google_review_link: Optional[str] = None
    textback_message: Optional[str] = None


# ─── Webhook Schemas ───────────────────────────────────────────────────────────

class MissedCallWebhook(BaseModel):
    """Twilio voice webhook payload (form-encoded fields)."""
    CallStatus: Optional[str] = None
    From: Optional[str] = None
    To: Optional[str] = None
    CallSid: Optional[str] = None


class IncomingSmsWebhook(BaseModel):
    """Twilio SMS webhook payload (form-encoded fields)."""
    From: Optional[str] = None
    To: Optional[str] = None
    Body: Optional[str] = None
    MessageSid: Optional[str] = None
