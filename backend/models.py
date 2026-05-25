from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    Enum as SAEnum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class LeadStatus(str, enum.Enum):
    new = "new"
    active = "active"
    qualified = "qualified"


class MessageDirection(str, enum.Enum):
    inbound = "inbound"
    outbound = "outbound"


class ReviewRequestStatus(str, enum.Enum):
    sent = "sent"
    failed = "failed"


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    status = Column(
        SAEnum(LeadStatus, values_callable=lambda x: [e.value for e in x]),
        default=LeadStatus.new,
        nullable=False,
    )
    source = Column(String, nullable=False, default="missed-call")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    messages = relationship("Message", back_populates="lead", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    direction = Column(
        SAEnum(MessageDirection, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    body = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    lead = relationship("Lead", back_populates="messages")


class ReviewRequest(Base):
    __tablename__ = "review_requests"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, nullable=False, index=True)
    customer_name = Column(String, nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(
        SAEnum(ReviewRequestStatus, values_callable=lambda x: [e.value for e in x]),
        default=ReviewRequestStatus.sent,
        nullable=False,
    )


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String, nullable=False, default="San Pedro Sport Fishing")
    google_review_link = Column(
        String,
        nullable=False,
        default="https://g.page/r/san-pedro-sport-fishing/review",
    )
    textback_message = Column(
        Text,
        nullable=False,
        default=(
            "Hey, this is San Pedro Sport Fishing! Sorry we missed you. "
            "What date are you looking to book a trip? We'd love to get you out on the water 🎣"
        ),
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
