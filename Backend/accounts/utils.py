from django.conf import settings
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


def issue_tokens(user):
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    response = Response({"detail": "Login successful"})

    response.set_cookie(
        "access_token",
        access,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        max_age=60 * 15,
    )

    response.set_cookie(
        "refresh_token",
        str(refresh),
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        max_age=60 * 60 * 24 * 30,
    )

    response.set_cookie(
        "__auth",
        value="true",
        httponly=False,
        secure=not settings.DEBUG,
        samesite="Lax",
        max_age=60 * 60 * 24 * 30,
    )

    return response
