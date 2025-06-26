"""User CRUD for user creation, lookup, and password handling."""

from sqlalchemy.orm import Session
from ..models.user import User
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# PUBLIC_INTERFACE
def get_user_by_username(db: Session, username: str):
    """Return User instance by username, or None if not found."""
    return db.query(User).filter(User.username == username).first()


# PUBLIC_INTERFACE
def create_user(db: Session, username: str, password: str):
    """Create a new user with a hashed password."""
    hashed_pw = pwd_context.hash(password)
    db_user = User(username=username, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# PUBLIC_INTERFACE
def verify_password(plain_password, hashed_password):
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)
