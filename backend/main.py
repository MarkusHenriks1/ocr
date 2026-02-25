import asyncio
import shutil

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="OCR Backend")

app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "OCR API is running"}


@app.post("/api/ocr")
async def perform_ocr(file: UploadFile = File(...)):
    # Validate file type
    is_image_type = file.content_type is not None and file.content_type.startswith(
        "image/"
    )
    is_image_ext = file.filename is not None and file.filename.lower().endswith(
        (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp")
    )

    if not (is_image_type or is_image_ext):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Check if podman is available
    if shutil.which("podman") is None:
        raise HTTPException(
            status_code=500,
            detail="Podman is not installed or not in PATH. Required for OCR.",
        )

    try:
        contents = await file.read()

        # Run Tesseract via Podman container
        # We use jitesoft/tesseract-ocr which has tesseract as entrypoint
        # We pass '-' as input file (stdin) and '-' as output file (stdout)
        process = await asyncio.create_subprocess_exec(
            "podman",
            "run",
            "--rm",
            "-i",  # Interactive mode for stdin
            "jitesoft/tesseract-ocr",
            "-",  # Input from stdin
            "-",  # Output to stdout
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await process.communicate(input=contents)

        if process.returncode != 0:
            error_message = stderr.decode().strip()
            # Common Podman/Container permission/connection errors
            if (
                "permission denied" in error_message
                or "cannot connect" in error_message
            ):
                raise HTTPException(
                    status_code=500,
                    detail="Backend cannot execute Podman command. Check permissions.",
                )

            raise HTTPException(
                status_code=500,
                detail=f"OCR Error: {error_message or 'Unknown error'}",
            )

        text = stdout.decode("utf-8", errors="replace").strip()

        # If output is empty but no error code, it might just be no text found
        return {"text": text}

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")
