# Tasks — RAG-Powered Textbook Chatbot

## Document Control

**Version:** 2.0  
**Last Updated:** 2026-01-27  
**Related:** CONSTITUTION.md v2.0, SPECIFICATIONS.md v2.0, PLAN.md v2.0

---

## Task Format

Each task includes:
- **Objective:** What needs to be achieved
- **Acceptance Criteria:** Clear done conditions
- **Validation:** How to verify completion
- **Effort:** S (Small <4h) | M (Medium 4-16h) | L (Large >16h)

### Status Tracking
- 📋 Ready | 🚧 In Progress | ✅ Complete | ⏸️ Blocked

---

## Phase 0 — Preparation & Validation

### T0.1: Validate Existing Build
**Objective:** Confirm baseline system stability

**Acceptance Criteria:**
- [ ] `npm run build` completes without errors
- [ ] Production site loads correctly
- [ ] No runtime servers required
- [ ] Deployment pipeline functional

**Validation:**
```bash
npm run build && npm run serve
curl http://localhost:3000/
```

**Effort:** S | **Priority:** Critical

---

### T0.2: Approve Foundation Documents
**Objective:** Lock specifications before implementation

**Acceptance Criteria:**
- [ ] CONSTITUTION.md reviewed and approved
- [ ] SPECIFICATIONS.md reviewed and approved
- [ ] No conflicts or ambiguities identified
- [ ] Stakeholder sign-off obtained

**Validation:** Approval signatures documented

**Effort:** M | **Priority:** Critical

---

### T0.3: Provision Infrastructure
**Objective:** Set up required cloud services

**Acceptance Criteria:**
- [ ] Qdrant Cloud collection created (textbook_chunks, 3072 dim)
- [ ] Neon Postgres database provisioned
- [ ] OpenAI API key configured and tested
- [ ] Sentry monitoring set up
- [ ] All credentials secured in environment variables

**Validation:**
```bash
curl https://your-cluster.qdrant.io:6333/collections
psql $DATABASE_URL -c "SELECT 1;"
```

**Effort:** S | **Priority:** Critical

---

## Phase 1 — Content Ingestion Pipeline

### T1.1: Extract Textbook Content
**Objective:** Parse all textbook sources into structured format

**Acceptance Criteria:**
- [ ] All content files identified (Markdown, MDX, DOCX)
- [ ] Text extracted preserving structure (headings, sections)
- [ ] Metadata captured (chapter, section, page)
- [ ] Output exported to JSON

**Validation:**
```bash
python scripts/extract_content.py
ls content_extracted/*.json
python scripts/validate_extraction.py
```

**Effort:** M | **Priority:** Critical

---

### T1.2: Implement Semantic Chunking
**Objective:** Split content into optimal retrieval chunks

**Acceptance Criteria:**
- [ ] Chunk size: 512-1024 tokens
- [ ] Overlap: 10-15% (51-154 tokens)
- [ ] No mid-sentence breaks
- [ ] Unique IDs assigned (format: `ch{N}_s{M}_p{K}`)
- [ ] Metadata attached (book_id, chapter, section, page)
- [ ] Deterministic chunking (reproducible)

**Validation:**
```bash
python scripts/chunk_content.py
python scripts/validate_chunks.py --check-all
```

**Effort:** M | **Priority:** Critical

---

### T1.3: Generate Embeddings
**Objective:** Create vector representations for all chunks

**Acceptance Criteria:**
- [ ] Model: `text-embedding-3-large` (3072 dimensions)
- [ ] All chunks embedded (zero failures)
- [ ] Batch processing working (100 chunks/request)
- [ ] Rate limit handling with exponential backoff
- [ ] Embeddings L2 normalized

**Validation:**
```bash
python scripts/generate_embeddings.py
python scripts/validate_embeddings.py --count --dimensions
```

**Effort:** M | **Priority:** Critical

---

### T1.4: Upload Vectors to Qdrant
**Objective:** Store embeddings in vector database

**Acceptance Criteria:**
- [ ] Collection configured (HNSW index, M=16, EF=100)
- [ ] All vectors uploaded (count matches chunks)
- [ ] Metadata attached as payload
- [ ] Sample searches return relevant results (>0.7 similarity)
- [ ] Search latency < 100ms (p95)

**Validation:**
```bash
python scripts/upload_to_qdrant.py
python scripts/test_vector_search.py --query "photosynthesis"
python scripts/benchmark_search.py
```

**Effort:** M | **Priority:** Critical

---

### T1.5: Store Metadata in Postgres
**Objective:** Enable metadata queries and citation resolution

**Acceptance Criteria:**
- [ ] Tables created: chunks, books, chapters
- [ ] All metadata inserted
- [ ] No NULL values in required fields
- [ ] Indexes on: (book_id, chapter), (chunk_id)
- [ ] Query performance < 50ms for ID lookup

**Validation:**
```sql
SELECT COUNT(*) FROM chunks;
SELECT COUNT(*) FROM chunks WHERE text IS NULL;
EXPLAIN ANALYZE SELECT * FROM chunks WHERE chunk_id = 'ch1_s1_p0';
```

**Effort:** S | **Priority:** High

---

### T1.6: Validate Ingestion Quality
**Objective:** Ensure high-quality indexed data

**Acceptance Criteria:**
- [ ] 100 random chunks manually reviewed (zero corruption)
- [ ] Sample queries return relevant results
- [ ] Metadata completeness: 100%
- [ ] Average search similarity > 0.75
- [ ] Quality report generated

**Validation:**
```bash
python scripts/validate_ingestion.py --sample-size 100
python scripts/test_known_queries.py
```

**Effort:** M | **Priority:** High

---

## Phase 2 — MCP Server Integration

### T2.1: Design MCP Interfaces
**Objective:** Define contracts for all MCP servers

**Acceptance Criteria:**
- [ ] Embeddings MCP interface documented
- [ ] Search MCP interface documented
- [ ] Metadata MCP interface documented
- [ ] OpenAPI 3.0 specs created
- [ ] Error codes defined

**Validation:** OpenAPI specs validate with `swagger-cli`

**Effort:** S | **Priority:** High

---

### T2.2: Implement Embeddings MCP
**Objective:** Provide embedding generation service

**Acceptance Criteria:**
- [ ] `/embed` endpoint functional
- [ ] Single and batch input supported (up to 100 texts)
- [ ] Returns 3072-dimensional vectors
- [ ] Response time < 200ms (single), < 2s (batch)
- [ ] Error handling implemented

**Validation:**
```bash
curl -X POST https://api.yoursite.com/mcp/embed \
  -d '{"text": "What is photosynthesis?"}'
```

**Effort:** M | **Priority:** Critical

---

### T2.3: Implement Search MCP
**Objective:** Provide vector similarity search

**Acceptance Criteria:**
- [ ] `/search` endpoint functional
- [ ] Top-K results (configurable, default 5)
- [ ] Metadata filtering (book_id, chapter)
- [ ] Similarity threshold (default 0.7)
- [ ] Response time < 100ms (p95)

**Validation:**
```bash
curl -X POST https://api.yoursite.com/mcp/search \
  -d '{"query_embedding": [...], "top_k": 5}'
```

**Effort:** M | **Priority:** Critical

---

### T2.4: Implement Metadata MCP
**Objective:** Provide citation metadata lookup

**Acceptance Criteria:**
- [ ] `/metadata/{chunk_id}` endpoint functional
- [ ] `/metadata/batch` supports up to 50 IDs
- [ ] Returns full metadata + optional context
- [ ] 404 for non-existent chunks
- [ ] Response time < 50ms (single), < 200ms (batch)

**Validation:**
```bash
curl https://api.yoursite.com/mcp/metadata/ch3_s2_p1
curl -X POST https://api.yoursite.com/mcp/metadata/batch \
  -d '{"chunk_ids": ["ch3_s2_p1", "ch3_s2_p2"]}'
```

**Effort:** S | **Priority:** High

---

### T2.5: Test MCP Statelessness
**Objective:** Verify truly stateless operation

**Acceptance Criteria:**
- [ ] Cold start time < 2 seconds
- [ ] No state leakage between requests
- [ ] Concurrent requests handled independently
- [ ] No memory leaks detected

**Validation:**
```bash
# Wait 10 min, then test cold start
time curl https://api.yoursite.com/mcp/embed -d '{"text": "test"}'
# Test concurrent requests
ab -n 100 -c 10 https://api.yoursite.com/mcp/search
```

**Effort:** S | **Priority:** Medium

---

## Phase 3 — Core Agent Orchestration

### T3.1: Implement Router Agent
**Objective:** Route queries to appropriate mode handlers

**Acceptance Criteria:**
- [ ] Detects and validates mode from request
- [ ] Routes Book-Only, Selected-Text, General correctly
- [ ] Rejects Selected-Text without selection
- [ ] Defaults to Book-Only if unspecified
- [ ] All routing decisions logged

**Validation:** Unit tests for all routing scenarios

**Effort:** M | **Priority:** Critical

---

### T3.2: Implement Retrieval Agent
**Objective:** Retrieve relevant chunks for Book-Only mode

**Acceptance Criteria:**
- [ ] Calls embeddings MCP → search MCP
- [ ] Filters results by threshold (>0.7)
- [ ] Returns no-results refusal when appropriate
- [ ] Top-K results sorted by relevance
- [ ] Total latency < 800ms

**Validation:** Unit tests for retrieval and refusal scenarios

**Effort:** M | **Priority:** Critical

---

### T3.3: Implement Selected-Text Agent
**Objective:** Handle queries constrained to selection

**Acceptance Criteria:**
- [ ] Extracts selection from request
- [ ] Validates length (50-4000 tokens)
- [ ] No vector search triggered
- [ ] Insufficient context detection
- [ ] Latency < 200ms (no retrieval)

**Validation:** Unit tests verify zero vector searches

**Effort:** S | **Priority:** Critical

---

### T3.4: Implement Response Agent
**Objective:** Generate answers from context

**Acceptance Criteria:**
- [ ] Composes prompts with context
- [ ] Enforces mode-specific instructions
- [ ] Applies tone modifiers (5 tones)
- [ ] Applies action modifiers (explain, summarize, etc.)
- [ ] Streaming enabled (first token < 500ms)
- [ ] Generation errors handled

**Validation:** Unit tests for all tones and actions

**Effort:** L | **Priority:** Critical

---

### T3.5: Implement Citation Agent
**Objective:** Attach citations to responses

**Acceptance Criteria:**
- [ ] Parses response for factual claims
- [ ] Maps claims to chunk IDs
- [ ] Retrieves full citation metadata
- [ ] Formats citations per spec (inline + list)
- [ ] All factual statements cited

**Validation:** Unit tests verify citation accuracy

**Effort:** M | **Priority:** Critical

---

### T3.6: Implement Grounding Validation
**Objective:** Verify response grounding in sources

**Acceptance Criteria:**
- [ ] Extracts claims from response
- [ ] Checks claims against sources
- [ ] Calculates grounding score (0.0-1.0)
- [ ] Flags unsupported claims
- [ ] Validation completes < 500ms

**Validation:** Unit tests for grounded and ungrounded responses

**Effort:** M | **Priority:** High

---

### T3.7: Test Mode Boundaries
**Objective:** Ensure strict mode enforcement

**Acceptance Criteria:**
- [ ] Book-Only refuses external topics
- [ ] Selected-Text never triggers vector search
- [ ] General Knowledge shows disclaimer
- [ ] No mode contamination in 100+ test queries
- [ ] All boundary tests passing

**Validation:** Comprehensive test suite for mode violations

**Effort:** M | **Priority:** Critical

---

## Phase 4 — Chat API & Contracts

### T4.1: Define API Schemas
**Objective:** Specify request and response formats

**Acceptance Criteria:**
- [ ] Request JSON schema defined
- [ ] Response JSON schema defined
- [ ] Error response format standardized
- [ ] OpenAPI 3.0 spec created
- [ ] TypeScript types generated

**Validation:** Schemas validate with JSON Schema validator

**Effort:** S | **Priority:** High

---

### T4.2: Implement Request Validation
**Objective:** Validate all incoming requests

**Acceptance Criteria:**
- [ ] Schema validation middleware
- [ ] Required fields enforced
- [ ] Field constraints validated (length, enums)
- [ ] Clear error messages (400)
- [ ] Validation time < 50ms

**Validation:**
```bash
# Valid request → 200
# Missing field → 400 with message
# Invalid enum → 400 with message
```

**Effort:** S | **Priority:** High

---

### T4.3: Implement Chat Endpoint
**Objective:** Main API endpoint for chat

**Acceptance Criteria:**
- [ ] `/api/v1/chat` POST endpoint functional
- [ ] Integrates with Router Agent
- [ ] Returns responses per schema
- [ ] All error types handled
- [ ] Request ID generated for tracing
- [ ] Response time < 3s (p95)

**Validation:**
```bash
curl -X POST https://api.yoursite.com/api/v1/chat \
  -d '{"query": "What is photosynthesis?", "mode": "book_only", "book_id": "bio101"}'
```

**Effort:** M | **Priority:** Critical

---

### T4.4: Implement Error Formatting
**Objective:** Standardize error responses

**Acceptance Criteria:**
- [ ] All errors use standard format
- [ ] User-friendly messages (no stack traces)
- [ ] Error codes consistent
- [ ] Recovery actions provided
- [ ] Request IDs included

**Validation:** Test all error scenarios return standard format

**Effort:** S | **Priority:** Medium

---

### T4.5: Implement API Versioning
**Objective:** Enable future API evolution

**Acceptance Criteria:**
- [ ] Version in URL path (`/api/v1/`)
- [ ] Versioning strategy documented
- [ ] Deprecation warning system
- [ ] Multiple versions can coexist

**Validation:** API documentation includes versioning policy

**Effort:** S | **Priority:** Medium

---

## Phase 5 — UI Integration (MVP)

### T5.1: Create Chat Panel Component
**Objective:** Main chat interface component

**Acceptance Criteria:**
- [ ] Collapsible panel (expand/collapse < 200ms)
- [ ] Positioned correctly (right sidebar desktop, bottom drawer mobile)
- [ ] State persists in sessionStorage
- [ ] Responsive across devices
- [ ] Keyboard accessible

**Validation:** Component tests + visual regression tests

**Effort:** M | **Priority:** Critical

---

### T5.2: Implement Message Interface
**Objective:** Display conversation and input

**Acceptance Criteria:**
- [ ] Scrollable message list
- [ ] Input with character counter (max 500)
- [ ] Submit via button or Enter (Shift+Enter for newline)
- [ ] Loading indicator during response
- [ ] Empty input disables submit

**Validation:** Component tests for all interactions

**Effort:** M | **Priority:** Critical

---

### T5.3: Implement Mode Selector
**Objective:** Allow mode switching

**Acceptance Criteria:**
- [ ] Three mode options (Book-Only, Selected-Text, General)
- [ ] Active mode highlighted
- [ ] Tooltips explain each mode
- [ ] General mode shows warning banner
- [ ] Persists in sessionStorage

**Validation:** Component tests for mode switching

**Effort:** S | **Priority:** High

---

### T5.4: Implement Highlight-to-Ask
**Objective:** Enable text selection triggering

**Acceptance Criteria:**
- [ ] Selection detected (10+ characters)
- [ ] "Ask AI" button appears < 200ms
- [ ] Button positioned near selection
- [ ] Click populates chat with selection
- [ ] Works on mobile (touch selection)

**Validation:** E2E tests for selection flow

**Effort:** M | **Priority:** High

---

### T5.5: Implement Citation Display
**Objective:** Show citations inline and as list

**Acceptance Criteria:**
- [ ] Inline citations styled (superscript/bracketed)
- [ ] Citations clickable (scroll to source)
- [ ] Hover shows tooltip (desktop)
- [ ] Tap shows card (mobile)
- [ ] Citation list shows all sources

**Validation:** Component tests + E2E citation tests

**Effort:** M | **Priority:** Critical

---

### T5.6: Integrate with Chat API
**Objective:** Connect UI to backend

**Acceptance Criteria:**
- [ ] API calls made correctly
- [ ] Loading states shown
- [ ] Errors displayed user-friendly
- [ ] Retry on network errors (3 attempts)
- [ ] Request cancellation on unmount

**Validation:** Integration tests with mocked API

**Effort:** M | **Priority:** Critical

---

### T5.7: Test UI End-to-End
**Objective:** Validate complete user flows

**Acceptance Criteria:**
- [ ] Basic query flow tested
- [ ] Highlight-to-ask flow tested
- [ ] Mode switching tested
- [ ] Citation clicking tested
- [ ] Tests pass on Chrome, Firefox, Safari
- [ ] Mobile tests passing (iOS, Android)

**Validation:** E2E test suite (Playwright)

**Effort:** L | **Priority:** High

---

## Phase 6 — UX Enhancements

### T6.1: Implement Tone Selector
**Objective:** Allow response style customization

**Acceptance Criteria:**
- [ ] 5 tone options (Academic, Beginner, Concise, Detailed, Neutral)
- [ ] Tone applied to API requests
- [ ] Persists in localStorage
- [ ] Tone observable in responses
- [ ] No accuracy degradation

**Validation:** Test responses in each tone

**Effort:** S | **Priority:** Medium

---

### T6.2: Implement Text Action Buttons
**Objective:** Quick actions for text

**Acceptance Criteria:**
- [ ] 5 actions (Explain, Summarize, Examples, Elaborate, Simplify)
- [ ] Actions appear on selection
- [ ] Actions applied to requests
- [ ] Responses labeled with action type

**Validation:** Test each action type

**Effort:** M | **Priority:** Medium

---

### T6.3: Implement Key Term Highlighting
**Objective:** Highlight domain-specific terms

**Acceptance Criteria:**
- [ ] Glossary loaded (JSON)
- [ ] Terms detected and underlined
- [ ] Hover tooltips (desktop)
- [ ] Tap cards (mobile)
- [ ] Detection accuracy > 85%

**Validation:** Test term detection on sample content

**Effort:** M | **Priority:** Medium

---

### T6.4: Implement Citation Previews
**Objective:** Expandable citation details

**Acceptance Criteria:**
- [ ] Citation cards show full chunk text
- [ ] Context included (prev/next chunks)
- [ ] "View in textbook" link functional
- [ ] "Ask about this" action available

**Validation:** Test citation card interactions

**Effort:** S | **Priority:** Low

---

### T6.5: Add Feedback Mechanism
**Objective:** Collect user feedback

**Acceptance Criteria:**
- [ ] Thumbs up/down buttons on responses
- [ ] Optional comment field
- [ ] Feedback submitted to API
- [ ] Success confirmation shown

**Validation:** Test feedback submission flow

**Effort:** S | **Priority:** Low

---

## Phase 7 — Reliability & Security Hardening

### T7.1: Implement Rate Limiting
**Objective:** Prevent API abuse

**Acceptance Criteria:**
- [ ] Rate limits enforced (10/100/1000 per hour by tier)
- [ ] Burst allowance (2x for 10s)
- [ ] 429 status with Retry-After header
- [ ] User-friendly limit messages

**Validation:**
```bash
for i in {1..15}; do curl /api/v1/chat -d '...'; done
# Expected: 200 for first 10, 429 for next 5
```

**Effort:** S | **Priority:** High

---

### T7.2: Implement Abuse Protection
**Objective:** Detect and prevent abuse

**Acceptance Criteria:**
- [ ] Input validation (max 500 chars)
- [ ] Prompt injection detection
- [ ] IP-based temporary bans
- [ ] CAPTCHA for anomalous patterns

**Validation:** Test with adversarial inputs

**Effort:** M | **Priority:** Medium

---

### T7.3: Implement Graceful Degradation
**Objective:** Handle dependency failures

**Acceptance Criteria:**
- [ ] Vector DB down → keyword search fallback
- [ ] LLM API down → request queuing
- [ ] Postgres down → cached responses
- [ ] Clear error messages for each failure

**Validation:** Manually disable each dependency and test

**Effort:** M | **Priority:** Medium

---

### T7.4: Audit API Key Protection
**Objective:** Ensure no key exposure

**Acceptance Criteria:**
- [ ] No keys in client-side code (automated scan)
- [ ] Keys stored in environment variables only
- [ ] Keys redacted from logs
- [ ] Quarterly rotation schedule set

**Validation:** Run security scanner (Trufflehog, GitGuardian)

**Effort:** S | **Priority:** High

---

### T7.5: Set Up Monitoring
**Objective:** Operational visibility

**Acceptance Criteria:**
- [ ] Error tracking configured (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Dashboards for key metrics (latency, errors)
- [ ] Alerts configured (error rate >5%, latency p95 >5s)

**Validation:** Trigger test errors and verify alerts

**Effort:** S | **Priority:** High

---

## Phase 8 — Validation & Acceptance

### T8.1: Functional Testing
**Objective:** Validate all answering modes

**Acceptance Criteria:**
- [ ] Book-Only mode tested (50+ queries)
- [ ] Selected-Text mode tested (50+ queries)
- [ ] General Knowledge mode tested (20+ queries)
- [ ] Mode boundaries never violated
- [ ] All refusal scenarios tested

**Validation:** Automated test suite + manual review

**Effort:** M | **Priority:** Critical

---

### T8.2: Performance Testing
**Objective:** Validate performance targets

**Acceptance Criteria:**
- [ ] Load test: 1000 concurrent users
- [ ] p50 latency < 2s
- [ ] p95 latency < 3s
- [ ] p99 latency < 5s
- [ ] Cold start < 2s
- [ ] Throughput > 100 req/s sustained

**Validation:**
```bash
ab -n 10000 -c 1000 https://api.yoursite.com/api/v1/chat
```

**Effort:** M | **Priority:** High

---

### T8.3: Quality Validation
**Objective:** Measure answer quality

**Acceptance Criteria:**
- [ ] 100 responses manually reviewed
- [ ] Citation accuracy > 95%
- [ ] Hallucination rate < 5%
- [ ] Grounding rate > 90%
- [ ] User satisfaction > 4.0/5.0 (if beta users available)

**Validation:** Quality metrics dashboard

**Effort:** L | **Priority:** High

---

### T8.4: Security Testing
**Objective:** Validate security measures

**Acceptance Criteria:**
- [ ] Automated security scan passed (OWASP ZAP)
- [ ] Rate limiting bypass attempts failed
- [ ] Prompt injection attempts blocked
- [ ] No API keys exposed (manual audit)
- [ ] Penetration test report clean

**Validation:** Security audit report

**Effort:** M | **Priority:** High

---

### T8.5: Compliance Validation
**Objective:** Ensure regulatory compliance

**Acceptance Criteria:**
- [ ] GDPR compliance verified (data handling, consent)
- [ ] WCAG AA accessibility passed
- [ ] Privacy policy reviewed
- [ ] No PII in logs confirmed

**Validation:** Compliance checklist completed

**Effort:** M | **Priority:** Medium

---

### T8.6: Documentation Review
**Objective:** Complete all documentation

**Acceptance Criteria:**
- [ ] README updated (deployment instructions)
- [ ] API documentation published (Swagger UI)
- [ ] Runbook for common issues
- [ ] User guide for chatbot features
- [ ] Architecture diagrams current

**Validation:** Documentation peer review

**Effort:** M | **Priority:** Medium

---

### T8.7: Production Readiness Review
**Objective:** Final go/no-go decision

**Acceptance Criteria:**
- [ ] All specifications met
- [ ] All constitutional constraints satisfied
- [ ] No manual servers required
- [ ] All tests passing
- [ ] Performance targets achieved
- [ ] Security audit clean
- [ ] Stakeholder approval obtained

**Validation:** Production readiness checklist signed off

**Effort:** S | **Priority:** Critical

---

## Completion Criteria

The project is **COMPLETE** when:

### Technical
- ✅ All 60+ tasks marked complete
- ✅ Zero runtime conflicts
- ✅ No Redis/FastAPI/manual servers
- ✅ All answers traceable to sources

### Quality
- ✅ Citation accuracy > 95%
- ✅ Hallucination rate < 5%
- ✅ Mode boundaries never violated
- ✅ Performance targets met

### Operational
- ✅ One-command deployment
- ✅ Automated rollback tested
- ✅ Monitoring operational
- ✅ Documentation complete

### Compliance
- ✅ Security audit passed
- ✅ GDPR compliant
- ✅ Accessibility compliant
- ✅ Production ready

**Final Sign-Off Required From:**
- Project Lead
- Technical Lead
- Security Lead
- Product Manager

---

**Document Status:** Ready for Execution  
**Next Action:** Begin Phase 0 Tasks
