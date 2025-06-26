"""Database setup, engine, and table creation logic for ORM models."""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .user import Base  # Shares Base with user/task

# Use environment variable or fallback SQLite DB
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./test.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
    if "sqlite" in SQLALCHEMY_DATABASE_URL
    else {},
)

# SessionLocal for dependency injection (FastAPI usage)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# PUBLIC_INTERFACE


def init_db():
    """Create database tables for all models."""
    Base.metadata.create_all(bind=engine)
