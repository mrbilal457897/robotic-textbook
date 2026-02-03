# Book Content Ingestion Skill

A specialized skill for extracting and preparing textbook content from Docusaurus documentation for RAG pipeline ingestion.

## Quick Start

```bash
# Basic usage
/book-content-ingestion

# With specific path
/book-content-ingestion --path docs/week-1

# With custom options
/book-content-ingestion --chunk-size 1200 --include-blog
```

## What It Does

This skill handles the complete workflow for:
- Scanning Docusaurus directory structure
- Extracting content from MDX/MD files
- Parsing frontmatter and metadata
- Preserving heading hierarchy
- Chunking content intelligently
- Generating metadata tags
- Producing RAG-ready output (JSONL format)

## Output

The skill generates:
- `output/rag-ingestion/textbook-chunks.jsonl` - Chunks ready for vector embedding
- `output/rag-ingestion/metadata-index.json` - Complete metadata index
- `output/rag-ingestion/ingestion-report.json` - Validation and statistics

## Configuration

Edit `config.json` to customize:
- Chunk size and overlap
- Content directories to scan
- Metadata extraction rules
- Quality validation checks

## Integration

Prepares content for:
- **Vector embedding**: OpenAI, Cohere, or custom embedding models
- **Vector databases**: Pinecone, Weaviate, Qdrant
- **RAG agents**: `textbook-retrieval`, `evidence-validator`, `response-generator`

## Related Skills

- `content-writer-module` - Creates content that this skill ingests
- See `skill.md` for complete documentation

## Version

1.0.0 - Initial release
