# RAG Retrieval for Textbook Queries

Perform semantic search retrieval against Qdrant vector store with scope enforcement, reranking, and deterministic result reproducibility. Retrieves evidence chunks for agent responses with support for book-only, selected-text-only, and general knowledge modes.

## Purpose

This skill handles query retrieval for RAG (Retrieval-Augmented Generation) pipelines. It provides:
- Query embedding generation (OpenAI/Cohere)
- Semantic search against Qdrant Cloud
- Scope enforcement (book-only, selected-text-only, general)
- Metadata filtering by chapter, section, difficulty
- Multiple reranking strategies for precision
- Deterministic retrieval for reproducible evaluation
- Context window optimization (token limits)

## When to Use

Invoke this skill when:
- **Agent needs evidence**: RAG agent needs chunks to answer a query
- **Query answering**: User asks a question requiring textbook context
- **Scope testing**: Testing book-only vs general knowledge modes
- **Reranking evaluation**: Comparing reranking strategies
- **Debugging retrieval**: Understanding why certain chunks are retrieved
- **Performance analysis**: Measuring retrieval precision and recall

## Usage

```bash
# Basic retrieval
/rag-retrieval query "What is ROS 2?" --collection textbook-v1

# With scope enforcement
/rag-retrieval query "ROS 2 explained" --mode book-only --limit 5

# Selected text mode (from UI highlight)
/rag-retrieval query "explain this concept" --mode selected-text-only --selected-text "The IK problem..."

# With reranking
/rag-retrieval query "publishers" --rerank cohere --top-n 5

# Deterministic (for evaluation)
/rag-retrieval query "..." --deterministic true

# With metadata filters
/rag-retrieval query "beginner intro" --filter difficulty=beginner --limit 10

# Batch retrieval for multiple queries
/rag-retrieval batch --input queries.jsonl --output results.jsonl
```

## Retrieval Modes

### 1. Book-Only Mode (Most Restrictive)
Retrieves only from textbook content. Refuses queries requiring external knowledge.

**Use case**: Textbook comprehension questions, fact recall, code examples

**Algorithm**:
```python
def retrieve_book_only(query, qdrant_collection, limit=10):
    # Generate query embedding
    query_embedding = generate_embedding(query)

    # Search Qdrant with no external context
    results = qdrant_search(
        collection=qdrant_collection,
        query_vector=query_embedding,
        limit=limit
    )

    # Verify results have sufficient relevance
    if not results or results[0].score < 0.7:
        return {
            "status": "insufficient_context",
            "message": "Query cannot be answered from textbook alone",
            "results": []
        }

    return {"status": "success", "results": results}
```

**Constraints**:
- Must find at least 1 chunk with score > 0.7
- Cannot use external knowledge
- Answers must cite textbook sources

**Example**:
```
Query: "What are the key features of ROS 2?"
Result: ✓ Found in textbook (Week 1, Key Features section)

Query: "Compare ROS 2 to ROS 1"
Result: ✓ Found in textbook (Week 1, Differences section)

Query: "Should I use ROS 2 or Python directly?"
Result: ✗ Not answerable from textbook alone (opinion-based)
```

### 2. Selected-Text-Only Mode (Strictest)
Retrieves only from a user-selected passage. Answers questions about the highlighted text.

**Use case**: "Explain this paragraph", "Summarize this code block", "Clarify this concept"

**Algorithm**:
```python
def retrieve_selected_text_only(query, selected_text, qdrant_collection):
    # Generate query embedding
    query_embedding = generate_embedding(query)

    # Generate selected text embedding
    selected_embedding = generate_embedding(selected_text)

    # Search only chunks with high similarity to selected text
    # Strategy: Use selected text as filter context
    results = qdrant_search(
        collection=qdrant_collection,
        query_vector=query_embedding,
        limit=20
    )

    # Filter to chunks related to selected text
    filtered_results = []
    for result in results:
        # Calculate similarity to selected text
        chunk_selected_sim = cosine_similarity(
            result.vector,
            selected_embedding
        )

        # Keep if strongly related to selected text
        if chunk_selected_sim > 0.75:
            filtered_results.append(result)

    return filtered_results
```

**Constraints**:
- Can only reference the highlighted passage
- Cannot introduce external knowledge
- Answers must directly address selected text
- Max 3-5 chunks returned

**Example**:
```
Selected: "Publishers send messages to topics..."

Query: "Explain this architecture"
Result: ✓ Return chunks about publisher-subscriber pattern

Query: "How is this different from services?"
Result: ✓ Return chunks comparing pub/sub to services

Query: "Can this work with MQTT?"
Result: ✗ External knowledge (MQTT not in textbook)
```

### 3. General Knowledge Mode (Least Restrictive)
Retrieves from textbook with optional external knowledge for context.

**Use case**: "How does this apply in industry?", "Give examples of ROS 2 usage"

**Algorithm**:
```python
def retrieve_general_mode(query, qdrant_collection, limit=10):
    # Generate query embedding
    query_embedding = generate_embedding(query)

    # Search Qdrant
    results = qdrant_search(
        collection=qdrant_collection,
        query_vector=query_embedding,
        limit=limit
    )

    return {
        "status": "success",
        "results": results,
        "external_knowledge_allowed": True
    }
```

**Constraints**:
- Primary source: textbook
- Can supplement with external knowledge if needed
- Must cite textbook sources for facts
- External context must be clearly marked

## Query Embedding Generation

### OpenAI Embedding (Recommended)
```python
import openai

def generate_query_embedding(query):
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    return response.data[0].embedding
```

**Model recommendations**:
- `text-embedding-3-small` (1536 dims) - **Default, best value**
- `text-embedding-3-large` (3072 dims) - Higher quality, 6.5x cost

### Cohere Embedding
```python
import cohere

def generate_query_embedding_cohere(query):
    co = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))

    response = co.embed(
        texts=[query],
        model="embed-english-v3.0",
        input_type="search_query"
    )
    return response.embeddings[0]
```

**Recommendation**: Use Cohere if you're already using Cohere Rerank.

### Query Preprocessing
Improve embedding quality by cleaning queries:

```python
def preprocess_query(query):
    # Remove extra whitespace
    query = ' '.join(query.split())

    # Remove common stop words at start
    stop_words = ['explain', 'describe', 'tell me about', 'what is', 'how does']
    for stop_word in stop_words:
        if query.lower().startswith(stop_word):
            query = query[len(stop_word):].strip()

    # Remove question mark if at end
    if query.endswith('?'):
        query = query[:-1].strip()

    # Ensure minimum length
    if len(query) < 5:
        query = query  # Don't preprocess very short queries

    return query
```

**Example**:
```
Original: "Explain what publishers and subscribers are in ROS 2?"
Preprocessed: "publishers and subscribers in ROS 2"
```

## Semantic Search with Qdrant

### Basic Search
```python
def search_qdrant(query_embedding, collection_name, limit=10):
    results = client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=limit,
        with_payload=True,
        with_vectors=False
    )

    return results
```

### Search with Metadata Filtering
Filter by chapter, section, difficulty:

```python
from qdrant_client.models import Filter, FieldCondition, MatchValue

def search_with_filter(query_embedding, collection_name, filters, limit=10):
    # Build filter
    must_conditions = []

    if filters.get('chapter'):
        must_conditions.append(
            FieldCondition(
                key="chapter",
                match=MatchValue(value=filters['chapter'])
            )
        )

    if filters.get('difficulty'):
        must_conditions.append(
            FieldCondition(
                key="difficulty",
                match=MatchValue(value=filters['difficulty'])
            )
        )

    if filters.get('contains_code'):
        must_conditions.append(
            FieldCondition(
                key="contains_code",
                match=MatchValue(value=filters['contains_code'])
            )
        )

    # Search with filter
    results = client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        query_filter=Filter(must=must_conditions) if must_conditions else None,
        limit=limit
    )

    return results
```

### Scope-Based Filtering
Enforce scope constraints based on retrieval mode:

```python
def apply_scope_filter(query_embedding, collection_name, mode, limit=10,
                       selected_text=None, selected_embedding=None):
    """Apply scope enforcement based on retrieval mode"""

    if mode == "book_only":
        # Standard search, high minimum relevance
        results = search_qdrant(query_embedding, collection_name, limit=limit)

        # Filter by score threshold
        results = [r for r in results if r.score > 0.7]

        if not results:
            return {
                "status": "insufficient_context",
                "mode": "book_only",
                "message": "Query cannot be answered from textbook"
            }

    elif mode == "selected_text_only":
        # Initial search
        results = search_qdrant(query_embedding, collection_name, limit=20)

        # Re-rank by similarity to selected text
        scored_results = []
        for result in results:
            selected_sim = cosine_similarity(
                result.vector if hasattr(result, 'vector') else generate_embedding(result.payload['content']),
                selected_embedding
            )

            # Combine query similarity and selected text similarity
            combined_score = 0.7 * result.score + 0.3 * selected_sim

            scored_results.append({
                "result": result,
                "score": combined_score
            })

        # Sort and limit
        scored_results.sort(key=lambda x: x['score'], reverse=True)
        results = [x['result'] for x in scored_results[:limit]]

    else:  # general mode
        results = search_qdrant(query_embedding, collection_name, limit=limit)

    return {
        "status": "success",
        "mode": mode,
        "results": results
    }
```

## Reranking Strategies

### Strategy 1: Cohere Rerank
Best quality, costs $1/1000 searches.

```python
import cohere

def rerank_with_cohere(query, results, top_n=5):
    co = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))

    # Extract documents
    documents = [r.payload['content'] for r in results]

    # Rerank
    reranked = co.rerank(
        model="rerank-english-v3.0",
        query=query,
        documents=documents,
        top_n=top_n,
        return_documents=True
    )

    # Map back to results
    reranked_results = []
    for item in reranked.results:
        original_idx = item.index
        result = results[original_idx]
        result.rerank_score = item.relevance_score
        reranked_results.append(result)

    return reranked_results
```

### Strategy 2: Local Reranking (Free)
Use cross-encoder for local reranking without cost.

```python
from sentence_transformers import CrossEncoder

def rerank_local(query, results, top_n=5):
    model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

    # Prepare pairs
    pairs = [
        (query, r.payload['content'][:500])
        for r in results
    ]

    # Score
    scores = model.predict(pairs)

    # Sort by scores
    ranked = sorted(
        zip(results, scores),
        key=lambda x: x[1],
        reverse=True
    )

    # Extract top-n
    reranked_results = [r for r, _ in ranked[:top_n]]

    return reranked_results
```

### Strategy 3: BM25 Keyword Boost
Fast local reranking using keyword matching.

```python
def rerank_keyword_boost(query, results, top_n=5, boost_factor=1.5):
    query_keywords = set(query.lower().split())

    # Boost results containing keywords
    boosted = []
    for result in results:
        content = result.payload['content'].lower()

        # Count keyword matches
        matches = sum(1 for kw in query_keywords if kw in content)

        # Boost score
        if matches > 0:
            boost = 1 + (boost_factor * matches / len(query_keywords))
            result.score *= boost

        boosted.append(result)

    # Re-sort and limit
    boosted.sort(key=lambda r: r.score, reverse=True)

    return boosted[:top_n]
```

## Deterministic Retrieval

For reproducible evaluation, use exact search:

```python
from qdrant_client.models import SearchParams

def search_deterministic(query_embedding, collection_name, limit=10):
    """Deterministic search with exact matching"""
    results = client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=limit,
        search_params=SearchParams(
            hnsw_ef=128,
            exact=True  # Force exact search
        )
    )

    return results
```

**Properties**:
- Same query → identical results every time
- Slower than approximate (exhaustive search)
- Good for evaluation, not production

## Implementation Steps

When invoked, this skill executes:

### Step 1: Validate Inputs
```python
def validate_query_input(query, mode, selected_text=None):
    # Check query length
    if not query or len(query.strip()) < 3:
        raise ValueError("Query too short (minimum 3 characters)")

    # Check mode
    valid_modes = ["book_only", "selected_text_only", "general"]
    if mode not in valid_modes:
        raise ValueError(f"Invalid mode: {mode}")

    # Check selected_text if needed
    if mode == "selected_text_only" and not selected_text:
        raise ValueError("selected_text required for selected_text_only mode")

    return True
```

### Step 2: Preprocess Query
```python
query = preprocess_query(query)
```

### Step 3: Generate Embeddings
```python
# Query embedding
query_embedding = generate_query_embedding(query)

# Selected text embedding (if needed)
if mode == "selected_text_only":
    selected_embedding = generate_query_embedding(selected_text)
else:
    selected_embedding = None
```

### Step 4: Search with Scope
```python
search_result = apply_scope_filter(
    query_embedding=query_embedding,
    collection_name=collection_name,
    mode=mode,
    limit=limit + 10,  # Get extra for reranking
    selected_text=selected_text,
    selected_embedding=selected_embedding
)

if search_result['status'] != 'success':
    return search_result

results = search_result['results']
```

### Step 5: Rerank (Optional)
```python
if rerank_strategy:
    results = rerank_with_strategy(
        query=query,
        results=results,
        strategy=rerank_strategy,
        top_n=top_n
    )
```

### Step 6: Format Results
```python
formatted_results = []
for i, result in enumerate(results):
    formatted_result = {
        "rank": i + 1,
        "chunk_id": result.payload['chunk_id'],
        "content": result.payload['content'][:1000],  # Truncate for display
        "score": result.score,
        "chapter": result.payload['chapter'],
        "section": result.payload['section'],
        "difficulty": result.payload.get('difficulty', 'unknown'),
        "slug": result.payload.get('slug', ''),
        "metadata": {
            "contains_code": result.payload.get('contains_code', False),
            "contains_math": result.payload.get('contains_math', False),
            "word_count": result.payload.get('word_count', 0),
            "token_count": result.payload.get('token_count', 0)
        }
    }
    formatted_results.append(formatted_result)

return formatted_results
```

## Output Format

### Single Query Result
```json
{
  "query": "What is ROS 2?",
  "mode": "book_only",
  "status": "success",
  "results": [
    {
      "rank": 1,
      "chunk_id": "physical-ai-textbook-7f3a9b2c1d4e5f6a",
      "content": "# What is ROS 2?\n\nROS 2 (Robot Operating System 2)...",
      "score": 0.8945,
      "chapter": "Week 1: Introduction to ROS 2",
      "section": "What is ROS 2?",
      "difficulty": "beginner",
      "slug": "/docs/week-1/what-is-ros2",
      "metadata": {
        "contains_code": false,
        "contains_math": false,
        "word_count": 342,
        "token_count": 456
      }
    }
  ],
  "retrieval_time_ms": 45,
  "embedding_time_ms": 12
}
```

### Batch Queries Result
```jsonl
{"query":"What is ROS 2?","mode":"book_only","status":"success","results":[...]}
{"query":"Explain publishers","mode":"book_only","status":"success","results":[...]}
```

## Configuration Options

```json
{
  "embedding": {
    "provider": "openai",
    "model": "text-embedding-3-small",
    "dimensions": 1536,
    "preprocess_query": true
  },
  "retrieval": {
    "default_limit": 10,
    "score_threshold_book_only": 0.7,
    "score_threshold_selected_text": 0.75,
    "search_mode": "approximate",
    "deterministic": false
  },
  "reranking": {
    "enabled": true,
    "strategy": "cohere",
    "initial_retrieve": 20,
    "final_top_n": 5
  },
  "scope_enforcement": {
    "book_only": {
      "min_results_required": 1,
      "min_score_threshold": 0.7,
      "allow_external_knowledge": false
    },
    "selected_text_only": {
      "selected_text_weight": 0.3,
      "query_weight": 0.7,
      "max_results": 5,
      "allow_external_knowledge": false
    },
    "general": {
      "min_results_required": 0,
      "allow_external_knowledge": true
    }
  },
  "output": {
    "truncate_content": 1000,
    "include_full_payload": false,
    "include_vectors": false
  }
}
```

## Error Handling

### Insufficient Context (Book-Only Mode)
```python
def handle_insufficient_context():
    return {
        "status": "insufficient_context",
        "mode": "book_only",
        "message": "Your question cannot be answered from the textbook alone.",
        "suggestion": "Try asking about specific textbook concepts or topics covered in the lessons."
    }
```

### Connection Failures
```python
def handle_connection_error(error):
    return {
        "status": "error",
        "error_type": "connection_error",
        "message": "Failed to connect to Qdrant Cloud",
        "details": str(error)
    }
```

### Empty Results
```python
def handle_empty_results():
    return {
        "status": "no_results",
        "message": "No relevant chunks found for your query",
        "suggestion": "Try rephrasing your question or searching for related concepts"
    }
```

## Performance Optimization

### Query Caching
Cache embeddings for repeated queries:

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_cached_embedding(query):
    return generate_query_embedding(query)
```

### Batch Processing
Process multiple queries efficiently:

```python
def batch_retrieve(queries, collection_name, batch_size=10):
    results = []

    for i in range(0, len(queries), batch_size):
        batch = queries[i:i + batch_size]

        # Generate embeddings in parallel
        embeddings = [generate_query_embedding(q) for q in batch]

        # Search in parallel
        for query, embedding in zip(batch, embeddings):
            result = search_qdrant(embedding, collection_name)
            results.append({"query": query, "results": result})

    return results
```

## Best Practices

### Query Formulation
- Be specific: "ROS 2 publishers in Python" vs "ROS 2"
- Include context: "How do I create" vs "Create"
- Use keywords from content: Improves semantic matching

### Scope Selection
- **Book-only**: When exact textbook answer needed
- **Selected-text-only**: When clarifying specific passage
- **General**: When external examples helpful

### Reranking Strategy
- **Cohere**: Production, best quality
- **Local cross-encoder**: Development, free
- **Keyword boost**: Fast approximation

### Result Interpretation
- Score 0.8-1.0: Highly relevant
- Score 0.6-0.8: Moderately relevant
- Score < 0.6: Potentially off-topic

## Integration Points

### With RAG Agents
- **rag-intent-router**: Receives query intent classification
- **context-scope-enforcer**: Enforces scope boundaries
- **evidence-validator**: Validates retrieved evidence
- **response-generator**: Uses retrieved chunks for response

### With Storage
- **qdrant-vector-storage**: Performs semantic search

## Acceptance Criteria

A successful retrieval must:
- [ ] Connect to Qdrant and retrieve results
- [ ] Enforce scope constraints (book-only, selected-text-only)
- [ ] Return results with correct metadata
- [ ] Support reranking (deterministic and improved precision)
- [ ] Handle errors gracefully (no context, connection failures)
- [ ] Return results within 500ms (typical)
- [ ] Support batch queries
- [ ] Generate query embeddings correctly

## Related Skills and Agents

- **qdrant-vector-storage** - Provides vector search capability
- **rag-intent-router** - Classifies query intent and routes to retrieval
- **context-scope-enforcer** - Enforces retrieval scope
- **evidence-validator** - Validates retrieved evidence
- **response-generator** - Generates responses from retrieved chunks

## Next Steps After Retrieval

1. **Validate evidence** with evidence-validator
2. **Generate response** using retrieved chunks
3. **Cite sources** by linking to chunk_ids
4. **Track metrics** (precision, recall, latency)
5. **Evaluate reranking** impact on quality

---

**Note**: This skill focuses on retrieval. Response generation and validation are separate concerns handled by other agents.
