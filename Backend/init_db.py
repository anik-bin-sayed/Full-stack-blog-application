"""
Database initialization script.
Run this once to create all tables in your PostgreSQL database.
"""

from app.database import engine, Base
from app.models.User import User  # Import all models


def init_db():
    """Create all table schemas in the database."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")


if __name__ == "__main__":
    init_db()
