@echo off
REM Backend Server Startup Script
REM Quick start script for Windows

echo ============================================================
echo RAG Textbook Chatbot Backend Server
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/3] Checking Python version...
python --version

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo ERROR: .env file not found
    echo Please create .env file from .env.example
    echo.
    pause
    exit /b 1
)

echo [2/3] Environment configuration found

REM Check if uvicorn is installed
python -c "import uvicorn" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Dependencies not installed
    echo Installing requirements...
    pip install -r requirements.txt
)

echo [3/3] Starting server...
echo.
echo Server will start at: http://localhost:8000
echo API Docs available at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.

REM Start the server
python run_server.py
