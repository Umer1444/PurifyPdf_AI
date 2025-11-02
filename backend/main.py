from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import uuid
import asyncio
from datetime import datetime, timedelta
import logging
from pathlib import Path

from services.watermark_remover import WatermarkRemover
from services.file_manager import FileManager
from models.response_models import ProcessResponse, UploadResponse
# Timeout configuration constants
PROCESSING_TIMEOUT = 240  # 4 minutes
MAX_FILE_SIZE_MB = 50     # 50MB limit

# Optional Sentry integration
try:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI PDF Watermark Remover API",
    description="Production-grade API for removing watermarks from PDF files",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
watermark_remover = WatermarkRemover()
file_manager = FileManager()

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info("Starting AI PDF Watermark Remover API")
    file_manager.ensure_directories()
    
    # Start background cleanup task
    asyncio.create_task(file_manager.cleanup_old_files())

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "AI PDF Watermark Remover API",
        "status": "healthy",
        "mode": "development",
        "ml_engine": "heavy_accuracy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/debug/{file_id}")
async def debug_file_status(file_id: str):
    """Debug endpoint for development - check file existence"""
    try:
        input_path = file_manager.get_input_path(file_id)
        output_path = file_manager.get_output_path(file_id)
        status = file_manager.get_file_status(file_id)
        
        return {
            "file_id": file_id,
            "status": status,
            "input_exists": input_path.exists(),
            "output_exists": output_path.exists(),
            "input_path": str(input_path),
            "output_path": str(output_path),
            "input_size": input_path.stat().st_size if input_path.exists() else 0,
            "output_size": output_path.stat().st_size if output_path.exists() else 0
        }
        
    except Exception as e:
        logger.error(f"Debug error for {file_id}: {str(e)}")
        return {"error": str(e), "file_id": file_id}

@app.post("/upload", response_model=UploadResponse)
async def upload_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Upload PDF file and trigger watermark detection/removal
    """
    try:
        # Validate file
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        if file.size > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_FILE_SIZE_MB}MB limit")
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Save uploaded file
        input_path = await file_manager.save_uploaded_file(file, file_id)
        
        # Schedule cleanup
        background_tasks.add_task(
            file_manager.schedule_cleanup, 
            file_id, 
            delay_minutes=10
        )
        
        logger.info(f"File uploaded successfully: {file_id}")
        
        return UploadResponse(
            file_id=file_id,
            filename=file.filename,
            status="uploaded",
            message="File uploaded successfully. Ready for processing."
        )
        
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/remove_watermark/{file_id}", response_model=ProcessResponse)
async def remove_watermark(
    file_id: str,
    background_tasks: BackgroundTasks
):
    """
    Process PDF to remove watermark via AI or rule-based methods with timeout handling
    """
    try:
        # Check if input file exists
        input_path = file_manager.get_input_path(file_id)
        if not input_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Set processing status
        file_manager.set_file_status(file_id, "processing")
        
        # Process the PDF with heavy ML processing for best accuracy
        try:
            output_path = await asyncio.wait_for(
                watermark_remover.process_pdf(file_id, input_path),
                timeout=PROCESSING_TIMEOUT
            )
            
            file_manager.set_file_status(file_id, "completed")
            
        except asyncio.TimeoutError:
            file_manager.set_file_status(file_id, "timeout")
            logger.error(f"Processing timeout for {file_id} after {PROCESSING_TIMEOUT} seconds")
            raise HTTPException(
                status_code=408, 
                detail=f"Processing timeout after {PROCESSING_TIMEOUT//60} minutes - file too complex. Try a smaller or simpler PDF."
            )
        
        # Schedule cleanup for both input and output files
        background_tasks.add_task(
            file_manager.schedule_cleanup,
            file_id,
            delay_minutes=10
        )
        
        logger.info(f"Watermark removal completed: {file_id}")
        
        return ProcessResponse(
            file_id=file_id,
            status="completed",
            output_available=True,
            processing_time=0,  # Will be calculated in the service
            message="Watermark removal completed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        file_manager.set_file_status(file_id, "error")
        logger.error(f"Processing error for {file_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/download/{file_id}")
async def download_cleaned_pdf(file_id: str):
    """
    Returns cleaned PDF file to frontend with proper headers for localhost
    """
    try:
        output_path = file_manager.get_output_path(file_id)
        
        if not output_path.exists():
            raise HTTPException(status_code=404, detail="Processed file not found")
        
        return FileResponse(
            path=output_path,
            filename=f"cleaned_{file_id}.pdf",
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=cleaned_{file_id}.pdf",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
        
    except Exception as e:
        logger.error(f"Download error for {file_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@app.get("/status/{file_id}")
async def get_processing_status(file_id: str):
    """
    Get processing status for a file
    """
    try:
        status = file_manager.get_file_status(file_id)
        
        # Enhanced status response
        response = {
            "file_id": file_id, 
            "status": status,
            "timestamp": datetime.now().isoformat()
        }
        
        # Add additional info based on status
        if status == "completed":
            output_path = file_manager.get_output_path(file_id)
            response["output_available"] = output_path.exists()
        elif status == "timeout":
            response["message"] = "Processing timed out. Try a smaller or simpler PDF."
        elif status == "error":
            response["message"] = "Processing failed. Please try again."
        elif status == "processing":
            response["message"] = "Processing in progress..."
        
        return response
        
    except Exception as e:
        logger.error(f"Status check error for {file_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)