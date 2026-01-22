---
name: orchestrator
description: Orchestrate and coordinate multiple agents and skills for complex multi-step tasks in the Physical AI & Humanoid Robotics Interactive Textbook. Decide which agents to trigger, enforce execution order, prevent conflicts, and ensure constitutional compliance throughout workflows without directly generating content.
---

# Orchestrator Skill

## Overview

This skill enables systematic orchestration of multiple agents, skills, and tools to execute complex, multi-step workflows for textbook development. It provides decision frameworks for selecting appropriate agents, enforcing dependency-based execution order, preventing conflicts between parallel operations, and ensuring all work adheres to constitutional principles.

## When to Use This Skill

- When a task requires multiple specialized agents working together
- When creating new module or chapter that needs multiple content types
- When refactoring or updating existing content across multiple agents
- When coordinating feature development (spec → plan → tasks → code → testing)
- When preparing large content releases requiring parallel work
- When managing inter-dependent tasks with strict ordering requirements
- When complex projects need validation across multiple stages
- When preventing duplicate work or conflicting changes

## Core Principles

### Orchestration Strategy
- **Clarity First**: Every workflow must be explicitly defined before execution
- **Dependency Awareness**: Enforce prerequisites and sequencing
- **Conflict Prevention**: Identify and prevent competing operations
- **Fail-Safe Design**: Graceful degradation when steps fail
- **Transparency**: Log all decisions and transitions
- **Modularity**: Reusable workflow patterns

### Constitutional Alignment
- Every agent invocation must respect constitution.md
- Validate constraints before triggering agents
- Abort workflows that violate principles
- Document any deviations with explicit reasoning
- Require human approval for exceptions

### No Direct Content Generation
- This skill coordinates, doesn't create content
- Other agents handle writing, coding, designing
- Orchestrator manages workflow, not output
- Focus on sequencing and validation
- Delegate generation to specialized skills

### Resource Awareness
- Respect token budgets (use token-optimizer for compression)
- Manage parallel work (prevent overload)
- Sequential vs. parallel decisions based on dependencies
- Timeout and resource limits for long-running tasks
- Queue management for competing requests

## Step-by-Step Orchestration Workflow

### Phase 1: Task Analysis & Planning

**1.1 Define Workflow Requirements**
```
Questions to Answer:

1. What is the end goal?
   - Example: "Create ROS 2 Fundamentals module"

2. What content types are needed?
   - Example: Spec, lesson content, code examples, diagrams, tests

3. What agents/skills are required?
   - Example: content-writer, code-expert, visual-assets

4. What are the dependencies?
   - Example: Spec must exist before code examples can reference it

5. What are the success criteria?
   - Example: Content published, tests pass, accessibility verified

6. What are the constraints?
   - Example: Budget 50k tokens, 2-week timeline, constitution compliance

7. What could go wrong?
   - Example: Spec changes mid-way, code examples fail, images too large

8. How do we measure success?
   - Example: Lighthouse ≥ 90, all tests pass, user feedback positive
```

**1.2 Identify All Agents Involved**
```
Available Agents/Skills:

Core Content:
- content-writer: Long-form lesson content (6k–7k words)
- code-expert: ROS 2, Gazebo, Isaac Sim code examples
- stylish-ui: Modern buttons, cards, animations for pages

Enhancements:
- visual-assets: Diagrams, figures, image optimization
- ui-animations: Subtle animations, scroll effects, interactions
- token-optimizer: Compress verbose content, reduce token usage

Infrastructure:
- auth-flow: Authentication design, access control
- glossary-manager: Term definitions, consistency
- constitution: Project principles review

Tools:
- Spec/Plan agents (SDD framework)
- Task generation (decompose work)
- PHR recording (preserve decisions)
```

**1.3 Map Task to Agent Capabilities**
```
Matching Tasks to Agents:

Task: "Write lesson on ROS 2 topics"
Agents:
✓ content-writer (6k–7k word lesson)
✓ code-expert (publisher/subscriber examples)
✓ visual-assets (system diagram)
✓ ui-animations (interactive elements)
- stylish-ui (only if UI redesign needed)

Task: "Optimize textbook for AI processing"
Agents:
✓ token-optimizer (compress content)
✓ glossary-manager (check term consistency)
- content-writer (only if content missing)

Task: "Add gated premium module"
Agents:
✓ auth-flow (access control design)
✓ content-writer (lesson content)
✓ stylish-ui (upgrade CTA design)
- code-expert (only if code included)

Key: ✓ = Primary, - = Only if needed
```

**1.4 Identify Dependencies & Sequencing**
```
Dependency Graph Example:

Spec (prerequisite)
  ├─ Content-Writer (depends on spec)
  ├─ Code-Expert (depends on spec)
  └─ Visual-Assets (depends on spec)
        └─ UI-Animations (depends on visual placement)
            └─ Stylish-UI (if redesign needed)
                └─ Token-Optimizer (final compression)
                    └─ Auth-Flow (if gating needed)

Critical Path:
1. Spec (0 deps)
2. Content-Writer + Code-Expert + Visual-Assets (parallel, depends on 1)
3. UI-Animations + Stylish-UI (parallel, depends on 2)
4. Token-Optimizer (depends on 3)
5. Auth-Flow (if applicable, independent)
6. Final validation (depends on all above)

Sequential Constraints:
- Cannot write code without spec (circular dependencies, missing context)
- Cannot optimize tokens before generating content (nothing to optimize)
- Cannot design UI animations before UI exists
- Must validate spec compliance before final publication

Parallel Opportunities:
- Content-Writer and Code-Expert can run simultaneously (same spec)
- Multiple visual-assets can be created in parallel
- Token-Optimizer can run once content is ready
```

**1.5 Check Constitutional Alignment**
```
Pre-Workflow Validation:

Questions:
1. Does this workflow violate any principles in constitution.md?
   - Simulation-first requirement? (Check before code-expert)
   - Educational clarity? (Check content-writer output)
   - Safety considerations? (Check code examples)

2. Are all agents compliant with project ethics?
   - No hallucination? (Verify fact-checking in content)
   - Accessibility required? (Verify in stylish-ui, visual-assets)
   - Learning-by-doing? (Verify in code-expert)

3. Does workflow respect security principles?
   - Secrets never exposed? (Check before deployment)
   - No hardcoded credentials? (Verify in code examples)

4. Are there conflicting constraints?
   - Example: "Simplify at all costs" vs "Technical rigor"
   - Resolution: Balance clarity and accuracy per constitution

Actions if issues found:
- Stop workflow, request clarification
- Adjust agents or their parameters
- Document exception with explicit reasoning
- Require human approval before proceeding
```

### Phase 2: Workflow Design

**2.1 Create Execution Plan**
```
Execution Plan Template:

Project: ROS 2 Fundamentals Module
Goal: Create complete lesson with code, diagrams, UI

Stage 1: Prerequisites & Planning (SERIAL)
  [✓] Spec review and approval
  [✓] Validate against constitution.md
  [✓] Verify existing lesson doesn't duplicate
  [✓] Confirm token budget (aim: 80k tokens max)

Stage 2: Content Generation (PARALLEL)
  [✓] content-writer: Lesson content (6k words)
  [✓] code-expert: Publisher/subscriber examples
  [✓] visual-assets: System architecture diagram
  Wait: All three complete

Stage 3: Enhancement (PARALLEL)
  [✓] ui-animations: Add scroll animations
  [✓] stylish-ui: Design module card
  [✓] visual-assets: Optimize image sizes
  Wait: All three complete

Stage 4: Optimization & Finalization (SERIAL)
  [✓] token-optimizer: Compress verbose sections
  [✓] glossary-manager: Verify term consistency
  [✓] accessibility-reviewer: WCAG compliance check
  [✓] Final validation: Run all checks

Stage 5: Integration & Testing (SERIAL)
  [✓] Build in Docusaurus
  [✓] Test on multiple breakpoints
  [✓] Performance audit (Lighthouse ≥ 90)
  [✓] Deploy to staging

Success Criteria:
- All agents complete without errors
- Content meets learning objectives
- No constitutional violations
- Performance target achieved (Lighthouse ≥ 90)
- Accessibility compliance verified
- Zero token budget overrun
```

**2.2 Define Success/Failure Criteria**
```
For Each Agent:

content-writer:
  Success:
    - Lesson between 6k–7k words
    - All learning objectives addressed
    - Code examples present and relevant
    - No hallucinated facts
  Failure:
    - Exceeds 7k words (use token-optimizer)
    - Missing learning objectives
    - Factual errors discovered
    - Doesn't match spec

code-expert:
  Success:
    - Code runs without errors
    - Examples demonstrate concepts
    - Proper error handling included
    - Tested in target environment
  Failure:
    - Code has syntax errors
    - Examples don't work
    - Safety warnings missing
    - No testing evidence

visual-assets:
  Success:
    - Diagram clearly illustrates concept
    - Alt text descriptive and accurate
    - Images optimized (WebP provided)
    - Accessible (WCAG AA contrast)
  Failure:
    - Diagram unclear or confusing
    - Alt text missing or inadequate
    - File sizes excessive
    - Color contrast insufficient

Overall Workflow:
  Success:
    - All agents succeed
    - No constitutional violations
    - Token budget respected
    - Validation checks pass
  Failure:
    - Any single agent fails
    - Constitutional violation detected
    - Token budget exceeded
    - Critical validation fails
```

**2.3 Plan Rollback & Error Handling**
```
Error Scenarios:

Scenario 1: Agent Fails (e.g., code-expert produces non-functional code)
  Detection: Automated tests fail
  Decision: Rerun agent or request manual intervention?
  Recovery:
    1. Stop dependent tasks
    2. Notify about failure
    3. Option A: Retry agent with adjusted prompt
    4. Option B: Accept manual fix, continue
    5. Document what failed and why

Scenario 2: Mid-Workflow Specification Change
  Example: Spec changed after content-writer started
  Detection: Manual notification
  Recovery:
    1. Pause workflow
    2. Assess impact on dependent tasks
    3. Option A: Restart from beginning with new spec
    4. Option B: Selectively update affected agents
    5. Document change and justification

Scenario 3: Token Budget Exceeded
  Detection: token-optimizer can't compress enough
  Recovery:
    1. Identify largest content sections
    2. Decide: Drop features or request budget increase?
    3. Option A: Remove lowest-priority content
    4. Option B: Request extended timeline/budget
    5. Replan and restart

Scenario 4: Constitutional Violation Discovered
  Example: Code example uses real hardware access
  Detection: Validation step finds issue
  Recovery:
    1. STOP workflow immediately
    2. Identify which agent caused violation
    3. Correct underlying cause
    4. Request human review/approval
    5. Re-validate before continuing

Abort Conditions (Stop Immediately):
- Constitutional violation
- Security vulnerability discovered
- Factual error in critical content
- Persistent agent failure (> 3 retries)
```

### Phase 3: Pre-Execution Validation

**3.1 Verify Prerequisites**
```
Checklist Before Starting:

Content Prerequisites:
- [ ] Specification exists and approved
- [ ] Learning objectives documented
- [ ] Target audience defined
- [ ] Success criteria clear
- [ ] Content doesn't duplicate existing lessons

Resource Prerequisites:
- [ ] Token budget allocated and verified
- [ ] Timeline approved
- [ ] Team members available
- [ ] Infrastructure ready (build server, staging)

Constitutional Prerequisites:
- [ ] constitution.md reviewed
- [ ] Workflow complies with principles
- [ ] Security considerations addressed
- [ ] Accessibility requirements understood
- [ ] Any deviations documented

Tool/Skill Prerequisites:
- [ ] All required agents/skills available
- [ ] Agents have necessary permissions
- [ ] Environment configured correctly
- [ ] Credentials/tokens ready (managed securely)
- [ ] Fallback agents identified
```

**3.2 Validate Agent Readiness**
```
For Each Agent in Workflow:

Questions:
1. Is agent available and functional?
   - Check: Deployed, accessible, no known issues

2. Does agent have required context?
   - Check: Spec provided, examples available, constraints clear

3. Are agent constraints satisfied?
   - Check: Token budget, time, content length limits

4. Are inputs prepared?
   - Check: File paths correct, data formatted, no secrets exposed

5. Is error handling configured?
   - Check: Retry strategy, fallback agents, escalation path

6. Can agent output be validated?
   - Check: Automated tests exist, manual review planned

7. Are dependencies resolved?
   - Check: Prerequisite agents complete, outputs available

8. Is logging/monitoring enabled?
   - Check: Events logged, progress tracked, alerts configured

Action if Not Ready:
- Skip this agent (if optional)
- Wait for dependencies (if required)
- Use fallback agent (if available)
- Fail workflow with error report
```

**3.3 Create Monitoring & Communication Plan**
```
During Execution:

Stakeholder Updates:
- Who: Product manager, team leads
- When: Daily (or per major milestone)
- What: Current stage, progress %, any issues
- How: Slack message, email, standup

Problem Escalation:
- Level 1 (Minor): Agent takes longer than expected
  Action: Extended deadline, notify stakeholders
- Level 2 (Medium): Agent produces subpar output
  Action: Rerun agent, consider fallback
- Level 3 (Critical): Agent fails, Constitutional violation, Security issue
  Action: Immediate escalation, workflow pause, human review

Monitoring Points:
- Agent start/completion
- Token usage (every 10k tokens)
- Error rates
- Output quality checks
- Performance metrics

Logging Format:
{
    "timestamp": "2024-01-15T10:30:45Z",
    "stage": "content_generation",
    "agent": "content-writer",
    "status": "in_progress",
    "progress": "45%",
    "tokens_used": 12450,
    "issues": []
}
```

### Phase 4: Execution & Monitoring

**4.1 Execute Workflow Stages**
```
Standard Execution Pattern:

Stage Start:
1. Log stage initiation
2. Verify all prerequisites satisfied
3. Notify stakeholders
4. Set timeout alarms

During Execution:
1. Monitor agent progress
2. Track token usage
3. Watch for errors/warnings
4. Update status regularly
5. Escalate issues per plan

Stage Completion:
1. Verify outputs exist
2. Run quality checks
3. Validate against success criteria
4. Document completions
5. Decide: Continue to next stage?

Stage Failure:
1. Log failure details
2. Identify root cause
3. Determine: Retry or abort?
4. Execute recovery plan
5. Notify stakeholders

Next Stage Trigger:
- All dependencies satisfied?
- All outputs validated?
- No critical issues?
- If yes: Begin next stage
- If no: Remain in current stage or abort
```

**4.2 Handle Conflicts & Prevent Duplicates**
```
Conflict Detection:

Type 1: Duplicate Work
Problem: Two agents both trying to create same content
Example: content-writer and another agent both writing lesson

Prevention:
- Lock content files during creation
- Check: Is content already in progress?
- Document: Who owns what
- Queue: If duplicate request, wait for first to complete

Type 2: Incompatible Outputs
Problem: One agent's output breaks another agent's assumptions
Example: Code-expert writes code that violates constitution

Prevention:
- Define expected output format per agent
- Validate outputs before passing downstream
- Automated tests on outputs
- Content review before use

Type 3: Resource Contention
Problem: Multiple agents competing for same resource
Example: Both trying to optimize same image

Prevention:
- Sequential scheduling for image optimization
- Token budget allocation per agent
- Queuing system for shared resources
- Time-based locks

Type 4: Specification Conflicts
Problem: Spec changed but agents working on old version
Example: Content-writer uses old spec, code-expert uses new

Prevention:
- Lock spec once workflow starts
- Broadcast spec version to all agents
- Validate: All agents see same spec version
- If spec changes: Pause workflow, re-coordinate

Conflict Resolution Procedure:
1. Detect conflict (automated or manual)
2. Identify affected content/agents
3. Determine: What takes precedence?
4. Option A: Restart with clear priorities
5. Option B: Merge/reconcile outputs
6. Option C: Use version control, rollback to last good state
7. Document conflict and resolution
8. Prevent similar conflicts in future
```

**4.3 Manage Token Usage**
```
Token Budget Management:

Allocation Strategy:
- Total budget: 80k tokens (example)
- content-writer: 40k (50%) — most of text
- code-expert: 20k (25%) — code examples
- visual-assets: 5k (6%) — alt text, captions
- token-optimizer: 10k (12%) — compression pass
- Contingency: 5k (6%) — unexpected needs

Monitoring (Per Agent):
- Report tokens used every 5k consumed
- Alert if exceeds allocation by 10%
- Abort if exceeds allocation by 25%

Example Alert:
"content-writer has used 35k/40k tokens (87%).
If current pace continues, will exceed budget.
Recommend: Content-writer focuses on final sections,
token-optimizer will compress."

Actions if Budget Exceeded:
1. Stop lower-priority agents
2. Invoke token-optimizer early
3. Request human review for shortcuts
4. Consider scope reduction
5. Ask for budget increase (and timeline extension)

Token Optimization Checkpoints:
- After content-writer completes (check verbosity)
- After code-expert completes (check example length)
- After visual-assets completes (check alt text length)
- Before final publication (comprehensive pass)
```

### Phase 5: Validation & Quality Assurance

**5.1 Validate Agent Outputs**
```
Validation Checklist:

For content-writer output:
- [ ] Word count in target range (6k–7k)
- [ ] All learning objectives addressed
- [ ] No hallucinated facts (random sample verified)
- [ ] Code examples match provided specs
- [ ] Constitutional principles followed
- [ ] Accessibility standards met
- [ ] Links/references valid
- [ ] Spelling/grammar correct

For code-expert output:
- [ ] Code is syntactically correct
- [ ] Tested in target environment
- [ ] Error handling present
- [ ] Comments explain key concepts
- [ ] Safety warnings included (if applicable)
- [ ] Dependencies documented
- [ ] Follows project style guide
- [ ] No credentials/secrets in code

For visual-assets output:
- [ ] Diagram clearly illustrates concept
- [ ] Alt text is descriptive (50–125 words)
- [ ] Caption explains learning context
- [ ] Image optimized (WebP provided)
- [ ] Color contrast ≥ 4.5:1
- [ ] File sizes acceptable
- [ ] Tested in light/dark modes
- [ ] Mobile-responsive

For UI/animation agents:
- [ ] Design consistent with theme
- [ ] Responsive across breakpoints
- [ ] Accessibility compliant (WCAG AA)
- [ ] Performance acceptable (Lighthouse ≥ 90)
- [ ] Prefers-reduced-motion respected
- [ ] Works in light/dark modes
- [ ] Cross-browser compatible

Cross-Cutting Validations:
- [ ] No duplicate content
- [ ] Terminology consistent (glossary checked)
- [ ] Spec compliance verified
- [ ] Constitutional principles followed
- [ ] Security considerations addressed
- [ ] Token budget respected
```

**5.2 Run Automated Quality Checks**
```
Quality Gates (Run After Each Agent):

Code Quality:
- Syntax checking (pylint, eslint)
- Type checking (mypy, TypeScript)
- Test execution (unit tests pass)
- Code coverage (> 80%)

Content Quality:
- Readability scoring (Flesch-Kincaid)
- Spelling/grammar (automated checker)
- Link validation (broken links detected)
- Image accessibility (alt text present)

Performance:
- Lighthouse audit (score ≥ 90)
- Bundle size check (under limits)
- Page load time (< 2s FCP)
- Cumulative layout shift (< 0.1)

Security:
- No hardcoded secrets (secret scanner)
- No SQL injection vulnerabilities
- HTTPS enforced
- CORS properly configured

Accessibility:
- WCAG AA compliance (axe scan)
- Color contrast verified
- Screen reader testable
- Keyboard navigation functional

Failure Handling:
- If critical check fails: Block progression
- If minor check fails: Log but continue
- Create issue ticket for failed checks
- Document quality baseline and improvement plan
```

**5.3 Integration Testing**
```
Full Integration Tests:

Test 1: Content Flows Correctly
- Lesson loads in Docusaurus
- Links to related content work
- Navigation functions
- Responsive design works
- All images load

Test 2: Code Examples Work
- Code runs without errors
- Expected output appears
- Error handling works
- All dependencies available
- Tested on target platform

Test 3: Visual Elements Display
- Diagrams render correctly
- Images load and scale
- UI components display properly
- Animations perform smoothly
- Light/dark modes both work

Test 4: Accessibility
- Screen reader announces content
- Keyboard navigation complete
- Color contrast sufficient
- Focus visible on all elements
- Content survives zoom

Test 5: Performance
- Load time acceptable
- Animations smooth (60fps)
- No layout shifts
- Images optimized
- Lighthouse ≥ 90
```

### Phase 6: Documentation & Handoff

**6.1 Document Workflow Execution**
```
Execution Summary Template:

Project: ROS 2 Fundamentals Module
Completion Date: 2024-01-20
Status: ✓ Complete / ⚠ Partial / ✗ Failed

Agents Executed:
- content-writer: ✓ Complete (6,200 words, 18 learning activities)
- code-expert: ✓ Complete (3 examples, all tested)
- visual-assets: ✓ Complete (2 diagrams, 1 optimized)
- ui-animations: ✓ Complete (scroll animations, hover effects)
- token-optimizer: ✓ Complete (25% compression, maintained clarity)

Token Usage:
- Allocated: 80,000
- Used: 62,340 (77.9%)
- Remaining: 17,660 (22.1%)
- Overflow: None ✓

Validation Results:
- Constitutional: ✓ Pass
- Accessibility: ✓ Pass (WCAG AA)
- Performance: ✓ Pass (Lighthouse 94)
- Security: ✓ Pass (no vulnerabilities)
- Learning: ✓ Pass (objectives met)

Issues Encountered:
1. Code-expert initially missed safety warning
   - Resolution: Re-run with safety focus
   - Time impact: +2 hours

2. First diagram too complex
   - Resolution: Simplified and re-created
   - Time impact: +1 hour

3. Token budget tracking incomplete
   - Resolution: Implemented per-agent tracking
   - Time impact: +0.5 hour

Key Decisions Made:
- Decision 1: Use TOTP for MFA instead of SMS (security + reliability)
  Rationale: Higher security, more reliable than SMS in all regions
  Documented in: ADR #5

- Decision 2: Reduce animation duration from 300ms to 200ms
  Rationale: Felt sluggish in user testing
  Documented in: Commit abc123def

Lessons Learned:
1. Code examples need safety warnings from the start
2. Simplified diagrams communicate better
3. Token budget tracking should be automated
4. Constitutional checks should happen per agent (not just at end)

Recommendations for Future Workflows:
1. Build safety template for code-expert prompts
2. Create diagram simplification checklist
3. Implement real-time token tracking
4. Add constitutional validation at each stage
5. Include user testing earlier in workflow
```

**6.2 Create PHR (Prompt History Record)**
```
File Structure:
history/prompts/ros2-fundamentals/001-workflow-orchestration.workflow.md

Content:
---
id: "001"
title: "ROS 2 Fundamentals Module - Workflow Orchestration"
stage: "orchestration"
date_iso: "2024-01-15"
surface: "agent"
model: "claude-haiku-4-5"
feature: "ros2-fundamentals"
branch: "001-physical-ai-textbook"
user: "team"
command: "/orchestrator"
labels: ["workflow", "multi-agent", "ros2"]
links:
  spec: "specs/ros2-fundamentals/spec.md"
  ticket: "https://github.com/org/repo/issues/123"
  adr: "history/adr/005-mfa-strategy.md"
files_yaml: |
  - content-writer output
  - code-expert output
  - visual-assets output
  - ui-animations output
tests_yaml: |
  - Lighthouse audit (94/100)
  - WCAG AA compliance
  - Code execution tests (3/3 passed)
outcome: "success"
evaluation: "All objectives met, token budget respected, no violations"
---

## Workflow Summary

Orchestrated multi-agent workflow for ROS 2 Fundamentals module:
- Sequence: Spec → [content-writer + code-expert + visual-assets] → [ui-animations + token-optimizer]
- Result: Complete module with 6.2k words, 3 code examples, 2 diagrams
- Quality: Lighthouse 94, WCAG AA, no constitutional violations
- Efficiency: 77.9% of token budget used, 25% compression achieved

## Key Decisions

1. Parallel execution of content generation (content-writer, code-expert, visual-assets)
   - Rationale: Independent tasks, no blocking dependencies
   - Result: Reduced total execution time by 40%

2. Token-optimizer as final pass before integration
   - Rationale: Compress after content complete, before deployment
   - Result: 25% size reduction, maintained clarity

3. User testing deferred to post-launch
   - Rationale: Timeline constraints
   - Future: Include earlier in workflow for faster iterations
```

**6.3 Prepare for Handoff**
```
Handoff Checklist:

Documentation:
- [ ] Workflow documented with success/failures
- [ ] PHR created and filed
- [ ] All decisions recorded in ADRs/comments
- [ ] Token usage analyzed and reported
- [ ] Lessons learned captured
- [ ] Recommendations for future workflows

Content Ready:
- [ ] All outputs validated
- [ ] Files organized in correct locations
- [ ] Markdown properly formatted
- [ ] Images optimized and in place
- [ ] Code examples tested
- [ ] References all valid

Quality Verified:
- [ ] Lighthouse ≥ 90
- [ ] WCAG AA compliance
- [ ] Constitutional principles verified
- [ ] No security vulnerabilities
- [ ] No hardcoded secrets
- [ ] Accessibility tested

Testing Complete:
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual review completed
- [ ] User testing (if applicable)
- [ ] All known issues resolved or documented

Team Communication:
- [ ] Status reported to stakeholders
- [ ] Team notified of completion
- [ ] Handoff meeting scheduled
- [ ] Q&A documented
- [ ] Next steps clear

Deployment Ready:
- [ ] Staging deployment verified
- [ ] Ready for production
- [ ] Rollback plan documented
- [ ] Monitoring configured
- [ ] Support team briefed
```

## Orchestration Patterns & Examples

### Example 1: Create Complete Module (Complex, Multi-Step)

**Workflow Definition:**
```yaml
name: "Create Complete Module"
objective: "Build full-featured ROS 2 module with spec, content, code, diagrams, UI"
timeline: "5 working days"
token_budget: "80,000"

stages:
  - name: "Specification"
    agents: ["specification-writer"]
    dependencies: []
    parallel: false
    timeout: "4 hours"

  - name: "Content Generation"
    agents: ["content-writer", "code-expert", "visual-assets"]
    dependencies: ["Specification"]
    parallel: true
    timeout: "12 hours"

  - name: "Enhancement"
    agents: ["ui-animations", "stylish-ui"]
    dependencies: ["Content Generation"]
    parallel: true
    timeout: "8 hours"

  - name: "Optimization"
    agents: ["token-optimizer", "glossary-manager"]
    dependencies: ["Enhancement"]
    parallel: false
    timeout: "4 hours"

  - name: "Validation"
    agents: ["accessibility-reviewer", "code-quality-reviewer"]
    dependencies: ["Optimization"]
    parallel: true
    timeout: "4 hours"

  - name: "Finalization"
    agents: ["deployment-validator"]
    dependencies: ["Validation"]
    parallel: false
    timeout: "2 hours"
```

**Execution Flow:**
```
Day 1:
  09:00 - Specification: 4 hours
         Output: Complete spec (learning objectives, structure, success criteria)

Day 2-3:
  09:00 - Content Generation (parallel): 12 hours
         - content-writer: Lesson content (6k–7k words)
         - code-expert: 3 working code examples
         - visual-assets: 2 diagrams + optimized images

Day 4:
  09:00 - Enhancement (parallel): 8 hours
         - ui-animations: Scroll triggers, hover effects
         - stylish-ui: Card design, button styles
         - Integration: Combine with content

Day 4 (afternoon):
  17:00 - Optimization (serial): 4 hours
         - token-optimizer: Compress verbose sections (25% target)
         - glossary-manager: Verify terminology consistency

Day 5:
  09:00 - Validation (parallel): 4 hours
         - accessibility-reviewer: WCAG AA compliance
         - code-quality-reviewer: Code standards

  13:00 - Finalization: 2 hours
         - deployment-validator: Build and deploy to staging

  15:00 - COMPLETE
```

**Success Criteria:**
```
Specification:
- [ ] Learning objectives defined (3–5)
- [ ] Content structure outlined
- [ ] Success criteria clear
- [ ] No ambiguities

Content:
- [ ] Lesson 6–7k words
- [ ] All objectives addressed
- [ ] Code examples work
- [ ] Diagrams clear

Enhancement:
- [ ] UI modern and responsive
- [ ] Animations smooth (60fps)
- [ ] Consistent with design system

Optimization:
- [ ] 20–30% token reduction
- [ ] Clarity maintained
- [ ] Terminology consistent

Validation:
- [ ] Lighthouse ≥ 90
- [ ] WCAG AA compliant
- [ ] Code passes all tests
- [ ] No security issues

Final:
- [ ] Deployed to staging
- [ ] Ready for production
- [ ] Documentation complete
```

---

### Example 2: Rapid Content Update (Smaller, Time-Constrained)

**Workflow Definition:**
```yaml
name: "Quick Content Update"
objective: "Fix and update existing lesson section (no redesign)"
timeline: "1 day"
token_budget: "15,000"

stages:
  - name: "Assessment"
    agents: ["content-validator"]
    dependencies: []
    timeout: "1 hour"
    decision: "Proceed or defer to full redesign?"

  - name: "Content Update"
    agents: ["content-writer"]
    dependencies: ["Assessment (proceed)"]
    timeout: "4 hours"

  - name: "Minor Enhancements"
    agents: ["token-optimizer"]
    dependencies: ["Content Update"]
    timeout: "1 hour"

  - name: "Quick Validation"
    agents: ["accessibility-reviewer"]
    dependencies: ["Minor Enhancements"]
    timeout: "1 hour"

  - name: "Deploy"
    agents: ["deployment-validator"]
    dependencies: ["Quick Validation"]
    timeout: "1 hour"
```

**Execution Flow:**
```
Day 1:
  09:00 - Assessment: 1 hour
         Review: Is this a quick fix or major overhaul?
         Result: Proceed with quick update

  10:00 - Content Update: 4 hours
         Update specific section with corrections/improvements

  14:00 - Optimization: 1 hour
         Compress if needed to stay under token budget

  15:00 - Validation: 1 hour
         Run accessibility checks

  16:00 - Deploy: 1 hour
         Push to staging/production

  17:00 - COMPLETE
```

---

### Example 3: Refactor for Token Optimization (Cleanup Task)

**Workflow Definition:**
```yaml
name: "Refactor & Optimize"
objective: "Compress verbose textbook sections without losing clarity"
timeline: "3 days"
token_budget: "40,000"

stages:
  - name: "Identify Targets"
    agents: ["content-validator"]
    dependencies: []
    timeout: "2 hours"
    output: "List of sections to optimize (prioritized)"

  - name: "Compress Content"
    agents: ["token-optimizer"]
    dependencies: ["Identify Targets"]
    timeout: "6 hours"
    config: "aggressive: true, clarity_threshold: 0.95"

  - name: "Quality Review"
    agents: ["content-validator", "code-quality-reviewer"]
    dependencies: ["Compress Content"]
    parallel: true
    timeout: "4 hours"
    check: "Did compression hurt clarity or correctness?"

  - name: "Publish Changes"
    agents: ["deployment-validator"]
    dependencies: ["Quality Review (pass)"]
    timeout: "1 hour"
```

**Success Criteria:**
```
- 30–40% token reduction achieved
- Readability grade level drop ≤ 0.5
- Comprehension test drop ≤ 10%
- No technical accuracy lost
- Code examples still runnable
```

## Orchestration Decision Tree

```
START: New Task Request

1. TASK ANALYSIS
   Is this a single-agent task?
   ├─ Yes → Use single agent directly
   └─ No → Continue to multi-agent orchestration

2. SCOPE ASSESSMENT
   How many agents needed?
   ├─ 2–3 agents → Simple linear workflow
   ├─ 4–6 agents → Complex workflow with parallelization
   └─ 7+ agents → Requires careful sequencing

3. DEPENDENCY MAPPING
   Are there blocking dependencies?
   ├─ Yes → Plan strict sequence
   └─ No → Maximize parallel execution

4. COMPLEXITY CHECK
   Is workflow complex (> 20 steps)?
   ├─ Yes → Break into smaller sub-workflows
   └─ No → Execute as single workflow

5. CONSTITUTIONAL REVIEW
   Does workflow violate any principles?
   ├─ Yes → Adjust or abort
   └─ No → Proceed to execution

6. RESOURCE VERIFICATION
   All prerequisites ready?
   ├─ No → Wait and retry
   └─ Yes → Start execution

7. EXECUTION
   Run workflow with monitoring

8. VALIDATION
   Check all outputs against criteria
   ├─ All pass → Success
   ├─ Some fail → Remediate
   └─ Critical fail → Abort and investigate

9. DOCUMENTATION
   Record execution, decisions, lessons learned

10. COMPLETION
    Workflow complete, results available for next stage
```

## Tools & Infrastructure

### Workflow Management Tools
- **Make.com** — No-code workflow automation
- **Apache Airflow** — Workflow orchestration (complex)
- **GitHub Actions** — CI/CD workflow automation
- **Zapier** — Simple automation workflows
- **Custom Python Scripts** — For specific needs

### Monitoring & Logging
- **Datadog** — Workflow monitoring
- **Splunk** — Log aggregation
- **CloudWatch** — AWS monitoring
- **Prometheus** — Metrics collection
- **Custom logging** — Per-agent status tracking

### Communication & Alerts
- **Slack** — Team notifications
- **Email** — Status updates
- **PagerDuty** — Critical alerts
- **Custom webhooks** — Integration points

### Version Control & Artifacts
- **Git** — Source control
- **GitHub/GitLab** — Repository hosting
- **Artifact storage** — S3, GCS for intermediate outputs
- **Database** — Execution history, logs

## Acceptance Criteria

- [ ] Workflow plan documented and approved
- [ ] All agent dependencies identified
- [ ] Sequencing optimized (parallelization where possible)
- [ ] Constitutional alignment verified before execution
- [ ] Success/failure criteria defined per agent
- [ ] Error handling and rollback plans in place
- [ ] Monitoring and alerting configured
- [ ] Pre-execution validation checklist completed
- [ ] All agents complete without critical errors
- [ ] Output validation passes for all agents
- [ ] Integration testing successful
- [ ] Token budget respected
- [ ] Accessibility and performance targets met
- [ ] Execution documented in PHR
- [ ] Handoff documentation complete

## Quality Checklist

**Planning Quality:**
- [ ] Task clearly defined with specific objectives
- [ ] All agents/skills mapped to requirements
- [ ] Dependencies identified and sequenced
- [ ] Realistic timeline and resource estimates
- [ ] Success criteria concrete and measurable
- [ ] Risk assessment completed

**Execution Quality:**
- [ ] Workflow executed as planned
- [ ] Monitoring active throughout
- [ ] Issues detected and escalated timely
- [ ] Communication regular to stakeholders
- [ ] Token budget tracked real-time
- [ ] Quality gates passed at each stage

**Validation Quality:**
- [ ] Outputs validated against criteria
- [ ] Automated checks run successfully
- [ ] Constitutional principles verified
- [ ] No security vulnerabilities present
- [ ] Accessibility standards met
- [ ] Performance targets achieved

**Documentation Quality:**
- [ ] Execution summary comprehensive
- [ ] PHR created and properly filed
- [ ] Decisions documented with rationale
- [ ] Lessons learned captured
- [ ] Handoff documentation clear
- [ ] Issues tracked for future improvement

---

Save it as `.claude/skills/orchestrator/skill.md`
