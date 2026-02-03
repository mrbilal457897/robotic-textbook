# RAG Retrieval Examples

Concrete examples showing retrieval across different modes, reranking strategies, and query types.

## Example 1: Book-Only Mode - Fact Recall

### Query
```
User: "What are the key features of ROS 2?"
Mode: book_only
```

### Processing
```python
# 1. Preprocess
query = "What are the key features of ROS 2?"
preprocessed = "key features ROS 2"

# 2. Generate embedding
embedding = generate_embedding(preprocessed)  # 1536-dim vector

# 3. Search Qdrant (book_only mode)
results = client.search(
    collection="textbook-v1",
    query_vector=embedding,
    limit=10
)

# 4. Filter by score threshold (0.7 for book_only)
filtered = [r for r in results if r.score > 0.7]

if not filtered:
    return {
        "status": "insufficient_context",
        "mode": "book_only",
        "message": "Cannot answer from textbook"
    }
```

### Output
```json
{
  "query": "What are the key features of ROS 2?",
  "mode": "book_only",
  "status": "success",
  "results": [
    {
      "rank": 1,
      "chunk_id": "physical-ai-textbook-7f3a9b2c1d4e5f6a",
      "content": "### Key Features\n\nROS 2 provides several improvements over ROS 1:\n- Real-time capable\n- Cross-platform support (Linux, Windows, macOS)\n- Multiple programming languages (Python, C++)\n- Distributed system architecture\n- Secure communication",
      "score": 0.8945,
      "chapter": "Week 1: Introduction to ROS 2",
      "section": "Key Features",
      "difficulty": "beginner"
    },
    {
      "rank": 2,
      "chunk_id": "physical-ai-textbook-1e2f3a4b5c6d7e8f",
      "content": "## ROS 2 Architecture\n\nROS 2 uses a distributed system architecture where nodes communicate via a Data Distribution Service (DDS)...",
      "score": 0.8234,
      "chapter": "Week 1: Introduction to ROS 2",
      "section": "ROS 2 Architecture",
      "difficulty": "intermediate"
    }
  ],
  "retrieval_time_ms": 42,
  "embedding_time_ms": 15
}
```

### Agent Response
```
Based on the textbook, the key features of ROS 2 are:
- Real-time capable
- Cross-platform support (Linux, Windows, macOS)
- Multiple programming languages (Python, C++)
- Distributed system architecture
- Secure communication

(Source: Week 1 - Key Features section)
```

---

## Example 2: Selected-Text-Only Mode - Clarification

### Setup
User highlights a paragraph in the lesson:
```
Selected Text:
"Publishers send messages to topics, and subscribers receive
messages from topics. This publish-subscribe pattern decouples
the producers and consumers of data."
```

### Query
```
User: "Explain how this pattern works"
Mode: selected_text_only
Selected: "Publishers send messages to topics..."
```

### Processing
```python
# 1. Generate query embedding
query_embedding = generate_embedding("explain how this pattern works")

# 2. Generate selected text embedding
selected_embedding = generate_embedding(
    "Publishers send messages to topics..."
)

# 3. Initial search (broader)
initial_results = client.search(
    collection="textbook-v1",
    query_vector=query_embedding,
    limit=20
)

# 4. Filter to chunks related to selected text
filtered = []
for result in initial_results:
    # Calculate similarity to selected text
    selected_sim = cosine_similarity(
        result.vector,
        selected_embedding
    )

    # Keep if related to selected text
    if selected_sim > 0.75:
        filtered.append(result)

# 5. Limit to top-5
return filtered[:5]
```

### Output
```json
{
  "query": "Explain how this pattern works",
  "mode": "selected_text_only",
  "status": "success",
  "selected_text_preview": "Publishers send messages to topics, and subscribers...",
  "results": [
    {
      "rank": 1,
      "chunk_id": "physical-ai-textbook-abc123",
      "content": "## Publishers and Subscribers\n\nROS 2 uses a publish-subscribe pattern for inter-process communication. Publishers send messages to topics, and subscribers receive messages from topics. This decoupling allows:\n\n1. Loose coupling: Publishers and subscribers don't need to know about each other\n2. Scalability: Multiple publishers/subscribers can connect to the same topic\n3. Flexibility: Easy to add or remove nodes",
      "score": 0.9234,
      "chapter": "Week 1",
      "section": "Publishers and Subscribers",
      "similarity_to_selected": 0.92
    },
    {
      "rank": 2,
      "chunk_id": "physical-ai-textbook-def456",
      "content": "### Benefits of Decoupling\n\nThe publish-subscribe pattern provides several benefits:\n- Producers don't wait for consumers\n- Can have multiple consumers of the same data\n- Easy to scale to many nodes",
      "score": 0.8567,
      "chapter": "Week 1",
      "section": "Pub/Sub Benefits",
      "similarity_to_selected": 0.81
    }
  ],
  "retrieval_time_ms": 65,
  "embedding_time_ms": 28
}
```

### Agent Response
```
The publish-subscribe pattern in ROS 2 works by:

1. **Decoupling**: Publishers and subscribers don't need to know
   about each other - they only communicate through topics

2. **Multiple consumers**: A single published message can be
   received by multiple subscribers

3. **Scalability**: You can add or remove publishers/subscribers
   dynamically without disrupting the system

This is different from request-response patterns like services,
where direct communication is required.
```

---

## Example 3: General Mode - Real-World Application

### Query
```
User: "How is ROS 2 used in real robot applications?"
Mode: general
```

### Processing
```python
# 1. Process query (general mode has lower threshold)
query_embedding = generate_embedding(
    "ROS 2 real robot applications"
)

# 2. Search (no strict filtering)
results = client.search(
    collection="textbook-v1",
    query_vector=query_embedding,
    limit=10,
    score_threshold=0.5  # Lower for general mode
)

# 3. Rerank with Cohere for better relevance
reranked = rerank_with_cohere(
    query="How is ROS 2 used in real robot applications?",
    results=results,
    top_n=5
)
```

### Output
```json
{
  "query": "How is ROS 2 used in real robot applications?",
  "mode": "general",
  "status": "success",
  "external_knowledge_allowed": true,
  "results": [
    {
      "rank": 1,
      "chunk_id": "physical-ai-textbook-xyz789",
      "content": "## Real-World Applications\n\nROS 2 is used in various robotics applications:\n\n1. **Autonomous Mobile Robots**: ROS 2 powers robots used in warehouses, hospitals, and farms\n2. **Robot Manipulators**: Industrial arms and cobots use ROS 2\n3. **Humanoid Robots**: Research platforms like Boston Dynamics' Atlas and TQM robots\n4. **Drones**: Aerial robots and autonomous vehicles",
      "score": 0.9123,
      "rerank_score": 0.98,
      "chapter": "Week 2: ROS 2 in Practice",
      "section": "Real-World Applications",
      "difficulty": "intermediate"
    }
  ],
  "retrieval_time_ms": 48,
  "embedding_time_ms": 18,
  "reranking_time_ms": 156
}
```

### Agent Response
```
According to the textbook, ROS 2 is used in several real-world applications:

1. **Autonomous Mobile Robots**: Used in warehouses, hospitals,
   and farms for autonomous navigation and task execution

2. **Industrial Robot Manipulators**: Both traditional industrial arms
   and collaborative robots (cobots)

3. **Humanoid Research Platforms**: Advanced research robots for
   studying human-robot interaction

4. **Drones and Autonomous Vehicles**: For aerial and ground-based
   autonomous systems

Beyond the textbook, ROS 2 is also adopted by major robotics companies
for production systems due to its real-time capabilities and scalability.
```

---

## Example 4: Reranking Impact

### Query
```
Query: "How do I implement inverse kinematics?"
Without reranking: Results by vector similarity
With reranking: Results optimized for query relevance
```

### Vector Search Results (Before Reranking)
```
Rank 1: Score 0.89 - "Understanding Inverse Kinematics"
Rank 2: Score 0.87 - "Robot Arm Dynamics"
Rank 3: Score 0.86 - "Forward Kinematics Tutorial"
Rank 4: Score 0.85 - "IK Problem Formulation"
Rank 5: Score 0.84 - "Jacobian Methods"
```

### Reranked Results (With Cohere)
```
Rank 1: Rerank 0.98 - "IK Implementation in Python"
Rank 2: Rerank 0.96 - "Jacobian-based IK Solver"
Rank 3: Rerank 0.94 - "Understanding Inverse Kinematics"
Rank 4: Rerank 0.91 - "IK Problem Formulation"
Rank 5: Rerank 0.88 - "FABRIK Algorithm"
```

**Observation**: Reranking moved more directly relevant implementation guides to top, deprioritizing theory-only content.

---

## Example 5: Filtering by Metadata

### Query
```
User: "Show me beginner ROS 2 code examples from Week 1"
```

### Processing
```python
# Parse query
query = "ROS 2 code examples"

# Apply filters
filters = {
    "difficulty": "beginner",
    "chapter": "Week 1",
    "contains_code": True
}

# Generate embedding
embedding = generate_embedding(query)

# Search with filters
results = client.search(
    collection="textbook-v1",
    query_vector=embedding,
    query_filter=Filter(
        must=[
            FieldCondition(key="difficulty", match=MatchValue(value="beginner")),
            FieldCondition(key="chapter", match=MatchValue(value="Week 1")),
            FieldCondition(key="contains_code", match=MatchValue(value=True))
        ]
    ),
    limit=10
)
```

### Output
```json
{
  "query": "ROS 2 code examples",
  "filters": {
    "difficulty": "beginner",
    "chapter": "Week 1",
    "contains_code": true
  },
  "results": [
    {
      "rank": 1,
      "content": "### Creating a Publisher\n\nHere's a simple Python publisher:\n\n```python\nimport rclpy\nfrom rclpy.node import Node\nfrom std_msgs.msg import String\n\nclass MinimalPublisher(Node):\n    def __init__(self):\n        super().__init__('minimal_publisher')\n        self.publisher_ = self.create_publisher(String, 'topic', 10)\n```",
      "chapter": "Week 1",
      "difficulty": "beginner",
      "contains_code": true
    }
  ]
}
```

---

## Example 6: Deterministic Retrieval

### Setup
Run the same query 3 times with deterministic mode:

```bash
/rag-retrieval query "publishers" --deterministic true
```

### Run 1
```json
{
  "query": "publishers",
  "deterministic": true,
  "results": [
    {"rank": 1, "chunk_id": "chunk-abc123", "score": 0.8945},
    {"rank": 2, "chunk_id": "chunk-def456", "score": 0.8723},
    {"rank": 3, "chunk_id": "chunk-ghi789", "score": 0.8512}
  ]
}
```

### Run 2
```json
{
  "query": "publishers",
  "deterministic": true,
  "results": [
    {"rank": 1, "chunk_id": "chunk-abc123", "score": 0.8945},
    {"rank": 2, "chunk_id": "chunk-def456", "score": 0.8723},
    {"rank": 3, "chunk_id": "chunk-ghi789", "score": 0.8512}
  ]
}
```

### Run 3
```json
{
  "query": "publishers",
  "deterministic": true,
  "results": [
    {"rank": 1, "chunk_id": "chunk-abc123", "score": 0.8945},
    {"rank": 2, "chunk_id": "chunk-def456", "score": 0.8723},
    {"rank": 3, "chunk_id": "chunk-ghi789", "score": 0.8512}
  ]
}
```

**Result**: Identical across all runs (deterministic mode enabled exact search)

---

## Example 7: Error Handling - Insufficient Context

### Query
```
User: "Should I use ROS 2 or just Python?"
Mode: book_only
```

### Processing
```python
# Search
results = client.search(query_vector=embedding, limit=10)

# Check score threshold (0.7 for book_only)
relevant = [r for r in results if r.score > 0.7]

if not relevant:
    return {
        "status": "insufficient_context",
        "mode": "book_only",
        "query": "Should I use ROS 2 or just Python?",
        "message": "This is an opinion question that cannot be answered from the textbook alone",
        "suggestion": "Try asking about: 'What are ROS 2 features?' or 'When should I use ROS 2?'",
        "found_scores": [0.62, 0.58, 0.55]  # Below threshold
    }
```

### Output
```json
{
  "status": "insufficient_context",
  "mode": "book_only",
  "message": "This is an opinion question that cannot be answered from the textbook alone",
  "suggestion": "Try asking about: 'What are ROS 2 features?' or 'When should I use ROS 2?'"
}
```

### Agent Response
```
I can't answer this question based on the textbook alone, as it
requires subjective judgment. However, I can tell you about ROS 2
features and capabilities, which can help you make an informed decision.

Try asking: "What are the key features of ROS 2?" or
"What are ROS 2's advantages?"
```

---

## Example 8: Batch Retrieval

### Input: queries.jsonl
```jsonl
{"query": "What is ROS 2?", "mode": "book_only"}
{"query": "How do publishers work?", "mode": "book_only"}
{"query": "Explain this code", "mode": "selected_text_only", "selected": "def callback(self, msg): ..."}
```

### Processing
```python
queries = load_jsonl("queries.jsonl")

results = []
for query_obj in queries:
    result = retrieve(
        query=query_obj['query'],
        mode=query_obj['mode'],
        selected_text=query_obj.get('selected')
    )
    results.append(result)

write_jsonl(results, "results.jsonl")
```

### Output: results.jsonl
```jsonl
{"query": "What is ROS 2?", "mode": "book_only", "status": "success", "results": [...]}
{"query": "How do publishers work?", "mode": "book_only", "status": "success", "results": [...]}
{"query": "Explain this code", "mode": "selected_text_only", "status": "success", "results": [...]}
```

---

## Example 9: Query Caching

### First Query (Cache Miss)
```
Query: "What is ROS 2?"
Time: 45ms
  - Embedding generation: 15ms
  - Qdrant search: 30ms
  - Total: 45ms
```

### Repeated Query (Cache Hit)
```
Query: "What is ROS 2?"
Time: 2ms
  - Embedding lookup: 1ms (LRU cache hit)
  - Qdrant search: 1ms
  - Total: 2ms
```

**Benefit**: 22x faster on repeated queries

---

## Example 10: Query Preprocessing Impact

### Original Query
```
"Tell me about what is the publisher and subscriber pattern in ROS 2"
```

### After Preprocessing
```
"publisher subscriber pattern ROS 2"
```

### Embedding Quality
- Without preprocessing: Embedding includes stop words, longer context
- With preprocessing: Focused on key concepts, cleaner embedding

### Retrieval Impact
- More precise semantic matching
- Better chunk ranking
- Reduced noise from stop words

---

## Example 11: Mode Comparison

Same query, different modes:

### Query
```
"How do I use ROS 2 in production?"
```

### Book-Only Mode
```json
{
  "status": "insufficient_context",
  "message": "Production considerations not covered in introductory textbook"
}
```

### General Mode
```json
{
  "results": [
    {
      "chunk_id": "textbook-chunk",
      "content": "ROS 2 is used in industrial robots...",
      "source": "textbook"
    }
  ],
  "note": "Can supplement with external knowledge about production best practices"
}
```

**Difference**: Book-only is strict, general allows external context

---

## Example 12: Performance Metrics

### Query Analytics
```json
{
  "query": "What is ROS 2?",
  "mode": "book_only",
  "metrics": {
    "embedding_time_ms": 15,
    "search_time_ms": 32,
    "reranking_time_ms": 0,
    "total_time_ms": 47,
    "results_count": 5,
    "top_result_score": 0.8945,
    "avg_result_score": 0.8234
  }
}
```

### Reranking Impact
```json
{
  "without_reranking": {
    "top_result": "Understanding Inverse Kinematics",
    "score": 0.89
  },
  "with_reranking": {
    "top_result": "IK Implementation in Python",
    "score_reranked": 0.98
  },
  "quality_improvement": "+9%"
}
```

---

These examples demonstrate the RAG retrieval skill across different scenarios, modes, and strategies. Use them as a reference when implementing semantic search in your RAG system.
