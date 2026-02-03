---
id: 0026
title: Establish RAG-Chatbot Constitution
stage: constitution
date: 2026-01-28
surface: agent
model: claude-haiku-4-5-20251001
feature: rag-chatbot
branch: 001-physical-ai-textbook
user: system
command: /sp.constitution
labels: ["rag","constitution","governance","architecture"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution-rag-chatbot.md
tests:
  - No tests applicable for constitution establishment
---

## Prompt

Create a separate constitution file for the RAG-Powered Textbook Chatbot feature.

**Input:** RAG-Chatbot constitution provided with 13 articles covering:
- Core Principles (grounded accuracy, deterministic behavior, strict scope enforcement, separation of concerns, serverless reliability, explicit over implicit)
- Technical Architecture (forbidden patterns, mandatory characteristics, approved tech stack)
- Answering Modes (Book-Only, Selected-Text-Only, General Knowledge)
- RAG Pipeline Laws (document processing, retrieval, failure handling, QA)
- Citation & Attribution Laws
- User Experience Laws
- API Contract Law
- Security & Reliability
- Observability & Monitoring
- Success Criteria
- Testing & Quality Assurance
- Amendment Process
- Enforcement
- Appendices (Glossary, Quick Reference)

**Task:** Write the complete constitution to `.specify/memory/constitution-rag-chatbot.md` as a separate file (not merged into the Physical AI textbook constitution).

## Response snapshot

✅ RAG-Chatbot constitution created at `.specify/memory/constitution-rag-chatbot.md` with:
- Version: 1.0.0 (MAJOR - initial establishment)
- Effective Date: 2026-01-28
- All 13 articles intact, fully populated
- No placeholder tokens remaining
- Sync Impact Report included at top of file
- All governance sections complete (amendment procedure, versioning, enforcement)

## Outcome

- ✅ Impact: New governance layer established for RAG-Chatbot feature; separates concerns from Physical AI textbook constitution
- 🧪 Tests: Constitution document structure validated; no runtime tests applicable
- 📁 Files: 1 file created (`constitution-rag-chatbot.md`)
- 🔁 Next prompts: Create RAG-Chatbot spec.md aligned with this constitution; establish RAG pipeline architecture
- 🧠 Reflection: Constitutional separation enables independent governance for RAG feature while preserving Physical AI textbook principles

## Evaluation notes (flywheel)

- Failure modes observed: None; template validation successful
- Graders run and results (PASS/FAIL): N/A (constitution is governance doc, not executable code)
- Prompt variant (if applicable): None
- Next experiment: Validate constitution-spec alignment by reviewing RAG-specific requirements in upcoming spec document

