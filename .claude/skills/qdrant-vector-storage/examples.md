# Qdrant Vector Storage Examples

Concrete examples showing Qdrant Cloud operations, search patterns, reranking strategies, and optimization techniques.

## Example 1: Initial Setup and Collection Creation

### Step 1: Initialize Client
```python
import os
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

# Initialize client
client = QdrantClient(
    url=os.getenv("QDRANT_URL"),  # https://xyz.qdrant.io:6333
    api_key=os.getenv("QDRANT_API_KEY"),
    timeout=30
)

# Verify connection
print("Connected to Qdrant Cloud")
print(f"Collections: {[c.name for c in client.get_collections().collections]}")
```

### Step 2: Create Collection
```python
collection_name = "textbook-v1"

# Create collection with cosine distance
client.create_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(
        size=1536,  # OpenAI text-embedding-3-small dimensions
        distance=Distance.COSINE
    )
)

print(f"Collection '{collection_name}' created successfully")
```

### Step 3: Create Payload Indexes
```python
from qdrant_client.models import PayloadSchemaType

# Index for chapter filtering
client.create_payload_index(
    collection_name=collection_name,
    field_name="chapter",
    field_schema=PayloadSchemaType.KEYWORD
)

# Index for section filtering
client.create_payload_index(
    collection_name=collection_name,
    field_name="section",
    field_schema=PayloadSchemaType.KEYWORD
)

# Index for difficulty filtering
client.create_payload_index(
    collection_name=collection_name,
    field_name="difficulty",
    field_schema=PayloadSchemaType.KEYWORD
)

# Index for code filtering
client.create_payload_index(
    collection_name=collection_name,
    field_name="contains_code",
    field_schema=PayloadSchemaType.BOOL
)

print("Payload indexes created")
```

### Output
```
Connected to Qdrant Cloud
Collections: []
Collection 'textbook-v1' created successfully
Payload indexes created
```

---

## Example 2: Uploading Embeddings in Batches

### Input: chunks-with-embeddings.jsonl
```jsonl
{"chunk_id":"physical-ai-textbook-7f3a9b2c","embedding":[0.023,-0.041,...],"content":"# Publishers and Subscribers...","metadata":{"chapter":"Week 1","section":"ROS 2 Basics","contains_code":false}}
{"chunk_id":"physical-ai-textbook-1e2f3a4b","embedding":[-0.012,0.034,...],"content":"## Creating a Publisher...","metadata":{"chapter":"Week 1","section":"Publishers","contains_code":true}}
```

### Upload Script
```python
import json
import uuid
from qdrant_client.models import PointStruct

def load_jsonl(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return [json.loads(line) for line in f]

def generate_point_id(chunk_id):
    """Generate deterministic UUID from chunk_id"""
    namespace = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
    return str(uuid.uuid5(namespace, chunk_id))

def upload_embeddings(client, collection_name, chunks_file, batch_size=100):
    chunks = load_jsonl(chunks_file)
    total = len(chunks)

    print(f"Loading {total} chunks...")

    # Prepare points
    points = []
    for chunk in chunks:
        point = PointStruct(
            id=generate_point_id(chunk['chunk_id']),
            vector=chunk['embedding'],
            payload={
                "chunk_id": chunk['chunk_id'],
                "content": chunk['content'][:5000],  # Truncate for free tier
                "chapter": chunk['metadata']['chapter'],
                "section": chunk['metadata']['section'],
                "heading_context": chunk['metadata'].get('heading_context', []),
                "difficulty": chunk['metadata'].get('difficulty', 'medium'),
                "contains_code": chunk['metadata'].get('contains_code', False),
                "contains_math": chunk['metadata'].get('contains_math', False),
                "word_count": chunk['metadata'].get('word_count', 0),
                "token_count": chunk['metadata'].get('token_count', 0)
            }
        )
        points.append(point)

    # Upload in batches
    for i in range(0, len(points), batch_size):
        batch = points[i:i + batch_size]
        batch_num = i // batch_size + 1
        total_batches = (len(points) + batch_size - 1) // batch_size

        print(f"Uploading batch {batch_num}/{total_batches} ({len(batch)} points)...")

        client.upsert(
            collection_name=collection_name,
            points=batch,
            wait=True  # Wait for indexing
        )

    print(f"\n✓ Upload complete: {total} points")

    # Verify
    info = client.get_collection(collection_name)
    print(f"Collection now has {info.points_count} points")

# Run upload
upload_embeddings(client, "textbook-v1", "chunks-with-embeddings.jsonl")
```

### Output
```
Loading 523 chunks...
Uploading batch 1/6 (100 points)...
Uploading batch 2/6 (100 points)...
Uploading batch 3/6 (100 points)...
Uploading batch 4/6 (100 points)...
Uploading batch 5/6 (100 points)...
Uploading batch 6/6 (23 points)...

✓ Upload complete: 523 points
Collection now has 523 points
```

---

## Example 3: Basic Semantic Search

### Generate Query Embedding
```python
import openai

def generate_embedding(text):
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

query = "What is ROS 2 and how does it work?"
query_embedding = generate_embedding(query)
```

### Search
```python
results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    limit=5,
    with_payload=True,
    with_vectors=False  # Don't return vectors (save bandwidth)
)

print(f"Query: {query}\n")
print("Results:")
for i, result in enumerate(results):
    print(f"\n{i+1}. Score: {result.score:.4f}")
    print(f"   Chunk: {result.payload['chunk_id']}")
    print(f"   Chapter: {result.payload['chapter']}")
    print(f"   Section: {result.payload['section']}")
    print(f"   Content preview: {result.payload['content'][:150]}...")
```

### Output
```
Query: What is ROS 2 and how does it work?

Results:

1. Score: 0.8945
   Chunk: physical-ai-textbook-7f3a9b2c1d4e5f6a
   Chapter: Week 1: Introduction to ROS 2
   Section: What is ROS 2?
   Content preview: # What is ROS 2?\n\nROS 2 (Robot Operating System 2) is a set of software libraries and tools for building robot applications. It provides hardware...

2. Score: 0.8723
   Chunk: physical-ai-textbook-1e2f3a4b5c6d7e8f
   Chapter: Week 1: Introduction to ROS 2
   Section: ROS 2 Architecture
   Content preview: ## ROS 2 Architecture\n\nROS 2 uses a distributed system architecture where nodes communicate via a Data Distribution Service (DDS) middleware...

3. Score: 0.8512
   Chunk: physical-ai-textbook-c3d4e5f6g7h8i9j0
   Chapter: Week 1: Introduction to ROS 2
   Section: Key Features
   Content preview: ### Key Features\n\nROS 2 provides several improvements over ROS 1:\n- Real-time capable\n- Cross-platform support (Linux, Windows, macOS)...
```

---

## Example 4: Search with Metadata Filtering

### Filter by Chapter
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
    limit=5
)

print(f"Results filtered by chapter='Week 1':")
for result in results:
    print(f"  - {result.payload['section']}: {result.score:.4f}")
```

### Filter by Multiple Conditions (AND)
```python
results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[
            FieldCondition(
                key="chapter",
                match=MatchValue(value="Week 1: Introduction to ROS 2")
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
    limit=5
)

print(f"\nResults with chapter='Week 1' AND contains_code=True AND difficulty='beginner':")
for result in results:
    print(f"  - {result.payload['section']}: {result.score:.4f}")
```

### Filter with OR Condition
```python
results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    query_filter=Filter(
        should=[
            FieldCondition(
                key="section",
                match=MatchValue(value="Publishers and Subscribers")
            ),
            FieldCondition(
                key="section",
                match=MatchValue(value="Services and Actions")
            )
        ]
    ),
    limit=5
)

print(f"\nResults with section='Publishers' OR section='Services':")
for result in results:
    print(f"  - {result.payload['section']}: {result.score:.4f}")
```

### Exclude Advanced Content (NOT)
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
    limit=5
)

print(f"\nResults excluding difficulty='advanced':")
for result in results:
    print(f"  - {result.payload['section']} ({result.payload['difficulty']}): {result.score:.4f}")
```

---

## Example 5: Deterministic Retrieval

### Standard Search (Approximate)
```python
from qdrant_client.models import SearchParams

# Run 3 times to show variation
for run in range(3):
    results = client.search(
        collection_name="textbook-v1",
        query_vector=query_embedding,
        limit=10,
        search_params=SearchParams(
            hnsw_ef=128,
            exact=False  # Approximate search (default)
        )
    )

    print(f"Run {run + 1}: Top chunk = {results[0].payload['chunk_id']}, Score = {results[0].score:.6f}")
```

### Output (May vary slightly)
```
Run 1: Top chunk = physical-ai-textbook-7f3a9b2c1d4e5f6a, Score = 0.894523
Run 2: Top chunk = physical-ai-textbook-7f3a9b2c1d4e5f6a, Score = 0.894521
Run 3: Top chunk = physical-ai-textbook-1e2f3a4b5c6d7e8f, Score = 0.894518
```

### Deterministic Search (Exact)
```python
# Run 3 times with exact search
for run in range(3):
    results = client.search(
        collection_name="textbook-v1",
        query_vector=query_embedding,
        limit=10,
        search_params=SearchParams(
            hnsw_ef=128,
            exact=True  # Exact search (deterministic)
        )
    )

    print(f"Run {run + 1}: Top chunk = {results[0].payload['chunk_id']}, Score = {results[0].score:.6f}")
```

### Output (Always identical)
```
Run 1: Top chunk = physical-ai-textbook-7f3a9b2c1d4e5f6a, Score = 0.894523
Run 2: Top chunk = physical-ai-textbook-7f3a9b2c1d4e5f6a, Score = 0.894523
Run 3: Top chunk = physical-ai-textbook-7f3a9b2c1d4e5f6a, Score = 0.894523
```

---

## Example 6: Reranking with Cohere

### Step 1: Initial Vector Search (Top-50)
```python
query = "How do I create a ROS 2 publisher in Python?"
query_embedding = generate_embedding(query)

# Retrieve top-50 candidates
initial_results = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    limit=50,
    with_payload=True,
    with_vectors=False
)

print(f"Initial retrieval: {len(initial_results)} results")
print(f"Top result score: {initial_results[0].score:.4f}")
```

### Step 2: Rerank with Cohere
```python
import cohere

def rerank_with_cohere(query, results, top_n=10):
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

    # Map back to original results
    reranked_results = []
    for item in reranked.results:
        original_idx = item.index
        result = results[original_idx]
        result.rerank_score = item.relevance_score
        reranked_results.append(result)

    return reranked_results

# Rerank to top-10
final_results = rerank_with_cohere(query, initial_results, top_n=10)

print(f"\nAfter reranking: {len(final_results)} results")
print(f"Top result rerank score: {final_results[0].rerank_score:.4f}")
```

### Step 3: Compare Rankings
```python
print("\n" + "="*60)
print("COMPARISON: Vector Search vs Reranked")
print("="*60)

print("\nVector Search Top-5:")
for i, result in enumerate(initial_results[:5]):
    print(f"{i+1}. Score: {result.score:.4f} - {result.payload['section']}")

print("\nReranked Top-5:")
for i, result in enumerate(final_results[:5]):
    print(f"{i+1}. Rerank: {result.rerank_score:.4f} - {result.payload['section']}")
```

### Output
```
Initial retrieval: 50 results
Top result score: 0.8723

After reranking: 10 results
Top result rerank score: 0.9856

============================================================
COMPARISON: Vector Search vs Reranked
============================================================

Vector Search Top-5:
1. Score: 0.8723 - ROS 2 Architecture
2. Score: 0.8512 - Creating a Publisher
3. Score: 0.8398 - Publishers and Subscribers
4. Score: 0.8234 - Python API Reference
5. Score: 0.8101 - Node Creation

Reranked Top-5:
1. Rerank: 0.9856 - Creating a Publisher
2. Rerank: 0.9645 - Python Publisher Example
3. Rerank: 0.9523 - Publishers and Subscribers
4. Rerank: 0.9234 - ROS 2 Architecture
5. Rerank: 0.8945 - Python API Reference
```

**Observation**: Reranking moved "Creating a Publisher" from #2 to #1, which is more relevant to the specific query.

---

## Example 7: MMR (Maximal Marginal Relevance) Reranking

### Purpose: Increase Diversity
Avoid returning multiple similar chunks about the same topic.

### Implementation
```python
import numpy as np

def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def mmr_rerank(results, query_embedding, lambda_param=0.5, top_n=10):
    """
    lambda_param: 0 = max diversity, 1 = max relevance
    """
    selected = []
    remaining = results.copy()

    # Get vectors (need to fetch them)
    vectors = []
    for result in remaining:
        point = client.retrieve(
            collection_name="textbook-v1",
            ids=[result.id],
            with_vectors=True
        )[0]
        vectors.append(point.vector)

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
                selected_vectors = [
                    client.retrieve(
                        collection_name="textbook-v1",
                        ids=[s.id],
                        with_vectors=True
                    )[0].vector
                    for s in selected
                ]

                similarities = [
                    cosine_similarity(vectors[i], sv)
                    for sv in selected_vectors
                ]
                max_sim = max(similarities) if similarities else 0

                # MMR formula
                mmr = lambda_param * relevance - (1 - lambda_param) * max_sim
                mmr_scores.append(mmr)

            # Select best MMR
            best_idx = np.argmax(mmr_scores)
            selected.append(remaining.pop(best_idx))

    return selected

# Apply MMR
diverse_results = mmr_rerank(initial_results, query_embedding, lambda_param=0.5, top_n=10)

print("MMR-Reranked Results (Diverse):")
for i, result in enumerate(diverse_results):
    print(f"{i+1}. {result.payload['section']} (Chapter: {result.payload['chapter']})")
```

### Output
```
MMR-Reranked Results (Diverse):
1. Creating a Publisher (Chapter: Week 1)
2. Services and Actions (Chapter: Week 1)  <- Different topic
3. Gazebo Simulation (Chapter: Week 2)     <- Different chapter
4. URDF Basics (Chapter: Week 3)           <- Different chapter
5. Sensor Integration (Chapter: Week 4)    <- Different chapter
```

**Observation**: MMR spreads results across different topics and chapters, avoiding redundancy.

---

## Example 8: Reciprocal Rank Fusion (RRF)

### Combine Multiple Search Strategies
```python
def reciprocal_rank_fusion(result_lists, k=60):
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

# Strategy 1: Pure vector search
results_vector = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    limit=20
)

# Strategy 2: Vector search with chapter filter
results_chapter = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[FieldCondition(key="chapter", match=MatchValue(value="Week 1"))]
    ),
    limit=20
)

# Strategy 3: Vector search with code filter
results_code = client.search(
    collection_name="textbook-v1",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[FieldCondition(key="contains_code", match=MatchValue(value=True))]
    ),
    limit=20
)

# Fuse results
fused_results = reciprocal_rank_fusion([results_vector, results_chapter, results_code])

print("RRF Fused Results (Top-10):")
for i, result in enumerate(fused_results[:10]):
    print(f"{i+1}. {result.payload['section']} (RRF Score: {result.score:.4f})")
```

---

## Example 9: Collection Management

### List All Collections
```python
collections = client.get_collections()

print("Collections in Qdrant Cloud:")
for collection in collections.collections:
    print(f"\n- {collection.name}")
    print(f"  Vectors: {collection.vectors_count}")
    print(f"  Points: {collection.points_count}")
```

### Get Collection Info
```python
info = client.get_collection(collection_name="textbook-v1")

print(f"\nCollection: {info.name}")
print(f"Status: {info.status}")
print(f"Vectors count: {info.vectors_count:,}")
print(f"Points count: {info.points_count:,}")
print(f"Indexed vectors: {info.indexed_vectors_count:,}")
print(f"Segments: {info.segments_count}")
print(f"Disk size: {info.disk_data_size:,} bytes ({info.disk_data_size / (1024**2):.2f} MB)")
```

### Check Storage Usage (Free Tier)
```python
def check_storage_usage(collection_name):
    info = client.get_collection(collection_name)

    disk_size_gb = info.disk_data_size / (1024**3)
    usage_percent = (disk_size_gb / 1.0) * 100  # 1.0 GB free tier limit

    print(f"\nFree Tier Storage Usage:")
    print(f"  Collection: {collection_name}")
    print(f"  Points: {info.points_count:,}")
    print(f"  Disk size: {disk_size_gb:.4f} GB")
    print(f"  Free tier limit: 1.0 GB")
    print(f"  Usage: {usage_percent:.2f}%")

    if disk_size_gb > 0.9:
        print("  ⚠️  WARNING: Approaching free tier limit!")
    else:
        print("  ✓ Status: OK")

check_storage_usage("textbook-v1")
```

### Output
```
Free Tier Storage Usage:
  Collection: textbook-v1
  Points: 523
  Disk size: 0.0441 GB
  Free tier limit: 1.0 GB
  Usage: 4.41%
  ✓ Status: OK
```

---

## Example 10: Quantization for Storage Reduction

### Before Quantization
```python
info_before = client.get_collection("textbook-v1")
print(f"Before quantization:")
print(f"  Disk size: {info_before.disk_data_size / (1024**2):.2f} MB")
```

### Enable Scalar Quantization (int8)
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

print("Quantization enabled (int8)")
print("Waiting for quantization to complete...")

# Wait for quantization
import time
time.sleep(10)
```

### After Quantization
```python
info_after = client.get_collection("textbook-v1")
print(f"\nAfter quantization:")
print(f"  Disk size: {info_after.disk_data_size / (1024**2):.2f} MB")

reduction = (1 - info_after.disk_data_size / info_before.disk_data_size) * 100
print(f"  Storage reduction: {reduction:.1f}%")
```

### Output
```
Before quantization:
  Disk size: 45.20 MB

Quantization enabled (int8)
Waiting for quantization to complete...

After quantization:
  Disk size: 11.80 MB
  Storage reduction: 73.9%
```

**Note**: ~4x storage reduction with minimal accuracy loss.

---

## Example 11: Deleting Collections

### Delete Old Collection
```python
# List collections
print("Current collections:")
for c in client.get_collections().collections:
    print(f"  - {c.name}")

# Delete
collection_to_delete = "textbook-old"

confirm = input(f"\nDelete collection '{collection_to_delete}'? (yes/no): ")

if confirm.lower() == "yes":
    client.delete_collection(collection_name=collection_to_delete)
    print(f"✓ Deleted collection: {collection_to_delete}")
else:
    print("Deletion cancelled")

# Verify
print("\nRemaining collections:")
for c in client.get_collections().collections:
    print(f"  - {c.name}")
```

---

These examples demonstrate the full Qdrant vector storage skill capabilities, from initial setup through advanced reranking strategies and free tier optimizations. Use them as a reference when implementing your RAG retrieval system.
