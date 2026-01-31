# Tasks: RAG-Powered Textbook Chatbot

**Input**: Design documents from `/specs/002-rag-textbook-chatbot/`
**Prerequisites**: plan.md (complete), spec.md (complete)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Tests**: Test tasks are included only for phases requiring validation (as per spec.md Part VI: Testing & Validation requirements).

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 0: Preparation & Validation

**Purpose**: Baseline validation and infrastructure provisioning

### T0.1: Validate Existing Build

- [x] T001 Run `npm run build` and verify successful compilation
- [x] T002 Run `npm run serve` and verify production site loads at http://localhost:3000
- [x] T003 Verify no runtime servers required (static deployment check)

### T0.2: Approve Foundation Documents

- [x] T004 Review and approve `.specify/memory/constitution-rag-chatbot.md`
- [x] T005 Review and approve `specs/002-rag-textbook-chatbot/spec.md`
- [x] T006 Document stakeholder sign-off in `specs/002-rag-textbook-chatbot/approval.md`

### T0.3: Provision Infrastructure

- [x] T007 [P] Create Qdrant Cloud collection (textbook_chunks, 3072 dim, HNSW index M=16, EF=100)
- [x] T008 [P] Provision Neon Serverless Postgres database
- [x] T009 [P] Create GEMINI API key and test embedding generation
- [x] T010 [P] Setup Sentry monitoring project
- [x] T011 [P] Setup Upstash Redis instance for rate limiting
- [x] T012 Configure all credentials in environment variables (`.env.example` template in `backend/`)
- [x] T013 Validate infrastructure connectivity (`backend/scripts/validate-infra.py`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T014 Create backend project structure (`backend/src/`, `backend/tests/`, `backend/scripts/`)
- [x] T015 Create frontend project structure (`frontend/src/`, `frontend/tests/`, `frontend/public/`)
- [x] T016 [P] Initialize Python 3.11+ backend with FastAPI dependencies (`backend/requirements.txt`)
- [x] T017 [P] Initialize Next.js 14 frontend with TypeScript (`frontend/package.json`)
- [x] T018 [P] Configure linting (Ruff for backend, ESLint for frontend)
- [x] T019 [P] Configure formatting (Black for backend, Prettier for frontend)
- [x] T020 Setup shared TypeScript types directory (`shared/types/`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & Storage Setup

- [x] T021 Create Postgres schema migrations framework (`backend/db/migrations/`)
- [x] T022 Implement Postgres connection pool in `backend/src/db/postgres.py`
- [x] T023 Implement Qdrant client wrapper in `backend/src/db/qdrant.py`
- [x] T024 Implement Upstash Redis client in `backend/src/db/upstash.py`
- [x] T025 Create database schema for conversations table in `backend/db/migrations/001_create_conversations.sql`
- [x] T026 Create database schema for messages table in `backend/db/migrations/002_create_messages.sql`
- [x] T027 Create database indexes (user_id, book_id, expires_at) in `backend/db/migrations/003_create_indexes.sql`
- [x] T028 Run migrations and validate schema in `backend/scripts/migrate-db.py`

### Authentication Framework

- [x] T029 [P] Implement GitHub OAuth integration in `backend/src/services/auth.py`
- [x] T030 [P] Implement Google OAuth integration in `backend/src/services/auth.py`
- [x] T031 Implement session management (HTTPOnly cookies) in `backend/src/services/auth.py`
- [x] T032 Create OAuth callback endpoints in `backend/src/api/v1/auth.py`
- [x] T033 Implement anonymous session generation in `backend/src/services/auth.py`

### API Infrastructure

- [x] T034 Setup FastAPI app initialization in `backend/src/main.py`
- [x] T035 Implement rate limiting middleware in `backend/src/api/middleware.py`
- [x] T036 Implement request validation middleware in `backend/src/api/middleware.py`
- [x] T037 Implement error handling middleware in `backend/src/api/middleware.py`
- [x] T038 Implement CORS configuration in `backend/src/main.py`
- [x] T039 Setup request ID tracing in `backend/src/api/middleware.py`

### Base Models

- [x] T040 [P] Create Pydantic models for Conversation in `backend/src/models/conversation.py`
- [x] T041 [P] Create Pydantic models for Message in `backend/src/models/message.py`
- [x] T042 [P] Create Pydantic models for Chunk in `backend/src/models/chunk.py`
- [x] T043 [P] Create Pydantic models for ChatRequest in `backend/src/models/chat.py`
- [x] T044 [P] Create Pydantic models for ChatResponse in `backend/src/models/chat.py`

### Configuration & Logging

- [x] T045 Implement environment configuration in `backend/src/config.py`
- [x] T046 Setup structured logging in `backend/src/services/observability.py`
- [x] T047 Implement Sentry integration in `backend/src/services/observability.py`
- [x] T048 Setup metrics collection framework in `backend/src/services/observability.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Question Answering in Book-Only Mode (Priority: P1) 🎯 MVP

**Goal**: Enable students to ask questions about textbook content and receive accurate, citation-backed answers derived exclusively from the textbook.

**Independent Test**: Load a textbook chapter, ask a question about a concept covered in that chapter, and verify the answer contains inline citations pointing to specific chapter sections.

### Content Ingestion for User Story 1

- [x] T049 [US1] Implement PDF text extraction in `backend/src/services/ingestion.py`
- [x] T050 [US1] Implement semantic chunking (512-1024 tokens, 10-15% overlap) in `backend/src/services/ingestion.py`
- [x] T051 [US1] Implement chunk metadata extraction (chapter, section, page) in `backend/src/services/ingestion.py`
- [x] T052 [US1] Create ingestion script `backend/scripts/ingest-textbook.py`
- [x] T053 [US1] Validate chunk quality (100 random chunks manual review)

### MCP Servers for User Story 1

- [x] T054 [P] [US1] Implement Embeddings MCP server in `backend/src/mcp/embeddings.py`
- [x] T055 [P] [US1] Implement Search MCP server in `backend/src/mcp/search.py`
- [x] T056 [P] [US1] Implement Metadata MCP server in `backend/src/mcp/metadata.py`
- [x] T057 [US1] Write contract tests for Embeddings MCP in `backend/tests/contract/test_embeddings_mcp.py`
- [x] T058 [US1] Write contract tests for Search MCP in `backend/tests/contract/test_search_mcp.py`
- [x] T059 [US1] Write contract tests for Metadata MCP in `backend/tests/contract/test_metadata_mcp.py`

### Core RAG Agents for User Story 1

- [x] T060 [US1] Implement Router Agent in `backend/src/agents/router.py`
- [x] T061 [US1] Implement Retrieval Agent (Book-Only) in `backend/src/agents/retrieval.py`
- [x] T062 [US1] Implement Response Agent with tone support in `backend/src/agents/response.py`
- [x] T063 [US1] Implement Citation Agent in `backend/src/agents/citation.py`
- [x] T064 [US1] Implement confidence threshold validation (0.70) in `backend/src/agents/retrieval.py`
- [x] T065 [US1] Write unit tests for Router Agent in `backend/tests/unit/test_router.py`
- [x] T066 [US1] Write unit tests for Retrieval Agent in `backend/tests/unit/test_retrieval.py`
- [x] T067 [US1] Write unit tests for Citation Agent in `backend/tests/unit/test_citation.py`

### Chat API for User Story 1

- [x] T068 [US1] Implement POST /api/v1/chat endpoint in `backend/src/api/v1/chat.py`
- [x] T069 [US1] Implement conversation creation logic in `backend/src/api/v1/chat.py`
- [x] T070 [US1] Implement optimistic locking for concurrent messages in `backend/src/api/v1/chat.py`
- [x] T071 [US1] Implement GET /api/v1/conversations/{id} endpoint in `backend/src/api/v1/conversations.py`
- [x] T072 [US1] Write integration tests for /chat endpoint in `backend/tests/integration/test_chat_api.py`

### Frontend for User Story 1

- [x] T073 [P] [US1] Create ChatPanel component in `frontend/src/components/chat/ChatPanel.tsx`
- [x] T074 [P] [US1] Create MessageList component in `frontend/src/components/chat/MessageList.tsx`
- [x] T075 [P] [US1] Create MessageInput component in `frontend/src/components/chat/MessageInput.tsx`
- [x] T076 [P] [US1] Create ModeSelector component in `frontend/src/components/chat/ModeSelector.tsx`
- [x] T077 [P] [US1] Create CitationBadge component in `frontend/src/components/chat/CitationBadge.tsx`
- [x] T078 [P] [US1] Create SourcePreview modal component in `frontend/src/components/chat/SourcePreview.tsx`
- [x] T079 [US1] Implement useChat hook in `frontend/src/hooks/useChat.ts`
- [x] T080 [US1] Implement API client in `frontend/src/services/api.ts`
- [x] T081 [US1] Integrate ChatPanel into textbook layout in `frontend/src/app/(textbook)/layout.tsx`
- [X] T082 [US1] Write component tests for ChatPanel in `frontend/tests/unit/ChatPanel.test.tsx`
- [X] T083 [US1] Write E2E test for basic question flow in `frontend/tests/e2e/book-only-mode.spec.ts`

### Validation for User Story 1

- [ ] T084 [US1] Manual QA: 50 test questions in Book-Only mode
- [ ] T085 [US1] Verify citation accuracy > 95% (50 questions)
- [ ] T086 [US1] Verify no hallucinations (0% rate on 50 questions)
- [ ] T087 [US1] Verify p95 latency < 3s (load test 100 concurrent requests)

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Highlight-to-Ask for Selected Text (Priority: P1)

**Goal**: Enable students to highlight text passages and receive explanations strictly constrained to the highlighted content without introducing external information.

**Independent Test**: Highlight a paragraph, trigger "Explain" action, verify the response references only the highlighted text and includes the full highlighted passage in the response context.

### Selected-Text Agent for User Story 2

- [ ] T088 [US2] Implement Selected-Text Agent in `backend/src/agents/selected_text.py`
- [ ] T089 [US2] Implement selection validation (50-4000 tokens) in `backend/src/agents/selected_text.py`
- [ ] T090 [US2] Implement insufficient context detection in `backend/src/agents/selected_text.py`
- [ ] T091 [US2] Write unit tests for Selected-Text Agent in `backend/tests/unit/test_selected_text.py`
- [ ] T092 [US2] Verify zero vector searches triggered (unit test)

### Text Actions for User Story 2

- [ ] T093 [P] [US2] Implement "Explain" action in `backend/src/agents/response.py`
- [ ] T094 [P] [US2] Implement "Summarize" action in `backend/src/agents/response.py`
- [ ] T095 [P] [US2] Implement "Example" action in `backend/src/agents/response.py`
- [ ] T096 [P] [US2] Implement "Simplify" action in `backend/src/agents/response.py`

### Frontend Highlight-to-Ask for User Story 2

- [ ] T097 [P] [US2] Implement text selection detection hook in `frontend/src/components/highlight/useTextSelection.ts`
- [ ] T098 [P] [US2] Create SelectionToolbar component in `frontend/src/components/highlight/SelectionToolbar.tsx`
- [ ] T099 [US2] Integrate SelectionToolbar into textbook pages in `frontend/src/app/(textbook)/[book]/[chapter]/page.tsx`
- [ ] T100 [US2] Implement mobile touch selection support in `frontend/src/components/highlight/useTextSelection.ts`
- [ ] T101 [US2] Write E2E test for highlight-to-ask flow in `frontend/tests/e2e/highlight-to-ask.spec.ts`

### Validation for User Story 2

- [ ] T102 [US2] Manual QA: 50 highlight-to-ask queries
- [ ] T103 [US2] Verify no external information introduced (50 queries)
- [ ] T104 [US2] Verify all 4 actions work correctly (Explain, Summarize, Example, Simplify)

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Interactive Chat with Tone Control (Priority: P2)

**Goal**: Enable students to customize response tone (Academic, Beginner-friendly, Concise) while maintaining citation accuracy.

**Independent Test**: Ask the same question with "Academic" and "Beginner-friendly" tones, verify that Academic responses use technical language and Beginner-friendly responses use analogies/simpler vocabulary, but both maintain identical citations.

### Tone Control Implementation for User Story 3

- [ ] T105 [US3] Implement tone parameter in Response Agent in `backend/src/agents/response.py`
- [ ] T106 [US3] Implement Academic tone prompting in `backend/src/agents/response.py`
- [ ] T107 [US3] Implement Beginner-friendly tone prompting in `backend/src/agents/response.py`
- [ ] T108 [US3] Implement Concise tone prompting in `backend/src/agents/response.py`
- [ ] T109 [US3] Write unit tests for all tones in `backend/tests/unit/test_tone_control.py`

### Frontend Tone Selector for User Story 3

- [ ] T110 [US3] Create ToneSelector component in `frontend/src/components/chat/ToneSelector.tsx`
- [ ] T111 [US3] Implement tone persistence in localStorage in `frontend/src/hooks/useChat.ts`
- [ ] T112 [US3] Integrate ToneSelector into ChatPanel in `frontend/src/components/chat/ChatPanel.tsx`
- [ ] T113 [US3] Write component tests for ToneSelector in `frontend/tests/unit/ToneSelector.test.tsx`

### Validation for User Story 3

- [ ] T114 [US3] Manual QA: Compare 20 questions across all 3 tones
- [ ] T115 [US3] Verify citation accuracy identical across tones
- [ ] T116 [US3] Verify tone observable in responses (linguistic analysis)

**Checkpoint**: User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Citation Navigation and Source Preview (Priority: P2)

**Goal**: Enable students to click citations to see source previews and navigate to the exact textbook passage.

**Independent Test**: Ask a question, click a citation badge in the response, verify the preview displays the correct passage, click "Go to source," verify navigation to the correct chapter/section.

### Backend Citation Metadata for User Story 4

- [ ] T117 [US4] Enhance Metadata MCP to include context (prev/next chunks) in `backend/src/mcp/metadata.py`
- [ ] T118 [US4] Implement batch metadata lookup (/metadata/batch endpoint) in `backend/src/mcp/metadata.py`

### Frontend Source Navigation for User Story 4

- [ ] T119 [US4] Enhance CitationBadge with hover tooltip in `frontend/src/components/chat/CitationBadge.tsx`
- [ ] T120 [US4] Enhance SourcePreview modal with full passage + confidence score in `frontend/src/components/chat/SourcePreview.tsx`
- [ ] T121 [US4] Implement "Go to source" navigation in `frontend/src/components/chat/SourcePreview.tsx`
- [ ] T122 [US4] Implement paragraph highlighting with 2-second fade in `frontend/src/app/(textbook)/[book]/[chapter]/page.tsx`
- [ ] T123 [US4] Write E2E test for citation navigation in `frontend/tests/e2e/citation-navigation.spec.ts`

### Validation for User Story 4

- [ ] T124 [US4] Manual QA: Test citation navigation for 20 different citations
- [ ] T125 [US4] Verify scroll-to-source works on desktop and mobile

**Checkpoint**: User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Key Term Highlighting in Responses (Priority: P3)

**Goal**: Automatically highlight key technical terms in responses, making them clickable for quick glossary definitions.

**Independent Test**: Ask a question, verify key terms are highlighted in the response, click a highlighted term, verify a glossary definition tooltip appears.

### Glossary Infrastructure for User Story 5

- [ ] T126 [US5] Create glossary JSON file in `frontend/public/glossary.json`
- [ ] T127 [US5] Implement key term detection in Response Agent in `backend/src/agents/response.py`
- [ ] T128 [US5] Implement glossary term highlighting in MessageList in `frontend/src/components/chat/MessageList.tsx`
- [ ] T129 [US5] Create GlossaryTooltip component in `frontend/src/components/chat/GlossaryTooltip.tsx`
- [ ] T130 [US5] Write E2E test for key term highlighting in `frontend/tests/e2e/key-term-highlighting.spec.ts`

### Validation for User Story 5

- [ ] T131 [US5] Manual QA: Test term detection on 30 responses
- [ ] T132 [US5] Verify detection accuracy > 85%

**Checkpoint**: User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Mode Switching and Boundary Enforcement (Priority: P1)

**Goal**: Enable students to understand when they're getting textbook-grounded answers vs. general knowledge, with clear prompts to switch modes.

**Independent Test**: Ask a question that partially overlaps with textbook content, verify the response includes only textbook-grounded information and a clear prompt to switch modes for external information.

### General Knowledge Mode Implementation for User Story 6

- [ ] T133 [US6] Implement General Knowledge Agent (dual-pass) in `backend/src/agents/general_knowledge.py`
- [ ] T134 [US6] Implement first pass (textbook-only retrieval) in `backend/src/agents/general_knowledge.py`
- [ ] T135 [US6] Implement second pass (combine with external knowledge) in `backend/src/agents/general_knowledge.py`
- [ ] T136 [US6] Implement source labeling ([Textbook] / [General Knowledge]) in `backend/src/agents/general_knowledge.py`
- [ ] T137 [US6] Write unit tests for dual-pass approach in `backend/tests/unit/test_general_knowledge.py`

### Mode Boundary Enforcement for User Story 6

- [ ] T138 [US6] Implement mode boundary validation in Router Agent in `backend/src/agents/router.py`
- [ ] T139 [US6] Implement mode switching prompts in Response Agent in `backend/src/agents/response.py`
- [ ] T140 [US6] Write unit tests for mode boundary enforcement in `backend/tests/unit/test_mode_boundaries.py`

### Frontend Mode Switching for User Story 6

- [ ] T141 [US6] Enhance ModeSelector with General Knowledge mode in `frontend/src/components/chat/ModeSelector.tsx`
- [ ] T142 [US6] Implement source section labels (green/blue borders) in `frontend/src/components/chat/MessageList.tsx`
- [ ] T143 [US6] Implement mode switch confirmation prompt in `frontend/src/components/chat/ModeSelector.tsx`
- [ ] T144 [US6] Write E2E test for mode switching in `frontend/tests/e2e/mode-switching.spec.ts`

### Validation for User Story 6

- [ ] T145 [US6] Manual QA: 100+ test queries across all modes
- [ ] T146 [US6] Verify mode boundaries never violated
- [ ] T147 [US6] Verify Book-Only refuses external topics
- [ ] T148 [US6] Verify Selected-Text never triggers vector search
- [ ] T149 [US6] Verify General Knowledge shows disclaimer

**Checkpoint**: All user stories (1-6) should work independently

---

## Phase 9: Reliability & Security Hardening

**Purpose**: Production readiness improvements

### Rate Limiting & Abuse Protection

- [ ] T150 [P] Implement rate limiting (10/100 req/hr) in `backend/src/api/middleware.py`
- [ ] T151 [P] Implement prompt injection detection in `backend/src/api/middleware.py`
- [ ] T152 Implement IP-based temporary bans in `backend/src/api/middleware.py`

### Graceful Degradation

- [ ] T153 [P] Implement Postgres full-text search fallback in `backend/src/mcp/search.py`
- [ ] T154 [P] Implement request queuing for LLM API downtime in `backend/src/agents/response.py`
- [ ] T155 Implement clear error messages for all failure modes in `backend/src/api/v1/chat.py`

### Security Hardening

- [ ] T156 Run automated security scan (Trufflehog) in CI/CD
- [ ] T157 Verify no API keys in client-side code (automated scan)
- [ ] T158 Implement API key rotation schedule (quarterly) in docs

### Monitoring & Observability

- [ ] T159 [P] Configure Sentry error tracking in `backend/src/main.py`
- [ ] T160 [P] Setup Vercel Analytics with RAG metrics in `frontend/src/app/layout.tsx`
- [ ] T161 Implement RAG pipeline stage metrics in `backend/src/services/observability.py`
- [ ] T162 Implement retrieval quality metrics in `backend/src/services/observability.py`
- [ ] T163 Implement response quality metrics in `backend/src/services/observability.py`
- [ ] T164 Configure alerting thresholds (confidence < 0.75, latency > 5s, refusal > 20%) in Sentry

### Background Jobs

- [ ] T165 Implement daily cleanup job in `backend/src/services/cleanup.py`
- [ ] T166 Configure Vercel Cron for 2 AM UTC execution in `vercel.json`
- [ ] T167 Test cleanup job reliability (5 consecutive days)

---

## Phase 10: Validation & Acceptance Testing

**Purpose**: Final quality assurance before production

### Functional Testing

- [ ] T168 Run automated test suite (Book-Only mode: 50+ queries)
- [ ] T169 Run automated test suite (Selected-Text mode: 50+ queries)
- [ ] T170 Run automated test suite (General Knowledge mode: 20+ queries)
- [ ] T171 Verify all refusal scenarios tested

### Performance Testing

- [ ] T172 Load test: 1,000 concurrent users (`backend/tests/load/locust_test.py`)
- [ ] T173 Verify p50 latency < 2s
- [ ] T174 Verify p95 latency < 3s
- [ ] T175 Verify p99 latency < 5s
- [ ] T176 Verify throughput > 100 req/s sustained

### Quality Validation

- [ ] T177 Manual review: 100 responses across all modes
- [ ] T178 Verify citation accuracy > 95%
- [ ] T179 Verify hallucination rate < 5%
- [ ] T180 Verify grounding rate > 90%

### Security Testing

- [ ] T181 Run OWASP ZAP automated security scan
- [ ] T182 Test rate limiting bypass attempts (should fail)
- [ ] T183 Test prompt injection attempts (should be blocked)
- [ ] T184 Verify no API keys exposed (manual audit)

### Compliance Validation

- [ ] T185 Verify GDPR compliance (data handling, user deletion)
- [ ] T186 Run WCAG AA accessibility audit (Lighthouse score > 90)
- [ ] T187 Verify no PII in logs (manual audit)

### Documentation

- [ ] T188 [P] Update README with deployment instructions
- [ ] T189 [P] Publish API documentation (Swagger UI from OpenAPI spec)
- [ ] T190 [P] Create runbook for common issues in `docs/runbook.md`
- [ ] T191 [P] Create user guide in `docs/user-guide/chatbot-usage.md`
- [ ] T192 Update architecture diagrams in `docs/architecture.md`

### Production Readiness

- [ ] T193 Verify all specifications met (checklist in `specs/002-rag-textbook-chatbot/checklists/requirements.md`)
- [ ] T194 Verify all constitutional constraints satisfied
- [ ] T195 Verify no manual servers required
- [ ] T196 Verify all tests passing
- [ ] T197 Verify performance targets achieved
- [ ] T198 Verify security audit clean
- [ ] T199 Obtain stakeholder approval (documented in `specs/002-rag-textbook-chatbot/approval.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Preparation)**: No dependencies - can start immediately
- **Phase 1 (Setup)**: Depends on Phase 0 approval (T006) - BLOCKS all implementation
- **Phase 2 (Foundational)**: Depends on Phase 1 completion - BLOCKS all user stories
- **Phase 3-8 (User Stories)**: All depend on Phase 2 (Foundational) completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order: US1 → US2 → US6 → US3 → US4 → US5
- **Phase 9 (Hardening)**: Depends on P1 user stories (US1, US2, US6) - can run in parallel with P2/P3 stories
- **Phase 10 (Validation)**: Depends on all desired user stories being complete

### User Story Dependencies (Critical Path)

**Priority 1 (P1) - Critical Path**:

- **US1 (Basic Q&A)**: Foundation for all other stories - MUST complete first
- **US2 (Highlight-to-Ask)**: Independent of US1 but builds on same infrastructure
- **US6 (Mode Switching)**: Completes the core value proposition

**Priority 2 (P2) - Value-Add**:

- **US3 (Tone Control)**: Enhances US1, independent implementation
- **US4 (Citation Navigation)**: Enhances US1, independent implementation

**Priority 3 (P3) - Polish**:

- **US5 (Key Term Highlighting)**: Polish feature, can be added anytime

### Within Each User Story

- Models before services
- Services before agents
- Agents before API endpoints
- Backend endpoints before frontend integration
- Frontend components before E2E tests
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 0-2 (Infrastructure)**:

- T007-T011 (Provision Infrastructure): All can run in parallel
- T014-T020 (Project Setup): Backend and frontend setup can run in parallel
- T029-T030 (OAuth Providers): Can implement in parallel
- T040-T044 (Base Models): All can run in parallel

**User Story 1 (Critical for MVP)**:

- T054-T056 (MCP Servers): All can run in parallel
- T057-T059 (MCP Contract Tests): All can run in parallel
- T073-T078 (Frontend Components): All can run in parallel

**User Story 2**:

- T093-T096 (Text Actions): All can run in parallel
- T097-T098 (Selection Components): Can run in parallel

**User Story 3**:

- T106-T108 (Tone Prompting): All can run in parallel

**Hardening (Phase 9)**:

- T150-T151 (Security): Can run in parallel
- T153-T154 (Fallbacks): Can run in parallel
- T159-T160 (Monitoring): Can run in parallel
- T188-T192 (Documentation): All can run in parallel

**Multiple teams can work on different user stories simultaneously after Phase 2 completes.**

---

## Parallel Example: User Story 1

```bash
# Launch all MCP servers together:
Task: T054 "Implement Embeddings MCP server in backend/src/mcp/embeddings.py"
Task: T055 "Implement Search MCP server in backend/src/mcp/search.py"
Task: T056 "Implement Metadata MCP server in backend/src/mcp/metadata.py"

# Launch all contract tests together:
Task: T057 "Contract test for Embeddings MCP in backend/tests/contract/test_embeddings_mcp.py"
Task: T058 "Contract test for Search MCP in backend/tests/contract/test_search_mcp.py"
Task: T059 "Contract test for Metadata MCP in backend/tests/contract/test_metadata_mcp.py"

# Launch all frontend components together:
Task: T073 "Create ChatPanel component in frontend/src/components/chat/ChatPanel.tsx"
Task: T074 "Create MessageList component in frontend/src/components/chat/MessageList.tsx"
Task: T075 "Create MessageInput component in frontend/src/components/chat/MessageInput.tsx"
Task: T076 "Create ModeSelector component in frontend/src/components/chat/ModeSelector.tsx"
Task: T077 "Create CitationBadge component in frontend/src/components/chat/CitationBadge.tsx"
Task: T078 "Create SourcePreview modal component in frontend/src/components/chat/SourcePreview.tsx"
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US6 Only)

1. Complete Phase 0: Preparation & Validation
2. Complete Phase 1: Setup
3. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
4. Complete Phase 3: User Story 1 (Basic Q&A)
5. Complete Phase 4: User Story 2 (Highlight-to-Ask)
6. Complete Phase 8: User Story 6 (Mode Switching)
7. **STOP and VALIDATE**: Test US1, US2, US6 independently
8. Complete Phase 9: Hardening (critical items only)
9. Complete Phase 10: Validation (MVP scope)
10. Deploy/demo MVP

**MVP Scope**: US1 + US2 + US6 = Complete core value proposition (Book-Only mode + Selected-Text mode + Mode boundaries)

### Incremental Delivery (Full Feature)

1. Complete MVP (US1 + US2 + US6)
2. Add US3 (Tone Control) → Test independently → Deploy
3. Add US4 (Citation Navigation) → Test independently → Deploy
4. Add US5 (Key Term Highlighting) → Test independently → Deploy
5. Complete remaining hardening + validation → Production ready

### Parallel Team Strategy

With 3 developers after Phase 2 completes:

1. **Developer A**: User Story 1 (T049-T087)
2. **Developer B**: User Story 2 (T088-T104)
3. **Developer C**: User Story 6 (T133-T149)

Stories complete and integrate independently, then merge for MVP testing.

---

## Task Summary

**Total Tasks**: 199
**Critical Path Tasks**: 87 (Phase 0-2 + US1 + US2 + US6)
**Parallel Opportunities**: 45+ tasks can run in parallel
**MVP Task Count**: 113 (Phase 0-2 + Phase 3-4 + Phase 8 + Phase 9-10 critical items)

**Estimated Timeline**:

- **Infrastructure (Phase 0-2)**: 5-7 days
- **MVP (US1 + US2 + US6)**: 15-20 days
- **Value-Add (US3 + US4)**: 8-10 days
- **Polish (US5)**: 3-5 days
- **Hardening & Validation**: 6-8 days
- **Total (Full Feature)**: 37-50 days (7.5-10 weeks)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label (e.g., [US1]) maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests are integrated throughout (contract tests, unit tests, integration tests, E2E tests) as per spec.md Part VI requirements
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP-first approach ensures earliest possible value delivery
