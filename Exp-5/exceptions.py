from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

from models import ApiResponse

logger = logging.getLogger("app.exceptions")

class PostNotFoundException(Exception):
    def __init__(self, post_id: int):
        self.post_id = post_id
        self.message = f"Post with ID {post_id} not found."

async def post_not_found_exception_handler(request: Request, exc: PostNotFoundException):
    correlation_id = getattr(request.state, "correlation_id", None)
    logger.warning(f"[{correlation_id}] PostNotFoundException: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=ApiResponse(
            status="error",
            message=exc.message,
            data=None,
            correlation_id=correlation_id
        ).model_dump(mode="json")
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    correlation_id = getattr(request.state, "correlation_id", None)
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        errors.append({"field": field, "message": msg})
    
    logger.warning(f"[{correlation_id}] Validation error on {request.url.path}: {errors}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ApiResponse(
            status="error",
            message="Validation failed. Please check your inputs.",
            data={"details": errors},
            correlation_id=correlation_id
        ).model_dump(mode="json")
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    correlation_id = getattr(request.state, "correlation_id", None)
    logger.warning(f"[{correlation_id}] HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content=ApiResponse(
            status="error",
            message=str(exc.detail),
            data=None,
            correlation_id=correlation_id
        ).model_dump(mode="json")
    )

async def generic_exception_handler(request: Request, exc: Exception):
    correlation_id = getattr(request.state, "correlation_id", None)
    logger.error(f"[{correlation_id}] Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ApiResponse(
            status="error",
            message="An unexpected internal server error occurred.",
            data={"detail": str(exc)},
            correlation_id=correlation_id
        ).model_dump(mode="json")
    )
