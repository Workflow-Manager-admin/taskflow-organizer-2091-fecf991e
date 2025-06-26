"""User ORM model (SQLAlchemy) for authentication and user management."""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

# Share Base across all models to simplify table initialization
Base = declarative_base()


# PUBLIC_INTERFACE
class User(Base):
    """SQLAlchemy model for user accounts."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)

    # Define relationship to Task for easy user.tasks access
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
