@echo off
REM Quick Development Server Start
REM Direct uvicorn command

echo Starting development server...
echo Server: http://localhost:8000
echo Docs: http://localhost:8000/docs
echo.

uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
