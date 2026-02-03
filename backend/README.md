# RAG Textbook Chatbot - Backend

FastAPI backend for the RAG-powered textbook chatbot.

## Project Structure

```
backend/
├── src/                    # Source code
│   ├── agents/            # RAG agents (Router, Retrieval, Response, Citation)
│   ├── mcp/               # MCP server implementations (Embeddings, Search, Metadata)
│   ├── api/               # FastAPI routes
│   │   └── v1/           # API version 1 endpoints
│   ├── models/            # Pydantic models (request/response schemas)
│   ├── services/          # Business logic (auth, ingestion, cleanup)
│   ├── db/                # Database clients (Postgres, Qdrant, Redis)
│   ├── config.py          # Configuration management
│   └── main.py            # FastAPI app initialization
├── tests/                 # Test suite
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── contract/         # Contract tests (MCP)
├── scripts/              # Utility scripts
│   ├── validate-infra.py # Infrastructure validation
│   ├── migrate-db.py     # Database migrations (coming soon)
│   └── ingest-textbook.py # Textbook ingestion (coming soon)
├── logs/                 # Application logs
├── .env.example          # Environment variable template
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Setup

### Prerequisites

- Python 3.11+
- Virtual environment (recommended)
- Infrastructure set up (see `specs/002-rag-textbook-chatbot/SETUP_INFRASTRUCTURE.md`)

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# (See SETUP_INFRASTRUCTURE.md for details)
```

### Validation

```bash
# Validate infrastructure connections
python scripts/validate-infra.py --verbose
```

### Running

```bash
# Development server with hot reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Development

### Code Style

- **Linting**: Ruff (`ruff check .`)
- **Formatting**: Black (`black .`)
- **Type Checking**: mypy (optional)

### Testing

```bash
# Run all tests
pytest

# Run specific test types
pytest tests/unit/
pytest tests/integration/
pytest tests/contract/

# Run with coverage
pytest --cov=src --cov-report=html
```

### Environment Variables

See `.env.example` for all available configuration options.

**Required**:
- `COHERE_API_KEY` - Cohere embeddings API
- `GEMINI_API_KEY` - Gemini chat API
- `QDRANT_URL` - Qdrant Cloud URL
- `QDRANT_API_KEY` - Qdrant API key
- `NEON_DATABASE_URL` - Neon Postgres connection string

**Optional**:
- `UPSTASH_REDIS_URL` - Rate limiting
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - OAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - OAuth
- `SENTRY_DSN` - Error tracking

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Architecture

### RAG Pipeline

```
User Question
    ↓
Router Agent (mode selection)
    ↓
Retrieval Agent (Cohere embeddings → Qdrant search)
    ↓
Response Agent (Gemini chat with context)
    ↓
Citation Agent (extract and format citations)
    ↓
API Response (with citations)
```

### Agents

- **Router Agent**: Determines answering mode (Book-Only, Selected-Text, General)
- **Retrieval Agent**: Semantic search using Cohere + Qdrant
- **Selected-Text Agent**: Processes highlighted text queries
- **General Knowledge Agent**: Dual-pass (textbook + external knowledge)
- **Response Agent**: Generates answers using Gemini with tone control
- **Citation Agent**: Extracts and validates citations

### MCP Servers

- **Embeddings MCP**: Cohere embedding generation
- **Search MCP**: Qdrant vector search
- **Metadata MCP**: Chunk metadata lookup

## Troubleshooting

### Import Errors

```bash
# Make sure you're in the virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Database Connection Errors

```bash
# Validate infrastructure
python scripts/validate-infra.py

# Check .env file
cat .env | grep -E "COHERE|GEMINI|QDRANT|NEON"
```

### Port Already in Use

```bash
# Kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pytest`
4. Format code: `black .`
5. Lint code: `ruff check .`
6. Commit with clear message
7. Create pull request

## License

See LICENSE file in repository root.
