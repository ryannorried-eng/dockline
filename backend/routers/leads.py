from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from database import get_db
from models import Lead, Message, LeadStatus
from schemas import LeadSummary, LeadDetail, LeadUpdate

router = APIRouter(prefix="/api/leads", tags=["leads"])


@router.get("", response_model=List[LeadSummary])
def list_leads(db: Session = Depends(get_db)):
    """Return all leads sorted by created_at desc, with message count and last message."""
    leads = db.query(Lead).order_by(desc(Lead.created_at)).all()

    result = []
    for lead in leads:
        # Get message count and last message body
        msg_count = (
            db.query(func.count(Message.id))
            .filter(Message.lead_id == lead.id)
            .scalar()
        ) or 0

        last_msg = (
            db.query(Message)
            .filter(Message.lead_id == lead.id)
            .order_by(desc(Message.timestamp))
            .first()
        )

        result.append(
            LeadSummary(
                id=lead.id,
                phone_number=lead.phone_number,
                name=lead.name,
                status=lead.status,
                source=lead.source,
                created_at=lead.created_at,
                updated_at=lead.updated_at,
                message_count=msg_count,
                last_message=last_msg.body[:80] if last_msg else None,
            )
        )
    return result


@router.get("/{lead_id}", response_model=LeadDetail)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """Return full lead detail including all messages."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.patch("/{lead_id}", response_model=LeadDetail)
def update_lead(lead_id: int, updates: LeadUpdate, db: Session = Depends(get_db)):
    """Manually update a lead's name or status."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if updates.name is not None:
        lead.name = updates.name
    if updates.status is not None:
        lead.status = updates.status

    db.commit()
    db.refresh(lead)
    return lead
