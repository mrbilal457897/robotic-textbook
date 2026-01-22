---
name: diagram-first
description: Explain complex robotics concepts using diagram-first teaching for the Physical AI & Humanoid Robotics Interactive Textbook. Identify where diagrams are essential, describe visuals before textual explanation, and improve conceptual understanding through visual-first pedagogy while maintaining educational clarity and simulation-only framing.
---

# Diagram-First Skill

## Overview

This skill enables systematic use of diagrams as the primary teaching tool for complex robotics concepts. Rather than explaining a system in text and then showing a diagram, the diagram-first approach places the visual first, describes what the reader sees, then provides supporting text explanation. This leverages visual processing strengths and improves conceptual understanding, particularly for architectural systems, data flows, and robot control hierarchies.

## When to Use This Skill

- When explaining system architectures (ROS 2 node networks, control pipelines)
- When describing data flows (sensor → processing → output)
- When showing relationships between components
- When introducing spatial concepts (robot kinematics, coordinate frames)
- When comparing different approaches (architectures, algorithms)
- When explaining processes with multiple steps
- When students struggle to understand text-based explanations
- When a concept is inherently visual (simulation environments, robot structure)

## Core Principles

### Visual Processing First
- Humans process images 60,000 times faster than text
- Complex systems are easier to grasp visually
- Diagrams reduce cognitive load compared to pure prose
- Visual representations activate multiple brain areas
- Good diagrams support different learning styles

### Diagram-First Pedagogy
- **Show**: Present diagram clearly before any explanation
- **Describe**: Point out key elements and relationships
- **Explain**: Provide text detail after visual foundation
- **Connect**: Relate back to diagram throughout text
- **Reinforce**: Use diagram as reference anchor

### Simulation-Only Framing
- All diagram content assumes simulation environment
- Real hardware shown only as "future extension"
- Virtual sensors, actuators, communication shown
- Gazebo/Isaac Sim windows shown as examples
- No assumptions about real-world deployment

### Educational Clarity
- Diagram purpose explicit (What is this showing?)
- Complexity increases gradually (simple → detailed)
- Elements clearly labeled
- Color-coding meaningful
- Connections explicit (arrows, lines with labels)

## Step-by-Step Diagram-First Teaching Workflow

### Phase 1: Identify Diagram Opportunities

**1.1 Concept Analysis**
```
Questions for Each Concept:

1. Is this inherently spatial or visual?
   ✓ Yes: System architecture, data flow, robot structure, coordinate frames
   ✗ No: Equations, definitions, pure logic
   → Diagram likely helpful

2. Would a student benefit from seeing relationships?
   ✓ Yes: "How do these components connect?" "What data flows where?"
   ✗ No: "What is this definition?" "How do you spell this?"
   → Diagram likely helpful

3. Is this hard to visualize from text alone?
   ✓ Yes: Multi-node systems, parallel processes, 3D structures
   ✗ No: Simple processes, clear relationships
   → Diagram likely necessary

4. Do students commonly misunderstand this?
   ✓ Yes: Many struggle with this concept
   ✗ No: Usually understood clearly
   → Diagram could improve learning

5. Can a diagram replace several paragraphs?
   ✓ Yes: One diagram shows what takes 3 paragraphs
   ✗ No: Requires detailed explanation anyway
   → Diagram-first approach suitable

Diagram Opportunity Score:

Score 3+ "Yes" answers: Diagram-first strongly recommended
Score 2 "Yes" answers: Diagram-first beneficial
Score 1 "Yes" answer: Consider diagram, but not essential
Score 0 "Yes" answers: Text-only or minimal diagram
```

**1.2 Identify Diagram Types Needed**
```
Concept Type → Diagram Type Mapping:

SYSTEM ARCHITECTURE
  ├─ Concept: How components connect and communicate
  ├─ Best Diagram: Block diagram with connections
  └─ Example: ROS 2 node network with topics/services

DATA FLOW / PIPELINE
  ├─ Concept: How information moves through system
  ├─ Best Diagram: Flow diagram with labeled arrows
  └─ Example: Sensor data → processing → output

SPATIAL/GEOMETRIC
  ├─ Concept: 3D relationships, positions, coordinate frames
  ├─ Best Diagram: 3D isometric or camera view
  └─ Example: Humanoid joint positions, robot workspace

HIERARCHICAL
  ├─ Concept: Levels of abstraction or control
  ├─ Best Diagram: Tree or pyramid diagram
  └─ Example: Software architecture layers, sensor hierarchy

TEMPORAL/SEQUENCE
  ├─ Concept: Steps over time, cause and effect
  ├─ Best Diagram: Sequence or timeline diagram
  └─ Example: Algorithm steps, state transitions

COMPARATIVE
  ├─ Concept: Differences between approaches
  ├─ Best Diagram: Side-by-side comparison or Venn diagram
  └─ Example: Different control architectures

STATISTICAL/QUANTITATIVE
  ├─ Concept: Distributions, comparisons, trends
  ├─ Best Diagram: Graph, chart, or heatmap
  └─ Example: Sensor noise distributions, performance metrics

Example Mapping:

Concept: "Publisher-Subscriber Communication Pattern"
  Is it spatial? YES (nodes in space)
  Do relationships matter? YES (how they connect)
  Hard to visualize? YES (asynchronous, decoupled)
  Commonly misunderstood? YES
  Replaces text? YES

→ Diagram Type: Block diagram (nodes) + flow diagram (messages)
→ Approach: Diagram-first, heavily relied upon in teaching
```

**1.3 Plan Diagram Content Hierarchy**
```
Complexity Progression:

Level 1: Minimal Viable Diagram
  - Shows: Core concept only
  - Elements: 3–5 key components
  - Purpose: Establish basic understanding
  - Audience: Beginners, visual learners

Level 2: Standard Diagram
  - Shows: Core concept + important details
  - Elements: 6–10 components
  - Purpose: Teach the concept thoroughly
  - Audience: General learners

Level 3: Comprehensive Diagram
  - Shows: All important elements
  - Elements: 10–15 components
  - Purpose: Support deep understanding
  - Audience: Advanced learners, reference

Example: ROS 2 Publisher-Subscriber

Level 1 (Minimal):
[Publisher Node] --[Topic]--> [Subscriber Node]
Shows: Basic decoupling

Level 2 (Standard):
[Publisher]
  - Send data
  - Topic: /sensor_data
  - Message Type: Float32
↓
[Topic Queue]
  - Holds messages
  - QoS: 10
↓
[Subscriber]
  - Receive data
  - Callback: process()

Level 3 (Comprehensive):
[Publisher Node]
├─ Publisher object
│  ├─ Topic: /sensor_data
│  ├─ Message Type: sensor_msgs/Imu
│  └─ QoS: reliable, 10 depth
├─ Send loop (100 Hz)
│  └─ Read sensor → Create message → Publish
└─ Logging

    [DDS Middleware]
    - Handles routing
    - Manages QoS
    - Handles serialization

[Subscriber Node]
├─ Subscriber object
│  ├─ Topic: /sensor_data
│  ├─ Callback: sensor_callback()
│  └─ QoS: must match publisher
├─ Receive loop
│  └─ Receive message → Deserialize → Call callback
└─ Processing
   └─ Filter data → Store state → Publish results

Strategy: Start with Level 1, expand to Level 2/3 as needed
```

### Phase 2: Design Diagram Content

**2.1 Diagram Design Principles**
```
Principle 1: Clear Purpose
  Statement: "This diagram shows how ROS 2 nodes communicate via topics."
  ✓ Specific, tells reader what to look for
  ✗ Vague: "ROS 2 diagram" (could show anything)

Principle 2: Appropriate Complexity
  Rule: Show what's necessary, hide what's not
  ✗ Too simple: Misses key relationships
  ✓ Just right: Shows relationships without overwhelming
  ✗ Too complex: Obscures main point with details

Principle 3: Clear Labels
  Rule: Every element has a label
  ✓ "Publisher Node" (clear)
  ✗ "Pub" (abbreviation, less clear)
  ✗ Unlabeled box (completely unclear)

Principle 4: Meaningful Visual Encoding
  Rule: Visual properties convey meaning
  ✓ Color: Different colors for different component types
  ✓ Size: Important components larger
  ✓ Position: Related items grouped together
  ✓ Shape: Different shapes for different types
  ✗ Random colors: No meaning
  ✗ Uniform size: Can't judge importance
  ✗ Scattered layout: Hard to see relationships

Principle 5: Clear Relationships
  Rule: Connections are explicit
  ✓ Arrows show direction: Publisher → Topic → Subscriber
  ✓ Labels on arrows explain relationship: "sends messages"
  ✓ Line types vary: Solid for direct, dashed for optional
  ✗ Ambiguous lines: Can't tell direction
  ✗ No labels: Relationship unclear

Principle 6: Hierarchy
  Rule: Information organized by importance
  ✓ Main concept prominent (center, large)
  ✓ Supporting details around it
  ✓ Advanced details in separate diagram
  ✗ All elements equal size and placement
  ✗ Important concept buried in corner

Principle 7: Self-Contained
  Rule: Diagram meaningful without extensive explanation
  ✓ Diagram title: "Publisher-Subscriber Pattern in ROS 2"
  ✓ Element labels: Every component named
  ✓ Legend if needed: Color coding explained
  ✗ Vague title: "ROS 2 Communication"
  ✗ Unlabeled elements: "What is this box?"
  ✗ No legend: "Why are these different colors?"
```

**2.2 Select Appropriate Visual Style**
```
Style Guide for Robotics Diagrams:

Block Diagram (System Architecture)
  Use for: Showing components and connections
  Style: Rectangular boxes for components, arrows for connections
  Example: Node network, system architecture
  Color scheme: Different color per component type
  Labels: Component name + brief description

Flow Diagram (Data/Process Flow)
  Use for: Showing how data or processes move
  Style: Boxes for processes, arrows labeled with data type
  Example: Sensor pipeline, control flow
  Color scheme: Color by stage (input, process, output)
  Labels: Data type or signal name on arrows

Entity Relationship Diagram (Relationships)
  Use for: Showing how entities relate
  Style: Entities as boxes, relationships as labeled lines
  Example: Sensor types and connections
  Color scheme: Consistent across similar entities
  Labels: Relationship descriptions

State Machine Diagram (States & Transitions)
  Use for: Showing discrete states and transitions
  Style: Circles for states, arrows for transitions
  Example: Robot states (idle, moving, grasping)
  Color scheme: Color by stability (stable vs. transient)
  Labels: Condition for each transition

Timeline/Sequence Diagram (Temporal Relationships)
  Use for: Showing what happens when
  Style: Time axis with events or actors
  Example: Algorithm steps, communication timing
  Color scheme: Color by component or type
  Labels: Time, action, or component names

Comparison Matrix/Venn Diagram (Comparison)
  Use for: Comparing multiple options
  Style: Overlapping regions or matrix cells
  Example: Comparing control algorithms
  Color scheme: Color by category or similarity
  Labels: Feature/property names

3D Isometric/Perspective (Spatial/Geometric)
  Use for: 3D structures, spatial relationships
  Style: Isometric projection or 3D rendering
  Example: Robot structure, simulation environment
  Color scheme: Color by component, consistent 3D shading
  Labels: 3D coordinates, joint names
```

**2.3 Create Diagram Description Strategy**
```
Diagram Description Framework:

Part 1: Diagram Title & Purpose (Before showing diagram)
  Length: 1 sentence
  Content: What is this diagram showing?
  Purpose: Prepare reader for what they'll see
  Example: "This diagram shows how ROS 2 publisher and subscriber nodes
  communicate through a topic."

Part 2: Diagram Presented (Visual)
  The actual diagram image
  Clear, labeled, self-contained
  High quality (2x resolution for printing)
  Alt text for accessibility

Part 3: Visual Description (Immediately after diagram)
  Length: 2–4 sentences
  Content: Point reader to key elements
  Purpose: Guide attention to important parts
  Example: "At the top is the Publisher Node, which sends sensor data.
  Messages flow down through the Topic (the message queue). At the bottom,
  the Subscriber Node receives copies of each message. Notice that the
  publisher and subscriber don't directly know each other—they only connect
  through the topic."

Part 4: Element Breakdown (Optional, for complex diagrams)
  Length: 3–6 bullet points
  Content: Explain each major element
  Purpose: Build understanding of components
  Example:
  - **Publisher Node**: Reads sensor data and sends it
  - **Topic**: Named message channel; decouples sender from receiver
  - **Subscriber Node**: Receives messages from topic and processes them
  - **QoS Settings**: Control message delivery reliability and buffering

Part 5: Detailed Explanation (Supporting text)
  Length: 1–3 paragraphs
  Content: Elaborate on how it works, why it matters
  Purpose: Provide depth after visual foundation
  Example: [Detailed explanation of pub/sub pattern]

Part 6: Diagram Reference (Throughout text)
  Strategy: Point back to diagram regularly
  Language: "As shown in the diagram above...", "The publisher (top of diagram)..."
  Purpose: Keep diagram as reference frame for learning

Example Structure:

## Publisher-Subscriber Communication

**The ROS 2 Topic Pattern**

[Diagram showing publisher, topic, subscriber]

The diagram above shows the core pub/sub pattern. The Publisher Node (left)
sends data to a Topic (center), which acts as a message queue. The Subscriber
Node (right) receives copies of the messages. Critically, the publisher and
subscriber never directly communicate—they only interact through the topic.

**Key Elements:**

- **Publisher Node**: Sends messages to a topic
- **Topic**: A named channel with QoS settings
- **Subscriber Node**: Receives all messages on the topic
- **Decoupling**: Publisher and subscriber don't need to know each other

**How It Works:**

When the publisher sends a message, it's stored in the topic's queue.
Any subscriber listening on that topic automatically receives a copy.
The publisher doesn't wait for subscribers (asynchronous communication).
If a subscriber is slow, messages are queued (up to the QoS limit).
This design enables flexible, scalable distributed systems.

**In Simulation:**

In Gazebo, you can monitor topics using `ros2 topic echo /topic_name`
to see messages flowing in real-time. This helps verify that your
publisher and subscriber are communicating correctly.
```

### Phase 3: Describe Diagrams Effectively

**3.1 Write Strong Visual Descriptions**
```
Description Quality Levels:

LEVEL 1: Minimal (Bad)
"The diagram shows the pub/sub pattern."
Problem: Tells reader what they can already see, no guidance

LEVEL 2: Element-Based (Better)
"The diagram shows a publisher (left), topic (center), and subscriber (right).
The publisher sends to the topic. The subscriber receives from the topic."
Problem: Describes elements but not relationships or significance

LEVEL 3: Relationship-Based (Good)
"The diagram shows how ROS 2 separates sender from receiver. The Publisher
Node (left) sends messages to the Topic (center), which acts as a decoupling
mechanism. The Subscriber Node (right) receives copies of messages. Because
they communicate through the topic rather than directly, they can be
developed and modified independently."
Strength: Explains relationships and design intent

LEVEL 4: Insight-Based (Excellent)
"The diagram illustrates the key insight of the publish-subscribe pattern:
decoupling. Notice that the Publisher Node (left) doesn't 'know' about
the Subscriber Node (right)—it only knows about the Topic (center). This
design allows you to add more subscribers, change subscribers, or modify
the publisher without changing the others. The Topic acts as a middleman,
handling the complexity of multiple subscribers, buffering messages, and
managing timing differences."
Strength: Explains why this design matters, supports understanding

Writing Strong Descriptions:

Rule 1: Point, Name, Explain
  Point: Show where element is in diagram
  Name: Give it a name/label
  Explain: What does it do?

Example:
"On the left is the Publisher Node [Point], which is the component that
sends sensor data [Name]. It doesn't wait for subscribers to receive the
data [Explain]—it just publishes and continues."

Rule 2: Show Relationships
  Not just: "There are three parts"
  But: "How do they connect?"

Example:
"The publisher (left) sends data to the topic (center) through a publish
operation. Messages flow downward from the topic to the subscriber (right)
through a receive operation."

Rule 3: Highlight Key Insight
  What should reader understand?
  What's non-obvious?
  What's important to remember?

Example:
"The key insight is asynchrony: the publisher and subscriber don't have
to run at the same speed. The publisher publishes every millisecond; the
subscriber might process every 10 milliseconds. The topic buffers messages
so none are lost."

Rule 4: Connect to Concept
  Why does the diagram matter?
  How does it support the concept being taught?

Example:
"This diagram explains why the pub/sub pattern is so powerful: it lets
you build complex robotic systems by having independent components
communicate through topics rather than direct connections."

Rule 5: Use Active Language
  Not: "It can be seen that..."
  But: "Notice that...", "Observe that...", "See how..."

Example:
"Notice the arrows pointing downward from the topic to the subscriber—
they represent message flow. Unlike the publisher (which doesn't wait),
the subscriber actively receives messages."

Rule 6: Avoid Redundancy
  Not: Repeat what text says
  But: Add guidance diagram provides

Example of Redundancy:
Text: "The publisher sends data."
Description: "The publisher sends data."
← Too repetitive

Example of Good Complement:
Text: "The publisher sends data."
Description: "You can see the publisher on the left side of the diagram.
Notice the arrow pointing to the topic—that represents the publish
operation where data flows into the message queue."
← Description adds visual guidance
```

**3.2 Create Diagram-First Lesson Structure**
```
Standard Structure for Diagram-First Lesson:

1. TITLE & CONTEXT (1 sentence)
   "Understanding ROS 2 Publisher-Subscriber Communication"
   "This diagram shows how nodes communicate asynchronously."

2. DIAGRAM PLACEMENT
   [Visual placed prominently before text explanation]

3. VISUAL DESCRIPTION (2–4 sentences)
   Point reader to key elements
   Explain what they're seeing
   Highlight main relationship

4. ELEMENT BREAKDOWN (3–6 bullets, optional)
   Explain each major component
   Build vocabulary
   Establish baseline understanding

5. DETAILED EXPLANATION (1–3 paragraphs)
   Elaborate on the concept
   Explain how it works
   Provide examples and context

6. REAL-WORLD CONTEXT (1 paragraph)
   Why this matters
   Common use cases
   Connection to bigger picture

7. DIAGRAM REFERENCES
   Throughout explanation, point back to diagram
   Use diagram as reference frame
   "As shown in the diagram..."

8. SIMULATION EXAMPLE (Code/screenshot)
   Show how this works in Gazebo/Isaac Sim
   Verify diagram concepts in practice
   Provide hands-on connection

Example: Complete Lesson Structure

## Understanding ROS 2 Topic Communication

ROS 2 topics enable decoupled asynchronous communication between nodes.

[DIAGRAM: Publisher-Subscriber Pattern]

The diagram above shows the core pattern. On the left, the Publisher Node
sends sensor data to a Topic. The Topic (center) acts as a message queue,
buffering and distributing messages. On the right, the Subscriber Node
receives copies of each message. Critically, the publisher and subscriber
never directly communicate—they only interact through the topic.

### Key Elements

- **Publisher Node**: Sends messages at regular intervals (e.g., 100 Hz)
- **Topic**: A named channel with configured Quality of Service settings
- **Subscriber Node**: Receives messages asynchronously via a callback
- **Decoupling**: Publisher and subscriber can be created/destroyed independently

### How It Works

The publish-subscribe pattern separates concerns. The publisher sends data
without caring who receives it. Subscribers receive data without caring who
sent it. This enables building complex systems where components are loosely
coupled.

When the publisher sends a message:
1. Message enters the topic's queue
2. Message is serialized to network format
3. DDS middleware delivers to all subscribers
4. Each subscriber's callback is triggered
5. Subscriber processes the message

Because communication is asynchronous, the publisher doesn't wait for the
subscriber to finish processing. This keeps the system responsive even when
components run at different speeds.

### Why This Matters

The pub/sub pattern is fundamental to robotics systems. Imagine a humanoid
robot with many independent systems: perception (cameras, IMUs), planning
(trajectory generation), and control (motor commands). These systems run at
different rates and have different latencies. Topics let them communicate
without blocking each other.

### Simulation Example

In Gazebo, you can observe topics with:

```bash
ros2 topic echo /sensor_data
```

This shows messages flowing in real-time. You can verify that:
- Publisher sends regularly (timestamps increase)
- Data values match expected sensor readings
- Subscriber processes all messages

[Screenshot of terminal output showing topic messages]

Notice that each line represents one message. The consistent timing shows
the publisher runs at regular intervals. Multiple subscribers can receive
the same messages without interfering with each other.
```

### Phase 4: Design Complex Diagram Sequences

**4.1 Create Progressive Diagram Series**
```
Strategy: Show concept at multiple levels of detail

Level 1: Conceptual Diagram (Show what)
Purpose: Introduce concept visually
Content: Simplified version showing essential relationships
Example: Three boxes showing Publisher → Topic → Subscriber

Level 2: Detailed Diagram (Show how)
Purpose: Explain mechanisms
Content: Add details, show internal workings
Example: Add QoS settings, message queue, callbacks

Level 3: Full System Diagram (Show context)
Purpose: Show in larger context
Content: How this fits with other concepts
Example: Full node network with multiple publishers/subscribers

Level 4: Implementation Diagram (Show code connection)
Purpose: Connect to code
Content: Map code elements to diagram elements
Example: Show code snippets pointing to diagram elements

Example Series: Kalman Filter

Level 1: Conceptual
[Input measurements] → [Kalman Filter] → [State estimate]
Shows: Basic idea (measurements → better estimate)

Level 2: Detailed
[Measurements with noise]
        ↓
[Prediction step: Use motion model]
        ↓
[Update step: Incorporate new measurement]
        ↓
[State estimate + Uncertainty]
↓ (feedback loop)
[Back to prediction]
Shows: How the algorithm works (predict-update cycle)

Level 3: Full System
[Multiple sensors: IMU, Camera, Encoder]
  ↓ (all input)
[Kalman Filter block]
  ├─ State: position, velocity, orientation
  ├─ Covariance: uncertainty in estimates
  └─ Predict-Update cycle running at 100 Hz
  ↓ (output)
[Robot controller using state estimate]
  ↓
[Motor commands]
Shows: How it fits in complete system

Level 4: Implementation
[Code showing measurement subscription] → [Diagram showing input]
[Code showing predict step] → [Diagram showing prediction]
[Code showing update step] → [Diagram showing update]
[Code showing output] → [Diagram showing state publication]
Shows: How code maps to diagram concepts

Presenting the Series:

1. Start with Level 1 (conceptual)
   Establish understanding of main idea

2. Show Level 2 (detailed)
   Explain mechanisms

3. Reference Level 1 again
   "Remember our simple diagram? Here's the detail..."

4. Show Level 3 (full system)
   Put in larger context

5. Show Level 4 (implementation)
   Connect to code

This progression builds understanding gradually without overwhelming reader.
```

**4.2 Create Comparison Diagrams**
```
Purpose: Show differences between approaches

Side-by-Side Comparison:

Approach 1: Centralized Control
[Sensor 1] ─┐
[Sensor 2] ─├─→ [Central Controller] ─→ [Actuator 1]
[Sensor 3] ─┘                         ─→ [Actuator 2]

Characteristics:
+ Easy to coordinate (one place decides)
- Single point of failure
- Higher latency (all data goes to one node)
- Harder to scale

Approach 2: Distributed Control
[Sensor 1] ─→ [Local Controller 1] ─→ [Actuator 1]
[Sensor 2] ─→ [Local Controller 2] ─→ [Actuator 2]
[Sensor 3] ─→ [Local Controller 3] ─→ [Actuator 3]

With communication:
[Local Controller 1] ←→ [Local Controller 2] ←→ [Local Controller 3]

Characteristics:
+ Fault tolerant (each controller independent)
- Harder to coordinate
+ Lower latency (local decisions)
+ Easier to scale

Presentation Strategy:

1. Show Approach 1 diagram with description
   Explain how it works
   Highlight advantages and disadvantages

2. Show Approach 2 diagram with same structure
   Explain how it works
   Highlight advantages and disadvantages

3. Show side-by-side for comparison
   Point out key differences
   Help reader see trade-offs

4. Conclude with guidance
   "Use centralized when coordination is critical."
   "Use distributed when fault tolerance matters."
```

### Phase 5: Validate Diagram Effectiveness

**5.1 Test Diagram Clarity**
```
Clarity Testing Checklist:

□ Can someone unfamiliar with topic understand diagram title?
  If no: Make title more descriptive

□ Can someone identify all elements without reading text?
  If no: Add more/clearer labels

□ Are relationships between elements obvious?
  If no: Add arrows, lines, or visual connections

□ Can someone explain what diagram shows in one sentence?
  If no: Simplify or remove elements

□ Does diagram support the concept being taught?
  If no: Redesign or replace

□ Is anything unclear or ambiguous?
  If yes: Add labels, legend, or redesign

□ Are colors meaningful (not random)?
  If no: Revise color scheme

□ Is diagram self-contained (meaningful without text)?
  If no: Add elements or labels

□ Would removing any element hurt understanding?
  If no: Remove it (simplicity improves clarity)

□ Does diagram match the text explanation?
  If no: Update diagram or text
```

**5.2 Measure Learning Improvement**
```
Before/After Assessment:

Test 1: Pre-Diagram Understanding
- Ask students to explain concept before diagram
- Record accuracy and confidence
- Note misconceptions

Test 2: With Text Only
- Give explanation without diagram
- Assess understanding
- Compare to baseline

Test 3: With Diagram First
- Show diagram first
- Give same explanation
- Assess understanding
- Compare to text-only

Metrics to Track:

Comprehension:
- Can student explain concept correctly?
- Do they understand key relationships?
- Can they apply it to new scenario?

Confidence:
- How confident is student in answer?
- Do they hesitate or speak firmly?

Retention:
- Can they recall details later?
- Do they remember key points?

Transfer:
- Can they apply concept to different context?
- Do they see connections to other concepts?

Success Criteria:

✓ Diagram-first learning better than text-only
✓ Students report diagram helpful ("much clearer with diagram")
✓ Fewer misconceptions with diagram-first approach
✓ Better long-term retention with diagram
✓ Better transfer to new problems with diagram-first

If not met: Redesign diagram or teaching approach
```

## Diagram-First Examples from Robotics

### Example 1: ROS 2 System Architecture

**DIAGRAM-FIRST APPROACH:**

Title: "ROS 2 Node Network for Humanoid Robot Control"

[Diagram showing:
- Perception nodes (camera, IMU, force sensors) on left
- Central planning/control nodes in middle (sensor fusion, motion planning, controller)
- Actuation nodes (joint commands) on right
- All connected by topics (labeled with data types)
- All sitting on "ROS 2 Middleware (DDS)" at bottom
]

**Visual Description:**

The diagram shows a complete ROS 2 system for a humanoid robot. On the left,
Perception Nodes read sensor data (camera images, IMU readings, force
measurements). These feed into Central Processing nodes in the middle, which
include a Sensor Fusion node combining multiple sensor streams, a Motion
Planner computing desired trajectories, and a Controller generating joint
commands. Finally, Actuation Nodes on the right execute those commands on the
robot's motors. All communication flows through topics (the labeled arrows),
which are managed by ROS 2's DDS middleware at the bottom. Notice that data
only flows when needed—the camera doesn't wait for the controller to be
ready; it just publishes images continuously.

**Key Elements:**

- **Perception Layer** (left): Reads sensors, publishes raw data
- **Processing Layer** (middle): Fuses data, plans motion, computes control
- **Actuation Layer** (right): Executes commands on motors
- **Topics** (arrows): Named communication channels carrying specific data types
- **DDS Middleware** (bottom): Handles all routing and timing

**Detailed Explanation:**

In simulation (Gazebo), this architecture runs entirely within one computer.
Each node is a separate ROS 2 process or thread. The middleware automatically
routes messages between nodes...

[Continue with detailed explanation, referencing diagram throughout]

**Simulation Context:**

In Gazebo, you can visualize this system with:
```bash
ros2 run rqt_graph rqt_graph
```
This shows the actual node network with all connections, confirming that
nodes communicate as the diagram shows.

---

### Example 2: Sensor Fusion Pipeline

**DIAGRAM-FIRST APPROACH:**

Title: "Sensor Fusion Pipeline: Multiple Sensors → Unified State Estimate"

[Diagram showing vertical flow:
IMU sensor (with acceleration, angular velocity icons)
  ↓ (labeled "raw acceleration, rotation rate")
Camera sensor (with image icon)
  ↓ (labeled "image stream")
Wheel encoder (with rotation icon)
  ↓ (labeled "wheel odometry")
       ↓ (all three converge)
   [Sensor Fusion Node]
   └─ Kalman Filter
      ├─ Combines data
      ├─ Reduces noise
      └─ Estimates: position, velocity, orientation
       ↓
   [Unified State Estimate]
   ├─ Position (x, y, z) + confidence
   ├─ Velocity + confidence
   └─ Orientation + confidence
       ↓
   [Controller uses estimate for decisions]
       ↓
   [Robot motion]
]

**Visual Description:**

The diagram shows how multiple noisy sensors combine into one accurate state
estimate. At the top, three different sensors provide information: the IMU
measures acceleration and rotation, the camera measures position visually,
and the wheel encoder tracks motion. Each sensor is good at some things and
bad at others—the IMU is accurate short-term but drifts; the camera is
accurate long-term but slow. These flow into the Sensor Fusion Node (center),
which contains a Kalman Filter. The filter is the key: it weighs each sensor
by how reliable it is at each moment, combines the measurements, and produces
a unified state estimate (position, velocity, orientation). Importantly, the
estimate includes not just values but confidence levels—how certain are we in
each estimate? This uncertainty helps the controller make conservative
decisions when uncertain.

**Why This Matters:**

Notice that no single sensor provides the complete picture. The IMU drifts,
the camera is noisy, the encoder has discrete steps. By fusing them together,
we get something better than any single sensor. In Gazebo simulation, this
fusion is nearly perfect (no real sensor noise), but the principle applies to
real robots where sensor fusion becomes critical.

---

### Example 3: Control Hierarchy

**DIAGRAM-FIRST APPROACH:**

Title: "Humanoid Robot Control Hierarchy: From High-Level Goals to Motor Torques"

[Diagram showing pyramid/hierarchy:

Level 1 (top): Task/Goal
           ↓ "Move forward 2 meters"

Level 2: Motion Planning
         └─ Compute desired joint trajectory
           ↓ "Move hip, knee, ankle at these angles over time"

Level 3: Trajectory Tracking
         └─ Compute desired velocities for each joint
           ↓ "Joint 1: 45°/sec, Joint 2: 30°/sec, ..."

Level 4: Joint Control
         └─ Proportional-Derivative controllers
           ↓ "Motor 1: 50 N·m, Motor 2: 35 N·m, ..."

Level 5 (bottom): Low-Level Execution
                └─ Motor drivers send currents to actuators
                └─ Simulation/Hardware executes motion
]

**Visual Description:**

The diagram shows how high-level commands transform into low-level motor
commands. At the top, a task-level goal ("move forward") flows downward
through multiple layers of abstraction. The Motion Planner converts it into
desired joint positions. The Trajectory Tracker computes required velocities.
The Joint Controller computes the forces/torques needed. Finally, motor
drivers send currents to the motors. Each level can run at different speeds:
the task planner might run at 1 Hz, trajectory tracking at 100 Hz, motor
control at 1000 Hz. This hierarchy makes the system modular—you can change
the planner without changing the controller.

**Why Diagram-First Here:**

Text alone would require explaining: "The planner computes trajectories,
which the tracker follows, which the controller regulates, which the drivers
execute." That's four levels of abstraction to track verbally. The diagram
lets you see the structure instantly—bottom-up flow, each level feeds the
next.

---

## Tools & Methods for Creating Diagrams

### Diagram Creation Tools

**Simple & Fast:**
- **Excalidraw** — Sketchy style, great for quick diagrams
- **Draw.io** — Free, comprehensive shapes, easy to learn
- **Lucidchart** — Professional, intuitive, good templates

**Vector Graphics:**
- **Figma** — Modern design tool, collaborative
- **Adobe Illustrator** — Professional, high quality
- **Inkscape** — Free, open-source alternative to Illustrator

**Flow & Logic:**
- **Graphviz** — Text-based diagram generation
- **Mermaid** — Markdown-based diagrams (integrates with docs)
- **PlantUML** — UML diagrams from text

**3D & Spatial:**
- **Blender** — 3D modeling and rendering
- **OpenSCAD** — Programmatic 3D design
- **Gazebo** — Screenshots from actual simulation

**Comparison & Analysis:**
- **Google Sheets/Excel** — Matrices and comparison tables
- **Venny** — Online Venn diagram maker
- **Piktochart** — Infographic creation

### Template & Pattern Library

Common Robotics Diagram Templates:

```
1. Node Network (Block diagram)
   - Nodes as boxes
   - Topics/Services as arrows
   - Data types labeled on arrows

2. Sensor Pipeline (Flow diagram)
   - Sensors at top
   - Processing steps vertically
   - Final output at bottom

3. Coordinate Frames (Spatial diagram)
   - 3D axes (X, Y, Z)
   - Frame transformations shown
   - Relative positions clear

4. Algorithm Flow (Flowchart)
   - Steps in boxes
   - Decisions as diamonds
   - Flow direction clear

5. System Architecture (Layered diagram)
   - Layers stacked vertically
   - Interfaces between layers
   - Data flow between layers

6. State Machine (Graph)
   - States as circles/nodes
   - Transitions as arrows
   - Conditions on arrows

7. Comparison (Side-by-side or Venn)
   - Two approaches shown
   - Similarities/differences clear
   - Trade-offs visible
```

## Acceptance Criteria

- [ ] Diagram identified as necessary for concept
- [ ] Diagram placed before text explanation
- [ ] Diagram is clear and self-contained
- [ ] All elements appropriately labeled
- [ ] Visual description follows diagram (2–4 sentences)
- [ ] Text explanation references diagram throughout
- [ ] Diagram supports learning objective
- [ ] Complexity appropriate for audience
- [ ] Color/style/layout meaningful (not random)
- [ ] Multiple diagrams at increasing detail (if complex)
- [ ] Simulation-first framing consistent
- [ ] Educational clarity prioritized
- [ ] Students report diagram helpful
- [ ] Learning improved with diagram vs. text-only
- [ ] Diagram connects to code/implementation examples

## Quality Checklist

**Diagram Design:**
- [ ] Purpose clear from title
- [ ] Appropriate complexity for audience
- [ ] Elements clearly labeled
- [ ] Visual properties meaningful (color, size, shape)
- [ ] Relationships/connections explicit
- [ ] Self-contained (understandable without text)
- [ ] Hierarchy of importance evident
- [ ] Professional appearance

**Pedagogy:**
- [ ] Diagram placed before text
- [ ] Visual description clear and helpful
- [ ] Text references diagram throughout
- [ ] Diagram-first improves understanding
- [ ] Concept difficult to explain without diagram
- [ ] Supports stated learning objectives
- [ ] Appropriate for student level

**Content:**
- [ ] Simulation-first framing consistent
- [ ] Educational accuracy maintained
- [ ] No unnecessary complexity
- [ ] Relevant to textbook topic
- [ ] Connects to broader concepts
- [ ] Examples aligned with explanation

**Accessibility:**
- [ ] Alt text descriptive
- [ ] Color not sole encoding (also use shape/pattern)
- [ ] Labels readable at all sizes
- [ ] Sufficient contrast
- [ ] Works in light and dark modes

---

Save it as `.claude/skills/diagram-first/skill.md`
