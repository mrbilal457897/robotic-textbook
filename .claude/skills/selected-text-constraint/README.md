# Selected-Text Constraint Enforcement Skill

Enforce strict constraints ensuring answers are restricted to user-selected text only. Validates highlighted passages as the sole evidence source, blocks external retrieval, and provides clear refusal when context is insufficient.

## Quick Start

```bash
# Validate and constrain to selection
/selected-text-constraint validate --selected "The IK problem..." --query "explain this"

# Enforce constraints on generated response
/selected-text-constraint enforce-generation --response "..." --selected "..."

# Check if selection sufficient for query
/selected-text-constraint assess-sufficiency --query "what is IK?" --selected "..."

# Generate refusal message
/selected-text-constraint generate-refusal --reason insufficient_context

# Batch validate selections
/selected-text-constraint batch-validate --input queries.jsonl
```

## What It Does

This skill implements the strictest RAG scope mode: selected-text-only.

- **Validates selection** - Checks text is selected, long enough, properly formatted
- **Validates query** - Ensures query is meaningful and doesn't require external knowledge
- **Assesses sufficiency** - Determines if selection contains enough context
- **Blocks external retrieval** - Prevents Qdrant or other external sources
- **Extracts from selection** - Retrieves only from highlighted text
- **Generates constrained responses** - Uses only selected text
- **Validates scope** - Ensures response doesn't leak external knowledge
- **Refuses clearly** - Explains why question can't be answered

## Scope Mode Comparison

| Aspect | Book-Only | Selected-Text-Only | General |
|--------|-----------|-------------------|---------|
| Textbook access | ✓ Full | ✗ Only selected | ✓ Full |
| External knowledge | ✗ No | ✗ No | ✓ Yes |
| Retrieval scope | Entire book | Highlighted text | Entire book |
| Score threshold | 0.7 | 0.75 | 0.5 |
| Strictness | Strict | **Strictest** | Flexible |

## Constraint Validation Steps

### Step 1: Selection Validation
```json
{
  "valid": true,
  "length": 245,
  "word_count": 42,
  "char_count": 245
}
```

**Checks**:
- Text selected (not empty)
- Minimum 50 characters
- Maximum 5000 characters
- Valid UTF-8 encoding
- Not excessive newlines (< 20)

### Step 2: Query Validation
```json
{
  "valid": true,
  "query_normalized": "explain this concept"
}
```

**Checks**:
- Query has minimum 3 characters
- Not requesting external knowledge
- Meaningful question

### Step 3: Sufficiency Assessment
```json
{
  "sufficient": true,
  "score": 0.65,
  "semantic_similarity": 0.68,
  "term_overlap": 0.62
}
```

**Checks**:
- Semantic similarity > 0.5
- Term overlap > 0.3
- Combined score > 0.4

### Step 4: Constrained Retrieval
Only extract from selected text:
```json
{
  "source": "selected_text_only",
  "external_retrieval": false,
  "chunks": [
    {"content": "...", "score": 0.89},
    {"content": "...", "score": 0.76}
  ]
}
```

### Step 5: Generate Response
Generate using only selected text:
```json
{
  "response": "Based on the selected text, ...",
  "scope": "selected_text_only",
  "constraints_enforced": true
}
```

### Step 6: Scope Validation
Verify response doesn't leak external knowledge:
```json
{
  "valid": true,
  "external_citations": 0,
  "term_coverage": 0.65
}
```

## Refusal Messaging

When constraints prevent answering, generate clear refusals:

### Insufficient Context
```json
{
  "status": "refused",
  "reason": "insufficient_context",
  "message": "The selected text doesn't contain enough context to answer this question.",
  "explanation": "Your question requires information that isn't in the highlighted passage.",
  "action": "Try selecting a larger passage or a different section."
}
```

### Topic Mismatch
```json
{
  "status": "refused",
  "reason": "topic_mismatch",
  "message": "This question doesn't match the selected text.",
  "explanation": "Your highlighted passage discusses a different topic than your question.",
  "action": "Highlight text related to your question, or ask a question about what you selected."
}
```

### External Knowledge Required
```json
{
  "status": "refused",
  "reason": "external_knowledge_required",
  "message": "This question requires knowledge beyond the selected text.",
  "action": "Try asking: 'What does this passage explain?' or select a longer passage."
}
```

## Configuration

Edit `config.json`:

```json
{
  "selection_validation": {
    "min_length": 50,
    "max_length": 5000
  },
  "sufficiency_assessment": {
    "min_semantic_similarity": 0.5,
    "min_term_overlap": 0.3
  },
  "generation": {
    "temperature": 0.3
  },
  "constraints_enforcement": {
    "fail_safe": true,
    "strict_mode": true
  }
}
```

## Error Scenarios

### No Selection
```json
{
  "valid": false,
  "reason": "no_selection",
  "message": "No text selected. Please highlight text to ask questions about."
}
```

### Selection Too Short
```json
{
  "valid": false,
  "reason": "selection_too_short",
  "message": "Selection too short (23 chars). Please select at least 50 characters."
}
```

### Selection Too Long
```json
{
  "valid": false,
  "reason": "selection_too_long",
  "message": "Selection too long (6234 chars). Please select at most 5000 characters."
}
```

### Query Requests External Knowledge
```json
{
  "valid": false,
  "reason": "external_knowledge_requested",
  "message": "This query requires external knowledge beyond the selected text.",
  "suggestion": "Try asking: 'What does this passage explain?' or 'Clarify this concept'"
}
```

### Insufficient Semantic Overlap
```json
{
  "sufficient": false,
  "reason": "insufficient_context",
  "semantic_similarity": 0.34,
  "term_overlap": 0.12,
  "message": "The selected text doesn't appear to contain enough context to answer this question."
}
```

## Integration

### Complete Selected-Text Workflow
```bash
# 1. User highlights text in UI
Selected: "Publishers send messages to topics..."

# 2. User asks question
Query: "Explain how this works"

# 3. Validate constraints
/selected-text-constraint validate --selected "..." --query "..."

# 4. Retrieve from selection only
/rag-retrieval query "..." --mode selected-text-only --selected "..."

# 5. Generate constrained response
/response-generator generate --mode selected-text-only --selected "..." --chunks [...]

# 6. Respond to user
Response: "Based on the highlighted text, publishers send..."
```

### With RAG Agents
- **rag-intent-router** - Routes to selected-text-only mode
- **rag-retrieval** - Enforces retrieval constraints
- **response-generator** - Enforces generation constraints
- **context-scope-enforcer** - Broader scope validation
- **evidence-validator** - Validates evidence from selection

## Best Practices

### User Selection
- Prefer larger selections (more context)
- Complete thoughts preferred
- Full paragraphs > single sentences
- Multiple related sentences strengthen context

### Query Formulation
- Specific questions work better
- "Explain this" better than "Tell me about"
- Reference concepts from selection
- Avoid opinion-based questions

### Constraint Enforcement
- Validate at each step (retrieval, generation, validation)
- Use redundant checks
- Fail safely (refuse rather than leak)
- Log all violations

### Refusal Communication
- Explain why insufficient
- Suggest how to select better
- Provide alternative queries
- Be clear about scope

## Validation Checklist

The skill ensures:
- [ ] Selection is valid (present, right length, encoding)
- [ ] Query is valid (meaningful, not external)
- [ ] Selection sufficient for query
- [ ] No external retrieval attempted
- [ ] Response uses only selected text
- [ ] No external knowledge leaked
- [ ] Refusal clear when needed

## Performance

Typical metrics:
- **Selection validation**: < 5ms
- **Query validation**: < 5ms
- **Sufficiency assessment**: 30-50ms (includes embeddings)
- **Constraint check**: < 10ms
- **Total**: ~50-70ms

## Monitoring

Track constraint metrics:
```bash
/selected-text-constraint metrics --period last-hour
```

Output:
```json
{
  "total_validations": 145,
  "successful": 128,
  "refused": 17,
  "refusal_reasons": {
    "insufficient_context": 12,
    "topic_mismatch": 3,
    "external_knowledge": 2
  },
  "constraint_violations": 0,
  "avg_validation_time_ms": 58
}
```

## Related Skills

- **rag-retrieval** - Performs constrained retrieval
- **response-generator** - Generates constrained responses
- **rag-intent-router** - Routes to this mode
- **context-scope-enforcer** - Broader scope validation

## Version

1.0.0 - Initial release

## See Also

- Full documentation: `skill.md`
- Configuration reference: `config.json`
- Concrete examples: `examples.md`
