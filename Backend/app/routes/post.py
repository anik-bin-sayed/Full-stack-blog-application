from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.post import Post
from app.utils.slug import generate_slug
import shutil


router = APIRouter(prefix="/posts")


@router.post("/")
def create_post(title: str, content: str, db: Session = Depends(get_db)):
    slug = generate_slug(title)

    post = Post(title=title, content=content, slug=slug, status="Draft")

    db.add(post)
    db.commit()
    db.refresh(post)

    return post


@router.get("/search")
def search(q: str, db: Session = Depends(get_db)):
    return (
        db.query(Post).filter(Post.title.contains(q) | Post.content.contains(q)).all()
    )


@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    path = f"media/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"path": path}
