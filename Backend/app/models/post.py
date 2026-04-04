from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    slug = Column(String, unique=True, index=True)
    content = Column(Text)
    feature_image = Column(String)

    status = Column(String, default="Draft")

    author_id = Column(Integer, ForeignKey("users.id"))

    author = relationship("User")
