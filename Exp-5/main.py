from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing import List

from models import ApiResponse, PostCreate, PostUpdate, PostResponse, SchedulePostRequest
from services import post_service
from middleware import CorrelationAndLoggingMiddleware
from exceptions import (
    PostNotFoundException,
    post_not_found_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    generic_exception_handler
)

# Initialize FastAPI application
app = FastAPI(
    title="Exp-5: REST API Design & Exception Handling",
    description="FastAPI implementation covering all 5 assignments from Experiment 5: CRUD APIs, Bean Validation, Logging Filter, Global Exception Handling, and Correlation ID.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware (Page 3 - Section 5)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Custom Middleware (Assignment 3 & Assignment 5)
app.add_middleware(CorrelationAndLoggingMiddleware)

# Register Global Exception Handlers (Assignment 4)
app.add_exception_handler(PostNotFoundException, post_not_found_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


# --- REST API Endpoints (Assignment 1 & Assignment 2) ---

@app.get("/", tags=["Root"])
async def root(request: Request):
    """Root endpoint welcoming users and pointing to API documentation."""
    correlation_id = getattr(request.state, "correlation_id", None)
    return ApiResponse(
        status="success",
        message="Welcome to Experiment 5 REST API (FastAPI Implementation)",
        data={
            "docs": "/docs",
            "redoc": "/redoc",
            "assignments_covered": [
                "Assignment 1: CRUD & Scheduling APIs",
                "Assignment 2: Input Validation (Length/Required checks)",
                "Assignment 3: Execution Time & Request URI Logging Filter",
                "Assignment 4: Centralized Global Exception Handling",
                "Assignment 5: Correlation ID (X-Correlation-ID tracing)"
            ]
        },
        correlation_id=correlation_id
    )

@app.get("/api/posts", response_model=ApiResponse[List[PostResponse]], tags=["Posts"])
async def get_all_posts(request: Request):
    """Assignment 1: Get all posts."""
    posts = post_service.get_all_posts()
    return ApiResponse(
        status="success",
        message=f"Retrieved {len(posts)} posts.",
        data=posts,
        correlation_id=getattr(request.state, "correlation_id", None)
    )

@app.get("/api/posts/{post_id}", response_model=ApiResponse[PostResponse], tags=["Posts"])
async def get_post_by_id(post_id: int, request: Request):
    """Assignment 1: Get post by ID. Throws 404 if not found (Assignment 4)."""
    post = post_service.get_post_by_id(post_id)
    return ApiResponse(
        status="success",
        message=f"Post #{post_id} retrieved successfully.",
        data=post,
        correlation_id=getattr(request.state, "correlation_id", None)
    )

@app.post("/api/posts", response_model=ApiResponse[PostResponse], status_code=status.HTTP_201_CREATED, tags=["Posts"])
async def create_post(post_data: PostCreate, request: Request):
    """
    Assignment 1 & 2: Create a new post.
    Enforces title max 100 chars, content 1-280 chars (Assignment 2 Validation).
    """
    new_post = post_service.create_post(post_data)
    return ApiResponse(
        status="success",
        message="Post created successfully.",
        data=new_post,
        correlation_id=getattr(request.state, "correlation_id", None)
    )

@app.put("/api/posts/{post_id}", response_model=ApiResponse[PostResponse], tags=["Posts"])
async def update_post(post_id: int, post_data: PostUpdate, request: Request):
    """Assignment 1 & 2: Update an existing post."""
    updated_post = post_service.update_post(post_id, post_data)
    return ApiResponse(
        status="success",
        message=f"Post #{post_id} updated successfully.",
        data=updated_post,
        correlation_id=getattr(request.state, "correlation_id", None)
    )

@app.delete("/api/posts/{post_id}", response_model=ApiResponse[dict], tags=["Posts"])
async def delete_post(post_id: int, request: Request):
    """Assignment 1: Delete a post."""
    post_service.delete_post(post_id)
    return ApiResponse(
        status="success",
        message=f"Post #{post_id} deleted successfully.",
        data={"deleted_id": post_id},
        correlation_id=getattr(request.state, "correlation_id", None)
    )

@app.post("/api/posts/{post_id}/schedule", response_model=ApiResponse[PostResponse], tags=["Posts"])
async def schedule_post(post_id: int, schedule_data: SchedulePostRequest, request: Request):
    """
    Assignment 1 & 2: Implement post scheduling endpoint.
    Validates that scheduled_at is a future date.
    """
    scheduled_post = post_service.schedule_post(post_id, schedule_data)
    return ApiResponse(
        status="success",
        message=f"Post #{post_id} successfully scheduled for {schedule_data.scheduled_at.isoformat()}.",
        data=scheduled_post,
        correlation_id=getattr(request.state, "correlation_id", None)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
