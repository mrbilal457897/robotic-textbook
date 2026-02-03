# Book Content Ingestion for RAG

Extract and prepare textbook content from Docusaurus docs, MDX, and blog pages for RAG pipeline ingestion. Preserve document structure, hierarchy, and metadata for optimal retrieval performance.

## Purpose

This skill handles the complete content ingestion workflow for the Physical AI & Humanoid Robotics Interactive Textbook. It:
- Parses Docusaurus documentation structure (docs/, blog/)
- Extracts content from MDX files with React components
- Preserves heading hierarchy and section relationships
- Generates metadata tags for semantic search
- Chunks content intelligently for vector embedding
- Maintains links and cross-references

## When to Use

Invoke this skill when:
- **Initial setup**: First-time ingestion of textbook content into RAG system
- **Content updates**: New chapters, lessons, or blog posts added
- **Structure changes**: Sidebar reorganization, slug changes, or hierarchy updates
- **Metadata refresh**: Updating tags, categories, or learning objectives
- **Testing RAG**: Preparing test datasets for retrieval evaluation
- **Debugging retrieval**: Re-ingesting specific sections after query failures

## Usage

```bash
# Basic invocation
/book-content-ingestion

# With specific paths
/book-content-ingestion --path docs/week-1

# With options
/book-content-ingestion --include-blog --chunk-size 1000
```

## What This Skill Does

### 1. Discovery Phase
- Scan Docusaurus directory structure
- Identify all MDX/MD files in docs/ and blog/
- Parse sidebars.js or sidebars.ts for hierarchy
- Extract routing and slug information

### 2. Content Extraction
For each discovered file:
- **Parse frontmatter**: Extract title, description, tags, sidebar_position, date, authors
- **Extract headings**: Capture h1-h6 hierarchy with IDs
- **Process MDX**: Handle React components, code blocks, admonitions
- **Preserve structure**: Maintain parent-child relationships between sections
- **Extract metadata**:
  - Book/chapter/section relationships
  - Learning objectives
  - Prerequisites
  - Difficulty level
  - Estimated reading time

### 3. Content Chunking
- Split content into semantic chunks (default: 800-1200 tokens)
- Preserve heading context in each chunk
- Maintain code block integrity
- Keep related paragraphs together
- Add overlap between chunks for context continuity

### 4. Metadata Enrichment
For each chunk, generate:
```json
{
  "chunk_id": "uuid",
  "book_id": "physical-ai-textbook",
  "chapter": "Week 1: Introduction to ROS 2",
  "section": "Publishers and Subscribers",
  "subsection": "Creating a Publisher Node",
  "heading_path": ["Week 1", "ROS 2 Basics", "Publishers and Subscribers"],
  "slug": "/docs/week-1/ros2-pubsub",
  "file_path": "docs/week-1/ros2-pubsub.mdx",
  "heading_level": 3,
  "tags": ["ros2", "publisher", "python"],
  "learning_objectives": ["Understand pub/sub pattern", "Implement publisher node"],
  "prerequisites": ["ROS 2 installation", "Python basics"],
  "content_type": "lesson",
  "difficulty": "beginner",
  "reading_time_minutes": 8,
  "last_updated": "2025-01-27",
  "authors": ["Author Name"],
  "contains_code": true,
  "contains_diagram": false,
  "word_count": 450,
  "position_in_doc": 2
}
```

### 5. Output Generation
Produce ingestion-ready formats:
- **JSON Lines**: One chunk per line for bulk upload
- **CSV**: Tabular format for analysis
- **Vector DB format**: Direct integration with Pinecone/Weaviate/Qdrant
- **Validation report**: Statistics and quality checks

## Implementation Steps

When you invoke this skill, follow these steps:

### Step 1: Analyze Docusaurus Structure
```bash
# Read Docusaurus config
Read docusaurus.config.js or docusaurus.config.ts

# Parse sidebar configuration
Read sidebars.js or sidebars.ts

# Identify content directories
List docs/ and blog/ directories
```

### Step 2: Extract Content Files
```bash
# Find all MDX/MD files
Glob pattern: "docs/**/*.{md,mdx}"
Glob pattern: "blog/**/*.{md,mdx}"

# For each file:
- Read file contents
- Parse frontmatter (YAML between --- delimiters)
- Extract markdown/MDX body
- Identify heading structure
```

### Step 3: Parse and Chunk Content
For each content file:
1. **Extract frontmatter metadata**
   ```yaml
   title: "ROS 2 Publishers and Subscribers"
   description: "Learn how to implement pub/sub in ROS 2"
   sidebar_position: 3
   tags: [ros2, publisher, subscriber, python]
   ```

2. **Build heading hierarchy**
   ```
   # Week 1: ROS 2 Basics (h1)
   ## Publishers and Subscribers (h2)
   ### Creating a Publisher (h3)
   ### Creating a Subscriber (h3)
   ```

3. **Chunk content intelligently**
   - Start new chunk at h2/h3 boundaries
   - Keep code blocks intact
   - Preserve admonitions (:::note, :::tip)
   - Add context from parent headings

4. **Generate metadata for each chunk**

### Step 4: Validate and Quality Check
- Ensure all chunks have required metadata
- Check for broken internal links
- Validate heading hierarchy (no skipped levels)
- Confirm chunk sizes are within limits
- Test that code blocks are properly delimited

### Step 5: Export for RAG
Generate output files:
```bash
# JSONL format (one chunk per line)
output/textbook-chunks.jsonl

# Metadata index
output/metadata-index.json

# Validation report
output/ingestion-report.json
```

## Output Format

### Chunk JSONL Format
```jsonl
{"chunk_id":"uuid-1","book_id":"physical-ai-textbook","chapter":"Week 1","section":"ROS 2 Basics","content":"# Publishers and Subscribers\n\nROS 2 uses a publish-subscribe pattern...","metadata":{...}}
{"chunk_id":"uuid-2","book_id":"physical-ai-textbook","chapter":"Week 1","section":"ROS 2 Basics","content":"## Creating a Publisher\n\nTo create a publisher node in ROS 2...","metadata":{...}}
```

### Validation Report Format
```json
{
  "ingestion_timestamp": "2025-01-27T10:30:00Z",
  "total_files_processed": 45,
  "total_chunks_created": 523,
  "total_words": 125000,
  "average_chunk_size": 239,
  "chapters": [
    {
      "chapter": "Week 1",
      "files": 8,
      "chunks": 92,
      "sections": ["Introduction", "ROS 2 Basics", "Gazebo Simulation"]
    }
  ],
  "warnings": [
    "docs/week-2/advanced.mdx: Heading hierarchy skip from h1 to h3"
  ],
  "errors": []
}
```

## Best Practices

### Content Chunking Strategy
- **Heading-based**: Prefer chunking at h2/h3 boundaries
- **Size target**: 800-1200 tokens per chunk (roughly 600-900 words)
- **Context preservation**: Include parent heading in each chunk
- **Code integrity**: Never split code blocks
- **Overlap**: 50-100 token overlap between consecutive chunks

### Metadata Quality
- Always extract from frontmatter first
- Infer missing metadata from file path and structure
- Use consistent taxonomy for tags
- Preserve author and date information
- Link to source file for traceability

### Handling Special Content
- **Code blocks**: Tag language, preserve formatting
- **Math equations**: Preserve LaTeX delimiters
- **Diagrams/images**: Store alt text, link to image
- **Admonitions**: Preserve type (note, tip, warning, danger)
- **Interactive components**: Extract text content, note interactivity

### Performance Optimization
- Process files in parallel when possible
- Cache parsed sidebar structure
- Batch writes to output files
- Validate incrementally, not at the end

## Error Handling

Common issues and resolutions:

1. **Missing frontmatter**: Use file path to infer chapter/section
2. **Invalid MDX syntax**: Log error, skip file, continue processing
3. **Broken internal links**: Log warning, preserve link for manual review
4. **Oversized chunks**: Split at sentence boundaries, maintain context
5. **Duplicate slugs**: Add suffix, log warning

## Integration Points

This skill prepares content for:
- **Vector embedding**: Text chunks ready for OpenAI/Cohere embeddings
- **Pinecone upload**: Metadata matches Pinecone schema
- **RAG retrieval agents**: Proper context for `textbook-retrieval` agent
- **Citation system**: Traceable source references for `citation-attribution` agent

## Example Workflow

```bash
# Step 1: User invokes skill
User: "/book-content-ingestion"

# Step 2: Skill execution
- Scan docusaurus.config.js
- Parse sidebars.js
- Find 45 MDX files in docs/
- Find 12 MDX files in blog/
- Extract content and metadata
- Generate 523 chunks
- Write output/textbook-chunks.jsonl
- Write output/ingestion-report.json

# Step 3: Validation
- All chunks have required metadata ✓
- No broken links ✓
- Heading hierarchy valid ✓
- Chunk sizes within limits ✓

# Step 4: Report
Output: "Successfully ingested 57 files → 523 chunks
         Average chunk size: 239 tokens
         Report: output/ingestion-report.json
         Ready for vector embedding and upload to Pinecone"
```

## Configuration Options

Customize behavior with these options:

```json
{
  "chunk_size_target": 1000,
  "chunk_overlap": 100,
  "max_heading_level": 4,
  "include_blog": true,
  "include_code_blocks": true,
  "extract_learning_objectives": true,
  "output_format": "jsonl",
  "validate_links": true,
  "parallel_processing": true
}
```

## Acceptance Criteria

A successful ingestion run must:
- [ ] Process all MDX/MD files without fatal errors
- [ ] Generate valid JSON/JSONL output
- [ ] Preserve all metadata from frontmatter
- [ ] Maintain heading hierarchy for all chunks
- [ ] Keep chunk sizes within configured limits
- [ ] Include traceability (file path, position) for each chunk
- [ ] Produce validation report with statistics
- [ ] Log warnings for quality issues (broken links, hierarchy problems)
- [ ] Handle special content (code, math, diagrams) correctly

## Related Skills and Agents

- **textbook-retrieval**: Uses ingested chunks for semantic search
- **context-scope-enforcer**: Enforces retrieval boundaries using metadata
- **citation-attribution**: Links generated answers back to source chunks
- **content-writer-module**: Authors content that this skill ingests

## Next Steps After Ingestion

1. **Generate embeddings**: Pass chunks to OpenAI/Cohere embedding API
2. **Upload to vector DB**: Ingest into Pinecone/Weaviate with metadata
3. **Test retrieval**: Run sample queries to validate semantic search
4. **Monitor quality**: Check retrieval accuracy and relevance scores
5. **Iterate**: Re-ingest updated content as textbook evolves

---

**Note**: This skill focuses on extraction and preparation. Vector embedding and database upload are separate steps handled by downstream tools or agents.
