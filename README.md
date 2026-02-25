# AI OCR Scanner

This project contains two separate applications: a FastAPI backend for Optical Character Recognition (OCR) and a TanStack Start frontend built with React.

## Prerequisites

- **Bun**: For running the frontend.
- **uv**: For running the Python backend.
- **Tesseract OCR**: The backend relies on `pytesseract`, which requires the Tesseract system binary to be installed.
  - **Ubuntu/Debian**: `sudo apt install tesseract-ocr tesseract-ocr-eng`
  - **Arch Linux**: `sudo pacman -S tesseract tesseract-data-eng`
  - **macOS**: `brew install tesseract`

## 1. Backend (FastAPI + uv + ruff + ty)

The backend exposes a `POST /api/ocr` endpoint that accepts an image and returns the extracted text.

```bash
cd backend
uv run uvicorn main:app --reload --port 8000
```

To run checks (Linter & Type Checker):
```bash
uv run ruff check .
uv run ty check .
```

## 2. Frontend (TanStack Start + Bun + Biome)

The frontend is a modern React application that allows you to upload an image and preview the OCR results on the right side.

```bash
cd frontend
bun run dev
```

To run formatting and linting:
```bash
bun run check
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
