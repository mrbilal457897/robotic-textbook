# Semantic Chunking Skill

Intelligently split textbook content into semantically coherent, overlapping chunks optimized for vector embeddings and RAG retrieval.

## Quick Start

```bash
# Basic usage with default heading-based strategy
/semantic-chunking --input extracted-content.json

# Custom strategy and size
/semantic-chunking --strategy heading-based --target-size 1000 --overlap 150

# Semantic similarity chunking
/semantic-chunking --strategy semantic-similarity --threshold 0.7

# With deterministic IDs
/semantic-chunking --id-strategy content-hash --version v2
```

## What It Does

This skill implements advanced semantic chunking algorithms:
- **4 chunking strategies**: Heading-based, semantic similarity, paragraph-based, fixed-size smart
- **Context preservation**: Maintains heading hierarchy and parent sections
- **Intelligent overlap**: Creates overlapping chunks for context continuity
- **Deterministic IDs**: Generates stable, content-based chunk identifiers
- **Code integrity**: Never splits code blocks, math equations, or tables
- **Quality validation**: Enforces size limits and context requirements

## Chunking Strategies

### 1. Heading-Based (Default)
Best for structured content with clear hierarchy.
- Splits at h2/h3 boundaries
- Preserves parent heading context
- Ideal for lessons, tutorials, reference docs

### 2. Semantic Similarity
Uses embeddings to find natural topic boundaries.
- Identifies semantic shifts between sentences
- Best for blog posts and narrative content
- More computationally expensive

### 3. Paragraph-Based
Simple, fast, predictable chunking.
- Splits at paragraph boundaries
- Accumulates to target size
- Good for uniform content and testing

### 4. Fixed-Size Smart
Hybrid: fixed size with intelligent boundaries.
- Enforces strict size limits
- Prefers semantic boundaries within tolerance
- Best for embedding model constraints

## Output

Generates three files:

1. **chunks.jsonl** - One chunk per line with metadata
```jsonl
{"chunk_id":"physical-ai-textbook-7f3a9b2c","content":"...","metadata":{...}}
```

2. **statistics.json** - Size distribution, quality metrics
```json
{
  "total_chunks": 523,
  "avg_chunk_size": 987,
  "size_distribution": {...},
  "quality_checks": {...}
}
```

3. **index.json** - Chunk ID to document mapping

## Chunk Metadata

Each chunk includes:
```json
{
  "chunk_id": "physical-ai-textbook-7f3a9b2c1d4e5f6a",
  "content": "# Publishers and Subscribers\n\n...",
  "metadata": {
    "heading_context": ["Week 1", "ROS 2 Basics", "Publishers"],
    "heading_level": 2,
    "position_in_doc": 5,
    "contains_code": true,
    "word_count": 342,
    "token_count": 456,
    "overlap_with_previous": 100,
    "overlap_with_next": 100
  }
}
```

## Deterministic Chunk IDs

### Content-Hash (Recommended)
Stable IDs based on content and position.
- Same content + position = same ID
- Enables versioning and change tracking
- Format: `physical-ai-textbook-{hash}`

### Sequential
Human-readable incrementing IDs.
- Format: `{book_id}-{chapter}-{section}-{chunk_num}`
- Example: `physical-ai-textbook-w1-s2-c003`

### UUID
Globally unique identifiers.
- Standard UUID v4 format
- No content coupling

## Configuration

Edit `config.json` to customize:

```json
{
  "chunking_strategy": "heading-based",
  "target_chunk_size": 1000,
  "chunk_overlap": 100,
  "id_generation": {
    "strategy": "content-hash",
    "version": "v2"
  },
  "context_preservation": {
    "include_heading_path": true,
    "preserve_code_blocks": true
  }
}
```

## Advanced Features

### Adaptive Chunking
Automatically adjusts chunk size based on content density.
- Dense technical content → smaller chunks
- Narrative content → larger chunks

### Multi-Level Chunking
Creates chunks at multiple granularities.
- Section-level chunks for broad retrieval
- Paragraph-level for precise retrieval

### Content-Aware Overlap
Adjusts overlap based on semantic similarity.
- High similarity → less overlap
- Low similarity (topic shift) → more overlap

### Chunk Versioning
Tracks changes across content updates.
- Detects when chunks are modified
- Links to previous versions

## Best Practices

### Chunk Size Guidelines
- **500-800 tokens**: Better precision, more candidates
- **800-1200 tokens**: Balanced (recommended)
- **1200-1500 tokens**: More context, fewer results

### Overlap Guidelines
- **50-75 tokens**: Low overlap, faster
- **100-150 tokens**: Medium (recommended)
- **150-200 tokens**: High overlap, better context

### Strategy Selection
| Content Type | Strategy |
|--------------|----------|
| Structured lessons | Heading-based |
| Blog posts | Semantic similarity |
| Reference docs | Heading-based |
| Mixed content | Fixed-size smart |

## Integration

### With book-content-ingestion
```bash
# Pipeline: ingestion → chunking
/book-content-ingestion --output temp/extracted.json
/semantic-chunking --input temp/extracted.json
```

### With Embedding Generation
```python
chunks = load_chunks("output/semantic-chunks/chunks.jsonl")
embeddings = generate_embeddings(chunks)
upload_to_pinecone(chunks, embeddings)
```

### With RAG Agents
- **textbook-retrieval**: Searches chunks by embedding similarity
- **context-scope-enforcer**: Filters chunks by metadata
- **evidence-validator**: Validates claims against chunks
- **citation-attribution**: Links answers to source chunks

## Quality Validation

Every chunk must pass:
- [ ] Size within min/max limits
- [ ] Contains heading context
- [ ] Has configured overlap with adjacent chunks
- [ ] Code blocks not split
- [ ] Math equations not split
- [ ] Deterministic ID generated

## Performance

- **Parallel processing**: 8 workers by default
- **Caching**: Tokenization results cached
- **Incremental updates**: Only re-chunk changed documents
- **Batch size**: 100 documents per batch

## Evaluation Metrics

Track quality with:
1. **Size distribution** - Consistency of chunk sizes
2. **Context coverage** - % with full heading context
3. **Code integrity** - % with intact code blocks
4. **Overlap consistency** - Variance in overlap sizes
5. **Boundary quality** - % starting at semantic boundaries

## Related Skills

- **book-content-ingestion** - Extracts content for chunking
- **content-writer-module** - Authors content to be chunked

## Next Steps

After chunking:
1. Generate embeddings (OpenAI, Cohere)
2. Upload to vector DB (Pinecone, Weaviate)
3. Validate retrieval with sample queries
4. Analyze performance and iterate

## Version

1.0.0 - Initial release

## See Also

- Full documentation: `skill.md`
- Configuration reference: `config.json`
