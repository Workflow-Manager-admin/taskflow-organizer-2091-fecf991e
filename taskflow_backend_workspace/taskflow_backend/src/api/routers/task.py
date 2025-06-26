"""Task management endpoints: CRUD and status toggle, protected by JWT user authentication.

All responses and requests are user-scoped.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.task import TaskOut, TaskCreate, TaskUpdate
from ..crud.task import (
    get_tasks_for_user,
    get_task_by_id,
    create_task,
    update_task,
    delete_task,
    toggle_task_status,
)
from ..routers.auth import get_current_user, get_db
from ..models.user import User

router = APIRouter(
    prefix="/api/tasks",
    tags=["tasks"],
)


# PUBLIC_INTERFACE
@router.get(
    "/",
    response_model=list[TaskOut],
    summary="Get all my tasks",
    description="Return all tasks for the authenticated user, newest first.",
)
def list_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all tasks belonging to current user."""
    return get_tasks_for_user(db, user_id=current_user.id)


# PUBLIC_INTERFACE
@router.get(
    "/{task_id}",
    response_model=TaskOut,
    summary="Get task by id",
    description="Return a single task (belonging to current user) by ID",
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get details of a specific user-owned task."""
    db_task = get_task_by_id(db, current_user.id, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


# PUBLIC_INTERFACE
@router.post(
    "/",
    response_model=TaskOut,
    status_code=201,
    summary="Create a new task",
    description="Create and store a new task (owned by current user)",
)
def create(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a new task for authenticated user."""
    db_task = create_task(db, current_user.id, title=task.title, description=task.description)
    return db_task


# PUBLIC_INTERFACE
@router.patch(
    "/{task_id}",
    response_model=TaskOut,
    summary="Update a task by id",
    description="Update a task (owned by current user) using fields from TaskUpdate.",
)
def update(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a user's task's fields."""
    db_task = update_task(
        db,
        user_id=current_user.id,
        task_id=task_id,
        title=task_update.title,
        description=task_update.description,
        completed=task_update.completed,
    )
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


# PUBLIC_INTERFACE
@router.delete(
    "/{task_id}",
    status_code=204,
    summary="Delete a task by id",
    description="Delete a user's task and return no data on success.",
)
def delete(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a user's owned task by ID."""
    deleted = delete_task(db, current_user.id, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return


# PUBLIC_INTERFACE
@router.post(
    "/{task_id}/toggle",
    response_model=TaskOut,
    summary="Toggle task completed status",
    description="Toggle between complete/incomplete for a user's task.",
)
def toggle_status(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle completed<->incomplete for a user's task."""
    db_task = toggle_task_status(db, current_user.id, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task
