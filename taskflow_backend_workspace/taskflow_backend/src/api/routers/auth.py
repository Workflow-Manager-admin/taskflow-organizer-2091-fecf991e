"""Authentication endpoints: register, login, and current user dependency."""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..schemas.user import UserCreate, UserOut, Token
from ..crud.user import get_user_by_username, create_user, verify_password
from ..auth.jwt import create_access_token, decode_access_token
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import os


# For simplicity using SQLite in-memory/FS, replace with production DB and config as needed
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
    if "sqlite" in SQLALCHEMY_DATABASE_URL
    else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
router = APIRouter(prefix="/api/auth", tags=["auth"])


# Dependency to provide DB session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# PUBLIC_INTERFACE
@router.post("/register", summary="Register a new user", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with a unique username and hashed password."""
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=409, detail="Username already registered")
    db_user = create_user(db, user.username, user.password)
    return db_user
# PUBLIC_INTERFACE
@router.post("/login", response_model=Token, summary="Login and get JWT token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Authenticate user, verify password, and return a JWT token."""
    db_user = get_user_by_username(db, form_data.username)
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": db_user.username})
    return Token(access_token=access_token, token_type="bearer")

# PUBLIC_INTERFACE



def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    """Dependency for protected endpoints: returns authenticated user or raises 401."""
    username = decode_access_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    db_user = get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return db_user
