---
name: token-optimizer
description: Reduce token usage while preserving meaning, technical clarity, and learning structure. Optimize prompts, content, and textbook materials for efficient AI processing and lower computational costs for the Physical AI & Humanoid Robotics Interactive Textbook.
---

# Token Optimizer Skill

## Overview

This skill enables systematic compression of textbook content, prompts, and documentation while preserving technical accuracy, learning objectives, and pedagogical structure. It provides techniques to reduce token consumption, optimize AI interaction costs, and improve processing efficiency without sacrificing clarity or educational value.

## When to Use This Skill

- When prompts or content become too long for efficient AI processing
- When optimizing AI interaction costs and API usage
- When preparing large content batches for LLM processing
- When generating comprehensive documentation that's token-heavy
- When consolidating multiple prompts into efficient workflows
- When compressing specifications or technical documentation
- When reducing verbosity in lesson content
- When optimizing large code examples or configurations

## Core Principles

### Preservation First
- Technical meaning must remain intact
- Learning objectives must stay explicit
- Code examples must remain functional
- Safety considerations must be preserved
- Accessibility requirements must be maintained

### Strategic Compression
- Remove redundancy without losing information
- Use abbreviations strategically (domain-standard terms only)
- Consolidate related concepts
- Combine related statements
- Eliminate decorative language

### Structure Integrity
- Maintain logical hierarchy
- Preserve list/bullet organization
- Keep heading structure clear
- Maintain code block integrity
- Preserve examples and illustrations

### Clarity Over Brevity
- If compression hurts understanding, don't do it
- Clarity is more important than token savings
- Technical terms should be explicit
- Learning flow must remain logical

## Step-by-Step Token Optimization Workflow

### Phase 1: Measurement & Baseline

**1.1 Measure Current Token Count**
```
Tools:
- OpenAI Tokenizer (online tool)
- Claude token counter (claude.ai estimate)
- Hugging Face tokenizer (Python)
- Local tokenization scripts

Steps:
1. Select content to optimize
2. Count baseline tokens
3. Note compression target (aim for 20–30% reduction)
4. Identify longest/most verbose sections
5. Calculate token-per-word ratio
```

**1.2 Identify Optimization Targets**
```
High-Priority:
- Repeated explanations (consolidate once)
- Verbose introductions (trim to essentials)
- Redundant examples (keep most relevant)
- Decorative language (remove adjectives)
- Excessive lists (combine related items)

Lower-Priority:
- Code comments (compress but keep clarity)
- Code variable names (use standard abbreviations)
- Section headers (only if still clear)
- Diagram descriptions (only if fully documented elsewhere)
```

**1.3 Set Compression Goals**
```
Target Reduction:
- Standard content: 20–30% reduction
- Verbose documentation: 30–50% reduction
- Prompts: 30–40% reduction
- Code-heavy content: 10–20% reduction (preserve readability)

Success Metrics:
- Token reduction percentage
- Clarity score (test with readers)
- Learning objective preservation
- Technical accuracy maintenance
- No increase in re-reads needed
```

### Phase 2: Content Audit

**2.1 Analyze Content Structure**
```
Questions:
1. Is every sentence necessary?
2. Are examples repeated across sections?
3. Is terminology introduced multiple times?
4. Are headers fully descriptive?
5. Are lists consolidable?
6. Is there filler or padding?
7. Can related concepts merge?
8. Are transitions verbose?
```

**2.2 Categorize by Compression Type**
```
Types of Compressions:
1. Redundancy Removal (repeated info)
2. Structural Consolidation (merge sections)
3. Semantic Shortening (say same thing in fewer words)
4. Abbreviation Application (standard domain abbreviations)
5. Example Reduction (remove duplicate examples)
6. Explanation Compression (tighten prose)
7. List Optimization (combine related items)
8. Reference Consolidation (point to other content)
```

**2.3 Create Compression Plan**
```
Document:
- Sections to compress and target reduction
- Techniques to apply to each section
- Areas where compression is risky (mark as "no touch")
- Priority order (start with lowest risk)
- Validation method (how to verify quality maintained)

Example Plan:
- Introduction: Remove 40% (verbose setup)
- Core Concepts: Remove 15% (important clarity)
- Examples: Remove 50% (keep 1 best example)
- Summary: Remove 20% (consolidate bullets)
- Code: Remove 5% (keep highly readable)
```

### Phase 3: Compression Techniques

**3.1 Redundancy Removal**
```
BEFORE (142 tokens):
"ROS 2 is the Robot Operating System 2 framework. ROS 2 is a modern
robotics framework that provides communication patterns. ROS 2 enables
nodes to communicate through topics and services. The topic-based
communication in ROS 2 uses the publisher-subscriber pattern. Services
in ROS 2 provide synchronous request-response communication."

AFTER (68 tokens):
"ROS 2 is a robotics framework enabling node communication through:
- Topics: asynchronous publisher-subscriber messaging
- Services: synchronous request-response communication"

Reduction: 52% ✓
Technique: Consolidate repeated concepts, convert to list format
```

**3.2 Verbose Introductions**
```
BEFORE (95 tokens):
"In this section, we will explore and discuss the important topic of
how humanoid robots move and navigate through their environments. This
is a crucial aspect of robotics that many engineers and researchers
focus on. We will begin by introducing foundational concepts related to
movement and locomotion."

AFTER (28 tokens):
"Humanoid robot locomotion covers movement and navigation. We'll start
with foundational concepts."

Reduction: 71% ✓
Technique: Remove filler, keep only essential information
```

**3.3 Semantic Shortening**
```
BEFORE (86 tokens):
"The Extended Kalman Filter is a popular algorithm used in robotics
for estimating the state of dynamic systems. It works by combining
measurements from multiple sensors and using a mathematical model of
the system to produce state estimates that are more accurate than any
single sensor could provide alone."

AFTER (35 tokens):
"The Extended Kalman Filter (EKF) estimates dynamic system state by
combining multi-sensor measurements with mathematical models, producing
more accurate estimates than individual sensors."

Reduction: 59% ✓
Technique: Use passive voice where beneficial, remove qualifiers
```

**3.4 Abbreviation Application**
```
Domain-Standard Abbreviations (Use consistently):
- ROS 2 (Robot Operating System 2)
- EKF (Extended Kalman Filter)
- UKF (Unscented Kalman Filter)
- IMU (Inertial Measurement Unit)
- PD (Proportional-Derivative)
- PID (Proportional-Integral-Derivative)
- DOF (Degrees of Freedom)
- URDF (Unified Robot Description Format)
- SDF (Simulation Description Format)
- DDS (Data Distribution Service)

BEFORE (145 tokens):
"The Inertial Measurement Unit (IMU) sensor provides measurements of
acceleration using accelerometers and rotational velocity using
gyroscopes. The Proportional-Derivative (PD) control law uses feedback
to adjust motor commands based on the proportional error and derivative
of error."

AFTER (45 tokens):
"The IMU provides acceleration (accelerometers) and rotational velocity
(gyroscopes). PD control adjusts motors based on proportional error and
error derivative."

Reduction: 69% ✓
Technique: Use abbreviations, compress explanations
```

**3.5 Example Reduction**
```
BEFORE (220 tokens):
"Here are three examples of topics in ROS 2:

1. The /sensor_data topic carries IMU readings from sensors. This topic
   publishes acceleration, angular velocity, and orientation data at
   100Hz.

2. The /cmd_vel topic carries velocity commands. This topic is published
   by the motion planning node and subscribed to by the motor driver.

3. The /status topic carries system status information. This includes
   battery level, temperature, and operational mode."

AFTER (78 tokens):
"Example ROS 2 topics:
1. /sensor_data: IMU readings (acceleration, angular velocity) at 100Hz
2. /cmd_vel: Velocity commands (planning → motor driver)
3. /status: System state (battery, temperature, mode)"

Reduction: 65% ✓
Technique: Keep most relevant example, use bullet format, compress descriptions
```

**3.6 Explanation Compression**
```
BEFORE (104 tokens):
"The reason why we use the publisher-subscriber pattern in ROS 2 is
because it provides loose coupling between different components of the
system. This means that the publisher (the component sending the message)
does not need to know anything about the subscriber (the component
receiving the message). This is very useful in complex robotic systems
where many different nodes need to work together."

AFTER (34 tokens):
"The publisher-subscriber pattern provides loose coupling: publishers
and subscribers don't know each other, enabling flexible complex systems."

Reduction: 67% ✓
Technique: Remove repetition, use semicolons to connect related ideas
```

**3.7 List Optimization**
```
BEFORE (87 tokens):
"ROS 2 provides several communication mechanisms. First, there are
topics, which use asynchronous publish-subscribe communication. Second,
there are services, which provide synchronous request-response
communication. Third, there are actions, which allow long-running
requests with feedback. Finally, parameters allow configuration values
to be shared and updated."

AFTER (32 tokens):
"ROS 2 communication mechanisms:
- Topics: asynchronous pub-sub
- Services: synchronous request-response
- Actions: long-running with feedback
- Parameters: shared configuration"

Reduction: 63% ✓
Technique: Convert prose to structured list
```

**3.8 Reference Consolidation**
```
BEFORE (156 tokens):
"The mathematics behind Kalman filtering involves several steps. First,
there is the prediction step where we predict the next state using our
system model. Second, there is the update step where we incorporate
sensor measurements to refine our prediction. The mathematics involves
matrix operations and probability distributions. For a detailed
mathematical treatment of Kalman filtering, including the full equations,
please see Section 4.2. We also recommend reading the paper by Welch and
Bishop (2006) for a comprehensive tutorial on Kalman filtering."

AFTER (58 tokens):
"Kalman filtering: prediction (system model) and update (sensor
measurements). Detailed mathematics in Section 4.2. See Welch & Bishop
(2006) for comprehensive treatment."

Reduction: 63% ✓
Technique: Reference other sections instead of explaining fully
```

### Phase 4: Code & Technical Content Compression

**4.1 Code Example Optimization**
```
BEFORE (187 tokens):
"""
def calculate_joint_targets(state, gains):
    '''
    Calculate target joint positions for a proportional-derivative
    controller. This function takes the current state and control gains,
    and produces target positions that the robot should move towards.

    Args:
        state: Current joint state with position and velocity
        gains: Control gains for proportional and derivative terms

    Returns:
        Array of target joint positions to apply as commands
    '''
    error = target - state.position
    error_rate = -state.velocity

    control_effort = (
        gains['kp'] * error +
        gains['kd'] * error_rate
    )

    return control_effort
"""

AFTER (98 tokens):
"""
def calculate_targets(state, gains):
    '''PD controller: compute target from state error and derivative.'''
    error = target - state.position
    error_rate = -state.velocity
    return gains['kp'] * error + gains['kd'] * error_rate
"""

Reduction: 48% ✓
Technique: Keep comments brief, use standard abbreviations, remove arg docs
(if also documented in text)
```

**4.2 Configuration Compression**
```
BEFORE (134 tokens):
```yaml
robot:
  name: "Humanoid Robot"
  type: "bipedal"
  description: "A two-legged anthropomorphic robot"

physics:
  engine: "ode"
  gravity: [0, 0, -9.81]
  time_step: 0.001

actuators:
  - name: "left_shoulder"
    max_force: 100
    max_velocity: 3.14
  - name: "right_shoulder"
    max_force: 100
    max_velocity: 3.14
```

AFTER (65 tokens):
```yaml
robot:
  name: "Humanoid"
  type: "bipedal"
physics:
  engine: "ode"
  gravity: [0, 0, -9.81]
  time_step: 0.001
actuators:
  - name: "left_shoulder"
    max_force: 100
    max_velocity: 3.14
  - name: "right_shoulder"
    max_force: 100
    max_velocity: 3.14
```

Reduction: 51% ✓
Technique: Remove redundant descriptions, keep only essential keys
```

### Phase 5: Prompt Optimization

**5.1 Compress System Prompts**
```
BEFORE (187 tokens):
"You are a helpful assistant specializing in robotics education. Your
role is to help students understand concepts related to Robot Operating
System 2, Gazebo simulation, Isaac Sim, and humanoid robotics. When
answering questions, you should provide clear explanations that are
accurate and technical. You should avoid making things up or providing
incorrect information. Always reference the learning materials when
possible. Be concise but complete in your explanations. Focus on helping
students understand the core concepts rather than overwhelming them with
details."

AFTER (68 tokens):
"You are a robotics education specialist. Explain ROS 2, Gazebo, Isaac
Sim, and humanoid robotics concepts clearly and accurately. Reference
learning materials. Prioritize core concepts over details. Never
hallucinate or provide incorrect information."

Reduction: 64% ✓
Technique: Convert to imperatives, remove redundant qualifiers
```

**5.2 Compress Task Specifications**
```
BEFORE (156 tokens):
"Please create a lesson about ROS 2 publishers and subscribers. The
lesson should cover the following topics: what topics are, how the
publish-subscribe pattern works, how to implement a publisher in Python,
and how to implement a subscriber in Python. The lesson should include
code examples for both a publisher and a subscriber. The lesson should
also explain quality of service (QoS) settings and why they matter. The
lesson should be educational and suitable for students with basic Python
knowledge but no prior ROS 2 experience."

AFTER (58 tokens):
"Create ROS 2 lesson: topics, pub-sub pattern, Python publisher/subscriber
examples, QoS settings. Target: Python-proficient, ROS 2-novice students."

Reduction: 63% ✓
Technique: Use imperative form, consolidate lists, remove "should"
```

**5.3 Compress Query Context**
```
BEFORE (203 tokens):
"I am working on creating an interactive textbook about humanoid robots
and AI. The textbook covers topics like ROS 2, Gazebo simulation, Isaac
Sim, and various robotics concepts. I need to create a chapter on sensor
fusion, which is an important topic in robotics where multiple sensors
provide data that is combined to get a better estimate of the system
state. The chapter should explain what sensor fusion is, why it's
important, common algorithms used in robotics (like Kalman filters), and
include practical examples and code. The chapter should be suitable for
intermediate-level readers who have some robotics background."

AFTER (87 tokens):
"Creating humanoid robotics textbook (ROS 2, Gazebo, Isaac Sim). Need:
Sensor fusion chapter covering what/why, algorithms (Kalman filtering),
practical examples. Target: intermediate readers with robotics background."

Reduction: 57% ✓
Technique: Use colons to list topics, remove explanations of obvious terms
```

### Phase 6: Documentation Compression

**6.1 Compress API Documentation**
```
BEFORE (267 tokens):
"""
publish(message)

This method publishes a message to a ROS 2 topic. The message will be
delivered to all subscribers listening on that topic. The method is
asynchronous, meaning the call will return immediately without waiting
for the message to be delivered. This is one of the core features of
the publish-subscribe pattern in ROS 2.

Parameters:
    message: The message object to publish. This should be an instance
        of the appropriate message type for this topic. The message object
        must conform to the ROS 2 message interface, which includes having
        the correct fields with the correct types.

Returns:
    None. The method does not return any value.

Raises:
    PublisherException: If the publisher has been destroyed or if there
        is a communication error publishing the message.

Example:
    publisher.publish(Twist(linear=Vector3(x=1.0), angular=...))
"""

AFTER (95 tokens):
"""
publish(message)

Publish message to topic (asynchronous, returns immediately).

Args:
    message: Message object (correct type and fields)

Returns:
    None

Raises:
    PublisherException: Publisher destroyed or communication error

Example:
    publisher.publish(Twist(linear=Vector3(x=1.0), angular=...))
"""

Reduction: 64% ✓
Technique: Remove repetition, use shorthand format, consolidate descriptions
```

**6.2 Compress README Files**
```
BEFORE (312 tokens):
"# ROS 2 Obstacle Avoidance Controller

This repository contains a ROS 2 node that implements a simple obstacle
avoidance controller for mobile robots. The controller uses laser scan
data from a LiDAR sensor to detect obstacles and generates velocity
commands to avoid them.

## Features

- Reads laser scan data from a ROS 2 topic
- Implements simple obstacle avoidance logic
- Publishes velocity commands to control the robot
- Configurable parameters for safety distance and turning speed
- Compatible with Gazebo simulation and real robots

## Installation

To install this package, follow these steps:
1. Clone the repository into your ROS 2 workspace
2. Build the package using colcon build
3. Source your workspace setup script

## Usage

To run the controller:
ros2 run obstacle_avoidance controller_node

## Parameters

- safety_distance: Distance threshold for obstacle detection (default 1.0m)
- turning_speed: Angular velocity for obstacle avoidance (default 1.0 rad/s)
"

AFTER (131 tokens):
"# ROS 2 Obstacle Avoidance Controller

Simple obstacle avoidance using laser scan data. Detects obstacles and
publishes velocity commands.

## Features
- Reads LiDAR topic, implements avoidance logic, publishes commands
- Configurable safety distance and turn speed
- Works in Gazebo and real hardware

## Installation
1. Clone into ROS 2 workspace
2. Run: colcon build && source install/setup.bash
3. Run: ros2 run obstacle_avoidance controller_node

## Parameters
- safety_distance: Obstacle detection threshold (default 1.0m)
- turning_speed: Avoidance angular velocity (default 1.0 rad/s)
"

Reduction: 58% ✓
Technique: Remove explanations, use imperative, consolidate lists
```

### Phase 7: Validation & Testing

**7.1 Preserve Learning Objectives**
```
Checklist:
- [ ] All learning objectives still explicitly stated
- [ ] No concepts removed (only compressed)
- [ ] Examples still illustrate core ideas
- [ ] Technical accuracy maintained
- [ ] Key terms still defined
- [ ] Prerequisites clear
- [ ] Code still functions correctly
```

**7.2 Clarity Testing**
```
Test with Readers:
1. Ask 2–3 readers to review compressed content
2. Measure comprehension (quiz-style test)
3. Compare to original comprehension score
4. Target: No more than 10% comprehension drop
5. If drop > 10%, restore some detail

Automated Clarity Metrics:
- Flesch-Kincaid Grade Level (should increase < 0.5 levels)
- Sentence average length (should decrease)
- Passive voice ratio (track but don't over-optimize)
```

**7.3 Technical Accuracy Validation**
```
Checklist:
- [ ] Code examples still correct and runnable
- [ ] Mathematical notation preserved
- [ ] Parameter values unchanged
- [ ] Safety warnings intact
- [ ] API signatures exact
- [ ] No semantic meaning lost
- [ ] Abbreviations consistent throughout
```

**7.4 Token Count Verification**
```
Process:
1. Recount tokens in compressed content
2. Calculate actual reduction percentage
3. Verify meets target (typically 20–40%)
4. If insufficient, apply additional compression
5. If excessive, restore clarity where needed
6. Document final token count and reduction
```

## Compression Examples by Content Type

### Example 1: Lesson Content Compression

**BEFORE (Original):**
```
## Understanding ROS 2 Topics

In this section, we will learn about one of the most important concepts
in ROS 2: topics. ROS 2 topics are one of the fundamental ways that nodes
communicate with each other. In this section, we will first introduce the
concept of topics, then explain how the publish-subscribe pattern works
in ROS 2, and finally show you some practical examples of how to create
publishers and subscribers.

### What is a Topic?

A topic is a named channel in ROS 2 through which messages are
communicated between nodes. When a node wants to send data, it publishes
that data to a topic. When another node wants to receive that data, it
subscribes to the topic. The key advantage of this approach is that the
publisher does not need to know about the subscriber, and the subscriber
does not need to know about the publisher. This is known as loose coupling.
This loose coupling makes it easy to build complex systems where many
different nodes can exchange data without needing to directly interact
with each other.

### The Publish-Subscribe Pattern

The publish-subscribe (or pub-sub) pattern is the core of ROS 2
communication. In this pattern, a node that has data to share is called
a publisher. The data is sent to something called a topic. Other nodes
that want to receive the data from that topic are called subscribers.
The publish-subscribe pattern is asynchronous, which means the publisher
does not wait for the subscriber to receive the message...

(Total: 287 tokens)
```

**AFTER (Optimized):**
```
## ROS 2 Topics

Topics are named channels for node-to-node message communication using
a publish-subscribe pattern.

### Topic Basics
- A topic is a named communication channel
- Publishers send data to topics; subscribers receive from topics
- Loose coupling: publishers/subscribers don't know each other
- Enables flexible, modular systems

### Publish-Subscribe Pattern
The pub-sub pattern is core to ROS 2:
1. Publisher sends messages to a topic (asynchronous)
2. Topic holds messages temporarily
3. All subscribers on that topic receive copies

Key advantage: decoupling enables complex distributed systems without
direct node interaction.

(Total: 95 tokens)
```

**Reduction: 67%** ✓

---

### Example 2: Code Documentation Compression

**BEFORE:**
```python
def apply_pd_control(error, error_rate, gains):
    """
    Apply proportional-derivative control to compute a control effort.

    This function implements a PD controller, which is a common control
    law used in robotics for commanding actuators. The PD controller
    works by combining a proportional term (which is proportional to the
    current error) with a derivative term (which is proportional to the
    rate of change of error).

    The proportional term helps move the system toward the desired state,
    and the derivative term helps dampen oscillations and improve stability.

    Args:
        error: Current error (target - current state)
        error_rate: Rate of change of error (derivative of error)
        gains: Dictionary containing 'kp' and 'kd' gain values

    Returns:
        The computed control effort (float or array depending on dimensions)

    Raises:
        ValueError: If gains dictionary doesn't contain required keys

    Example:
        gains = {'kp': 10.0, 'kd': 2.0}
        effort = apply_pd_control(error=0.5, error_rate=-0.1, gains=gains)
    """
    if 'kp' not in gains or 'kd' not in gains:
        raise ValueError("Gains must contain 'kp' and 'kd' keys")

    return gains['kp'] * error + gains['kd'] * error_rate
```

**AFTER:**
```python
def apply_pd_control(error, error_rate, gains):
    """
    PD controller: control_effort = kp*error + kd*error_rate.

    Args:
        error: Target - current state
        error_rate: Derivative of error
        gains: Dict with 'kp', 'kd'

    Raises:
        ValueError: Missing gain keys

    Example:
        apply_pd_control(0.5, -0.1, {'kp': 10.0, 'kd': 2.0})
    """
    if 'kp' not in gains or 'kd' not in gains:
        raise ValueError("Gains must contain 'kp' and 'kd' keys")

    return gains['kp'] * error + gains['kd'] * error_rate
```

**Reduction: 58%** ✓

---

### Example 3: Specification Compression

**BEFORE:**
```
## Requirements Specification: Humanoid Walking Controller

### Overview
This document describes the requirements for a humanoid walking
controller. The walking controller is responsible for generating
joint target positions that allow the humanoid robot to walk in a
stable manner. The controller must handle various walking speeds,
directions, and terrain conditions.

### Functional Requirements

1. The controller shall accept desired velocity commands (linear and
   angular) as input. The linear velocity can be in any direction in
   the horizontal plane. The angular velocity represents rotation
   about the vertical axis.

2. The controller shall generate joint target positions for all 16
   actuated joints in the humanoid robot's legs, hips, and torso.

3. The controller shall ensure that all joint targets remain within
   the physical limits of the robot's joints. Joint limits shall be
   enforced with a 5% safety margin.

4. The controller shall maintain dynamic stability. The center of
   mass of the robot shall remain within the support polygon formed
   by the robot's feet.

5. The controller shall operate at a minimum frequency of 100 Hz to
   ensure smooth motion and responsiveness to velocity commands.

(Total: 234 tokens)
```

**AFTER:**
```
## Humanoid Walking Controller

### Requirements
1. Input: Desired velocity (linear + angular)
2. Output: Joint targets for 16 leg/hip/torso joints
3. Constraints:
   - Joint limits ±5% safety margin
   - Dynamic stability (CoM within support polygon)
   - Min frequency: 100 Hz

(Total: 53 tokens)
```

**Reduction: 77%** ✓

---

### Example 4: Parameter List Compression

**BEFORE:**
```
The robot has several important parameters that control its behavior:

- The mass of the robot is 80 kilograms. This affects how forces
  translate to accelerations.

- The maximum force that each motor can produce is 150 newtons. This
  limits the torques available for joint motion.

- The joint angle limits are specific to each joint. The knee joint,
  for example, can move from 0 to 150 degrees.

- The sensor feedback rate is 100 Hz. This is the frequency at which
  sensor data is published.

- The control command rate is also 100 Hz. The controller computes new
  joint targets at this frequency.

- The simulation time step is 0.001 seconds (1 millisecond). Smaller
  time steps provide more accurate physics but require more computation.
```

**AFTER:**
```
Key parameters:
- Mass: 80 kg
- Max motor force: 150 N per joint
- Joint limits: see specification (e.g., knee: 0–150°)
- Sensor/control rate: 100 Hz
- Simulation dt: 0.001 s
```

**Reduction: 72%** ✓

## Tools for Token Optimization

### Token Counting Tools
- **OpenAI Tokenizer** — Interactive token counter (web tool)
- **Claude Token Counter** — Estimate in Claude.ai
- **Hugging Face Tokenizers** — Python library for local counting
- **Token Measurement Scripts** — Custom Python/JS scripts

### Text Analysis Tools
- **Hemingway Editor** — Readability and clarity feedback
- **Grammarly** — Grammar, clarity, tone suggestions
- **Flesch-Kincaid Calculator** — Grade level estimation
- **Readability Checkers** — Online tools for grade level

### Compression Utilities
- **TextCompactor** — Remove whitespace/comments
- **Code Minifiers** — JavaScript/CSS compression
- **Markdown Formatters** — Optimize markdown syntax
- **Abbreviation Checkers** — Verify abbreviation consistency

### Batch Processing
- **Python Scripts** — Programmatic token counting
- **Bash Scripts** — Batch file processing
- **Node.js Tools** — JavaScript-based processing
- **GitHub Actions** — Automated optimization workflows

## Compression Limits & Safety

### When NOT to Compress
```
NEVER compress:
- Safety warnings or critical notices
- Code that becomes unreadable
- Learning objective definitions
- Technical accuracy or correctness
- Accessibility features (alt text, captions)
- Legal or compliance information
- Mathematical notation or equations
- Function signatures or API contracts
```

### Minimal Compression Zones
```
Be conservative with:
- Introductory sections (students need context)
- Error messages (must be clear)
- Warning labels (clarity > brevity)
- Code examples (readability matters)
- Instructions (must be unambiguous)
```

### Quality Thresholds
```
If any of these drop, restore detail:
- Readability grade level increases > 0.5 levels
- Comprehension test score drops > 10%
- Code becomes harder to understand
- Learning objectives become unclear
- Technical accuracy is compromised
```

## Acceptance Criteria

- [ ] Token reduction achieved (target 20–40%)
- [ ] All learning objectives explicitly preserved
- [ ] Technical meaning and accuracy unchanged
- [ ] Code examples still correct and runnable
- [ ] Readability grade level drop ≤ 0.5 levels
- [ ] Comprehension test scores maintained (drop ≤ 10%)
- [ ] Abbreviations used consistently throughout
- [ ] No safety information removed or compressed
- [ ] Markdown/formatting structure maintained
- [ ] Cross-references still valid
- [ ] Examples still illustrate core concepts
- [ ] Content tested with reader feedback
- [ ] Spelling and grammar preserved
- [ ] No accidental meaning changes
- [ ] Before/after token counts documented

## Quality Checklist

**Compression Quality:**
- [ ] Redundancies eliminated without losing meaning
- [ ] Structure preserved and clear
- [ ] Learning progression maintained
- [ ] Examples still effective
- [ ] Transitions between ideas remain clear
- [ ] Conclusion/summary still captures essence

**Technical Integrity:**
- [ ] Code is syntactically correct
- [ ] Parameters unchanged
- [ ] APIs documented accurately
- [ ] Mathematical notation preserved
- [ ] Safety considerations maintained
- [ ] Version/compatibility info accurate

**Readability:**
- [ ] Sentences still clear and understandable
- [ ] Key concepts emphasized
- [ ] Terminology consistent
- [ ] Visual hierarchy maintained
- [ ] Lists/bullets still scannable
- [ ] No orphaned references

**Token Efficiency:**
- [ ] Target reduction achieved
- [ ] No artificial padding
- [ ] Abbreviations standard in domain
- [ ] Redundancy eliminated
- [ ] Unnecessary words removed
- [ ] Structure optimized for scanning

**Accessibility:**
- [ ] Alt text preserved (if present)
- [ ] Captions not over-compressed
- [ ] Headers still descriptive
- [ ] Contrast/formatting maintained
- [ ] Screen reader compatibility preserved
- [ ] Color/symbol meaning clear

---

Save it as `.claude/skills/token-optimizer/skill.md`
