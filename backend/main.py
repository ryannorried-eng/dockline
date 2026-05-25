from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from dotenv import load_dotenv

from database import engine, Base, SessionLocal
from models import Settings  # noqa: F401 — import to register model before create_all

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Import all models so create_all picks them up
from models import Lead, Message, ReviewRequest, Settings  # noqa: F401

# Create tables
Base.metadata.create_all(bind=engine)

# Seed default settings on startup
from routers.settings import get_or_create_settings

with SessionLocal() as session:
    get_or_create_settings(session)
    logger.info("Settings seeded / verified.")

# Import routers after models are ready
from routers import leads, stats, settings as settings_router, webhooks

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(
    title="Dockline API",
    description="Lead capture and AI response system for coastal marine businesses.",
    version="1.0.0",
)

# CORS — allow the Next.js frontend to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(leads.router)
app.include_router(stats.router)
app.include_router(settings_router.router)
app.include_router(webhooks.router)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "service": "Dockline API", "version": "1.0.0"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "healthy"}
