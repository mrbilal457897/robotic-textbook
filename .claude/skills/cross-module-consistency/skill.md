# Cross-Module Consistency Skill

**name:** cross-module-consistency
**description:** Ensures consistency across textbook modules by normalizing terminology, detecting conflicting explanations, aligning difficulty levels, and eliminating redundancy while respecting spec.md hierarchy.

---

## Skill Overview

The Cross-Module Consistency skill maintains coherence across the entire textbook by enforcing standardized terminology, identifying contradictory or conflicting explanations of the same concept, aligning module difficulty progression, and eliminating unnecessary duplication. It respects the module hierarchy defined in `spec.md` (the source of truth for module structure) and prevents terminology drift that can confuse students transitioning between modules.

**Primary Use:** When adding new modules or during large refactors.

---

## When to Use This Skill

- **When adding new modules** to ensure they fit seamlessly into existing curriculum
- **During large refactors** that affect multiple modules simultaneously
- **When merging contributions** from multiple authors (standardize terminology and tone)
- **During periodic audits** (quarterly/annually) to catch drift
- **Before publishing** major curriculum updates (chapter releases)
- **When translating content** to other languages (terminology base must be consistent)
- **For version releases** (ensure consistency within each version)

**Do NOT use this skill for:**
- Individual lesson editing (use within-module consistency checks)
- Styling/formatting consistency (use academic-tone or ui-pedagogy skills)
- Code consistency (use code-expert or code-quality-reviewer skills)

---

## Core Consistency Principles

### 1. Terminology Standardization

**Concept:** Each robotics/AI concept has one preferred term; synonyms are documented but not used interchangeably in explanations.

**Rules:**
- Primary term: Used in definitions, module objectives, formal explanations
- Synonyms: Listed in glossary but minimized in body text
- Context-dependent alternatives: Documented (e.g., "joint position" vs. "joint angle" — specify when each applies)
- Abbreviations: Full term first mention; abbreviation thereafter

**Example:**
```
✅ Consistent: "joint position" (defined in Module 2.1, used throughout)
❌ Inconsistent: Module 3 uses "joint position", Module 4 uses "joint angle",
                 Module 5 uses "rotation"
```

### 2. Explanation Consistency

**Concept:** Core concepts explained the same way across modules; subsequent modules build on prior explanations, not contradict them.

**Rules:**
- First definition: Master definition in earliest module (usually Fundamentals)
- Subsequent modules: Reference prior definition; extend with new aspects
- Never contradict: If new module needs to correct earlier explanation, use a "Note" or "Clarification" callout (don't silently replace)
- Consistent framing: Use same analogies, same example scenarios

**Example:**
```
✅ Module 2 (Fundamentals): "The Kalman filter is an optimal state estimation
                            algorithm for linear systems with Gaussian noise."
✅ Module 4 (Advanced): "Building on the Kalman filter from Module 2, we now
                        explore the Extended Kalman Filter (EKF) for nonlinear systems."

❌ Module 2: "Kalman filter is optimal..."
❌ Module 4: "Kalman filters are heuristic approximations..." (contradicts)
```

### 3. Difficulty Level Alignment

**Concept:** Modules progress logically from foundational to advanced; no sudden difficulty jumps.

**Levels:**
- **Foundational (Level 1):** Introductory concepts, algebra/basic calculus, intuitive explanations
- **Intermediate (Level 2):** Building on Level 1, linear algebra, differential equations, detailed algorithms
- **Advanced (Level 3):** Specialized topics, matrix computations, proofs, research-level content

**Rules:**
- Module prerequisites must exist and be documented
- Difficulty increases gradually (no jumps from Level 1 to Level 3)
- If Level 3 concept is introduced early, provide sufficient scaffolding

### 4. Redundancy Avoidance

**Concept:** Concepts taught once; not repeated verbatim across modules. Subsequent modules reference or extend, not duplicate.

**Rules:**
- Core concept explained once (in most foundational module)
- Subsequent modules: "As discussed in Module X.Y..."
- Building on: "We now extend the concept introduced in Module X.Y by..."
- Cross-references: Link to original explanation

**Example:**
```
✅ Module 2 explains ROS 2 pub/sub in detail
✅ Module 4: "Recall the publisher-subscriber pattern from Module 2.3;
             we now apply it to sensor data fusion."

❌ Module 4 repeats the entire ROS 2 pub/sub explanation verbatim
```

### 5. Hierarchy Respect

**Concept:** `spec.md` defines the module hierarchy (chapters, sections, lessons). Cross-module consistency checks respect this structure; don't flatten hierarchy.

**Rules:**
- Chapter structure is the primary organizational unit
- Check consistency within chapters first (tighter coupling)
- Check consistency across chapters (looser coupling)
- Prerequisite chains must align with `spec.md` hierarchy

---

## Workflow: Cross-Module Consistency in 5 Phases

### Phase 1: Module Inventory & Mapping

**Objective:** Create a comprehensive map of all modules, their relationships, and learning objectives.

**Steps:**

1. **Parse spec.md for module hierarchy:**
   - Extract all chapters, sections, lessons
   - Record module titles, descriptions, learning objectives
   - Note prerequisites (if defined in spec.md)
   - Build dependency graph: Module A → prerequisites → Module B

2. **Identify module groupings:**
   - **Foundational cluster:** Modules teaching core concepts (ROS 2, Gazebo, basic algorithms)
   - **Applied cluster:** Modules applying concepts to specific problems (control, planning)
   - **Advanced cluster:** Modules for specialization (sensor fusion, humanoid locomotion)

3. **Document inter-module relationships:**
   - Which modules reference which other modules?
   - Are there forward references (circular dependencies)?
   - What concepts are used in multiple modules?

4. **Create consistency audit checklist:**
   - [ ] Terminology inventory created
   - [ ] Explanation inventory created
   - [ ] Difficulty levels assigned
   - [ ] Redundancy map created
   - [ ] Prerequisites validated

5. **Flag high-risk areas:**
   - Modules with shared concepts (highest consistency risk)
   - Newly added modules (highest likelihood of inconsistency)
   - Modules by different authors (tone/terminology drift)

**Acceptance Check:**
- ✅ All modules in spec.md are mapped
- ✅ Module hierarchy is captured accurately
- ✅ Prerequisites are documented
- ✅ High-risk areas identified
- ✅ Dependency graph is accurate (no circular dependencies)

---

### Phase 2: Terminology Standardization Audit

**Objective:** Identify terminology inconsistencies and establish a unified terminology baseline.

**Steps:**

1. **Extract terminology inventory:**
   - For each module, list all robotics/AI terms introduced or used
   - Create master list: [Term] → [Module(s) where used] → [Definition(s)]

2. **Identify terminology inconsistencies:**
   - Same concept, different terms: "joint position" vs. "joint angle" vs. "rotation"
   - Same term, different meanings: "state" (control state vs. ROS node state vs. simulator state)
   - Abbreviation inconsistency: "ROS" vs. "Robot Operating System" (when to abbreviate)

3. **Resolve inconsistencies using project glossary:**
   - Cross-reference `.specify/memory/glossary.md` (source of truth)
   - For each conflict, determine primary term from glossary
   - Document secondary terms (synonyms to avoid)

4. **Create terminology map:**
   ```
   Primary Term | Synonyms | Context Notes | Modules Using
   ---|---|---|---
   "joint position" | "joint angle", "rotation" | Use "joint angle" only for 1D rotations; "position" for 3D spatial | 2.1, 3.2, 4.1
   "state vector" | "state", "x" | Include dimension when first mention; "state" OK after | 3.1, 4.2, 5.3
   "ROS 2" | "Robot Operating System 2" | Full term first mention; "ROS 2" thereafter | All modules
   ```

5. **Check for author-specific terminology drift:**
   - Scan for patterns (e.g., Author A uses "velocity command", Author B uses "speed setpoint")
   - Consolidate to primary term

6. **Validate abbreviations:**
   - First mention must include full term: "Robot Operating System 2 (ROS 2)"
   - Subsequent mentions use abbreviation: "ROS 2"
   - Exceptions: Very long terms may abbreviate on second mention

**Acceptance Check:**
- ✅ All unique terms extracted
- ✅ Inconsistencies identified (same concept ≠ same term)
- ✅ Primary terms from glossary
- ✅ Terminology map created
- ✅ Abbreviation rules documented
- ✅ No author-specific terminology drift

---

### Phase 3: Explanation & Concept Consistency Check

**Objective:** Ensure core concepts are explained consistently and built upon (not contradicted).

**Steps:**

1. **Identify core concepts across modules:**
   - Concepts appearing in multiple modules: PID control, Kalman filter, ROS 2 patterns, etc.
   - For each concept, list modules where explained or used

2. **Map concept progression:**
   - **Foundational module:** Where is the concept first introduced/defined?
   - **Building modules:** Which modules build on it?
   - **Advanced modules:** Which specialize or extend it?

   Example:
   ```
   Concept: Kalman Filter
   - Module 2.4 (Foundational): Definition, basic algorithm, 1D example
   - Module 4.2 (Applied): Applied to humanoid orientation tracking
   - Module 5.1 (Advanced): Extended Kalman Filter for nonlinear systems
   ```

3. **Extract explanations from foundational module:**
   - Record exact definition, key analogies, example scenarios
   - This is the "source of truth" explanation

4. **Cross-check explanations in other modules:**
   - Do subsequent modules reference the foundational explanation?
   - Or do they repeat it verbatim? (Redundancy issue)
   - Or do they contradict it? (Consistency issue — FLAG)

5. **Flag explanation conflicts:**
   - If Module A defines "state" as "control state at time t"
   - And Module B uses "state" as "ROS node operational state"
   - → Conflict requires clarification (use different terms or add disambiguating context)

6. **Check for consistent framing:**
   - If foundational module uses analogy "PID controller is like a thermostat"
   - Subsequent modules should reference or extend this analogy, not replace with different one
   - Consistent framing aids retention

7. **Validate prerequisite chains:**
   - If Module X assumes knowledge from Module Y, verify Module Y actually covers it
   - Verify prerequisites are listed in Module X's spec

**Acceptance Check:**
- ✅ All multi-module concepts identified
- ✅ Progression mapped (foundational → building → advanced)
- ✅ Explanations cross-checked
- ✅ No contradictions or conflicts
- ✅ Consistent framing across modules
- ✅ Prerequisite chains validated
- ✅ Redundancy detected and flagged

---

### Phase 4: Difficulty Level Alignment

**Objective:** Ensure modules progress smoothly without sudden difficulty jumps.

**Steps:**

1. **Assign difficulty levels to each module:**

   **Level 1 (Foundational):**
   - Introductory concepts, intuitive explanations
   - Math: Algebra, basic geometry, high school calculus
   - Assumes: General science/engineering background
   - Examples: ROS 2 basics, Gazebo simulation basics, joint angles

   **Level 2 (Intermediate):**
   - Building on Level 1 concepts, more detailed algorithms
   - Math: Linear algebra, differential equations, matrix computations
   - Assumes: Level 1 + calculus/linear algebra
   - Examples: PID control, basic Kalman filtering, kinematic chains

   **Level 3 (Advanced):**
   - Specialized topics, advanced algorithms, research-level content
   - Math: Proofs, advanced statistics, control theory
   - Assumes: Level 2 + specialized background
   - Examples: Extended Kalman Filters, nonlinear control, humanoid bipedal locomotion

2. **Create difficulty progression chart:**
   ```
   Chapter → Module → Title → Level → Prerequisites
   ---|---|---|---|---
   2 | 2.1 | ROS 2 Basics | 1 | None
   2 | 2.2 | Publishers & Subscribers | 1 | 2.1
   2 | 2.3 | Services & Actions | 1 | 2.1
   3 | 3.1 | PID Control Fundamentals | 2 | 2.1, Math (derivatives)
   3 | 3.2 | Tuning PID Parameters | 2 | 3.1
   4 | 4.1 | Kalman Filtering | 2 | 2.1, Math (linear algebra)
   5 | 5.1 | Extended Kalman Filters | 3 | 4.1, Advanced math
   ```

3. **Check for difficulty jumps:**
   - From Level 1 to Level 2: OK if prerequisites satisfied
   - From Level 1 to Level 3: FLAG — missing scaffolding
   - From Level 2 to Level 3: OK if prerequisites satisfied
   - Multiple Level 1 modules before Level 2: OK (foundational building)

4. **Verify prerequisites exist and are taught:**
   - If Module X lists "Math: linear algebra" as prerequisite
   - Verify a Module teaching linear algebra exists earlier
   - Verify spec.md shows this dependency

5. **Check for consistent learning curve:**
   - Should be smooth progression, not zigzag (Level 1 → 2 → 1 → 3)
   - Within chapters, difficulty should increase gradually
   - Across chapters, can reset to Level 1 if introducing new domain

6. **Flag over-scaffolding:**
   - If 10 Level 1 modules exist before any Level 2 (might be excessive)
   - Suggest consolidation or acceleration

**Acceptance Check:**
- ✅ All modules assigned difficulty levels
- ✅ Progression is smooth (no sudden jumps)
- ✅ Prerequisites exist and are documented
- ✅ No Level 1 → Level 3 jumps without scaffolding
- ✅ Learning curve is appropriate for target audience
- ✅ No over-scaffolding detected

---

### Phase 5: Cross-Module Validation & Reporting

**Objective:** Perform final validation and generate consistency report.

**Steps:**

1. **Run consistency checks:**
   - ✓ Terminology: All terms use primary names from glossary
   - ✓ Explanations: No contradictions; concepts properly referenced
   - ✓ Difficulty: Progression is smooth; prerequisites exist
   - ✓ Redundancy: Core concepts taught once; subsequent modules reference
   - ✓ Prerequisites: All listed prerequisites exist and are taught
   - ✓ Hierarchy: Respects spec.md structure

2. **Generate consistency report:**
   ```
   # Cross-Module Consistency Report
   ## Summary
   - Total modules: X
   - Terminology issues: Y (list)
   - Explanation conflicts: Z (list)
   - Difficulty alignment: OK/ISSUES (list)
   - Redundancy: A instances (list)
   - Prerequisites: B missing (list)

   ## Critical Issues (must fix before publish)
   - [Issue 1]: Module 4 contradicts Module 2 on [concept]
   - [Issue 2]: Module 5 requires knowledge from Module 3.2, but 3.2 not listed as prerequisite

   ## Warnings (should fix, less critical)
   - [Warning 1]: Terminology inconsistency: Module 3 uses "velocity command", Module 5 uses "speed setpoint"
   - [Warning 2]: Redundancy: Module 4 repeats ROS 2 pub/sub explanation from Module 2

   ## Recommendations (nice-to-have)
   - Consider adding Level 1.5 module between Modules 2 and 3 (large difficulty jump)
   - Consolidate similar concepts in Modules 5 and 6
   ```

3. **Create action items:**
   - Critical issues: List specific edits needed (file, line, fix)
   - Warnings: Suggest consolidation, reference addition, or terminology change
   - Recommendations: Propose additions or restructuring

4. **Validate no new issues introduced by fixes:**
   - After applying fixes, re-run key checks (terminology, prerequisites)
   - Spot-check affected modules for unintended side effects

5. **Final sign-off:**
   - [ ] All critical issues resolved
   - [ ] Warnings addressed or documented with rationale
   - [ ] Prerequisites all verified
   - [ ] Terminology normalized
   - [ ] No contradictions remain

**Acceptance Check:**
- ✅ Consistency report generated
- ✅ All critical issues identified and resolved
- ✅ Warnings addressed
- ✅ Final validation passed
- ✅ Sign-off checklist completed

---

## Consistency Rules & Patterns: Real Examples

### Example 1: Terminology Inconsistency

**Scenario:** New module added; it uses "velocity command" but existing modules use "speed setpoint"

**Detection:**
```
Module 2.2 (Existing): "Send a speed setpoint to the joint controller..."
Module 5.3 (New): "The velocity command is sent asynchronously..."

Terminology conflict: "speed setpoint" vs. "velocity command"
```

**Resolution Process:**

1. **Check glossary:**
   - Glossary defines: "Velocity command: Desired linear or angular velocity sent to a motor or joint controller"
   - This is the primary term

2. **Standardization decision:**
   - Primary: "velocity command"
   - Update Module 2.2: Replace "speed setpoint" with "velocity command"
   - Document in glossary: "Speed setpoint (deprecated; use velocity command)"

3. **Cross-check all modules:**
   - Grep for "speed setpoint", "velocity setpoint", "velocity command"
   - Update all to primary term

4. **Result:**
   ```
   ✅ Module 2.2 (updated): "Send a velocity command to the joint controller..."
   ✅ Module 5.3: "The velocity command is sent asynchronously..."
   ```

---

### Example 2: Explanation Conflict

**Scenario:** Module 2 and Module 4 explain Kalman filters differently

**Detection:**
```
Module 2.4 (Foundational):
"The Kalman filter is an optimal state estimation algorithm that minimizes
the expected squared error for linear systems with Gaussian noise."

Module 4.2 (Applied):
"Kalman filters are approximate solutions for tracking; they use heuristic
weighting of sensor measurements."

Conflict: Module 2 says "optimal"; Module 4 says "approximate".
         This contradicts and will confuse students!
```

**Resolution Process:**

1. **Identify the conflict:**
   - Module 2 defines rigorously (optimal, mathematical)
   - Module 4 uses loose language (approximate, heuristic)
   - This is a genuine contradiction

2. **Determine correct explanation:**
   - Kalman filter IS optimal for linear systems (correct)
   - For nonlinear systems, approximations exist (Extended/Unscented)
   - Module 4 likely mixing concepts

3. **Fix Module 4:**
   ```
   Original: "Kalman filters are approximate solutions for tracking..."

   Fixed: "The Kalman filter (optimal for linear systems, as defined in Module 2.4)
           is applied to humanoid orientation tracking. For nonlinear dynamics
           like rotations, we use the Extended Kalman Filter, a practical
           approximation that extends the filter to nonlinear systems."
   ```

4. **Cross-reference:**
   - Module 4 now references Module 2.4 (establishes foundation)
   - Module 4 clarifies when approximations are needed (extensions, not contradictions)

5. **Result:**
   ```
   ✅ Module 2.4: "...optimal state estimation..."
   ✅ Module 4.2: "...Kalman filter from Module 2.4, applied to... Extended Kalman
                   Filter for nonlinear systems..."
   ```

---

### Example 3: Difficulty Level Mismatch

**Scenario:** Module progression has a sudden difficulty jump

**Current progression:**
```
Module 2.1 (Level 1): ROS 2 Basics - intro, intuitive
Module 2.2 (Level 1): Publishers & Subscribers - still introductory
Module 2.3 (Level 1): Services & Actions - still introductory
Module 3.1 (Level 3): Advanced Control Theory - SUDDEN JUMP!
              Assumes linear algebra, differential equations, control theory
              No scaffolding from Level 2
```

**Issue:**
- Students finish Level 1 (ROS 2 basics)
- Next module jumps to Level 3 (advanced control theory)
- Gap: Missing Level 2 (intermediate) modules on algorithms, math, basic control

**Resolution:**

1. **Identify missing scaffolding:**
   - Need intermediate module(s) between Levels 1 and 3
   - Should cover: PID control (simpler than advanced theory), basic algorithms

2. **Create missing Level 2 modules:**
   ```
   Module 3.1 (Level 2): PID Control Fundamentals
     - Proportional, integral, derivative
     - Simple example: joint angle tracking
     - Prerequisites: Calculus (derivatives), basic control concepts

   Module 3.2 (Level 2): Tuning PID Parameters
     - Kp, Ki, Kd selection
     - Practical examples from humanoid robots
     - Prerequisites: 3.1

   Module 3.3 (Level 3): Advanced Control Theory
     - Frequency response, stability analysis
     - State-space control
     - Prerequisites: 3.1, 3.2, Linear algebra, Differential equations
   ```

3. **Update spec.md:**
   - Add Module 3.1, 3.2 to hierarchy
   - Document prerequisites
   - Update difficulty progression

4. **Result:**
   ```
   ✅ Smooth progression: Level 1 → Level 2 (intermediate) → Level 3 (advanced)
   ✅ Each module has clear prerequisites
   ✅ No sudden difficulty jumps
   ```

---

### Example 4: Redundancy & Consolidation

**Scenario:** Multiple modules redundantly explain ROS 2 pub/sub

**Detection:**
```
Module 2.2 (ROS 2 Basics):
[Full 2-page explanation of pub/sub pattern]
[Publisher example code]
[Subscriber example code]
[Why pub/sub is useful]

Module 4.1 (Sensor Fusion):
[Exact same 2-page explanation of pub/sub pattern]
[Same example code]
[Same rationale]

Module 5.2 (Distributed Systems):
[Yet again, same explanation]

Issue: 3 modules, same content → Redundancy, maintenance nightmare
```

**Resolution Process:**

1. **Identify redundancy:**
   - Core explanation exists in Module 2.2 (foundational)
   - Modules 4.1 and 5.2 duplicate without adding value

2. **Determine canonical location:**
   - Module 2.2 is foundational (correct location)
   - This is where students learn pub/sub for first time

3. **Consolidate:**
   - Keep full explanation in Module 2.2
   - Remove duplicate explanations from Modules 4.1 and 5.2
   - Replace with reference: "As discussed in Module 2.2..."

4. **Build, don't repeat:**
   - Module 4.1: "Recall the pub/sub pattern from Module 2.2. We now use it for sensor data..."
   - Module 5.2: "The pub/sub pattern (see Module 2.2) enables distributed communication. For large-scale systems, we add..."

5. **Result:**
   ```
   ✅ Module 2.2: Full explanation (canonical)
   ✅ Module 4.1: "As shown in Module 2.2, pub/sub..." (reference + extension)
   ✅ Module 5.2: Reference + new application (no duplication)
   ```

---

### Example 5: Prerequisites Mismatch

**Scenario:** Module lists prerequisite that doesn't exist or isn't taught

**Detection:**
```
Module 4.1 spec.md:
  prerequisites:
    - Module 3.2 (PID Control Fundamentals)
    - "Understanding of linear algebra"

Issue 1: Module 3.2 doesn't exist (only 3.1 and 3.3 exist)
Issue 2: "Linear algebra" is mentioned but no module teaches it
```

**Resolution Process:**

1. **Verify prerequisites exist:**
   - Check spec.md for Module 3.2
   - If not found, either:
     - Create it, OR
     - Update Module 4.1's prerequisites to reference existing modules

2. **Find linear algebra coverage:**
   - Search for module teaching linear algebra
   - If none exists, either:
     - Create foundational math module, OR
     - Remove prerequisite and add scaffolding in Module 4.1 itself

3. **Update spec.md:**
   ```
   Module 4.1 spec.md (corrected):
     prerequisites:
       - Module 2.1 (ROS 2 Basics)
       - Module 3.1 (PID Control Fundamentals)
       - Math: Calculus, basic linear algebra (reviewed in Section 4.1.2)

   Module 4.1 content (add):
     Section 4.1.2: "Math Review: Matrices and Linear Algebra Essentials"
     - Refresher on vectors, matrices
     - Linear transformations
     - References to full linear algebra module (if it exists) or external resources
   ```

4. **Result:**
   ```
   ✅ All prerequisites referenced modules exist
   ✅ Math prerequisites are either taught or explicitly refreshed
   ✅ No student left confused by missing prerequisites
   ```

---

## Tools & Resources

### Terminology & Consistency Checking Tools

1. **Project Glossary** (`.specify/memory/glossary.md`)
   - Source of truth for all terminology
   - Reference for all consistency checks
   - Tool: Grep for undefined or conflicting terms

2. **Grep/Ripgrep for Terminology Audit:**
   - Search for all instances of a term: `grep -r "joint position" specs/`
   - Identify variants: `grep -r "joint (position|angle|rotation)" specs/`
   - Tool: Ripgrep (faster for large codebases)

3. **Visual Dependency Graph Tools:**
   - Draw.io, Excalidraw: Visualize module prerequisites and dependencies
   - Help identify circular dependencies or missing scaffolding

4. **Diff Tools for Comparison:**
   - Compare explanations in different modules: `diff module2.md module4.md`
   - Highlight contradictions and redundancies

5. **Text Analysis Tools:**
   - Readability checkers (Hemingway, Grammarly)
   - Check consistency of tone and complexity across modules

### Module Structure & Specification Tools

1. **YAML Validators:**
   - Validate spec.md syntax and structure
   - Ensure all prerequisites are properly formatted
   - Tool: `yamllint` or online YAML validator

2. **Link Checkers:**
   - Verify all module cross-references are valid
   - Ensure no broken links between modules
   - Tool: Markdown link checker, broken-link-checker CLI

3. **Outline/TOC Generators:**
   - Automatically generate table of contents from spec.md
   - Visualize module hierarchy

### Learning Progression Validators

1. **Difficulty Level Matrix:**
   - Create spreadsheet: Module | Title | Level | Prerequisites | Math Requirements
   - Visual representation helps identify jumps

2. **Concept Progression Chart:**
   - Map which concepts appear in which modules
   - Identify where concepts are introduced, built upon, and extended

3. **Knowledge Graph:**
   - Represent modules as nodes, prerequisites as edges
   - Topological sort to identify correct learning order
   - Identify missing scaffolding (isolated Level 3 nodes)

---

## Consistency Audit Checklist

Before declaring modules consistent, verify:

### Terminology Consistency

- [ ] **Glossary aligned:** All robotics/AI terms match `.specify/memory/glossary.md`
- [ ] **Primary terms used:** No inconsistent synonyms in body text
- [ ] **Abbreviations consistent:** Full term on first mention; abbreviation thereafter
- [ ] **No author drift:** Terminology consistent across multiple authors
- [ ] **Context-dependent terms documented:** When "joint position" vs. "joint angle" applies

### Explanation Consistency

- [ ] **Foundational module identified:** Core concept taught where it makes sense
- [ ] **No contradictions:** Subsequent modules build on, not contradict, foundational explanation
- [ ] **References in place:** Subsequent modules reference foundational module when reusing concept
- [ ] **Consistent framing:** Same analogies, examples, language across modules
- [ ] **Consistent notation:** Math symbols, variable names consistent

### Difficulty Alignment

- [ ] **Levels assigned:** Each module has difficulty level (1–3 or similar scale)
- [ ] **Smooth progression:** No Level 1→3 jumps without scaffolding
- [ ] **Prerequisites verified:** All listed prerequisites exist and are taught
- [ ] **No circular dependencies:** Module A doesn't depend on Module B which depends on A
- [ ] **Appropriate for audience:** Difficulty matches target audience background

### Redundancy Avoidance

- [ ] **No verbatim repetition:** Concepts explained once, referenced thereafter
- [ ] **Extension not duplication:** Subsequent modules build on prior concepts, not repeat them
- [ ] **Cross-references present:** "As discussed in Module X..." used to reference prior explanations
- [ ] **Consolidation opportunities identified:** Long explanations checked for split across modules

### Hierarchy Respect

- [ ] **spec.md structure honored:** Module hierarchy matches spec.md
- [ ] **Chapter grouping logical:** Related modules grouped in chapters
- [ ] **Section nesting correct:** Subsections within parent sections
- [ ] **Cross-chapter references explicit:** Dependencies across chapters clearly documented

### Integration Points

- [ ] **Module boundaries clear:** Where one module ends and next begins is clear
- [ ] **Transition smooth:** Last section of Module N connects to first section of Module N+1
- [ ] **No orphan modules:** All modules fit into overall curriculum structure
- [ ] **Learning objectives aligned:** Module objectives align with chapter objectives

---

## Acceptance Criteria

✅ **All terminology normalized** against project glossary
✅ **No explanation contradictions** detected between modules
✅ **Difficulty levels aligned** — smooth progression without jumps
✅ **Prerequisites verified** — all listed prerequisites exist and are taught
✅ **Redundancy eliminated** — core concepts taught once, referenced thereafter
✅ **spec.md hierarchy respected** — module structure aligns with spec
✅ **No circular dependencies** — modules can be learned in specified order
✅ **Cross-references in place** — modules explicitly reference related content
✅ **Consistency report generated** — all issues documented and resolved
✅ **Final validation passed** — no critical issues remain

---

## Examples: Effective vs. Ineffective Cross-Module Consistency

### ❌ Ineffective (Inconsistent Modules)

**Terminology:**
- Module 2: "joint position"
- Module 4: "joint angle"
- Module 5: "rotation"
- Result: Students confused by synonyms; unclear if they mean same thing

**Explanation:**
- Module 2: "Kalman filter is optimal..."
- Module 4: "Kalman filter is approximate..."
- Result: Contradiction; students unsure which is correct

**Difficulty:**
- Module 2.1 (Level 1): Basics
- Module 2.2 (Level 1): Slightly more complex
- Module 3.1 (Level 3): Advanced theory with calculus/linear algebra
- Result: Impossible jump; students unprepared

**Redundancy:**
- Module 2 explains ROS 2 pub/sub (2 pages)
- Module 4 repeats same explanation (2 pages)
- Module 6 repeats again (2 pages)
- Result: Redundancy; maintenance nightmare

### ✅ Effective (Consistent Modules)

**Terminology:**
- Module 2: "joint position" (defined in glossary as primary term)
- Module 4: "joint position" (same term)
- Module 5: "joint position" (consistent)
- Glossary notes: "joint angle used only for 1D rotations in specific contexts"
- Result: Clarity; students use consistent vocabulary

**Explanation:**
- Module 2: "Kalman filter is optimal for linear systems with Gaussian noise"
- Module 4: "Building on the Kalman filter from Module 2, the Extended Kalman Filter extends to nonlinear systems"
- Result: Clear progression; no contradiction

**Difficulty:**
- Module 2 (Level 1): Basics, algebra
- Module 3 (Level 2): Building on Module 2, includes linear algebra, differential equations
- Module 4 (Level 3): Advanced theory, assumes Modules 2–3
- Result: Smooth progression with clear prerequisites

**Redundancy:**
- Module 2: Full explanation of pub/sub (canonical)
- Module 4: "Recall the pub/sub pattern from Module 2.2; we apply it to sensor data fusion"
- Module 6: "The pub/sub pattern (Module 2.2) enables distributed communication. For large-scale systems..."
- Result: No redundancy; references and extensions clear

---

## Common Pitfalls & Solutions

### Pitfall 1: Terminology Drift from Multiple Authors
**Problem:** Author A uses "control signal", Author B uses "command signal" for same concept
**Solution:**
- Create terminology style guide
- Code review checking terminology consistency
- Use glossary as single source of truth

### Pitfall 2: Implicit Dependencies Not Documented
**Problem:** Module 5 assumes knowledge from Module 3, but Module 5's spec doesn't list Module 3 as prerequisite
**Solution:**
- Audit spec.md prerequisites against module content
- Add explicit prerequisites for any module referenced
- Use dependency graph to visualize

### Pitfall 3: Explanation Evolution Without Clarification
**Problem:** Module 2 explains Kalman filter simply; Module 4 explains more rigorously; students think they contradict
**Solution:**
- Use "Building on Module X..." language
- Note when deeper explanation is being added (not contradicting)
- Use "Note" or "Clarification" callout if correcting prior explanation

### Pitfall 4: Accidental Circular Dependencies
**Problem:** Module A depends on Module B; Module B depends on Module A
**Solution:**
- Build dependency graph (DAG)
- Topological sort to identify cycles
- Restructure modules to break cycles

### Pitfall 5: Difficulty Plateau Too Long
**Problem:** 10 modules at Level 1, then jump to Level 3
**Solution:**
- Track difficulty progression
- Add intermediate Level 2 modules
- Limit consecutive modules at same level (suggests lack of progress)

---

## Integration with Other Skills

**Cross-Module Consistency works with:**
- **Content-Writer:** Ensures written content across modules is consistent
- **Academic-Tone:** Enforces consistent tone across authors
- **Learning-Objective-Mapper:** Ensures learning objectives are clear and build across modules
- **Code-Expert:** Code examples use consistent patterns and terminology
- **Glossary-Manager:** Maintains consistency of terminology definitions
- **Code-Narrator:** Code explanations are consistent across modules

---

## When NOT to Use This Skill

- For within-module consistency (use individual module review)
- For styling/formatting (use academic-tone or ui-pedagogy)
- For brand guidelines (use organizational standards)
- For quick edits (use for major refactors or new module additions)

---

## Reporting & Communication

### Consistency Report Template

```
# Cross-Module Consistency Report
Date: [YYYY-MM-DD]
Modules Audited: [List]
Auditor: [Name]

## Executive Summary
[1-2 paragraph overview of consistency status]

## Critical Issues (Must Fix)
### Issue 1: [Title]
- **Affected Modules:** [List]
- **Problem:** [Description]
- **Impact:** [Why this matters]
- **Fix:** [Specific action]
- **Priority:** CRITICAL

[Additional critical issues...]

## Warnings (Should Fix)
### Warning 1: [Title]
- **Affected Modules:** [List]
- **Problem:** [Description]
- **Recommendation:** [Action]
- **Priority:** MEDIUM

[Additional warnings...]

## Recommendations (Nice-to-Have)
### Recommendation 1: [Title]
- **Suggestion:** [Description]
- **Benefit:** [Why do this]
- **Effort:** [Low/Medium/High]

[Additional recommendations...]

## Metrics
- Total modules: X
- Terminology issues: Y
- Explanation conflicts: Z
- Difficulty jumps: W
- Redundancy instances: V

## Sign-Off
- [ ] All critical issues addressed
- [ ] Warnings reviewed
- [ ] Recommendations considered
- [ ] Final validation passed
```

---

## Save Location

Save it as `.claude/skills/cross-module-consistency/skill.md`
