from fastapi import FastAPI
from app.database import Base, engine
from app.routes import auth, profile

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return "hello"


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])
