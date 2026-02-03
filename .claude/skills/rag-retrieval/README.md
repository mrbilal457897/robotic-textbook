# RAG Retrieval Skill

Semantic search retrieval with scope enforcement for RAG queries. Retrieves evidence chunks from Qdrant with support for book-only, selected-text-only, and general knowledge modes, with optional reranking for improved precision.

## Quick Start

```bash
# Basic retrieval
/rag-retrieval query "What is ROS 2?" --collection textbook-v1

# Book-only mode (from textbook only)
/rag-retrieval query "ROS 2 basics" --mode book-only --limit 5

# Selected text mode (explain highlighted passage)
/rag-retrieval query "explain this" --mode selected-text-only --selected "The IK problem..."

# With reranking
/rag-retrieval query "publishers" --rerank cohere --top-n 5

# Deterministic (reproducible results)
/rag-retrieval query "..." --deterministic true

# Batch retrieval
/rag-retrieval batch --input queries.jsonl --output results.jsonl
```

## What It Does

This skill provides semantic search retrieval for RAG systems:
- **Query embedding** - Convert natural language to vectors (OpenAI/Cohere)
- **Semantic search** - Find similar chunks in Qdrant
- **Scope enforcement** - Restrict to book-only or selected text
- **Reranking** - Improve precision (Cohere, cross-encoder, keyword)
- **Deterministic** - Reproducible results for evaluation
- **Filtering** - By chapter, section, difficulty, code/math flags

## Retrieval Modes

### Book-Only Mode (Most Restrictive)
Retrieve only from textbook. Refuses external knowledge queries.

```bash
/rag-retrieval query "What are ROS 2 key features?" --mode book-only
```

**Constraints**:
- Min score: 0.7
- Must find in textbook
- No external knowledge

**Use cases**:
- Fact recall from lessons
- Code examples
- Textbook definitions

### Selected-Text-Only Mode (Strictest)
Retrieve from highlighted passage only.

```bash
/rag-retrieval query "explain this" --mode selected-text-only --selected-text "Publishers send..."
```

**Constraints**:
- Chunks must relate to selected text
- No external context
- Max 5 results

**Use cases**:
- Clarify paragraph
- Explain code
- Summarize section

### General Mode (Least Restrictive)
Retrieve from textbook with optional external knowledge.

```bash
/rag-retrieval query "How is ROS 2 used in industry?" --mode general
```

**Constraints**:
- Primary: textbook
- Can supplement with external knowledge
- Must cite textbook sources

**Use cases**:
- Real-world examples
- Practical applications
- Industry context

## Query Processing

### Preprocessing
Queries are automatically cleaned:
- Remove stop words ("explain", "what is", "tell me about")
- Normalize whitespace
- Remove question marks

**Example**:
```
Input:  "What is a publisher in ROS 2?"
Output: "publisher ROS 2"
```

### Embedding Generation
Convert queries to vectors using OpenAI:

```python
# Short query → 1536-dim vector
query = "publishers and subscribers"
embedding = generate_embedding(query)  # OpenAI text-embedding-3-small
```

### Semantic Search
Find similar chunks in Qdrant:

```python
results = client.search(
    collection="textbook-v1",
    query_vector=embedding,
    limit=10
)
```

## Output Format

```json
{
  "query": "What is ROS 2?",
  "mode": "book_only",
  "status": "success",
  "results": [
    {
      "rank": 1,
      "chunk_id": "physical-ai-textbook-7f3a9b2c",
      "content": "# What is ROS 2?\n\nROS 2 is...",
      "score": 0.8945,
      "chapter": "Week 1: Introduction to ROS 2",
      "section": "What is ROS 2?",
      "difficulty": "beginner",
      "slug": "/docs/week-1/what-is-ros2",
      "metadata": {
        "contains_code": false,
        "word_count": 342,
        "token_count": 456
      }
    }
  ],
  "retrieval_time_ms": 45,
  "embedding_time_ms": 12
}
```

## Reranking Strategies

### Cohere Rerank (Best Quality)
- Model: rerank-english-v3.0
- Cost: $1/1000 searches
- Quality: Highest
- Speed: ~100-200ms per query

```bash
/rag-retrieval query "..." --rerank cohere --top-n 5
```

### Local Cross-Encoder (Free)
- Model: ms-marco-MiniLM-L-6-v2
- Cost: Free (requires GPU)
- Quality: Good
- Speed: ~50ms per query

```bash
/rag-retrieval query "..." --rerank cross-encoder --top-n 5
```

### Keyword Boost (Fast)
- Cost: Free
- Quality: Good approximation
- Speed: < 1ms

```bash
/rag-retrieval query "..." --rerank keyword-boost --top-n 5
```

## Deterministic Retrieval

For reproducible evaluation, use deterministic mode:

```bash
/rag-retrieval query "..." --deterministic true
```

**Properties**:
- Exact search (not approximate)
- Same query → identical results
- Slower (exhaustive search)

**Use cases**:
- Evaluation/benchmarking
- Testing
- Debugging

## Filtering

Filter results by metadata:

```bash
# Beginner content only
/rag-retrieval query "ROS 2 basics" --filter difficulty=beginner

# From Week 1 only
/rag-retrieval query "..." --filter chapter="Week 1"

# Code examples
/rag-retrieval query "..." --filter contains_code=true

# Multiple filters (AND)
/rag-retrieval query "..." --filter difficulty=beginner --filter chapter="Week 1"
```

## Configuration

Edit `config.json`:

```json
{
  "embedding": {
    "provider": "openai",
    "model": "text-embedding-3-small"
  },
  "retrieval": {
    "default_limit": 10,
    "score_threshold_book_only": 0.7
  },
  "reranking": {
    "enabled": true,
    "strategy": "cohere",
    "final_top_n": 5
  }
}
```

## Error Handling

### Insufficient Context (Book-Only)
```json
{
  "status": "insufficient_context",
  "mode": "book_only",
  "message": "Query cannot be answered from textbook alone",
  "suggestion": "Try asking about specific textbook topics"
}
```

### Connection Error
```json
{
  "status": "error",
  "error_type": "connection_error",
  "message": "Failed to connect to Qdrant Cloud"
}
```

### Empty Results
```json
{
  "status": "no_results",
  "message": "No relevant chunks found"
}
```

## Performance

Typical metrics:
- **Embedding**: 10-30ms (OpenAI)
- **Search**: 20-50ms (Qdrant)
- **Reranking**: 100-300ms (Cohere)
- **Total**: 130-380ms

For 10 results without reranking: ~50ms
For 10 results with reranking: ~200ms

## Best Practices

### Mode Selection
- **book_only**: Fact questions about textbook
- **selected_text_only**: Clarifying specific passages
- **general**: Real-world examples, applications

### Query Formulation
- Be specific: "ROS 2 publishers in Python"
- Include context: "How do I create a subscriber?"
- Use textbook keywords: Improves matching

### Reranking Strategy
- **Production**: Use Cohere (best quality)
- **Development**: Use local cross-encoder (free)
- **Speed-critical**: Use keyword boost

### Score Interpretation
- 0.8-1.0: Highly relevant
- 0.6-0.8: Moderately relevant
- 0.5-0.6: Potentially on-topic
- < 0.5: Off-topic (book-only mode)

## Integration

### Complete RAG Pipeline
```bash
# User query
Query: "What is ROS 2?"

# 1. Intent routing
/rag-intent-router classify-query --query "What is ROS 2?"

# 2. Retrieve evidence
/rag-retrieval query "What is ROS 2?" --mode book-only

# 3. Validate evidence
/evidence-validator validate --query "..." --chunks [...]

# 4. Generate response
/response-generator generate --query "..." --chunks [...]

# 5. Add citations
/citation-attribution cite --response "..." --chunks [...]
```

### With Other Skills
- **qdrant-vector-storage** - Provides search endpoint
- **embedding-generation** - Created the vectors being searched
- **semantic-chunking** - Created chunks with metadata

## Batch Queries

Process multiple queries:

```bash
# queries.jsonl
{"query": "What is ROS 2?", "mode": "book_only"}
{"query": "Explain publishers", "mode": "book_only"}

# Process batch
/rag-retrieval batch --input queries.jsonl --output results.jsonl
```

## Caching

Query embeddings are cached (LRU, size 1000):
- First query: 30ms (embedding + search)
- Repeated query: < 1ms (cache hit)

## Monitoring

Track retrieval quality:
```bash
/rag-retrieval metrics --start-date 2025-01-27
```

Output:
```json
{
  "avg_retrieval_time_ms": 45,
  "avg_rank_1_score": 0.87,
  "queries_no_results": 2,
  "reranking_impact": 0.12,
  "total_queries": 100
}
```

## Validation

The skill validates:
- [x] Query length (min 3 chars)
- [x] Valid mode (book_only, selected_text_only, general)
- [x] Collection exists
- [x] Qdrant connection
- [x] API key validity

## Related Skills

- **qdrant-vector-storage** - Vector storage and search
- **embedding-generation** - Creates embeddings
- **semantic-chunking** - Creates searchable chunks
- **rag-intent-router** - Routes queries to retrieval
- **evidence-validator** - Validates retrieved chunks
- **response-generator** - Generates from chunks

## Version

1.0.0 - Initial release

## See Also

- Full documentation: `skill.md`
- Configuration reference: `config.json`
- Concrete examples: `examples.md`
