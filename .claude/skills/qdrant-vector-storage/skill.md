# Qdrant Vector Storage for RAG

Manage vector storage and retrieval in Qdrant Cloud for textbook RAG systems. Implements collection management, batch uploads, semantic search with metadata filtering, reranking strategies, and optimizations for Qdrant Cloud Free Tier.

## Purpose

This skill provides production-ready Qdrant Cloud integration for RAG pipelines. It handles:
- Collection creation with optimal schemas for educational content
- Batch upload of embeddings with rich metadata
- Semantic search with metadata filtering (chapter, section, difficulty)
- Reranking strategies to improve retrieval precision
- Free tier optimizations (1GB storage, 1M vectors limit)
- Idempotent operations for safe re-runs
- Collection versioning and migration

## When to Use

Invoke this skill when:
- **Initial setup**: Creating collections and uploading first embeddings
- **Content updates**: Uploading new or modified chunks
- **Search testing**: Running retrieval queries with filters
- **Reranking evaluation**: Testing different reranking strategies
- **Collection migration**: Moving to new schema or dimensions
- **Performance tuning**: Optimizing search parameters
- **Free tier monitoring**: Checking storage and vector limits

## Qdrant Cloud Free Tier Limits

**Resource Limits**:
- Storage: 1 GB total
- Vectors: 1M points maximum
- Clusters: 1 cluster
- Requests: Unlimited (rate-limited)
- Uptime: 99.5% SLA

**Optimization Strategies**:
- Use quantization to reduce storage
- Store large content in payload (metadata only)
- Truncate long text fields
- Use efficient data types (int32 vs int64)
- Monitor collection size regularly

## Usage

```bash
# Create collection
/qdrant-vector-storage create-collection --name textbook-v1 --dimension 1536

# Upload embeddings
/qdrant-vector-storage upload --input chunks-with-embeddings.jsonl --collection textbook-v1

# Search with filters
/qdrant-vector-storage search --query "What is ROS 2?" --collection textbook-v1 --limit 10 --filter chapter="Week 1"

# Rerank results
/qdrant-vector-storage search --query "explain publishers" --rerank cohere --top-n 5

# Collection management
/qdrant-vector-storage list-collections
/qdrant-vector-storage get-collection-info --collection textbook-v1
/qdrant-vector-storage delete-collection --collection textbook-old
```

## Qdrant Cloud Setup

### 1. Create Qdrant Cloud Account
```bash
# Visit: https://cloud.qdrant.io/
# Sign up for free tier
# Create a cluster
```

### 2. Get API Credentials
```bash
# From Qdrant Cloud dashboard:
# - Cluster URL: https://xyz.qdrant.io:6333
# - API Key: <your-api-key>
```

### 3. Configure Environment
```bash
# .env file
QDRANT_URL=https://xyz.qdrant.io:6333
QDRANT_API_KEY=your-api-key-here
```

## Collection Management

### Creating Collections

**Optimal Schema for Textbook Content**:
```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PayloadSchemaType

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

client.create_collection(
    collection_name="textbook-v1",
    vectors_config=VectorParams(
        size=1536,  # OpenAI text-embedding-3-small
        distance=Distance.COSINE
    )
)

# Create payload indexes for filtering
client.create_payload_index(
    collection_name="textbook-v1",
    field_name="chapter",
    field_schema=PayloadSchemaType.KEYWORD
)

client.create_payload_index(
    collection_name="textbook-v1",
    field_name="section",
    field_schema=PayloadSchemaType.KEYWORD
)

client.create_payload_index(
    collection_name="textbook-v1",
    field_name="difficulty",
    field_schema=PayloadSchemaType.KEYWORD
)

client.create_payload_index(
    collection_name="textbook-v1",
    field_name="contains_code",
    field_schema=PayloadSchemaType.BOOL
)
```

**Distance Metrics**:
- `COSINE` - Most common, measures angle (0-2 range)
- `EUCLID` - Euclidean distance (L2 norm)
- `DOT` - Dot product similarity

**Recommendation**: Use `COSINE` for OpenAI/Cohere embeddings.

### Collection Naming Convention
```
{book-id}-{version}-{date}

Examples:
  physical-ai-textbook-v1-20250127
  physical-ai-textbook-v2-20250215
```

**Benefits**:
- Version tracking
- Easy rollback
- A/B testing
- Migration safety

### Listing Collections
```python
collections = client.get_collections()

for collection in collections.collections:
    print(f"Name: {collection.name}")
    print(f"Vectors: {collection.vectors_count}")
    print(f"Points: {collection.points_count}")
```

### Getting Collection Info
```python
info = client.get_collection(collection_name="textbook-v1")

print(f"Status: {info.status}")
print(f"Vectors count: {info.vectors_count}")
print(f"Points count: {info.points_count}")
print(f"Indexed vectors: {info.indexed_vectors_count}")
print(f"Segments count: {info.segments_count}")
print(f"Disk data size: {info.disk_data_size} bytes")
```

### Deleting Collections
```python
# Delete with confirmation
client.delete_collection(collection_name="textbook-old")
```

## Uploading Embeddings

### Batch Upload Strategy

**Optimal Batch Size**: 100-500 points per batch for free tier

**Upload Algorithm**:
```python
def upload_embeddings(chunks_file, collection_name, batch_size=100):
    chunks = load_jsonl(chunks_file)

    # Prepare points
    points = []
    for chunk in chunks:
        point = models.PointStruct(
            id=generate_point_id(chunk['chunk_id']),
            vector=chunk['embedding'],
            payload={
                "chunk_id": chunk['chunk_id'],
                "content": chunk['content'][:5000],  # Truncate for free tier
                "chapter": chunk['metadata']['chapter'],
                "section": chunk['metadata']['section'],
                "heading_context": chunk['metadata']['heading_context'],
                "contains_code": chunk['metadata']['contains_code'],
                "difficulty": chunk['metadata'].get('difficulty', 'medium'),
                "word_count": chunk['metadata']['word_count'],
                "token_count": chunk['metadata']['token_count']
            }
        )
        points.append(point)

    # Upload in batches
    for i in range(0, len(points), batch_size):
        batch = points[i:i + batch_size]

        client.upsert(
            collection_name=collection_name,
            points=batch,
            wait=True  # Wait for indexing
        )

        print(f"Uploaded batch {i // batch_size + 1}: {len(batch)} points")
```

### Point ID Generation

**Deterministic UUID from chunk_id**:
```python
import uuid

def generate_point_id(chunk_id: str) -> str:
    # Generate deterministic UUID from chunk_id
    namespace = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
    point_uuid = uuid.uuid5(namespace, chunk_id)
    return str(point_uuid)
```

**Properties**:
- Same chunk_id → same point ID (idempotent)
- Upsert automatically replaces existing points
- Safe for re-runs

### Payload Schema

**Recommended Payload Structure**:
```json
{
  "chunk_id": "physical-ai-textbook-7f3a9b2c1d4e5f6a",
  "content": "# Publishers and Subscribers\n\nROS 2 uses...",
  "chapter": "Week 1: Introduction to ROS 2",
  "section": "Publishers and Subscribers",
  "subsection": "Creating a Publisher",
  "heading_context": ["Week 1", "ROS 2 Basics", "Publishers"],
  "slug": "/docs/week-1/ros2-pubsub",
  "file_path": "docs/week-1/ros2-pubsub.mdx",
  "heading_level": 3,
  "difficulty": "beginner",
  "contains_code": true,
  "contains_math": false,
  "word_count": 342,
  "token_count": 456,
  "tags": ["ros2", "publisher", "python"],
  "learning_objectives": ["Understand pub/sub pattern"],
  "prerequisites": ["ROS 2 installation"]
}
```

**Size Optimization for Free Tier**:
- Truncate `content` to 5000 chars (store full text externally if needed)
- Use short field names if many fields
- Store arrays as comma-separated strings if filtering not needed
- Use int32 instead of int64 for counts

### Progress Tracking

**Idempotent Upload with State**:
```python
def upload_with_checkpoints(chunks_file, collection_name, state_file):
    # Load state
    if os.path.exists(state_file):
        state = load_json(state_file)
        uploaded_ids = set(state['uploaded_chunk_ids'])
    else:
        uploaded_ids = set()
        state = {'uploaded_chunk_ids': []}

    # Load chunks
    chunks = load_jsonl(chunks_file)

    # Filter out already-uploaded
    remaining = [c for c in chunks if c['chunk_id'] not in uploaded_ids]

    print(f"Total chunks: {len(chunks)}")
    print(f"Already uploaded: {len(uploaded_ids)}")
    print(f"Remaining: {len(remaining)}")

    # Upload remaining
    for i in range(0, len(remaining), batch_size):
        batch = remaining[i:i + batch_size]
        upload_batch(batch, collection_name)

        # Update state
        for chunk in batch:
            state['uploaded_chunk_ids'].append(chunk['chunk_id'])

        save_json(state, state_file)
```

## Semantic Search

### Basic Search

**Search by Query Vector**:
```python
# Generate query embedding
query = "What is ROS 2 and how does it work?"
query_embedding = generate_embedding(query)

# Search
results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    limit=10,
    with_payload=True,
    with_vectors=False  # Don't return vectors (save bandwidth)
)

for result in results:
    print(f"Score: {result.score}")
    print(f"Chunk: {result.payload['chunk_id']}")
    print(f"Content: {result.payload['content'][:200]}...")
```

### Search with Metadata Filtering

**Filter by Chapter**:
```python
from qdrant_client.models import Filter, FieldCondition, MatchValue

results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[
            FieldCondition(
                key="chapter",
                match=MatchValue(value="Week 1: Introduction to ROS 2")
            )
        ]
    ),
    limit=10
)
```

**Filter by Multiple Conditions (AND)**:
```python
results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[
            FieldCondition(
                key="chapter",
                match=MatchValue(value="Week 1")
            ),
            FieldCondition(
                key="contains_code",
                match=MatchValue(value=True)
            ),
            FieldCondition(
                key="difficulty",
                match=MatchValue(value="beginner")
            )
        ]
    ),
    limit=10
)
```

**Filter by Chapter OR Section (OR)**:
```python
results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    query_filter=Filter(
        should=[
            FieldCondition(
                key="chapter",
                match=MatchValue(value="Week 1")
            ),
            FieldCondition(
                key="section",
                match=MatchValue(value="Publishers and Subscribers")
            )
        ]
    ),
    limit=10
)
```

**Exclude Chunks (NOT)**:
```python
results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    query_filter=Filter(
        must_not=[
            FieldCondition(
                key="difficulty",
                match=MatchValue(value="advanced")
            )
        ]
    ),
    limit=10
)
```

### Deterministic Top-K Retrieval

**Issue**: Qdrant may return slightly different results across runs due to:
- Segment merging
- Indexing delays
- Approximate nearest neighbor (ANN) algorithms

**Solution**: Use `exact` search mode for deterministic results:
```python
results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    limit=10,
    search_params=models.SearchParams(
        hnsw_ef=128,  # Higher = more accurate but slower
        exact=True    # Force exact search (deterministic)
    )
)
```

**Trade-offs**:
- `exact=True`: Deterministic, slower, exhaustive search
- `exact=False`: Fast, approximate, may vary slightly

**Recommendation**: Use `exact=True` for evaluation, `exact=False` for production.

## Reranking Strategies

### Why Rerank?

Vector similarity alone may not capture:
- Keyword importance
- Semantic nuance
- Query-specific relevance
- Educational context

**Reranking**: Re-order initial results using a different model/strategy.

### Strategy 1: Cross-Encoder Reranking

**Algorithm**:
1. Retrieve top-50 candidates with vector search
2. Score each candidate with cross-encoder
3. Re-sort by cross-encoder scores
4. Return top-10

**Implementation** (using Cohere Rerank):
```python
import cohere

def rerank_with_cohere(query, initial_results, top_n=10):
    co = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))

    # Extract documents
    documents = [r.payload['content'] for r in initial_results]

    # Rerank
    reranked = co.rerank(
        model="rerank-english-v3.0",
        query=query,
        documents=documents,
        top_n=top_n,
        return_documents=True
    )

    # Map back to original results
    reranked_results = []
    for item in reranked.results:
        original_idx = item.index
        result = initial_results[original_idx]
        result.rerank_score = item.relevance_score
        reranked_results.append(result)

    return reranked_results
```

**Usage**:
```python
# Step 1: Vector search (top-50)
initial_results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    limit=50
)

# Step 2: Rerank (top-10)
final_results = rerank_with_cohere(query, initial_results, top_n=10)
```

### Strategy 2: BM25 Hybrid Search

**Algorithm**: Combine vector search with BM25 keyword search.

**Qdrant doesn't have built-in BM25**, but you can:
1. Use vector search for semantic similarity
2. Add keyword filtering with `must` conditions
3. Boost results containing query keywords in payload

**Simple Keyword Boost**:
```python
def keyword_boost(results, query, boost_factor=1.5):
    query_keywords = set(query.lower().split())

    boosted_results = []
    for result in results:
        content = result.payload['content'].lower()

        # Count keyword matches
        matches = sum(1 for kw in query_keywords if kw in content)

        # Boost score
        if matches > 0:
            result.score *= (1 + boost_factor * matches / len(query_keywords))

        boosted_results.append(result)

    # Re-sort by boosted scores
    boosted_results.sort(key=lambda r: r.score, reverse=True)
    return boosted_results
```

### Strategy 3: MMR (Maximal Marginal Relevance)

**Purpose**: Increase diversity in results (avoid redundant chunks).

**Algorithm**:
1. Start with top-K results
2. Select most relevant result
3. For remaining results, balance relevance and diversity
4. Repeat until N results selected

**Implementation**:
```python
import numpy as np

def mmr_rerank(results, query_embedding, lambda_param=0.5, top_n=10):
    """
    lambda_param: 0 = max diversity, 1 = max relevance
    """
    selected = []
    remaining = results.copy()

    # Get vectors
    vectors = [r.vector for r in remaining]

    while len(selected) < top_n and remaining:
        if not selected:
            # Select most relevant first
            best = remaining.pop(0)
            selected.append(best)
        else:
            # Calculate MMR scores
            mmr_scores = []
            for i, result in enumerate(remaining):
                # Relevance to query
                relevance = result.score

                # Max similarity to already selected
                similarities = [
                    cosine_similarity(vectors[i], s.vector)
                    for s in selected
                ]
                max_sim = max(similarities) if similarities else 0

                # MMR formula
                mmr = lambda_param * relevance - (1 - lambda_param) * max_sim
                mmr_scores.append(mmr)

            # Select best MMR
            best_idx = np.argmax(mmr_scores)
            selected.append(remaining.pop(best_idx))

    return selected
```

### Strategy 4: Reciprocal Rank Fusion (RRF)

**Purpose**: Combine multiple retrieval strategies.

**Algorithm**:
1. Run multiple searches (vector, filtered, etc.)
2. Assign rank-based scores
3. Fuse scores and re-sort

**Implementation**:
```python
def reciprocal_rank_fusion(result_lists, k=60):
    """
    result_lists: List of search result lists from different strategies
    k: RRF constant (typically 60)
    """
    scores = {}

    for result_list in result_lists:
        for rank, result in enumerate(result_list):
            chunk_id = result.payload['chunk_id']

            # RRF score: 1 / (k + rank)
            rrf_score = 1.0 / (k + rank + 1)

            if chunk_id not in scores:
                scores[chunk_id] = {'score': 0, 'result': result}

            scores[chunk_id]['score'] += rrf_score

    # Sort by fused scores
    fused = sorted(
        scores.values(),
        key=lambda x: x['score'],
        reverse=True
    )

    return [item['result'] for item in fused]
```

**Usage**:
```python
# Strategy 1: Pure vector search
results_vector = client.search(query_vector=query_embedding, limit=20)

# Strategy 2: Vector search with chapter filter
results_filtered = client.search(
    query_vector=query_embedding,
    query_filter=Filter(must=[...]),
    limit=20
)

# Strategy 3: Vector search with code filter
results_code = client.search(
    query_vector=query_embedding,
    query_filter=Filter(must=[FieldCondition(key="contains_code", match=MatchValue(value=True))]),
    limit=20
)

# Fuse results
final_results = reciprocal_rank_fusion([results_vector, results_filtered, results_code])
```

## Free Tier Optimization

### Storage Monitoring
```python
def check_storage_usage(collection_name):
    info = client.get_collection(collection_name)

    # Calculate storage
    disk_size_mb = info.disk_data_size / (1024 * 1024)
    disk_size_gb = disk_size_mb / 1024

    print(f"Collection: {collection_name}")
    print(f"Points: {info.points_count:,}")
    print(f"Disk size: {disk_size_mb:.2f} MB ({disk_size_gb:.4f} GB)")
    print(f"Free tier limit: 1 GB")
    print(f"Usage: {disk_size_gb * 100:.2f}%")

    if disk_size_gb > 0.9:
        print("WARNING: Approaching free tier limit!")
```

### Quantization (Reduce Storage)

**Scalar Quantization**: Convert float32 → int8
```python
from qdrant_client.models import ScalarQuantization, ScalarQuantizationConfig

client.update_collection(
    collection_name="textbook-v1",
    quantization_config=ScalarQuantizationConfig(
        scalar=ScalarQuantization(
            type="int8",
            quantile=0.99,
            always_ram=True
        )
    )
)
```

**Benefits**:
- 4x storage reduction (float32 → int8)
- Slight accuracy loss (< 1% typically)
- Faster search

**Trade-offs**:
- Initial quantization takes time
- Slightly lower recall
- Not reversible (need re-upload)

### Payload Size Optimization
```python
def optimize_payload(payload, max_content_length=5000):
    """Reduce payload size for free tier"""
    optimized = payload.copy()

    # Truncate content
    if 'content' in optimized:
        optimized['content'] = optimized['content'][:max_content_length]

    # Remove unnecessary fields
    remove_fields = ['raw_html', 'debug_info']
    for field in remove_fields:
        optimized.pop(field, None)

    # Convert arrays to comma-separated strings (if not filtering)
    if 'tags' in optimized and isinstance(optimized['tags'], list):
        optimized['tags'] = ','.join(optimized['tags'])

    # Use int32 instead of int64
    for key in ['word_count', 'token_count']:
        if key in optimized:
            optimized[key] = int(optimized[key])

    return optimized
```

## Implementation Steps

When invoked, this skill executes:

### Step 1: Initialize Qdrant Client
```python
from qdrant_client import QdrantClient

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
    timeout=30
)

# Verify connection
print(f"Connected to Qdrant Cloud: {client.get_collections()}")
```

### Step 2: Create or Verify Collection
```python
collection_name = "textbook-v1"

# Check if exists
collections = client.get_collections().collections
exists = any(c.name == collection_name for c in collections)

if not exists:
    print(f"Creating collection: {collection_name}")
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
    )

    # Create indexes
    create_payload_indexes(client, collection_name)
else:
    print(f"Collection exists: {collection_name}")
```

### Step 3: Upload Embeddings
```python
chunks = load_jsonl("chunks-with-embeddings.jsonl")

print(f"Uploading {len(chunks)} chunks...")

points = prepare_points(chunks)
upload_in_batches(client, collection_name, points, batch_size=100)

print("Upload complete!")
```

### Step 4: Verify Upload
```python
info = client.get_collection(collection_name)
print(f"Total points in collection: {info.points_count}")

# Test search
test_query = "What is ROS 2?"
test_embedding = generate_embedding(test_query)
results = client.search(
    collection_name=collection_name,
    query_vector=test_embedding,
    limit=3
)

print("\nTest search results:")
for r in results:
    print(f"  - {r.payload['chunk_id']}: {r.score:.4f}")
```

## Configuration Options

```json
{
  "qdrant": {
    "url_env": "QDRANT_URL",
    "api_key_env": "QDRANT_API_KEY",
    "timeout": 30,
    "prefer_grpc": false
  },
  "collection": {
    "name": "textbook-v1",
    "vector_size": 1536,
    "distance_metric": "Cosine",
    "on_disk_payload": false,
    "replication_factor": 1,
    "write_consistency_factor": 1
  },
  "indexes": [
    {"field": "chapter", "type": "keyword"},
    {"field": "section", "type": "keyword"},
    {"field": "difficulty", "type": "keyword"},
    {"field": "contains_code", "type": "bool"}
  ],
  "upload": {
    "batch_size": 100,
    "parallel": false,
    "wait_for_index": true,
    "retry_attempts": 3
  },
  "search": {
    "default_limit": 10,
    "max_limit": 100,
    "exact_search": false,
    "hnsw_ef": 128,
    "with_payload": true,
    "with_vectors": false
  },
  "reranking": {
    "enabled": true,
    "provider": "cohere",
    "model": "rerank-english-v3.0",
    "initial_retrieve": 50,
    "final_top_n": 10
  },
  "optimization": {
    "quantization": {
      "enabled": false,
      "type": "int8"
    },
    "payload": {
      "max_content_length": 5000,
      "optimize_arrays": true
    }
  },
  "monitoring": {
    "track_storage": true,
    "warn_at_gb": 0.9,
    "track_vector_count": true,
    "warn_at_vectors": 900000
  }
}
```

## Best Practices

### Collection Naming
- Use version suffixes: `textbook-v1`, `textbook-v2`
- Include dates for snapshots: `textbook-20250127`
- Separate by environment: `textbook-prod`, `textbook-dev`

### Payload Design
- **Index fields you filter on**: chapter, section, difficulty
- **Don't index rarely-filtered fields**: Save memory
- **Truncate large text**: Store full content externally if needed
- **Use keyword types**: For exact match filtering

### Search Parameters
- **Development**: Use `exact=True` for reproducibility
- **Production**: Use `exact=False` for speed
- **HNSW ef**: Higher = more accurate, slower (default: 128)

### Reranking
- **Small datasets** (< 10K points): May not need reranking
- **Large datasets**: Use two-stage retrieval (vector → rerank)
- **Cohere Rerank**: Best quality, costs $1/1000 searches
- **Local reranking**: Free but requires compute

## Integration Points

### With Embedding Generation
```bash
# Pipeline: embedding → Qdrant upload
/embedding-generation --input chunks.jsonl --output embeddings.jsonl
/qdrant-vector-storage upload --input embeddings.jsonl --collection textbook-v1
```

### With RAG Agents
- **textbook-retrieval**: Uses this skill for semantic search
- **context-scope-enforcer**: Uses filters to enforce context boundaries
- **evidence-validator**: Retrieves chunks for validation
- **citation-attribution**: Retrieves source chunks for citations

## Acceptance Criteria

A successful Qdrant operation must:
- [ ] Connect to Qdrant Cloud successfully
- [ ] Create collection with correct schema
- [ ] Upload all points without errors
- [ ] Create payload indexes for filtered fields
- [ ] Return search results within 500ms (typical)
- [ ] Support metadata filtering (chapter, section, etc.)
- [ ] Handle errors gracefully with retries
- [ ] Stay within free tier limits (1GB storage, 1M vectors)
- [ ] Provide deterministic results when exact=True

## Related Skills and Agents

- **embedding-generation** - Generates embeddings for upload
- **semantic-chunking** - Creates chunks with metadata
- **textbook-retrieval** - Agent that uses this skill for search

## Next Steps After Setup

1. **Upload embeddings** to collection
2. **Test search** with sample queries
3. **Tune search parameters** (limit, HNSW ef)
4. **Evaluate reranking** strategies
5. **Monitor storage** usage on free tier
6. **Set up collection versioning** for updates

---

**Note**: This skill manages Qdrant operations. Query embedding generation and reranking models are separate concerns handled by their respective providers.
