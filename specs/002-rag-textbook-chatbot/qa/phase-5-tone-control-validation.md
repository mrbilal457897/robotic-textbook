# Phase 5: Tone Control Validation Guide

**User Story 3**: Interactive Chat with Tone Control
**Tasks**: T114-T116 (Manual QA)
**Purpose**: Validate that tone control works correctly while maintaining citation accuracy

---

## Prerequisites

1. **Backend running**: `uvicorn src.main:app --reload --host 0.0.0.0 --port 8000` (from `backend/`)
2. **Frontend running**: `npm run dev` (from `frontend/`)
3. **Textbook content ingested**: At least one book in Qdrant vector database
4. **Browser**: Chrome/Firefox with DevTools open for network inspection

---

## T114: Manual QA - Compare 20 Questions Across All 3 Tones

### Objective
Verify that all three tones (Academic, Beginner-friendly, Concise) produce distinct responses with observable linguistic differences.

### Test Questions

Use these 20 questions across all three tones (60 total tests):

#### Category 1: Definitions (5 questions)
1. What is ROS 2?
2. What is a digital twin?
3. What are neural networks?
4. What is NVIDIA Isaac Sim?
5. What are Vision-Language-Action models?

#### Category 2: Explanations (5 questions)
6. How does backpropagation work?
7. How do digital twins simulate real-world systems?
8. How does ROS 2 communicate between nodes?
9. How does Isaac Sim handle physics simulation?
10. How do VLA models connect vision to action?

#### Category 3: Comparisons (5 questions)
11. What's the difference between ROS 1 and ROS 2?
12. Compare supervised and unsupervised learning.
13. Compare Gazebo and Isaac Sim.
14. What's the difference between simulation and emulation?
15. Compare transformers and CNNs.

#### Category 4: Examples (5 questions)
16. Give an example of a ROS 2 publisher node.
17. Provide an example of a digital twin application.
18. Show an example of a neural network architecture.
19. Give an example of Isaac Sim use case.
20. Provide an example of a VLA model in robotics.

### Test Procedure

For **each question** (20 total):

1. **Set tone to Academic**:
   - Click Settings icon in ChatPanel
   - Select "Academic" from Response Tone dropdown
   - Submit the question
   - **Record response** in validation spreadsheet (see template below)

2. **Set tone to Beginner-friendly**:
   - Change tone to "Beginner"
   - Submit the **same question**
   - **Record response**

3. **Set tone to Concise**:
   - Change tone to "Concise"
   - Submit the **same question**
   - **Record response**

### Expected Outcomes

| Tone | Expected Characteristics | Example Indicators |
|------|--------------------------|-------------------|
| **Academic** | Formal language, technical terminology, detailed explanations, assumes prior knowledge | "constitutes", "hierarchical", "architectural", "propagation algorithm" |
| **Beginner-friendly** | Simple language, analogies, explanations of jargon, assumes no prior knowledge | "think of it like...", "imagine...", "in simple terms...", "basically" |
| **Concise** | Brief (2-3 sentences), direct, no elaboration unless requested | Short answers, bullet points, no analogies, factual only |

### Validation Checklist

For **each tone**, verify:

- [ ] Response matches expected characteristics
- [ ] Language complexity appropriate for tone
- [ ] Technical terms used (Academic) vs. explained (Beginner) vs. minimal (Concise)
- [ ] Response length: Long (Academic) > Medium (Beginner) > Short (Concise)
- [ ] Analogies present only in Beginner-friendly tone
- [ ] Formal vocabulary in Academic tone
- [ ] Direct, no-fluff answers in Concise tone

### Acceptance Criteria

✅ **PASS** if:
- At least **18/20 questions** (90%) show clear tone differentiation
- Academic responses use technical terminology consistently
- Beginner-friendly responses include analogies or simplified explanations
- Concise responses are ≤ 3 sentences for most questions

❌ **FAIL** if:
- Tone differences are not observable (responses look identical across tones)
- Academic tone uses oversimplified language
- Beginner-friendly tone uses unexplained jargon
- Concise tone produces lengthy responses

---

## T115: Verify Citation Accuracy Identical Across Tones

### Objective
Ensure that changing the tone does NOT affect which sources are cited. The same query should reference the same chunks regardless of tone.

### Test Procedure

Select **5 questions from T114** that produced citations in all three tones:

For **each question**:

1. **Record citations for Academic tone**:
   - Note the citation IDs (e.g., `[intro-ai_chunk_00042]`)
   - Count number of citations
   - Record book/chapter/page references

2. **Record citations for Beginner-friendly tone**:
   - Note the citation IDs
   - Count number of citations
   - Record book/chapter/page references

3. **Record citations for Concise tone**:
   - Note the citation IDs
   - Count number of citations
   - Record book/chapter/page references

4. **Compare**:
   - Extract citation IDs from all three responses
   - Verify citation IDs are **identical** (same chunks referenced)
   - Verify citation count is **identical**
   - Verify book/chapter/page metadata is **identical**

### Example

**Question**: "What are neural networks?"

**Academic Response**:
> Neural networks constitute computational architectures inspired by biological neural systems [intro-ai_chunk_00042]. These models employ hierarchical layers [intro-ai_chunk_00043] to process information.

**Beginner-friendly Response**:
> Think of neural networks like your brain! They're computer programs that learn from examples [intro-ai_chunk_00042], using connected layers [intro-ai_chunk_00043] similar to neurons.

**Concise Response**:
> Neural networks are computational models with layered nodes [intro-ai_chunk_00042] [intro-ai_chunk_00043].

**Citation Comparison**:
| Tone | Citation IDs | Count | Match? |
|------|--------------|-------|--------|
| Academic | `[intro-ai_chunk_00042]`, `[intro-ai_chunk_00043]` | 2 | ✅ |
| Beginner | `[intro-ai_chunk_00042]`, `[intro-ai_chunk_00043]` | 2 | ✅ |
| Concise | `[intro-ai_chunk_00042]`, `[intro-ai_chunk_00043]` | 2 | ✅ |

**Result**: ✅ **PASS** (citations identical across tones)

### Acceptance Criteria

✅ **PASS** if:
- **100% of tested questions** (5/5) have identical citation IDs across all three tones
- Citation counts match exactly
- Book/chapter/page metadata matches exactly

❌ **FAIL** if:
- Any question produces different citation IDs across tones
- Citation counts differ across tones
- Metadata mismatches detected

---

## T116: Verify Tone Observable in Responses (Linguistic Analysis)

### Objective
Perform linguistic analysis to quantitatively verify that tone differences are measurable and statistically significant.

### Metrics to Measure

For **each tone** (using the 20 responses from T114):

1. **Average Response Length**
   - Word count per response
   - Sentence count per response
   - Average sentence length

2. **Vocabulary Complexity**
   - Technical term frequency (manual count)
   - Syllable count per word (average)
   - Use of jargon without explanation

3. **Linguistic Patterns**
   - Analogy count ("like", "similar to", "think of", "imagine")
   - Formal connectors ("furthermore", "consequently", "thus")
   - Informal language ("basically", "simply", "just")

### Test Procedure

1. **Export all 60 responses** (20 questions × 3 tones) to a spreadsheet

2. **Calculate metrics**:

   **Academic Tone (Expected)**:
   - Average word count: **80-150 words/response**
   - Technical terms per response: **5-10**
   - Analogy count: **0**
   - Formal connectors: **3-5**

   **Beginner-friendly Tone (Expected)**:
   - Average word count: **60-100 words/response**
   - Technical terms per response: **2-4** (with explanations)
   - Analogy count: **2-4**
   - Informal language: **3-5 instances**

   **Concise Tone (Expected)**:
   - Average word count: **30-60 words/response**
   - Sentences per response: **≤ 3**
   - Technical terms: **Minimal** (only essential)
   - No analogies or elaborations

3. **Statistical Comparison**:
   - Calculate mean and standard deviation for each metric
   - Compare means across tones
   - Verify distributions are distinct

### Example Analysis

| Metric | Academic | Beginner | Concise | Pass? |
|--------|----------|----------|---------|-------|
| Avg Word Count | 120 | 80 | 45 | ✅ (distinct) |
| Avg Sentence Count | 6 | 4 | 2.5 | ✅ (descending) |
| Technical Terms | 7 | 3 | 1 | ✅ (descending) |
| Analogy Count | 0 | 3 | 0 | ✅ (beginner only) |
| Formal Connectors | 4 | 1 | 0 | ✅ (academic only) |

**Result**: ✅ **PASS** (all metrics show clear tone differentiation)

### Acceptance Criteria

✅ **PASS** if:
- Academic responses are **≥ 1.5x longer** than Concise responses (on average)
- Beginner-friendly responses contain **≥ 2 analogies per 20 responses**
- Concise responses are **≤ 3 sentences** for 90% of questions
- Technical term density: Academic > Beginner > Concise

❌ **FAIL** if:
- Response lengths overlap significantly (no clear distinction)
- Beginner-friendly responses lack analogies
- Concise responses exceed 3 sentences frequently (> 10% of responses)
- No measurable difference in vocabulary complexity

---

## Validation Report Template

After completing T114-T116, document results in:
`specs/002-rag-textbook-chatbot/qa/phase-5-validation-report.md`

### Template

```markdown
# Phase 5: Tone Control Validation Report

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: [Dev/Staging/Production]
**Backend Version**: [commit hash]
**Frontend Version**: [commit hash]

---

## T114: 20-Question Comparison

**Questions Tested**: 20
**Tones Tested**: 3 (Academic, Beginner-friendly, Concise)
**Total Tests**: 60

**Results**:
- Questions with clear tone differentiation: __/20 (___%)
- Academic responses met criteria: __/20 (___%)
- Beginner-friendly responses met criteria: __/20 (___%)
- Concise responses met criteria: __/20 (___%)

**Status**: ✅ PASS / ❌ FAIL

**Notes**:
[Add observations, edge cases, or issues]

---

## T115: Citation Accuracy

**Questions Tested**: 5
**Tones Compared**: 3

**Results**:
| Question | Citation IDs Match? | Citation Count Match? | Metadata Match? | Result |
|----------|---------------------|----------------------|-----------------|--------|
| Q1 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Q2 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Q3 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Q4 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Q5 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |

**Citation Accuracy**: __/5 (___%)

**Status**: ✅ PASS / ❌ FAIL

**Notes**:
[Add observations]

---

## T116: Linguistic Analysis

**Responses Analyzed**: 60 (20 questions × 3 tones)

**Metrics**:

| Metric | Academic | Beginner | Concise | Distinct? |
|--------|----------|----------|---------|-----------|
| Avg Word Count | ___ | ___ | ___ | ✅/❌ |
| Avg Sentence Count | ___ | ___ | ___ | ✅/❌ |
| Technical Terms (avg) | ___ | ___ | ___ | ✅/❌ |
| Analogy Count (total) | ___ | ___ | ___ | ✅/❌ |
| Formal Connectors (avg) | ___ | ___ | ___ | ✅/❌ |

**Status**: ✅ PASS / ❌ FAIL

**Notes**:
[Add statistical observations, outliers, patterns]

---

## Overall Phase 5 Status

**T114**: ✅ PASS / ❌ FAIL
**T115**: ✅ PASS / ❌ FAIL
**T116**: ✅ PASS / ❌ FAIL

**Overall**: ✅ PASS / ❌ FAIL

**Recommendations**:
[Any improvements or follow-up work needed]

---

**Approved By**: ___________
**Date**: ___________
```

---

## Quick Smoke Test (5 minutes)

Before full validation, run this quick test to ensure tone control is working:

1. Open ChatPanel
2. Click Settings icon
3. Select "Academic" tone
4. Ask: "What is ROS 2?"
5. Verify response uses formal language
6. Select "Beginner" tone
7. Ask: "What is ROS 2?"
8. Verify response uses simple language or analogy
9. Select "Concise" tone
10. Ask: "What is ROS 2?"
11. Verify response is ≤ 3 sentences

✅ **Quick Test Passed** → Proceed with full validation
❌ **Quick Test Failed** → Debug tone implementation before full validation

---

**Last Updated**: 2026-02-03
**Version**: 1.0
