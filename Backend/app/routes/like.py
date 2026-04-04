from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.like import Like

router = APIRouter(prefix="/posts")


@router.post("/{post_id}/like")
def like(post_id: int, user_id: int, db: Session = Depends(get_db)):
    existing = db.query(Like).filter_by(user_id=user_id, post_id=post_id).first()

    if existing:
        return {"message": "Already liked"}

    like = Like(user_id=user_id, post_id=post_id)
    db.add(like)
    db.commit()

    return {"message": "Liked"}
