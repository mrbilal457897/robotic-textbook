---
name: knowledge-dependency
description: Manage prerequisite knowledge dependencies by detecting missing prerequisites, suggesting prerequisite sections, and preventing learning gaps
category: curriculum-design
surface: agent
applicable_to:
  - interactive-textbook
  - curriculum-planning
  - learning-path-design
  - physical-ai-robotics
tags:
  - prerequisites
  - learning-gaps
  - educational-integrity
  - curriculum-coherence
  - dependency-analysis
---

# Knowledge Dependency Skill

## Overview

This skill ensures educational integrity by systematically identifying, documenting, and validating prerequisite knowledge dependencies across your Interactive Textbook. It prevents learning gaps, catches missing foundational material, and guides learners through coherent knowledge progressions.

**When to Use:** When designing learning paths, creating new lessons, planning modules, and reviewing curriculum coherence.

**Core Principle:** Educational integrity is non-negotiable. Learners must have the foundational knowledge needed to succeed at each level.

---

## Terminology

| Term | Definition |
|------|-----------|
| **Prerequisite** | Knowledge, skill, or concept that *must* be understood before engaging with a lesson |
| **Corequisite** | Knowledge taught *simultaneously* with a lesson (e.g., ROS 2 fundamentals + first publisher example) |
| **Dependency Graph** | Visual or structural representation of how lessons depend on each other |
| **Learning Path** | Ordered sequence of lessons that builds competency progressively |
| **Knowledge Gap** | Missing prerequisite that blocks learner understanding or causes cognitive overload |
| **Cognitive Load** | Total mental effort required to learn a lesson |

---

## Execution Flow

### Step 1: Scope the Lesson/Module

Define what you're analyzing:

**Input questions:**
- What lesson or module is being designed?
- What is the learning objective (what should learners *do* after this lesson)?
- Who is the target audience (beginners, intermediate, advanced)?
- Is this a new lesson or an update to existing curriculum?

**Output:**
- Lesson title, URL/location, learning objectives (from spec)
- Target audience skill level
- Current lesson position in curriculum (if known)

---

### Step 2: Identify All Prerequisite Types

For each learning objective, extract prerequisites across these categories:

#### **A. Conceptual Prerequisites**
Knowledge or theory needed *before* the lesson:
- Physics concepts (kinematics, dynamics, forces)
- Math concepts (linear algebra, calculus, trigonometry)
- ROS/software architecture patterns (pub-sub, services, actions)
- Robotics concepts (joint types, end-effector, forward kinematics)
- AI/ML concepts (reinforcement learning, policy gradients, neural networks)

**Example:** To teach "Policy Gradient Methods," learners need:
- Reinforcement learning fundamentals
- Probability and statistics
- Gradient descent and calculus

#### **B. Technical/Tooling Prerequisites**
Software or hardware skills needed:
- ROS 2 CLI basics (ros2 run, ros2 launch, ros2 topic)
- Gazebo or Isaac Sim basics (spawn, run, inspect)
- Python proficiency (functions, classes, imports)
- Bash/terminal command familiarity
- Git and version control basics

**Example:** To teach "Gazebo URDF Configuration," learners need:
- XML markup knowledge
- Gazebo simulator basics
- File system navigation

#### **C. Lesson-Specific Prerequisites**
Specific lessons or modules from *this* textbook:
- Prior lessons in the same module
- Foundational modules (e.g., ROS 2 Fundamentals before Advanced Control)
- Case studies or examples introduced elsewhere

**Example:** To teach "Humanoid Locomotion Control," learners need:
- Lesson: "ROS 2 Publishers and Subscribers" (to understand comms)
- Lesson: "Gazebo Simulation Basics" (to run simulations)
- Module: "Physics for Robotics" (to understand dynamics)

#### **D. Implicit Prerequisites**
Assumptions about learner experience:
- General programming knowledge
- Basic physics understanding
- Comfort with command-line interfaces
- Familiarity with version control (Git)
- Mathematical notation and problem-solving

**Example:** To teach "Deep Reinforcement Learning for Robot Control," assume learners:
- Can write Python functions and classes
- Understand optimization and gradient descent
- Have terminal proficiency

---

### Step 3: Build Dependency Map

Create a structured dependency tree for the lesson:

```
Lesson: [Title]

Conceptual Prerequisites:
├─ Category: ROS 2 Fundamentals
│  ├─ Topic: Publish-Subscribe Pattern
│  ├─ Topic: ROS 2 Node Lifecycle
│  └─ Where covered: /ros2-fundamentals/pub-sub
├─ Category: Physics
│  └─ Topic: Force and Acceleration
│      └─ Where covered: [MISSING - SUGGEST NEW SECTION]

Technical Prerequisites:
├─ Tool: ROS 2 (version: Humble or later)
├─ Tool: Gazebo (version: 11+)
├─ Skill: Python 3.10+ (functions, classes)
│  └─ Assumed from: General programming background

Lesson-Specific Prerequisites:
├─ Prior lesson: "Introduction to ROS 2"
├─ Prior lesson: "Gazebo Simulation Basics"
├─ Module: "Control Theory Fundamentals"
│  └─ Why: Needed for PID tuning concepts

Implicit Prerequisites:
├─ Programming fundamentals (loops, functions, objects)
├─ Command-line comfort (terminal, file navigation)
└─ Git version control basics
```

---

### Step 4: Cross-Reference Against Curriculum

Check each prerequisite:

**For each prerequisite, answer:**

1. **Is it documented in the textbook?**
   - ✅ YES → Record the file path (e.g., `/docs/lessons/ros2-fundamentals/pub-sub.md`)
   - ❌ NO → Flag as **MISSING PREREQUISITE**

2. **Is it placed *before* this lesson in the learning path?**
   - ✅ YES → Learning sequence is valid
   - ❌ NO → Flag as **ORDERING ERROR** (learner will encounter gap)

3. **Is it sufficient (depth/scope)?**
   - ✅ YES → Learner has enough foundation
   - ❓ MAYBE → Flag for review; suggest supplementary material or expansion

4. **Is it at the right cognitive level?**
   - ✅ YES → Matches target audience
   - ❌ NO → Suggest adjustment (too simple/advanced)

**Output for each prerequisite:**
```
[ ] Title: Publish-Subscribe Pattern
    Status: ✅ Covered in /ros2-fundamentals/pub-sub
    Placement: ✅ Appears 2 lessons before this lesson (correct order)
    Depth: ✅ Sufficient for ROS 2 control concepts
    Audience: ✅ Matches intermediate learner level

[ ] Title: Force and Acceleration (Physics)
    Status: ❌ NOT FOUND in curriculum
    Action: SUGGEST NEW LESSON or add to existing physics module

[ ] Title: PID Control Theory
    Status: ✅ Covered in /control-theory/pid-basics
    Placement: ❌ ORDERING ERROR - appears AFTER this lesson
    Action: REORDER: Move /control-theory/pid-basics before this lesson
```

---

### Step 5: Detect Learning Gaps

Systematically find gaps that will harm learner success:

**Gap Detection Checklist:**

| Gap Type | Detection Method | Action |
|----------|-----------------|--------|
| **Missing foundational lesson** | Prerequisite listed but not found in curriculum | Create new lesson or expand existing section |
| **Out-of-order prerequisites** | Prerequisite appears *after* dependent lesson | Reorder modules or suggest alternative learning path |
| **Depth mismatch** | Prerequisite too shallow for advanced topic | Expand prerequisite lesson or add supplementary material |
| **Conceptual leap** | Large cognitive gap between lessons | Insert intermediate lesson as bridge |
| **Implicit assumption not stated** | Lesson assumes knowledge not documented | Add prerequisite notice to lesson spec |
| **Tool/version mismatch** | Lesson uses version X, prerequisite covers version Y | Update prerequisite or add compatibility note |

**Example of Gap Detection:**

```
Lesson: "Advanced Visual Servoing for Humanoid Grasping"

Detected Gap: Learner must understand
  1. Camera calibration (NOT covered in curriculum)
  2. OpenCV basics (Mentioned but not formally taught)
  3. Jacobian matrices (Physics module, but cognitive jump is large)

Remediation:
  - [ ] Create lesson: "Camera Calibration for Robotics" (1-2 weeks)
  - [ ] Expand: "Computer Vision Fundamentals" (add OpenCV intro)
  - [ ] Insert bridge: "Math Interlude: Jacobians Explained" (practical focus, not theory-heavy)
```

---

### Step 6: Suggest Prerequisite Sections

For detected gaps, propose where and what to teach:

**Suggestion Template:**

```
Missing Prerequisite: [Topic]

Suggested Placement:
├─ Module: [Which module should contain this?]
├─ Sequence: [How many lessons in? E.g., "2nd lesson in module"]
└─ Timing: [When should learner encounter it? Before or concurrent with dependent lesson?]

Suggested Content Structure:
├─ Learning Objectives:
│  ├─ [ ] Learner can [objective 1]
│  ├─ [ ] Learner can [objective 2]
│  └─ [ ] Learner can [objective 3]
├─ Content Outline:
│  ├─ Section 1: [Core concept] (5 min read)
│  ├─ Section 2: [Application] (code example + explanation)
│  └─ Section 3: [Practice] (interactive or quiz)
├─ Estimated Length: [X minutes reading + Y minutes practice]
└─ Integration Point: [Link from dependent lesson back to this prerequisite]

Prerequisite Dependencies of *This* New Lesson:
├─ Requires: [What foundational topics must exist first]
└─ See: [Existing lessons that can scaffold this new lesson]
```

---

### Step 7: Validate Learning Path Coherence

Perform end-to-end validation of the learning path:

**Coherence Validation:**

1. **Start Point Clarity**
   - ✅ Can a complete beginner start with Lesson 1?
   - ✅ Are implicit prerequisites clearly stated?

2. **Progressive Depth**
   - ✅ Does complexity increase gradually (no sudden jumps)?
   - ✅ Are cognitive loads manageable at each step?

3. **Backward References**
   - ✅ Can learners review prerequisites if needed?
   - ✅ Are cross-references included in each lesson?

4. **Completeness**
   - ✅ Are all prerequisites from the first lesson available?
   - ✅ Are no external (outside-textbook) prerequisites required?

5. **Accessibility**
   - ✅ Are multiple pathways available (e.g., theory-first vs. practice-first)?
   - ✅ Can learners skip advanced sections without breaking foundational learning?

**Output: Learning Path Report**

```
Module: [Name]

Coherence Status: ✅ PASS (or ❌ FAIL)

Summary:
├─ Total lessons: N
├─ Critical gaps found: M
├─ Out-of-order prerequisites: K
└─ Estimated fix effort: [Low / Medium / High]

Lesson-by-Lesson Validation:
├─ Lesson 1: [Title]
│  Prerequisite coverage: ✅ All in-order and available
│
├─ Lesson 2: [Title]
│  Prerequisite coverage: ⚠️ 1 gap detected (see below)
│
└─ Lesson N: [Title]
   Prerequisite coverage: ✅ All in-order and available

Issues and Fixes:
├─ Gap 1: [Description] → FIX: [Action]
├─ Gap 2: [Description] → FIX: [Action]
└─ Gap 3: [Description] → FIX: [Action]
```

---

## Examples

### Example 1: Detecting Missing Physics Prerequisites

**Lesson Being Designed:** "Dynamic Walking Control for Bipedal Robots"

**Learning Objective:** Learners can implement and tune a walking gait controller using ZMP (Zero Moment Point).

**Prerequisite Analysis:**

```
Conceptual Prerequisites:
├─ Zero Moment Point (ZMP) Theory
│  Status: ❌ MISSING - NOT IN CURRICULUM
│  Suggested placement: New lesson "Physics of Balance and ZMP"
│              Location: Module "Control Theory Fundamentals"
│              Timing: 3rd lesson (after kinematics, before dynamic control)
│
├─ Forward Kinematics
│  Status: ✅ Covered in /robotics-fundamentals/kinematics
│  Placement: ✅ Correct (2 modules before walking lesson)
│
├─ Center of Mass Dynamics
│  Status: ⚠️ PARTIAL - Mentioned in /physics-for-robotics/dynamics
│              but insufficient depth for walking controllers
│  Action: Expand existing lesson or add dedicated section

Technical Prerequisites:
├─ ROS 2 Publisher/Subscriber
│  Status: ✅ Covered and ordered correctly
│
└─ Gazebo Humanoid Spawning
   Status: ✅ Covered and ordered correctly

Lesson-Specific Prerequisites:
├─ /control-theory/pid-basics
│  Status: ✅ Available and ordered correctly
│
└─ /humanoid-sim/gazebo-urdf
   Status: ✅ Available and ordered correctly
```

**Gaps Detected:**
1. **ZMP theory (conceptual)** - Must create new lesson
2. **Center of Mass dynamics (depth)** - Must expand existing lesson

**Remediation Plan:**
```
Action Items:
[ ] Create lesson: "Physics of Balance: Zero Moment Point (ZMP)"
    ├─ Learning objectives: understand ZMP, apply to stability control
    ├─ Placement: Before "Dynamic Walking Control"
    ├─ Estimated effort: 2-3 weeks
    └─ Dependencies: Physics module, center-of-mass concepts

[ ] Expand lesson: "Dynamics for Walking Robots"
    ├─ Add section on center-of-mass trajectories
    ├─ Include worked examples specific to bipedal gait
    ├─ Estimated effort: 1 week
    └─ Link back to ZMP lesson for reinforcement
```

---

### Example 2: Detecting Ordering Errors

**Module Review:** "ROS 2 Advanced Topics"

**Lesson Sequence:**
1. Lesson 1: "ROS 2 Debugging Tools" ← Assumes ROS 2 Fundamentals
2. Lesson 2: "ROS 2 Fundamentals" ← **Should be Lesson 1**
3. Lesson 3: "ROS 2 Services and Actions" ← Depends on Lesson 2

**Issue Detected:**
```
❌ ORDERING ERROR: Lesson 1 depends on Lesson 2

Prerequisites for "ROS 2 Debugging Tools":
├─ Prerequisite: ROS 2 command-line basics
│  Located in: Lesson 2 (appears AFTER this lesson)
│  Status: ❌ LEARNER WILL BE LOST
│
└─ Action: REORDER
   ├─ Move Lesson 2 to position 1
   ├─ Move Lesson 1 to position 2
   └─ Verify all cross-references still work
```

**Fixed Sequence:**
1. Lesson 1: "ROS 2 Fundamentals" ← Foundation
2. Lesson 2: "ROS 2 Debugging Tools" ← Now all prerequisites available
3. Lesson 3: "ROS 2 Services and Actions" ← Builds on Lesson 2

---

### Example 3: Suggesting a Bridge Lesson

**Lesson:** "Policy Gradient Methods for Robot Control"

**Issue:** Large cognitive leap from basic RL to policy gradients

**Prerequisites:**
```
What learners need:
├─ Reinforcement learning fundamentals (Covered ✅)
├─ Probability and statistics (Covered ✅)
├─ Gradient descent (Covered ✅)
│
└─ **But:** Cognitive jump from "RL basics" to "policy gradients" is too large
    Learners will struggle with notation, mathematical rigor, intuition.
```

**Suggestion:**
```
Insert Bridge Lesson: "From Q-Learning to Policy Methods"

Purpose: Smooth the cognitive transition between RL basics and policy gradients

Content:
├─ Section 1: Review Q-Learning (quick recap)
├─ Section 2: Why Q-Learning has limits (motivation)
├─ Section 3: Introduction to policy-based methods (intuitive)
├─ Section 4: Connecting RL concepts to policy notation (bridge)
└─ Section 5: What's next (policy gradients preview)

Placement:
├─ Position: Right before "Policy Gradient Methods"
├─ Estimated length: 30 minutes reading + 15 minutes practice
└─ Learning goals:
   ├─ [ ] Learner can compare Q-learning and policy methods
   ├─ [ ] Learner can explain why policy methods work
   └─ [ ] Learner can read policy gradient notation

Benefits:
├─ Reduces cognitive load on main lesson
├─ Provides review opportunity
└─ Builds intuition before formal math
```

---

## Tools Used

| Tool | Purpose |
|------|---------|
| **Glob** | Find lessons, modules, and specs in the curriculum structure |
| **Grep** | Search for references to prerequisites, learning objectives, or topics across lessons |
| **Read** | Inspect lesson specs, learning objectives, and existing prerequisite sections |
| **Grep + Glob** | Build dependency graph by scanning all lesson specs for "requires," "assumes," "prerequisite" keywords |
| **AskUserQuestion** | Get clarification on target audience, cognitive level, or learning path intent |
| **TodoWrite** | Track gap remediation tasks and curriculum restructuring work |

---

## Integration with SDD Workflow

**Use this skill during:**
- **Spec phase** — When defining learning objectives, explicitly extract prerequisites
- **Plan phase** — When designing module sequences, validate dependency ordering
- **Tasks phase** — When assigning lesson creation/update tasks, reference prerequisite coverage

**Invoke before:**
- Creating a new lesson (run prerequisites analysis)
- Updating module sequences (validate learning path coherence)
- Reviewing curriculum completeness (detect gaps)

**Output products:**
- Prerequisites section in lesson spec
- Dependency graph (visual or structured)
- Gap remediation task list
- Learning path coherence report

---

## Success Criteria for Educational Integrity

- ✅ **No Broken Chains:** Every prerequisite is available before the dependent lesson
- ✅ **No Cognitive Jumps:** Lessons progress in difficulty; gaps don't overwhelm learners
- ✅ **Explicit Assumptions:** All implicit prerequisites are documented
- ✅ **Complete Foundations:** No external (outside-textbook) prerequisites required, or clearly marked
- ✅ **Alternative Pathways:** Advanced learners can skip basics; beginners have scaffolding
- ✅ **Bidirectional Links:** Lessons reference prerequisites; prerequisites link forward
- ✅ **Validated Sequence:** Spot-checks confirm learners *can* follow the path

---

## Common Pitfalls & How to Avoid Them

| Pitfall | Risk | How to Avoid |
|---------|------|-------------|
| **Assuming universal knowledge** | Beginners are lost; course feels elitist | Document all implicit prerequisites; ask "What does a complete beginner need?" |
| **Ignoring cognitive load** | Learners overwhelmed; dropout rates spike | Break large topics; insert review lessons; estimate mental effort |
| **Out-of-order placement** | Prerequisites after dependents; learner confusion | Use dependency graph tools; validate sequence before publishing |
| **Shallow prerequisites** | Learner struggles with advanced topics | Check depth; expand prerequisites if needed; add supplementary material |
| **No cross-references** | Learners forget why they needed prerequisite | Add "You'll need [X] — see [link]" to lesson intro and prerequisite callouts |
| **Forgetting external prerequisites** | Assumptions about software, hardware, knowledge | Map all tools, versions, and external knowledge explicitly |
| **Monolithic lessons** | High cognitive load; hard to assess prerequisites | Break large lessons into digestible units; prerequisite per unit |

---

## Dependency Analysis Checklist

Use this checklist when analyzing any lesson or module:

- [ ] **Conceptual prerequisites identified** (physics, theory, algorithms)
- [ ] **Technical prerequisites identified** (tools, languages, versions)
- [ ] **Lesson-specific prerequisites identified** (prior lessons from this textbook)
- [ ] **Implicit prerequisites documented** (assumed knowledge, general skills)
- [ ] **All prerequisites found in curriculum** (no gaps)
- [ ] **All prerequisites appear before this lesson** (correct ordering)
- [ ] **Depth of prerequisites sufficient** for this lesson's learning objectives
- [ ] **Prerequisite references added to lesson** (cross-links and callouts)
- [ ] **Bridge lessons identified** for large cognitive jumps
- [ ] **Learning path coherence validated** (no broken chains, progressive difficulty)
- [ ] **Accessibility verified** (multiple entry points, skip options for advanced learners)
- [ ] **Gap remediation tasks created** (captured in tasks.md or backlog)

---

## Learning Path Dependency Graph Format

For complex modules, create a visual dependency graph:

```
Foundation Module
├─ Lesson 1: Python Basics
│  └─ Assumed: Programming fundamentals
├─ Lesson 2: ROS 2 Concepts
│  └─ Requires: Lesson 1 ✅
└─ Lesson 3: Gazebo Basics
   └─ Requires: Lesson 2 ✅

Control Theory Module
├─ Lesson 4: PID Fundamentals
│  └─ Requires: Foundation.Lesson 3 ✅
├─ Lesson 5: Advanced PID Tuning
│  └─ Requires: Lesson 4 ✅
└─ Lesson 6: Adaptive Control
   ├─ Requires: Lesson 5 ✅
   └─ Prerequisite: Calculus (Assumed ✅)

Humanoid Control (Advanced)
├─ Lesson 7: Bipedal Dynamics
│  ├─ Requires: Control.Lesson 4 ✅
│  └─ Prerequisite: Physics (Found ⚠️ Needs expansion)
├─ Lesson 8: Gait Control
│  └─ Requires: Lesson 7 ✅
└─ Lesson 9: Balance and Walking
   ├─ Requires: Lesson 8 ✅
   └─ Prerequisite: ZMP Theory (❌ MISSING - ACTION NEEDED)
```

---

## Save Instructions

Save this skill as: `.claude/skills/knowledge-dependency/skill.md`

Verify the path exists and is properly formatted:
```bash
ls -la .claude/skills/knowledge-dependency/skill.md
```

Then invoke during curriculum design:
```bash
claude-code /knowledge-dependency "<lesson-title> | <module-name>"
```

---

**Version:** 1.0
**Last Updated:** 2026-01-16
**Project:** Physical AI & Humanoid Robotics Interactive Textbook
**Alignment:** Educational integrity, SDD, curriculum coherence, CLAUDE.md
