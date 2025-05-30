import logging

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    # Customize DRF response format
    if response is not None:
        logger.info(
            f"EXCEPTION HANDLER: {type(exc).__name__}, " f"Response: {response.data}"
        )
        custom_response_data = {
            "success": False,
            "error": response.data.get("detail", str(response.data)),
            "status_code": response.status_code,
        }
        response.data = custom_response_data
        return response

    # Handle unhandled exceptions
    if isinstance(exc, IntegrityError):
        return Response(
            {
                "success": False,
                "error": "Database integrity error occurred",
                "status_code": 422,
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    if isinstance(exc, DjangoValidationError):
        return Response(
            {"success": False, "error": str(exc), "status_code": 400},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Generic server error
    return Response(
        {
            "success": False,
            "error": "An unexpected error occurred",
            "status_code": 500,
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
