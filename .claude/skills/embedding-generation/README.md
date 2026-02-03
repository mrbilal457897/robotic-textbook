# Embedding Generation Skill

Generate vector embeddings for textbook content chunks with production-grade batch processing, automatic retry logic, idempotency, and cost optimization.

## Quick Start

```bash
# Basic usage (OpenAI text-embedding-3-small)
/embedding-generation --input chunks.jsonl

# Specify provider and model
/embedding-generation --provider openai --model text-embedding-3-large

# With custom batch size and rate limiting
/embedding-generation --batch-size 100 --rate-limit 3000/min

# Resume interrupted run (idempotent)
/embedding-generation --input chunks.jsonl --resume

# Dry run (estimate cost before running)
/embedding-generation --dry-run --estimate-cost
```

## What It Does

This skill transforms text chunks into dense vector embeddings for semantic search:
- **Multi-provider support**: OpenAI (default), Cohere, local Sentence Transformers
- **Intelligent batching**: Automatically groups chunks for optimal API efficiency
- **Automatic retry**: Exponential backoff for transient API failures
- **Idempotent**: Resume from checkpoints, skip already-embedded chunks
- **Rate limiting**: Respects API quotas to avoid throttling
- **Cost tracking**: Monitor and optimize embedding costs
- **Progress tracking**: Real-time progress with resumable state

## Supported Providers

### OpenAI (Recommended)
- **text-embedding-3-small** (1536 dims) - $0.02/1M tokens - **Best value**
- **text-embedding-3-large** (3072 dims) - $0.13/1M tokens - Highest quality
- **text-embedding-ada-002** (1536 dims) - $0.10/1M tokens - Legacy

### Cohere
- **embed-english-v3.0** (1024 dims) - $0.10/1M tokens
- **embed-multilingual-v3.0** (1024 dims) - $0.10/1M tokens - 100+ languages

### Local (Free, requires GPU)
- **all-MiniLM-L6-v2** (384 dims) - Fast, lightweight
- **all-mpnet-base-v2** (768 dims) - Better quality
- **instructor-large** (768 dims) - Instruction-based, highest quality

## Key Features

### 1. Batch Processing
Intelligently groups chunks into optimal batch sizes:
- Respects token limits per request
- Maximizes API efficiency
- Handles variable chunk sizes

### 2. Retry Logic
Automatically retries failed requests:
- Exponential backoff with jitter
- Configurable max retries (default: 5)
- Handles 429, 500, 503 errors
- Logs permanent failures

### 3. Idempotency
Safe to re-run and resume:
- Tracks progress in state file
- Skips already-embedded chunks
- Checkpoint after each batch
- Resume from interruptions

### 4. Rate Limiting
Respects API quotas:
- Token bucket algorithm
- Configurable requests/minute
- Automatic cooldown on 429
- Tier-aware limits

### 5. Cost Optimization
Minimizes embedding costs:
- Preprocessing to remove noise
- Caching for duplicate content
- Dimension reduction (OpenAI)
- Batch size optimization

## Output

Generates three files:

### 1. chunks-with-embeddings.jsonl
```jsonl
{"chunk_id":"physical-ai-textbook-7f3a9b2c","content":"...","embedding":[0.023,-0.041,...],"metadata":{...}}
{"chunk_id":"physical-ai-textbook-1e2f3a4b","content":"...","embedding":[-0.012,0.034,...],"metadata":{...}}
```

### 2. embedding-metadata.json
```json
{
  "run_id": "emb-20250127-103045",
  "provider": "openai",
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "total_chunks": 523,
  "successful": 520,
  "failed": 3,
  "total_cost": 0.00975,
  "duration_seconds": 693
}
```

### 3. embedding-state.json (progress tracking)
```json
{
  "run_id": "emb-20250127-103045",
  "total_chunks": 523,
  "embedded_chunks": 342,
  "progress_percentage": 65.4,
  "embedded_chunk_ids": ["...", "..."],
  "failed_chunk_ids": ["..."]
}
```

## Configuration

Edit `config.json` to customize:

```json
{
  "provider": "openai",
  "model": "text-embedding-3-small",
  "batch_size": 100,
  "rate_limit": {
    "requests_per_minute": 3000
  },
  "retry": {
    "max_retries": 5,
    "base_delay": 1
  },
  "idempotency": {
    "enabled": true,
    "checkpoint_strategy": "per_batch"
  }
}
```

## Best Practices

### Model Selection
| Use Case | Model | Reason |
|----------|-------|---------|
| General textbook | `text-embedding-3-small` | Best quality/cost |
| Precision-critical | `text-embedding-3-large` | Highest quality |
| Multilingual | Cohere multilingual | 100+ languages |
| Privacy/offline | Local models | No API calls |

### Batch Size
- **OpenAI**: 100-500 chunks (stay under 8191 tokens)
- **Cohere**: 96 chunks (API limit)
- **Local**: 16-32 chunks (GPU memory)

### Rate Limiting
Start conservative:
- Free tier: 3 req/min
- Tier 1: 3000 req/min
- Monitor 429 errors, adjust up if stable

### Cost Estimation
Always run `--dry-run` first:
```bash
/embedding-generation --input chunks.jsonl --dry-run --estimate-cost
```

## Error Handling

The skill handles:
- **429 Too Many Requests** - Automatic retry with backoff
- **500/503 Server Errors** - Retry up to 5 times
- **Network timeouts** - Exponential backoff
- **Invalid API key** - Fail immediately with clear message
- **Oversized chunks** - Log and skip, or split if possible

Failed chunks are logged to `failed-chunks.jsonl` for manual review.

## Resume from Interruption

If the process is interrupted:
```bash
# Simply re-run with same command
/embedding-generation --input chunks.jsonl

# Or explicitly resume
/embedding-generation --input chunks.jsonl --resume --state-file embedding-state.json
```

The skill automatically:
- Loads previous state
- Skips already-embedded chunks
- Continues from last checkpoint

## Integration

### With Semantic Chunking
```bash
# Pipeline: chunking → embedding
/semantic-chunking --input extracted.json --output chunks.jsonl
/embedding-generation --input chunks.jsonl
```

### With Vector Databases

**Pinecone**:
```python
import pinecone
chunks = load_jsonl("chunks-with-embeddings.jsonl")
vectors = [(c['chunk_id'], c['embedding'], {...}) for c in chunks]
index.upsert(vectors, batch_size=100)
```

**Weaviate**:
```python
import weaviate
client = weaviate.Client("http://localhost:8080")
with client.batch as batch:
    for chunk in chunks:
        batch.add_data_object({...}, vector=chunk['embedding'])
```

### With RAG Agents
- **textbook-retrieval** - Uses embeddings for similarity search
- **context-scope-enforcer** - Filters by metadata
- **evidence-validator** - Validates against chunks

## Performance

Typical throughput:
- **OpenAI**: 40-50 chunks/sec (tier 1 rate limits)
- **Cohere**: 15-20 chunks/sec
- **Local GPU**: 30-40 chunks/sec (GPU dependent)

For 523 chunks:
- **OpenAI**: ~10-15 minutes
- **Cohere**: ~25-30 minutes
- **Local**: ~15-20 minutes

## Cost Examples

For 523 chunks (avg 1000 tokens each):

| Provider | Model | Total Cost |
|----------|-------|-----------|
| OpenAI | text-embedding-3-small | $0.01 |
| OpenAI | text-embedding-3-large | $0.07 |
| Cohere | embed-english-v3.0 | $0.05 |
| Local | any | $0.00 |

## Validation

The skill validates:
- [x] Embedding dimensions match expected
- [x] No zero vectors (embedding failed)
- [x] No NaN values
- [x] All chunks processed or logged as failed
- [x] State file updated correctly

## Monitoring

Real-time progress display:
```
Processing batch 3/6... [===>    ] 50%
Chunks: 250/523 | Cost: $0.0050 | ETA: 5m 30s
```

## Related Skills

- **semantic-chunking** - Creates chunks for embedding
- **book-content-ingestion** - Extracts content upstream

## Next Steps

After generating embeddings:
1. Validate embedding quality (check dimensions, non-zero)
2. Upload to vector database (Pinecone, Weaviate, Qdrant)
3. Test similarity search with sample queries
4. Benchmark retrieval precision and recall
5. Monitor costs over time

## Troubleshooting

**"401 Unauthorized"**
- Check API key in environment variable
- Verify key is active and has credits

**"429 Too Many Requests"**
- Reduce batch size
- Lower rate limit setting
- Upgrade API tier

**"Out of memory" (local)**
- Reduce batch size
- Use smaller model
- Enable CPU fallback

**"No progress for 5 minutes"**
- Check network connection
- Verify API service status
- Review error logs

## Version

1.0.0 - Initial release

## See Also

- Full documentation: `skill.md`
- Configuration reference: `config.json`
- Concrete examples: `examples.md`
