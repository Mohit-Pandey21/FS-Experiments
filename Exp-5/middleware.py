import time
import uuid
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

# Configure custom logger for observability
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("app.middleware")

class CorrelationAndLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware combining:
    - Assignment 3: Request URI and execution time logging filter.
    - Assignment 5: Advanced MDC / Correlation ID tracking across request lifecycle.
    """
    async def dispatch(self, request: Request, call_next):
        # 1. Assignment 5: Correlation ID generation / extraction
        correlation_id = request.headers.get("X-Correlation-ID") or str(uuid.uuid4())
        request.state.correlation_id = correlation_id

        # 2. Assignment 3: Record start time
        start_time = time.perf_counter()
        uri = request.url.path
        method = request.method

        logger.info(f"[{correlation_id}] REQ START -> {method} {uri}")

        try:
            response = await call_next(request)
        except Exception as exc:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(f"[{correlation_id}] REQ FAILED -> {method} {uri} after {duration_ms} ms")
            raise exc

        # Calculate total execution duration
        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
        
        logger.info(f"[{correlation_id}] REQ END   -> {method} {uri} | Status: {response.status_code} | Took: {duration_ms} ms")

        # 3. Attach Correlation ID and Execution Time to response headers
        response.headers["X-Correlation-ID"] = correlation_id
        response.headers["X-Execution-Time-MS"] = f"{duration_ms}ms"

        return response
