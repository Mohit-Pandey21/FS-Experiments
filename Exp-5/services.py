from typing import List, Optional
from datetime import datetime, timezone
from models import PostCreate, PostUpdate, PostResponse, SchedulePostRequest
from exceptions import PostNotFoundException

class PostService:
    """In-memory service managing posts (Assignment 1)."""
    def __init__(self):
        self._posts: dict[int, PostResponse] = {}
        self._counter = 0
        self._seed_data()

    def _seed_data(self):
        """Seed sample posts for quick Postman testing."""
        self.create_post(PostCreate(
            title="Spring Boot vs FastAPI",
            content="FastAPI brings async Python performance with automatic OpenAPI docs and Pydantic validation.",
            author="Mohit"
        ))
        self.create_post(PostCreate(
            title="REST API Best Practices",
            content="Always use proper HTTP methods, uniform response structures, and centralized exception handling.",
            author="Alice"
        ))

    def get_all_posts(self) -> List[PostResponse]:
        return list(self._posts.values())

    def get_post_by_id(self, post_id: int) -> PostResponse:
        if post_id not in self._posts:
            raise PostNotFoundException(post_id)
        return self._posts[post_id]

    def create_post(self, post_data: PostCreate) -> PostResponse:
        self._counter += 1
        new_post = PostResponse(
            id=self._counter,
            title=post_data.title,
            content=post_data.content,
            author=post_data.author,
            created_at=datetime.now(timezone.utc),
            status="PUBLISHED"
        )
        self._posts[self._counter] = new_post
        return new_post

    def update_post(self, post_id: int, post_data: PostUpdate) -> PostResponse:
        existing = self.get_post_by_id(post_id)
        updated_dict = existing.model_dump()

        if post_data.title is not None:
            updated_dict["title"] = post_data.title
        if post_data.content is not None:
            updated_dict["content"] = post_data.content
        if post_data.author is not None:
            updated_dict["author"] = post_data.author

        updated_post = PostResponse(**updated_dict)
        self._posts[post_id] = updated_post
        return updated_post

    def delete_post(self, post_id: int) -> None:
        if post_id not in self._posts:
            raise PostNotFoundException(post_id)
        del self._posts[post_id]

    def schedule_post(self, post_id: int, schedule_data: SchedulePostRequest) -> PostResponse:
        """Assignment 1: Schedule a post for publication at a future date."""
        existing = self.get_post_by_id(post_id)
        updated_dict = existing.model_dump()
        updated_dict["status"] = "SCHEDULED"
        updated_dict["scheduled_at"] = schedule_data.scheduled_at

        updated_post = PostResponse(**updated_dict)
        self._posts[post_id] = updated_post
        return updated_post

# Singleton instance for simple in-memory storage
post_service = PostService()
