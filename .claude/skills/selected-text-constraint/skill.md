# Selected-Text Constraint Enforcement for RAG

Enforce strict constraints ensuring answers are restricted to user-selected text only. Validates highlighted passages as the sole source of evidence, blocks external retrieval, and provides explicit refusal messaging when context is insufficient.

## Purpose

This skill implements the strictest RAG scope mode: selected-text-only. It ensures:
- Only the highlighted text can be used for answering
- No retrieval from broader textbook context
- No external knowledge sources
- Clear refusal when selected text insufficient
- Bidirectional constraint enforcement (retrieval and generation)

## When to Use

Invoke this skill when:
- **User highlights text**: "Explain this paragraph"
- **Scope enforcement**: Ensuring answer stays within selection
- **Constraint validation**: Verifying no external sources used
- **Refusal messaging**: Communicating why question can't be answered
- **Selected text inadequacy**: Detecting when selection doesn't contain answer
- **Scope boundary testing**: Validating scope enforcement

## Usage

```bash
# Validate selection and restrict retrieval
/selected-text-constraint validate --selected "The IK problem..." --query "explain this"

# Enforce constraint on generation
/selected-text-constraint enforce-generation --response "..." --selected "..."

# Check if selected text contains enough context
/selected-text-constraint assess-sufficiency --query "what is IK?" --selected "The IK problem..."

# Generate refusal message
/selected-text-constraint generate-refusal --reason insufficient_context

# Batch validate selections
/selected-text-constraint batch-validate --input queries.jsonl
```

## Selected-Text Constraint Model

### Constraint Hierarchy

```
┌─────────────────────────────────────────┐
│  User Query + Selected Text             │
├─────────────────────────────────────────┤
│  1. Validate Selection                  │
│     - Is text selected?                 │
│     - Minimum length? (50 chars)        │
│     - Valid encoding?                   │
├─────────────────────────────────────────┤
│  2. Assess Relevance                    │
│     - Is query related to selection?    │
│     - Can selection answer query?       │
├─────────────────────────────────────────┤
│  3. Retrieve from Selection Only        │
│     - Don't query Qdrant                │
│     - Extract from selected text        │
│     - Find exact matches or paraphrases │
├─────────────────────────────────────────┤
│  4. Generate from Selection             │
│     - Only cite selected text           │
│     - No external knowledge             │
│     - Stay within boundaries            │
├─────────────────────────────────────────┤
│  5. Validate Response                   │
│     - All claims in selection?          │
│     - No external citations?            │
│     - Proper scope?                     │
├─────────────────────────────────────────┤
│  6. Refuse if Insufficient              │
│     - Explicit reasoning                │
│     - Suggest alternatives              │
└─────────────────────────────────────────┘
```

## Input Validation

### Selection Validation

```python
def validate_selection(selected_text, min_length=50):
    """Validate selected text for constraint enforcement"""

    # Check if text is provided
    if not selected_text or not isinstance(selected_text, str):
        return {
            "valid": False,
            "reason": "no_selection",
            "message": "No text selected. Please highlight text to ask questions about."
        }

    # Strip whitespace
    selected = selected_text.strip()

    # Check minimum length
    if len(selected) < min_length:
        return {
            "valid": False,
            "reason": "selection_too_short",
            "message": f"Selection too short ({len(selected)} chars). Please select at least {min_length} characters."
        }

    # Check for excessive newlines (likely formatting error)
    if selected.count('\n') > 20:
        return {
            "valid": False,
            "reason": "selection_malformed",
            "message": "Selection appears malformed. Please select contiguous text."
        }

    # Check encoding
    try:
        selected.encode('utf-8')
    except UnicodeEncodeError:
        return {
            "valid": False,
            "reason": "encoding_error",
            "message": "Selection contains invalid characters."
        }

    return {
        "valid": True,
        "length": len(selected),
        "char_count": len(selected),
        "word_count": len(selected.split()),
        "normalized": selected
    }
```

**Validation Criteria**:
- Text present and non-empty
- Minimum 50 characters
- Valid UTF-8 encoding
- Not excessive newlines (< 20)
- Contiguous text

### Query Validation

```python
def validate_query(query, selected_text):
    """Validate query is meaningful and answerable from selection"""

    # Check query length
    if not query or len(query.strip()) < 3:
        return {
            "valid": False,
            "reason": "query_too_short",
            "message": "Query too short. Please ask a specific question."
        }

    # Check query is not just asking for external knowledge
    external_patterns = [
        r"compare.*to.*external",
        r"how is.*used.*in.*industry",
        r"real.*world.*example",
        r"outside.*this"
    ]

    query_lower = query.lower()
    for pattern in external_patterns:
        if re.search(pattern, query_lower):
            return {
                "valid": False,
                "reason": "external_knowledge_requested",
                "message": "This query requires external knowledge beyond the selected text.",
                "suggestion": "Try asking: 'What does this passage explain?' or 'Clarify this concept'"
            }

    return {
        "valid": True,
        "query_normalized": query.strip()
    }
```

## Relevance Assessment

### Selected Text Sufficiency

```python
def assess_selected_text_sufficiency(query, selected_text):
    """Determine if selected text contains enough context for query"""

    # Generate embeddings
    query_embedding = generate_embedding(query)
    selected_embedding = generate_embedding(selected_text)

    # Calculate similarity
    similarity = cosine_similarity(query_embedding, selected_embedding)

    # Check for key terms
    query_terms = set(query.lower().split())
    selected_terms = set(selected_text.lower().split())
    term_overlap = len(query_terms & selected_terms) / len(query_terms)

    # Assess sufficiency
    sufficient_score = 0.5 * similarity + 0.5 * term_overlap

    if sufficient_score < 0.4:
        return {
            "sufficient": False,
            "score": sufficient_score,
            "reason": "insufficient_context",
            "details": {
                "semantic_similarity": similarity,
                "term_overlap": term_overlap
            },
            "message": "The selected text doesn't appear to contain enough context to answer this question."
        }

    if similarity < 0.5 and term_overlap < 0.3:
        return {
            "sufficient": False,
            "score": sufficient_score,
            "reason": "topic_mismatch",
            "message": "Your question seems unrelated to the selected text."
        }

    return {
        "sufficient": True,
        "score": sufficient_score,
        "details": {
            "semantic_similarity": similarity,
            "term_overlap": term_overlap
        }
    }
```

**Sufficiency Criteria**:
- Semantic similarity (embedding): > 0.5
- Term overlap: > 0.3
- Combined score: > 0.4

## Constraint-Aware Retrieval

### Extract from Selection Only

```python
def retrieve_from_selected_text_only(query, selected_text, max_chunks=3):
    """Extract relevant chunks from selected text only"""

    # Split selected text into sentences
    sentences = selected_text.split('.')
    sentences = [s.strip() + '.' for s in sentences if s.strip()]

    # Generate query embedding
    query_embedding = generate_embedding(query)

    # Score each sentence
    scored_sentences = []
    for i, sentence in enumerate(sentences):
        sentence_embedding = generate_embedding(sentence)
        score = cosine_similarity(query_embedding, sentence_embedding)

        scored_sentences.append({
            "rank": i,
            "content": sentence,
            "score": score
        })

    # Sort by score
    scored_sentences.sort(key=lambda x: x['score'], reverse=True)

    # Get top chunks
    chunks = scored_sentences[:max_chunks]

    return {
        "retrieval_source": "selected_text_only",
        "query": query,
        "chunks": chunks,
        "total_candidates": len(sentences),
        "retrieved": len(chunks),
        "scope": "selected_text_only",
        "external_retrieval": False
    }
```

### Block External Retrieval

```python
def validate_no_external_retrieval(retrieval_result):
    """Ensure no external sources were used"""

    if retrieval_result.get('retrieval_source') != 'selected_text_only':
        raise ValueError("External retrieval detected in selected-text-only mode")

    if retrieval_result.get('external_retrieval') == True:
        raise ValueError("External retrieval flag set to True")

    # Verify chunks come from selected text
    for chunk in retrieval_result.get('chunks', []):
        if 'source' in chunk and chunk['source'] != 'selected_text':
            raise ValueError(f"Chunk from unauthorized source: {chunk['source']}")

    return True
```

## Response Generation with Constraints

### Generate Response from Selection

```python
def generate_constrained_response(query, selected_text, chunks):
    """Generate response using only selected text"""

    # Construct prompt
    prompt = f"""Answer the following question using ONLY the provided text.
Do not add external knowledge or examples outside the text.

Text:
{selected_text}

Question: {query}

Requirements:
1. Answer only from the provided text
2. Do not use external knowledge
3. If text doesn't answer the question, say so clearly
4. Cite the relevant parts of the text

Answer:"""

    # Generate response (with constraint-aware LLM settings)
    response = llm_generate(
        prompt=prompt,
        model="gpt-4",
        temperature=0.3,  # Lower temperature for more literal response
        max_tokens=300,
        system_prompt="You are a strict text analyzer. Only use information from the provided text. Refuse to use external knowledge."
    )

    return response
```

### Validate Response Stays in Scope

```python
def validate_response_scope(response, selected_text, query):
    """Validate response doesn't use external knowledge"""

    # Check for external citations
    external_patterns = [
        r"according to.*(?!the text|the passage|above)",
        r"research shows",
        r"studies indicate",
        r"in real world",
        r"in practice",
        r"industry standard",
        r"common knowledge"
    ]

    response_lower = response.lower()
    external_citations = []

    for pattern in external_patterns:
        matches = re.findall(pattern, response_lower)
        if matches:
            external_citations.extend(matches)

    if external_citations:
        return {
            "valid": False,
            "reason": "external_knowledge_used",
            "violations": external_citations,
            "message": "Response contains knowledge beyond the selected text"
        }

    # Verify key terms from selection appear in response
    selected_terms = set(selected_text.lower().split())
    response_terms = set(response.lower().split())

    term_coverage = len(selected_terms & response_terms) / len(selected_terms)

    if term_coverage < 0.2:
        return {
            "valid": False,
            "reason": "insufficient_term_coverage",
            "term_coverage": term_coverage,
            "message": "Response doesn't adequately reference the selected text"
        }

    return {
        "valid": True,
        "term_coverage": term_coverage,
        "external_citations": 0
    }
```

## Refusal Messaging

### Generate Explicit Refusal

```python
def generate_refusal_message(reason, query, selected_text, suggestion=None):
    """Generate clear refusal message explaining why question can't be answered"""

    refusal_templates = {
        "insufficient_context": {
            "message": "The selected text doesn't contain enough context to answer this question.",
            "explanation": "Your question requires information that isn't in the highlighted passage.",
            "action": "Try selecting a larger passage or a different section."
        },
        "topic_mismatch": {
            "message": "This question doesn't match the selected text.",
            "explanation": "Your highlighted passage discusses a different topic than your question.",
            "action": "Highlight text related to your question, or ask a question about what you selected."
        },
        "external_knowledge_required": {
            "message": "This question requires knowledge beyond the selected text.",
            "explanation": "The selected passage alone cannot answer this question without external context.",
            "action": "Try asking: 'What does this passage explain?' or select a longer passage."
        },
        "ambiguous_question": {
            "message": "Your question is unclear or too broad.",
            "explanation": "Please ask a more specific question about the selected text.",
            "action": "Try rephrasing your question to focus on a specific concept."
        },
        "no_selection": {
            "message": "No text was selected.",
            "explanation": "Selected-text-only mode requires highlighting text.",
            "action": "Please highlight the text you want to ask about."
        }
    }

    template = refusal_templates.get(reason, refusal_templates["insufficient_context"])

    refusal = {
        "status": "refused",
        "reason": reason,
        "query": query,
        "message": template["message"],
        "explanation": template["explanation"],
        "action": template["action"]
    }

    if suggestion:
        refusal["suggestion"] = suggestion

    return refusal
```

**Refusal Categories**:
1. **insufficient_context** - Selected text lacks necessary information
2. **topic_mismatch** - Question unrelated to selection
3. **external_knowledge_required** - Needs information beyond selection
4. **ambiguous_question** - Query unclear or too broad
5. **no_selection** - No text highlighted

## Implementation Steps

When invoked, this skill executes:

### Step 1: Validate Selection
```python
validation = validate_selection(selected_text)

if not validation['valid']:
    return generate_refusal_message(
        validation['reason'],
        query,
        selected_text
    )
```

### Step 2: Validate Query
```python
query_validation = validate_query(query, selected_text)

if not query_validation['valid']:
    return generate_refusal_message(
        query_validation['reason'],
        query,
        selected_text,
        suggestion=query_validation.get('suggestion')
    )
```

### Step 3: Assess Sufficiency
```python
sufficiency = assess_selected_text_sufficiency(query, selected_text)

if not sufficiency['sufficient']:
    return generate_refusal_message(
        sufficiency['reason'],
        query,
        selected_text
    )
```

### Step 4: Retrieve from Selection
```python
retrieval = retrieve_from_selected_text_only(query, selected_text)

# Verify no external retrieval
validate_no_external_retrieval(retrieval)
```

### Step 5: Generate Response
```python
response = generate_constrained_response(
    query,
    selected_text,
    retrieval['chunks']
)
```

### Step 6: Validate Response Scope
```python
scope_validation = validate_response_scope(response, selected_text, query)

if not scope_validation['valid']:
    return {
        "status": "error",
        "reason": scope_validation['reason'],
        "message": "Response failed scope validation (bug in LLM constraint)"
    }
```

### Step 7: Return Constrained Response
```python
return {
    "status": "success",
    "mode": "selected_text_only",
    "query": query,
    "selected_text": selected_text[:200],  # Preview
    "response": response,
    "source": "selected_text_only",
    "constraints_enforced": True,
    "retrieval_info": {
        "chunks_used": len(retrieval['chunks']),
        "external_retrieval": False
    }
}
```

## Configuration Options

```json
{
  "validation": {
    "min_selection_length": 50,
    "min_query_length": 3,
    "max_selection_length": 5000,
    "validate_encoding": true,
    "max_newlines": 20
  },
  "sufficiency": {
    "min_semantic_similarity": 0.5,
    "min_term_overlap": 0.3,
    "combined_score_threshold": 0.4,
    "method": "hybrid"
  },
  "retrieval": {
    "source": "selected_text_only",
    "chunk_extraction": "sentence_based",
    "max_chunks": 3,
    "block_external": true,
    "block_qdrant": true
  },
  "generation": {
    "temperature": 0.3,
    "max_tokens": 300,
    "enforce_constraint": true,
    "system_prompt_strict": true
  },
  "validation_after_generation": {
    "enabled": true,
    "check_external_citations": true,
    "check_term_coverage": true,
    "min_term_coverage": 0.2
  },
  "refusal": {
    "detailed_messages": true,
    "include_suggestions": true,
    "include_explanation": true
  }
}
```

## Error Handling

### Constraint Violations

```python
def handle_constraint_violation(violation_type, detail):
    """Handle detected constraint violations"""

    violations = {
        "external_retrieval_attempted": {
            "severity": "critical",
            "message": "Attempted to retrieve from outside selected text",
            "action": "Reject request immediately"
        },
        "response_uses_external_knowledge": {
            "severity": "high",
            "message": "Generated response uses knowledge beyond selection",
            "action": "Regenerate with stricter constraints"
        },
        "insufficient_text_selected": {
            "severity": "medium",
            "message": "Selected text too short or lacks context",
            "action": "Refuse with suggestion to select more text"
        }
    }

    return violations.get(violation_type, {
        "severity": "unknown",
        "message": "Unknown constraint violation"
    })
```

## Best Practices

### User Communication
- Explain why selected text insufficient
- Suggest how to select better text
- Provide alternative queries
- Be clear about scope limitation

### Constraint Enforcement
- Validate at each step (retrieval, generation, validation)
- Use redundant checks
- Fail safely (refuse rather than leak)
- Log all constraint checks

### Selection Quality
- Prefer larger selections (more context)
- Complete thoughts preferred over fragments
- Full paragraphs better than single sentences
- Multiple related sentences stronger

## Integration Points

### With RAG Agents
- **rag-intent-router** - Routes to selected-text-only mode
- **rag-retrieval** - Enforces selected-text-only retrieval
- **response-generator** - Generates constrained responses
- **evidence-validator** - Validates constraints

## Acceptance Criteria

A successful constraint enforcement must:
- [ ] Validate selected text properly (presence, length, encoding)
- [ ] Validate query is meaningful and appropriate
- [ ] Assess if selection sufficient for query
- [ ] Block all external retrieval attempts
- [ ] Generate response using only selected text
- [ ] Validate response stays in scope
- [ ] Refuse clearly when insufficient context
- [ ] Never accidentally use external knowledge
- [ ] Provide helpful suggestions in refusal

## Related Skills and Agents

- **rag-retrieval** - Performs retrieval with constraints
- **response-generator** - Generates responses with constraints
- **rag-intent-router** - Routes to this mode
- **context-scope-enforcer** - Broader scope enforcement

## Next Steps After Constraint Enforcement

1. **Generate constrained response** using validated retrieval
2. **Validate response scope** to ensure no external knowledge
3. **Return response** with scope information
4. **Track constraint violations** for monitoring
5. **Log for quality review** if near boundaries

---

**Note**: This skill focuses exclusively on constraint enforcement. Actual response generation happens in response-generator with these constraints applied.
