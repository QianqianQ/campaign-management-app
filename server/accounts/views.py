import logging

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    AccountCreateSerializer,
    AccountLoginSerializer,
    AccountSerializer,
)

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    logger.info(
        f"Signup request received for email: {request.data.get('email', 'N/A')}"
    )
    serializer = AccountCreateSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": AccountSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )
    logger.info(f"SIGNUP FAILED: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def signin(request):
    logger.info(
        f"Signin request received for email: {request.data.get('email', 'N/A')}"
    )
    serializer = AccountLoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        logger.info(f"SIGNIN SUCCESS: {user.email}")

        return Response(
            {
                "user": AccountSerializer(user).data,
                "refresh_token": str(refresh),
                "access_token": str(refresh.access_token),
            },
            status=status.HTTP_200_OK,
        )
    logger.info(f"SIGNIN FAILED: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = AccountSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
