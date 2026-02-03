# Backend Scripts

This directory contains utility scripts for the RAG Textbook Chatbot backend.

## Available Scripts

### `validate-infra.py`

Validates all infrastructure connections before development.

**Usage:**
```bash
# Basic validation
python backend/scripts/validate-infra.py

# Verbose output (shows detailed connection info)
python backend/scripts/validate-infra.py --verbose

# JSON output (for CI/CD)
python backend/scripts/validate-infra.py --json
```

**What it checks:**
- ✅ Cohere Embeddings API (text embeddings)
- ✅ Google Gemini Chat API (LLM responses)
- ✅ Qdrant Cloud (vector database)
- ✅ Neon Postgres (conversations database)
- ✅ Upstash Redis (rate limiting)
- ✅ GitHub OAuth (optional)
- ✅ Google OAuth (optional)
- ✅ Sentry (optional)

**Prerequisites:**
1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your credentials (see `SETUP_INFRASTRUCTURE.md`)
3. Install dependencies: `pip install -r backend/requirements.txt`

**Exit codes:**
- `0`: All required services validated successfully
- `1`: One or more required services failed

---

### `migrate-db.py` *(Coming Soon)*

Runs database migrations to create tables and indexes.

**Usage:**
```bash
python backend/scripts/migrate-db.py
```

---

### `ingest-textbook.py` *(Coming Soon)*

Ingests a textbook PDF into the vector database.

**Usage:**
```bash
python backend/scripts/ingest-textbook.py --file textbook.pdf
```

---

## Development Workflow

1. **First Time Setup:**
   ```bash
   # 1. Copy environment template
   cp backend/.env.example backend/.env

   # 2. Fill in your credentials (see SETUP_INFRASTRUCTURE.md)
   # Edit backend/.env with your favorite editor

   # 3. Validate infrastructure
   python backend/scripts/validate-infra.py --verbose

   # 4. Run migrations
   python backend/scripts/migrate-db.py

   # 5. Ingest sample textbook
   python backend/scripts/ingest-textbook.py --file sample.pdf

   # 6. Start development server
   uvicorn backend.src.main:app --reload
   ```

2. **Daily Development:**
   ```bash
   # Start backend server
   uvicorn backend.src.main:app --reload
   ```

3. **Before Pushing Changes:**
   ```bash
   # Validate infrastructure still works
   python backend/scripts/validate-infra.py

   # Run tests
   pytest backend/tests/

   # Check code quality
   ruff check backend/
   black --check backend/
   ```

---

## Troubleshooting

### Script doesn't run
```bash
# Make sure you're in the project root
cd /path/to/CBook

# Make sure Python can find the backend module
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Run the script
python backend/scripts/validate-infra.py
```

### Import errors
```bash
# Install missing dependencies
pip install -r backend/requirements.txt

# Or install specific packages
pip install cohere google-generativeai qdrant-client psycopg2-binary requests
```

### Environment variable not found
```bash
# Make sure .env file exists
ls -la backend/.env

# If not, copy the example
cp backend/.env.example backend/.env

# Then edit it with your credentials
nano backend/.env  # or use your favorite editor
```

---

## Adding New Scripts

When creating new scripts:

1. Add a descriptive docstring at the top
2. Include usage examples in the docstring
3. Use argparse for command-line arguments
4. Update this README with usage instructions
5. Make the script executable: `chmod +x backend/scripts/your-script.py`
6. Add shebang: `#!/usr/bin/env python3`

**Example template:**
```python
#!/usr/bin/env python3
"""
Script Name - Brief Description

Usage:
    python backend/scripts/your-script.py --arg value
    python backend/scripts/your-script.py --help
"""

import argparse


def main():
    parser = argparse.ArgumentParser(description="Your script description")
    parser.add_argument("--arg", help="Argument description")
    args = parser.parse_args()

    # Your code here
    print("Hello from your script!")


if __name__ == "__main__":
    main()
```

---

**Last Updated**: 2026-01-29
