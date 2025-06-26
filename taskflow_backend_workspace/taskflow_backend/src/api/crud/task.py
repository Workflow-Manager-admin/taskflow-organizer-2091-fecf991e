"""Task CRUD and status management for user-scoped tasks."""

from sqlalchemy.orm import Session
from ..models.task import Task


# PUBLIC_INTERFACE
def get_tasks_for_user(db: Session, user_id: int):
    """Return all tasks for a user, ordered by creation."""
    return (
        db.query(Task)
        .filter(Task.owner_id == user_id)
        .order_by(Task.created_at.desc())
        .all()
    )


# PUBLIC_INTERFACE
def get_task_by_id(db: Session, user_id: int, task_id: int):
    """Return a single task (owned by user) by ID or None."""
    return (
        db.query(Task)
        .filter(Task.owner_id == user_id, Task.id == task_id)
        .first()
    )


# PUBLIC_INTERFACE
def create_task(db: Session, user_id: int, title: str, description: str = None):
    """Create and return a new Task for user."""
    db_task = Task(title=title, description=description, owner_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


# PUBLIC_INTERFACE
def update_task(
    db: Session,
    user_id: int,
    task_id: int,
    title: str = None,
    description: str = None,
    completed: bool = None,
):
    """Update fields of a task (if owned by user). Returns updated task or None."""
    db_task = get_task_by_id(db, user_id, task_id)
    if not db_task:
        return None
    if title is not None:
        db_task.title = title
    if description is not None:
        db_task.description = description
    if completed is not None:
        db_task.completed = completed
    db.commit()
    db.refresh(db_task)
    return db_task


# PUBLIC_INTERFACE
def delete_task(db: Session, user_id: int, task_id: int):
    """Delete a user's task by ID. Returns True if deleted, False if not found or unauthorized."""
    db_task = get_task_by_id(db, user_id, task_id)
    if not db_task:
        return False
    db.delete(db_task)
    db.commit()
    return True


# PUBLIC_INTERFACE
def toggle_task_status(db: Session, user_id: int, task_id: int):
    """Toggle completed status for a user's task. Returns updated task or None."""
    db_task = get_task_by_id(db, user_id, task_id)
    if not db_task:
        return None
    db_task.completed = not db_task.completed
    db.commit()
    db.refresh(db_task)
    return db_task
