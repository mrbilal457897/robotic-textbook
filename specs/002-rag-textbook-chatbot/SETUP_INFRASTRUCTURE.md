# Infrastructure Setup Guide - RAG Textbook Chatbot

This guide will walk you through setting up all the required infrastructure for the RAG-powered textbook chatbot.

## Overview

You'll need to set up the following services:
1. ✅ **Cohere API** - For text embeddings
2. ✅ **Google Gemini API** - For LLM chat responses
3. ✅ **Qdrant Cloud** - Vector database for semantic search
4. ✅ **Neon Postgres** - Serverless database for conversations and metadata
5. ✅ **Upstash Redis** - Rate limiting and caching
6. ✅ **GitHub OAuth** - User authentication (optional)
7. ✅ **Google OAuth** - User authentication (optional)
8. ✅ **Sentry** - Error tracking and monitoring (optional)

**Estimated Setup Time**: 45-60 minutes
**Cost**: Free tiers available for all services (< $50/month for production)

---

## Prerequisites

- [ ] Email address for account registrations
- [ ] Credit card (required for some free tiers, won't be charged)
- [ ] GitHub account
- [ ] Google account (for OAuth)

---

## 1. Cohere API Setup

**Purpose**: Generate high-quality text embeddings (embed-english-v3.0, 1024-dim)

### Steps:

1. **Create Cohere Account**
   - Go to: https://dashboard.cohere.com/welcome/register
   - Sign up with email or Google account
   - Verify your email

2. **Get API Key**
   - After login, go to: https://dashboard.cohere.com/api-keys
   - Your default API key will be visible (starts with random chars)
   - Or click "Create API Key" for a new one
   - Name it: `rag-chatbot-dev`
   - Copy the key immediately
   - **Store safely**: This goes in `backend/.env` as `COHERE_API_KEY`

3. **Test Your Key**
   ```bash
   # Install the SDK first
   pip install cohere

   # Test with Python
   python -c "import cohere; co = cohere.Client('YOUR_API_KEY'); print('✅ Cohere API works!')"
   ```

4. **Test Embedding Generation**
   ```python
   import cohere
   co = cohere.Client("YOUR_API_KEY")

   response = co.embed(
       texts=["Hello world"],
       model="embed-english-v3.0",
       input_type="search_document"
   )

   print(f"✅ Generated {len(response.embeddings[0])}-dimensional embedding")
   # Should output: ✅ Generated 1024-dimensional embedding
   ```

### Cost Estimate:
- **FREE TIER** (Trial):
  - 1,000 API calls/month FREE
  - Perfect for development and testing
  - No credit card required

- **Paid Tier**:
  - embed-english-v3.0: $0.10 per 1M tokens (~100k documents)
  - embed-multilingual-v3.0: $0.10 per 1M tokens
  - **10x cheaper than OpenAI embeddings**

- **Expected Development Cost**: **$0/month** (free tier sufficient)
- **Expected Production Cost**: $5-20/month (10k queries/day)

### Why Cohere for Embeddings?
- ✅ **Industry-leading quality**: Best semantic search performance
- ✅ **Optimized for retrieval**: Designed specifically for RAG systems
- ✅ **1024-dim embeddings**: Great balance of quality and efficiency
- ✅ **Input type specification**: Optimizes embeddings for search vs. classification
- ✅ **10x cheaper than OpenAI**: $0.10 vs $1.30 per 1M tokens
- ✅ **Generous free tier**: 1,000 calls/month for testing

### Embedding Model Options:
- **embed-english-v3.0** (Recommended): 1024-dim, best for English content
- **embed-multilingual-v3.0**: 1024-dim, supports 100+ languages
- **embed-english-light-v3.0**: 384-dim, faster but lower quality

### Input Type Parameter:
When generating embeddings, always specify the input type:
- **search_document**: For indexing textbook chunks (what we use)
- **search_query**: For user questions (query time)
- **classification**: For categorization tasks
- **clustering**: For grouping similar content

### Environment Variables:
```bash
COHERE_API_KEY=your-cohere-api-key-here
COHERE_EMBEDDING_MODEL=embed-english-v3.0
COHERE_INPUT_TYPE=search_document  # For document indexing
```

---

## 2. Google Gemini API Setup

**Purpose**: Generate LLM chat responses (Gemini 1.5 Pro/Flash)

### Steps:

1. **Get API Key from Google AI Studio**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Select "Create API key in new project" or choose existing project
   - Copy the API key immediately (starts with `AIza`)
   - **Store safely**: This goes in `backend/.env` as `GEMINI_API_KEY`

2. **Enable Required APIs** (Usually auto-enabled, but verify)
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Generative Language API"
   - Make sure it's enabled for your project

3. **Test Your Key**
   ```bash
   # Install the SDK first
   pip install google-generativeai

   # Test with Python
   python -c "import google.generativeai as genai; genai.configure(api_key='YOUR_API_KEY'); print('✅ API key works!')"
   ```

4. **Set Usage Limits** (Optional but recommended)
   - Go to: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
   - Set daily request quotas to avoid unexpected charges
   - Recommended for development: 1,000 requests/day

### Cost Estimate:
- **FREE TIER**:
  - Gemini 1.5 Flash: FREE up to 15 requests/minute, 1,500 requests/day
  - Gemini 1.5 Pro: FREE up to 2 requests/minute, 50 requests/day

- **Paid Tier** (if you exceed free limits):
  - Gemini 1.5 Flash: $0.075 per 1M input tokens, $0.30 per 1M output tokens
  - Gemini 1.5 Pro: $1.25 per 1M input tokens, $5.00 per 1M output tokens

- **Expected Development Cost**: **$0/month** (free tier sufficient)
- **Expected Production Cost**: $5-30/month (depending on usage)

### Why Gemini for Chat?
- ✅ **Generous free tier** (1,500 requests/day for Flash)
- ✅ **No credit card required** for free tier
- ✅ **Fast responses** with gemini-1.5-flash
- ✅ **High quality** with gemini-1.5-pro
- ✅ **Multimodal support** (future-ready for image analysis)

### Environment Variables:
```bash
GEMINI_API_KEY=AIza...your-key-here...
GEMINI_CHAT_MODEL=gemini-1.5-pro  # or gemini-1.5-flash for faster/cheaper
```

### Model Selection Guide:
- **gemini-1.5-flash**: Faster, cheaper, great for most queries (recommended for development)
- **gemini-1.5-pro**: Better quality, slower, higher cost (use for production or complex queries)
- **gemini-2.0-flash**: Latest experimental model (even faster)

---

## 3. Qdrant Cloud Setup

**Purpose**: Store and search 1024-dimensional vectors for textbook chunks

### Steps:

1. **Create Qdrant Cloud Account**
   - Go to: https://cloud.qdrant.io/signup
   - Sign up with email or GitHub account
   - Verify your email

2. **Create a Cluster**
   - Click "Create Cluster"
   - Choose **Free Tier** (1GB RAM, 100k vectors)
   - Region: Choose closest to your users (e.g., `us-east-1`)
   - Cluster name: `textbook-vectors-dev`
   - Click "Create"
   - Wait 2-3 minutes for provisioning

3. **Get Cluster URL and API Key**
   - Click on your cluster name
   - Copy **Cluster URL**: `https://xyz.qdrant.io:6333`
   - Go to "API Keys" tab
   - Click "Create API Key"
   - Name: `backend-api-key`
   - Copy the key immediately
   - **Store safely**: These go in `backend/.env`

4. **Create Collection**
   - Option A: Use Qdrant dashboard (Web UI)
     - Click "Collections" → "Create Collection"
     - Name: `textbook_chunks`
     - Vector size: `1024`
     - Distance: `Cosine`
     - Click "Create"

   - Option B: Use Python script (after setup)
     ```python
     from qdrant_client import QdrantClient
     from qdrant_client.models import VectorParams, Distance

     client = QdrantClient(url="YOUR_CLUSTER_URL", api_key="YOUR_API_KEY")

     client.create_collection(
         collection_name="textbook_chunks",
         vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
     )
     ```

5. **Test Connection**
   ```python
   from qdrant_client import QdrantClient

   client = QdrantClient(url="YOUR_URL", api_key="YOUR_KEY")
   print(client.get_collections())  # Should show 'textbook_chunks'
   ```

### Upgrade Path (if needed):
- Free tier: 1GB RAM, 100k vectors
- Paid tier: Starts at $25/month for 2GB RAM, 1M vectors

### Environment Variables:
```bash
QDRANT_URL=https://xyz.qdrant.io:6333
QDRANT_API_KEY=your-api-key-here
QDRANT_COLLECTION_NAME=textbook_chunks
QDRANT_VECTOR_SIZE=1024
```

---

## 4. Neon Serverless Postgres Setup

**Purpose**: Store conversations, messages, and chunk metadata

### Steps:

1. **Create Neon Account**
   - Go to: https://console.neon.tech/signup
   - Sign up with email or GitHub account
   - Verify your email

2. **Create a Project**
   - Click "Create Project"
   - Project name: `rag-chatbot-dev`
   - Region: Choose same as Qdrant (e.g., `us-east-1`)
   - Postgres version: `16` (latest)
   - Click "Create Project"

3. **Get Connection String**
   - After creation, you'll see a connection string
   - Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
   - Click "Copy" button
   - **Store safely**: This goes in `backend/.env` as `NEON_DATABASE_URL`

4. **Enable Connection Pooling (Recommended)**
   - Go to "Connection Details" → "Pooled connection"
   - Copy the pooled connection string (uses port 5432 with connection pooler)
   - Use this in production for better performance

5. **Test Connection**
   ```bash
   psql "postgresql://user:password@host.neon.tech/dbname?sslmode=require"
   ```
   Or with Python:
   ```python
   import psycopg2
   conn = psycopg2.connect("YOUR_CONNECTION_STRING")
   print("Connected successfully!")
   ```

6. **Run Migrations** (after backend setup)
   ```bash
   cd backend
   python scripts/migrate-db.py
   ```

### Free Tier Limits:
- 3GB storage
- 1 shared vCPU
- 100 hours compute time/month
- Auto-suspend after 5 minutes of inactivity
- **Perfect for development!**

### Environment Variables:
```bash
NEON_DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10
```

---

## 5. Upstash Redis Setup

**Purpose**: Rate limiting (edge KV store)

### Steps:

1. **Create Upstash Account**
   - Go to: https://console.upstash.com/login
   - Sign up with email or GitHub account
   - Verify your email

2. **Create Redis Database**
   - Click "Create Database"
   - Database name: `rag-chatbot-ratelimit`
   - Type: **Global** (or Regional if you prefer)
   - Region: Choose closest to your users
   - Click "Create"

3. **Get Connection Details**
   - Click on your database name
   - Copy **Endpoint**: `https://xyz.upstash.io`
   - Copy **REST Token** (click "Show" button)
   - **Store safely**: These go in `backend/.env`

4. **Test Connection**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://xyz.upstash.io/get/test-key
   ```

### Free Tier Limits:
- 10,000 commands/day
- 256MB storage
- Perfect for rate limiting!

### Environment Variables:
```bash
UPSTASH_REDIS_URL=https://xyz.upstash.io
UPSTASH_REDIS_TOKEN=your-token-here
RATE_LIMIT_ANONYMOUS=10
RATE_LIMIT_AUTHENTICATED=100
```

---

## 6. GitHub OAuth Setup (Optional)

**Purpose**: Allow users to log in with GitHub accounts

### Steps:

1. **Create OAuth App**
   - Go to: https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"
   - Application name: `RAG Textbook Chatbot - Dev`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:8000/api/v1/auth/github/callback`
   - Click "Register application"

2. **Get Client Credentials**
   - Copy **Client ID**
   - Click "Generate a new client secret"
   - Copy **Client Secret** immediately
   - **Store safely**: These go in `backend/.env`

3. **Production Setup** (when deploying)
   - Create a separate OAuth app for production
   - Use production URLs:
     - Homepage: `https://your-domain.com`
     - Callback: `https://api.your-domain.com/api/v1/auth/github/callback`

### Environment Variables:
```bash
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/v1/auth/github/callback
```

---

## 7. Google OAuth Setup (Optional)

**Purpose**: Allow users to log in with Google accounts

### Steps:

1. **Create Google Cloud Project**
   - Go to: https://console.cloud.google.com
   - Click "Select a project" → "New Project"
   - Project name: `rag-textbook-chatbot`
   - Click "Create"

2. **Enable OAuth Consent Screen**
   - Go to: APIs & Services → OAuth consent screen
   - User Type: **External**
   - Click "Create"
   - App name: `RAG Textbook Chatbot`
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Click "Add or Remove Scopes"
     - Add: `userinfo.email`, `userinfo.profile`
   - Click "Save and Continue"
   - Test users: Add your email (for testing)
   - Click "Save and Continue"

3. **Create OAuth Credentials**
   - Go to: APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `RAG Chatbot Backend`
   - Authorized redirect URIs:
     - Add: `http://localhost:8000/api/v1/auth/google/callback`
   - Click "Create"
   - Copy **Client ID** and **Client Secret**
   - **Store safely**: These go in `backend/.env`

### Environment Variables:
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
```

---

## 8. Sentry Setup (Optional)

**Purpose**: Error tracking and performance monitoring

### Steps:

1. **Create Sentry Account**
   - Go to: https://sentry.io/signup
   - Sign up with email or GitHub account
   - Verify your email

2. **Create Project**
   - Select platform: **Python** (for backend)
   - Project name: `rag-chatbot-backend`
   - Click "Create Project"

3. **Get DSN**
   - After creation, you'll see a DSN (Data Source Name)
   - Format: `https://key@sentry.io/project-id`
   - Copy the DSN
   - **Store safely**: This goes in `backend/.env`

4. **Create Frontend Project** (separate)
   - Select platform: **Next.js**
   - Project name: `rag-chatbot-frontend`
   - Get frontend DSN for `frontend/.env.local`

### Free Tier Limits:
- 5,000 errors/month
- 10,000 performance units/month
- 1 user
- Perfect for development!

### Environment Variables:
```bash
# Backend
SENTRY_DSN=https://key@sentry.io/project-id
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0.1

# Frontend (in frontend/.env.local)
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/frontend-project-id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

---

## 9. Final Configuration

### 8.1 Create `.env` Files

1. **Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and fill in all the values from steps 1-7
   ```

2. **Frontend**
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # Edit .env.local and fill in the values
   ```

### 8.2 Generate Session Secret

```bash
# Generate a secure random secret (32+ characters)
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and set it as `SESSION_SECRET_KEY` in `backend/.env`

### 8.3 Validate Configuration

Run the infrastructure validation script:

```bash
cd backend
python scripts/validate-infra.py
```

This will test all connections and report any issues.

---

## 10. Cost Summary

| Service | Free Tier | Development Cost | Production Cost (10k queries/day) |
|---------|-----------|------------------|-----------------------------------|
| Cohere Embeddings API | 1,000 calls/month trial | **$0/month** | $5-15/month |
| Google Gemini Chat API | 1,500 req/day free | **$0/month** | $5-30/month |
| Qdrant Cloud | 1GB free | Free | $25-50/month |
| Neon Postgres | 3GB free | Free | Free - $20/month |
| Upstash Redis | 10k cmds/day free | Free | Free |
| GitHub OAuth | Free | Free | Free |
| Google OAuth | Free | Free | Free |
| Sentry | 5k errors/month | Free | $26/month (Team) |
| **TOTAL** | | **$0/month** | **$60-140/month** |

---

## 11. Security Checklist

Before proceeding to development:

- [ ] All API keys stored in `.env` files (NOT committed to git)
- [ ] `.gitignore` includes `.env`, `.env.local`, `*.key`, etc.
- [ ] Session secret is random and at least 32 characters
- [ ] OAuth redirect URIs match your backend URL exactly
- [ ] Billing limits set on OpenAI account ($10-20 for dev)
- [ ] Rate limiting enabled in Upstash
- [ ] Sentry project created with appropriate environment tags
- [ ] Test all connections before proceeding

---

## 12. Next Steps

After infrastructure is set up:

1. ✅ Verify all environment variables are set
2. ✅ Run validation script: `python backend/scripts/validate-infra.py`
3. ✅ Run database migrations: `python backend/scripts/migrate-db.py`
4. ✅ Start backend server: `uvicorn backend.src.main:app --reload`
5. ✅ Start frontend server: `cd frontend && npm run dev`
6. ✅ Test OAuth login flow
7. ✅ Ingest sample textbook: `python backend/scripts/ingest-textbook.py --file sample.pdf`
8. ✅ Test chat functionality

---

## Troubleshooting

### Connection Errors

**Problem**: `Connection refused` or `timeout` errors

**Solutions**:
- Check that URLs don't have trailing slashes
- Verify API keys are correct (no extra spaces)
- Check firewall/VPN settings
- Try from a different network

### Gemini API Rate Limits

**Problem**: `429 Too Many Requests` or quota exceeded errors

**Solutions**:
- **Free Tier Limits**: 1,500 requests/day, 15 requests/minute (Flash), 2 requests/minute (Pro)
- Check quota usage at: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
- Wait for quota reset (resets daily at midnight Pacific Time)
- Enable billing to increase limits: https://console.cloud.google.com/billing
- Use gemini-1.5-flash instead of gemini-1.5-pro (higher rate limits)

### Qdrant Collection Not Found

**Problem**: `Collection 'textbook_chunks' not found`

**Solutions**:
- Create collection manually in dashboard
- Run collection creation script
- Check collection name spelling (case-sensitive)

### Neon Connection Pool Exhausted

**Problem**: `Too many connections` error

**Solutions**:
- Use pooled connection string (port 5432)
- Reduce `DATABASE_POOL_SIZE` in `.env`
- Enable auto-suspend in Neon dashboard

### OAuth Redirect Mismatch

**Problem**: `redirect_uri_mismatch` error

**Solutions**:
- Verify redirect URI in OAuth app settings exactly matches backend URL
- Include protocol (`http://` or `https://`)
- Don't include trailing slashes
- Check for typos

---

## Support

If you encounter issues:

1. Check service status pages:
   - Google Cloud: https://status.cloud.google.com
   - Qdrant: https://status.qdrant.io
   - Neon: https://status.neon.tech
   - Upstash: https://status.upstash.com

2. Review logs:
   ```bash
   # Backend logs
   tail -f backend/logs/backend.log

   # Frontend logs
   npm run dev  # Shows live logs in console
   ```

3. Consult documentation:
   - Gemini API: https://ai.google.dev/docs
   - Python SDK: https://ai.google.dev/tutorials/python_quickstart
   - Qdrant: https://qdrant.tech/documentation
   - Neon: https://neon.tech/docs/introduction
   - Upstash: https://docs.upstash.com

---

**Last Updated**: 2026-01-29
**Spec Version**: 002-rag-textbook-chatbot v2.0
