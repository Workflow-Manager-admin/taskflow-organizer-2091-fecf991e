"""Pydantic schemas for task CRUD and status update."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# PUBLIC_INTERFACE
class TaskBase(BaseModel):
    """Base schema for a task."""

    title: str = Field(
        ..., max_length=256, description="Title of the task"
    )
    description: Optional[str] = Field(
        None, max_length=1024, description="Description of the task"
    )


# PUBLIC_INTERFACE
class TaskCreate(TaskBase):
    """Schema to create a new task."""
    pass


# PUBLIC_INTERFACE
class TaskUpdate(BaseModel):
    """Schema to update an existing task."""

    title: Optional[str] = Field(
        None, max_length=256, description="Updated title of the task"
    )
    description: Optional[str] = Field(
        None, max_length=1024, description="Updated description of the task"
    )
    completed: Optional[bool] = Field(
        None, description="Mark the task as completed or not"
    )


# PUBLIC_INTERFACE
class TaskOut(TaskBase):
    """Schema to return task info."""

    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
