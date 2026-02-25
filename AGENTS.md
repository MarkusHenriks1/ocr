# AGENT INSTRUCTIONS

Welcome to the OCR Application! This document contains all the necessary instructions, rules, and guidelines for AI coding agents to operate successfully within this repository.

## 🏗️ Architecture Overview
This is a monorepo consisting of three main components:
- **Backend (`/backend`)**: A Python FastAPI service managed with `uv`.
- **Frontend (`/frontend`)**: A React application using TanStack Start and TailwindCSS v4, managed with `bun`.
- **OCR API (`/ocr_api`)**: A Dockerized Python Flask wrapper around `tesseract-ocr`.

## 🚀 Build & Run Commands

### 1. Project Setup
```bash
make setup  # Installs frontend (bun) & backend (uv) dependencies and pulls/builds docker images
```

### 2. Running the Application
```bash
make run    # Runs both frontend and backend concurrently
```
Alternatively, run them separately:
- **Backend:** `cd backend && uv run uvicorn main:app --reload --port 8000`
- **Frontend:** `cd frontend && bun run dev`
- **OCR Service:** `podman compose up -d` (Required for the backend to process images)

---

## 🧪 Testing & Linting

### 1. Global Checks
```bash
make check  # Runs frontend formatting/linting and backend ruff/type checks
```

### 2. Frontend (React/TypeScript)
- **Formatting (Biome):** `cd frontend && bunx biome format --write .`
- **Linting:** `cd frontend && bun run lint`
- **Type/Syntax Check:** `cd frontend && bun run check`
- **Tests (Vitest):** `cd frontend && bun run test`
- **Single Test File:** `cd frontend && bunx vitest run path/to/test.test.ts`

### 3. Backend (Python/FastAPI)
- **Formatting/Linting (Ruff):** `cd backend && uv run ruff check .`
- **Fix Auto-fixable Lint Errors:** `cd backend && uv run ruff check . --fix`
- **Type Checking:** `cd backend && uv run ty check .`
- **Tests:** Currently done via manual test scripts (e.g. `test_api.py`), but if `pytest` is added:
  - Run all: `cd backend && uv run pytest`
  - Single Test: `cd backend && uv run pytest path/to/test_file.py::test_name`

---

## 📝 Code Style & Guidelines

### Backend (Python)
1. **Dependencies:** Use `uv` strictly. Do NOT use `pip install` or `requirements.txt`. Add dependencies using `cd backend && uv add <package>`.
2. **Framework:** Use **FastAPI** for all API routes. Define inputs/outputs strictly using **Pydantic v2** models (`BaseModel`).
3. **Typing:** Use strict type hints everywhere. Avoid `Any` or `# type: ignore` unless absolutely necessary. Validate with `ty check .`.
4. **Imports:** Standard library imports first, then third-party (FastAPI, httpx, etc.), then local application imports. `ruff` will enforce sorting.
5. **Formatting:** Rely on `ruff` for all formatting. Max line length defaults to 88.
6. **Error Handling:** Use `fastapi.HTTPException` for anticipated errors (e.g., validation, missing files, external API timeouts). Always return descriptive error messages.
7. **Async/Await:** Use `async def` for route handlers doing IO (reading files, httpx calls). Prefer `httpx.AsyncClient()` over `requests`.

### Frontend (React / TypeScript)
1. **Dependencies:** Use `bun` strictly. Do NOT use `npm`, `yarn`, or `pnpm`. Add dependencies using `cd frontend && bun add <package>`.
2. **Framework:** Use **TanStack Start** (file-based routing via `@tanstack/react-router`). Routes belong in `src/routes/`.
3. **Styling:** Use **Tailwind CSS v4** utility classes directly in `className`. Keep styles inline unless creating reusable components.
4. **Icons:** Use `lucide-react`.
5. **State/Data:** Use `@tanstack/react-query` for API fetching/caching when connecting to the backend.
6. **Formatting:** The codebase uses **Biome** (`@biomejs/biome`) instead of Prettier/ESLint. Ensure code satisfies `bun run check`.
7. **Components:** Prefer functional components, React Hooks, and explicitly typed props (`interface Props { ... }`). Keep components small and modular in `src/components/`.

### OCR Service (Flask/Docker)
1. **Environment:** Runs as a standalone Flask app inside a Docker container (base image: `jitesoft/tesseract-ocr`).
2. **Execution:** Keep modifications lightweight; use standard `subprocess` to trigger `tesseract`.
3. **Docker:** Ensure that the base system dependencies (like `python3`, `python3-pip`) are installed via `apt-get` since the underlying container uses Ubuntu.

---

## 🤖 Agent Workflow Constraints

1. **Working Directory:** Before running commands, ensure you are in the correct subdirectory (`backend` or `frontend`) or use absolute paths / `workdir` param.
2. **Docker/Podman:** The system supports both `docker-compose` and `podman compose`. The Makefile explicitly uses `podman compose up -d`.
3. **Proactiveness:** When editing code, always check the build/formatting immediately after (`make check` or the local tool). Fix all `ruff` or `biome` errors before completing the task.
4. **Documentation:** Do NOT write markdown or doc comments proactively unless specifically requested by the user, but ALWAYS keep OpenAPI descriptions on FastAPI endpoints accurate and up-to-date when modifying backend logic.
