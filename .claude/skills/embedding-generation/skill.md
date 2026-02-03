# Embedding Generation for RAG

Generate vector embeddings for textbook content chunks using OpenAI and other embedding models. Implements batch-safe processing, automatic retry logic, idempotency, rate limiting, and cost optimization for production RAG systems.

## Purpose

This skill transforms text chunks into dense vector representations (embeddings) that enable semantic search and retrieval. It provides:
- Multi-provider support (OpenAI, Cohere, local models)
- Intelligent batch processing to maximize throughput
- Automatic retry with exponential backoff for API failures
- Idempotent processing (skip already-embedded chunks)
- Rate limiting to respect API quotas
- Cost tracking and optimization
- Progress tracking and resumability

## When to Use

Invoke this skill when:
- **Initial embedding generation**: First-time embedding of textbook chunks
- **Content updates**: Re-embedding modified or new chunks
- **Model migration**: Switching to a different embedding model
- **Dimension changes**: Moving from one vector size to another
- **Quality improvement**: Re-embedding with updated preprocessing
- **Failed runs recovery**: Resume interrupted embedding jobs
- **Cost analysis**: Estimating embedding costs before full run

## Usage

```bash
# Basic embedding generation
/embedding-generation --input chunks.jsonl

# Specify provider and model
/embedding-generation --provider openai --model text-embedding-3-small

# With batch size and rate limiting
/embedding-generation --batch-size 100 --rate-limit 3000/min

# Resume failed run (idempotent)
/embedding-generation --input chunks.jsonl --resume --state-file progress.json

# Dry run (cost estimate)
/embedding-generation --dry-run --estimate-cost
```

## Supported Embedding Providers

### 1. OpenAI (Default)
Best quality-to-cost ratio for most use cases.

**Models**:
- `text-embedding-3-small` (1536 dims) - **Recommended**
  - $0.02 per 1M tokens
  - Fast, high quality
  - Best for most applications

- `text-embedding-3-large` (3072 dims)
  - $0.13 per 1M tokens
  - Highest quality
  - Use for precision-critical applications

- `text-embedding-ada-002` (1536 dims) - Legacy
  - $0.10 per 1M tokens
  - Still supported but newer models better

**API Configuration**:
```json
{
  "provider": "openai",
  "api_key": "sk-...",
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "batch_size": 100,
  "rate_limit": "3000/min"
}
```

### 2. Cohere
Good alternative with competitive pricing.

**Models**:
- `embed-english-v3.0` (1024 dims)
  - $0.10 per 1M tokens
  - Optimized for English

- `embed-multilingual-v3.0` (1024 dims)
  - $0.10 per 1M tokens
  - Supports 100+ languages

**API Configuration**:
```json
{
  "provider": "cohere",
  "api_key": "...",
  "model": "embed-english-v3.0",
  "input_type": "search_document",
  "batch_size": 96
}
```

### 3. Local Models (Sentence Transformers)
Free, private, but slower and requires local GPU.

**Models**:
- `all-MiniLM-L6-v2` (384 dims) - Fast, lightweight
- `all-mpnet-base-v2` (768 dims) - Better quality
- `instructor-large` (768 dims) - Instruction-based

**Configuration**:
```json
{
  "provider": "local",
  "model": "all-mpnet-base-v2",
  "device": "cuda",
  "batch_size": 32
}
```

## Batch Processing

### Intelligent Batching
Automatically groups chunks into optimal batch sizes for API efficiency.

**Algorithm**:
```python
def create_batches(chunks, max_batch_size, max_tokens_per_batch):
    batches = []
    current_batch = []
    current_tokens = 0

    for chunk in chunks:
        chunk_tokens = estimate_tokens(chunk.content)

        # Check if adding this chunk would exceed limits
        if (len(current_batch) >= max_batch_size or
            current_tokens + chunk_tokens > max_tokens_per_batch):
            # Finalize current batch
            batches.append(current_batch)
            current_batch = [chunk]
            current_tokens = chunk_tokens
        else:
            current_batch.append(chunk)
            current_tokens += chunk_tokens

    # Add final batch
    if current_batch:
        batches.append(current_batch)

    return batches
```

**Batch Size Recommendations**:
| Provider | Recommended Batch Size | Max Tokens/Batch |
|----------|----------------------|------------------|
| OpenAI | 100-2048 | 8191 per request |
| Cohere | 96 | 96 texts per request |
| Local | 16-32 (GPU dependent) | Memory limited |

### Rate Limiting
Respects API rate limits to avoid throttling.

**Implementation**:
```python
import time
from collections import deque

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
            if sleep_time > 0:
                time.sleep(sleep_time)

        self.requests.append(time.time())
```

**Rate Limits by Tier** (OpenAI):
- Free tier: 3 requests/min
- Tier 1: 3,000 requests/min
- Tier 2: 5,000 requests/min
- Tier 3+: Higher limits

## Retry Logic

### Exponential Backoff
Automatically retries failed requests with increasing delays.

**Strategy**:
```python
import time
import random

def retry_with_backoff(func, max_retries=5, base_delay=1):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise e

            # Exponential backoff with jitter
            delay = base_delay * (2 ** attempt)
            jitter = random.uniform(0, delay * 0.1)
            total_delay = delay + jitter

            print(f"Attempt {attempt + 1} failed: {e}")
            print(f"Retrying in {total_delay:.2f}s...")
            time.sleep(total_delay)
```

**Retry Conditions**:
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - API temporary issue
- `503 Service Unavailable` - API overloaded
- Network errors (connection timeout, DNS failure)

**Non-Retry Conditions**:
- `401 Unauthorized` - Invalid API key (fail immediately)
- `400 Bad Request` - Invalid input (skip chunk, log error)
- `413 Payload Too Large` - Chunk too large (split and retry)

## Idempotency

### State Tracking
Maintains state file to track embedding progress.

**State File Format** (`embedding-state.json`):
```json
{
  "run_id": "emb-20250127-103045",
  "started_at": "2025-01-27T10:30:45Z",
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "total_chunks": 523,
  "embedded_chunks": 342,
  "failed_chunks": 3,
  "progress_percentage": 65.4,
  "estimated_cost": 0.045,
  "embedded_chunk_ids": [
    "physical-ai-textbook-7f3a9b2c1d4e5f6a",
    "physical-ai-textbook-1e2f3a4b5c6d7e8f",
    "..."
  ],
  "failed_chunk_ids": [
    "physical-ai-textbook-abc123def456"
  ],
  "last_checkpoint": "2025-01-27T10:35:20Z"
}
```

### Resume Capability
Automatically skips already-embedded chunks when resuming.

**Algorithm**:
```python
def resume_embedding(chunks, state_file):
    # Load previous state
    if os.path.exists(state_file):
        state = load_json(state_file)
        embedded_ids = set(state['embedded_chunk_ids'])
        print(f"Resuming: {len(embedded_ids)} chunks already embedded")
    else:
        embedded_ids = set()

    # Filter out already-embedded chunks
    remaining_chunks = [
        c for c in chunks
        if c.chunk_id not in embedded_ids
    ]

    print(f"Processing {len(remaining_chunks)} remaining chunks")
    return remaining_chunks, state
```

### Checkpointing
Saves progress after each successful batch.

```python
def process_batches_with_checkpoints(batches, state_file):
    for i, batch in enumerate(batches):
        # Generate embeddings for batch
        embeddings = generate_embeddings(batch)

        # Save embeddings
        save_embeddings(batch, embeddings)

        # Update state
        state['embedded_chunks'] += len(batch)
        state['progress_percentage'] = (state['embedded_chunks'] / state['total_chunks']) * 100
        state['last_checkpoint'] = datetime.now().isoformat()

        # Save checkpoint
        save_json(state, state_file)

        print(f"Checkpoint: {state['embedded_chunks']}/{state['total_chunks']} chunks")
```

## Implementation Steps

When invoked, this skill executes:

### Step 1: Load and Validate Input
```python
# Read chunks from JSONL
chunks = load_jsonl(input_file)

print(f"Loaded {len(chunks)} chunks")

# Validate chunk structure
for chunk in chunks:
    assert 'chunk_id' in chunk
    assert 'content' in chunk
    assert len(chunk['content']) > 0

# Check for existing embeddings (idempotency)
if os.path.exists(state_file):
    state = load_json(state_file)
    already_embedded = set(state['embedded_chunk_ids'])
    chunks = [c for c in chunks if c['chunk_id'] not in already_embedded]
    print(f"Skipping {len(already_embedded)} already-embedded chunks")
```

### Step 2: Initialize Provider and Rate Limiter
```python
# Configure embedding provider
if provider == "openai":
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    model = "text-embedding-3-small"
    batch_size = 100
    rate_limiter = RateLimiter(requests_per_minute=3000)
elif provider == "cohere":
    client = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
    model = "embed-english-v3.0"
    batch_size = 96
    rate_limiter = RateLimiter(requests_per_minute=1000)
elif provider == "local":
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-mpnet-base-v2')
    batch_size = 32
    rate_limiter = None  # No rate limiting for local
```

### Step 3: Estimate Cost (Optional Dry Run)
```python
if dry_run:
    total_tokens = sum(estimate_tokens(c['content']) for c in chunks)

    if provider == "openai":
        cost_per_million = 0.02  # text-embedding-3-small
        estimated_cost = (total_tokens / 1_000_000) * cost_per_million
    elif provider == "cohere":
        cost_per_million = 0.10
        estimated_cost = (total_tokens / 1_000_000) * cost_per_million
    else:
        estimated_cost = 0.0  # Local is free

    print(f"\nCost Estimate:")
    print(f"  Total tokens: {total_tokens:,}")
    print(f"  Estimated cost: ${estimated_cost:.4f}")
    print(f"  Batches required: {len(chunks) // batch_size + 1}")

    return
```

### Step 4: Create Batches
```python
batches = create_batches(
    chunks,
    max_batch_size=batch_size,
    max_tokens_per_batch=8000  # Safety margin
)

print(f"Created {len(batches)} batches")
```

### Step 5: Generate Embeddings with Retry
```python
results = []

for batch_idx, batch in enumerate(batches):
    print(f"Processing batch {batch_idx + 1}/{len(batches)}...")

    # Rate limiting
    if rate_limiter:
        rate_limiter.wait_if_needed()

    # Extract texts
    texts = [chunk['content'] for chunk in batch]

    # Generate embeddings with retry
    try:
        embeddings = retry_with_backoff(
            lambda: generate_batch_embeddings(client, model, texts),
            max_retries=5
        )

        # Attach embeddings to chunks
        for chunk, embedding in zip(batch, embeddings):
            chunk['embedding'] = embedding
            results.append(chunk)

        # Checkpoint progress
        save_checkpoint(results, state_file)

    except Exception as e:
        print(f"Batch {batch_idx + 1} failed permanently: {e}")
        # Log failed chunk IDs
        for chunk in batch:
            log_failed_chunk(chunk['chunk_id'], str(e))
```

### Step 6: Save Embeddings
```python
# Write embeddings to JSONL
output_file = output_dir / "chunks-with-embeddings.jsonl"
write_jsonl(results, output_file)

# Save metadata
metadata = {
    "run_id": run_id,
    "completed_at": datetime.now().isoformat(),
    "provider": provider,
    "model": model,
    "dimensions": len(results[0]['embedding']),
    "total_chunks": len(results),
    "successful": len(results),
    "failed": len(failed_chunks),
    "total_cost": calculate_total_cost(results)
}

write_json(metadata, output_dir / "embedding-metadata.json")
```

### Step 7: Generate Report
```python
print("\n" + "="*60)
print("EMBEDDING GENERATION COMPLETE")
print("="*60)
print(f"Total chunks processed: {len(results)}")
print(f"Successful: {len(results)}")
print(f"Failed: {len(failed_chunks)}")
print(f"Model: {provider}/{model}")
print(f"Dimensions: {len(results[0]['embedding'])}")
print(f"Total cost: ${total_cost:.4f}")
print(f"Output: {output_file}")
print("="*60)
```

## Output Format

### Chunks with Embeddings (JSONL)
```jsonl
{"chunk_id":"physical-ai-textbook-7f3a9b2c","content":"# Publishers and Subscribers...","embedding":[0.023, -0.041, 0.018, ...], "metadata":{...}}
{"chunk_id":"physical-ai-textbook-1e2f3a4b","content":"## Creating a Publisher...","embedding":[-0.012, 0.034, -0.027, ...], "metadata":{...}}
```

### Embedding Metadata
```json
{
  "run_id": "emb-20250127-103045",
  "started_at": "2025-01-27T10:30:45Z",
  "completed_at": "2025-01-27T10:42:18Z",
  "duration_seconds": 693,
  "provider": "openai",
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "total_chunks": 523,
  "successful": 520,
  "failed": 3,
  "total_tokens": 487650,
  "total_cost": 0.00975,
  "avg_tokens_per_chunk": 932,
  "batches_processed": 6,
  "avg_batch_time_seconds": 115.5,
  "failed_chunk_ids": [
    "physical-ai-textbook-abc123"
  ]
}
```

## Cost Optimization

### 1. Preprocessing
Remove unnecessary content before embedding.

```python
def preprocess_for_embedding(text):
    # Remove excessive whitespace
    text = ' '.join(text.split())

    # Remove markdown artifacts
    text = text.replace('```', '')

    # Truncate if too long (safety)
    max_tokens = 8000
    if estimate_tokens(text) > max_tokens:
        text = truncate_to_tokens(text, max_tokens)

    return text
```

### 2. Caching
Cache embeddings for identical content.

```python
@lru_cache(maxsize=10000)
def get_cached_embedding(content_hash):
    # Check cache
    if content_hash in embedding_cache:
        return embedding_cache[content_hash]
    return None
```

### 3. Dimension Reduction
Use smaller dimensions for OpenAI models when possible.

```python
# OpenAI text-embedding-3-* supports custom dimensions
response = client.embeddings.create(
    model="text-embedding-3-small",
    input=texts,
    dimensions=512  # Reduce from 1536 to 512
)
```

**Trade-offs**:
- Smaller dimensions = less storage, faster search, slightly lower quality
- Recommended: Use full dimensions unless storage/speed critical

## Error Handling

### Common Issues and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid API key | Check environment variable, verify key validity |
| `429 Too Many Requests` | Rate limit exceeded | Reduce batch size, slow down requests |
| `400 Bad Request` | Invalid input | Check chunk content, remove special characters |
| `413 Payload Too Large` | Chunk too long | Split chunk, reduce batch size |
| `500 Internal Server Error` | API issue | Retry with exponential backoff |
| `503 Service Unavailable` | API overloaded | Retry after delay |
| `Connection timeout` | Network issue | Retry with backoff |
| `Out of memory` (local) | Batch too large | Reduce batch size, use GPU |

### Failed Chunk Handling

```python
def handle_failed_chunk(chunk_id, error, failed_log):
    failed_entry = {
        "chunk_id": chunk_id,
        "error": str(error),
        "timestamp": datetime.now().isoformat(),
        "retry_count": 0
    }

    # Log to failed chunks file
    with open(failed_log, 'a') as f:
        f.write(json.dumps(failed_entry) + '\n')

    print(f"Failed chunk logged: {chunk_id}")
```

### Retry Failed Chunks

```bash
# After initial run, retry only failed chunks
/embedding-generation --input chunks.jsonl --retry-failed --failed-log failed-chunks.jsonl
```

## Performance Optimization

### Parallel Processing
Process multiple batches concurrently (respecting rate limits).

```python
from concurrent.futures import ThreadPoolExecutor

def parallel_batch_processing(batches, max_workers=4):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = []

        for batch in batches:
            future = executor.submit(
                process_batch_with_rate_limit,
                batch
            )
            futures.append(future)

        results = [f.result() for f in futures]

    return results
```

**Note**: Only use parallel processing if rate limits allow. OpenAI tier 1: 3000 req/min = 50 req/sec, so max_workers=4 is safe.

### Progress Tracking

```python
from tqdm import tqdm

for batch in tqdm(batches, desc="Generating embeddings"):
    embeddings = generate_batch_embeddings(batch)
    save_results(batch, embeddings)
```

## Configuration Options

```json
{
  "provider": "openai",
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "batch_size": 100,
  "rate_limit": {
    "requests_per_minute": 3000,
    "tokens_per_minute": 1000000
  },
  "retry": {
    "max_retries": 5,
    "base_delay": 1,
    "max_delay": 60,
    "exponential_base": 2
  },
  "idempotency": {
    "enabled": true,
    "state_file": "embedding-state.json",
    "checkpoint_frequency": "per_batch"
  },
  "preprocessing": {
    "normalize_whitespace": true,
    "remove_markdown_artifacts": true,
    "truncate_max_tokens": 8000
  },
  "cost_optimization": {
    "cache_embeddings": true,
    "reduce_dimensions": false,
    "custom_dimensions": null
  },
  "output": {
    "format": "jsonl",
    "directory": "output/embeddings",
    "include_metadata": true,
    "compress": false
  },
  "error_handling": {
    "log_failed_chunks": true,
    "failed_chunks_file": "failed-chunks.jsonl",
    "continue_on_error": true
  },
  "performance": {
    "parallel_processing": false,
    "max_workers": 4,
    "progress_bar": true
  }
}
```

## Best Practices

### Model Selection
| Use Case | Recommended Model | Reason |
|----------|------------------|---------|
| General textbook | `text-embedding-3-small` | Best quality/cost |
| Precision-critical | `text-embedding-3-large` | Highest quality |
| Multilingual | Cohere multilingual | 100+ languages |
| Privacy/offline | Local sentence-transformers | No API calls |
| Tight budget | Local models | Free |

### Batch Size Guidelines
- **OpenAI**: 100-500 chunks per batch (stay under 8191 tokens total)
- **Cohere**: 96 chunks per batch (API limit)
- **Local**: 16-32 chunks per batch (GPU memory dependent)

### Rate Limiting Strategy
- Start conservative (below stated limits)
- Monitor for 429 errors
- Gradually increase if stable
- Use multiple API keys for higher throughput (if allowed by TOS)

### Checkpoint Frequency
- **Per batch** (recommended): Save after each successful batch
- **Every N batches**: Save every 10 batches for large runs
- **Time-based**: Save every 5 minutes

## Integration Points

### With Semantic Chunking
```bash
# Pipeline: chunking → embedding
/semantic-chunking --input extracted.json --output chunks.jsonl
/embedding-generation --input chunks.jsonl
```

### With Vector Databases

**Pinecone Upload**:
```python
import pinecone

# Initialize
pinecone.init(api_key="...")
index = pinecone.Index("textbook-index")

# Load embeddings
chunks = load_jsonl("chunks-with-embeddings.jsonl")

# Prepare vectors
vectors = [
    (
        chunk['chunk_id'],
        chunk['embedding'],
        {
            "content": chunk['content'][:1000],  # Truncate for metadata
            "chapter": chunk['metadata']['chapter'],
            "section": chunk['metadata']['section']
        }
    )
    for chunk in chunks
]

# Upsert in batches
index.upsert(vectors, batch_size=100)
```

**Weaviate Upload**:
```python
import weaviate

client = weaviate.Client("http://localhost:8080")

# Batch import
with client.batch as batch:
    for chunk in chunks:
        batch.add_data_object(
            data_object={
                "content": chunk['content'],
                "chapter": chunk['metadata']['chapter'],
                "chunkId": chunk['chunk_id']
            },
            class_name="TextbookChunk",
            vector=chunk['embedding']
        )
```

### With RAG Agents
- **textbook-retrieval**: Uses embeddings for similarity search
- **context-scope-enforcer**: Filters retrieved chunks by metadata
- **evidence-validator**: Validates against retrieved chunks

## Acceptance Criteria

A successful embedding run must:
- [ ] Process all input chunks without fatal errors
- [ ] Generate embeddings with correct dimensions
- [ ] Save embeddings in valid JSONL format
- [ ] Track progress with state file (idempotency)
- [ ] Handle API failures with retry logic
- [ ] Respect rate limits (no 429 errors)
- [ ] Log failed chunks for manual review
- [ ] Generate metadata report with cost and statistics
- [ ] Allow resumption from checkpoints
- [ ] Validate embedding quality (non-zero, correct shape)

## Evaluation Metrics

Track embedding quality:

1. **Coverage**: % of chunks successfully embedded
2. **Cost**: Total $ spent vs. estimated
3. **Speed**: Chunks per second throughput
4. **Failure rate**: % of chunks that failed permanently
5. **Retry success**: % of retried chunks that succeeded
6. **Embedding quality**: Check for zero vectors, NaN values

## Related Skills and Agents

- **semantic-chunking** - Creates chunks that this skill embeds
- **book-content-ingestion** - Extracts content upstream
- **textbook-retrieval** - Uses embeddings for search

## Next Steps After Embedding

1. **Validate embeddings**: Check vector shape, non-zero values
2. **Upload to vector DB**: Pinecone, Weaviate, or Qdrant
3. **Test similarity search**: Query with sample questions
4. **Benchmark retrieval**: Measure precision and recall
5. **Monitor costs**: Track embedding + storage costs over time

---

**Note**: This skill generates embeddings only. Vector database upload and indexing are separate steps handled by database-specific tools or agents.
