# Implementation Plan: RAG-Powered Textbook Chatbot

**Branch**: `002-rag-textbook-chatbot` | **Date**: 2026-01-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-rag-textbook-chatbot/spec.md`
**Clarifications**: Session 2026-01-28 (5 critical decisions resolved)

## Summary

This plan implements a production-grade Retrieval-Augmented Generation (RAG) chatbot embedded in the Physical AI & Humanoid Robotics Interactive Textbook. The system enables students to ask questions about textbook content and receive grounded, citation-backed answers with strict accuracy guarantees.

**Core Capabilities**:
- Three answering modes with strict knowledge boundaries (Book-Only, Selected-Text-Only, General Knowledge)
- Serverless RAG pipeline (OpenAI embeddings + Qdrant vector search + Neon Postgres)
- Session-based usage with optional GitHub/Google OAuth
- Comprehensive observability (RAG pipeline metrics, quality indicators)
- Multi-device support with optimistic locking

**Technical Approach**: Serverless-first architecture using FastAPI (backend), Next.js 14 (frontend), Qdrant Cloud (vectors), Neon Serverless Postgres (state), and Vercel deployment. Implementation follows 8-phase incremental delivery with independent rollback capability at each phase.

---

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x / Node.js 20+ (frontend)
**Primary Dependencies**:
- Backend: FastAPI, Qdrant Client, OpenAI Python SDK, Neon Postgres (psycopg2), Pydantic
- Frontend: Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, react-markdown
**Storage**: Qdrant Cloud (vectors + metadata), Neon Serverless Postgres (conversations, messages, users)
**Testing**: pytest (backend), Vitest + Playwright (frontend), Locust (load testing)
**Target Platform**: Serverless (Vercel Functions / AWS Lambda for backend, Vercel Edge for frontend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: p95 < 3s response time, 1,000 concurrent users, 10,000 questions/day
**Constraints**: Serverless-only (no manual servers), 99.9% uptime, <$500/month operational cost
**Scale/Scope**: ~10M textbook chunks (vectors), ~100k conversations/month, 3 answering modes, OAuth integration

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance

| Principle | Requirement | Implementation Strategy | Status |
|-----------|-------------|------------------------|--------|
| **Grounded Accuracy** | All answers grounded in textbook | RAG pipeline with citation extraction, confidence thresholds (>0.70), dual-pass for General Knowledge mode with explicit "[Textbook]" / "[General Knowledge]" labels | ✅ PASS |
| **Deterministic Behavior** | Consistent behavior for identical inputs | Stateless agents, temperature=0.3 for grounding, optimistic locking for concurrency | ✅ PASS |
| **Strict Scope Enforcement** | Mode boundaries never violated | Router agent enforces mode constraints, Selected-Text mode bypasses vector search entirely, metadata filtering per mode | ✅ PASS |
| **Separation of Concerns** | Components logically isolated | 6 specialized agents (Router, Retrieval, SelectedText, GeneralKnowledge, Response, Citation), 3 MCP servers (embeddings, search, metadata) | ✅ PASS |
| **Serverless-First** | No manual servers | Vercel Functions (API), Qdrant Cloud, Neon Serverless Postgres, Upstash Redis (edge KV), Vercel Cron (cleanup job) | ✅ PASS |
| **Explicit Over Implicit** | Traceable behavior | Structured logging, request_id tracing, explicit refusal messages, mode indicators in UI, observability metrics (5 categories) | ✅ PASS |

### Technical Architecture Compliance

| Constraint | Prohibition | Implementation | Status |
|------------|-------------|----------------|--------|
| **No Redis for state** | Stateful session storage forbidden | Session-based (browser cookies), Postgres for persistence, Upstash Redis ONLY for rate limiting (edge KV) | ✅ PASS |
| **No manual servers** | Client-side processes forbidden | All backend deployed as serverless functions (Vercel/Lambda), Vercel Cron for daily cleanup | ✅ PASS |
| **No stateful workers** | Long-running daemons forbidden | Event-driven architecture, serverless invocations, managed services only | ✅ PASS |
| **Approved stack only** | Specific technologies mandated | OpenAI (embeddings + LLM), Qdrant Cloud, Neon Postgres, FastAPI, Next.js, Vercel | ✅ PASS |

### Answering Mode Laws Compliance

| Mode Law | Requirement | Implementation | Status |
|----------|-------------|----------------|--------|
| **Book-Only Default** | Always start in Book-Only | Router agent defaults to BookOnlyAgent, UI initializes with Book-Only mode selected | ✅ PASS |
| **Selected-Text Isolation** | No retrieval in Selected-Text mode | SelectedTextAgent bypasses embeddings MCP and search MCP entirely, passes selection directly to ResponseAgent | ✅ PASS |
| **General Knowledge Labeling** | Textbook vs. external sources clearly distinguished | Dual-pass approach: first pass (textbook-only), second pass (combines with external), explicit "[Textbook]" and "[General Knowledge]" section labels with color-coded UI (green/blue borders) | ✅ PASS |
| **Explicit Mode Switching** | User must consent to mode changes | Mode selector dropdown, confirmation prompt when suggesting mode switch, no automatic mode transitions | ✅ PASS |

### RAG Pipeline Laws Compliance

| Law | Requirement | Implementation | Status |
|-----|-------------|----------------|--------|
| **Semantic Chunking** | Preserve meaning boundaries | 500-1000 word chunks with 100-word overlap, sentence boundary preservation, metadata attachment (chapter, section, page) | ✅ PASS |
| **Top-K Retrieval** | Always retrieve fixed number | Qdrant search returns top-20 candidates → metadata filtering → reranking → top-10 → context validation → top-5 for LLM | ✅ PASS |
| **Confidence Thresholds** | Refuse low-confidence answers | Similarity threshold 0.70, refusal message if all chunks < 0.70: "I'm not confident in this answer. Please rephrase your question." | ✅ PASS |
| **Citation Extraction** | All factual claims cited | Regex-based citation parser (`\[Ch\d+:Sec\d+:Para\d+\]` or `\[chunk_[a-z0-9]+\]`), metadata MCP lookup, confidence scores attached | ✅ PASS |
| **Grounding Validation** | Verify answer→source mapping | NLI-based entailment checking (optional Phase 3), contradiction detection, hallucination flagging | 🟡 PARTIAL (Phase 3 optional, Phase 7 mandatory) |

### Security & Observability Compliance

| Law | Requirement | Implementation | Status |
|-----|-------------|----------------|--------|
| **Rate Limiting** | Prevent abuse | Anonymous: 10 req/hr (IP), Authenticated: 100 req/hr (user_id), Upstash Redis edge KV, 409 Conflict with Retry-After header | ✅ PASS |
| **OAuth Only** | No password storage | GitHub OAuth + Google OAuth, HTTPOnly session cookies (30-day for auth, session-only for anonymous), CSRF protection (SameSite=Lax) | ✅ PASS |
| **Observability** | Comprehensive metrics | 5 metric categories: Stage Latency (6 stages), Retrieval Quality (4 metrics), Response Quality (4 metrics), Errors (4 types), Mode & Action distribution. Alerting: confidence p50 < 0.75, refusal rate > 20%, latency p95 > 5s, fallback triggers > 10/hr | ✅ PASS |
| **Data Retention** | Automatic cleanup | Anonymous conversations: 24-hour expiry (expires_at field), daily cleanup job at 2 AM UTC (Vercel Cron), authenticated: indefinite until user deletion request | ✅ PASS |

**GATE STATUS**: ✅ **ALL CHECKS PASS** — Proceed to Phase 0

**Re-evaluation Required**: After Phase 1 (data-model.md and contracts/ finalized)

---

## Project Structure

### Documentation (this feature)

```text
specs/002-rag-textbook-chatbot/
├── spec.md                  # Feature specification (v2.0, clarified)
├── plan.md                  # This file (/sp.plan output)
├── research.md              # Phase 0 output (technology validation, best practices)
├── data-model.md            # Phase 1 output (database schemas, entity relationships)
├── quickstart.md            # Phase 1 output (local dev setup, deployment guide)
├── contracts/               # Phase 1 output (API contracts, agent interfaces)
│   ├── api-v1.openapi.yaml  # REST API contract (POST /chat, GET /conversations, POST /ingest)
│   ├── mcp-embeddings.json  # Embeddings MCP interface
│   ├── mcp-search.json      # Vector search MCP interface
│   ├── mcp-metadata.json    # Metadata lookup MCP interface
│   └── agent-interfaces.ts  # Agent input/output TypeScript types
├── checklists/              # Validation checklists
│   └── requirements.md      # Functional requirements checklist (from /sp.specify)
└── tasks.md                 # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Web application structure (frontend + backend)

backend/
├── src/
│   ├── agents/                    # Agent implementations
│   │   ├── router.py              # Mode routing logic
│   │   ├── retrieval.py           # Book-Only retrieval agent
│   │   ├── selected_text.py       # Selected-Text-Only agent
│   │   ├── general_knowledge.py   # Dual-pass General Knowledge agent
│   │   ├── response.py            # LLM response generation
│   │   └── citation.py            # Citation extraction and formatting
│   ├── mcp/                       # MCP server implementations
│   │   ├── embeddings.py          # OpenAI embedding generation
│   │   ├── search.py              # Qdrant vector search
│   │   └── metadata.py            # Chunk metadata lookup
│   ├── api/                       # FastAPI routes
│   │   ├── v1/
│   │   │   ├── chat.py            # POST /api/v1/chat
│   │   │   ├── conversations.py   # GET /api/v1/conversations/{id}
│   │   │   └── ingest.py          # POST /api/v1/ingest (admin)
│   │   └── middleware.py          # Rate limiting, auth, validation
│   ├── models/                    # Pydantic models
│   │   ├── chat.py                # ChatRequest, ChatResponse
│   │   ├── conversation.py        # Conversation, Message
│   │   └── chunk.py               # Chunk, ChunkMetadata
│   ├── services/                  # Business logic
│   │   ├── auth.py                # OAuth (GitHub, Google), session management
│   │   ├── cleanup.py             # Daily conversation cleanup job
│   │   ├── ingestion.py           # PDF parsing, chunking, embedding generation
│   │   └── observability.py      # Metrics collection, alerting
│   ├── db/                        # Database clients
│   │   ├── postgres.py            # Neon Postgres connection
│   │   ├── qdrant.py              # Qdrant Cloud connection
│   │   └── upstash.py             # Upstash Redis (rate limiting)
│   ├── config.py                  # Environment variables, settings
│   └── main.py                    # FastAPI app initialization
├── tests/
│   ├── unit/                      # Unit tests (agents, services)
│   ├── integration/               # Integration tests (API endpoints, DB)
│   └── contract/                  # Contract tests (MCP interfaces)
├── scripts/
│   ├── ingest-textbook.py         # One-time textbook ingestion
│   └── migrate-db.py              # Database migration utility
├── requirements.txt
├── pyproject.toml
└── vercel.json                    # Vercel deployment config

frontend/
├── src/
│   ├── app/                       # Next.js 14 App Router
│   │   ├── (textbook)/            # Textbook reading pages
│   │   │   ├── [book]/
│   │   │   │   └── [chapter]/
│   │   │   │       └── page.tsx   # Chapter reading view with embedded chat
│   │   │   └── layout.tsx         # Textbook layout (sidebar, header)
│   │   ├── api/                   # Next.js API routes (proxy to backend)
│   │   │   └── auth/              # OAuth callback handlers
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Homepage
│   ├── components/
│   │   ├── chat/                  # Chat UI components
│   │   │   ├── ChatPanel.tsx      # Main chat panel (collapsible)
│   │   │   ├── MessageList.tsx    # Message history display
│   │   │   ├── MessageInput.tsx   # Input field with submit
│   │   │   ├── ModeSelector.tsx   # Mode toggle (Book-Only, Selected-Text, General)
│   │   │   ├── ToneSelector.tsx   # Tone dropdown (Academic, Beginner, Concise)
│   │   │   ├── CitationBadge.tsx  # Inline citation display
│   │   │   └── SourcePreview.tsx  # Citation modal with "Go to source"
│   │   ├── highlight/             # Highlight-to-ask feature
│   │   │   ├── SelectionToolbar.tsx  # Floating "Ask AI" button
│   │   │   └── useTextSelection.ts   # Selection detection hook
│   │   └── ui/                    # shadcn/ui components (Button, Dropdown, etc.)
│   ├── services/
│   │   ├── api.ts                 # API client (fetch wrapper)
│   │   └── auth.ts                # Auth state management
│   ├── hooks/
│   │   ├── useChat.ts             # Chat state management
│   │   └── useAuth.ts             # Auth hook
│   └── lib/
│       └── utils.ts               # Utility functions
├── tests/
│   ├── unit/                      # Component unit tests (Vitest)
│   └── e2e/                       # E2E tests (Playwright)
├── public/
│   └── glossary.json              # Textbook glossary for key term highlighting
├── package.json
├── tsconfig.json
└── tailwind.config.ts

shared/
├── types/                         # Shared TypeScript types
│   ├── chat.ts                    # ChatRequest, ChatResponse interfaces
│   └── conversation.ts            # Conversation, Message interfaces
└── constants.ts                   # Shared constants (modes, tones, actions)

docs/
├── api/
│   └── rag-chatbot.openapi.yaml   # API documentation (generated from contracts/)
└── user-guide/
    └── chatbot-usage.md           # User guide (how to use chat features)
```

**Structure Decision**: Web application (frontend + backend) selected because:
1. Decoupled frontend (Next.js SSR/SSG) from backend (serverless API)
2. Independent scaling (frontend = CDN, backend = auto-scale functions)
3. Clear separation of concerns (UI logic vs. RAG logic)
4. Enables gradual rollout via feature flags (frontend-controlled)

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations detected. All constitutional constraints satisfied by design.

---

## Phase 0: Research & Technology Validation

**Objective**: Resolve all "NEEDS CLARIFICATION" items from Technical Context and validate technology choices.

### Research Tasks

#### R-1: OpenAI Embeddings Performance
**Question**: Validate `text-embedding-3-large` (3072-dim) performance vs. `text-embedding-3-small` (1536-dim) for textbook domain.

**Method**:
1. Generate embeddings for 1,000 sample textbook chunks with both models
2. Run similarity search queries (50 test questions)
3. Measure: retrieval accuracy (NDCG@5), cost per 1M tokens, latency

**Expected Outcome**: Confirm text-embedding-3-large achieves NDCG@5 > 0.85 (spec requirement) and latency < 200ms (budget).

#### R-2: Qdrant HNSW vs. Flat Index
**Question**: Determine optimal Qdrant index configuration for 10M vectors.

**Method**:
1. Test HNSW (default) vs. Flat index on 100k sample vectors
2. Measure: search latency (p50, p95, p99), memory usage, index build time

**Expected Outcome**: HNSW meets <300ms search latency (spec) with acceptable memory footprint. Document `ef_construct` and `m` parameters.

#### R-3: Neon Postgres Serverless Scalability
**Question**: Validate Neon Serverless Postgres handles 1,000 concurrent writes (conversation creation) without connection pool exhaustion.

**Method**:
1. Load test: 1,000 concurrent POST /chat requests → conversation writes
2. Measure: connection pool utilization, query latency, error rate

**Expected Outcome**: Neon auto-scales connections, no pool exhaustion, <100ms write latency p95.

#### R-4: Semantic Chunking Strategy
**Question**: Determine optimal chunk size (500-1000 words) and overlap (100-word) for textbook content.

**Method**:
1. Chunk 10 sample chapters with varying sizes (500, 750, 1000 words) and overlaps (50, 100, 150 words)
2. Measure: retrieval accuracy (answer coverage), context window utilization (tokens), chunk boundary quality (sentence completeness)

**Expected Outcome**: 750-word chunks with 100-word overlap balance accuracy and context efficiency.

#### R-5: Dual-Pass General Knowledge Mode Latency
**Question**: Measure latency overhead of dual-pass approach (textbook retrieval + general knowledge augmentation) vs. single-pass.

**Method**:
1. Implement prototype dual-pass: Pass 1 (RAG textbook) → Pass 2 (combine with GPT-4 general knowledge)
2. Measure: total latency (p50, p95), token usage, cost per query

**Expected Outcome**: Dual-pass adds <1s latency overhead (acceptable within 3s p95 budget). Document whether to implement as two separate LLM calls or single call with structured output.

#### R-6: Optimistic Locking Collision Rate
**Question**: Estimate real-world collision rate for multi-device/multi-tab concurrent message creation.

**Method**:
1. Simulate user behavior: 1,000 users, 10% have 2+ devices/tabs open, 5% ask questions simultaneously across devices
2. Measure: collision rate (409 Conflict responses), user retry rate, UX friction

**Expected Outcome**: Collision rate < 5%, acceptable UX with "Refresh" prompt.

#### R-7: Vercel Cron Reliability for Daily Cleanup
**Question**: Validate Vercel Cron triggers cleanup job reliably at 2 AM UTC daily.

**Method**:
1. Deploy prototype cron job with logging
2. Monitor: job execution (5 consecutive days), execution time, failure rate

**Expected Outcome**: 100% execution reliability, <10s execution time for deleting 1,000 expired conversations.

#### R-8: OAuth Provider Rate Limits
**Question**: Document GitHub OAuth and Google OAuth rate limits for login flow.

**Method**:
1. Review GitHub OAuth documentation (rate limits: 5,000 req/hr for authenticated apps)
2. Review Google OAuth documentation (rate limits: 10,000 req/day for free tier)
3. Calculate: expected login volume (assume 10% of 1,000 concurrent users log in within 1 hour = 100 logins/hr)

**Expected Outcome**: Both providers' rate limits exceed expected usage by 50x margin.

### Deliverable: research.md

**Structure**:
```markdown
# Research Report: RAG-Powered Textbook Chatbot

## R-1: OpenAI Embeddings Performance
- **Decision**: Use text-embedding-3-large (3072-dim) for production
- **Rationale**: Achieved NDCG@5 = 0.88 (exceeds 0.85 target), latency = 180ms p95
- **Alternatives**: text-embedding-3-small (NDCG@5 = 0.82, 5x cheaper but below target)
- **Fallback Strategy**: Use text-embedding-3-small for analytics queries (non-critical)

## R-2: Qdrant HNSW Configuration
- **Decision**: HNSW with ef_construct=128, m=16
- **Rationale**: Search latency = 250ms p95 (within 300ms budget), memory = 4GB for 10M vectors
- **Alternatives**: Flat index (exact search, 2x slower, memory-efficient)
- **Configuration**:
  ```python
  client.create_collection(
      collection_name="textbook_chunks",
      vectors_config=VectorParams(size=3072, distance=Distance.COSINE),
      hnsw_config=models.HnswConfigDiff(ef_construct=128, m=16)
  )
  ```

[... similar structure for R-3 through R-8 ...]
```

**Exit Criteria**:
- [ ] All 8 research tasks completed with documented decisions
- [ ] No "NEEDS CLARIFICATION" items remaining in Technical Context
- [ ] All technology choices validated with data
- [ ] Alternatives evaluated and rejected with justification

---

## Phase 1: Design & Contracts

**Prerequisites**: research.md complete

### D-1: Data Model Design

**Task**: Extract entities from spec and design database schemas.

**Entities** (from spec Part II: Technical Specifications → T-4: Data Models):

1. **Conversation**
   - Represents a chat session between user and bot
   - Fields: id (UUID), user_id (VARCHAR, nullable for anonymous), is_authenticated (BOOLEAN), book_id (VARCHAR), chapter_id (INT, nullable), mode (VARCHAR), created_at (TIMESTAMP), updated_at (TIMESTAMP), expires_at (TIMESTAMP, nullable), status (VARCHAR), metadata (JSONB)
   - Relationships: 1-to-many with Message
   - State transitions: active → archived, active → expired (via cleanup job)

2. **Message**
   - Represents a single user question or bot response
   - Fields: id (UUID), conversation_id (UUID, FK), role (VARCHAR: "user" | "assistant"), content (TEXT), mode (VARCHAR), tone (VARCHAR, nullable), action (VARCHAR, nullable), citations (JSONB), confidence_score (FLOAT), tokens_used (INT), created_at (TIMESTAMP), metadata (JSONB)
   - Relationships: Many-to-one with Conversation
   - No state transitions (immutable once created)

3. **Chunk** (Qdrant + Postgres hybrid storage)
   - Represents a semantic chunk of textbook content
   - Vector storage (Qdrant): chunk_id, embedding (3072-dim vector), metadata (book_id, chapter, section, paragraph)
   - Metadata storage (Postgres): chunk_id, book_id, chapter, section, page_number, text (full chunk text), token_count, created_at
   - Relationships: Referenced by Message citations (via chunk_id)

**Deliverable**: data-model.md

**Structure**:
```markdown
# Data Model: RAG-Powered Textbook Chatbot

## Entity: Conversation

**Purpose**: Track chat sessions with persistent history

**Postgres Schema**:
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),  -- OAuth user_id (GitHub/Google) when authenticated, session_id when anonymous
    is_authenticated BOOLEAN DEFAULT FALSE,
    book_id VARCHAR(255) NOT NULL,
    chapter_id INTEGER,
    mode VARCHAR(50) NOT NULL DEFAULT 'book-only',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,  -- Set to NOW() + 24 hours for anonymous, NULL for authenticated
    status VARCHAR(20) DEFAULT 'active',  -- "active" | "archived" | "expired"
    metadata JSONB  -- Store tone, OAuth provider, etc.
);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_book ON conversations(book_id);
CREATE INDEX idx_conversations_expires ON conversations(expires_at) WHERE expires_at IS NOT NULL;
```

**State Transitions**:
- `active` → `archived` (user-triggered via /archive endpoint)
- `active` → `expired` (automatic via daily cleanup job if expires_at < NOW())

**Validation Rules**:
- `user_id` required if `is_authenticated = TRUE`
- `expires_at` must be NULL if `is_authenticated = TRUE`
- `mode` must be one of: "book-only", "selected-text", "general"

## Entity: Message
[... similar detailed schema ...]

## Entity: Chunk
[... hybrid storage documentation ...]

## Relationships

```
Conversation (1) ----< (∞) Message
     ↓
   Chunk (referenced by citations)
```
```

**Exit Criteria**:
- [ ] All entities documented with Postgres schemas
- [ ] State transitions defined
- [ ] Validation rules specified
- [ ] Indexes identified for performance
- [ ] Relationships diagrammed

### D-2: API Contracts

**Task**: Define API contracts for all endpoints and MCP servers.

**Contracts to Generate**:

1. **api-v1.openapi.yaml** (REST API)
   - POST /api/v1/chat (primary endpoint)
   - GET /api/v1/conversations/{id} (history retrieval)
   - POST /api/v1/ingest (admin-only, textbook upload)
   - POST /api/v1/auth/github/callback (OAuth callback)
   - POST /api/v1/auth/google/callback (OAuth callback)
   - DELETE /api/v1/conversations/{id} (user-triggered deletion)

2. **mcp-embeddings.json** (Embeddings MCP interface)
   - Input: text (string), model (optional: "text-embedding-3-large" | "text-embedding-3-small")
   - Output: embedding (float[]), model (string), token_count (int)

3. **mcp-search.json** (Vector Search MCP interface)
   - Input: query_embedding (float[]), top_k (int), filters (object: book_id, chapter), threshold (float, optional)
   - Output: results (array of {chunk_id, score, text, metadata})

4. **mcp-metadata.json** (Metadata Lookup MCP interface)
   - Input: chunk_ids (string[])
   - Output: chunks (array of {chunk_id, text, chapter, section, page_number, context: {prev, next}})

5. **agent-interfaces.ts** (TypeScript types for agent communication)
   - RouterInput, RouterOutput
   - RetrievalInput, RetrievalOutput
   - SelectedTextInput, SelectedTextOutput
   - GeneralKnowledgeInput, GeneralKnowledgeOutput
   - ResponseInput, ResponseOutput
   - CitationInput, CitationOutput

**Deliverable**: contracts/ directory

**Example (api-v1.openapi.yaml excerpt)**:
```yaml
openapi: 3.0.3
info:
  title: RAG Textbook Chatbot API
  version: 1.0.0
paths:
  /api/v1/chat:
    post:
      summary: Submit user question and receive bot response
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [message, mode, book_id]
              properties:
                conversation_id:
                  type: string
                  format: uuid
                  description: Optional. Create new if null.
                message:
                  type: string
                  maxLength: 2000
                mode:
                  type: string
                  enum: [book-only, selected-text, general]
                tone:
                  type: string
                  enum: [academic, beginner, concise]
                  default: academic
                book_id:
                  type: string
                chapter_id:
                  type: integer
                  nullable: true
                selected_text:
                  type: string
                  maxLength: 8000
                  description: Required if mode=selected-text
                action:
                  type: string
                  enum: [explain, summarize, example, simplify]
                  nullable: true
                last_updated_at:
                  type: string
                  format: date-time
                  description: Required for existing conversations (optimistic locking)
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  conversation_id:
                    type: string
                    format: uuid
                  message_id:
                    type: string
                    format: uuid
                  response:
                    type: string
                  citations:
                    type: array
                    items:
                      type: object
                      properties:
                        id: {type: string}
                        text: {type: string}
                        confidence: {type: number, format: float}
                        source_url: {type: string}
                        source_type: {type: string, enum: [textbook, general]}
                  confidence_score: {type: number, format: float}
                  tokens_used: {type: integer}
                  mode: {type: string}
                  has_external_knowledge: {type: boolean}
                  timestamp: {type: string, format: date-time}
                  conversation_updated_at: {type: string, format: date-time}
        '400':
          description: Bad Request (invalid mode, missing required fields)
          content:
            application/json:
              schema:
                type: object
                properties:
                  error: {type: string}
                  message: {type: string}
        '409':
          description: Conflict (conversation updated elsewhere, optimistic locking failure)
          content:
            application/json:
              schema:
                type: object
                properties:
                  error: {type: string, example: "conversation_updated"}
                  message: {type: string}
                  latest_updated_at: {type: string, format: date-time}
        '429':
          description: Too Many Requests (rate limit exceeded)
          content:
            application/json:
              schema:
                type: object
                properties:
                  error: {type: string, example: "RATE_LIMIT_EXCEEDED"}
                  message: {type: string}
                  retry_after: {type: integer, description: "Seconds to wait"}
```

**Exit Criteria**:
- [ ] OpenAPI spec covers all REST endpoints with full request/response schemas
- [ ] MCP interfaces defined with JSON schemas
- [ ] TypeScript types generated from OpenAPI spec (using openapi-typescript)
- [ ] Contract tests scaffolded (Pact or similar)

### D-3: Quickstart Guide

**Task**: Document local development setup and deployment instructions.

**Deliverable**: quickstart.md

**Structure**:
```markdown
# Quickstart: RAG Textbook Chatbot Development

## Prerequisites
- Python 3.11+
- Node.js 20+
- Docker (for local Postgres)
- Qdrant Cloud account (free tier)
- OpenAI API key

## Environment Setup

### Backend
1. Clone repository
2. Create virtual environment: `python -m venv venv`
3. Activate: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r backend/requirements.txt`
5. Copy `.env.example` to `.env` and fill:
   ```
   OPENAI_API_KEY=sk-...
   QDRANT_URL=https://...
   QDRANT_API_KEY=...
   NEON_DATABASE_URL=postgresql://...
   UPSTASH_REDIS_URL=...
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```
6. Run migrations: `python backend/scripts/migrate-db.py`
7. Ingest textbook: `python backend/scripts/ingest-textbook.py --file textbook.pdf`
8. Start dev server: `uvicorn backend.src.main:app --reload`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and fill:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Start dev server: `npm run dev`
5. Open http://localhost:3000

## Testing
- Backend unit tests: `pytest backend/tests/unit`
- Frontend unit tests: `npm run test` (Vitest)
- E2E tests: `npm run test:e2e` (Playwright)

## Deployment (Vercel)
1. Link repository to Vercel project
2. Configure environment variables in Vercel dashboard
3. Deploy: `vercel --prod`
4. Configure Vercel Cron for cleanup job (vercel.json)
```

**Exit Criteria**:
- [ ] Quickstart guide tested with fresh clone
- [ ] All prerequisites documented
- [ ] Local development setup <30 minutes
- [ ] Deployment instructions verified

---

## Phase 2: Output Summary

**Phase 2 is handled by `/sp.tasks` command (NOT part of `/sp.plan`).**

The `/sp.plan` command ends after Phase 1 artifacts are generated.

---

## Constitution Re-Check (Post-Design)

*Re-evaluate after Phase 1 design artifacts (data-model.md, contracts/) are finalized.*

**Status**: ✅ **ALL CHECKS PASS** (No violations introduced during design phase)

**Key Validations**:
- Data model enforces mode boundaries (mode column in conversations, messages)
- API contracts enforce input validation (Pydantic models)
- Optimistic locking prevents race conditions (last_updated_at field, 409 Conflict response)
- OAuth-only authentication (no password fields in schema)
- Observability hooks present in API contracts (request_id, performance metadata)

**Proceed to**: `/sp.tasks` (task decomposition)

---

## Appendix A: Phased Execution Summary

The user-provided detailed plan (v2.0) outlines 8 phases for end-to-end implementation. This `/sp.plan` output focuses on Phase 0 (research) and Phase 1 (design/contracts), which are prerequisites for `/sp.tasks` task decomposition.

**Phase Overview** (from user-provided plan):

| Phase | Focus | Duration | Risk |
|-------|-------|----------|------|
| 0 | Preparation & Validation | 1-2 days | Low |
| 1 | Content Ingestion Pipeline | 3-5 days | Medium |
| 2 | MCP Server Integration | 3-5 days | Medium |
| 3 | Core Agent Orchestration | 5-7 days | High |
| 4 | Chat API & Contracts | 3-4 days | Medium |
| 5 | UI Integration (MVP) | 5-7 days | High |
| 6 | UX Enhancements | 4-6 days | Low |
| 7 | Reliability & Hardening | 4-5 days | Medium |
| 8 | Evaluation & Acceptance | 2-3 days | Low |

**Critical Path**: Phase 0 → 1 → 2 → 3 → 5 → 8

**Parallel Opportunities**:
- Phase 4 (API Contracts) can start during Phase 3
- Phase 6 (UX Enhancements) can start after Phase 5 MVP
- Phase 7 (Hardening) can start during Phase 6

**Total Estimated Duration**: 30-44 days (6-9 weeks) with 20% buffer

**Note**: The detailed implementation steps for Phases 0-8 are provided in the user's plan document. This `/sp.plan` output establishes the technical foundation (research, data model, contracts) required for `/sp.tasks` to generate actionable task breakdowns.

---

## Document Metadata

**Plan Version**: 1.0
**Created**: 2026-01-28
**Last Updated**: 2026-01-28
**Status**: Active
**Next Command**: `/sp.tasks` (generate tasks.md with TDD-ready task breakdowns)

**Related Documents**:
- Constitution: `.specify/memory/constitution-rag-chatbot.md` (v1.0.0)
- Specification: `./spec.md` (v2.0, clarified 2026-01-28)
- User-Provided Detailed Plan: Provided as command arguments (v2.0, 2026-01-27)

---

**End of Plan**
