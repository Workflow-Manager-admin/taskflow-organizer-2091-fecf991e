"""User ORM model (SQLAlchemy) for authentication and user management."""

from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


# PUBLIC_INTERFACE
class User(Base):
    """SQLAlchemy model for user accounts."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)
