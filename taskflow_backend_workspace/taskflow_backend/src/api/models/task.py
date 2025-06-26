"""Task ORM model (SQLAlchemy) for user tasks."""

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .user import Base

import datetime


# PUBLIC_INTERFACE
class Task(Base):
    """SQLAlchemy model for tasks owned by users."""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(256), nullable=False, index=True)
    description = Column(String(1024), nullable=True)
    completed = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False
    )

    # Relationship for easier user <-> task ORM queries
    owner = relationship("User", back_populates="tasks")
