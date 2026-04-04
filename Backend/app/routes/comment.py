from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.comment import Comment


router = APIRouter(prefix="/posts")


@router.post("/{post_id}/comment")
def comment(post_id: int, content: str, user_id: int, db: Session = Depends(get_db)):
    comment = Comment(content=content, post_id=post_id, user_id=user_id)
    db.add(comment)
    db.commit()
    return comment
