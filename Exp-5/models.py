from typing import Generic, TypeVar, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

T = TypeVar("T")

class ApiResponse(BaseModel, Generic[T]):
    """Standardized API Response wrapper matching enterprise REST design patterns."""
    status: str = Field(..., example="success")  # "success" or "error"
    message: str = Field(..., example="Operation completed successfully")
    data: Optional[T] = None
    correlation_id: Optional[str] = None

class PostBase(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Title of the post (1-100 characters)",
        example="Getting Started with FastAPI"
    )
    content: str = Field(
        ...,
        min_length=1,
        max_length=280,
        description="Content of the post (1-280 characters, like Twitter limit)",
        example="FastAPI is a modern, fast web framework for building APIs with Python."
    )
    author: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Author name",
        example="Mohit"
    )

class PostCreate(PostBase):
    """Payload for creating a post (Assignment 1 & 2)."""
    pass

class PostUpdate(BaseModel):
    """Payload for updating a post."""
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    content: Optional[str] = Field(None, min_length=1, max_length=280)
    author: Optional[str] = Field(None, min_length=1, max_length=50)

class SchedulePostRequest(BaseModel):
    """Payload for scheduling a post (Assignment 1)."""
    scheduled_at: datetime = Field(
        ...,
        description="ISO 8601 UTC Datetime for scheduled publishing",
        example="2026-12-31T23:59:59Z"
    )

    @field_validator("scheduled_at")
    @classmethod
    def validate_future_date(cls, v: datetime) -> datetime:
        # Strip timezone for simple comparison if needed or use aware comparison
        now = datetime.now(v.tzinfo) if v.tzinfo else datetime.now()
        if v <= now:
            raise ValueError("scheduled_at date must be in the future")
        return v

class PostResponse(PostBase):
    id: int
    created_at: datetime
    status: str = Field(..., description="DRAFT, SCHEDULED, or PUBLISHED")
    scheduled_at: Optional[datetime] = None

    class Config:
        from_attributes = True
