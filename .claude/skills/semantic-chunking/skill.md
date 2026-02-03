# Semantic Chunking for RAG

Intelligently split textbook content into semantically coherent, overlapping chunks optimized for vector embeddings and RAG retrieval. Preserve document structure, maintain context boundaries, and generate deterministic chunk identifiers.

## Purpose

This skill implements advanced semantic chunking algorithms specifically designed for educational content. Unlike simple fixed-size splitting, semantic chunking:
- Respects natural content boundaries (headings, paragraphs, code blocks)
- Preserves hierarchical context (parent sections, learning objectives)
- Creates overlapping chunks for context continuity
- Generates stable, deterministic chunk IDs for versioning
- Optimizes chunk size for embedding model constraints

## When to Use

Invoke this skill when:
- **Preparing for embeddings**: Converting extracted content into embedding-ready chunks
- **Optimizing retrieval**: Improving chunk granularity for better semantic search
- **Re-chunking content**: Adjusting chunk size after retrieval performance analysis
- **Version control**: Regenerating chunks with deterministic IDs after content updates
- **Testing strategies**: Comparing different chunking approaches (heading-based vs. semantic)
- **Debugging retrieval**: Analyzing chunk boundaries causing context loss

## Usage

```bash
# Basic semantic chunking
/semantic-chunking --input extracted-content.json

# With specific strategy
/semantic-chunking --strategy heading-based --target-size 1000

# Custom overlap and context
/semantic-chunking --overlap 150 --preserve-context parent-headings

# Deterministic ID generation
/semantic-chunking --id-strategy content-hash --version v2
```

## Chunking Strategies

### 1. Heading-Based Chunking (Default)
Best for structured educational content with clear hierarchy.

**Algorithm**:
```
For each document:
  1. Parse heading structure (h1-h6)
  2. Identify semantic sections at target heading level (default: h2)
  3. Create chunks at section boundaries
  4. If section exceeds max_size:
     - Split at sub-heading boundaries (h3, h4)
     - If still too large, split at paragraph boundaries
  5. Add parent heading context to each chunk
  6. Create overlap with previous/next chunks
```

**Best for**:
- Lesson pages with clear structure
- Tutorial content with step-by-step sections
- Reference documentation with hierarchical organization

**Example**:
```markdown
# Week 1: ROS 2 Basics                    <- h1 (chapter)
## Publishers and Subscribers             <- h2 (section - chunk boundary)
### Creating a Publisher                  <- h3 (subsection)
Content about publishers...               <- Chunk 1

### Creating a Subscriber                 <- h3 (subsection)
Content about subscribers...              <- Chunk 2

## Services and Actions                   <- h2 (new chunk boundary)
Content about services...                 <- Chunk 3
```

### 2. Semantic Similarity Chunking
Uses sentence embeddings to find natural breakpoints.

**Algorithm**:
```
For each document:
  1. Split into sentences
  2. Generate embeddings for each sentence
  3. Calculate cosine similarity between adjacent sentences
  4. Identify low-similarity boundaries (topic shifts)
  5. Create chunks at semantic breakpoints
  6. Ensure chunks meet min/max size constraints
  7. Add context and overlap
```

**Best for**:
- Blog posts without clear structure
- Narrative content with flowing topics
- Content with weak or inconsistent heading hierarchy

**Trade-offs**:
- More computationally expensive (requires embeddings)
- Better semantic coherence within chunks
- May split in unexpected places for highly structured content

### 3. Paragraph-Based Chunking
Simple, fast, and predictable for uniform content.

**Algorithm**:
```
For each document:
  1. Split at paragraph boundaries (\n\n)
  2. Accumulate paragraphs until target_size reached
  3. Create chunk at paragraph boundary
  4. Add overlap by including last N sentences of previous chunk
```

**Best for**:
- Content with consistent paragraph structure
- Quick prototyping and testing
- Fallback when heading structure is poor

### 4. Fixed-Size Chunking with Smart Boundaries
Hybrid approach: fixed size with intelligent splitting.

**Algorithm**:
```
For each document:
  1. Split into sentences
  2. Accumulate sentences until target_size ± tolerance
  3. Find best boundary within tolerance window:
     - Prefer heading boundaries
     - Then paragraph boundaries
     - Then sentence boundaries
     - Last resort: word boundaries
  4. Create chunk and add overlap
```

**Best for**:
- Enforcing strict size limits (embedding model constraints)
- Balancing semantic coherence with size requirements

## Context Preservation

### Parent Heading Context
Each chunk includes hierarchical context from parent headings.

**Example**:
```markdown
Original document:
# Week 1: ROS 2 Basics
## Publishers and Subscribers
### Creating a Publisher Node
Python code for creating a publisher...

Chunk output:
Context: Week 1: ROS 2 Basics > Publishers and Subscribers > Creating a Publisher Node
Content: Python code for creating a publisher...
```

**Implementation**:
```json
{
  "chunk_id": "abc123",
  "content": "Python code for creating a publisher...",
  "heading_context": [
    "Week 1: ROS 2 Basics",
    "Publishers and Subscribers",
    "Creating a Publisher Node"
  ],
  "parent_section": "Publishers and Subscribers"
}
```

### Chunk Overlap
Adjacent chunks share content to maintain context continuity.

**Overlap Strategies**:
1. **Token-based**: Fixed number of tokens (default: 100)
2. **Sentence-based**: Last N sentences of previous chunk
3. **Semantic**: Include sentences similar to upcoming content

**Example**:
```
Chunk 1: [Sentence 1][Sentence 2][Sentence 3][Sentence 4]
                                    ↓ overlap ↓
Chunk 2:                    [Sentence 3][Sentence 4][Sentence 5][Sentence 6]
```

### Code Block Integrity
Never split code blocks, math equations, or tables.

**Preservation Rules**:
- Code blocks (```...```) treated as atomic units
- If code block exceeds max_size, create dedicated chunk
- Math equations ($...$, $$...$$) kept intact
- Tables and lists treated as single units
- Admonitions (:::note, :::tip) preserved completely

## Deterministic Chunk ID Generation

### Content-Hash Strategy (Recommended)
Generates stable IDs based on content and position.

**Algorithm**:
```python
def generate_chunk_id(content, metadata):
    # Normalize content
    normalized = normalize_whitespace(content.strip())

    # Create stable identifier
    components = [
        metadata.book_id,
        metadata.chapter,
        metadata.section,
        str(metadata.position_in_doc),
        normalized[:200]  # First 200 chars
    ]

    # Generate hash
    combined = "|".join(components)
    chunk_id = sha256(combined).hexdigest()[:16]

    return f"{metadata.book_id}-{chunk_id}"
```

**Properties**:
- Same content + position = same ID
- Content changes = new ID
- Position changes = new ID
- Enables version tracking and diff detection

**Example IDs**:
```
physical-ai-textbook-7f3a9b2c1d4e5f6a
physical-ai-textbook-1e2f3a4b5c6d7e8f
physical-ai-textbook-9a8b7c6d5e4f3a2b
```

### Sequential Strategy
Simple incrementing IDs within document structure.

**Format**: `{book_id}-{chapter_num}-{section_num}-{chunk_num}`

**Example**: `physical-ai-textbook-w1-s2-c003`

**Use when**: Deterministic ordering more important than content-based tracking.

### UUID Strategy
Globally unique IDs without content coupling.

**Format**: Standard UUID v4

**Use when**: Maximum uniqueness required, no need for deterministic generation.

## Implementation Steps

When invoked, this skill executes:

### Step 1: Load and Validate Input
```bash
# Read input content (JSON or MDX files)
Read content files or JSON from book-content-ingestion

# Validate structure
- Check for required fields (content, metadata)
- Verify heading hierarchy
- Identify special content (code, math, tables)
```

### Step 2: Select and Initialize Chunking Strategy
```python
strategy = select_strategy(
    content_type=metadata.content_type,
    structure_quality=metadata.structure_quality,
    target_size=config.target_chunk_size
)

chunker = SemanticChunker(
    strategy=strategy,
    min_size=config.min_chunk_size,
    max_size=config.max_chunk_size,
    overlap=config.chunk_overlap
)
```

### Step 3: Extract Content Structure
```python
# Parse document
document = parse_mdx(content)

# Extract headings
headings = extract_heading_hierarchy(document)

# Identify special content blocks
code_blocks = find_code_blocks(document)
math_blocks = find_math_equations(document)
tables = find_tables(document)

# Mark boundaries
boundaries = identify_chunk_boundaries(
    document,
    headings,
    strategy=strategy
)
```

### Step 4: Create Chunks
```python
chunks = []

for boundary in boundaries:
    # Extract content
    raw_content = extract_content(document, boundary)

    # Add context
    context = build_heading_context(boundary, headings)

    # Add overlap from previous chunk
    if len(chunks) > 0:
        overlap = extract_overlap(chunks[-1], config.chunk_overlap)
        raw_content = overlap + raw_content

    # Generate metadata
    metadata = {
        "heading_context": context,
        "heading_level": boundary.heading_level,
        "position_in_doc": len(chunks) + 1,
        "contains_code": contains_code(raw_content),
        "contains_math": contains_math(raw_content),
        "word_count": count_words(raw_content),
        "token_count": estimate_tokens(raw_content)
    }

    # Generate deterministic ID
    chunk_id = generate_chunk_id(raw_content, metadata)

    # Create chunk
    chunk = {
        "chunk_id": chunk_id,
        "content": raw_content,
        "metadata": metadata
    }

    chunks.append(chunk)
```

### Step 5: Quality Validation
```python
# Validate chunk sizes
for chunk in chunks:
    assert config.min_chunk_size <= chunk.token_count <= config.max_chunk_size

# Check overlap
for i in range(len(chunks) - 1):
    overlap = calculate_overlap(chunks[i], chunks[i+1])
    assert overlap >= config.min_overlap

# Verify special content integrity
for chunk in chunks:
    assert not has_split_code_blocks(chunk)
    assert not has_split_math(chunk)

# Check context preservation
for chunk in chunks:
    assert chunk.metadata.heading_context is not None
```

### Step 6: Generate Output
```python
# Write chunks to JSONL
write_jsonl(chunks, output_path)

# Generate statistics report
stats = {
    "total_chunks": len(chunks),
    "avg_chunk_size": mean([c.token_count for c in chunks]),
    "size_distribution": histogram(chunk_sizes),
    "strategy_used": strategy.name,
    "chunks_with_code": count_chunks_with_code(chunks),
    "total_overlap_tokens": sum_overlap_tokens(chunks)
}

write_json(stats, report_path)
```

## Output Format

### Chunk JSONL
```jsonl
{"chunk_id":"physical-ai-textbook-7f3a9b2c1d4e5f6a","content":"# Publishers and Subscribers\n\nROS 2 uses a publish-subscribe pattern for inter-process communication...","metadata":{"heading_context":["Week 1: ROS 2 Basics","Publishers and Subscribers"],"heading_level":2,"position_in_doc":5,"contains_code":true,"contains_math":false,"word_count":342,"token_count":456,"parent_chunk_id":null,"overlap_with_previous":0,"overlap_with_next":100}}
{"chunk_id":"physical-ai-textbook-1e2f3a4b5c6d7e8f","content":"...overlap content...\n\n## Creating a Publisher Node\n\nTo create a publisher node in Python...","metadata":{"heading_context":["Week 1: ROS 2 Basics","Publishers and Subscribers","Creating a Publisher Node"],"heading_level":3,"position_in_doc":6,"contains_code":true,"contains_math":false,"word_count":298,"token_count":412,"parent_chunk_id":"physical-ai-textbook-7f3a9b2c1d4e5f6a","overlap_with_previous":100,"overlap_with_next":100}}
```

### Statistics Report
```json
{
  "chunking_run_id": "run-20250127-103045",
  "strategy": "heading-based",
  "total_documents": 45,
  "total_chunks": 523,
  "chunk_size_statistics": {
    "min": 412,
    "max": 1498,
    "mean": 987,
    "median": 945,
    "std_dev": 203,
    "p95": 1342
  },
  "size_distribution": {
    "400-600": 78,
    "600-800": 145,
    "800-1000": 178,
    "1000-1200": 98,
    "1200-1400": 22,
    "1400-1500": 2
  },
  "content_analysis": {
    "chunks_with_code": 234,
    "chunks_with_math": 12,
    "chunks_with_diagrams": 45,
    "chunks_with_tables": 18
  },
  "overlap_statistics": {
    "total_overlap_tokens": 51700,
    "avg_overlap_per_chunk": 100,
    "overlap_percentage": 10.2
  },
  "quality_checks": {
    "no_split_code_blocks": true,
    "no_split_math": true,
    "all_have_context": true,
    "size_constraints_met": true
  },
  "heading_level_distribution": {
    "h1": 45,
    "h2": 156,
    "h3": 234,
    "h4": 88
  }
}
```

## Configuration Options

```json
{
  "chunking_strategy": "heading-based",
  "target_chunk_size": 1000,
  "min_chunk_size": 600,
  "max_chunk_size": 1500,
  "chunk_overlap": 100,
  "overlap_strategy": "token-based",

  "heading_based_config": {
    "primary_split_level": 2,
    "secondary_split_level": 3,
    "include_parent_context": true,
    "max_heading_levels": 4
  },

  "semantic_similarity_config": {
    "similarity_threshold": 0.7,
    "embedding_model": "text-embedding-3-small",
    "min_sentences_per_chunk": 3
  },

  "context_preservation": {
    "include_heading_path": true,
    "include_parent_section": true,
    "preserve_code_blocks": true,
    "preserve_math_blocks": true,
    "preserve_tables": true,
    "preserve_admonitions": true
  },

  "id_generation": {
    "strategy": "content-hash",
    "hash_algorithm": "sha256",
    "id_length": 16,
    "include_version": true,
    "version": "v2"
  },

  "quality_validation": {
    "enforce_size_limits": true,
    "verify_overlap": true,
    "check_code_integrity": true,
    "validate_context": true,
    "allow_undersized_final_chunks": true
  },

  "output": {
    "format": "jsonl",
    "include_statistics": true,
    "generate_visualization": false,
    "output_directory": "output/semantic-chunks"
  }
}
```

## Advanced Features

### Adaptive Chunking
Automatically adjusts chunk size based on content density.

**Use case**: Dense technical content (lots of code) gets smaller chunks; narrative content gets larger chunks.

```python
def adaptive_chunk_size(content_analysis):
    base_size = 1000

    # Reduce size for code-heavy sections
    if content_analysis.code_percentage > 0.5:
        base_size *= 0.7

    # Increase size for narrative content
    if content_analysis.narrative_percentage > 0.8:
        base_size *= 1.3

    # Reduce size for complex math
    if content_analysis.math_equation_count > 3:
        base_size *= 0.8

    return clamp(base_size, min_size, max_size)
```

### Multi-Level Chunking
Creates chunks at multiple granularities for hierarchical retrieval.

**Output**:
```json
{
  "chunk_id": "abc123",
  "chunk_level": "section",
  "content": "...",
  "child_chunks": ["abc123-1", "abc123-2", "abc123-3"],
  "parent_chunk": "abc000"
}
```

**Use case**: First retrieve section-level chunks, then drill down to paragraph-level if needed.

### Content-Aware Overlap
Adjusts overlap based on semantic similarity between adjacent chunks.

**Algorithm**:
- High similarity → less overlap needed (topics are continuous)
- Low similarity → more overlap needed (topic shift, context crucial)

### Chunk Versioning
Tracks chunk changes across content updates.

```json
{
  "chunk_id": "physical-ai-textbook-7f3a9b2c1d4e5f6a",
  "version": "v2",
  "previous_version_id": "physical-ai-textbook-7f3a9b2c1d4e5f6a-v1",
  "content_changed": true,
  "position_changed": false,
  "last_updated": "2025-01-27T10:30:00Z"
}
```

## Best Practices

### Choosing Chunk Size
- **Smaller chunks (500-800 tokens)**: Better precision, more retrieval candidates
- **Medium chunks (800-1200 tokens)**: Balanced precision and context
- **Larger chunks (1200-1500 tokens)**: More context, fewer but richer results

**Recommendation**: Start with 1000 tokens, adjust based on retrieval performance.

### Overlap Configuration
- **Low overlap (50-75 tokens)**: Faster processing, less redundancy
- **Medium overlap (100-150 tokens)**: Balanced context continuity
- **High overlap (150-200 tokens)**: Maximum context, higher storage cost

**Recommendation**: 100 tokens (10% of chunk size) for educational content.

### Strategy Selection
| Content Type | Recommended Strategy | Rationale |
|--------------|---------------------|-----------|
| Structured lessons | Heading-based | Clear hierarchy, predictable boundaries |
| Blog posts | Semantic similarity | Narrative flow, topic transitions |
| Reference docs | Heading-based | Hierarchical organization |
| Tutorials | Heading-based | Step-by-step structure |
| Mixed content | Fixed-size smart | Consistent sizing, flexible boundaries |

### ID Generation
- Use **content-hash** for production (enables versioning, change detection)
- Use **sequential** for testing (human-readable, easy debugging)
- Use **UUID** when migrating from existing systems

## Error Handling

Common issues and resolutions:

| Issue | Detection | Resolution |
|-------|-----------|------------|
| Oversized chunk | token_count > max_size | Split at next available boundary |
| Undersized chunk | token_count < min_size | Merge with previous/next chunk |
| Split code block | Code fence spans boundary | Move boundary before code block |
| Split math equation | $ or $$ spans boundary | Move boundary before equation |
| Missing heading context | heading_context is null | Infer from file path/structure |
| Zero overlap | Adjacent chunks share no tokens | Force minimum overlap (50 tokens) |
| Duplicate chunk ID | Hash collision | Append position suffix |

## Performance Optimization

### Parallel Processing
Process documents in parallel when chunking multiple files.

```python
from concurrent.futures import ProcessPoolExecutor

with ProcessPoolExecutor(max_workers=8) as executor:
    chunk_results = executor.map(chunk_document, documents)
```

### Caching
Cache tokenization and embedding results to avoid recomputation.

```python
@lru_cache(maxsize=10000)
def tokenize(text):
    return tokenizer.encode(text)
```

### Incremental Updates
Only re-chunk documents that changed since last run.

```python
if document.last_modified > last_chunking_run:
    rechunk(document)
else:
    reuse_existing_chunks(document)
```

## Integration Points

### With book-content-ingestion Skill
```bash
# Pipeline: ingestion → semantic chunking
/book-content-ingestion --output temp/extracted.json
/semantic-chunking --input temp/extracted.json --strategy heading-based
```

### With Embedding Generation
```python
chunks = load_chunks("output/semantic-chunks/chunks.jsonl")

for chunk in chunks:
    embedding = openai.embeddings.create(
        model="text-embedding-3-small",
        input=chunk.content
    )
    chunk.embedding = embedding.data[0].embedding

upload_to_pinecone(chunks)
```

### With RAG Agents
- **textbook-retrieval**: Searches semantic chunks by embedding similarity
- **context-scope-enforcer**: Filters chunks by heading_context metadata
- **evidence-validator**: Validates claims against chunk content
- **citation-attribution**: Links to source chunks via chunk_id

## Acceptance Criteria

A successful chunking run must:
- [ ] Process all input documents without fatal errors
- [ ] Generate chunks within configured size limits (min/max)
- [ ] Preserve all code blocks, math equations, and tables intact
- [ ] Include heading context for every chunk
- [ ] Create configured overlap between adjacent chunks
- [ ] Generate deterministic IDs for all chunks
- [ ] Produce valid JSONL output
- [ ] Generate statistics report with size distribution
- [ ] Pass quality validation (no split code, proper context, size constraints)
- [ ] Handle edge cases (very short/long documents, missing headings)

## Evaluation Metrics

Track chunking quality with these metrics:

1. **Size Distribution**: σ (std dev) of chunk sizes - lower is more consistent
2. **Context Coverage**: % of chunks with full heading context - target 100%
3. **Code Integrity**: % of chunks with intact code blocks - must be 100%
4. **Overlap Consistency**: Variance in overlap sizes - lower is better
5. **Boundary Quality**: % of chunks starting at semantic boundaries - higher is better

## Related Skills and Agents

- **book-content-ingestion**: Extracts content that this skill chunks
- **textbook-retrieval**: Retrieves chunks created by this skill
- **content-writer-module**: Authors content that gets chunked
- **evidence-validator**: Validates against chunk content

## Next Steps After Chunking

1. **Generate embeddings**: Pass chunks to embedding model (OpenAI, Cohere)
2. **Upload to vector DB**: Store chunks with embeddings in Pinecone/Weaviate
3. **Validate retrieval**: Test semantic search with sample queries
4. **Analyze performance**: Check retrieval precision and context quality
5. **Iterate**: Adjust chunk size, overlap, or strategy based on results

---

**Note**: This skill focuses exclusively on chunking algorithm and chunk generation. Embedding generation and vector database upload are separate downstream steps.
