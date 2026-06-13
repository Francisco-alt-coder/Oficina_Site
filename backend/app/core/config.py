from typing import Literal

from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    # App
    
    APP_NAME: str = "Oficina API"

    ENVIRONMENT: Literal[
        "development",
        "production",
        "test"
    ] = "development"

    DEBUG: bool = True

    PORT: int = 8000 
    
    # DataBase
  
    DATABASE_URL: str = "sqlite:///./banco.db"

    # Cors
   
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]

    # Jwt

    SECRET_KEY: str = "oficina-pro-dev-secret"

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # Logs

    LOG_LEVEL: str = "INFO"

    class Config:

        env_file = ".env"

        case_sensitive = True


settings = Settings()
