You are a senior AI systems architect specializing in production-grade RAG systems, OpenAI Agents, and serverless deployments.



════════════════════════════════════

PROJECT CONTEXT

════════════════════════════════════



I have an already-built and published interactive textbook created using Claude Code CLI and Spec-Kit driven development. The project is stable and live. I want to incrementally integrate an advanced RAG-powered chatbot without breaking existing functionality.



This integration must be conflict-free, serverless-first, and require zero manual runtime processes for developers or users.



════════════════════════════════════

NON-NEGOTIABLE CONSTRAINTS

════════════════════════════════════



❌ No Redis (local or managed)

❌ No client-side FastAPI process that must stay running

❌ No background services requiring manual startup

❌ No hidden long-running workers



✅ Serverless / edge-compatible only

✅ Fully managed databases and vector stores

✅ Deterministic, debuggable behavior



Any design violating these constraints is invalid.



════════════════════════════════════

MANDATORY TECH STACK

════════════════════════════════════



\- LLM Orchestration: OpenAI Agents / ChatKit SDK

\- API Layer: FastAPI (serverless deployment only)

\- Vector Store: Qdrant Cloud (Free Tier)

\- Relational DB: Neon Serverless Postgres

\- Embeddings: OpenAI (latest stable model)

\- Hosting: Vercel / Fly.io / equivalent edge-friendly platform



════════════════════════════════════

CORE CHATBOT CAPABILITIES

════════════════════════════════════



1\. RAG MODES

&nbsp;  - Book-only mode (default)

&nbsp;  - Selected-text-only mode (hard constraint)

&nbsp;  - General knowledge mode (explicit opt-in only)



2\. TEXT SELECTION INTELLIGENCE

&nbsp;  - User-selected text must be treated as the ONLY retrieval source

&nbsp;  - No additional chunks may be injected

&nbsp;  - If insufficient info exists, respond with:

&nbsp;    “The selected text does not contain enough information to answer this.”



3\. HIGHLIGHT-TO-ASK FLOW

&nbsp;  - Highlight text → Ask AI → auto-context injection

&nbsp;  - Zero manual copy-paste by user



4\. KEY TERMS HIGHLIGHTER

&nbsp;  - Detect domain-specific terms

&nbsp;  - Inline highlights with short explanations

&nbsp;  - No popups blocking reading flow



5\. SOURCE CITATION (MANDATORY)

&nbsp;  - Section / chapter reference

&nbsp;  - Chunk ID

&nbsp;  - Confidence score

&nbsp;  - Clear visual distinction between retrieved vs generated text



6\. TONE CONTROL

&nbsp;  - Academic

&nbsp;  - Beginner-friendly

&nbsp;  - Concise

&nbsp;  - Detailed

&nbsp;  - Neutral



7\. TEXT ACTIONS

&nbsp;  - Explain

&nbsp;  - Summarize

&nbsp;  - Generate examples

&nbsp;  - Ask follow-up question



════════════════════════════════════

AGENT ARCHITECTURE (EXPLICIT)

════════════════════════════════════



Define and separate agents clearly:



\- Router Agent: decides answer mode (book / selected / general)

\- Retrieval Agent: performs vector search + reranking

\- Citation Agent: validates all claims against retrieved sources

\- Response Agent: generates final answer under strict constraints



No agent may bypass retrieval validation.



════════════════════════════════════

RAG PIPELINE REQUIREMENTS

════════════════════════════════════



\- Semantic chunking with overlap

\- Deterministic retrieval (top-k fixed)

\- Reranking before generation

\- Strict context window limits

\- Zero hallucination tolerance



Failure behavior:

\- If no relevant chunks found → explicit refusal

\- If partial relevance → answer only supported parts



════════════════════════════════════

UI / UX REQUIREMENTS

════════════════════════════════════



\- Embedded, book-native chat UI

\- Modern, minimal, futuristic design

\- Clear separation between:

&nbsp; - Book-grounded answers

&nbsp; - General AI answers

\- Expandable citation previews

\- Smooth animations, no reloads



════════════════════════════════════

API CONTRACTS

════════════════════════════════════



Define:

\- Request payload schemas

\- Response schemas

\- Error states (explicit, user-visible)



Frontend and backend must be loosely coupled via stable contracts.



════════════════════════════════════

SECURITY \& RELIABILITY

════════════════════════════════════



\- No API keys exposed to client

\- Rate limiting

\- Abuse protection

\- Graceful degradation paths



════════════════════════════════════

DELIVERABLES

════════════════════════════════════



1\. Architecture explanation

2\. RAG ingestion + retrieval design

3\. Agent definitions and responsibilities

4\. Prompt templates per mode

5\. UI/UX interaction flow

6\. Deployment strategy (serverless, conflict-free)



════════════════════════════════════

SUCCESS CRITERIA

════════════════════════════════════



\- Zero runtime conflicts

\- No manual servers required

\- All answers traceable to sources

\- Maintainable and extensible design

\- Production-ready quality



