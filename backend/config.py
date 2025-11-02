import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Environment
    environment: str = "development"
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_workers: int = 1
    
    # File Storage
    upload_dir: Path = Path("./uploads")
    output_dir: Path = Path("./outputs")
    max_file_size: int = 52428800  # 50MB
    cleanup_interval: int = 600  # 10 minutes
    
    # AI/ML Configuration
    model_device: str = "cpu"
    model_precision: str = "fp32"
    
    # Security
    cors_origins: List[str] = [
        "http://localhost:3000",
        "https://*.vercel.app"
    ]
    
    # Monitoring
    sentry_dsn: str = ""
    prometheus_port: int = 9090
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "json"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()