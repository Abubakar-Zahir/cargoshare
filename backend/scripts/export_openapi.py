"""Saves the API description for the frontend.

Run from backend/: uv run python -m scripts.export_openapi
"""

import json
from pathlib import Path

from app.main import app

OUTPUT_FILE = Path(__file__).resolve().parents[2] / "docs" / "openapi.json"

OUTPUT_FILE.write_text(json.dumps(app.openapi(), indent=2) + "\n", encoding="utf-8")
