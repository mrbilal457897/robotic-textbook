# Feature Specification: RAG-Powered Textbook Chatbot

**Feature Branch**: `002-rag-textbook-chatbot`
**Created**: 2026-01-28
**Status**: Draft
**Version**: 2.0
**Constitution**: `.specify/memory/constitution-rag-chatbot.md`

---

## Executive Summary

This specification defines a Retrieval-Augmented Generation (RAG) chatbot for the Physical AI & Humanoid Robotics Interactive Textbook. The chatbot enables students to ask questions about textbook content, highlight passages for contextual explanations, and receive grounded, citation-backed answers with strict accuracy guarantees.

The system enforces three distinct answering modes with clear knowledge boundaries:
- **Book-Only Mode** (default): Answers strictly from textbook content
- **Selected-Text-Only Mode**: Answers exclusively from highlighted text
- **General Knowledge Mode**: Answers with external knowledge augmentation

**Core Architecture**: Serverless RAG pipeline with OpenAI embeddings, Qdrant vector search, Neon Postgres for state, and FastAPI/Next.js for interfaces.

---

## Clarifications

### Session 2026-01-28

- Q: Should the system support user authentication for conversation persistence and personalization, or operate entirely anonymously with session-based storage only? → A: Session-based with optional authentication - Anonymous by default, optional GitHub/Google OAuth for persistence. Conversations linked to user_id when authenticated, anonymous otherwise.
- Q: How should the system handle automatic cleanup of expired anonymous conversations to prevent database bloat? → A: Daily background job - Scheduled cron job runs at 2 AM UTC daily to delete conversations where expires_at < NOW().
- Q: What specific metrics should be tracked for the RAG pipeline to ensure quality and enable debugging when answers are incorrect or low-confidence? → A: Pipeline stage metrics + quality indicators - Track latency per stage (embedding, search, rerank, generation), retrieval metrics (top-k similarity scores, rerank score deltas), confidence scores, citation counts, and refusal rate.
- Q: When General Knowledge mode is enabled and requires external LLM knowledge beyond the textbook, should the system use the same OpenAI GPT-4 model with expanded context, or should it use a different approach to clearly distinguish external knowledge from textbook content? → A: Dual-pass with source labeling - First pass retrieves textbook chunks (as usual), second pass generates response with explicit labels like "[Textbook]" and "[General Knowledge]" for different claims.
- Q: When a user has the same conversation open in multiple browser tabs or devices and asks questions simultaneously, how should the system handle concurrent message creation to prevent race conditions or duplicate responses? → A: Optimistic locking with timestamps - Each conversation has updated_at timestamp. API checks if timestamp matches before inserting new message. If conflict detected, return 409 Conflict and prompt user to refresh.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Question Answering in Book-Only Mode (Priority: P1)

A student reads Chapter 3 on Forward Kinematics and wants to clarify a concept without leaving the textbook page. They type a question in the chat interface and receive an accurate, citation-backed answer derived exclusively from the textbook.

**Why this priority**: This is the core value proposition—enabling students to get instant, grounded answers without searching through pages manually. It's the foundation for all other features.

**Independent Test**: Can be fully tested by loading a textbook chapter, asking a question about a concept covered in that chapter, and verifying the answer contains inline citations pointing to specific chapter sections.

**Acceptance Scenarios**:

1. **Given** user is reading Chapter 3 on Forward Kinematics in Book-Only mode, **When** user asks "What is the DH convention?", **Then** system returns an answer with inline citations like `[Ch3:Sec2:Para5]` and displays source previews showing the exact textbook passage.

2. **Given** user asks a question with no relevant content in the current chapter, **When** system searches across all chapters and finds no match, **Then** system responds with "I couldn't find information about [topic] in this textbook" and suggests switching to General Knowledge mode.

3. **Given** user asks "How does forward kinematics apply to Tesla robots?", **When** system finds textbook content on forward kinematics but no mention of Tesla, **Then** system answers the general concept with textbook citations and adds a disclaimer: "This textbook doesn't discuss Tesla's specific implementation."

---

### User Story 2 - Highlight-to-Ask for Selected Text (Priority: P1)

A student encounters a complex paragraph explaining Jacobian matrices. They highlight the paragraph, click "Explain," and receive a simplified explanation strictly constrained to the highlighted content without introducing external information.

**Why this priority**: This addresses a critical learning moment—when students struggle with dense technical prose. It's independently valuable and requires no other features to deliver impact.

**Independent Test**: Highlight a paragraph, trigger "Explain" action, verify the response references only the highlighted text and includes the full highlighted passage in the response context.

**Acceptance Scenarios**:

1. **Given** user highlights a paragraph on Jacobian matrices, **When** user clicks "Explain," **Then** system switches to Selected-Text-Only mode, shows the highlighted text in the chat, and provides a beginner-friendly explanation referencing only that paragraph.

2. **Given** user highlights text and then types a follow-up question, **When** user asks "What does this mean in robotics?", **Then** system answers using only the highlighted text as context and refuses to introduce concepts not mentioned in the selection.

3. **Given** user highlights a code snippet, **When** user clicks "Break down this code," **Then** system provides a line-by-line explanation of the selected code without referencing code examples outside the selection.

---

### User Story 3 - Interactive Chat with Tone Control (Priority: P2)

A beginner student finds the default academic tone intimidating. They toggle the tone setting to "Beginner-friendly" and receive simplified explanations with analogies while maintaining citation accuracy.

**Why this priority**: This improves accessibility and learning outcomes for students with varying skill levels. It's independent of other features and can be tested in isolation by comparing responses across tone settings.

**Independent Test**: Ask the same question with "Academic" and "Beginner-friendly" tones, verify that Academic responses use technical language and Beginner-friendly responses use analogies/simpler vocabulary, but both maintain identical citations.

**Acceptance Scenarios**:

1. **Given** user sets tone to "Beginner-friendly," **When** user asks "What is inverse kinematics?", **Then** system responds with an analogy (e.g., "Imagine trying to reach a cup...") followed by citations to the textbook definition.

2. **Given** user sets tone to "Academic," **When** user asks the same question, **Then** system responds with formal technical language and the same citations.

3. **Given** user sets tone to "Concise," **When** user asks "What are the 3 main IK methods?", **Then** system responds with a bulleted list and citations, omitting explanatory prose.

---

### User Story 4 - Citation Navigation and Source Preview (Priority: P2)

A student receives an answer with multiple inline citations. They click on `[Ch3:Sec2:Para5]` to see a preview of the exact textbook passage, then click "Go to source" to navigate to that section in the full textbook.

**Why this priority**: This enables verification and deeper learning. Students can validate answers and explore context independently.

**Independent Test**: Ask a question, click a citation badge in the response, verify the preview displays the correct passage, click "Go to source," verify navigation to the correct chapter/section.

**Acceptance Scenarios**:

1. **Given** chatbot displays answer with citation `[Ch3:Sec2:Para5]`, **When** user hovers over the citation badge, **Then** system displays a tooltip preview with the first 100 characters of the source passage.

2. **Given** user clicks a citation badge, **When** the citation modal opens, **Then** system displays the full source passage, confidence score (e.g., 0.92), and a "Go to source" button.

3. **Given** user clicks "Go to source" in citation modal, **When** navigation occurs, **Then** browser scrolls to the exact paragraph in the textbook and highlights it for 2 seconds.

---

### User Story 5 - Key Term Highlighting in Responses (Priority: P3)

A student asks about "inverse kinematics" and receives an answer. The system automatically highlights key terms like "Jacobian," "singularities," and "joint limits" in the response, making them clickable for quick definitions from the glossary.

**Why this priority**: This enhances learning by connecting concepts to the glossary without interrupting the flow. It's a polish feature that adds value but isn't critical for core functionality.

**Independent Test**: Ask a question, verify key terms are highlighted in the response, click a highlighted term, verify a glossary definition tooltip appears.

**Acceptance Scenarios**:

1. **Given** user asks "How do I solve inverse kinematics?", **When** system generates a response mentioning "Jacobian" and "singularities," **Then** both terms are highlighted with a subtle underline and glossary icon.

2. **Given** user clicks a highlighted term, **When** the term exists in the glossary, **Then** system displays a tooltip with the glossary definition and a link to the full glossary entry.

3. **Given** user clicks a highlighted term not in the glossary, **When** no definition exists, **Then** system displays "Term not found in glossary" and suggests "Add to glossary" action (for future enhancement).

---

### User Story 6 - Mode Switching and Boundary Enforcement (Priority: P1)

A student asks "How is inverse kinematics used in Boston Dynamics robots?" The textbook covers IK theory but not Boston Dynamics. The system answers the IK theory with citations and adds: "For Boston Dynamics specifics, switch to General Knowledge mode."

**Why this priority**: This is critical for trust and accuracy. Students must understand when they're getting textbook-grounded answers vs. general knowledge.

**Independent Test**: Ask a question that partially overlaps with textbook content, verify the response includes only textbook-grounded information and a clear prompt to switch modes for external information.

**Acceptance Scenarios**:

1. **Given** user is in Book-Only mode, **When** user asks "How does Tesla use forward kinematics in Optimus?", **Then** system answers forward kinematics with textbook citations and displays: "This textbook doesn't cover Tesla's Optimus. For real-world applications, try General Knowledge mode."

2. **Given** user clicks "Switch to General Knowledge mode," **When** the question is resubmitted, **Then** system answers with two clearly labeled sections: "[Textbook]" (with citations like `[Ch3:Sec2:Para5]`) followed by "[General Knowledge]" (with external information), visually distinguished by colored left-borders (green for textbook, blue for general knowledge).

3. **Given** user is in Selected-Text-Only mode and asks a question requiring external context, **When** the highlighted text lacks sufficient information, **Then** system responds: "I can't answer this using only the highlighted text. Would you like to switch modes?"

---

### Edge Cases

- **What happens when a user uploads a corrupted PDF textbook?**
  System validates PDF structure during upload. If corrupted, returns HTTP 400 with error message: "PDF parsing failed. Please upload a valid PDF file." Logs error to monitoring system.

- **How does the system handle ambiguous questions like "What is it?"**
  System detects lack of context and responds: "I need more context. What topic are you asking about?" and suggests rephrasing the question.

- **What happens if Qdrant vector database is temporarily unavailable?**
  System falls back to keyword-based search using Postgres full-text search. Displays banner: "Using fallback search—results may be less accurate." Logs incident for monitoring.

- **How does the system handle questions in non-English languages?**
  System detects non-English input and responds: "I currently support English only. Please ask your question in English."

- **What happens if a user asks a question while network is slow (>5s latency)?**
  System streams partial responses as they're generated. Displays "Searching textbook..." spinner. If request exceeds 10s timeout, returns partial answer with disclaimer: "Response incomplete due to timeout. Please try again."

- **How does the system handle quote-heavy questions like "What does the book say about 'DH parameters'?"**
  System extracts exact quoted phrases, searches for verbatim matches first, then falls back to semantic search if no exact match exists.

- **What happens when a user highlights 10,000 words (entire chapter)?**
  System truncates to first 2,000 words and displays warning: "Highlighted text truncated to 2,000 words for optimal performance. Consider selecting a shorter passage."

- **How does the system handle rapid-fire questions (10 questions in 10 seconds)?**
  Rate limiter allows 5 requests per 10-second window. After limit, returns HTTP 429 with message: "Too many requests. Please wait 10 seconds before asking another question."

- **What happens if OpenAI API key expires mid-session?**
  System catches authentication error, logs incident, and returns user-facing message: "Service temporarily unavailable. Please try again in a few moments." Alerts engineering team via PagerDuty.

- **What happens when a user has the same conversation open in two browser tabs and asks questions simultaneously?**
  System uses optimistic locking with `updated_at` timestamps. The first request succeeds and updates the timestamp. The second request detects a timestamp mismatch and returns HTTP 409 Conflict with message: "This conversation was updated in another tab/device. Refresh to see latest messages." User must click "Refresh" to sync and retry their question.

---

## Part I: Functional Specifications

### S-0: User Authentication & Identity

**FR-000**: System MUST support anonymous usage by default (no authentication required to use chatbot).

**FR-000.1**: Anonymous users MUST receive a session-based identifier stored in browser cookies (expires on browser close).

**FR-000.2**: System MUST provide optional authentication via GitHub OAuth and Google OAuth.

**FR-000.3**: Authenticated users MUST have conversations persisted across devices and sessions (linked to user_id in database).

**FR-000.4**: Anonymous users MUST have conversations persisted only within the current session (stored temporarily in Postgres with 24-hour TTL).

**FR-000.5**: System MUST provide a "Sign in to save conversations" prompt in the chat UI footer for anonymous users.

**FR-000.6**: When an anonymous user authenticates mid-session, system MUST transfer current session conversations to the authenticated user_id.

**FR-000.7**: System MUST run a daily background job at 2 AM UTC to delete expired anonymous conversations (where `expires_at < NOW()` and `status != 'archived'`).

**FR-000.8**: Cleanup job MUST log the number of conversations deleted and alert if deletion count exceeds 10,000 (indicating potential abuse or misconfiguration).

**FR-000.9**: System MUST support multi-device/multi-tab usage for the same conversation using optimistic locking to prevent race conditions.

**FR-000.10**: When creating a new message, API MUST verify the conversation's `updated_at` timestamp matches the client's last known timestamp. If mismatch detected (indicating concurrent update), return HTTP 409 Conflict.

**FR-000.11**: On HTTP 409 Conflict, client MUST display message: "This conversation was updated in another tab/device. Refresh to see latest messages." and provide a "Refresh" button.

**FR-000.12**: After successful message creation, API MUST return the new `updated_at` timestamp for the client to use in subsequent requests.

---

### S-1: Chat Interface

**FR-001**: System MUST provide a persistent chat interface accessible from all textbook pages.

**FR-002**: Chat interface MUST support:
- Text input field with multiline support (max 2,000 characters)
- Send button and Enter-to-send (Shift+Enter for new line)
- Message history display with timestamps
- Scroll to load previous messages (paginated, 20 messages per page)

**FR-003**: Chat interface MUST display:
- User messages (right-aligned, blue background)
- Bot responses (left-aligned, gray background)
- Typing indicator while bot is generating response
- Error messages (red banner) for failed requests

**FR-004**: Chat interface MUST persist conversation history across page navigation within the same session (stored in Neon Postgres).

**FR-005**: Chat interface MUST support markdown rendering in bot responses (bold, italic, code blocks, lists, links).

---

### S-2: Answering Modes

**FR-006**: System MUST support three answering modes with strict knowledge boundary enforcement:

1. **Book-Only Mode (Default)**:
   - Answers MUST be derived exclusively from the textbook corpus
   - System MUST refuse to answer questions with no textbook coverage
   - System MUST include inline citations for all factual claims

2. **Selected-Text-Only Mode**:
   - Answers MUST be constrained to the highlighted text provided by the user
   - System MUST NOT introduce information from other textbook sections or external sources
   - System MUST display the highlighted text in the chat context

3. **General Knowledge Mode**:
   - Answers MAY include external knowledge beyond the textbook
   - System MUST use a dual-pass approach: first retrieve textbook chunks, then generate response with both textbook and general knowledge
   - System MUST explicitly label sources with "[Textbook]" prefix for textbook-grounded claims and "[General Knowledge]" prefix for external information
   - Textbook citations MUST still use inline citation format `[Ch3:Sec2:Para5]` under the "[Textbook]" label
   - System MUST prioritize textbook content when available (textbook section appears first in response)

**FR-007**: System MUST display the active mode prominently in the chat UI (badge or dropdown).

**FR-008**: Users MUST be able to switch modes via a dropdown menu without losing conversation history.

**FR-009**: System MUST prompt users to switch modes when a question cannot be answered in the current mode (e.g., "This topic isn't covered in the textbook. Switch to General Knowledge mode?").

**FR-009.1**: In General Knowledge mode, system MUST visually distinguish textbook content from general knowledge using section labels:
- "[Textbook]" section with green left-border and textbook icon
- "[General Knowledge]" section with blue left-border and lightbulb icon

**FR-009.2**: General Knowledge mode responses MUST always prioritize textbook content first (display "[Textbook]" section before "[General Knowledge]" section).

---

### S-3: Highlight-to-Ask

**FR-010**: Users MUST be able to highlight text passages on any textbook page.

**FR-011**: When text is highlighted, system MUST display a floating toolbar with actions:
- "Explain" (default)
- "Summarize"
- "Example"
- "Simplify"

**FR-012**: When user selects an action, system MUST:
1. Switch to Selected-Text-Only mode
2. Copy the highlighted text into the chat interface
3. Generate a response based on the selected action

**FR-013**: System MUST support highlighting up to 2,000 words. If exceeded, system MUST truncate and display warning.

**FR-014**: Highlighted text MUST be stored in the conversation context for follow-up questions.

---

### S-4: Text Actions

**FR-015**: System MUST support the following actions on highlighted text:

1. **Explain**: Provide a detailed explanation of the selected passage
2. **Summarize**: Provide a concise 2-3 sentence summary
3. **Example**: Generate or extract a concrete example related to the concept
4. **Simplify**: Rephrase the passage in beginner-friendly language

**FR-016**: Each action MUST maintain Selected-Text-Only mode constraints (no external information).

**FR-017**: Action responses MUST include citations referencing the highlighted text.

---

### S-5: Tone Control

**FR-018**: Users MUST be able to select response tone from a dropdown:
- Academic (default): Formal technical language
- Beginner-friendly: Simplified explanations with analogies
- Concise: Brief, bullet-point responses

**FR-019**: Tone setting MUST persist across the session (stored in browser local storage).

**FR-020**: Tone MUST NOT affect citation accuracy—all responses must include identical citations regardless of tone.

---

### S-6: Key Term Highlighting

**FR-021**: System MUST automatically detect key technical terms in bot responses (e.g., "Jacobian," "kinematics," "singularities").

**FR-022**: Detected key terms MUST be highlighted with a subtle underline and glossary icon.

**FR-023**: When user clicks a highlighted term, system MUST display a tooltip with:
- Glossary definition (if available)
- Link to full glossary entry
- "Add to glossary" option (if term not found)

**FR-024**: Key term detection MUST use the project glossary as the source of truth.

---

### S-7: Citations and Source Attribution

**FR-025**: All bot responses MUST include inline citations in the format `[ChX:SecY:ParaZ]` or `[ChunkID]`.

**FR-026**: Citations MUST be clickable and display a modal with:
- Full source passage (up to 500 characters)
- Confidence score (0.0 to 1.0)
- "Go to source" button to navigate to the textbook passage

**FR-027**: When user clicks "Go to source," system MUST:
1. Navigate to the correct chapter/section in the textbook
2. Scroll to the exact paragraph
3. Highlight the paragraph with a temporary visual indicator (2-second fade)

**FR-028**: System MUST display confidence scores for each citation (hidden by default, shown on hover).

**FR-029**: System MUST refuse to generate responses with confidence scores below 0.70 and display: "I'm not confident in this answer. Please rephrase your question."

---

## Part II: Technical Specifications

### T-1: System Architecture

**Tech Stack**:

1. **Backend**:
   - Language: Python 3.11+
   - Framework: FastAPI (serverless deployment on Vercel/AWS Lambda)
   - Vector Database: Qdrant Cloud (HNSW indexing, cosine similarity)
   - Relational Database: Neon Serverless Postgres (conversations, messages, metadata)
   - Embeddings: OpenAI `text-embedding-3-large` (3072 dimensions, primary) / `text-embedding-3-small` (1536 dimensions, fallback)
   - LLM: OpenAI GPT-4 (primary) / GPT-3.5-turbo (fallback for simple queries)
   - Caching: Upstash Redis (edge KV for rate limiting and frequent queries)

2. **Frontend**:
   - Framework: Next.js 14 (App Router, React Server Components)
   - UI Library: Tailwind CSS + shadcn/ui components
   - Markdown Rendering: `react-markdown` + `remark-gfm`
   - State Management: React Context API (conversation state), Zustand (UI state)

3. **Infrastructure**:
   - Hosting: Vercel (frontend + serverless API)
   - CDN: Vercel Edge Network
   - Monitoring: Sentry (errors + RAG quality alerts), Vercel Analytics (performance + RAG stage metrics)
   - Metrics: Track RAG pipeline stage latency, retrieval quality (top-k scores, rerank deltas), confidence scores, citation counts, refusal rate
   - Secrets: Vercel Environment Variables
   - Background Jobs: Vercel Cron (scheduled daily cleanup at 2 AM UTC)

**Architecture Diagram**:

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                             │
│  ┌────────────────┐       ┌──────────────────────────────┐    │
│  │  Next.js UI    │◄─────►│  FastAPI Serverless Backend  │    │
│  │  (Chat Widget) │       │  (Vercel/AWS Lambda)         │    │
│  └────────────────┘       └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
          ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐
          │   Qdrant     │  │   Neon      │  │   OpenAI API     │
          │   Vector DB  │  │  Postgres   │  │  (Embeddings +   │
          │  (Chunks)    │  │ (Messages)  │  │   Completion)    │
          └──────────────┘  └─────────────┘  └──────────────────┘
```

---

### T-2: RAG Pipeline

**Pipeline Stages**:

1. **Query Processing**:
   - Input: User question (text)
   - Output: Normalized query + detected intent

   **Steps**:
   - Detect language (reject non-English)
   - Normalize whitespace and punctuation
   - Extract quoted phrases for exact matching
   - Detect intent (question, definition request, example request)

2. **Embedding Generation**:
   - Input: Normalized query
   - Output: Query embedding (3072-dimensional vector)

   **Implementation**:
   ```python
   import openai

   def embed_query(query: str) -> list[float]:
       response = openai.embeddings.create(
           model="text-embedding-3-large",
           input=query
       )
       return response.data[0].embedding
   ```

3. **Vector Search**:
   - Input: Query embedding + filters (book_id, chapter, mode)
   - Output: Top 20 candidate chunks (sorted by cosine similarity)

   **Qdrant Query**:
   ```python
   from qdrant_client import QdrantClient
   from qdrant_client.models import Filter, FieldCondition, MatchValue

   def search_chunks(query_embedding, book_id, top_k=20):
       client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

       results = client.search(
           collection_name="textbook_chunks",
           query_vector=query_embedding,
           limit=top_k,
           query_filter=Filter(
               must=[FieldCondition(key="book_id", match=MatchValue(value=book_id))]
           )
       )
       return results
   ```

4. **Metadata Filtering**:
   - Input: Top 20 candidates + mode constraints
   - Output: Filtered chunks (respecting mode boundaries)

   **Filters**:
   - Book-Only: `book_id = <textbook_id>`
   - Selected-Text-Only: `chunk_id IN <highlighted_chunk_ids>`
   - General: No filter (external sources allowed in response generation)

5. **Reranking**:
   - Input: Filtered chunks
   - Output: Top 10 chunks (reranked by relevance)

   **Method**: Cross-encoder reranking using `sentence-transformers/ms-marco-MiniLM-L-12-v2`

6. **Context Validation**:
   - Input: Top 10 chunks
   - Output: Top 5 high-confidence chunks

   **Validation**:
   - Check semantic entailment (NLI model)
   - Filter chunks with relevance score < 0.70
   - Detect hallucination patterns (contradictory chunks removed)

7. **Response Generation**:
   - Input: Top 5 chunks + query + tone setting + mode
   - Output: Final answer with inline citations and source labels

   **Book-Only / Selected-Text-Only Mode**:
   ```python
   def generate_response(query, chunks, tone, mode):
       context = "\n\n".join([f"[{c.id}] {c.text}" for c in chunks])

       system_prompt = f"""You are a textbook chatbot. Answer strictly using the context below.
       Tone: {tone}
       Include inline citations in the format [ChunkID].
       If the context doesn't contain the answer, respond: "I couldn't find information about [topic] in this textbook."

       Context:
       {context}
       """

       response = openai.chat.completions.create(
           model="gpt-4",
           messages=[
               {"role": "system", "content": system_prompt},
               {"role": "user", "content": query}
           ],
           temperature=0.3,
           max_tokens=800
       )

       return response.choices[0].message.content
   ```

   **General Knowledge Mode (Dual-Pass Approach)**:
   ```python
   def generate_response_general_mode(query, chunks, tone):
       # Pass 1: Generate textbook-grounded response
       textbook_context = "\n\n".join([f"[{c.id}] {c.text}" for c in chunks])

       textbook_prompt = f"""You are a textbook chatbot. Answer using ONLY the context below.
       Tone: {tone}
       Include inline citations in the format [ChunkID].

       Context:
       {textbook_context}
       """

       textbook_response = openai.chat.completions.create(
           model="gpt-4",
           messages=[
               {"role": "system", "content": textbook_prompt},
               {"role": "user", "content": query}
           ],
           temperature=0.3,
           max_tokens=400
       )

       textbook_answer = textbook_response.choices[0].message.content

       # Pass 2: Generate general knowledge supplement
       general_prompt = f"""The user asked: "{query}"

       The textbook provides this information:
       {textbook_answer}

       Provide ADDITIONAL general knowledge that complements the textbook answer.
       Clearly separate your response into two sections:
       - [Textbook]: (copy the textbook answer verbatim with citations)
       - [General Knowledge]: (add external information not in the textbook)

       Tone: {tone}
       """

       final_response = openai.chat.completions.create(
           model="gpt-4",
           messages=[
               {"role": "system", "content": general_prompt},
               {"role": "user", "content": "Generate the combined response."}
           ],
           temperature=0.5,  # Slightly higher for general knowledge
           max_tokens=800
       )

       return final_response.choices[0].message.content
   ```

8. **Citation Extraction**:
   - Input: Generated response
   - Output: Response with citation metadata

   **Steps**:
   - Parse inline citations (regex: `\[Ch\d+:Sec\d+:Para\d+\]` or `\[chunk_[a-z0-9]+\]`)
   - Map citations to source chunks
   - Attach confidence scores to each citation

**Pipeline Error Handling**:

- **Embedding API Failure**: Retry 3 times with exponential backoff. If all retries fail, return HTTP 503 with message: "Service temporarily unavailable."
- **Qdrant Unavailable**: Fall back to Postgres full-text search. Display banner: "Using fallback search—results may be less accurate."
- **No Relevant Chunks Found**: Return message: "I couldn't find information about [topic] in this textbook. Try rephrasing or switching to General Knowledge mode."
- **Low Confidence Response**: If all chunks have similarity < 0.70, refuse to answer: "I'm not confident in this answer. Please rephrase your question."

---

**Pipeline Observability & Metrics**:

Track the following metrics for each request to enable debugging and quality monitoring:

1. **Stage Latency Metrics** (milliseconds):
   - `rag.embedding.latency` - Time to generate query embedding
   - `rag.vector_search.latency` - Time to search Qdrant
   - `rag.rerank.latency` - Time to rerank chunks
   - `rag.validation.latency` - Time to validate context
   - `rag.generation.latency` - Time to generate LLM response (including TTFT)
   - `rag.total.latency` - End-to-end pipeline time

2. **Retrieval Quality Metrics**:
   - `rag.search.top1_score` - Cosine similarity of top result (0.0-1.0)
   - `rag.search.top5_avg_score` - Average similarity of top 5 results
   - `rag.rerank.score_delta` - Difference between top reranked score and top search score (measures reranking impact)
   - `rag.chunks.retrieved_count` - Number of chunks returned (should be ≤20)
   - `rag.chunks.filtered_count` - Number of chunks after metadata filtering
   - `rag.chunks.validated_count` - Number of chunks after validation (should be ≤5)

3. **Response Quality Metrics**:
   - `rag.response.confidence_score` - Overall confidence (0.0-1.0)
   - `rag.response.citation_count` - Number of citations in response
   - `rag.response.token_count` - Tokens in generated response
   - `rag.response.refusal_rate` - Percentage of queries refused (low confidence or no results)

4. **Error Metrics**:
   - `rag.errors.embedding_failures` - Count of embedding API failures
   - `rag.errors.qdrant_failures` - Count of vector search failures
   - `rag.errors.fallback_triggers` - Count of Postgres fallback activations
   - `rag.errors.generation_failures` - Count of LLM generation errors

5. **Mode & Action Metrics**:
   - `rag.mode.book_only_requests` - Count by mode
   - `rag.mode.selected_text_requests`
   - `rag.mode.general_requests`
   - `rag.action.explain_requests` - Count by action type
   - `rag.action.summarize_requests`

**Metric Storage**: Send metrics to Vercel Analytics (for dashboards) and Sentry (for alerting on anomalies).

**Alerting Thresholds**:
- Alert if `rag.response.confidence_score` p50 drops below 0.75 (indicates retrieval degradation)
- Alert if `rag.response.refusal_rate` exceeds 20% (indicates corpus coverage issues)
- Alert if `rag.total.latency` p95 exceeds 5 seconds (performance degradation)
- Alert if `rag.errors.fallback_triggers` > 10 per hour (Qdrant reliability issue)

---

### T-3: API Design

**Base URL**: `https://textbook-chatbot.vercel.app/api`

**Authentication**: API key in `Authorization: Bearer <token>` header (for server-side requests) or session cookie (for browser requests).

---

#### Endpoint: `POST /chat`

**Description**: Submit a user question and receive a bot response.

**Request**:
```json
{
  "conversation_id": "uuid-v4",  // Optional: create new if null
  "message": "What is inverse kinematics?",
  "mode": "book-only",  // "book-only" | "selected-text" | "general"
  "tone": "academic",   // "academic" | "beginner" | "concise"
  "book_id": "physical-ai-textbook",
  "chapter_id": 3,      // Optional: filter to specific chapter
  "selected_text": null,  // Required if mode = "selected-text"
  "action": null,       // "explain" | "summarize" | "example" | "simplify"
  "last_updated_at": "2026-01-28T10:29:50Z"  // Required for existing conversations (optimistic locking)
}
```

**Response (Book-Only or Selected-Text-Only mode)**:
```json
{
  "conversation_id": "uuid-v4",
  "message_id": "uuid-v4",
  "response": "Inverse kinematics (IK) is the process of determining joint angles required to position a robot's end-effector at a desired location [Ch3:Sec4:Para2]. Unlike forward kinematics, IK works backward from the desired pose to joint configurations [Ch3:Sec4:Para5].",
  "citations": [
    {
      "id": "Ch3:Sec4:Para2",
      "text": "Inverse kinematics solves for joint angles given a target end-effector pose...",
      "confidence": 0.92,
      "source_url": "/textbook/chapter-3#sec4-para2"
    },
    {
      "id": "Ch3:Sec4:Para5",
      "text": "Unlike forward kinematics, which computes pose from joint angles...",
      "confidence": 0.88,
      "source_url": "/textbook/chapter-3#sec4-para5"
    }
  ],
  "confidence_score": 0.90,
  "tokens_used": 1234,
  "mode": "book-only",
  "timestamp": "2026-01-28T10:30:00Z",
  "conversation_updated_at": "2026-01-28T10:30:00Z"  // New timestamp for optimistic locking
}
```

**Response (General Knowledge mode with dual-pass labeling)**:
```json
{
  "conversation_id": "uuid-v4",
  "message_id": "uuid-v4",
  "response": "[Textbook]\nInverse kinematics (IK) is the process of determining joint angles required to position a robot's end-effector at a desired location [Ch3:Sec4:Para2]. Unlike forward kinematics, IK works backward from the desired pose to joint configurations [Ch3:Sec4:Para5].\n\n[General Knowledge]\nBoston Dynamics uses advanced IK solvers in their Spot and Atlas robots to achieve dynamic balance during complex locomotion. Their approach combines analytical solutions for speed with numerical optimization for handling kinematic constraints and singularities in real-time.",
  "citations": [
    {
      "id": "Ch3:Sec4:Para2",
      "text": "Inverse kinematics solves for joint angles given a target end-effector pose...",
      "confidence": 0.92,
      "source_url": "/textbook/chapter-3#sec4-para2",
      "source_type": "textbook"
    },
    {
      "id": "Ch3:Sec4:Para5",
      "text": "Unlike forward kinematics, which computes pose from joint angles...",
      "confidence": 0.88,
      "source_url": "/textbook/chapter-3#sec4-para5",
      "source_type": "textbook"
    }
  ],
  "confidence_score": 0.90,
  "tokens_used": 1567,
  "mode": "general",
  "has_external_knowledge": true,
  "timestamp": "2026-01-28T10:30:00Z",
  "conversation_updated_at": "2026-01-28T10:30:00Z"  // New timestamp for optimistic locking
}
```

**Error Responses**:
- `400 Bad Request`: Invalid mode or missing required fields
- `409 Conflict`: Conversation was updated in another tab/device (optimistic locking failure). Response body: `{"error": "conversation_updated", "message": "This conversation was updated elsewhere. Please refresh.", "latest_updated_at": "2026-01-28T10:30:05Z"}`
- `429 Too Many Requests`: Rate limit exceeded (see rate limits below)
- `503 Service Unavailable`: OpenAI API or Qdrant unavailable

---

#### Endpoint: `GET /conversations/{conversation_id}`

**Description**: Retrieve conversation history.

**Response**:
```json
{
  "conversation_id": "uuid-v4",
  "messages": [
    {
      "id": "uuid-v4",
      "role": "user",
      "content": "What is inverse kinematics?",
      "timestamp": "2026-01-28T10:29:55Z"
    },
    {
      "id": "uuid-v4",
      "role": "assistant",
      "content": "Inverse kinematics (IK) is...",
      "citations": [...],
      "confidence_score": 0.90,
      "timestamp": "2026-01-28T10:30:00Z"
    }
  ],
  "metadata": {
    "book_id": "physical-ai-textbook",
    "mode": "book-only",
    "created_at": "2026-01-28T10:29:55Z",
    "updated_at": "2026-01-28T10:30:00Z"
  }
}
```

---

#### Endpoint: `POST /ingest`

**Description**: Upload and process a new textbook PDF for RAG indexing.

**Request** (multipart/form-data):
```
file: <PDF file>
book_id: "physical-ai-textbook"
metadata: {"author": "...", "year": 2026}
```

**Response**:
```json
{
  "book_id": "physical-ai-textbook",
  "status": "processing",
  "job_id": "uuid-v4",
  "estimated_completion": "2026-01-28T11:00:00Z"
}
```

**Processing Pipeline**:
1. Extract text from PDF (PyMuPDF)
2. Chunk text (semantic chunking with overlap)
3. Generate embeddings (OpenAI API)
4. Store in Qdrant (batch upload)
5. Update Postgres metadata

---

#### Background Job: Daily Cleanup

**Description**: Scheduled job to delete expired anonymous conversations.

**Schedule**: Daily at 2 AM UTC (Vercel Cron or AWS EventBridge)

**Implementation**:
```python
import psycopg2
from datetime import datetime

def cleanup_expired_conversations():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Delete expired anonymous conversations and their messages
    cursor.execute("""
        DELETE FROM conversations
        WHERE expires_at < NOW()
        AND is_authenticated = FALSE
        AND status != 'archived'
        RETURNING id
    """)

    deleted_count = cursor.rowcount
    conn.commit()

    # Log metrics
    print(f"Deleted {deleted_count} expired conversations at {datetime.utcnow()}")

    # Alert if deletion count is abnormally high
    if deleted_count > 10000:
        send_alert(f"High deletion count: {deleted_count} conversations deleted")

    cursor.close()
    conn.close()

    return deleted_count
```

**Monitoring**: Track deletion count, execution time, and failure rate in Sentry.

---

#### Concurrency Control: Optimistic Locking

**Problem**: Users may open the same conversation in multiple browser tabs or devices, leading to race conditions when creating messages simultaneously.

**Solution**: Implement optimistic locking using the `updated_at` timestamp.

**Implementation**:
```python
import psycopg2
from datetime import datetime

def create_message(conversation_id, user_message, last_updated_at, bot_response):
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Step 1: Verify conversation timestamp (optimistic lock check)
    cursor.execute("""
        SELECT updated_at FROM conversations
        WHERE id = %s
        FOR UPDATE  -- Lock row during transaction
    """, (conversation_id,))

    result = cursor.fetchone()
    if not result:
        conn.rollback()
        return {"error": "conversation_not_found"}, 404

    current_updated_at = result[0]

    # Step 2: Check if timestamp matches (optimistic lock validation)
    if current_updated_at != last_updated_at:
        conn.rollback()
        return {
            "error": "conversation_updated",
            "message": "This conversation was updated elsewhere. Please refresh.",
            "latest_updated_at": current_updated_at.isoformat()
        }, 409

    # Step 3: Insert user message
    cursor.execute("""
        INSERT INTO messages (conversation_id, role, content, mode, created_at)
        VALUES (%s, 'user', %s, %s, NOW())
    """, (conversation_id, user_message, "book-only"))

    # Step 4: Insert bot response
    cursor.execute("""
        INSERT INTO messages (conversation_id, role, content, mode, citations, confidence_score, created_at)
        VALUES (%s, 'assistant', %s, %s, %s, %s, NOW())
    """, (conversation_id, bot_response["content"], "book-only", bot_response["citations"], bot_response["confidence"]))

    # Step 5: Update conversation timestamp
    cursor.execute("""
        UPDATE conversations
        SET updated_at = NOW()
        WHERE id = %s
        RETURNING updated_at
    """, (conversation_id,))

    new_updated_at = cursor.fetchone()[0]
    conn.commit()

    cursor.close()
    conn.close()

    return {"conversation_updated_at": new_updated_at.isoformat()}, 200
```

**Edge Cases**:
- New conversations (no `last_updated_at` provided): Skip timestamp check
- Stale client (user hasn't refreshed in hours): 409 Conflict triggers refresh
- Rapid-fire questions from same client: Timestamp updates after each message, so subsequent requests use latest timestamp

---

### T-4: Data Models

**Database Schema (Neon Postgres)**:

```sql
-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),                     -- OAuth user_id (GitHub/Google) when authenticated, session_id when anonymous
    is_authenticated BOOLEAN DEFAULT FALSE,   -- TRUE if user_id is OAuth ID, FALSE if session_id
    book_id VARCHAR(255) NOT NULL,
    chapter_id INTEGER,                       -- Current chapter context
    mode VARCHAR(50) NOT NULL DEFAULT 'book-only',  -- "book-only" | "selected-text" | "general"
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,                     -- Set to NOW() + 24 hours for anonymous sessions, NULL for authenticated
    status VARCHAR(20) DEFAULT 'active',      -- "active" | "archived" | "expired"
    metadata JSONB                            -- Store tone, preferences, OAuth provider, etc.
);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_book ON conversations(book_id);
CREATE INDEX idx_conversations_expires ON conversations(expires_at) WHERE expires_at IS NOT NULL;

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,                -- "user" | "assistant"
    content TEXT NOT NULL,
    mode VARCHAR(50) NOT NULL,                -- Mode used for this message
    tone VARCHAR(50),                         -- "academic" | "beginner" | "concise"
    action VARCHAR(50),                       -- "explain" | "summarize" | "example" | "simplify"
    citations JSONB,                          -- Array of citation objects
    confidence_score FLOAT,                   -- 0.0 to 1.0
    tokens_used INTEGER,                      -- Token count for cost tracking
    created_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB                            -- Store any additional context
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- Analytics events table (optional)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,         -- "question_asked", "citation_clicked", "mode_switched"
    conversation_id UUID REFERENCES conversations(id),
    user_id VARCHAR(255),
    properties JSONB,                         -- Event-specific data
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
```

**Qdrant Collection Schema**:

```python
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

client.create_collection(
    collection_name="textbook_chunks",
    vectors_config=VectorParams(
        size=3072,  # text-embedding-3-large
        distance=Distance.COSINE
    )
)

# Payload schema for each vector point
{
    "chunk_id": "ch3_sec4_para2",
    "book_id": "physical-ai-textbook",
    "chapter": 3,
    "section": "4",
    "paragraph": 2,
    "text": "Full text of the chunk...",
    "metadata": {
        "page_number": 42,
        "heading": "Inverse Kinematics",
        "word_count": 150
    }
}
```

---

## Part III: Performance Specifications

### P-1: Response Time

**Requirement**: p95 response time < 3 seconds for chat queries.

**Breakdown**:
- Query embedding: < 200ms
- Vector search (Qdrant): < 300ms
- Reranking: < 400ms
- LLM generation: < 2s (TTFT < 500ms)
- Network overhead: < 100ms

**Measurement**: Monitor p50, p95, p99 latencies in Vercel Analytics.

**Fallback**: If LLM generation exceeds 2s, stream partial responses to improve perceived performance.

---

### P-2: Availability

**Target**: 99.9% uptime (< 43 minutes downtime per month).

**Strategy**:
- Use Vercel's 99.99% SLA for hosting
- Qdrant Cloud: Multi-region replication
- Neon Postgres: Automated backups every 6 hours
- Graceful degradation: If Qdrant unavailable, fall back to Postgres full-text search

**Monitoring**: Uptime alerts via Sentry + PagerDuty.

---

### P-3: Scalability

**Capacity**:
- Support 1,000 concurrent users
- Handle 10,000 questions per day
- Store 10 million textbook chunks (Qdrant capacity)

**Scaling Strategy**:
- Horizontal scaling: Vercel serverless functions auto-scale
- Qdrant: Increase cluster size as corpus grows
- Neon Postgres: Scale compute units dynamically

**Load Testing**: Use Locust or k6 to simulate 1,000 concurrent users before production launch.

---

## Part IV: Data Specifications

### D-1: Textbook Corpus

**Format**: PDF documents (one per textbook/module).

**Processing**:
1. Extract text with PyMuPDF (preserve formatting, headings, code blocks)
2. Chunk semantically (500-1000 words per chunk, 100-word overlap)
3. Generate embeddings for each chunk
4. Store in Qdrant with metadata (book_id, chapter, section, page)

**Metadata Structure**:
```json
{
  "chunk_id": "ch3_sec4_para2",
  "book_id": "physical-ai-textbook",
  "chapter": 3,
  "section": "4",
  "paragraph": 2,
  "heading": "Inverse Kinematics",
  "page_number": 42,
  "word_count": 150,
  "code_blocks": ["```python\n...```"],
  "images": ["fig_3_4.png"]
}
```

---

### D-2: Embedding Strategy

**Model**: OpenAI `text-embedding-3-large` (3072 dimensions)

**Fallback**: `text-embedding-3-small` (1536 dimensions, 5x cheaper, 80% accuracy)

**Cost Optimization**:
- Cache embeddings for frequently asked questions (Upstash Redis, TTL 7 days)
- Use `text-embedding-3-small` for less critical queries (e.g., analytics, suggestions)

**Embedding Generation**:
```python
import openai

def embed_text(text: str, model: str = "text-embedding-3-large") -> list[float]:
    response = openai.embeddings.create(model=model, input=text)
    return response.data[0].embedding
```

---

## Part V: UI/UX Specifications

### U-1: Visual Design

**Chat Widget**:
- Position: Fixed bottom-right corner, collapsible
- Dimensions: 400px width x 600px height (desktop), full-screen (mobile)
- Theme: Light mode (default), dark mode (toggle in settings)
- Colors:
  - User messages: Blue (#3B82F6)
  - Bot messages: Gray (#6B7280)
  - Citations: Green (#10B981)
  - Errors: Red (#EF4444)

**Typography**:
- Font: Inter (sans-serif)
- User/bot messages: 14px
- Citations: 12px
- Timestamps: 11px, gray

**Accessibility**:
- WCAG 2.1 AA compliance
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader support (ARIA labels)
- Contrast ratio > 4.5:1

---

### U-2: Interaction Design

**Message Input**:
- Placeholder: "Ask a question about this chapter..."
- Character limit: 2,000 (display counter at 1,800)
- Submit: Enter key (Shift+Enter for new line)
- Disable submit button while bot is typing

**Typing Indicator**:
- Display animated dots ("...") while bot is generating response
- Show estimated time remaining if > 3 seconds

**Citation Interaction**:
- Hover: Display tooltip with first 100 characters of source
- Click: Open modal with full source passage + confidence score + "Go to source" button
- "Go to source": Navigate to textbook section and highlight paragraph (2-second fade)

**Mode Switching**:
- Dropdown menu in chat header
- Display current mode as badge (e.g., "📖 Book-Only")
- Prompt user to switch modes when question can't be answered

**Source Labeling (General Knowledge Mode)**:
- "[Textbook]" sections: Green left-border (4px, #10B981), textbook icon (📖), slightly darker background (#F0FDF4)
- "[General Knowledge]" sections: Blue left-border (4px, #3B82F6), lightbulb icon (💡), slightly darker background (#EFF6FF)
- Section headers use bold font, 13px
- Clear visual separation (16px margin) between sections

---

### U-3: Responsive Design

**Desktop** (>= 1024px):
- Chat widget: 400px x 600px, fixed bottom-right
- Textbook: Full-width with sidebar navigation
- Citations modal: 600px width, centered

**Tablet** (768px - 1023px):
- Chat widget: 350px x 500px, fixed bottom-right
- Textbook: Full-width, collapsible sidebar

**Mobile** (< 768px):
- Chat widget: Full-screen overlay (slide up from bottom)
- Textbook: Single-column layout
- Citations modal: Full-screen

---

## Part VI: Testing & Validation

### V-1: Test Coverage

**Unit Tests**:
- Query embedding generation (mock OpenAI API)
- Vector search (mock Qdrant client)
- Citation extraction from responses
- Mode boundary enforcement logic

**Integration Tests**:
- End-to-end RAG pipeline (with test textbook corpus)
- API endpoints (`/chat`, `/conversations`, `/ingest`)
- Database operations (Postgres queries)

**E2E Tests** (Playwright):
- User asks question in Book-Only mode → receives answer with citations
- User highlights text → clicks "Explain" → receives Selected-Text-Only response
- User switches modes → mode badge updates
- User clicks citation → modal opens with source preview

**Performance Tests** (Locust):
- Simulate 1,000 concurrent users asking questions
- Verify p95 latency < 3s
- Verify no rate limit false positives

**Security Tests**:
- Attempt SQL injection in chat input
- Attempt XSS in markdown responses
- Attempt API key extraction from client-side code

---

### V-2: Quality Metrics

**Accuracy**:
- Manual review of 100 questions across modes
- Target: 95% of responses correctly cite sources
- Target: 0% hallucination rate (responses with incorrect information)

**Relevance**:
- Measure using NDCG (Normalized Discounted Cumulative Gain) on retrieval results
- Target: NDCG@5 > 0.85

**User Satisfaction**:
- Post-interaction survey: "Was this answer helpful?" (👍 / 👎)
- Target: 90% positive feedback

---

## Part VII: Security & Compliance

### S-8: Security Requirements

**Authentication**:
- OAuth 2.0 providers: GitHub OAuth, Google OAuth
- Session tokens: HTTPOnly cookies with 30-day expiration for authenticated users, session-only cookies for anonymous users
- No password storage (delegated to OAuth providers)
- CSRF protection: SameSite=Lax cookie attribute + CSRF tokens for state-changing operations

**API Security**:
- Rate limiting:
  - Anonymous users: 10 requests per hour (IP-based)
  - Authenticated users: 100 requests per hour (user_id-based)
- API keys: Rotate every 90 days (automated via Vercel secrets)
- Input sanitization: Reject queries with SQL/script injection patterns

**Data Security**:
- Encrypt data at rest (Postgres + Qdrant default encryption)
- Encrypt data in transit (HTTPS only, TLS 1.3)
- No PII in logs or analytics events (mask user_id and email in logs)

**Access Control**:
- Textbook content: Public (no authentication required)
- Chatbot usage: Public (anonymous allowed, authentication optional)
- Conversation history: User-scoped (users can only access their own conversations)
- Admin endpoints (`/ingest`): API key authentication required

---

### S-9: Privacy & Compliance

**Data Retention**:
- Anonymous conversations: Expire after 24 hours (`expires_at` set to NOW() + 24 hours on creation), deleted by daily cleanup job at 2 AM UTC
- Authenticated conversations: Retained indefinitely until user requests deletion (no automatic expiration)
- User-requested deletion: Conversations deleted immediately via `/delete-conversation` endpoint

**GDPR Compliance**:
- Users can request conversation deletion via `/delete-conversation` endpoint
- No tracking cookies (session cookies only)

**Logging**:
- Log sanitization: Remove PII from logs
- Retention: 90 days for application logs, 1 year for analytics

---

## Part VIII: Acceptance Criteria

### A-1: Definition of Done

**Feature is considered complete when**:

1. ✅ All user stories (P1, P2, P3) have passing E2E tests
2. ✅ Unit test coverage > 80% (backend), > 70% (frontend)
3. ✅ p95 response time < 3 seconds (measured via load testing)
4. ✅ Manual QA: 100 test questions across all modes → 95% accuracy
5. ✅ Security audit: No critical or high vulnerabilities in dependency scan (npm audit, pip-audit)
6. ✅ Accessibility audit: WCAG 2.1 AA compliance (Lighthouse score > 90)
7. ✅ Documentation: API documentation published (OpenAPI spec), user guide created
8. ✅ Monitoring: Sentry error tracking enabled, Vercel Analytics configured with RAG-specific metrics (stage latency, retrieval quality, confidence scores), alerts set up for p95 > 5s and confidence score p50 < 0.75
9. ✅ Observability: All RAG pipeline stages instrumented with metrics (embedding, search, rerank, validation, generation), dashboards created for retrieval quality and response quality
10. ✅ Deployment: Feature deployed to production, canary rollout (10% → 50% → 100% over 3 days)
11. ✅ PHR created: Prompt history record documented in `history/prompts/rag-textbook-chatbot/`

---

## Part IX: Future Enhancements (Out of Scope)

**F-1**: Features explicitly excluded from v1.0:

- **Multi-language support**: Translation of questions/responses (future: v2.0)
- **Voice input**: Speech-to-text for questions (future: v2.0)
- **Diagram generation**: Auto-generate diagrams from explanations (future: v2.5)
- **Personalized learning paths**: Track user progress and suggest next topics (future: v3.0)
- **Collaborative annotations**: Allow users to share highlights/notes (future: v3.0)
- **Export conversations**: Download chat history as PDF (future: v1.5)
- **Math equation rendering**: LaTeX support in responses (future: v1.5)
- **Code execution**: Run code snippets in responses (future: v2.0)

---

## Success Criteria (Technology-Agnostic)

### Measurable Outcomes

- **SC-001**: Students can find answers to textbook questions in < 3 seconds (p95)
- **SC-002**: 95% of bot responses include accurate citations traceable to textbook sources
- **SC-003**: 90% of users report satisfaction with answer quality (post-interaction survey)
- **SC-004**: System handles 1,000 concurrent users without degradation (load testing validation)
- **SC-005**: Zero security incidents in first 3 months post-launch
- **SC-006**: Reduce student support tickets related to "Where can I find X in the textbook?" by 60%

---

## Key Entities

- **Conversation**: A chat session between a user and the bot, scoped to a specific textbook and mode
- **Message**: A single user question or bot response within a conversation
- **Chunk**: A semantically meaningful segment of textbook content (500-1000 words) stored in Qdrant
- **Citation**: A reference to a specific chunk, displayed as `[ChX:SecY:ParaZ]` or `[ChunkID]` in responses
- **Mode**: The active knowledge boundary (Book-Only, Selected-Text-Only, General Knowledge)
- **Tone**: The linguistic style of bot responses (Academic, Beginner-friendly, Concise)
- **Action**: A user-triggered operation on highlighted text (Explain, Summarize, Example, Simplify)

---

## Appendix A: Glossary

- **RAG (Retrieval-Augmented Generation)**: A technique combining vector search (retrieval) with LLM generation to produce grounded, citation-backed answers.
- **Vector Embedding**: A high-dimensional numerical representation of text, enabling semantic similarity search.
- **Cosine Similarity**: A metric measuring similarity between two vectors (used in Qdrant search).
- **HNSW (Hierarchical Navigable Small World)**: An indexing algorithm for fast approximate nearest neighbor search.
- **Semantic Chunking**: Dividing text into coherent segments based on meaning rather than arbitrary boundaries.
- **Reranking**: A second-stage ranking process to improve retrieval quality (often using cross-encoders).
- **NLI (Natural Language Inference)**: A model detecting entailment/contradiction between text pairs (used for grounding validation).
- **TTFT (Time To First Token)**: The latency before the LLM starts streaming its response.

---

## Appendix B: Related Documentation

- Constitution: `.specify/memory/constitution-rag-chatbot.md`
- Architecture Decision Records (ADRs): `history/adr/` (to be created during planning phase)
- API Documentation: `docs/api/rag-chatbot.openapi.yaml` (to be generated)
- User Guide: `docs/user-guide/chatbot-usage.md` (to be created)

---

## Changelog

- **v2.0** (2026-01-28): Comprehensive specification with 8 parts (Functional, Technical, Performance, Data, UI/UX, Testing, Security, Acceptance)
- **v1.0** (2026-01-27): Initial draft (constitution-aligned principles)

---

**End of Specification**
