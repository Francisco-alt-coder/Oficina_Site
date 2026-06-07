from sqlalchemy import create_engine
from sqlalchemy.orm import (
    declarative_base,
    sessionmaker,
    Session
)

from app.core.config import settings

# Engine

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

# Session Factory

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base ORM

Base = declarative_base()

# DataBase Dependency

def get_db() -> Session:

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()