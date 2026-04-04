from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.models.User import User, UserProfile
from app.core.security import (
    get_password_hash,
    verify_password,
    create_refresh_token,
    create_access_token,
    verify_token,
    verify_access_token,
)


router = APIRouter()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = (
        db.query(User)
        .filter((user.email == User.email) | (user.username == User.username))
        .first()
    )
    if existing_user:
        return {"message": "User already exits"}

    hashed_password = get_password_hash(user.password)

    new_user = User(username=user.username, email=user.email, password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.username,
        },
    }


# Login
@router.post("/login")
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    # user query
    db_user = (
        db.query(User)
        .filter((User.email == user.email) | (User.username == user.username))
        .first()
    )

    if not db_user:
        return {"error": "User not found. Please register first."}

    if not verify_password(user.password, db_user.password):
        return {"error": "Invalid credentials"}

    access_token = create_access_token({"sub": db_user.email})
    refresh_token = create_refresh_token({"sub": db_user.email})

    # Set cookies using the injected response
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 15,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )

    response.set_cookie(
        key="__auth",
        value="true",
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )

    return {"message": "Login Successful"}


# Refresh token
@router.post("/refresh")
def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    payload = verify_token(refresh_token, refresh=True)

    if not payload:
        return {"error": "Invalid refresh token."}

    email = payload.get("sub")

    new_access_token = create_access_token({"sub": email})

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 15,
    )

    return {"message": "Token refresh successfully"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    response.delete_cookie(key="__auth")

    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def getMe(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        return {"error": "Please Login first."}
    payload = verify_access_token(token)

    user = db.query(User).filter((payload["sub"] == User.email)).first()

    return user
