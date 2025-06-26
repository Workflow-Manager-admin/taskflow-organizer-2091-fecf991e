"""Task CRUD and status management for user-scoped tasks."""

from sqlalchemy.orm import Session
from ..models.task import Task


# PUBLIC_INTERFACE
import datetime
from sqlalchemy import asc, desc


def get_tasks_for_user(
    db: Session,
    user_id: int,
    status: str = None,
    priority: str = None,
    sort_by: str = None,
    sort_dir: str = None,
    date_from: datetime.datetime = None,
    date_to: datetime.datetime = None
):
    """Return all tasks for a user, with optional filtering and sorting.
    Filters:
      - status: "completed", "incomplete", or None
      - priority: string or None
      - date_from/date_to: filter created_at
    Sorting:
      - sort_by: "created_at", "updated_at", "priority"
      - sort_dir: "asc" or "desc"
    """
    q = db.query(Task).filter(Task.owner_id == user_id)

    if status == "completed":
        q = q.filter(Task.completed.is_(True))
    elif status == "incomplete":
        q = q.filter(Task.completed.is_(False))

    if priority:
        q = q.filter(Task.priority == priority)

    if date_from:
        q = q.filter(Task.created_at >= date_from)
    if date_to:
        q = q.filter(Task.created_at <= date_to)

    # Default sort by created_at desc
    valid_sort_cols = {
        "created_at": Task.created_at,
        "updated_at": Task.updated_at,
        "priority": Task.priority,
    }
    if sort_by and sort_by in valid_sort_cols:
        order_col = valid_sort_cols[sort_by]
        direction = desc if (sort_dir == "desc") else asc
        q = q.order_by(direction(order_col))
    else:
        q = q.order_by(Task.created_at.desc())

    return q.all()


# PUBLIC_INTERFACE
def get_task_by_id(db: Session, user_id: int, task_id: int):
    """Return a single task (owned by user) by ID or None."""
    return (
        db.query(Task)
        .filter(Task.owner_id == user_id, Task.id == task_id)
        .first()
    )


# PUBLIC_INTERFACE
def create_task(
    db: Session,
    user_id: int,
    title: str,
    description: str = None,
    priority: str = "normal"
):
    """Create and return a new Task for user."""
    db_task = Task(
        title=title,
        description=description,
        owner_id=user_id,
        priority=priority or "normal",
    )
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
    priority: str = None,
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
    if priority is not None:
        db_task.priority = priority
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
