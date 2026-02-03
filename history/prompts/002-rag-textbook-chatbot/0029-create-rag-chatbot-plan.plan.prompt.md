---
id: 0029
title: Create RAG-Chatbot Implementation Plan
stage: plan
date: 2026-01-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-rag-textbook-chatbot
branch: 002-rag-textbook-chatbot
user: system
command: /sp.plan
labels: ["plan","rag","architecture","implementation","research","design"]
links:
  spec: specs/002-rag-textbook-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-rag-textbook-chatbot/plan.md
tests:
  - No tests created during planning phase
---

## Prompt

Execute the `/sp.plan` workflow to create an implementation plan for the RAG-Powered Textbook Chatbot feature, incorporating the clarified specification (v2.0) with resolved authentication model, data lifecycle, observability strategy, General Knowledge mode, and concurrency control.

**Context**: The specification was clarified in session 0028, resolving all critical ambiguities. The user provided a comprehensive 8-phase detailed plan (v2.0, dated 2026-01-27) containing:

**8-Phase Execution Strategy**:
- **Phase 0: Research & Technology Validation** (1 week) - Validate OpenAI embeddings, Qdrant HNSW configuration, Neon Postgres scalability, semantic chunking strategy, dual-pass latency, optimistic locking collision rates, Vercel Cron reliability, OAuth rate limits
- **Phase 1: Design & Contracts** (3-4 days) - Define data models (Conversation, Message, Chunk), generate API contracts (OpenAPI v1, MCP server schemas), create developer quickstart guide
- **Phase 2: Infrastructure Bootstrap** (2-3 days) - Set up Qdrant Cloud cluster, Neon Postgres database, Vercel project, GitHub OAuth app, monitoring (Sentry, Upstash Metrics)
- **Phase 3: RAG Core Engine** (1.5 weeks) - Implement 6 agents (Router, Retrieval, Selected Text, General Knowledge, Response Generator, Citation Attribution), implement 3 MCP servers (embeddings, search, metadata), build RAG pipeline orchestrator
- **Phase 4: Frontend Chat Interface** (1 week) - Implement chat widget UI, highlight-to-ask functionality, mode switcher, tone control, citation navigation
- **Phase 5: Authentication & Sessions** (3-4 days) - Implement OAuth flows (GitHub, Google), session management, daily cleanup job, optimistic locking
- **Phase 6: Integration & E2E Testing** (1 week) - End-to-end user journeys, cross-mode testing, performance testing (1,000 concurrent users), security testing
- **Phase 7: Observability & Monitoring** (2-3 days) - Implement 5 metric categories, set up alerting thresholds, create dashboards (Sentry, Upstash)
- **Phase 8: Production Deployment** (2-3 days) - Deploy to Vercel, enable Vercel Cron, configure rate limiting, production smoke tests

**Production Deployment Strategy**:
- Deployment Platform: Vercel (serverless functions)
- Environment Separation: Dev, Staging, Production
- Rollout Strategy: Blue-green deployment with manual promotion
- Health Checks: /health endpoint with database connectivity validation
- Rollback: Instant via Vercel dashboard revert

**Risk Management**:
- R1 (High): Qdrant latency spikes → Mitigation: HNSW tuning, FAISS fallback option
- R2 (Medium): OAuth rate limits → Mitigation: Token caching, exponential backoff
- R3 (High): Neon cold starts → Mitigation: Connection pooling, warm-up queries

**Success Metrics**:
- 95% accuracy (evaluated against 100-question test set)
- NDCG@5 > 0.85 (retrieval quality)
- p95 < 3s response time
- 90% user satisfaction
- 99.9% uptime

**Timeline**: 30-44 days (6-9 weeks)

**Task**: Generate implementation plan document at `specs/002-rag-textbook-chatbot/plan.md` following the plan template structure with:
1. Summary
2. Technical Context (language, dependencies, performance goals, constraints)
3. Constitution Check (validate compliance with constitution-rag-chatbot.md)
4. Project Structure (documentation and source code layouts)
5. Complexity Tracking
6. Phase 0: Research & Technology Validation (8 research tasks: R-1 through R-8)
7. Phase 1: Design & Contracts (3 design tasks: D-1 data-model.md, D-2 contracts/, D-3 quickstart.md)
8. Phase 2 note: Handled by /sp.tasks command
9. Constitution Re-Check
10. Appendix referencing user-provided detailed plan

## Response snapshot

✅ Created implementation plan at `specs/002-rag-textbook-chatbot/plan.md` (740 lines) with:

**Summary**:
- RAG-powered chatbot for Physical AI & Humanoid Robotics textbook
- 3 answering modes (Book-Only, Selected-Text-Only, General Knowledge with dual-pass)
- Serverless architecture (FastAPI backend, Next.js 14 frontend, Qdrant, Neon Postgres, OpenAI)
- 8-phase delivery strategy (Phases 0-8)

**Technical Context** (All resolved):
- **Language/Version**: Python 3.11+ (backend), TypeScript 5.x / Node.js 20+ (frontend)
- **Primary Dependencies**:
  - Backend: FastAPI, Qdrant Client, OpenAI Python SDK, Neon Postgres (psycopg2), Pydantic
  - Frontend: Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, react-markdown
- **Storage**: Qdrant Cloud (vectors + metadata), Neon Serverless Postgres (conversations, messages, users)
- **Testing**: pytest (backend), Vitest + Playwright (frontend), Locust (load testing)
- **Performance Goals**: p95 < 3s response time, 1,000 concurrent users, 10,000 questions/day
- **Constraints**: Serverless-only (no manual servers), 99.9% uptime, <$500/month operational cost

**Constitution Check** (25 compliance validations):
1. **Core Principles** (6 checks): All PASS
   - Grounded Accuracy (citations mandatory)
   - Deterministic Behavior (mode boundaries enforced)
   - Strict Scope Enforcement (three modes, no mixed retrieval)
   - Separation of Concerns (6 agents, 3 MCP servers)
   - Serverless-First (Vercel Functions, Qdrant Cloud, Neon Serverless)
   - Explicit Over Implicit (dual-pass with "[Textbook]" / "[General Knowledge]" labels)

2. **Technical Architecture** (4 checks): All PASS
   - No monolithic backend (6-agent architecture)
   - No manual servers (Vercel + managed services)
   - No sync I/O blocking (async FastAPI)
   - MCP-first for RAG components (3 MCP servers planned)

3. **Answering Mode Laws** (4 checks): All PASS
   - Three modes enforced (Book-Only, Selected-Text-Only, General Knowledge)
   - Book-Only: Retrieval + grounding validation
   - Selected-Text-Only: Zero retrieval (context from highlighted text only)
   - General Knowledge: Dual-pass with source labeling

4. **RAG Pipeline Laws** (5 checks): 4 PASS, 1 PARTIAL
   - Semantic chunking mandatory (LangChain RecursiveCharacterTextSplitter)
   - HNSW indexing mandatory (Qdrant default)
   - Reranking mandatory (Cohere Rerank API)
   - Citation extraction mandatory (regex + confidence scoring)
   - Grounding validation: PARTIAL (optional in Phase 3, mandatory in Phase 7)

5. **Security & Observability** (4 checks): All PASS
   - Rate limiting: 10/hr anonymous, 100/hr authenticated
   - Observability: 5 metric categories (Stage Latency, Retrieval Quality, Response Quality, Errors, Mode & Action)
   - OAuth security: GitHub + Google OAuth
   - Data retention: 24-hour expiry for anonymous, daily cleanup job

**GATE STATUS**: ✅ ALL CHECKS PASS (grounding validation deferred to Phase 7)

**Project Structure**:
- **Documentation**: specs/002-rag-textbook-chatbot/ (spec.md, plan.md, tasks.md, research.md, data-model.md, contracts/, quickstart.md)
- **Source Code**: Web application architecture selected
  ```
  backend/
  ├── src/
  │   ├── agents/          # 6 agents: router, retrieval, selected_text, general_knowledge, response, citation
  │   ├── mcp/             # 3 MCP servers: embeddings, search, metadata
  │   ├── api/             # FastAPI routes (v1/chat, v1/conversations, v1/ingest)
  │   ├── models/          # Pydantic models
  │   ├── services/        # auth, cleanup, ingestion, observability
  │   └── db/              # postgres, qdrant, upstash clients

  frontend/
  ├── src/
  │   ├── app/             # Next.js 14 App Router
  │   ├── components/      # chat/, highlight/, ui/
  │   ├── services/        # api, auth
  │   └── hooks/           # useChat, useAuth

  shared/
  ├── types/               # TypeScript interfaces
  └── constants/           # shared configuration

  docs/
  ├── api/                 # API documentation
  ├── architecture/        # diagrams
  └── deployment/          # runbooks
  ```

**Complexity Tracking**: No violations detected (serverless architecture inherently avoids complex state management)

**Phase 0: Research & Technology Validation** (8 research tasks defined):
- **R-1**: OpenAI Embeddings Performance (text-embedding-3-large vs. text-embedding-3-small, measure NDCG@5 and latency)
- **R-2**: Qdrant HNSW Configuration (optimize ef_construct, m, ef for 100K vectors, measure p95 latency)
- **R-3**: Neon Postgres Scalability (connection pooling, concurrent writes, cold start mitigation)
- **R-4**: Semantic Chunking Strategy (LangChain RecursiveCharacterTextSplitter configuration, overlap size)
- **R-5**: Dual-Pass General Knowledge Latency (measure two-pass vs. single-pass response time)
- **R-6**: Optimistic Locking Collision Rate (simulate multi-device usage, measure 409 Conflict frequency)
- **R-7**: Vercel Cron Reliability (test daily cleanup job scheduling, failure handling)
- **R-8**: OAuth Provider Rate Limits (GitHub and Google token refresh limits, error handling)

**Phase 1: Design & Contracts** (3 design tasks defined):
- **D-1**: Generate data-model.md
  - 3 entities: Conversation (with is_authenticated, expires_at, updated_at), Message (with role, content, citations), Chunk (with book_id, chapter_id, embedding)
  - State transitions (conversation lifecycle: active → expired → deleted)
  - Validation rules (mode constraints, citation format)
- **D-2**: Generate contracts/ directory
  - 5 contracts: api-v1.openapi.yaml (POST /chat, GET /conversations, POST /ingest), mcp-embeddings.json, mcp-search.json, mcp-metadata.json, agent-interfaces.ts
- **D-3**: Generate quickstart.md
  - Local development setup (Docker Compose for Qdrant, Neon CLI)
  - Deployment instructions (Vercel CLI, environment variables)

**Phase 2 Note**: Handled by `/sp.tasks` command (task decomposition with TDD-ready breakdowns)

**Constitution Re-Check**: All checks pass post-design

**Appendix A**: References user-provided 8-phase detailed plan (v2.0, 2026-01-27)

## Outcome

- ✅ Impact: Comprehensive implementation plan created for RAG-Chatbot feature; establishes technical foundation, validates constitutional compliance, and defines Phase 0 research and Phase 1 design deliverables
- 🧪 Tests: No tests created (planning phase); test requirements defined in spec.md Part VI (V-1, V-2)
- 📁 Files: 1 file created (`specs/002-rag-textbook-chatbot/plan.md`, 740 lines)
- 🔁 Next prompts: Execute `/sp.tasks` to generate tasks.md with TDD-ready task breakdowns (Phase 2); generate Phase 0 research.md and Phase 1 artifacts (data-model.md, contracts/, quickstart.md) during actual implementation
- 🧠 Reflection: Plan successfully integrates clarified specification (authentication, cleanup, observability, dual-pass, optimistic locking) with user-provided 8-phase execution strategy; constitutional validation ensures serverless-first, MCP-first, and mode boundary enforcement principles are maintained; Phase 0 research tasks resolve all technology validation questions before implementation begins

## Evaluation notes (flywheel)

- Failure modes observed: None; plan template successfully populated with technical context, constitutional compliance checks, and phased delivery structure
- Graders run and results (PASS/FAIL): N/A (plan is design document, not executable code)
- Prompt variant (if applicable): None
- Next experiment: During `/sp.tasks` execution, evaluate whether to generate tasks for all 8 phases or focus only on Phases 0-2 (research, design, infrastructure bootstrap) to enable iterative feedback cycles
