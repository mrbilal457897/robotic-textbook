# Quick Start Guide - Backend Server

## 🚀 Fast Start (3 Commands)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies (first time only)
pip install -r requirements.txt

# 3. Start server
python run_server.py
```

## 📋 Alternative Methods

### Method 1: Using run_server.py (Recommended)
```bash
python run_server.py
```

### Method 2: Using start.bat (Windows)
```bash
start.bat
```

### Method 3: Using dev.bat (Quick)
```bash
dev.bat
```

### Method 4: Direct uvicorn command
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Method 5: Using Python module
```bash
python -m src.main
```

## 🔍 Verify Server is Running

After starting, check these URLs:
- **API Root**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Health Check**: http://localhost:8000/health

## ⚙️ Configuration

Server reads from `.env` file. Make sure these are set:
- `COHERE_API_KEY` - For embeddings
- `GEMINI_API_KEY` - For chat responses
- `QDRANT_URL` - Vector database
- `POSTGRES_URL` - PostgreSQL database

## 🐛 Troubleshooting

### Error: "No module named 'uvicorn'"
```bash
pip install uvicorn
```

### Error: "No module named 'fastapi'"
```bash
pip install -r requirements.txt
```

### Error: "can't open file run_server.py"
Make sure you're in the `backend` directory:
```bash
cd backend
```

### Port 8000 already in use
Change port in `.env`:
```
APP_PORT=8001
```

## 🔧 Development Tips

### Hot Reload
Server automatically reloads when you change code files.

### View Logs
Logs are saved in `logs/` directory.

### API Documentation
Visit http://localhost:8000/docs for interactive API documentation.

### Stop Server
Press `Ctrl + C` in the terminal.

## 📊 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/unit/test_router.py
```

## 🎯 Next Steps

1. ✅ Start backend server
2. ✅ Start frontend (in separate terminal): `npm start`
3. ✅ Visit http://localhost:3000
4. ✅ Test the chatbot!
