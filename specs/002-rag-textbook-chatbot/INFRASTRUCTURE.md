# Infrastructure Provisioning Guide

**Feature**: RAG-Powered Textbook Chatbot
**Phase**: 0 (Preparation & Validation)
**Tasks**: T007-T013

---

## Overview

This document provides step-by-step instructions for provisioning the required cloud infrastructure for the RAG-powered textbook chatbot. All services use serverless/managed offerings to eliminate operational overhead.

**⚠️ CRITICAL**: Complete all tasks in this document before proceeding to Phase 1 implementation.

---

## T007: Create Qdrant Cloud Collection

**Service**: Qdrant Cloud (Vector Database)
**Purpose**: Store 3072-dimensional textbook chunk embeddings for semantic search

### Prerequisites
- Qdrant Cloud account (free tier available)
- API key with collection creation permissions

### Steps

1. **Sign up for Qdrant Cloud**:
   - Visit: https://cloud.qdrant.io
   - Create account (GitHub OAuth recommended)
   - Select free tier cluster (1GB free)

2. **Create Collection**:

   **Option A: Using Qdrant Cloud UI**:
   - Navigate to "Collections" → "Create Collection"
   - Collection name: `textbook_chunks`
   - Vector size: `3072`
   - Distance metric: `Cosine`
   - HNSW configuration:
     - `m`: `16`
     - `ef_construct`: `100`

   **Option B: Using Python SDK** (recommended for reproducibility):
   ```python
   from qdrant_client import QdrantClient
   from qdrant_client.models import VectorParams, Distance, HnswConfigDiff

   client = QdrantClient(
       url="https://your-cluster.qdrant.io:6333",
       api_key="your-api-key-here"
   )

   client.create_collection(
       collection_name="textbook_chunks",
       vectors_config=VectorParams(
           size=3072,  # text-embedding-3-large dimensions
           distance=Distance.COSINE
       ),
       hnsw_config=HnswConfigDiff(
           m=16,           # Number of bi-directional links per node
           ef_construct=100  # Size of dynamic candidate list during construction
       )
   )

   print("✓ Collection 'textbook_chunks' created successfully")
   ```

3. **Verify Collection**:
   ```python
   # List all collections
   collections = client.get_collections()
   print(f"Collections: {[c.name for c in collections.collections]}")

   # Get collection info
   info = client.get_collection(collection_name="textbook_chunks")
   print(f"Vector size: {info.config.params.vectors.size}")
   print(f"Distance: {info.config.params.vectors.distance}")
   print(f"HNSW m: {info.config.hnsw_config.m}")
   print(f"HNSW ef_construct: {info.config.hnsw_config.ef_construct}")
   ```

4. **Save Credentials**:
   - Cluster URL: `https://your-cluster.qdrant.io:6333`
   - API Key: (copy from Qdrant Cloud dashboard → API Keys)
   - Add to `.env` file (see T012)

**Expected Result**: Collection `textbook_chunks` exists with correct vector configuration

**Status**: [ ] Complete

---

## T008: Provision Neon Serverless Postgres Database

**Service**: Neon Serverless Postgres
**Purpose**: Store conversations, messages, user sessions, and chunk metadata

### Prerequisites
- Neon account (free tier available)
- Database creation permissions

### Steps

1. **Sign up for Neon**:
   - Visit: https://console.neon.tech
   - Create account (GitHub OAuth recommended)
   - Select free tier (0.5GB storage, 1 database, auto-scaling compute)

2. **Create Database**:
   - Project name: `textbook-chatbot`
   - Region: `us-east-1` (or closest to your users)
   - Postgres version: `16` (latest stable)
   - Compute size: Auto-scaling (0.25 CU to 4 CU)

3. **Get Connection String**:
   - Navigate to project → "Connection Details"
   - Copy connection string:
     ```
     postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/textbook_chatbot?sslmode=require
     ```

4. **Test Connection**:
   ```bash
   # Using psql
   psql "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/textbook_chatbot?sslmode=require" -c "SELECT version();"

   # Expected output: PostgreSQL 16.x on x86_64-pc-linux-gnu...
   ```

   Or using Python:
   ```python
   import psycopg2

   DATABASE_URL = "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/textbook_chatbot?sslmode=require"

   conn = psycopg2.connect(DATABASE_URL)
   cursor = conn.cursor()
   cursor.execute("SELECT 1;")
   result = cursor.fetchone()
   print(f"✓ Connection successful: {result}")
   cursor.close()
   conn.close()
   ```

5. **Save Credentials**:
   - Database URL: (full connection string)
   - Add to `.env` file (see T012)

**Expected Result**: Postgres database accessible, connection test passes

**Status**: [ ] Complete

---

## T009: Create OpenAI API Key

**Service**: OpenAI API
**Purpose**: Generate text embeddings and LLM completions

### Prerequisites
- OpenAI account with billing enabled
- API access permissions

### Steps

1. **Sign up for OpenAI**:
   - Visit: https://platform.openai.com
   - Create account
   - Add payment method (required for API access)

2. **Create API Key**:
   - Navigate to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name: `textbook-chatbot-prod`
   - Permissions: `All` (or restrict to Embeddings + Completions only)
   - Copy key immediately (won't be shown again)

3. **Test Embedding Generation**:
   ```python
   import openai

   openai.api_key = "sk-..."

   # Test text-embedding-3-large (3072 dimensions)
   response = openai.embeddings.create(
       model="text-embedding-3-large",
       input="Test embedding for RAG chatbot"
   )

   embedding = response.data[0].embedding
   print(f"✓ Embedding generated: {len(embedding)} dimensions")
   assert len(embedding) == 3072, "Expected 3072-dimensional embedding"
   ```

4. **Test Completion Generation**:
   ```python
   # Test GPT-4 (primary model)
   response = openai.chat.completions.create(
       model="gpt-4",
       messages=[
           {"role": "system", "content": "You are a helpful assistant."},
           {"role": "user", "content": "Test completion"}
       ],
       max_tokens=50
   )

   print(f"✓ Completion generated: {response.choices[0].message.content}")
   ```

5. **Set Usage Limits** (recommended):
   - Navigate to: https://platform.openai.com/account/limits
   - Set monthly budget (e.g., $100/month)
   - Enable email alerts at 75% and 90% usage

6. **Save Credentials**:
   - API Key: `sk-...`
   - Add to `.env` file (see T012)

**Expected Result**: Both embedding and completion generation work, usage limits configured

**Status**: [ ] Complete

---

## T010: Setup Sentry Monitoring

**Service**: Sentry (Error Tracking & Performance Monitoring)
**Purpose**: Monitor errors, RAG pipeline latency, and quality metrics

### Prerequisites
- Sentry account (free tier available)
- Project creation permissions

### Steps

1. **Sign up for Sentry**:
   - Visit: https://sentry.io
   - Create account (GitHub OAuth recommended)
   - Select free tier (5,000 events/month, 1 project, 30-day retention)

2. **Create Project**:
   - Platform: `Python` (backend) + `Next.js` (frontend)
   - Alert frequency: `Every issue`
   - Project name: `textbook-chatbot-backend` and `textbook-chatbot-frontend`

3. **Get DSN (Data Source Name)**:
   - Navigate to project → Settings → Client Keys (DSN)
   - Copy DSN:
     ```
     https://xxxxx@o12345.ingest.sentry.io/67890
     ```

4. **Test Error Tracking**:
   ```python
   import sentry_sdk

   sentry_sdk.init(
       dsn="https://xxxxx@o12345.ingest.sentry.io/67890",
       traces_sample_rate=0.1,  # 10% of transactions for performance monitoring
   )

   # Test error capture
   try:
       1 / 0
   except Exception as e:
       sentry_sdk.capture_exception(e)
       print("✓ Error captured and sent to Sentry")
   ```

5. **Configure Alerts**:
   - Navigate to Alerts → Create Alert
   - Alert type: `Issues`
   - Conditions:
     - Error rate > 5% (per hour)
     - p95 latency > 5s (RAG pipeline)
   - Actions: Email notification

6. **Setup Custom Metrics** (for RAG observability):
   ```python
   # Example: Track RAG pipeline stages
   with sentry_sdk.start_transaction(op="rag_query", name="answer_question"):
       with sentry_sdk.start_span(op="embedding"):
           # Embedding generation
           pass
       with sentry_sdk.start_span(op="search"):
           # Vector search
           pass
       with sentry_sdk.start_span(op="generation"):
           # LLM response generation
           pass
   ```

7. **Save Credentials**:
   - Sentry DSN: (full DSN string)
   - Add to `.env` file (see T012)

**Expected Result**: Test error captured in Sentry dashboard, alerts configured

**Status**: [ ] Complete

---

## T011: Setup Upstash Redis

**Service**: Upstash Redis (Edge KV for Rate Limiting)
**Purpose**: Store rate limit counters and cache frequent queries

### Prerequisites
- Upstash account (free tier available)
- Database creation permissions

### Steps

1. **Sign up for Upstash**:
   - Visit: https://console.upstash.com
   - Create account (GitHub OAuth recommended)
   - Select free tier (10,000 commands/day, 256MB storage)

2. **Create Redis Database**:
   - Database name: `textbook-chatbot-rate-limits`
   - Region: `us-east-1` (or Edge for global distribution)
   - Type: `Regional` or `Edge` (Edge recommended for low latency)
   - Eviction policy: `allkeys-lru` (Least Recently Used)

3. **Get Connection Details**:
   - Navigate to database → REST API
   - Copy:
     - REST URL: `https://xxxxx.upstash.io`
     - REST Token: `AxxxxxxxxxxxxxxxxxxxB`

4. **Test Connection**:
   ```python
   import requests

   UPSTASH_URL = "https://xxxxx.upstash.io"
   UPSTASH_TOKEN = "AxxxxxxxxxxxxxxxxxxxB"

   headers = {"Authorization": f"Bearer {UPSTASH_TOKEN}"}

   # Test SET command
   response = requests.post(
       f"{UPSTASH_URL}/set/test_key/test_value",
       headers=headers
   )
   print(f"SET response: {response.json()}")

   # Test GET command
   response = requests.get(
       f"{UPSTASH_URL}/get/test_key",
       headers=headers
   )
   print(f"GET response: {response.json()}")
   assert response.json()["result"] == "test_value", "Value mismatch"

   print("✓ Upstash Redis connection successful")
   ```

5. **Configure Rate Limiting Logic** (example):
   ```python
   def check_rate_limit(user_id: str, limit: int = 10, window: int = 3600):
       """Check if user exceeded rate limit (10 requests per hour)"""
       key = f"rate_limit:{user_id}"

       # Increment counter
       response = requests.post(
           f"{UPSTASH_URL}/incr/{key}",
           headers=headers
       )
       count = response.json()["result"]

       # Set expiry on first request
       if count == 1:
           requests.post(
               f"{UPSTASH_URL}/expire/{key}/{window}",
               headers=headers
           )

       return count <= limit
   ```

6. **Save Credentials**:
   - Upstash URL: (REST URL)
   - Upstash Token: (REST Token)
   - Add to `.env` file (see T012)

**Expected Result**: Redis commands execute successfully, rate limit logic testable

**Status**: [ ] Complete

---

## T012: Configure Environment Variables

**Purpose**: Centralize all credentials in `.env` file for backend

### Steps

1. **Create `.env.example` Template**:
   Create file at `backend/.env.example`:
   ```bash
   # OpenAI API
   OPENAI_API_KEY=sk-your-openai-api-key-here

   # Qdrant Cloud
   QDRANT_URL=https://your-cluster.qdrant.io:6333
   QDRANT_API_KEY=your-qdrant-api-key-here

   # Neon Postgres
   NEON_DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/textbook_chatbot?sslmode=require

   # Upstash Redis
   UPSTASH_REDIS_URL=https://xxxxx.upstash.io
   UPSTASH_REDIS_TOKEN=AxxxxxxxxxxxxxxxxxxxB

   # Sentry
   SENTRY_DSN=https://xxxxx@o12345.ingest.sentry.io/67890

   # OAuth Providers (to be configured in Phase 2)
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Application Config
   APP_ENV=development
   APP_DEBUG=true
   LOG_LEVEL=INFO
   ```

2. **Create Actual `.env` File**:
   ```bash
   cd backend/
   cp .env.example .env
   # Fill in actual credentials from T007-T011
   ```

3. **Add to .gitignore** (already done):
   Verify `backend/.env` is in `.gitignore`

4. **Validate Environment Variables**:
   Create `backend/scripts/validate-env.py`:
   ```python
   import os
   from dotenv import load_dotenv

   load_dotenv()

   REQUIRED_VARS = [
       "OPENAI_API_KEY",
       "QDRANT_URL",
       "QDRANT_API_KEY",
       "NEON_DATABASE_URL",
       "UPSTASH_REDIS_URL",
       "UPSTASH_REDIS_TOKEN",
       "SENTRY_DSN"
   ]

   missing = [var for var in REQUIRED_VARS if not os.getenv(var)]

   if missing:
       print(f"❌ Missing environment variables: {', '.join(missing)}")
       exit(1)
   else:
       print("✓ All required environment variables present")
   ```

**Expected Result**: `.env.example` template created, actual `.env` file populated with credentials

**Status**: [ ] Complete

---

## T013: Validate Infrastructure Connectivity

**Purpose**: End-to-end validation that all services are accessible

### Steps

1. **Create Validation Script**:
   Create `backend/scripts/validate-infra.py`:
   ```python
   #!/usr/bin/env python3
   """
   Infrastructure connectivity validation script.
   Tests all external services before Phase 1 implementation.
   """
   import os
   import sys
   from dotenv import load_dotenv

   load_dotenv()

   def test_openai():
       """Test OpenAI API connectivity"""
       import openai
       try:
           openai.api_key = os.getenv("OPENAI_API_KEY")
           response = openai.embeddings.create(
               model="text-embedding-3-large",
               input="Test"
           )
           assert len(response.data[0].embedding) == 3072
           print("✓ OpenAI API: Connected (embedding generation working)")
           return True
       except Exception as e:
           print(f"❌ OpenAI API: Failed - {e}")
           return False

   def test_qdrant():
       """Test Qdrant Cloud connectivity"""
       from qdrant_client import QdrantClient
       try:
           client = QdrantClient(
               url=os.getenv("QDRANT_URL"),
               api_key=os.getenv("QDRANT_API_KEY")
           )
           collections = client.get_collections()
           print(f"✓ Qdrant Cloud: Connected ({len(collections.collections)} collections)")
           return True
       except Exception as e:
           print(f"❌ Qdrant Cloud: Failed - {e}")
           return False

   def test_neon():
       """Test Neon Postgres connectivity"""
       import psycopg2
       try:
           conn = psycopg2.connect(os.getenv("NEON_DATABASE_URL"))
           cursor = conn.cursor()
           cursor.execute("SELECT version();")
           version = cursor.fetchone()[0]
           cursor.close()
           conn.close()
           print(f"✓ Neon Postgres: Connected ({version.split()[0]})")
           return True
       except Exception as e:
           print(f"❌ Neon Postgres: Failed - {e}")
           return False

   def test_upstash():
       """Test Upstash Redis connectivity"""
       import requests
       try:
           headers = {"Authorization": f"Bearer {os.getenv('UPSTASH_REDIS_TOKEN')}"}
           response = requests.get(
               f"{os.getenv('UPSTASH_REDIS_URL')}/ping",
               headers=headers
           )
           assert response.json()["result"] == "PONG"
           print("✓ Upstash Redis: Connected (ping successful)")
           return True
       except Exception as e:
           print(f"❌ Upstash Redis: Failed - {e}")
           return False

   def test_sentry():
       """Test Sentry error tracking"""
       import sentry_sdk
       try:
           sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"))
           sentry_sdk.capture_message("Infrastructure validation test")
           print("✓ Sentry: Connected (test message sent)")
           return True
       except Exception as e:
           print(f"❌ Sentry: Failed - {e}")
           return False

   def main():
       print("=" * 60)
       print("Infrastructure Connectivity Validation")
       print("=" * 60)

       tests = [
           ("OpenAI API", test_openai),
           ("Qdrant Cloud", test_qdrant),
           ("Neon Postgres", test_neon),
           ("Upstash Redis", test_upstash),
           ("Sentry", test_sentry)
       ]

       results = {}
       for name, test_func in tests:
           results[name] = test_func()
           print()

       print("=" * 60)
       print("Summary")
       print("=" * 60)
       passed = sum(results.values())
       total = len(results)

       print(f"Passed: {passed}/{total}")

       if passed == total:
           print("\n✅ All infrastructure services are accessible!")
           print("Ready to proceed to Phase 1 implementation.")
           return 0
       else:
           print("\n❌ Some infrastructure services are not accessible.")
           print("Fix the failing services before proceeding to Phase 1.")
           return 1

   if __name__ == "__main__":
       sys.exit(main())
   ```

2. **Run Validation**:
   ```bash
   cd backend/
   python scripts/validate-infra.py
   ```

3. **Expected Output**:
   ```
   ============================================================
   Infrastructure Connectivity Validation
   ============================================================
   ✓ OpenAI API: Connected (embedding generation working)

   ✓ Qdrant Cloud: Connected (1 collections)

   ✓ Neon Postgres: Connected (PostgreSQL 16.x)

   ✓ Upstash Redis: Connected (ping successful)

   ✓ Sentry: Connected (test message sent)

   ============================================================
   Summary
   ============================================================
   Passed: 5/5

   ✅ All infrastructure services are accessible!
   Ready to proceed to Phase 1 implementation.
   ```

**Expected Result**: All 5 services pass connectivity tests

**Status**: [ ] Complete

---

## Phase 0 Completion Checklist

Before marking Phase 0 as complete:

- [ ] T001: Build validation passed
- [ ] T002: Production site serves correctly (optional for now)
- [ ] T003: Static deployment confirmed (no runtime servers)
- [ ] T004: Constitution reviewed and approved
- [ ] T005: Specification reviewed and approved
- [ ] T006: Approval document created
- [ ] T007: Qdrant Cloud collection created
- [ ] T008: Neon Postgres database provisioned
- [ ] T009: OpenAI API key created and tested
- [ ] T010: Sentry monitoring setup
- [ ] T011: Upstash Redis instance created
- [ ] T012: Environment variables configured
- [ ] T013: Infrastructure connectivity validated

**Phase 0 Status**: ⏸️ **PENDING** (waiting for infrastructure provisioning)

**Blocker**: Tasks T007-T013 require manual provisioning of external services. Once complete, run `backend/scripts/validate-infra.py` to verify all services are accessible.

---

## Cost Estimation (Free Tier)

| Service | Free Tier | Estimated Usage | Cost |
|---------|-----------|-----------------|------|
| Qdrant Cloud | 1GB vectors | ~100k chunks (3072-dim) | $0 |
| Neon Postgres | 0.5GB storage | ~10k conversations | $0 |
| OpenAI API | Pay-per-use | ~$50/month (10k queries) | $50 |
| Sentry | 5k events/month | ~2k errors/month | $0 |
| Upstash Redis | 10k commands/day | ~5k rate limit checks/day | $0 |
| **Total** | | | **~$50/month** |

**Note**: Free tiers are sufficient for development and MVP testing. Production may require paid tiers.

---

**Document Status**: Active
**Next Steps**: Complete tasks T007-T013, then run validation script
