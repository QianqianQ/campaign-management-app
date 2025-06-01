"""
Utility functions and custom exception handlers for the Django application.

This module provides custom exception handling, logging utilities, and other
common functionality used across the application.
"""

from __future__ import annotations

import logging
from dataclasses import asdict, dataclass
from typing import Any, Dict, Optional

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


@dataclass
class APIResponse:
    """Standard API response model."""

    success: bool
    status_code: int
    error: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

    def to_response(self) -> Response:
        """Convert to DRF Response object."""
        return Response(asdict(self), status=self.status_code)


class ApplicationError(Exception):
    """Base exception for application-specific errors."""

    def __init__(self, message: str, error_code: Optional[str] = None) -> None:
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)


class ValidationError(ApplicationError):
    """Exception raised for validation errors."""

    pass


class BusinessLogicError(ApplicationError):
    """Exception raised for business logic violations."""

    pass


def custom_exception_handler(
    exc: Exception, context: Dict[str, Any]
) -> Optional[Response]:
    """
    Simple custom exception handler for Django REST Framework.

    Returns consistent error response format using APIResponse model.
    """
    response = exception_handler(exc, context)

    if response is not None:
        # Log the error
        logger.error(f"API Error: {type(exc).__name__} - {str(exc)}")

        # Return consistent format using model
        api_response = APIResponse(
            success=False,
            error=str(response.data.get("detail", response.data)),
            status_code=response.status_code,
        )
        return api_response.to_response()

    # Handle database errors
    if isinstance(exc, IntegrityError):
        logger.error(f"Database error: {str(exc)}")
        api_response = APIResponse(
            success=False,
            error="Database error occurred",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )
        return api_response.to_response()

    # Handle validation errors
    if isinstance(exc, DjangoValidationError):
        logger.warning(f"Validation error: {str(exc)}")
        api_response = APIResponse(
            success=False,
            error=str(exc),
            status_code=status.HTTP_400_BAD_REQUEST,
        )
        return api_response.to_response()

    # Generic server error
    logger.error(f"Unhandled error: {type(exc).__name__} - {str(exc)}")
    api_response = APIResponse(
        success=False,
        error="An unexpected error occurred",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
    return api_response.to_response()


def log_user_action(
    user_id: int, action: str, details: Optional[Dict[str, Any]] = None
) -> None:
    """
    Log user actions for debugging.

    Args:
        user_id: ID of the user performing the action
        action: Description of the action performed
        details: Optional additional details about the action
    """
    logger.info(
        f"User action: {action}",
        extra={
            "user_id": user_id,
            "action": action,
            "details": details or {},
        },
    )
