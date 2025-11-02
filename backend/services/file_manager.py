import os
import asyncio
import aiofiles
from pathlib import Path
from datetime import datetime, timedelta
from fastapi import UploadFile
import logging

logger = logging.getLogger(__name__)

class FileManager:
    def __init__(self):
        self.upload_dir = Path("./uploads")
        self.output_dir = Path("./outputs")
        self.cleanup_interval = 600  # 10 minutes in seconds
        self.file_status = {}  # In-memory status tracking
        
    def ensure_directories(self):
        """Create necessary directories if they don't exist"""
        self.upload_dir.mkdir(exist_ok=True)
        self.output_dir.mkdir(exist_ok=True)
        logger.info("Directories ensured: uploads, outputs")
    
    async def save_uploaded_file(self, file: UploadFile, file_id: str) -> Path:
        """Save uploaded file to disk"""
        file_path = self.upload_dir / f"{file_id}.pdf"
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        logger.info(f"File saved: {file_path}")
        return file_path
    
    def get_input_path(self, file_id: str) -> Path:
        """Get input file path"""
        return self.upload_dir / f"{file_id}.pdf"
    
    def get_output_path(self, file_id: str) -> Path:
        """Get output file path"""
        return self.output_dir / f"{file_id}_cleaned.pdf"
    
    def get_file_status(self, file_id: str) -> str:
        """Get processing status of a file"""
        # Check in-memory status first
        if file_id in self.file_status:
            return self.file_status[file_id]
        
        # Fallback to file system check
        input_path = self.get_input_path(file_id)
        output_path = self.get_output_path(file_id)
        
        if not input_path.exists():
            return "not_found"
        elif output_path.exists():
            return "completed"
        else:
            return "uploaded"
    
    def set_file_status(self, file_id: str, status: str):
        """Set processing status of a file"""
        self.file_status[file_id] = status
        logger.info(f"Status updated for {file_id}: {status}")
    
    async def cleanup_old_files(self):
        """Background task to cleanup old files"""
        while True:
            try:
                await self._cleanup_files_older_than(minutes=10)
                await asyncio.sleep(self.cleanup_interval)
            except Exception as e:
                logger.error(f"Cleanup error: {e}")
                await asyncio.sleep(60)  # Wait 1 minute before retrying
    
    async def _cleanup_files_older_than(self, minutes: int):
        """Remove files older than specified minutes"""
        cutoff_time = datetime.now() - timedelta(minutes=minutes)
        
        for directory in [self.upload_dir, self.output_dir]:
            for file_path in directory.glob("*.pdf"):
                try:
                    file_time = datetime.fromtimestamp(file_path.stat().st_mtime)
                    if file_time < cutoff_time:
                        file_path.unlink()
                        logger.info(f"Cleaned up old file: {file_path}")
                except Exception as e:
                    logger.error(f"Error cleaning up {file_path}: {e}")
    
    async def schedule_cleanup(self, file_id: str, delay_minutes: int = 10):
        """Schedule cleanup for specific file"""
        await asyncio.sleep(delay_minutes * 60)
        
        input_path = self.get_input_path(file_id)
        output_path = self.get_output_path(file_id)
        
        for path in [input_path, output_path]:
            try:
                if path.exists():
                    path.unlink()
                    logger.info(f"Scheduled cleanup completed: {path}")
            except Exception as e:
                logger.error(f"Scheduled cleanup error for {path}: {e}")