#!/usr/bin/env python3
"""
Backend Server Runner
Starts the FastAPI server with uvicorn
"""

import sys
import os
from pathlib import Path

# Add src directory to Python path
backend_dir = Path(__file__).resolve().parent
src_dir = backend_dir / "src"
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(src_dir))

# Import after path setup
import uvicorn
from src.config import Settings

def main():
    """Start the FastAPI server"""
    settings = Settings()

    print("=" * 60)
    print("Starting RAG Textbook Chatbot Backend Server")
    print("=" * 60)
    print(f"Host: {settings.app_host}")
    print(f"Port: {settings.app_port}")
    print(f"Environment: {'Development' if settings.app_debug else 'Production'}")
    print(f"Docs: http://{settings.app_host}:{settings.app_port}/docs")
    print("=" * 60)

    uvicorn.run(
        "src.main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=True,  # Auto-reload on code changes
        log_level=settings.log_level.lower(),
        access_log=True,
    )

if __name__ == "__main__":
    main()
