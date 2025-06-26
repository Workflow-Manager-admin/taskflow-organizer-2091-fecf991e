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
    priority: Optional[str] = Field(
        "normal", description="Priority of the task ('low', 'normal', 'high')", max_length=16
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
    priority: Optional[str] = Field(
        None, description="Update the priority of the task", max_length=16
    )


# PUBLIC_INTERFACE
class TaskOut(TaskBase):
    """Schema to return task info."""

    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime
    priority: str

    class Config:
        orm_mode = True
