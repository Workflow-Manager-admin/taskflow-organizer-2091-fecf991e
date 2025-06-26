"""JWT utilities for user authentication with FastAPI."""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt


# SECRET_KEY and algorithm should be loaded via environment vars in a real app
SECRET_KEY = "change_this_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# PUBLIC_INTERFACE
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Generate a JWT token with an expiry."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# PUBLIC_INTERFACE
def decode_access_token(token: str):
    """Decode JWT, raise JWTError if invalid/expired."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise JWTError("Missing subject")
        return username
    except JWTError:
        return None
