# Qdrant Vector Storage Skill

Manage vector storage and retrieval in Qdrant Cloud for textbook RAG systems. Production-ready collection management, batch uploads, semantic search with filtering, reranking, and free tier optimizations.

## Quick Start

```bash
# Create collection
/qdrant-vector-storage create-collection --name textbook-v1 --dimension 1536

# Upload embeddings
/qdrant-vector-storage upload --input chunks-with-embeddings.jsonl --collection textbook-v1

# Search
/qdrant-vector-storage search --query "What is ROS 2?" --collection textbook-v1 --limit 10

# Search with filters
/qdrant-vector-storage search --query "explain publishers" --filter chapter="Week 1" --limit 5

# Rerank results
/qdrant-vector-storage search --query "publishers" --rerank cohere --top-n 5

# Collection info
/qdrant-vector-storage get-collection-info --collection textbook-v1

# List all collections
/qdrant-vector-storage list-collections
```

## Setup

### 1. Create Qdrant Cloud Account
1. Visit https://cloud.qdrant.io/
2. Sign up for free tier (1GB storage, 1M vectors)
3. Create a cluster

### 2. Get Credentials
From Qdrant Cloud dashboard:
- **Cluster URL**: `https://xyz.qdrant.io:6333`
- **API Key**: Your API key

### 3. Configure Environment
```bash
# .env file
QDRANT_URL=https://xyz.qdrant.io:6333
QDRANT_API_KEY=your-api-key-here

# For reranking (optional)
COHERE_API_KEY=your-cohere-key
```

## What It Does

This skill provides complete Qdrant Cloud integration:
- **Collection management** - Create, list, delete collections
- **Batch uploads** - Upload embeddings with progress tracking
- **Semantic search** - Vector similarity with metadata filtering
- **Reranking** - Multiple strategies (Cohere, cross-encoder, MMR, RRF)
- **Free tier optimization** - Quantization, payload optimization
- **Idempotent operations** - Safe re-runs with state tracking
- **Deterministic retrieval** - Reproducible results for evaluation

## Key Features

### Collection Management
Create collections with optimal schemas:
```python
# Vector config
- Size: 1536 (OpenAI text-embedding-3-small)
- Distance: Cosine (recommended for most embeddings)

# Payload indexes (for filtering)
- chapter (keyword)
- section (keyword)
- difficulty (keyword)
- contains_code (bool)
```

### Batch Upload
Upload embeddings efficiently:
- Batch size: 100-500 points
- Progress tracking with checkpoints
- Idempotent (safe to re-run)
- Deterministic point IDs (UUID5 from chunk_id)

### Semantic Search
Search with rich filtering:
```python
# Basic search
results = search(query_vector, limit=10)

# Filter by chapter
results = search(query_vector, filter={"chapter": "Week 1"}, limit=10)

# Filter by multiple conditions
results = search(
    query_vector,
    filter={
        "must": [
            {"chapter": "Week 1"},
            {"contains_code": True},
            {"difficulty": "beginner"}
        ]
    },
    limit=10
)
```

### Reranking Strategies

**1. Cohere Rerank** (Best quality)
- Model: rerank-english-v3.0
- Cost: $1/1000 searches
- Initial retrieve: 50, Final: 10

**2. Cross-Encoder** (Free, local)
- Model: ms-marco-MiniLM-L-6-v2
- Requires GPU for speed

**3. Keyword Boost** (Simple, fast)
- Boosts results containing query keywords

**4. MMR** (Diversity)
- Maximal Marginal Relevance
- Reduces redundancy in results

**5. RRF** (Fusion)
- Reciprocal Rank Fusion
- Combines multiple search strategies

## Free Tier Limits

**Qdrant Cloud Free Tier**:
- Storage: 1 GB
- Vectors: 1M points
- Clusters: 1
- Requests: Unlimited (rate-limited)

**Optimization Strategies**:
- Enable quantization (int8) → 4x storage reduction
- Truncate content to 5000 chars
- Remove debug fields
- Use efficient data types

**Monitoring**:
```bash
/qdrant-vector-storage check-storage --collection textbook-v1
```

Output:
```
Collection: textbook-v1
Points: 523
Disk size: 45.2 MB (0.044 GB)
Free tier limit: 1 GB
Usage: 4.4%
Status: OK ✓
```

## Payload Schema

Recommended structure for textbook chunks:
```json
{
  "chunk_id": "physical-ai-textbook-7f3a9b2c",
  "content": "# Publishers and Subscribers\n\n...",
  "chapter": "Week 1: Introduction to ROS 2",
  "section": "Publishers and Subscribers",
  "subsection": "Creating a Publisher",
  "heading_context": ["Week 1", "ROS 2 Basics", "Publishers"],
  "slug": "/docs/week-1/ros2-pubsub",
  "difficulty": "beginner",
  "contains_code": true,
  "contains_math": false,
  "word_count": 342,
  "token_count": 456,
  "tags": ["ros2", "publisher", "python"]
}
```

## Deterministic Retrieval

For reproducible results (e.g., evaluation):
```bash
/qdrant-vector-storage search --query "..." --exact true
```

This enables:
- Exact search (not approximate)
- Deterministic ordering
- Reproducible results across runs

**Trade-offs**:
- Slower (exhaustive search)
- Higher accuracy
- Good for testing, not production

## Output Format

### Search Results
```json
{
  "results": [
    {
      "id": "uuid",
      "score": 0.8945,
      "payload": {
        "chunk_id": "physical-ai-textbook-7f3a9b2c",
        "content": "# Publishers and Subscribers...",
        "chapter": "Week 1",
        "section": "ROS 2 Basics"
      }
    }
  ],
  "query_time_ms": 45,
  "total_results": 10
}
```

### Collection Info
```json
{
  "name": "textbook-v1",
  "status": "green",
  "vectors_count": 523,
  "points_count": 523,
  "indexed_vectors_count": 523,
  "segments_count": 2,
  "disk_data_size": 47400000,
  "config": {
    "vector_size": 1536,
    "distance": "Cosine"
  }
}
```

## Configuration

Edit `config.json` to customize:

```json
{
  "collection": {
    "vector_size": 1536,
    "distance_metric": "Cosine"
  },
  "upload": {
    "batch_size": 100,
    "wait_for_index": true
  },
  "search": {
    "default_limit": 10,
    "hnsw_ef": 128,
    "exact": false
  },
  "reranking": {
    "enabled": true,
    "strategy": "cohere",
    "initial_retrieve": 50,
    "final_top_n": 10
  }
}
```

## Best Practices

### Collection Naming
Use versioned names:
- `textbook-v1-20250127`
- `textbook-v2-20250215`

Benefits:
- Easy rollback
- A/B testing
- Migration safety

### Payload Indexes
Index fields you filter on:
- ✓ chapter, section, difficulty
- ✗ Don't index rarely-used fields

### Search Parameters
- **Development**: `exact=True` (reproducible)
- **Production**: `exact=False` (fast)
- **HNSW ef**: 128 (default), higher = more accurate

### Reranking
- **< 10K vectors**: May not need reranking
- **> 10K vectors**: Use two-stage retrieval
- **Cohere**: Best quality, costs money
- **Local**: Free, requires GPU

## Integration

### Complete RAG Pipeline
```bash
# Step 1: Extract content
/book-content-ingestion --output extracted.json

# Step 2: Chunk content
/semantic-chunking --input extracted.json --output chunks.jsonl

# Step 3: Generate embeddings
/embedding-generation --input chunks.jsonl --output embeddings.jsonl

# Step 4: Upload to Qdrant
/qdrant-vector-storage upload --input embeddings.jsonl --collection textbook-v1

# Step 5: Test search
/qdrant-vector-storage search --query "What is ROS 2?" --collection textbook-v1
```

### With RAG Agents
- **textbook-retrieval** - Uses this skill for semantic search
- **context-scope-enforcer** - Uses filters to enforce boundaries
- **evidence-validator** - Retrieves chunks for validation
- **citation-attribution** - Retrieves source chunks

## Error Handling

Common issues:

**"Connection failed"**
- Check QDRANT_URL environment variable
- Verify cluster is running
- Check network/firewall

**"Authentication failed"**
- Verify QDRANT_API_KEY is correct
- Check API key hasn't expired

**"Collection not found"**
- Create collection first
- Check collection name spelling

**"Storage limit exceeded"**
- Check usage: `/qdrant-vector-storage check-storage`
- Enable quantization
- Reduce payload size
- Delete old collections

## Performance

Typical metrics:
- **Upload**: 100-200 points/sec
- **Search**: 20-50ms per query
- **Reranking**: +100-300ms (Cohere)

For 523 chunks:
- Upload: ~3-5 seconds
- Search: < 50ms
- With reranking: ~150ms

## Acceptance Criteria

Successful operations must:
- [ ] Connect to Qdrant Cloud
- [ ] Create collection with correct schema
- [ ] Upload all points without errors
- [ ] Create payload indexes
- [ ] Return search results < 500ms
- [ ] Support metadata filtering
- [ ] Stay within free tier limits
- [ ] Provide deterministic results when requested

## Related Skills

- **embedding-generation** - Generates embeddings for upload
- **semantic-chunking** - Creates chunks with metadata
- **book-content-ingestion** - Extracts content

## Monitoring

Track collection health:
```bash
# Storage usage
/qdrant-vector-storage check-storage

# Collection stats
/qdrant-vector-storage get-collection-info

# List all collections
/qdrant-vector-storage list-collections
```

## Version

1.0.0 - Initial release

## See Also

- Full documentation: `skill.md`
- Configuration reference: `config.json`
- Concrete examples: `examples.md`
