# Selected-Text Constraint Examples

Concrete examples showing constraint validation, retrieval restriction, response generation, and refusal messaging.

## Example 1: Valid Selection and Query

### User Interaction
```
User highlights:
"Publishers and Subscribers in ROS 2

ROS 2 uses a publish-subscribe pattern for inter-process communication.
Publishers send messages to topics, and subscribers receive messages from
topics. This pattern decouples the producers and consumers of data."

User asks: "Explain how this pattern works"
```

### Step 1: Selection Validation
```python
validate_selection(selected_text)
```

**Output**:
```json
{
  "valid": true,
  "length": 278,
  "char_count": 278,
  "word_count": 48,
  "normalized": "Publishers and Subscribers in ROS 2\n\nROS 2 uses a publish-subscribe pattern..."
}
```

✓ Valid: 278 chars, well above minimum (50)

### Step 2: Query Validation
```python
validate_query("Explain how this pattern works", selected_text)
```

**Output**:
```json
{
  "valid": true,
  "query_normalized": "explain how this pattern works"
}
```

✓ Valid: 31 chars, not requesting external knowledge

### Step 3: Sufficiency Assessment
```python
assess_selected_text_sufficiency("Explain how this pattern works", selected_text)
```

**Output**:
```json
{
  "sufficient": true,
  "score": 0.72,
  "details": {
    "semantic_similarity": 0.76,
    "term_overlap": 0.68
  }
}
```

✓ Sufficient: Score 0.72 > threshold 0.4

### Step 4: Retrieve from Selection
```python
retrieve_from_selected_text_only("Explain how this pattern works", selected_text)
```

**Output**:
```json
{
  "retrieval_source": "selected_text_only",
  "chunks": [
    {
      "rank": 0,
      "content": "ROS 2 uses a publish-subscribe pattern for inter-process communication.",
      "score": 0.89
    },
    {
      "rank": 1,
      "content": "Publishers send messages to topics, and subscribers receive messages from topics.",
      "score": 0.87
    },
    {
      "rank": 2,
      "content": "This pattern decouples the producers and consumers of data.",
      "score": 0.82
    }
  ],
  "external_retrieval": false
}
```

✓ Only selected text used, no external retrieval

### Step 5: Generate Response
```python
generate_constrained_response(
  "Explain how this pattern works",
  selected_text,
  chunks
)
```

**Generated response**:
```
Based on the highlighted text, the publish-subscribe pattern in ROS 2 works by:

1. **Publishing**: Publishers send messages to topics
2. **Subscribing**: Subscribers receive messages from those same topics
3. **Decoupling**: This pattern separates the producers (publishers) and consumers (subscribers) of data

The key benefit is that publishers and subscribers don't need to know about each other directly - they only communicate through topics. This decoupling is a core feature of ROS 2's inter-process communication system.
```

### Step 6: Scope Validation
```python
validate_response_scope(response, selected_text, query)
```

**Output**:
```json
{
  "valid": true,
  "term_coverage": 0.65,
  "external_citations": 0
}
```

✓ Response valid: No external citations, 65% term coverage

### Final Output
```json
{
  "status": "success",
  "mode": "selected_text_only",
  "query": "Explain how this pattern works",
  "response": "Based on the highlighted text, the publish-subscribe pattern...",
  "constraints_enforced": true,
  "validation_passed": true
}
```

---

## Example 2: Selection Too Short

### User Interaction
```
User highlights:
"Publishers send messages"

User asks: "How does ROS 2 communication work?"
```

### Step 1: Selection Validation
```json
{
  "valid": false,
  "reason": "selection_too_short",
  "length": 24,
  "message": "Selection too short (24 chars). Please select at least 50 characters."
}
```

### Refusal
```json
{
  "status": "refused",
  "reason": "selection_too_short",
  "message": "Your selection is too short to work with.",
  "explanation": "Please select a larger portion of text (at least 50 characters).",
  "action": "Highlight a complete paragraph or several sentences."
}
```

---

## Example 3: Topic Mismatch

### User Interaction
```
User highlights:
"The Jacobian matrix is a fundamental concept in robotics kinematics.
It relates the joint velocities to the end-effector velocities.
The Jacobian can be inverted to solve inverse kinematics problems."

User asks: "What are the key features of ROS 2?"
```

### Step 3: Sufficiency Assessment
```python
assess_selected_text_sufficiency(
  "What are the key features of ROS 2?",
  selected_text_about_jacobian
)
```

**Output**:
```json
{
  "sufficient": false,
  "score": 0.18,
  "reason": "topic_mismatch",
  "details": {
    "semantic_similarity": 0.12,
    "term_overlap": 0.24
  },
  "message": "Your question seems unrelated to the selected text."
}
```

### Refusal
```json
{
  "status": "refused",
  "reason": "topic_mismatch",
  "message": "This question doesn't match the selected text.",
  "explanation": "Your highlighted passage discusses the Jacobian matrix, but your question is about ROS 2 features.",
  "action": "Highlight text about ROS 2 features, or ask a question about the Jacobian."
}
```

---

## Example 4: Query Requests External Knowledge

### User Interaction
```
User highlights:
"ROS 2 is a middleware framework for robotics. It provides tools for
building robot applications with a publish-subscribe communication pattern."

User asks: "How is ROS 2 used in real-world production systems?"
```

### Step 2: Query Validation
```python
validate_query(
  "How is ROS 2 used in real-world production systems?",
  selected_text
)
```

**Pattern Match**: `r"real.*world.*"`

**Output**:
```json
{
  "valid": false,
  "reason": "external_knowledge_requested",
  "message": "This query requires external knowledge beyond the selected text.",
  "suggestion": "Try asking: 'What does this passage explain about ROS 2?' or 'What is ROS 2?'"
}
```

### Refusal
```json
{
  "status": "refused",
  "reason": "external_knowledge_required",
  "message": "This question requires knowledge beyond the selected text.",
  "explanation": "Real-world production usage is not covered in the highlighted passage.",
  "action": "Try asking: 'What tools does ROS 2 provide?' based on what's selected, or select a section about real-world applications."
}
```

---

## Example 5: Constraint Violation Detection

### Scenario
User's question answerable from selection, but LLM tries to add external knowledge.

### Selection
```
"Publishers send messages to topics, and subscribers receive messages
from topics. This decouples producers and consumers."
```

### Generated Response (Before Validation)
```
"According to the highlighted text, publishers send messages to topics
and subscribers receive them. In real-world robotics systems, this is
widely used for distributing sensor data across multiple processes.
Research shows this pattern improves system scalability significantly."
```

### Step 6: Scope Validation
```python
validate_response_scope(response, selected_text, query)
```

**Pattern Matches**:
- "In real-world robotics systems" - external knowledge
- "Research shows" - external citation

**Output**:
```json
{
  "valid": false,
  "reason": "external_knowledge_used",
  "violations": [
    "In real-world robotics systems",
    "Research shows"
  ],
  "message": "Response contains knowledge beyond the selected text"
}
```

### Recovery
Response is rejected and regenerated with stricter constraints:
```
"Based on the highlighted text, publishers send messages to topics
and subscribers receive messages from those topics. The key feature
is that this pattern decouples the producers (publishers) and
consumers (subscribers) of data."
```

✓ Valid: Uses only selected text, no external knowledge

---

## Example 6: Insufficient Context

### User Interaction
```
User highlights:
"The publish-subscribe pattern is used in ROS 2."

User asks: "What are the advantages of this pattern?"
```

### Step 3: Sufficiency Assessment
```json
{
  "sufficient": false,
  "score": 0.35,
  "reason": "insufficient_context",
  "semantic_similarity": 0.42,
  "term_overlap": 0.28,
  "message": "The selected text doesn't contain enough context to answer this question."
}
```

### Refusal
```json
{
  "status": "refused",
  "reason": "insufficient_context",
  "message": "The selected text doesn't contain enough context to answer this question.",
  "explanation": "The advantages of the pub/sub pattern aren't discussed in the highlighted passage.",
  "action": "Try selecting a longer section that explains the benefits, or ask 'What is the publish-subscribe pattern?' based on what you've selected."
}
```

---

## Example 7: No Selection

### User Interaction
```
User doesn't highlight any text

User asks: "What is ROS 2?"
```

### Step 1: Selection Validation
```json
{
  "valid": false,
  "reason": "no_selection",
  "message": "No text selected. Please highlight text to ask questions about."
}
```

### Refusal
```json
{
  "status": "refused",
  "reason": "no_selection",
  "message": "No text was selected.",
  "explanation": "Selected-text-only mode requires highlighting text.",
  "action": "Please highlight the text you want to ask about."
}
```

---

## Example 8: Valid Complex Query

### User Interaction
```
User highlights:
"Publishers and Subscribers

In ROS 2, communication between nodes happens through a publish-subscribe
pattern. A node that wants to send data creates a Publisher for a specific
topic. Other nodes that want to receive that data create Subscribers for
the same topic. The publisher sends messages (data) to the topic, and all
subscribers receive those messages. This pattern is asynchronous - the
publisher doesn't wait for subscribers to receive the message. Multiple
publishers can send to the same topic, and multiple subscribers can receive
from the same topic, making it highly flexible and scalable."

User asks: "What is the relationship between publishers and subscribers in ROS 2?"
```

### Validation Chain

**Selection**: ✓ Valid (356 chars, well-formed)
**Query**: ✓ Valid (not external knowledge)
**Sufficiency**: ✓ Sufficient (0.82 score)

### Retrieval
```json
{
  "chunks": [
    {
      "score": 0.94,
      "content": "In ROS 2, communication between nodes happens through a publish-subscribe pattern."
    },
    {
      "score": 0.91,
      "content": "A node that wants to send data creates a Publisher for a specific topic."
    },
    {
      "score": 0.89,
      "content": "This pattern is asynchronous - the publisher doesn't wait for subscribers to receive the message."
    }
  ]
}
```

### Generated Response
```
According to the selected text, the relationship between publishers and
subscribers in ROS 2 is:

1. **Publishers send, Subscribers receive**: A publisher sends data to a
topic, and subscribers receive that same data from the topic.

2. **Asynchronous communication**: The pattern is asynchronous, meaning
the publisher doesn't wait for subscribers to actually receive the message.

3. **Flexible many-to-many**: Multiple publishers can send to the same
topic, and multiple subscribers can receive from the same topic.

4. **Purpose**: This design makes the system "highly flexible and scalable"
by allowing nodes to communicate without needing direct knowledge of each other.
```

### Validation
```json
{
  "valid": true,
  "term_coverage": 0.78,
  "external_citations": 0
}
```

✓ Success: All constraints satisfied

---

## Example 9: Batch Validation

### Input: queries.jsonl
```jsonl
{"query": "What is this?", "selected": "Publishers send messages..."}
{"query": "How is ROS 2 used?", "selected": "Publishers send..."}
{"query": "Explain", "selected": "Very short text"}
```

### Processing
```python
for item in load_jsonl("queries.jsonl"):
    result = validate_constraints(item['query'], item['selected'])
    save_result(result)
```

### Output
```jsonl
{"query": "What is this?", "status": "success", "mode": "selected_text_only"}
{"query": "How is ROS 2 used?", "status": "refused", "reason": "external_knowledge_requested"}
{"query": "Explain", "status": "refused", "reason": "selection_too_short"}
```

---

## Example 10: Edge Case - Encoding Error

### User Interaction
```
User highlights text with invalid UTF-8 sequences

User asks: "What is this?"
```

### Step 1: Selection Validation
```python
try:
    selected_text.encode('utf-8')
except UnicodeEncodeError:
```

**Output**:
```json
{
  "valid": false,
  "reason": "encoding_error",
  "message": "Selection contains invalid characters."
}
```

### Refusal
```json
{
  "status": "refused",
  "reason": "encoding_error",
  "message": "The selected text contains invalid characters.",
  "explanation": "The text cannot be processed due to encoding issues.",
  "action": "Please try selecting text again, ensuring it's properly formatted."
}
```

---

## Example 11: Validation Metrics

### Monitor Constraint Enforcement
```bash
/selected-text-constraint metrics --period last-day
```

### Output
```json
{
  "period": "last-day",
  "total_validations": 847,
  "successful_answers": 723,
  "refused": 124,
  "refusal_breakdown": {
    "insufficient_context": 67,
    "topic_mismatch": 31,
    "external_knowledge_requested": 18,
    "selection_too_short": 8
  },
  "constraint_violations_detected": 0,
  "avg_validation_time_ms": 52,
  "success_rate": "85.4%"
}
```

---

## Example 12: Boundary Case - Multiple Selections

### Scenario
User selects two separate passages:

```
Selection 1: "Publishers send messages to topics..."
Selection 2: "Services provide request-response communication..."

User asks: "Compare publishers and services"
```

### Constraint Check
```json
{
  "valid": false,
  "reason": "ambiguous_question",
  "message": "Your question requires comparing information across multiple selections.",
  "explanation": "Selected-text-only mode works with a single continuous selection.",
  "action": "Select a section that discusses both topics, or ask about one at a time."
}
```

---

## Example 13: Pre-Refusal Communication

### Processing Flow Visualization

```
┌─────────────────────────────┐
│ User Selection + Query      │
├─────────────────────────────┤
│ Selection Validation        │
│ ✓ PASS                      │
├─────────────────────────────┤
│ Query Validation            │
│ ✗ FAIL: External Knowledge  │
├─────────────────────────────┤
│ Generate Refusal Message    │
└─────────────────────────────┘
        ↓
  [REFUSE - Clear Message]
```

**User sees**:
```
🚫 Cannot answer from selected text only

Your question "How is ROS 2 used in industry?" requires knowledge beyond
the highlighted passage.

Try instead:
  • "What does this passage explain about ROS 2?"
  • "What tools does ROS 2 provide?"

Select a section discussing real-world applications if available.
```

---

These examples demonstrate the selected-text constraint skill's behavior across valid scenarios, refusal cases, edge cases, and error conditions. The skill maintains strict scope enforcement at every validation step.
