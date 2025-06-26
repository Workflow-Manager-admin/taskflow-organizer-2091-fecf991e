from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.auth import router as auth_router

# --- Import db/init logic to set up tables on first startup ---
from .models import db as db_module

app = FastAPI(
    title="Taskflow API",
    description="Backend API for Taskflow app with authentication and task management.",
    version="1.0.0",
    openapi_tags=[
        {"name": "auth", "description": "User registration, login, authentication"},
        {"name": "tasks", "description": "User task operations (protected)"},
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# Run DB table creation/init on startup


@app.on_event("startup")
def on_startup():
    """Ensure DB tables are created on app start."""
    db_module.init_db()


@app.get("/", tags=["health"])
def health_check():
    return {"message": "Healthy"}
