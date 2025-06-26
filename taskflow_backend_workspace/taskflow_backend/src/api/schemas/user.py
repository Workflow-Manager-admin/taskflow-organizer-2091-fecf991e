"""Pydantic schemas for user registration, login, and user representation."""

from pydantic import BaseModel, Field


# PUBLIC_INTERFACE
class UserCreate(BaseModel):
    """Schema for registering a new user."""
    username: str = Field(
        ..., min_length=3, max_length=64, description="The new user's username"
    )
    password: str = Field(
        ..., min_length=6, max_length=128, description="Password for registration"
    )


# PUBLIC_INTERFACE
class UserLogin(BaseModel):
    """Schema for user login request."""
    username: str = Field(..., description="User's username")
    password: str = Field(..., description="User's password")


# PUBLIC_INTERFACE
class UserOut(BaseModel):
    """Schema for returning user info (without sensitive data)."""
    id: int
    username: str

    class Config:
        orm_mode = True


# PUBLIC_INTERFACE
class Token(BaseModel):
    """Schema for a JWT access token."""
    access_token: str
    token_type: str = "bearer"
