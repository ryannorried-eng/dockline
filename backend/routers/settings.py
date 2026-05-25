from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Settings
from schemas import SettingsOut, SettingsUpdate

router = APIRouter(prefix="/api/settings", tags=["settings"])

# Default seed values for San Pedro Sport Fishing
DEFAULTS = {
    "business_name": "San Pedro Sport Fishing",
    "google_review_link": "https://g.page/r/san-pedro-sport-fishing/review",
    "textback_message": (
        "Hey, this is San Pedro Sport Fishing! Sorry we missed you. "
        "What date are you looking to book a trip? We'd love to get you out on the water 🎣"
    ),
}


def get_or_create_settings(db: Session) -> Settings:
    """Return the single settings record, creating it with defaults if absent."""
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings(**DEFAULTS)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("", response_model=SettingsOut)
def get_settings(db: Session = Depends(get_db)):
    """Return current settings, seeding defaults on first call."""
    return get_or_create_settings(db)


@router.patch("", response_model=SettingsOut)
def update_settings(updates: SettingsUpdate, db: Session = Depends(get_db)):
    """Update one or more settings fields. Creates defaults if no record exists."""
    settings = get_or_create_settings(db)

    if updates.business_name is not None:
        settings.business_name = updates.business_name
    if updates.google_review_link is not None:
        settings.google_review_link = updates.google_review_link
    if updates.textback_message is not None:
        settings.textback_message = updates.textback_message

    db.commit()
    db.refresh(settings)
    return settings
