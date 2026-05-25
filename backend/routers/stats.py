from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from database import get_db
from models import Lead, Message, LeadStatus
from schemas import StatsOut

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)):
    """Return aggregate dashboard statistics."""
    total_leads = db.query(func.count(Lead.id)).scalar() or 0

    qualified_leads = (
        db.query(func.count(Lead.id))
        .filter(Lead.status == LeadStatus.qualified)
        .scalar()
    ) or 0

    # New leads created today (UTC)
    today_start = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    new_today = (
        db.query(func.count(Lead.id))
        .filter(Lead.created_at >= today_start)
        .scalar()
    ) or 0

    # Total outbound messages sent
    messages_sent = (
        db.query(func.count(Message.id))
        .filter(Message.direction == "outbound")
        .scalar()
    ) or 0

    return StatsOut(
        total_leads=total_leads,
        qualified_leads=qualified_leads,
        new_today=new_today,
        messages_sent=messages_sent,
    )
