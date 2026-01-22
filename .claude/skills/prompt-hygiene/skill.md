---
name: prompt-hygiene
description: Improve prompt clarity and effectiveness by removing ambiguity, enforcing structured prompts, and improving agent triggering accuracy
category: workflow-enhancement
surface: agent
applicable_to:
  - spec-driven-development
  - interactive-textbook
  - physical-ai-robotics
tags:
  - prompt-clarity
  - agent-triggering
  - sdd-alignment
  - workflow-preparation
---

# Prompt Hygiene Skill

## Overview

This skill cleans and structures user prompts before execution in major agent workflows. It removes ambiguity, enforces SDD-aligned language, and improves agent triggering accuracy while preserving semantic intent.

**When to Use:** Before running `/sp.specify`, `/sp.plan`, `/sp.tasks`, or any multi-agent workflow.

---

## Execution Flow

### Step 1: Identify Prompt Type

Categorize the user input:
- **Constitution**: Project principles, rules, constraints
- **Spec**: Feature requirements, requirements clarification
- **Plan**: Architecture, design decisions, implementation strategy
- **Tasks**: Breakdown, testable units, acceptance criteria
- **Debug**: Troubleshooting, error analysis, code fixes
- **Explainer**: Documentation, knowledge transfer, learning materials
- **General**: Questions, research, exploratory work

**Prompt:** Ask "What stage is this prompt for?" if unclear.

---

### Step 2: Detect Ambiguity Patterns

Scan for and flag these patterns:

| Pattern | Example | Fix |
|---------|---------|-----|
| **Vague goals** | "Make it better" | Specify *what* improves and *how* it's measured |
| **Implicit context** | "Update the module" | State which module, what change, expected outcome |
| **Missing constraints** | "Add feature X" | Include scope bounds, non-goals, dependencies |
| **Passive voice intent** | "The system should handle errors" | Actor + action: "When users encounter errors, log them and show a recovery UI" |
| **Unspecified dependencies** | "Implement after Y" | List explicit blockers or prior tasks required |
| **Assumed knowledge** | "Use our patterns" | Link to or briefly state the specific patterns |
| **Open-ended scope** | "Improve the docs" | List specific sections, acceptance criteria, target audience |
| **Unmeasurable outcomes** | "Make it fast" | Define p95 latency, throughput, or resource budgets |

---

### Step 3: Apply SDD Alignment Checks

Ensure prompts align with spec-driven principles:

**Checklist:**
- ☐ Does the prompt reference existing specs/plans where applicable?
- ☐ Are success criteria (acceptance, tests, validation) explicit?
- ☐ Are external dependencies listed?
- ☐ Is the scope bounded (in-scope vs. out-of-scope)?
- ☐ Are architectural or security decisions surfaced?
- ☐ Is the prompt actionable without follow-up questions?

If **3 or more** items are unchecked, request clarification before proceeding.

---

### Step 4: Structure the Prompt

Reorganize the cleaned prompt into this canonical form:

```
## Task
[1-2 sentences: What needs to be done and why]

## Context
- Current state: [existing situation, relevant files/specs]
- Goal: [desired end state]
- Success criteria: [testable acceptance criteria]

## Constraints & Non-Goals
- In scope: [what IS included]
- Out of scope: [what IS NOT included]
- Dependencies: [blockers, prior work, external systems]
- Technical constraints: [performance, security, compatibility, etc.]

## Deliverables
- [ ] Acceptance criterion 1 (testable)
- [ ] Acceptance criterion 2 (testable)
- [ ] [Any artifacts: code, docs, tests, PHRs, ADRs]

## Follow-Ups (Optional)
- What to do next after this task
- Known risks or edge cases
- Suggested agent workflows or skills
```

---

### Step 5: Validate & Emit Cleaned Prompt

**Validation checklist:**
- ☐ No placeholder or ambiguous terms (`[TBD]`, `TBD`, `TK`, "TBD")
- ☐ All acronyms defined on first use
- ☐ Code references include file paths and line numbers where applicable
- ☐ Links are full URLs (not "see the code" without a target)
- ☐ Acceptance criteria are testable (include assertions, outputs, or observable state)
- ☐ Tone is imperative, specific, and bias-free

**Output the cleaned prompt** with a brief note of changes made (if any).

---

## Examples

### Example 1: Vague Spec Prompt

**Input (Unclear):**
```
Add user authentication to the textbook. Users should be able to log in.
```

**Cleaned Output:**

```
## Task
Implement user authentication for the Interactive Textbook to protect premium content and track learner progress.

## Context
- Current state: Textbook loads without authentication; all content is public
- Goal: Users can register, log in, and access content based on their tier (free/premium)
- Success criteria: Authenticated users see premium sections; unauthenticated requests redirect to login

## Constraints & Non-Goals
- In scope: Login/signup UI, JWT token generation, protected API endpoints, session management
- Out of scope: Social login, password reset via email, role-based access control (RBAC)
- Dependencies: Docusaurus framework, existing user database schema
- Technical constraints: No hardcoded secrets; use .env for token keys. Tokens expire in 24h.

## Deliverables
- [ ] Login and signup forms render without errors
- [ ] POST /auth/login returns JWT on valid credentials
- [ ] Protected routes (e.g., /premium) reject unauthenticated requests with 401
- [ ] Session persists across page refreshes
- [ ] Docusaurus skill created: `auth-flow` for token lifecycle
- [ ] PHR recorded in history/prompts/spec/
```

---

### Example 2: Ambiguous Plan Prompt

**Input (Unclear):**
```
Plan the architecture for the simulation module. Make it fast and reliable.
```

**Cleaned Output:**

```
## Task
Design the architecture for the ROS 2 simulation integration module, focusing on deterministic execution and sub-100ms command latency.

## Context
- Current state: Textbook has lesson stubs for Isaac Sim and Gazebo; no unified interface exists
- Goal: Unified, extensible architecture for sim environment abstraction with predictable performance
- Success criteria: Instructors can swap Gazebo ↔ Isaac Sim without lesson code changes; command latency is p95 < 100ms

## Constraints & Non-Goals
- In scope: Abstraction layer design, interface contracts, simulation lifecycle (init → run → shutdown), error handling
- Out of scope: Actual Gazebo/Isaac Sim plugin development, physics tuning
- Dependencies: ROS 2, existing lesson modules (see specs/lessons/)
- Technical constraints: Deterministic step size (required for reproducibility); no floating-point IEEE ambiguity

## Deliverables
- [ ] Architectural diagram showing abstraction layers and module boundaries
- [ ] Interface spec for SimulationEnv (inputs, outputs, error codes)
- [ ] Data model for simulation state (pose, velocity, sensor readings)
- [ ] Migration path from current lesson code to new abstraction
- [ ] Performance budget: <100ms for command round-trip; documented in plan.md
- [ ] ADR created for abstraction vs. direct-binding decision

## Follow-Ups
- Implement the core SimulationEnv class (next task)
- Migrate one lesson as proof-of-concept
- Profile real-world latency against budget
```

---

### Example 3: Debug Prompt Cleanup

**Input (Unclear):**
```
The robot isn't moving. Can you fix it?
```

**Cleaned Output:**

```
## Task
Debug why the humanoid robot fails to execute movement commands in Isaac Sim; determine root cause and apply fix.

## Context
- Current state: ROS 2 node sends velocity commands to Isaac Sim; robot spawns but doesn't move
- Goal: Robot responds to velocity commands and executes movement trajectory
- Success criteria: Robot moves forward when velocity > 0; stops when velocity = 0; no error logs

## Constraints & Non-Goals
- In scope: Physics configuration, command routing, joint controller tuning
- Out of scope: Gazebo migration or physics rewrite
- Dependencies: Isaac Sim 2024.1, humanoid URDF model, ROS 2 Humble
- Error info: [Paste error logs, stack traces, environment setup]

## Deliverables
- [ ] Root cause identified and documented
- [ ] Reproduction steps provided
- [ ] Fix applied with test confirmation
- [ ] Related GitHub issue (if applicable) updated

## Follow-Ups
- Add unit test to prevent regression
- Suggest PHR for debugging session
```

---

## Tools Used

| Tool | Purpose |
|------|---------|
| **Glob** | Locate relevant specs, plans, tasks, or code files |
| **Grep** | Find references to patterns, constraints, or dependencies |
| **Read** | Inspect existing specs and architecture docs for context |
| **AskUserQuestion** | Request clarification on ambiguous or missing elements |
| **TodoWrite** | Plan multi-step cleanup or validation workflows |

---

## Integration with SDD Workflow

This skill **must run before:**
- `/sp.specify` — clarify feature requirements
- `/sp.plan` — structure architecture decisions
- `/sp.tasks` — break down implementation work
- `/sp.implement` — ensure task clarity before execution

**Invoke explicitly:**
```bash
claude-code /prompt-hygiene "<your-prompt>"
```

Or reference in any command:
```bash
# Before spec creation
claude-code /prompt-hygiene "..." && claude-code /sp.specify
```

---

## Success Criteria for Skill Execution

- ✅ Prompt is free of ambiguity (no `[TBD]`, vague terms, or implicit assumptions)
- ✅ SDD alignment: scope, constraints, and success criteria are explicit
- ✅ Structured output follows canonical form (Task, Context, Constraints, Deliverables, Follow-Ups)
- ✅ Semantic meaning is preserved (no simplification that loses intent)
- ✅ Cleaned prompt is actionable without follow-up questions
- ✅ All references are explicit (specs, files, line numbers, full URLs)

---

## Common Pitfalls & How to Avoid Them

| Pitfall | How to Avoid |
|---------|-------------|
| Over-editing removes context | Preserve original examples and rationale; only clarify |
| Assuming domain knowledge | Define all robotics terms, framework patterns, and abbreviations |
| Skipping constraint validation | Always ask "What is *not* in scope?" before proceeding |
| Accepting vague acceptance criteria | Replace "works well" with measurable outputs (e.g., p95 latency, test count) |
| Ignoring dependencies | Map blockers and prior work explicitly |

---

## Examples of Cleaned vs. Uncleaned Prompts

### Uncleaned:
> "Make the VLA module more efficient and add better error handling."

### Cleaned:
> **Task:** Optimize the Whisper-to-ROS VLA pipeline to reduce latency to <500ms and standardize error propagation.
>
> **Context:** Current pipeline has ~1.5s latency; errors from Whisper or ROS are silently dropped.
>
> **Deliverables:**
> - [ ] Profile bottlenecks; document findings
> - [ ] Reduce pipeline latency p95 to <500ms
> - [ ] Add error logging at Whisper, LLM, and ROS stages
> - [ ] Tests confirm errors are surfaced and logged

---

## Save Instructions

Save this skill as: `.claude/skills/prompt-hygiene/skill.md`

Verify the path exists:
```bash
ls -la .claude/skills/prompt-hygiene/
```

Confirm the file is readable and properly formatted. Then invoke it in workflows:
```bash
claude-code /prompt-hygiene "<your-prompt>"
```

---

**Version:** 1.0
**Last Updated:** 2026-01-16
**Project:** Physical AI & Humanoid Robotics Interactive Textbook
**Alignment:** SDD, Spec-Driven Development, CLAUDE.md
