from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.auth import router as auth_router
from .routers.task import router as task_router

# --- Import db/init logic to set up tables on first startup ---
from .models import db as db_module
from fastapi.openapi.docs import get_swagger_ui_html  # moved to top for PEP8

app = FastAPI(
    title="Taskflow API",
    description="Backend API for Taskflow app with authentication and task management.",
    version="1.0.0",
    openapi_tags=[
        {"name": "auth", "description": "User registration, login, authentication"},
        {"name": "tasks", "description": "User task operations (protected)"}
    ]
)

# CORS config: Allow requests from local React dev server and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost",
        "http://127.0.0.1",
        "https://localhost",
        "https://127.0.0.1"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(task_router)

# Run DB table creation/init on startup

# Swagger/OpenAPI docs route, specifically for /docs


@app.get("/docs", include_in_schema=False)
def overridden_swagger_docs():
    """
    Serve the OpenAPI Swagger UI documentation at /docs.

    Returns:
        HTML: Swagger UI for interactive API exploration.
    """
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Docs",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
    )


@app.on_event("startup")
def on_startup():
    """Ensure DB tables are created on app start."""
    db_module.init_db()


@app.get("/", tags=["health"])
def health_check():
    return {"message": "Healthy"}
