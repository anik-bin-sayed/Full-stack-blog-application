from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import ProfileResponse, UserProfileCreate
from app.core.deps import get_current_user
from app.models.User import User, UserProfile


router = APIRouter()


@router.get("/", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get current user's profile"""
    profile = (
        db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    )

    # If profile doesn't exist, create one with default values
    if not profile:
        profile = UserProfile(
            user_id=current_user.id, first_name="", last_name="", phone=""
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile


@router.patch("/update", response_model=ProfileResponse)
def update_profile(
    profile_data: UserProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user's profile"""
    profile = (
        db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    # Update profile fields
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile
