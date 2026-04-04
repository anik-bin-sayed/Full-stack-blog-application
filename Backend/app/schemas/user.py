from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional
from datetime import date


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str


class UserProfileCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None


class ProfileResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    phone: str
    date_of_birth: Optional[date]
    bio: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class UserWithProfile(BaseModel):
    id: int
    username: str
    email: str
    profile: ProfileResponse | None

    class Config:
        from_attributes = True
