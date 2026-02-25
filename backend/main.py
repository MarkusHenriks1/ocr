import os
import httpx

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="OCR Backend API",
    description="An API that receives images and extracts text using Tesseract OCR.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


class OCRResponse(BaseModel):
    text: str = Field(
        ..., description="The text extracted from the image by the OCR engine."
    )


class RootResponse(BaseModel):
    message: str = Field(..., description="A simple welcome message.")


app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/",
    response_model=RootResponse,
    tags=["General"],
    summary="Check API status",
    description="Returns a simple message confirming the API is running.",
)
def read_root():
    return {"message": "OCR API is running"}


@app.post(
    "/api/ocr",
    response_model=OCRResponse,
    tags=["OCR"],
    summary="Extract text from an image",
    description="Upload an image file (JPEG, PNG, WEBP, GIF, BMP) to extract text using the Tesseract OCR engine. The API forwards the image to the internal OCR service.",
    responses={
        400: {"description": "Invalid file format. Must be an image."},
        500: {"description": "Internal server error during OCR processing."},
    },
)
async def perform_ocr(
    file: UploadFile = File(..., description="The image file to be processed."),
):
    # Validate file type
    is_image_type = file.content_type is not None and file.content_type.startswith(
        "image/"
    )
    is_image_ext = file.filename is not None and file.filename.lower().endswith(
        (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp")
    )

    if not (is_image_type or is_image_ext):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Call the OCR API service
    try:
        contents = await file.read()

        async with httpx.AsyncClient() as client:
            # We assume the OCR API is exposed on localhost:5000 or the appropriate docker network
            ocr_api_url = os.environ.get("OCR_API_URL", "http://localhost:5000/ocr")
            response = await client.post(
                ocr_api_url,
                files={
                    "file": (
                        file.filename or "image.jpg",
                        contents,
                        file.content_type or "image/jpeg",
                    )
                },
                timeout=30.0,
            )

        if response.status_code != 200:
            error_data = response.json() if response.content else {}
            raise HTTPException(
                status_code=500,
                detail=f"OCR Error: {error_data.get('error', 'Unknown error')} - {error_data.get('details', '')}",
            )

        data = response.json()
        text = data.get("text", "")

        # If output is empty but no error code, it might just be no text found
        return {"text": text}

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")
