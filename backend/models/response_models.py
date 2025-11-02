from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    status: str
    message: str
    timestamp: Optional[datetime] = None

class ProcessResponse(BaseModel):
    file_id: str
    status: str
    output_available: bool
    processing_time: float
    message: str
    timestamp: Optional[datetime] = None

class StatusResponse(BaseModel):
    file_id: str
    status: str
    progress: Optional[float] = None
    message: Optional[str] = None
    timestamp: Optional[datetime] = None

class ErrorResponse(BaseModel):
    error: str
    message: str
    timestamp: Optional[datetime] = None