from fastapi import Request, Depends, HTTPException
from app.database import SessionLocal
from sqlalchemy.orm import Session

from app.core.security import verify_access_token
from app.models.User import User


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not Authenticated")

    payload = verify_access_token(token)
    user = db.query(User).filter(User.email == payload["sub"]).first()

    if not user:
        return {"error": "User not found."}

    return user
