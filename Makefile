.PHONY: run backend frontend setup check pull-ocr

# Run both the frontend and backend concurrently
run:
	@echo "Starting both backend and frontend..."
	$(MAKE) -j2 backend frontend

# Start the Python FastAPI backend
backend:
	@echo "Starting backend on http://127.0.0.1:8000..."
	cd backend && uv run uvicorn main:app --reload --port 8000

# Start the React TanStack Start frontend
frontend:
	@echo "Starting frontend on http://localhost:3000..."
	cd frontend && bun run dev

# Install/sync dependencies for both applications
setup:
	@echo "Installing frontend dependencies..."
	cd frontend && bun install
	@echo "Syncing backend dependencies..."
	cd backend && uv sync
	@echo "Pulling Tesseract OCR image via Podman (using docker-compose)..."
	podman-compose pull ocr

# Run formatters, linters, and type checkers for both
check:
	@echo "Checking frontend..."
	cd frontend && bun run check || true
	@echo "Checking backend..."
	cd backend && uv run ruff check .
	cd backend && uv run ty check .

# Manually pull the OCR image (useful if first run is slow)
pull-ocr:
	podman-compose pull ocr
