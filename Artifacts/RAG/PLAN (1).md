# Plan — RAG-Powered Textbook Chatbot Integration

## Document Control

**Document Type:** Execution Plan  
**Version:** 2.0  
**Status:** Active  
**Last Updated:** 2026-01-27  
**Related Documents:** CONSTITUTION.md v2.0, SPECIFICATIONS.md v2.0

---

## Purpose

This plan defines the **phased execution strategy** for integrating a production-grade RAG chatbot into the existing interactive textbook platform.

**Answers:** HOW the system will be built (not how it will be coded)

**Ensures:**
- Incremental, non-breaking integration
- Constitutional compliance at every phase
- Agent-safe execution patterns
- Serverless-first deployment
- Independent verification and rollback capability

---

## Guiding Principles

### P-1: Incremental Delivery
- No big-bang releases
- Each phase delivers working functionality
- Early phases provide foundation for later phases

### P-2: Constitutional Compliance
- Every phase must satisfy constitutional constraints
- No temporary violations allowed
- Mode boundaries enforced from Phase 3 onward

### P-3: Independent Verification
- Each phase has explicit exit criteria
- Testing requirements clearly defined
- Success measurable before proceeding

### P-4: Loose Coupling
- Agents communicate via defined contracts
- MCP servers remain stateless
- Frontend/backend decoupled

### P-5: Rollback Safety
- Every phase independently revertible
- Feature flags for UI changes
- Database migrations have down-migrations
- No irreversible changes without approval

---

## Phase Overview

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
| **Total** | **End-to-End** | **30-44 days** | - |

---

## Phase 0 — Preparation & Validation

### Objectives
- Establish stable baseline
- Lock project foundation documents
- Validate existing infrastructure

### Activities

#### 0.1 Environment Validation
- [ ] Confirm existing textbook builds without errors
- [ ] Verify deployment pipeline functional (Vercel/hosting)
- [ ] Test rollback capability
- [ ] Document current architecture

#### 0.2 Document Finalization
- [ ] Review and approve CONSTITUTION.md v2.0
- [ ] Review and approve SPECIFICATIONS.md v2.0
- [ ] Define agent contracts (input/output schemas)
- [ ] List required MCP servers with interfaces

#### 0.3 Infrastructure Setup
- [ ] Provision Qdrant Cloud collection (free tier)
- [ ] Provision Neon Postgres database (free tier)
- [ ] Configure OpenAI API access (check rate limits)
- [ ] Set up monitoring (Sentry/LogTail)

#### 0.4 Risk Assessment
- [ ] Identify integration points with existing code
- [ ] Document breaking change scenarios
- [ ] Create rollback checklist
- [ ] Set up feature flags framework

### Deliverables
- ✅ Approved constitution and specs
- ✅ Infrastructure provisioned
- ✅ Baseline performance metrics captured
- ✅ Risk mitigation plan documented

### Exit Criteria
- [ ] No regressions in existing functionality
- [ ] All foundational documents approved
- [ ] Deployment pipeline verified
- [ ] Infrastructure health checks passing

### Validation
```bash
# Run existing tests
npm test

# Deploy to staging
npm run deploy:staging

# Health check
curl https://staging.textbook.com/health

# Rollback test
npm run deploy:rollback
```

**Risk Level:** Low  
**Estimated Duration:** 1-2 days

---

## Phase 1 — Content Ingestion Pipeline

### Objectives
- Transform textbook content into RAG-ready format
- Store vectors and metadata in managed services
- Establish quality baseline for retrieval

### Activities

#### 1.1 Content Extraction
- [ ] Parse textbook source (Markdown/HTML/DOCX)
- [ ] Extract structural metadata (chapters, sections, pages)
- [ ] Preserve formatting markers (headings, lists, code blocks)
- [ ] Validate extraction completeness (no missing sections)

#### 1.2 Semantic Chunking
- [ ] Implement chunking strategy (512-1024 tokens, 10-15% overlap)
- [ ] Preserve sentence boundaries
- [ ] Attach metadata to each chunk (chapter, section, page)
- [ ] Generate unique chunk IDs (e.g., `ch3_s21_p2`)

**Chunking Script:**
```python
# Example structure (not full implementation)
def chunk_textbook(content, metadata):
    chunks = semantic_split(content, size=1024, overlap=128)
    for i, chunk in enumerate(chunks):
        chunk.id = f"{metadata.chapter}_s{metadata.section}_p{i}"
        chunk.metadata = metadata
    return chunks
```

#### 1.3 Embedding Generation
- [ ] Generate embeddings using `text-embedding-3-large`
- [ ] Batch process (100 chunks per request)
- [ ] Implement retry logic with exponential backoff
- [ ] Log failed chunks for manual review

#### 1.4 Vector Storage
- [ ] Create Qdrant collection with schema (see SPECIFICATIONS.md T-2.3)
- [ ] Upload vectors with metadata
- [ ] Create indexes for efficient search
- [ ] Validate vector count matches chunk count

#### 1.5 Metadata Storage
- [ ] Create Postgres tables (chunks, books, chapters)
- [ ] Store chunk text and metadata
- [ ] Create indexes on frequently queried fields
- [ ] Set up foreign key relationships

**Schema:**
```sql
CREATE TABLE chunks (
    id VARCHAR(100) PRIMARY KEY,
    book_id VARCHAR(50) NOT NULL,
    chapter INT NOT NULL,
    section VARCHAR(50),
    page_number INT,
    text TEXT NOT NULL,
    token_count INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chunks_book_chapter ON chunks(book_id, chapter);
```

#### 1.6 Quality Validation
- [ ] Sample 100 random chunks, verify integrity
- [ ] Test vector search with known queries
- [ ] Validate metadata completeness (no nulls in required fields)
- [ ] Calculate and document baseline metrics

### Deliverables
- ✅ All textbook content chunked and indexed
- ✅ Vectors stored in Qdrant Cloud
- ✅ Metadata stored in Neon Postgres
- ✅ Ingestion script (repeatable, idempotent)
- ✅ Quality report with baseline metrics

### Exit Criteria
- [ ] 100% of textbook content processed
- [ ] Zero ingestion errors
- [ ] Sample queries return relevant results (>0.7 similarity)
- [ ] Metadata integrity validated
- [ ] Ingestion reproducible (<10% variance in processing time)

### Validation
```python
# Validation script
def validate_ingestion():
    # Check vector count
    assert qdrant.count("textbook_chunks") == expected_chunk_count
    
    # Check metadata
    chunks = postgres.query("SELECT * FROM chunks WHERE text IS NULL")
    assert len(chunks) == 0
    
    # Test search
    results = qdrant.search("What caused World War I?", top_k=5)
    assert all(r.score > 0.7 for r in results)
    
    print("✅ Ingestion validated")
```

**Risk Level:** Medium (data quality issues)  
**Estimated Duration:** 3-5 days  
**Rollback:** Delete Qdrant collection and Postgres tables

---

## Phase 2 — MCP Server Integration

### Objectives
- Introduce capability providers (embedding, search, metadata)
- Establish serverless MCP pattern
- Enable agent-MCP communication

### Activities

#### 2.1 Embeddings MCP Server
- [ ] Create MCP server for embedding generation
- [ ] Implement `/embed` endpoint (text → vector)
- [ ] Add batch processing support
- [ ] Deploy as serverless function

**Interface:**
```typescript
// Input
{
  text: string;
  model?: "text-embedding-3-large" | "text-embedding-3-small";
}

// Output
{
  embedding: number[];
  model: string;
  token_count: number;
}
```

#### 2.2 Vector Search MCP Server
- [ ] Create MCP server for Qdrant queries
- [ ] Implement `/search` endpoint (vector + filters → chunks)
- [ ] Add metadata filtering support
- [ ] Implement reranking (optional)

**Interface:**
```typescript
// Input
{
  query_embedding: number[];
  top_k: number;
  filters?: { book_id: string; chapter?: number };
  threshold?: number;
}

// Output
{
  results: Array<{
    chunk_id: string;
    score: number;
    text: string;
    metadata: ChunkMetadata;
  }>;
}
```

#### 2.3 Citation Metadata MCP Server
- [ ] Create MCP server for chunk metadata lookup
- [ ] Implement `/metadata/{chunk_id}` endpoint
- [ ] Add batch lookup support (`/metadata/batch`)
- [ ] Return full chunk context (prev/next chunks)

**Interface:**
```typescript
// Input
{
  chunk_ids: string[];
}

// Output
{
  chunks: Array<{
    chunk_id: string;
    text: string;
    chapter: number;
    section: string;
    page_number: number;
    context?: { prev: string; next: string };
  }>;
}
```

#### 2.4 Stateless Validation
- [ ] Verify no persistent state in MCP servers
- [ ] Test cold starts (first request after idle)
- [ ] Validate independent scalability
- [ ] Measure latency per MCP

### Deliverables
- ✅ Three MCP servers deployed (embeddings, search, metadata)
- ✅ API contracts documented (OpenAPI specs)
- ✅ Health check endpoints (`/health`)
- ✅ Unit tests for each MCP (>80% coverage)

### Exit Criteria
- [ ] All MCPs respond within latency budgets (<200ms for embeddings, <100ms for search)
- [ ] Cold start time <2 seconds
- [ ] No persistent state detected
- [ ] Load testing passed (100 concurrent requests)

### Validation
```bash
# Test embeddings MCP
curl -X POST https://api.textbook.com/mcp/embed \
  -d '{"text": "What is photosynthesis?"}' \
  -H "Content-Type: application/json"

# Test search MCP
curl -X POST https://api.textbook.com/mcp/search \
  -d '{"query_embedding": [...], "top_k": 5}' \
  -H "Content-Type: application/json"

# Test metadata MCP
curl https://api.textbook.com/mcp/metadata/ch3_s21_p2
```

**Risk Level:** Medium (integration complexity)  
**Estimated Duration:** 3-5 days  
**Rollback:** Disable MCP endpoints via feature flag

---

## Phase 3 — Core Agent Orchestration

### Objectives
- Implement decision-making and RAG logic
- Enforce mode boundaries strictly
- Enable end-to-end query → answer flow

### Activities

#### 3.1 Router Agent
- [ ] Implement mode detection logic
- [ ] Route to appropriate handler based on mode
- [ ] Validate mode constraints (e.g., selected-text requires selection)
- [ ] Log routing decisions

**Logic:**
```typescript
function routeQuery(request: ChatRequest): AgentRoute {
  if (request.mode === "selected_text") {
    if (!request.selected_text) {
      return { agent: "ErrorAgent", reason: "missing_selection" };
    }
    return { agent: "SelectedTextAgent" };
  }
  
  if (request.mode === "general_knowledge") {
    return { agent: "GeneralKnowledgeAgent" };
  }
  
  return { agent: "BookOnlyAgent" }; // Default
}
```

#### 3.2 Retrieval Agent (Book-Only Mode)
- [ ] Call embeddings MCP to vectorize query
- [ ] Call search MCP to retrieve top-K chunks
- [ ] Filter by relevance threshold (>0.7)
- [ ] Handle no-results case (explicit refusal)
- [ ] Return retrieved chunks to Response Agent

#### 3.3 Selected-Text Agent
- [ ] Extract selected text from request
- [ ] Validate selection length (50-4000 tokens)
- [ ] Pass selection directly to Response Agent
- [ ] **No vector search** (critical constraint)

#### 3.4 Response Agent
- [ ] Compose LLM prompt with retrieved/selected context
- [ ] Apply tone modifier (if specified)
- [ ] Apply action modifier (if specified)
- [ ] Generate response via OpenAI API
- [ ] Stream response (if supported)

**Prompt Template:**
```
System: You are a helpful textbook assistant. Answer the user's question 
based ONLY on the provided context. Do not use external knowledge.

Context:
{retrieved_chunks}

User Question: {query}

Instructions:
- Answer in a {tone} tone
- {action_modifier}
- Cite sources using chunk IDs
```

#### 3.5 Citation Agent
- [ ] Extract chunk IDs from response
- [ ] Call metadata MCP for full citations
- [ ] Format citations per specifications
- [ ] Attach to response payload

#### 3.6 Grounding Validation
- [ ] Implement basic grounding check (optional for Phase 3)
- [ ] Flag unsupported claims
- [ ] Log validation results

### Deliverables
- ✅ Five agents implemented (Router, Retrieval, SelectedText, Response, Citation)
- ✅ Agent integration tests (end-to-end flows)
- ✅ Mode boundary enforcement validated
- ✅ Logging and tracing configured

### Exit Criteria
- [ ] Queries route correctly to appropriate agent
- [ ] Book-Only mode returns only grounded answers
- [ ] Selected-Text mode never triggers vector search
- [ ] Citations attached correctly (100% of grounded responses)
- [ ] Refusal messages clear and helpful
- [ ] No mode contamination in testing

### Validation
```typescript
// Test cases
test("Book-Only mode retrieves and cites", async () => {
  const response = await chat({
    query: "What caused WWI?",
    mode: "book_only",
    book_id: "history101"
  });
  
  expect(response.answer_type).toBe("book_grounded");
  expect(response.citations.length).toBeGreaterThan(0);
  expect(response.answer).toContain("Chapter");
});

test("Selected-Text mode respects boundaries", async () => {
  const response = await chat({
    query: "Explain this",
    mode: "selected_text",
    selected_text: "Photosynthesis is the process..."
  });
  
  expect(response.answer_type).toBe("book_grounded");
  expect(vectorSearchCalled).toBe(false); // Critical check
});

test("Insufficient context triggers refusal", async () => {
  const response = await chat({
    query: "What is quantum entanglement?",
    mode: "book_only",
    book_id: "biology101"
  });
  
  expect(response.answer_type).toBe("refusal");
  expect(response.answer).toContain("cannot answer");
});
```

**Risk Level:** High (complex logic, mode violations possible)  
**Estimated Duration:** 5-7 days  
**Rollback:** Disable agent routing, return placeholder responses

---

## Phase 4 — Chat API & Contracts

### Objectives
- Establish stable frontend ↔ backend interface
- Define versioned API contracts
- Implement comprehensive error handling

### Activities

#### 4.1 API Schema Definition
- [ ] Define request schema (see SPECIFICATIONS.md T-3.1)
- [ ] Define response schema (see SPECIFICATIONS.md T-3.2)
- [ ] Create OpenAPI 3.0 specification
- [ ] Generate TypeScript types from schema

#### 4.2 Request Validation
- [ ] Implement schema validation middleware (Pydantic/Zod)
- [ ] Validate required fields
- [ ] Enforce field constraints (length, enums)
- [ ] Return 400 with clear error messages

#### 4.3 Response Formatting
- [ ] Standardize success responses
- [ ] Standardize error responses
- [ ] Add request_id for tracing
- [ ] Include performance metadata (tokens_used, response_time_ms)

#### 4.4 Error Handling
- [ ] Map internal errors to user-friendly messages
- [ ] Implement error codes (see SPECIFICATIONS.md T-3.2)
- [ ] Add retry guidance where appropriate
- [ ] Log all errors with context

**Error Mapping:**
```typescript
const errorMap = {
  NoRelevantChunks: {
    code: "RETRIEVAL_FAILED",
    message: "I couldn't find relevant information in the textbook.",
    action: "Try rephrasing your question or browsing related chapters."
  },
  RateLimitExceeded: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "You've reached your request limit.",
    action: "Please wait {retry_after} seconds before trying again."
  }
};
```

#### 4.5 API Versioning
- [ ] Implement `/api/v1/chat` endpoint
- [ ] Add version negotiation (Accept header)
- [ ] Document migration path for future versions
- [ ] Set up deprecation warning system

### Deliverables
- ✅ OpenAPI specification (v1)
- ✅ Generated TypeScript types
- ✅ Request validation middleware
- ✅ Error handling layer
- ✅ API integration tests (contract testing)

### Exit Criteria
- [ ] All valid requests accepted
- [ ] All invalid requests rejected with 400
- [ ] Error messages user-friendly and actionable
- [ ] Contract tests passing (Pact/similar)
- [ ] API documentation published

### Validation
```bash
# Valid request
curl -X POST https://api.textbook.com/api/v1/chat \
  -d '{"query": "What is photosynthesis?", "mode": "book_only", "book_id": "bio101"}' \
  -H "Content-Type: application/json"

# Invalid request (missing required field)
curl -X POST https://api.textbook.com/api/v1/chat \
  -d '{"query": "Test"}' \
  -H "Content-Type: application/json"
# Expected: 400 with error details

# Rate limit test
for i in {1..15}; do
  curl https://api.textbook.com/api/v1/chat -d '{"query": "test", ...}'
done
# Expected: 429 after 10 requests (anonymous tier)
```

**Risk Level:** Medium (breaking changes possible)  
**Estimated Duration:** 3-4 days  
**Rollback:** Route to v0 API (existing endpoint)

---

## Phase 5 — UI Integration (MVP)

### Objectives
- Embed chatbot into textbook reading interface
- Enable core user interactions (ask, highlight, cite)
- Deliver minimum viable product

### Activities

#### 5.1 Chat Panel Component
- [ ] Create collapsible chat panel (React component)
- [ ] Position: Right sidebar (desktop), bottom drawer (mobile)
- [ ] Implement expand/collapse animation
- [ ] Persist state in sessionStorage

**Component Structure:**
```tsx
<ChatPanel
  isOpen={isOpen}
  onToggle={handleToggle}
  book={currentBook}
  chapter={currentChapter}
/>
```

#### 5.2 Message Interface
- [ ] Input field with submit button
- [ ] Message history (scrollable)
- [ ] Loading states (typing indicator)
- [ ] Error state display

#### 5.3 Mode Selector
- [ ] Mode toggle buttons (Book-Only, Selected-Text, General)
- [ ] Visual indicator for active mode
- [ ] Mode descriptions (tooltips)
- [ ] Persist mode selection in session

**UI:**
```
┌─────────────────────────────────┐
│ 📚 Book-Only ✅ | ✂️ Selection | ⚠️ General │
└─────────────────────────────────┘
```

#### 5.4 Highlight-to-Ask
- [ ] Detect text selection via `window.getSelection()`
- [ ] Show "Ask AI" button near selection
- [ ] Auto-populate chat with selection context
- [ ] Clear selection on submit

**Implementation:**
```typescript
function handleTextSelection() {
  const selection = window.getSelection();
  if (selection.toString().length > 10) {
    showAskButton(selection.getRangeAt(0).getBoundingClientRect());
  }
}
```

#### 5.5 Citation Display
- [ ] Render inline citations (superscript or bracketed)
- [ ] Click citation → scroll to source in textbook
- [ ] Hover citation → show preview tooltip (desktop)
- [ ] Format citations per spec (see SPECIFICATIONS.md S-7)

#### 5.6 API Integration
- [ ] Connect to `/api/v1/chat` endpoint
- [ ] Handle loading and error states
- [ ] Display errors user-friendly
- [ ] Implement retry logic

### Deliverables
- ✅ Embedded chat panel (React component)
- ✅ Mode selector UI
- ✅ Highlight-to-ask feature
- ✅ Citation rendering
- ✅ Frontend integration tests (E2E with Playwright)

### Exit Criteria
- [ ] Chat panel visible and functional
- [ ] Highlight-to-ask works smoothly
- [ ] Mode switching working
- [ ] Citations clickable and linked to sources
- [ ] No page reloads during interaction
- [ ] Mobile responsive

### Validation
```typescript
// E2E tests
test("User can ask question and get cited answer", async ({ page }) => {
  await page.goto("/textbook/biology/chapter3");
  await page.click('[data-testid="chat-toggle"]');
  await page.fill('[data-testid="chat-input"]', "What is photosynthesis?");
  await page.click('[data-testid="chat-submit"]');
  
  await page.waitForSelector('[data-testid="chat-message"]');
  
  const message = page.locator('[data-testid="chat-message"]').last();
  expect(await message.textContent()).toContain("Chapter");
  expect(await message.locator('[data-testid="citation"]').count()).toBeGreaterThan(0);
});

test("Highlight-to-ask populates selection", async ({ page }) => {
  await page.goto("/textbook/biology/chapter3");
  await page.selectText('p', 'Photosynthesis is the process');
  await page.click('[data-testid="ask-ai-button"]');
  
  expect(await page.inputValue('[data-testid="chat-input"]')).toContain("Photosynthesis");
});
```

**Risk Level:** High (UI integration complexity)  
**Estimated Duration:** 5-7 days  
**Rollback:** Hide chat panel via feature flag

---

## Phase 6 — UX Enhancements

### Objectives
- Improve usability and comprehension
- Add optional customization features
- Polish user experience

### Activities

#### 6.1 Tone Selector
- [ ] Add tone dropdown (Academic, Beginner, Concise, Detailed, Neutral)
- [ ] Apply tone modifier to prompts
- [ ] Persist tone preference in localStorage
- [ ] Show tone indicator in responses

#### 6.2 Text Action Buttons
- [ ] Add quick action buttons (Explain, Summarize, Examples)
- [ ] Show actions contextually (on selection or in chat)
- [ ] Apply action modifiers to prompts
- [ ] Label responses with action type

**UI:**
```
┌────────────────────────────────┐
│ 💡 Explain | 📝 Summarize | 🔢 Examples │
└────────────────────────────────┘
```

#### 6.3 Key Term Highlighting
- [ ] Load textbook glossary (JSON)
- [ ] Detect and underline key terms in text
- [ ] Implement hover tooltips (desktop)
- [ ] Tap to expand definition (mobile)
- [ ] Add "Ask about term" action

#### 6.4 Citation Previews
- [ ] Implement expandable citation cards
- [ ] Show full chunk text in card
- [ ] Add "View in textbook" link
- [ ] Add "Ask about this" action

#### 6.5 Loading States & Feedback
- [ ] Improve loading indicators (progress bar, animated dots)
- [ ] Add thumbs up/down feedback buttons
- [ ] Implement feedback submission
- [ ] Show success confirmation

### Deliverables
- ✅ Tone selector functional
- ✅ Text action buttons working
- ✅ Key terms highlighted with tooltips
- ✅ Citation previews expandable
- ✅ Feedback mechanism implemented

### Exit Criteria
- [ ] All UX features working without bugs
- [ ] No accuracy regressions from tone changes
- [ ] Key term detection >85% accurate (sampled)
- [ ] UI remains responsive with enhancements
- [ ] User feedback flow tested

### Validation
```typescript
test("Tone selector changes response style", async ({ page }) => {
  await page.selectOption('[data-testid="tone-selector"]', 'beginner');
  await page.fill('[data-testid="chat-input"]', "What is DNA?");
  await page.click('[data-testid="chat-submit"]');
  
  const response = await page.locator('[data-testid="chat-message"]').last().textContent();
  expect(response).toMatch(/simple|easy|basic/i); // Beginner-friendly language
});

test("Key terms are interactive", async ({ page }) => {
  await page.goto("/textbook/biology/chapter1");
  await page.hover('[data-term="photosynthesis"]');
  
  await page.waitForSelector('[data-testid="term-tooltip"]');
  expect(await page.locator('[data-testid="term-tooltip"]').textContent()).toContain("process");
});
```

**Risk Level:** Low (non-critical enhancements)  
**Estimated Duration:** 4-6 days  
**Rollback:** Disable individual features via flags

---

## Phase 7 — Reliability & Security Hardening

### Objectives
- Harden system for production traffic
- Implement security best practices
- Ensure graceful failure handling

### Activities

#### 7.1 Rate Limiting
- [ ] Implement rate limiting via Upstash (edge KV)
- [ ] Configure tiered limits (10/100/1000 per hour)
- [ ] Add burst allowance (2x for 10s)
- [ ] Return 429 with Retry-After header
- [ ] Display user-friendly rate limit message

#### 7.2 Abuse Protection
- [ ] Input validation (max 500 chars)
- [ ] Profanity detection (optional filter)
- [ ] Prompt injection detection (basic patterns)
- [ ] IP-based temporary bans for suspicious activity
- [ ] CAPTCHA for anomalous patterns (e.g., >30 requests in 1 min)

#### 7.3 Graceful Degradation
- [ ] Implement fallback for vector DB failure (keyword search)
- [ ] Queue requests during LLM API downtime
- [ ] Serve cached responses when possible
- [ ] Display clear error messages for each failure type

**Degradation Logic:**
```typescript
async function searchWithFallback(query: string) {
  try {
    return await vectorSearch(query);
  } catch (error) {
    if (error.code === "QDRANT_UNAVAILABLE") {
      logger.warn("Vector DB down, falling back to keyword search");
      return await keywordSearch(query);
    }
    throw error;
  }
}
```

#### 7.4 API Key Protection
- [ ] Verify no keys in client-side code (automated scan)
- [ ] Store keys in environment variables only
- [ ] Redact keys from logs (regex-based)
- [ ] Rotate keys quarterly (set reminder)

#### 7.5 Monitoring & Alerting
- [ ] Configure Sentry for error tracking
- [ ] Set up Uptime monitoring (UptimeRobot or similar)
- [ ] Create dashboards for key metrics (latency, error rate)
- [ ] Configure alerts (error rate >5%, latency p95 >5s)

### Deliverables
- ✅ Rate limiting enforced
- ✅ Abuse protection active
- ✅ Graceful degradation tested
- ✅ Security audit passed (automated scan)
- ✅ Monitoring dashboards operational

### Exit Criteria
- [ ] Rate limits prevent abuse (tested with load scripts)
- [ ] Degradation paths tested (manually disable dependencies)
- [ ] No API keys exposed (verified via scan)
- [ ] Alerts triggering correctly (tested with synthetic errors)
- [ ] 99.9% uptime over 7-day test period

### Validation
```bash
# Test rate limiting
for i in {1..15}; do
  curl https://api.textbook.com/api/v1/chat -d '{"query": "test", ...}'
done
# Expected: 200 for first 10, 429 for next 5

# Test graceful degradation
# 1. Manually stop Qdrant
# 2. Submit query
# Expected: Fallback to keyword search, warning shown to user

# Test monitoring
# 1. Trigger error (invalid API key)
# 2. Check Sentry for event
# 3. Verify alert sent (Slack/email)
```

**Risk Level:** Medium (infrastructure complexity)  
**Estimated Duration:** 4-5 days  
**Rollback:** Disable rate limiting, remove CAPTCHA

---

## Phase 8 — Evaluation & Acceptance

### Objectives
- Validate system against all specifications
- Conduct acceptance testing
- Achieve production-ready status

### Activities

#### 8.1 Functional Testing
- [ ] Test all three answering modes (Book-Only, Selected-Text, General)
- [ ] Verify mode boundaries strictly enforced
- [ ] Test refusal scenarios (no content, ambiguous query)
- [ ] Validate citation accuracy (100 sample responses)

**Test Matrix:**
| Mode | Query Type | Expected Behavior | Status |
|------|-----------|-------------------|--------|
| Book-Only | Textbook content | Cited answer | ✅ |
| Book-Only | External topic | Refusal | ✅ |
| Selected-Text | Answerable from selection | Answer (no retrieval) | ✅ |
| Selected-Text | Not answerable | Refusal | ✅ |
| General | Any topic | Answer + disclaimer | ✅ |

#### 8.2 Performance Testing
- [ ] Load test: 1000 concurrent users
- [ ] Measure latency (p50, p95, p99)
- [ ] Test cold starts (<2s target)
- [ ] Stress test: sustained 100 req/s for 10 min

**Performance Checklist:**
- [ ] p50 latency < 2s
- [ ] p95 latency < 3s
- [ ] p99 latency < 5s
- [ ] Cold start < 2s
- [ ] Throughput > 100 req/s

#### 8.3 Security Testing
- [ ] Run automated security scan (OWASP ZAP)
- [ ] Test rate limiting bypass attempts
- [ ] Attempt prompt injection attacks
- [ ] Verify API key protection (manual audit)

#### 8.4 Quality Validation
- [ ] Manual review of 100 responses
- [ ] Measure citation accuracy (target: >95%)
- [ ] Measure hallucination rate (target: <5%)
- [ ] Calculate grounding rate (target: >90%)

**Quality Metrics:**
| Metric | Target | Actual | Pass? |
|--------|--------|--------|-------|
| Citation Accuracy | >95% | ___ | ___ |
| Hallucination Rate | <5% | ___ | ___ |
| Grounding Rate | >90% | ___ | ___ |
| User Satisfaction | >4.0/5 | ___ | ___ |

#### 8.5 Compliance Validation
- [ ] Verify GDPR compliance (data handling, consent)
- [ ] Check accessibility (WCAG AA)
- [ ] Review privacy policy
- [ ] Confirm no PII in logs

#### 8.6 Documentation Review
- [ ] Update README with deployment instructions
- [ ] Document API endpoints (Swagger UI)
- [ ] Create runbook for common issues
- [ ] Write user guide for chatbot features

### Deliverables
- ✅ Test report (functional, performance, security)
- ✅ Quality metrics dashboard
- ✅ Compliance checklist (all items passed)
- ✅ Production deployment plan
- ✅ Rollback procedure documented

### Exit Criteria
- [ ] All specifications met (SPECIFICATIONS.md)
- [ ] All constitutional constraints satisfied (CONSTITUTION.md)
- [ ] Performance targets achieved
- [ ] Security audit passed
- [ ] Quality metrics within targets
- [ ] Documentation complete
- [ ] Stakeholder approval obtained

### Validation
```bash
# Run full test suite
npm run test:all

# Run E2E tests
npm run test:e2e

# Run load tests
npm run test:load

# Run security scan
npm run security:scan

# Generate quality report
npm run quality:report
```

**Risk Level:** Low (validation only)  
**Estimated Duration:** 2-3 days  
**Outcome:** GO/NO-GO decision for production

---

## Production Deployment

### Pre-Deployment Checklist
- [ ] All Phase 8 exit criteria met
- [ ] Staging environment validated
- [ ] Rollback plan rehearsed
- [ ] Monitoring alerts configured
- [ ] On-call rotation scheduled
- [ ] Feature flags configured for gradual rollout

### Deployment Steps
1. **Deploy Infrastructure** (already provisioned in Phase 0)
2. **Deploy Backend** (API + MCP servers)
   - Blue-green deployment
   - Health checks pass
   - Smoke tests pass
3. **Deploy Frontend** (with feature flag OFF)
   - Verify no regressions in existing features
4. **Enable Feature Flag** (gradual rollout)
   - 1% of users → Monitor for 24 hours
   - 10% of users → Monitor for 48 hours
   - 50% of users → Monitor for 48 hours
   - 100% of users → Full launch
5. **Monitor & Iterate**
   - Watch error rates, latency, user feedback
   - Hot-fix critical issues immediately
   - Plan improvements based on feedback

### Post-Deployment
- [ ] Monitor for 7 days (24/7 on-call)
- [ ] Collect user feedback
- [ ] Generate launch report
- [ ] Plan next iteration (Phase 9+)

---

## Rollback Strategy

### Rollback Triggers
- Error rate >5% sustained for >5 minutes
- p95 latency >10s sustained for >10 minutes
- Critical security vulnerability discovered
- Data loss or corruption detected
- User satisfaction plummets (<3.0/5.0 in first 24h)

### Rollback Procedure
1. **Disable Feature Flag** (instant rollback for UI)
2. **Route Traffic to Previous API Version** (if backend issues)
3. **Notify Users** (via in-app message or banner)
4. **Investigate Root Cause** (review logs, metrics, errors)
5. **Fix & Redeploy** (after thorough testing)

### Phase-Specific Rollback
Each phase has independent rollback capability:

| Phase | Rollback Action | Impact |
|-------|----------------|--------|
| 1 | Delete Qdrant collection & Postgres tables | Data loss (re-ingest) |
| 2 | Disable MCP endpoints | Backend only |
| 3 | Disable agent routing | Backend only |
| 4 | Route to v0 API | Breaking change for new clients |
| 5 | Hide chat panel (feature flag) | UI only |
| 6 | Disable individual UX features | UI only |
| 7 | Remove rate limiting/CAPTCHA | Security risk |

---

## Risk Management

### High-Risk Areas
1. **Phase 3 (Agent Orchestration)** — Complex logic, mode violations possible
2. **Phase 5 (UI Integration)** — User-facing, potential for UX issues
3. **Phase 7 (Hardening)** — Security misconfigurations possible

### Mitigation Strategies
- **Extensive Testing:** Unit, integration, E2E for high-risk phases
- **Feature Flags:** Gradual rollout, instant rollback
- **Monitoring:** Real-time alerts for anomalies
- **Code Review:** Two-person review for critical changes
- **Staging Environment:** Test everything before production

---

## Definition of Done

The project is **DONE** when:

### Technical Criteria
- [ ] All Phase 8 exit criteria met
- [ ] Zero runtime conflicts in production
- [ ] No manual servers or processes required
- [ ] All answers traceable to sources (audit logs)
- [ ] System operates at 99.9% uptime

### Quality Criteria
- [ ] Citation accuracy >95%
- [ ] Hallucination rate <5%
- [ ] Grounding rate >90%
- [ ] User satisfaction >4.0/5.0
- [ ] Mode boundaries never violated in production

### Operational Criteria
- [ ] One-command deployment working
- [ ] Automated rollback tested
- [ ] Monitoring dashboards operational
- [ ] On-call playbook complete
- [ ] Documentation published

### Compliance Criteria
- [ ] GDPR compliant
- [ ] WCAG AA accessible
- [ ] Security audit passed
- [ ] Privacy policy updated

**Final Sign-Off:** Project Lead, Technical Lead, Product Manager

---

## Appendix A: Timeline

**Estimated Total Duration:** 30-44 days (6-9 weeks)

**Critical Path:**
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 5 → Phase 8

**Parallel Work Opportunities:**
- Phase 4 (API Contracts) can start during Phase 3
- Phase 6 (UX Enhancements) can start after Phase 5 MVP
- Phase 7 (Hardening) can start during Phase 6

**Buffer:** 20% (6-9 days) for unexpected issues

---

## Appendix B: Success Metrics

### Launch Metrics (Week 1)
- Adoption rate: >20% of active users try chatbot
- Message volume: >1000 messages/day
- Error rate: <2%
- User satisfaction: >3.5/5.0

### Steady State Metrics (Month 1)
- Weekly active chatbot users: >50% of textbook users
- Average messages per session: >5
- Citation click-through rate: >30%
- User satisfaction: >4.0/5.0
- Return rate: >60% (users return within 7 days)

---

## Document Changelog

**Version 2.0 (2026-01-27):**
- Complete rewrite with detailed phase breakdowns
- Added explicit deliverables and exit criteria for each phase
- Included validation scripts and test cases
- Expanded risk management and rollback strategies
- Added production deployment plan
- Cross-referenced CONSTITUTION.md and SPECIFICATIONS.md

---

## Signature Block

**Plan Version:** 2.0  
**Effective Date:** 2026-01-27  
**Status:** Active  
**Maintained By:** Project Core Team

**Conformance:** This plan executes CONSTITUTION.md v2.0 and SPECIFICATIONS.md v2.0

---

*This plan is the execution blueprint for the RAG-Powered Textbook Chatbot. All development must follow these phases and satisfy exit criteria before proceeding.*
