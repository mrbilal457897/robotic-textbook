# Embedding Generation Examples

Concrete examples showing embedding generation workflows, API interactions, retry logic, and output formats.

## Example 1: Basic Embedding Generation (OpenAI)

### Input: chunks.jsonl
```jsonl
{"chunk_id":"physical-ai-textbook-7f3a9b2c","content":"# Publishers and Subscribers\n\nROS 2 uses a publish-subscribe pattern for inter-process communication. Publishers send messages to topics...","metadata":{"chapter":"Week 1","section":"ROS 2 Basics"}}
{"chunk_id":"physical-ai-textbook-1e2f3a4b","content":"## Creating a Publisher\n\nTo create a publisher node in Python:\n\n```python\nimport rclpy\nfrom rclpy.node import Node...","metadata":{"chapter":"Week 1","section":"Publishers"}}
{"chunk_id":"physical-ai-textbook-c3d4e5f6","content":"## Creating a Subscriber\n\nSimilarly, here's how to create a subscriber node...","metadata":{"chapter":"Week 1","section":"Subscribers"}}
```

### Command
```bash
/embedding-generation --input chunks.jsonl --provider openai --model text-embedding-3-small
```

### Execution Log
```
[2025-01-27 10:30:45] Starting embedding generation...
[2025-01-27 10:30:45] Provider: openai
[2025-01-27 10:30:45] Model: text-embedding-3-small
[2025-01-27 10:30:45] Dimensions: 1536
[2025-01-27 10:30:45] Loaded 523 chunks from chunks.jsonl
[2025-01-27 10:30:45] Checking for previous state...
[2025-01-27 10:30:45] No previous state found, starting fresh
[2025-01-27 10:30:46] Created 6 batches (avg 87 chunks/batch)
[2025-01-27 10:30:46] Estimated cost: $0.00975
[2025-01-27 10:30:46]
[2025-01-27 10:30:46] Processing batch 1/6... [100 chunks]
[2025-01-27 10:30:52] ✓ Batch 1 complete (100/523 chunks, 19.1%)
[2025-01-27 10:30:52] Checkpoint saved
[2025-01-27 10:30:52]
[2025-01-27 10:30:52] Processing batch 2/6... [100 chunks]
[2025-01-27 10:30:58] ✓ Batch 2 complete (200/523 chunks, 38.2%)
[2025-01-27 10:30:58] Checkpoint saved
[2025-01-27 10:30:58]
[2025-01-27 10:30:58] Processing batch 3/6... [100 chunks]
[2025-01-27 10:31:04] ✓ Batch 3 complete (300/523 chunks, 57.4%)
[2025-01-27 10:31:04] Checkpoint saved
[2025-01-27 10:31:04]
[2025-01-27 10:31:04] Processing batch 4/6... [100 chunks]
[2025-01-27 10:31:10] ✓ Batch 4 complete (400/523 chunks, 76.5%)
[2025-01-27 10:31:10] Checkpoint saved
[2025-01-27 10:31:10]
[2025-01-27 10:31:10] Processing batch 5/6... [100 chunks]
[2025-01-27 10:31:16] ✓ Batch 5 complete (500/523 chunks, 95.6%)
[2025-01-27 10:31:16] Checkpoint saved
[2025-01-27 10:31:16]
[2025-01-27 10:31:16] Processing batch 6/6... [23 chunks]
[2025-01-27 10:31:18] ✓ Batch 6 complete (523/523 chunks, 100.0%)
[2025-01-27 10:31:18] Checkpoint saved
[2025-01-27 10:31:18]
============================================================
EMBEDDING GENERATION COMPLETE
============================================================
Total chunks processed: 523
Successful: 523
Failed: 0
Provider: openai
Model: text-embedding-3-small
Dimensions: 1536
Total tokens: 487,650
Total cost: $0.00975
Duration: 33 seconds
Output: output/embeddings/chunks-with-embeddings.jsonl
============================================================
```

### Output: chunks-with-embeddings.jsonl
```jsonl
{"chunk_id":"physical-ai-textbook-7f3a9b2c","content":"# Publishers and Subscribers\n\nROS 2 uses...","embedding":[0.0234,-0.0412,0.0187,-0.0298,0.0445,-0.0123,0.0367,...,0.0089],"metadata":{"chapter":"Week 1","section":"ROS 2 Basics"},"embedding_metadata":{"provider":"openai","model":"text-embedding-3-small","dimensions":1536,"timestamp":"2025-01-27T10:30:52Z"}}
{"chunk_id":"physical-ai-textbook-1e2f3a4b","content":"## Creating a Publisher\n\nTo create...","embedding":[-0.0123,0.0345,-0.0267,0.0198,0.0512,-0.0234,0.0178,...,-0.0145],"metadata":{"chapter":"Week 1","section":"Publishers"},"embedding_metadata":{"provider":"openai","model":"text-embedding-3-small","dimensions":1536,"timestamp":"2025-01-27T10:30:52Z"}}
```

### Output: embedding-metadata.json
```json
{
  "run_id": "emb-20250127-103045",
  "started_at": "2025-01-27T10:30:45Z",
  "completed_at": "2025-01-27T10:31:18Z",
  "duration_seconds": 33,
  "provider": "openai",
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "total_chunks": 523,
  "successful": 523,
  "failed": 0,
  "batches_processed": 6,
  "total_tokens": 487650,
  "total_cost": 0.00975,
  "avg_tokens_per_chunk": 932,
  "avg_batch_time_seconds": 5.5,
  "throughput_chunks_per_second": 15.8,
  "failed_chunk_ids": []
}
```

---

## Example 2: Retry Logic in Action

### Scenario: Transient API Error (429 Rate Limit)

### Execution Log
```
[2025-01-27 10:35:20] Processing batch 3/6... [100 chunks]
[2025-01-27 10:35:22] ✗ Error: 429 Too Many Requests
[2025-01-27 10:35:22] Retry attempt 1/5 in 1.23s...
[2025-01-27 10:35:23] Processing batch 3/6... [100 chunks]
[2025-01-27 10:35:29] ✓ Batch 3 complete (300/523 chunks, 57.4%)
```

### Retry Algorithm Visualization
```
Attempt 1: Immediate call → 429 Error
  ↓
Wait 1.23s (1s base + 0.23s jitter)
  ↓
Attempt 2: Success ✓
```

### Exponential Backoff Timing
```
Attempt | Base Delay | Jitter | Total Wait
--------|-----------|--------|------------
1       | 1s        | 0.23s  | 1.23s
2       | 2s        | 0.45s  | 2.45s
3       | 4s        | 0.78s  | 4.78s
4       | 8s        | 1.12s  | 9.12s
5       | 16s       | 2.34s  | 18.34s
```

### Code Implementation
```python
import time
import random

def retry_with_backoff(func, max_retries=5):
    for attempt in range(max_retries):
        try:
            return func()
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise e

            # Exponential backoff: 2^attempt seconds
            base_delay = 2 ** attempt
            jitter = random.uniform(0, base_delay * 0.1)
            total_delay = base_delay + jitter

            print(f"Retry attempt {attempt + 1}/{max_retries} in {total_delay:.2f}s...")
            time.sleep(total_delay)
```

---

## Example 3: Idempotent Resume from Interruption

### Initial Run (Interrupted)
```bash
/embedding-generation --input chunks.jsonl
```

### Log (Process Killed at 65%)
```
[2025-01-27 10:40:10] Processing batch 4/6... [100 chunks]
[2025-01-27 10:40:16] ✓ Batch 4 complete (400/523 chunks, 76.5%)
[2025-01-27 10:40:16] Checkpoint saved
[2025-01-27 10:40:16]
[2025-01-27 10:40:16] Processing batch 5/6... [100 chunks]
^C
[2025-01-27 10:40:18] Process interrupted
```

### State File After Interruption: embedding-state.json
```json
{
  "run_id": "emb-20250127-104010",
  "started_at": "2025-01-27T10:40:10Z",
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "total_chunks": 523,
  "embedded_chunks": 400,
  "failed_chunks": 0,
  "progress_percentage": 76.5,
  "embedded_chunk_ids": [
    "physical-ai-textbook-7f3a9b2c",
    "physical-ai-textbook-1e2f3a4b",
    "...400 total..."
  ],
  "failed_chunk_ids": [],
  "last_checkpoint": "2025-01-27T10:40:16Z",
  "interrupted": true
}
```

### Resume Run
```bash
/embedding-generation --input chunks.jsonl --resume
```

### Log (Resumed)
```
[2025-01-27 10:45:00] Starting embedding generation...
[2025-01-27 10:45:00] Found previous state: embedding-state.json
[2025-01-27 10:45:00] Resuming from previous run (emb-20250127-104010)
[2025-01-27 10:45:00] Already embedded: 400 chunks (76.5%)
[2025-01-27 10:45:00] Remaining: 123 chunks
[2025-01-27 10:45:00]
[2025-01-27 10:45:00] Processing batch 5/6... [100 chunks]
[2025-01-27 10:45:06] ✓ Batch 5 complete (500/523 chunks, 95.6%)
[2025-01-27 10:45:06] Checkpoint saved
[2025-01-27 10:45:06]
[2025-01-27 10:45:06] Processing batch 6/6... [23 chunks]
[2025-01-27 10:45:08] ✓ Batch 6 complete (523/523 chunks, 100.0%)
[2025-01-27 10:45:08] Checkpoint saved
[2025-01-27 10:45:08]
============================================================
EMBEDDING GENERATION COMPLETE (RESUMED)
============================================================
Total chunks processed: 123 (resumed from 400)
Grand total: 523
Successful: 523
Failed: 0
Duration (this session): 8 seconds
Total duration: 41 seconds
============================================================
```

### Key Idempotency Features
- ✓ Detects previous run automatically
- ✓ Loads embedded chunk IDs from state
- ✓ Skips already-embedded chunks
- ✓ Continues from last checkpoint
- ✓ Merges results with previous output

---

## Example 4: Cost Estimation (Dry Run)

### Command
```bash
/embedding-generation --input chunks.jsonl --dry-run --estimate-cost
```

### Output
```
============================================================
EMBEDDING COST ESTIMATE (DRY RUN)
============================================================
Input file: chunks.jsonl
Total chunks: 523

Provider: openai
Model: text-embedding-3-small
Dimensions: 1536

Token Analysis:
  Total tokens: 487,650
  Avg tokens/chunk: 932
  Min tokens/chunk: 412
  Max tokens/chunk: 1,498

Batching:
  Batch size: 100 chunks
  Total batches: 6
  Avg tokens/batch: 81,275

Cost Breakdown:
  Rate: $0.02 per 1M tokens
  Total tokens: 487,650
  Estimated cost: $0.00975

Time Estimate:
  Rate limit: 3000 req/min (Tier 1)
  Batches: 6
  Estimated time: 30-40 seconds
  Throughput: ~13-17 chunks/second

Comparison with other models:
  text-embedding-3-small: $0.00975 (selected)
  text-embedding-3-large: $0.06339 (6.5x more)
  text-embedding-ada-002: $0.04877 (5x more)
  Cohere embed-english: $0.04877 (5x more)
  Local models: $0.00 (free)

Recommendation: text-embedding-3-small offers best value
============================================================

Run without --dry-run to proceed with embedding generation.
```

---

## Example 5: Batch Processing with Variable Chunk Sizes

### Input Chunks (Mixed Sizes)
```json
[
  {"chunk_id": "chunk-1", "content": "Short chunk (200 tokens)", "token_count": 200},
  {"chunk_id": "chunk-2", "content": "Medium chunk (800 tokens)", "token_count": 800},
  {"chunk_id": "chunk-3", "content": "Large chunk (1400 tokens)", "token_count": 1400},
  {"chunk_id": "chunk-4", "content": "Small chunk (150 tokens)", "token_count": 150},
  {"chunk_id": "chunk-5", "content": "Medium chunk (900 tokens)", "token_count": 900}
]
```

### Intelligent Batching Algorithm
```python
max_batch_size = 100 chunks
max_tokens_per_batch = 8000 tokens

Batch 1:
  - chunk-1 (200 tokens) ✓
  - chunk-2 (800 tokens) ✓
  - chunk-3 (1400 tokens) ✓
  - chunk-4 (150 tokens) ✓
  - chunk-5 (900 tokens) ✓
  Total: 5 chunks, 3,450 tokens ✓ under 8000

Batch 2:
  - chunk-6 (1200 tokens) ✓
  - chunk-7 (1500 tokens) ✓
  - chunk-8 (1300 tokens) ✓
  - chunk-9 (1400 tokens) ✓
  - chunk-10 (1100 tokens) ✓
  - chunk-11 (800 tokens) ✓
  Total: 6 chunks, 7,300 tokens ✓ under 8000

Batch 3:
  - chunk-12 (1600 tokens) ✓
  - chunk-13 (2000 tokens) ✓ STOP (would exceed 8000)
  Total: 1 chunk, 1,600 tokens
  (chunk-13 moves to next batch)
```

### Log Output
```
[2025-01-27 11:00:10] Created 3 batches from 13 chunks
[2025-01-27 11:00:10] Batch 1: 5 chunks, 3,450 tokens
[2025-01-27 11:00:10] Batch 2: 6 chunks, 7,300 tokens
[2025-01-27 11:00:10] Batch 3: 2 chunks, 3,600 tokens
[2025-01-27 11:00:10] All batches under token limit ✓
```

---

## Example 6: Handling Failed Chunks

### Scenario: 3 Chunks Fail Permanently

### Log
```
[2025-01-27 11:05:20] Processing batch 5/6... [100 chunks]
[2025-01-27 11:05:22] ✗ Chunk 'chunk-abc123' failed: 400 Bad Request (invalid characters)
[2025-01-27 11:05:22] Retry attempt 1/5...
[2025-01-27 11:05:23] ✗ Chunk 'chunk-abc123' failed: 400 Bad Request (invalid characters)
[2025-01-27 11:05:23] Retry attempt 2/5...
[2025-01-27 11:05:25] ✗ Chunk 'chunk-abc123' failed: 400 Bad Request (invalid characters)
[2025-01-27 11:05:25] Retry attempt 3/5...
[2025-01-27 11:05:28] ✗ Chunk 'chunk-abc123' failed: 400 Bad Request (invalid characters)
[2025-01-27 11:05:28] Retry attempt 4/5...
[2025-01-27 11:05:32] ✗ Chunk 'chunk-abc123' failed: 400 Bad Request (invalid characters)
[2025-01-27 11:05:32] Retry attempt 5/5...
[2025-01-27 11:05:37] ✗ Chunk 'chunk-abc123' failed permanently: 400 Bad Request
[2025-01-27 11:05:37] Logged to failed-chunks.jsonl
[2025-01-27 11:05:37] Continuing with remaining chunks...
```

### failed-chunks.jsonl
```jsonl
{"chunk_id":"chunk-abc123","error":"400 Bad Request: invalid characters in content","timestamp":"2025-01-27T11:05:37Z","retry_count":5,"content_preview":"Invalid char: \u0000"}
{"chunk_id":"chunk-def456","error":"413 Payload Too Large: chunk exceeds 8191 tokens","timestamp":"2025-01-27T11:05:45Z","retry_count":0,"token_count":9500}
{"chunk_id":"chunk-ghi789","error":"400 Bad Request: empty content","timestamp":"2025-01-27T11:06:02Z","retry_count":0,"content_length":0}
```

### Final Report
```
============================================================
EMBEDDING GENERATION COMPLETE (WITH ERRORS)
============================================================
Total chunks processed: 523
Successful: 520
Failed: 3
  - chunk-abc123: Invalid characters
  - chunk-def456: Payload too large
  - chunk-ghi789: Empty content

See failed-chunks.jsonl for details.
Recommendation: Fix input data and retry failed chunks.
============================================================
```

---

## Example 7: Rate Limiting Visualization

### Scenario: Tier 1 Rate Limit (3000 req/min = 50 req/sec)

### Timeline
```
Time    | Action          | Queue | Rate
--------|-----------------|-------|------
10:00:00| Batch 1 start   | 1     | 1/sec
10:00:06| Batch 1 done    | 0     | -
10:00:06| Batch 2 start   | 1     | 1/sec
10:00:12| Batch 2 done    | 0     | -
10:00:12| Batch 3 start   | 1     | 1/sec
10:00:18| Batch 3 done    | 0     | -
...
10:00:36| Batch 6 start   | 1     | 1/sec
10:00:42| Batch 6 done    | 0     | -

Total requests: 6
Total time: 42 seconds
Avg rate: 0.14 req/sec ✓ Well under 50 req/sec limit
```

### Rate Limiter Code
```python
class RateLimiter:
    def __init__(self, requests_per_minute):
        self.rpm = requests_per_minute
        self.requests = deque()

    def wait_if_needed(self):
        now = time.time()

        # Remove requests older than 1 minute
        while self.requests and self.requests[0] < now - 60:
            self.requests.popleft()

        # If at limit, wait
        if len(self.requests) >= self.rpm:
            sleep_time = 60 - (now - self.requests[0])
            print(f"Rate limit reached, waiting {sleep_time:.2f}s...")
            time.sleep(sleep_time)

        self.requests.append(time.time())
```

---

## Example 8: OpenAI API Request/Response

### Request (Python SDK)
```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.embeddings.create(
    model="text-embedding-3-small",
    input=[
        "# Publishers and Subscribers\n\nROS 2 uses a publish-subscribe pattern...",
        "## Creating a Publisher\n\nTo create a publisher node in Python...",
        "## Creating a Subscriber\n\nSimilarly, here's how to create a subscriber..."
    ],
    encoding_format="float"
)
```

### Response
```python
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [
        0.0234, -0.0412, 0.0187, -0.0298, 0.0445, ..., 0.0089
      ]
    },
    {
      "object": "embedding",
      "index": 1,
      "embedding": [
        -0.0123, 0.0345, -0.0267, 0.0198, 0.0512, ..., -0.0145
      ]
    },
    {
      "object": "embedding",
      "index": 2,
      "embedding": [
        0.0456, -0.0234, 0.0123, -0.0567, 0.0189, ..., 0.0234
      ]
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 2847,
    "total_tokens": 2847
  }
}
```

### Processing Response
```python
embeddings = [item['embedding'] for item in response.data]

# Verify dimensions
assert all(len(emb) == 1536 for emb in embeddings)

# Verify non-zero
assert all(any(x != 0 for x in emb) for emb in embeddings)

# Attach to chunks
for chunk, embedding in zip(chunks, embeddings):
    chunk['embedding'] = embedding
```

---

## Example 9: Local Model (Sentence Transformers)

### Setup
```bash
pip install sentence-transformers
```

### Usage
```python
from sentence_transformers import SentenceTransformer

# Load model (downloads on first use)
model = SentenceTransformer('all-mpnet-base-v2')
model.to('cuda')  # Use GPU if available

# Generate embeddings
texts = [chunk['content'] for chunk in chunks]
embeddings = model.encode(
    texts,
    batch_size=32,
    show_progress_bar=True,
    convert_to_tensor=False,
    normalize_embeddings=True
)

# Result: numpy array (n_chunks, 768)
print(embeddings.shape)  # (523, 768)
```

### Comparison: OpenAI vs Local

| Aspect | OpenAI | Local (all-mpnet-base-v2) |
|--------|--------|---------------------------|
| Cost | $0.00975 | $0.00 (free) |
| Time | 33 seconds | 45 seconds (GPU) |
| Dimensions | 1536 | 768 |
| Quality | Higher | Good |
| Privacy | Cloud API | Local processing |
| GPU Required | No | Recommended |

---

## Example 10: Validation Checks

### Embedding Validation
```python
def validate_embeddings(chunks):
    errors = []

    for chunk in chunks:
        # Check embedding exists
        if 'embedding' not in chunk:
            errors.append(f"{chunk['chunk_id']}: Missing embedding")
            continue

        emb = chunk['embedding']

        # Check dimensions
        if len(emb) != 1536:
            errors.append(f"{chunk['chunk_id']}: Wrong dimensions ({len(emb)})")

        # Check for zero vector (embedding failed)
        if all(x == 0 for x in emb):
            errors.append(f"{chunk['chunk_id']}: Zero vector")

        # Check for NaN values
        if any(math.isnan(x) for x in emb):
            errors.append(f"{chunk['chunk_id']}: Contains NaN")

        # Check for inf values
        if any(math.isinf(x) for x in emb):
            errors.append(f"{chunk['chunk_id']}: Contains inf")

    if errors:
        print(f"Validation failed: {len(errors)} errors")
        for error in errors[:10]:  # Show first 10
            print(f"  - {error}")
    else:
        print("Validation passed: All embeddings valid ✓")

    return len(errors) == 0
```

### Output
```
Validation passed: All embeddings valid ✓
  - 523 chunks have embeddings
  - All have correct dimensions (1536)
  - No zero vectors
  - No NaN or inf values
```

---

These examples demonstrate the embedding generation skill's behavior across different scenarios, providers, error conditions, and optimization strategies. Use them as a reference when generating embeddings for your textbook content.
