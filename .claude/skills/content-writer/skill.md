---
name: content-writer
description: Write academically rigorous, well-structured long-form textbook content for the Physical AI & Humanoid Robotics Interactive Textbook. Create 6k–7k word chapters with learning objectives, summaries, and rigorous citations while maintaining simulation-first framing and constitutional guidelines.
---

# Content Writer Skill

## Overview

This skill enables the creation of academically rigorous, well-structured textbook content for the Physical AI & Humanoid Robotics Interactive Textbook. It provides a systematic workflow for writing long-form technical chapters that maintain clarity, include proper learning scaffolding, and adhere to constitutional principles without hallucination or unverified claims.

## When to Use This Skill

- Creating new lessons or chapters for the textbook
- Expanding existing textbook modules with deeper content
- Writing foundational concepts in robotics, AI, or simulation
- Developing interdisciplinary content spanning hardware, software, and theory
- Building multi-week curricula with coherent progression

## Core Principles

### Academic Rigor
- Every factual claim must be verifiable through primary sources or well-established references
- Distinguish between theoretical foundations and practical implementation
- Include precise definitions and mathematical notation where appropriate
- Acknowledge limitations, edge cases, and open research questions
- Cite sources explicitly; never hallucinate data or research findings

### Simulation-First Framing
- Prioritize simulation environments (ROS 2, Gazebo, Isaac Sim) over physical hardware
- Lead with simulation concepts before mentioning real-world deployment
- Use simulation as the primary learning medium
- Clearly demarcate "simulation vs. reality" considerations
- Frame physical robotics as an extension of simulation principles

### Accessibility & Clarity
- Assume readers have basic programming knowledge but may lack robotics background
- Introduce domain-specific terminology with clear definitions
- Use analogies and visual descriptions to explain complex concepts
- Break long explanations into digestible sections
- Balance depth with readability

### Constitutional Alignment
- Follow all code standards, safety guidelines, and ethical principles from `constitution.md`
- Maintain safety-first language when discussing physical systems
- Prioritize transparency over brevity (explain reasoning, not just answers)
- Ensure content supports learning-by-doing methodology
- Avoid overengineering examples; keep them focused and minimal

## Step-by-Step Writing Workflow

### Phase 1: Preparation & Research

**1.1 Define Learning Objectives**
- Identify 3–5 specific, measurable learning outcomes using Bloom's taxonomy
- Example objectives:
  - Understand the pub/sub communication pattern in ROS 2
  - Implement a custom subscriber node in Python
  - Compare centralized vs. distributed control architectures
  - Evaluate performance trade-offs in different sensor fusion approaches
- Ensure objectives progress from foundational to applied understanding
- Verify objectives align with module prerequisites and downstream content

**1.2 Conduct Source Research**
- Gather primary sources: academic papers, technical documentation, official tutorials
- Verify all sources through the project's established references or literature database
- Create an annotated bibliography with key quotes and page numbers
- Identify knowledge gaps that require additional research
- Flag any areas where consensus is unclear or evolving
- NEVER invent studies, statistics, or experimental results

**1.3 Outline the Content**
- Create a hierarchical outline with main sections (3–5 major sections)
- Break each section into 4–6 subsections (~1,000 words each)
- Plan example placement: one practical example per major section minimum
- Estimate reading time based on word count and complexity
- Identify code examples, diagrams, and simulations to include
- Map each section to specific learning objectives

**1.4 Plan Examples & Simulations**
- Design 2–3 complete, runnable code examples (not snippets)
- Ensure examples demonstrate core concepts without unnecessary complexity
- Plan simulation setups (URDF files, launch files, configuration)
- Identify prerequisites (setup, packages, dependencies) for each example
- Create step-by-step execution instructions
- Plan expected output and success criteria

### Phase 2: Structural Content Writing

**2.1 Write the Introduction**
- Hook the reader with a relevant question or application scenario
- Briefly preview the 3 main concepts to be covered
- State the learning objectives explicitly
- Explain why this content matters in the broader context
- Include estimated reading time (aim for 30–60 min for 6k words)
- Target length: 500–800 words

**2.2 Write Section 1: Foundational Concepts**
- Define all key terminology with precise, accessible language
- Introduce theoretical foundations (math, principles, algorithms)
- Use analogies to connect new concepts to familiar ideas
- Include 1–2 simple diagrams or visualizations
- Avoid overwhelming detail; save advanced math for dedicated subsections
- Target length: 1,200–1,500 words

**2.3 Write Section 2: Practical Implementation**
- Introduce the first complete code example with full context
- Walk through the example line-by-line, explaining intent and mechanics
- Show the simulation setup (launch files, parameters, environment)
- Explain how to run the example and interpret output
- Highlight key takeaways and common mistakes
- Include code comments that explain the "why", not just the "what"
- Target length: 1,500–2,000 words

**2.4 Write Section 3: Advanced Applications or Variations**
- Extend the core concept to more complex scenarios
- Introduce a second code example showing an advanced technique
- Compare different approaches with trade-off analysis
- Discuss when to apply each approach
- Include performance considerations or scalability insights
- Mention research frontiers or open questions
- Target length: 1,500–2,000 words

**2.5 Write Section 4: Debugging, Edge Cases, and Best Practices**
- Address common misconceptions and debugging strategies
- Discuss edge cases and failure modes
- Provide best practices and design patterns
- Include a "What Can Go Wrong" subsection with solutions
- Relate back to constitutional principles and safety considerations
- Target length: 1,000–1,200 words

**2.6 Write the Summary**
- Recap the 3 main concepts covered
- Synthesize key takeaways in 2–3 bullet points
- Reinforce connection to learning objectives
- Suggest follow-up reading or next steps
- Include pointers to related modules or advanced topics
- Target length: 300–500 words

### Phase 3: Code Examples & Assets

**3.1 Create Complete Code Examples**
- Provide full, runnable Python or C++ code (no pseudocode snippets)
- Use consistent style aligned with project standards
- Add docstrings and comments explaining critical sections
- Include error handling appropriate to the context
- Provide setup instructions (dependencies, installation)
- Include example output showing successful execution
- Save examples in a dedicated `examples/` directory

**3.2 Create Simulation Assets**
- Write URDF/SDF files for any robot models used
- Create launch files with all necessary ROS 2 configuration
- Document parameter values and tuning guidelines
- Include Gazebo or Isaac Sim world files if applicable
- Provide configuration files (YAML) for any tuneable parameters
- Add instructions for modifying and extending simulations

**3.3 Create Diagrams & Visualizations**
- Use block diagrams for system architecture
- Use flowcharts for algorithms or decision trees
- Create sequence diagrams for communication patterns
- Use graphs for performance comparisons
- Ensure diagrams are clear, labeled, and referenced in text
- Provide source files (SVG, Excalidraw) for future editing

### Phase 4: Verification & Refinement

**4.1 Fact-Check Every Claim**
- Verify all quantitative statements (speeds, frequencies, thresholds)
- Cross-reference academic claims against cited sources
- Check API and library function signatures against official documentation
- Validate code examples by running them in target environments
- Confirm all citations are accurate and properly formatted
- Flag any unverified claims and either source them or remove them

**4.2 Test Code Examples End-to-End**
- Execute all code examples in a clean environment
- Verify output matches documented expectations
- Test edge cases and error conditions
- Confirm setup instructions are complete and correct
- Time the examples to ensure they complete in reasonable duration
- Document any system-specific considerations (Windows, macOS, Linux)

**4.3 Assess Reading Flow & Clarity**
- Read the full chapter aloud to catch awkward phrasing
- Verify transitions between sections are smooth
- Check that terminology is introduced before use
- Ensure learning objectives are met by the content
- Confirm examples clearly demonstrate the concepts they're meant to illustrate
- Verify academic tone is consistent throughout

**4.4 Validate Alignment**
- Cross-check against `constitution.md` for standards and ethics
- Verify simulation-first framing is maintained throughout
- Confirm safety considerations are addressed where relevant
- Ensure content supports the stated learning objectives
- Check that prerequisites are minimal and clearly stated
- Verify connections to related modules are accurate

### Phase 5: Final Polish & Metadata

**5.1 Add Metadata & Headers**
- Include YAML frontmatter with:
  - `title`: Clear, descriptive chapter title
  - `learning_objectives`: Array of 3–5 objectives
  - `estimated_reading_time`: Minutes (aim for 40–60 min for 6k–7k words)
  - `prerequisites`: Array of required prior knowledge
  - `related_modules`: Links to connected chapters
  - `difficulty_level`: Beginner, Intermediate, or Advanced
  - `simulation_environment`: ROS 2, Gazebo, Isaac Sim, etc.

**5.2 Create a Table of Contents**
- Auto-generate or manually create heading hierarchy
- Ensure all major sections are included
- Verify heading levels are correct (H2 for sections, H3 for subsections)
- Add anchor links for easy navigation

**5.3 Proofread & Edit**
- Fix typos, grammar, and punctuation errors
- Simplify overly complex sentences
- Remove redundancy and tighten prose
- Verify citation formatting is consistent
- Check code block syntax highlighting
- Ensure all links are functional

**5.4 Create Chapter Review Checklist**
- Does content match all learning objectives?
- Are all facts verified and sourced?
- Do code examples run without errors?
- Is academic tone maintained throughout?
- Are accessibility and safety considerations addressed?
- Does simulation-first framing persist?
- Is constitution.md compliance verified?

## Writing Examples from Robotics Modules

### Example 1: ROS 2 Publisher/Subscriber Chapter

**Title:** Understanding ROS 2 Pub/Sub Communication Patterns

**Learning Objectives:**
1. Explain the publish-subscribe pattern and its advantages in distributed systems
2. Implement a custom ROS 2 publisher node in Python
3. Implement a custom ROS 2 subscriber node that processes messages
4. Debug communication issues using `ros2 topic` command-line tools
5. Design a multi-node system with multiple publishers and subscribers

**Section 1 Structure:** Foundational Concepts (1,300 words)
- The publish-subscribe pattern: definition and historical context
- ROS 2 topics as the primary communication mechanism
- Message types and definition language (IDL)
- Quality of Service (QoS) settings and trade-offs
- Diagram showing pub/sub architecture

**Section 2 Structure:** Practical Implementation (1,800 words)
- Complete Python publisher example: sensor data streaming
- Walking through the code (node setup, publisher creation, publishing loop)
- Running in simulation: Gazebo sensor output
- Complete Python subscriber example: processing sensor data
- Walking through the code (subscription callback, message handling)

**Section 3 Structure:** Advanced Applications (1,600 words)
- Multiple publishers and subscribers in a single system
- Topic remapping and namespace management
- Asynchronous vs. synchronous processing
- Latency considerations in real-time robotics
- Example: distributed humanoid control with decoupled components

**Section 4 Structure:** Debugging & Best Practices (1,100 words)
- Using `ros2 topic list`, `ros2 topic echo`, `ros2 topic info`
- Common pitfalls: queueing, synchronization, message frequency mismatches
- Performance optimization: buffer sizes, callback threading
- Testing strategies using simulation

---

### Example 2: Digital Twin Fundamentals Chapter

**Title:** Building Digital Twins for Humanoid Robots

**Learning Objectives:**
1. Define digital twins and their role in robotics development
2. Distinguish between digital twins and conventional simulations
3. Implement data synchronization between simulated and physical systems
4. Evaluate trade-offs in digital twin fidelity vs. computational cost
5. Design a digital twin architecture for a humanoid locomotion task

**Section 1 Structure:** Foundational Concepts (1,500 words)
- Definition: digital twins as persistent virtual replicas
- Historical development: from CAD to real-time mirrors
- Use cases in robotics: simulation-to-reality transfer, predictive maintenance
- Simulation vs. digital twin vs. digital shadow (terminology clarification)
- Diagram showing digital twin architecture

**Section 2 Structure:** Practical Implementation (1,900 words)
- Building a digital twin in Isaac Sim for a humanoid robot
- Creating physics-accurate joint models and actuator simulation
- Synchronizing sensor data (IMU, cameras, force sensors)
- Example: kinematic and dynamic parameter identification
- Running a simple control task in simulation and validating results

**Section 3 Structure:** Advanced Applications (1,500 words)
- Multi-timescale digital twins (real-time critical vs. offline analysis)
- Using digital twins for control law development
- Sim-to-real transfer with domain randomization
- Example: training a neural network controller in simulation
- Evaluating digital twin accuracy through validation protocols

**Section 4 Structure:** Debugging & Best Practices (1,100 words)
- Common sources of sim-to-real gap: friction, sensor noise, delays
- Validation metrics for digital twin fidelity
- Debugging mismatches between simulation and physical hardware
- Safety considerations when deploying sim-trained controllers
- Tools for analyzing digital twin performance

---

### Example 3: Sensor Fusion in Humanoid Robotics Chapter

**Title:** Multi-Sensor Fusion for Humanoid State Estimation

**Learning Objectives:**
1. Explain sensor fusion principles and their application to humanoid robotics
2. Compare fusion algorithms: Kalman filtering, extended Kalman filtering, particle filtering
3. Implement an Extended Kalman Filter (EKF) for bipedal state estimation
4. Design a multi-sensor fusion pipeline in ROS 2
5. Evaluate fusion performance using metrics (RMSE, convergence time)

**Section 1 Structure:** Foundational Concepts (1,400 words)
- Sensor fusion definition and motivation in humanoid robotics
- Sources of uncertainty: sensor noise, model mismatch, computational delays
- Mathematical foundations: state-space models, recursive estimation
- Introduction to Kalman filtering (linear case)
- Diagram showing sensor fusion architecture for a humanoid

**Section 2 Structure:** Practical Implementation (2,000 words)
- Extended Kalman Filter (EKF) theory: linearization and state propagation
- Complete Python implementation of EKF for humanoid state estimation
- Sensor models: IMU (acceleration, angular velocity), foot contact, joint encoders
- Integrating EKF into a ROS 2 node with multi-threaded callbacks
- Running the EKF in Gazebo simulation with a humanoid model
- Visualizing filter performance and uncertainty estimates

**Section 3 Structure:** Advanced Applications (1,500 words)
- Particle filtering for non-Gaussian distributions
- Unscented Kalman Filter (UKF) for higher accuracy
- Multi-hypothesis tracking for ambiguous sensor data
- Example: fusion pipeline for bipedal gait estimation
- Performance comparison: EKF vs. UKF vs. particle filter in simulation

**Section 4 Structure:** Debugging & Best Practices (1,100 words)
- Tuning covariance matrices (process noise, measurement noise)
- Detecting and handling sensor faults
- Monitoring filter divergence and stability
- Real-time performance considerations
- Validation using ground-truth data from simulation

---

## Content Structure Template

```markdown
---
title: [Chapter Title]
learning_objectives:
  - "Objective 1: [Specific, measurable outcome]"
  - "Objective 2: [Specific, measurable outcome]"
  - "Objective 3: [Specific, measurable outcome]"
  - "Objective 4: [Specific, measurable outcome]"
  - "Objective 5: [Specific, measurable outcome]"
estimated_reading_time: 45
prerequisites:
  - "Prerequisite 1"
  - "Prerequisite 2"
related_modules:
  - "Module/Chapter Name"
  - "Module/Chapter Name"
difficulty_level: "Intermediate"
simulation_environment: "ROS 2, Gazebo"
---

# [Chapter Title]

## Introduction
[Hook + overview + preview of 3 main concepts + learning objectives + reading time]
(500–800 words)

## Section 1: [Foundational Concept]
[Define terminology, explain theory, introduce principles]
(1,200–1,500 words)

### Key Concepts
- Concept 1
- Concept 2

### Important Definitions
> **Term**: Clear, precise definition.

## Section 2: [Practical Implementation]
[Complete code example with explanation + simulation setup + execution]
(1,500–2,000 words)

### Example: [Descriptive Title]
[Full code block with comments and explanation]

### Running the Example
1. Step 1
2. Step 2
3. Step 3

### Expected Output
[Description of expected results]

## Section 3: [Advanced Applications]
[Extended concepts + second example + trade-offs + research frontiers]
(1,500–2,000 words)

### Advanced Example: [Descriptive Title]
[Full code block demonstrating advanced technique]

## Section 4: [Debugging & Best Practices]
[Common mistakes + edge cases + optimization + safety]
(1,000–1,200 words)

### What Can Go Wrong
- **Problem**: [Description]
  **Solution**: [How to fix it]
- **Problem**: [Description]
  **Solution**: [How to fix it]

### Best Practices
1. Practice 1
2. Practice 2
3. Practice 3

## Summary
[Recap + key takeaways + learning objectives review + next steps]
(300–500 words)

## Further Reading
- [Source 1]
- [Source 2]
- [Source 3]

## Appendix: Glossary
> **Term 1**: Definition.
> **Term 2**: Definition.
```

## Tools & Resources

### Research & Verification Tools
- **Primary Sources**: IEEE Xplore, arXiv, Google Scholar
- **Documentation**: Official ROS 2, Gazebo, Isaac Sim documentation
- **Simulation Environments**: ROS 2, Gazebo, Isaac Sim, CoppeliaSim
- **Code Repository**: GitHub for reference implementations and examples
- **Literature Database**: Project-maintained reference library or Zotero

### Writing & Content Tools
- **Markdown Editor**: VS Code with MDX support
- **Spell & Grammar**: Grammarly, LanguageTool
- **Citation Manager**: Zotero, Mendeley (for bibliography formatting)
- **Diagram Tools**: Excalidraw, Mermaid, Draw.io
- **Code Testing**: Python interpreter, ROS 2 environment, Gazebo

### Validation Tools
- **Constitution Checker**: Review against `constitution.md`
- **Plagiarism Detection**: Turnitin, Copyscape (for original content verification)
- **Fact-Checking**: Cross-reference with primary sources
- **Code Verification**: Linting (pylint, flake8), execution in clean environment
- **Accessibility**: Readability checkers (Hemingway Editor), screen reader testing

### Collaborative & Tracking Tools
- **Version Control**: Git for tracking content iterations
- **Collaboration**: Google Docs or Overleaf for peer review
- **Project Management**: Notion, Asana for chapter tracking
- **Feedback**: Comments and annotations in documents

## Writing Standards & Guidelines

### Language & Tone
- **Academic but accessible**: Use precise technical language without unnecessary jargon
- **Active voice**: Prefer "We implement the controller" over "The controller is implemented"
- **Present tense**: Use present tense for timeless concepts, past tense for historical context
- **First person**: Use "we" and "our" to build community and transparency
- **Avoid hedging**: Be definitive unless expressing genuine uncertainty

### Technical Accuracy
- **No hallucination**: Every claim must be verifiable
- **Citations required**: Use bracketed citations [Author, Year] for all external claims
- **Precise terminology**: Use robotics/AI domain terms consistently and correctly
- **Mathematical rigor**: Use proper notation; define all variables and functions
- **Code authenticity**: All code examples must be tested and functional

### Structure & Organization
- **Clear hierarchy**: Use consistent heading levels (H1 for title, H2 for sections, H3 for subsections)
- **Logical flow**: Each section builds on prior content
- **Transitions**: Use clear transitions between paragraphs and sections
- **Examples first**: Place practical examples before theoretical extensions
- **Modular sections**: Write sections that can stand alone if needed for reference

### Accessibility
- **Plain language**: Define technical terms when first introduced
- **Varied sentence length**: Mix short and long sentences for readability
- **Visual aids**: Include diagrams, figures, and code examples
- **Descriptive headings**: Use specific, descriptive headings (not "Basics" but "Understanding ROS 2 Topics")
- **Readability**: Aim for Flesch-Kincaid Grade 12–14 level

### Safety & Ethics
- **Simulation-first**: Always prioritize simulation in examples
- **Real-world warnings**: Clearly mark any content involving physical robots
- **Ethical considerations**: Address AI/robotics ethics where relevant
- **Transparency**: Explain limitations and edge cases honestly
- **Constitutional alignment**: Verify all content follows project ethics guidelines

## Acceptance Criteria

- [ ] Content meets 6,000–7,000 word target
- [ ] All 3–5 learning objectives are explicitly addressed
- [ ] Every factual claim is verified and cited
- [ ] Code examples are complete, tested, and runnable
- [ ] Simulation-first framing is maintained throughout
- [ ] Academic tone is consistent and professional
- [ ] Section structure follows the template (introduction, 3 sections, summary)
- [ ] Reading time estimate is accurate (tested with actual readers)
- [ ] All internal cross-references are accurate
- [ ] Constitution.md compliance is verified
- [ ] No hallucinated data, studies, or research findings
- [ ] Accessibility standards are met (readability, clarity, visual aids)
- [ ] Diagrams and figures are clear and properly referenced
- [ ] Glossary of terms is provided for domain-specific vocabulary
- [ ] Further reading section points to verified sources

## Quality Checklist Before Submission

**Content Quality:**
- [ ] Introduction hooks reader and previews content
- [ ] Learning objectives are specific and measurable
- [ ] Content is organized logically with clear transitions
- [ ] Examples demonstrate core concepts effectively
- [ ] Summary recaps key takeaways and reinvigorates objectives
- [ ] Writing is clear, concise, and academically rigorous

**Factual Accuracy:**
- [ ] All claims are verified against primary sources
- [ ] Citations are accurate and properly formatted
- [ ] Code examples run without errors
- [ ] Technical details are precise and current
- [ ] No hallucinated data or unverified claims

**Structural Compliance:**
- [ ] YAML frontmatter is complete and accurate
- [ ] Heading hierarchy is correct
- [ ] Word count is 6,000–7,000
- [ ] Reading time estimate is realistic
- [ ] Code examples follow project style standards
- [ ] Diagrams are clear and properly labeled

**Simulation-First Alignment:**
- [ ] Primary examples use simulation environments
- [ ] Real-world applications are presented as extensions
- [ ] Gazebo/Isaac Sim setup is fully documented
- [ ] Sim-to-real gaps are acknowledged

**Constitutional Adherence:**
- [ ] Safety considerations are addressed
- [ ] Ethical principles are maintained
- [ ] Learning-by-doing methodology is supported
- [ ] Transparency and clarity prioritized

---

Save it as `.claude/skills/content-writer/skill.md`
