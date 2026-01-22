---
name: page-flow
description: Improve page flow, readability, and cognitive load for the Physical AI & Humanoid Robotics Interactive Textbook. Enhance paragraph transitions, reduce cognitive overload, balance text with visuals and code blocks, and maintain academic tone while preserving all essential content for optimal learning experiences.
---

# Page Flow Skill

## Overview

This skill enables systematic improvement of page-level readability and cognitive load without removing content or compromising academic rigor. It provides techniques for enhancing paragraph flow, breaking up dense sections, strategically placing visuals and code examples, and creating mental resting points for readers. The focus is on making complex robotics concepts more accessible through better presentation structure.

## When to Use This Skill

- When pages feel too dense or overwhelming
- When students report struggling to follow content
- When a page has more than 3 long paragraphs without breaks
- When code examples and text are intermixed without clear separation
- When readability metrics (Flesch-Kincaid) exceed Grade 14
- When there are no visuals to break up text
- When transitions between concepts feel abrupt
- When reviewing feedback saying "hard to follow" or "confusing"

## Core Principles

### Readability First
- Complexity should come from concepts, not presentation
- Readers should be able to follow narrative without rereading
- Clear structure guides thinking
- Visual hierarchy shows importance
- White space reduces cognitive strain

### Cognitive Load Management
- Working memory has limits (~7 items at once)
- Break information into digestible chunks
- Introduce new concepts one at a time
- Provide mental resting points
- Use spacing to signal relationships

### Strategic Placement
- Lead with main idea (not buried in paragraph)
- Place supporting details nearby
- Group related concepts together
- Separate examples from explanation
- Use visuals to replace long explanations

### Preservation & Rigor
- Never remove content without justification
- Academic tone must be maintained
- Technical accuracy non-negotiable
- All important information remains
- Only presentation structure changes

## Step-by-Step Page Flow Optimization Workflow

### Phase 1: Audit Current Page

**1.1 Measure Readability Metrics**
```
Tools to Use:
- Flesch-Kincaid Grade Level (aim: 12–14 for technical content)
- Flesch Reading Ease Score (aim: 50–60 for academic)
- Gunning Fog Index (aim: 12–15)
- Average sentence length (target: 15–20 words)
- Average paragraph length (target: 3–5 sentences, max 8)
- Words per sentence distribution

How to Analyze:

1. Flesch-Kincaid Grade Level:
   - Formula: 0.39(words/sentences) + 11.8(syllables/words) - 15.59
   - Interpretation:
     * Grade 10–12: Good for technical content (some complexity expected)
     * Grade 13–14: Appropriate for advanced technical (this is textbook level)
     * Grade 15+: Too complex, simplify sentence structure
   - Action if high: Break long sentences, use shorter words

2. Flesch Reading Ease:
   - Scale: 0–100 (higher = easier)
   - 60–70: Standard reading level (newspapers)
   - 50–60: Difficult (academic papers) ← TARGET FOR TEXTBOOK
   - Below 30: Very difficult (specialized)
   - Action if low: Shorter sentences, simpler structure

3. Gunning Fog Index:
   - Estimates years of formal education needed
   - Target: 12–15 for college-level technical content
   - Action if high: Reduce complex words, break sentences

4. Sentence Analysis:
   - Average sentence length: 15–20 words
   - If average > 25 words: Too long, split sentences
   - If many sentences 30+ words: Break into multiple
   - Variety matters: Mix short (8–10 words) with longer (20–25 words)

5. Paragraph Analysis:
   - Optimal: 3–5 sentences per paragraph
   - Maximum: 8 sentences (after that, break into 2 paragraphs)
   - If any paragraph > 10 sentences: Definitely break up
   - Check: Does each sentence relate to topic sentence?

Example Analysis:

BEFORE:
"The Extended Kalman Filter (EKF) is a sophisticated algorithm used
in robotics for estimating the state of complex dynamic systems by
combining measurements from multiple sensors and using a mathematical
model of the system to produce state estimates that are more accurate
and robust than any single sensor could provide alone."

Metrics:
- Sentence word count: 45 words (too long)
- Grade level: 16+ (too difficult)
- Problem: Single sentence with too many clauses

AFTER:
"The Extended Kalman Filter (EKF) estimates system state by combining
multiple sensor measurements. It uses a mathematical model to predict
the system's behavior. By fusing sensor data with predictions, the EKF
produces more accurate estimates than any single sensor could achieve."

Metrics:
- Average sentence: 15 words (good)
- Grade level: 13 (appropriate)
- Structure: Logical progression
```

**1.2 Assess Content Density**
```
Visual Analysis:

Questions:
1. How much text per screen (at normal zoom)?
   - Optimal: 60–70% text, 30–40% white space
   - Too dense: > 80% text, < 20% white space
   - Action if dense: Add breaks, visuals, white space

2. How many visuals on the page?
   - Optimal: 1 visual per 300–400 words of text
   - If none: Page likely feels text-heavy
   - If too many: May distract from text
   - Action: Aim for 1 visual per major concept

3. Where are code examples?
   - Optimal: 1 code example per concept
   - Too many: Overwhelming, breaks up flow
   - Too few: Students can't practice
   - Action: 1 well-explained example > 3 poorly explained

4. Where are transitions between concepts?
   - Visible pauses (subheading, visual, code)?
   - Or abrupt jumps (no warning)?
   - Action if abrupt: Add transition sentence/heading

5. What's the reading flow?
   - Does narrative guide you through?
   - Or does structure feel random?
   - Action: Map concept flow, ensure clear progression

Example Density Map:

BEFORE (Text-Heavy):
[Text paragraph 1: 200 words]
[Text paragraph 2: 180 words]
[Text paragraph 3: 150 words]
[Text paragraph 4: 170 words]
[Code example: 30 lines]
[Text paragraph 5: 160 words]
← Heavy text blocks, sparse visuals, monotonous

AFTER (Balanced):
[Text intro: 80 words]
[Subheading: "Key Concept"]
[Text explanation: 120 words]
[Diagram explaining concept]
[Subheading: "Implementation"]
[Code example: 25 lines]
[Text explaining code: 90 words]
[Callout box: "Important consideration"]
[Text conclusion: 100 words]
← Varied blocks, clear sections, visual breaks
```

**1.3 Identify Problem Areas**
```
Readability Problems Checklist:

□ Long dense paragraphs (> 8 sentences)
□ No visual breaks (white space, images, code)
□ Abrupt concept transitions (no bridge)
□ Very long sentences (> 30 words)
□ Complex sentence structure (multiple clauses)
□ Too many new terms introduced at once
□ Code examples mixed with explanation
□ Important info buried in paragraph (not emphasized)
□ Passive voice dominates (slows reading)
□ No subheadings (hard to scan)
□ No lists/bullets (information in paragraph form)
□ Unclear topic sentence (paragraph purpose not obvious)
□ Missing context (what is this about?)
□ Too much jargon (specialized terms not explained)
□ No summary (big ideas not highlighted)

Severity Assessment:
- 1–2 issues: Minor readability tweaks needed
- 3–5 issues: Moderate restructuring recommended
- 6+ issues: Major revision needed

Priority:
1. Fix critical (no visuals, no breaks, too dense)
2. Fix important (transitions, emphasis)
3. Fix nice-to-have (minor sentence rewrites)
```

### Phase 2: Improve Paragraph Flow

**2.1 Strengthen Topic Sentences**
```
Purpose: First sentence should signal what paragraph is about

WEAK TOPIC SENTENCES:
"In this section, we will explore the topic of ROS 2 topics."
→ Unclear, vague, signals nothing

"One of the key concepts in ROS 2 is the idea of topics."
→ Wordy, signals importance but not content

STRONG TOPIC SENTENCES:
"ROS 2 topics enable asynchronous communication between nodes."
→ Clear, specific, signals the main point

"The publisher-subscriber pattern decouples communicating components."
→ Specific, explains the benefit

"Quality of Service (QoS) settings control how ROS 2 delivers messages."
→ Clear what QoS is, signals paragraph content

Pattern: [Subject] [Action Verb] [Benefit/Effect]

Examples:
- "Sensor fusion improves state estimation accuracy."
- "Gazebo simulation enables safe controller testing."
- "Digital twins accelerate development cycles."
- "Humanoid kinematics defines reachable workspace."

Revision Process:
1. Read first sentence of each paragraph
2. Can you summarize paragraph in first sentence?
3. If no: Rewrite first sentence to be more specific
4. If yes: Check that it's interesting/clear

Example Revision:

BEFORE:
"There are many different aspects to consider when using ROS 2 in a
real-world robotics application. One of the most important things to think
about is how you structure your nodes. The way you organize your nodes
affects the overall performance and reliability of the system. This section
discusses some best practices for node organization."

Problem: Topic sentence unclear; buried in 4 sentences

AFTER:
"Proper node organization in ROS 2 systems improves both performance and
maintainability. When designing your node architecture, consider these
key principles: separation of concerns, modularity, and extensibility.
This section covers best practices for organizing nodes in complex systems."

Improvement: Clear topic sentence; supporting details follow
```

**2.2 Create Logical Transitions Between Sentences**
```
Purpose: Guide reader from one idea to the next

ABRUPT TRANSITIONS (Reader has to work):
"The EKF estimates system state. A particle filter is an alternative."
→ Reader must infer: "Here are two different algorithms"

SMOOTH TRANSITIONS (Reader guided):
"The EKF estimates system state using Gaussian assumptions. An alternative
approach, the particle filter, makes fewer assumptions about distributions."
→ Explicit connection: "alternative approach" signals comparison

Common Transition Patterns:

Pattern 1: Time/Sequence
Signals: First, then, next, finally, meanwhile, after, before
Example: "First, the sensor sends data. Then, the filter processes it."

Pattern 2: Cause/Effect
Signals: Because, as a result, consequently, therefore, due to
Example: "Because the network has latency, we must buffer messages."

Pattern 3: Comparison
Signals: Similarly, likewise, in contrast, on the other hand, whereas
Example: "Topics send data asynchronously. Services, in contrast, wait for responses."

Pattern 4: Emphasis
Signals: In fact, indeed, importantly, notably, significantly
Example: "QoS matters for reliability. In fact, poor QoS settings cause data loss."

Pattern 5: Addition
Signals: Furthermore, additionally, moreover, also, in addition
Example: "The EKF is efficient. Moreover, it handles nonlinear systems well."

Pattern 6: Illustration
Signals: For example, for instance, specifically, such as, in particular
Example: "Many sensor data requires synchronization. For example, combining IMU
and camera data requires precise time alignment."

Example Revision:

BEFORE:
"ROS 2 topics use asynchronous publish-subscribe communication. Services
provide synchronous request-response communication. Actions allow long-
running tasks with feedback."

Problem: Sentences disconnected; reader must infer relationships

AFTER:
"ROS 2 provides three communication mechanisms: Topics enable asynchronous
publish-subscribe communication, ideal for continuous data streams. Services,
in contrast, provide synchronous request-response communication for discrete
requests. For long-running tasks requiring feedback, Actions offer a middle
ground combining both patterns."

Improvement: Clear relationships shown via transitions and structure
```

**2.3 Vary Sentence Length & Structure**
```
Purpose: Maintain rhythm and prevent monotony

MONOTONOUS (All sentences same length & structure):
"The EKF is an estimation algorithm. It uses a mathematical model. It
combines sensor measurements. It reduces estimation error. It is widely
used in robotics."

Metrics: Average 7 words per sentence; all follow [Subject Verb Object]
Problem: Repetitive, feels choppy, loses reader

RHYTHMIC (Varied length & structure):
"The Extended Kalman Filter (EKF) is a powerful estimation algorithm that
solves a common robotics challenge: accurately estimating system state despite
sensor noise. How does it work? By maintaining a mathematical model of
the system, the EKF predicts future state. Then, when new sensor data
arrives, it updates the prediction. This cycle—predict, measure, update—
continues at high frequency, producing estimates far more accurate than
any single sensor could achieve."

Metrics: Sentences range 5–25 words; varied structure
Problem: None—reader engaged, concepts clear

Variation Techniques:

Technique 1: Short + Long + Short
Short: "Sensor fusion matters." (3 words)
Long: "It combines multiple sensors to reduce uncertainty and improve accuracy." (11 words)
Short: "Why? Because no single sensor is perfect." (7 words)
Effect: Emphasis via rhythm

Technique 2: Statement + Question
Statement: "The controller needs tuning parameters."
Question: "How do we choose good values?"
Effect: Engages reader, signals new topic

Technique 3: Simple + Complex + Simple
Simple: "We have two options." (4 words)
Complex: "The first, using centralized planning, offers coordination benefits but increases latency." (12 words)
Simple: "The second, decentralized planning, prioritizes speed." (6 words)
Effect: Clarity after complexity

Technique 4: Reverse: Complex + Simple
Complex: "Although digital twins require initial investment in high-fidelity models, detailed sensors, and continuous synchronization, they accelerate development by enabling risk-free experimentation." (23 words)
Simple: "They're worth it." (3 words)
Effect: Emphasis via simplification

Example Revision:

BEFORE (Monotonous):
"The Kalman filter assumes Gaussian distributions. The extended Kalman filter
linearizes around the current estimate. The unscented Kalman filter uses sample
points. The particle filter uses many samples. Each approach has trade-offs."

AFTER (Rhythmic):
"Different filtering approaches make different assumptions. The Kalman filter assumes
Gaussian distributions—simple but restrictive. The extended Kalman filter linearizes
the nonlinearities. The unscented Kalman filter, more sophisticated, uses sample
points rather than linearization. Finally, particle filters abandon the Gaussian
assumption entirely, using many samples to approximate any distribution. Which
should you use? That depends on your problem's nonlinearity and computational
budget."

Metrics:
- Varied sentence length: 4 to 23 words
- Varied structure: Question + answer, lists, complex ideas
- Readability improves despite complexity
```

### Phase 3: Reduce Cognitive Overload

**3.1 Introduce Concepts Sequentially**
```
Principle: Present one concept at a time; build complexity gradually

OVERLOAD (Too many new ideas at once):
"The extended Kalman filter estimates system state by linearizing the
nonlinear system around the current estimate using Taylor series expansion,
combining this with Gaussian assumptions about sensor noise and process noise,
while maintaining a state covariance matrix that gets updated through prediction
and measurement steps using matrix operations across a distributed system with
time-delayed sensors and network latency."

Problem: Reader encounters 8+ new concepts in one sentence
- Linearization
- Taylor series
- Gaussian assumptions
- Sensor noise
- Process noise
- State covariance
- Prediction step
- Measurement step
- Matrix operations
- Distributed system
- Time-delayed sensors
- Network latency

MANAGEABLE (One concept with context):
"The extended Kalman filter extends the basic Kalman filter to handle
nonlinear systems. How? By linearizing the system equations around the current
estimate. This linearization allows us to use the same matrix-based update
equations as the linear Kalman filter. [Next sentence introduces next concept]"

Problem solved: One concept (linearization) explained clearly
Then: Next paragraph introduces next concept (Gaussian assumptions)

Sequencing Strategy:

Step 1: Define the main concept
"The EKF extends the Kalman filter to nonlinear systems."

Step 2: Explain the key mechanism
"It does this by linearizing (approximating) the nonlinear equations."

Step 3: Connect to familiar knowledge
"This is similar to how Taylor series approximate nonlinear functions."

Step 4: Provide an example
"For a robot, this allows us to track position even when motion model is nonlinear."

Step 5: Signal next step
"But the EKF assumes sensor noise is Gaussian. [Next paragraph explains why this matters]"

Example Revision:

BEFORE (Overload):
"Sensor fusion combines accelerometer, gyroscope, and magnetometer data using a
Kalman filter that estimates position, velocity, and orientation while filtering
noise and compensating for sensor drift in a real-time system."

Problem: Definition, components, algorithm, state variables, and function all jumbled

AFTER (Sequential):
"Sensor fusion combines data from multiple sensors to estimate robot state.

Why multiple sensors? Each sensor has strengths and weaknesses. An
accelerometer measures acceleration but drifts over time. A gyroscope measures
rotation rates accurately but accumulates error. Together, they provide
complementary information.

To combine them optimally, we use the Kalman filter. It estimates
the true state (position, velocity, orientation) by weighting each sensor
based on its reliability. The filter runs in real-time, continuously
updating estimates as new data arrives."

Improvement:
- One main idea per paragraph
- Context for why multiple sensors
- Separate explanation of each sensor
- Then introduce the algorithm
- Reader builds understanding progressively
```

**3.2 Use Lists for Related Items**
```
Principle: Multiple items belong in lists, not paragraphs

PARAGRAPH FORMAT (Hard to parse):
"There are several important configuration parameters in ROS 2. The first
one is the QoS history, which can be set to keep all messages or just the
most recent one. Another parameter is the reliability setting, which determines
whether messages are best-effort or require guaranteed delivery. You also
need to set the durability, which controls whether late-joining subscribers
receive past messages. Finally, the deadline parameter sets the expected time
between messages and the lifespan parameter sets how long a message remains
valid."

Problem:
- Reader must extract items from prose
- Hard to compare items
- Details scattered across sentences
- Difficult to reference

LIST FORMAT (Easy to parse):
"ROS 2 QoS settings include:

- **History**: Keep all messages or just the most recent
- **Reliability**: Best-effort or guaranteed delivery
- **Durability**: Do late-joining subscribers receive past messages?
- **Deadline**: Expected time between messages
- **Lifespan**: How long a message remains valid"

Problem solved:
- Items clearly separated
- Parallel structure (easy comparison)
- Scannable
- Easy to reference

When to Use Lists:

Use lists for:
✓ Steps in a process (numbered)
✓ Items in a set (bullet)
✓ Pros and cons (bullet with separation)
✓ Parameters with descriptions (definition list)
✓ Multiple examples (bullet)
✓ Requirements or criteria (checkbox if applicable)

Don't use lists for:
✗ Complex relationships (needs prose or diagram)
✗ Single item (doesn't need list format)
✗ Items that build on previous (need narrative flow)
✗ Emphasis of one idea (use heading + paragraph)

Example Revision:

BEFORE (Paragraph):
"When designing a humanoid robot controller, you need to consider several
factors. You should think about the control frequency, which determines how
often commands are sent to motors. You also need to account for sensor
latency, which means there's a delay between when a sensor measures something
and when the measurement arrives at the controller. You must implement safety
limits to prevent damage. And you should use simulation to validate the
controller before deploying to real hardware."

AFTER (List + Brief Intro):
"Designing a humanoid robot controller requires careful consideration of:

- **Control frequency**: How often commands are sent (typically 100–1000 Hz)
- **Sensor latency**: Delays between measurement and controller receiving data
- **Safety limits**: Constraints to prevent joint damage or unsafe movements
- **Simulation validation**: Testing in Gazebo before hardware deployment"

Improvement: Clear structure, comparable items, easier to follow
```

**3.3 Create "Mental Resting Points"**
```
Principle: Regular breaks help working memory consolidate information

Resting Point Types:

Type 1: Visual Break (Image/Diagram)
Function: Gives eyes and mind a break from text
Placement: After 300–400 words of explanation
Example: After explaining sensor fusion concept, place diagram showing data flow

Type 2: Code Example
Function: Shifts from explanation to concrete example
Placement: After explaining concept
Example: After explaining ROS 2 topics, show publisher implementation

Type 3: Callout Box (Important Note)
Function: Highlights key takeaway
Placement: After detail section
Content: "Key Insight: [One sentence summarizing the concept]"

Type 4: Bulleted Summary
Function: Consolidates paragraph into main points
Placement: End of major section
Example:
"Key takeaways:
- Concept 1 is important because...
- Concept 2 enables...
- Concept 3 is different from..."

Type 5: Conceptual Heading
Function: Signals topic shift, pauses reading
Placement: Between major ideas
Example: "### Why This Matters" or "### Real-World Application"

Type 6: Whitespace
Function: Visual break, not mental content
Placement: Between sections
Technique: Add 2–3 blank lines before new section

Placement Strategy:

BEFORE (No resting points):
[Text paragraph: 400 words]
[Text paragraph: 350 words]
[Code example: 40 lines]
[Text paragraph: 300 words]
[Text paragraph: 380 words]
→ Reader exhausted by end

AFTER (Regular resting points):
[Text paragraph: 300 words]
[Diagram illustrating concept]
[Text paragraph: 250 words with subheading "Why This Matters"]
[Callout box: Key insight]
[Code example: 30 lines]
[Text paragraph: 250 words with subheading "Common Mistakes"]
[Bulleted summary: 3 main points]
[Text paragraph: 200 words concluding section]
→ Reader can follow comfortably

Example: ROS 2 Topics Lesson

Before improvements:
- 800 words of text explanation (too much!)
- 1 code example at end
- No visuals
- No pauses

After improvements:
1. Opening paragraph (100 words): What are topics?
2. Diagram: Pub/sub architecture visual
3. Explanation (150 words): How they work
4. Simple code example: Basic publisher
5. Callout: "Key concept: Decoupling"
6. Explanation (150 words): Asynchronous benefits
7. Slightly complex example: QoS settings
8. Callout: "Common mistake: Ignoring latency"
9. Summary paragraph (100 words): Recap
10. List: Key takeaways

Structure: Each section ~100–150 words followed by visual/code rest point
```

### Phase 4: Balance Text, Visuals, and Code

**4.1 Optimal Ratio & Placement**
```
General Guidelines:

Page Composition (by area):
- Text: 50–60% (main content)
- Visuals: 20–30% (diagrams, images, figures)
- Code: 15–25% (examples, snippets)
- Whitespace: 10–15% (breathing room)

For Different Content Types:

CONCEPT EXPLANATION (e.g., "Understanding Kinematics")
- 60% text (definitions, explanation)
- 25% visuals (diagrams, math notation)
- 15% code (demonstrations if applicable)

IMPLEMENTATION TUTORIAL (e.g., "Implement ROS 2 Publisher")
- 40% text (setup, explanation, caveats)
- 20% visuals (screenshots, architecture)
- 40% code (implementation, examples)

COMPARISON/ANALYSIS (e.g., "Compare Control Architectures")
- 50% text (explanation, analysis)
- 40% visuals (comparison diagrams, charts)
- 10% code (key examples)

QUICK REFERENCE (e.g., "QoS Settings Summary")
- 30% text (brief descriptions)
- 40% visuals (tables, icons, infographics)
- 30% code (parameter examples, snippets)

Placement Rules:

Rule 1: Introduce before showing
- Text explains concept
- Then visual or code demonstrates it
- Not: Code/visual first, then explanation

Rule 2: One visual per 300–400 words
- More often: Readers get distracted
- Less often: Text feels dense
- Optimal: Regular, predictable rhythm

Rule 3: Code immediately after discussion
- Explain a technique
- Show code implementing it
- Gap = reader confusion

Rule 4: Visuals replace or supplement, not duplicate
- Don't show diagram, then explain exactly what diagram shows (redundant)
- Instead: Diagram shows flow, text explains "why it's designed this way"

Rule 5: No more than 50 lines of code at once
- Longer: Requires scrolling, hard to follow
- Strategy: Break into sub-examples, use annotations

Example Before/After:

BEFORE (Poorly Balanced):
[800 words of text without any break]
[Code example: 60 lines]
[200 more words of text]
[Another code example: 50 lines]

Problem: Dense text block, then sudden code shift

AFTER (Well Balanced):
[200 words: Concept explanation]
[Diagram: Concept visualization]
[150 words: How it works]
[Code example: 25 lines showing basic usage]
[200 words: More detailed explanation]
[Screenshot: Running the code in terminal]
[Code example: 30 lines advanced usage]
[Callout: Common mistakes]
[100 words: Summary]

Problem solved: Regular rhythm, alternating text/visual/code
```

**4.2 Format Code for Readability**
```
Code Formatting Best Practices:

Principle: Code should be easy to scan, not require intense focus

Format 1: Inline Code
Use for: Variable names, function calls, small snippets
Format: `variable_name` or `function()`
Example: "The `create_publisher()` method initializes a publisher."

Format 2: Code Block (Highlight)
Use for: Complete examples, critical sections
Format: Syntax highlighting, line numbers
Max length: 30–50 lines (break longer examples)

Format 3: Annotated Code
Use for: Complex sections needing explanation
Format: Side-by-side code and explanation
Example:
```
publisher = node.create_publisher(...)  # Create publisher
                                        # (topic, message type, QoS)
```

Format 4: Code + Callouts
Use for: Drawing attention to specific lines
Format: Highlight key lines, add comment/arrow
Example:
```
def callback(msg):              # ← This function runs on each message
    process_data(msg.data)      # ← Extract and process data
    publish_result(...)         # ← Send result to next node
```

Code Formatting Rules:

Rule 1: Syntax highlighting
✓ Use language-specific highlighting (Python, C++, etc.)
✓ Helps readers quickly parse code
✓ Types are visible (strings, comments, keywords)

Rule 2: Consistent indentation
✓ Use spaces (not tabs) for consistency
✓ Indent 2 or 4 spaces (choose one, stick with it)
✓ Helps show code structure

Rule 3: Line numbers (when code > 10 lines)
✓ Allows reference: "See line 5 where we..."
✓ Helps with explanations

Rule 4: Meaningful variable names
✗ Use abbreviations: `pn`, `msg_cnt`, `tmp`
✓ Use clear names: `publisher_node`, `message_count`, `temperature`
✓ Easier to understand without additional explanation

Rule 5: Comments for non-obvious parts
✗ "i = i + 1  # increment i" (obvious)
✓ "iteration_count += 1  # move to next sensor sample" (context)

Example Code Formatting:

BEFORE (Hard to Read):
```
def cb(m):
  d=m.d
  r=compute(d)
  p.pub(r)
```

Problems: Abbreviations, no comments, unclear what's happening

AFTER (Easy to Read):
```python
def sensor_callback(message):              # (1) Triggered on new sensor data
    """Process incoming sensor message."""
    sensor_data = message.data              # (2) Extract data from message
    result = compute_estimate(sensor_data)  # (3) Calculate estimate
    publisher.publish(result)               # (4) Send result to next node
```

Problems solved:
- Clear function names
- Line numbers for reference
- Comments explain intent
- Docstring documents purpose
```

### Phase 5: Optimize Transitions Between Sections

**5.1 Create Section Transitions**
```
Purpose: Guide readers from one major topic to next

Transition Elements:

Element 1: Section Heading
Function: Signals topic shift
Format: Use heading hierarchy (H2 for major, H3 for sub)
Example: "## From Simulation to Reality: Deploying Your Controller"

Element 2: Transition Paragraph (Bridge)
Function: Connects prior topic to new topic
Length: 1–2 sentences
Placement: Between sections
Example:
"Now that you understand how the Kalman filter estimates state, we need
to address a practical challenge: sensors don't report instantaneously. In
the next section, we'll explore how to handle sensor delays."

Element 3: Preview Statement
Function: Tells reader what's coming
Placement: Start of new section
Example:
"This section covers three approaches to handle latency:
1. Measurement delay compensation
2. Prediction with uncertainty
3. Adaptive filtering"

Element 4: Recap + Transition
Function: Summarizes prior section, signals new direction
Example:
"We've established that the EKF maintains state estimates and uncertainties.
The question becomes: how accurate is this estimate? In this section, we'll
analyze filter performance and discuss scenarios where the EKF succeeds or
fails."

Transition Patterns:

Pattern 1: Chronological
Transition: "After you understand [concept], you're ready to [apply it]"
Example: "Now that you've learned the theory, let's implement it."

Pattern 2: Logical Progression
Transition: "This prepares us for [next complex concept]"
Example: "Understanding transformations (TF) is essential for the next topic:
motion planning."

Pattern 3: Problem → Solution
Transition: "The challenge is [X]. The solution is [Y]."
Example: "The challenge is handling network delays. The solution is
predictive filtering."

Pattern 4: Simple → Complex
Transition: "We've seen simple [X]. Now we'll examine complex variations."
Example: "We've implemented a basic publisher. Now let's add quality of
service controls for reliability."

Pattern 5: Theory → Practice
Transition: "Now that we understand the theory, let's put it into practice."
Example: "Theory complete. Let's build it."

Example Section Transition:

BEFORE (Abrupt):
[End of section: "That's how sensor fusion works."]
[New heading: "## Control Algorithms"]
[First sentence: "Control algorithms determine motor commands."]

Problem: No bridge; reader must connect concepts

AFTER (Smooth):
[End of section: "That's how sensor fusion works."]
[Bridge paragraph: "With accurate state estimates from sensor fusion, we can now
develop control algorithms that command the actuators. The estimate accuracy
directly impacts controller performance."]
[New heading: "## Control Algorithms: From State to Action"]
[Preview: "This section explores three control approaches: proportional-integral-derivative,
model predictive, and learning-based."]
[First sentence: "Control algorithms use state estimates to determine motor commands."]

Problem solved: Clear connection, smooth transition, reader oriented
```

**5.2 Cross-Reference Related Content**
```
Purpose: Help readers find related information

Cross-Reference Types:

Type 1: Prerequisite Link
Function: Directs to required prior knowledge
Format: "See [Section]: [Topic]"
Example: "See Section 3.2: Linear Algebra Refresher if you need background."

Type 2: Related Topic
Function: Links to tangential but important content
Format: "For more on [X], see [Section]"
Example: "For more on QoS settings, see Section 2.3."

Type 3: Forward Reference
Function: Prepares reader for upcoming concepts
Format: "We'll explore [X] in detail in [Section]"
Example: "We'll explore how to tune these gains in Section 5."

Type 4: Comparison Reference
Function: Links to comparative analysis
Format: "Contrast with [Alternative] in Section [X]"
Example: "Contrast with the particle filter approach in Section 4.3."

Placement Rules:

Rule 1: Prerequisite links early
- If "Understanding transformations is necessary", mention early
- Point to prerequisite section
- Allow reader to decide: "Do I need this background?"

Rule 2: Related topic links in context
- When you mention something related
- Offer link to deep dive
- Example: "The Extended Kalman Filter... (see Section 4 for advanced filtering)"

Rule 3: Forward references sparingly
- Too many confuse readers
- Use when reader might wonder "Why are we doing this?"
- Example: "We're learning state estimation first; control comes next."

Example Cross-Referencing:

BEFORE (No links):
"The controller needs to handle sensor noise. This section explores filtering
techniques. First, we'll cover the basics."

Problem: Reader might not understand prerequisites, might get lost

AFTER (Clear references):
"The controller needs to handle sensor noise. This requires understanding
state estimation (see Section 4.1 for background if needed). This section
explores filtering techniques that reduce noise while preserving signal.

We'll cover three approaches with increasing sophistication:
1. Moving average (simple but effective for slow dynamics)
2. Kalman filter (optimal for linear systems; see Section 4.2 for details)
3. Extended Kalman filter (handles nonlinear systems; covered in Section 4.3)"

Problem solved:
- Prerequisites clear
- Reader can skip or jump to section as needed
- Scope clear (three approaches, each linked)
```

### Phase 6: Polish & Validate

**6.1 Read-Through for Flow**
```
Validation Checklist:

Reading Test (In Order):

□ Can you skim this page in 2 minutes and understand main ideas?
  If no: Too dense, restructure with more headings/visuals

□ Does each paragraph have a clear topic sentence?
  If no: Rewrite first sentences to be more specific

□ Are transitions between paragraphs smooth?
  If no: Add transition words/sentences

□ Is technical terminology introduced before use?
  If no: Add definition or move definition earlier

□ Can you follow the argument without outside knowledge?
  If no: Add more context or explanation

□ Does anything feel out of place or confusing?
  If yes: Reorder or clarify

□ Are visuals placed immediately after relevant text?
  If no: Move visual to better location

□ Do code examples have sufficient explanation?
  If no: Add comments or surrounding text

□ Are there places where you needed to reread?
  If yes: Simplify or restructure

□ Does page feel balanced (not too text-heavy)?
  If no: Add visuals or break into shorter paragraphs

Fairness Test:

Ask 2–3 people unfamiliar with content to read page and answer:
1. What is this page about? (Should match your intent)
2. What did you find confusing? (Note any trouble spots)
3. Where did you get stuck? (Identify problem areas)
4. Did you feel the page was easy to follow? (Overall impression)

If they identify issues: Fix them before publication
```

**6.2 Readability Metrics Final Check**
```
Run Final Metrics:

Tool: Use Flesch-Kincaid Grade Level calculator (paste page text)

Target Ranges:
- Grade 12–14: Appropriate for college-level technical
- Reading Ease 50–60: Difficult but not overly complex

If Grade > 14:
  Action: Shorten sentences or simplify word choice
  Example: "utilize" → "use", "subsequently" → "then"

If Reading Ease < 50:
  Action: Break paragraphs into shorter ones, add visuals

If average sentence > 25 words:
  Action: Break into multiple sentences

If no paragraph < 3 sentences:
  Action: Some should be very short (2–3 sentences) for emphasis

If no paragraph > 6 sentences:
  Good: Manageable lengths

If page has no visuals:
  Action: Add at least 1 diagram, screenshot, or code example

Example Improvement:

BEFORE:
- Grade level: 16
- Reading ease: 35
- Average sentence: 28 words
- Avg paragraph: 9 sentences
- No visuals

Actions:
1. Shorten sentences (28 → 18 words avg)
2. Break paragraphs (9 → 5 sentences max)
3. Add 2 diagrams
4. Simplify vocabulary

AFTER:
- Grade level: 13
- Reading ease: 55
- Average sentence: 16 words
- Avg paragraph: 4 sentences
- 2 diagrams added

Result: More accessible, equally rigorous
```

## Page Flow Examples: Before & After

### Example 1: Dense Concept Explanation

**BEFORE:**
```
## Extended Kalman Filter Theory

The Extended Kalman Filter (EKF) is a nonlinear state estimation technique
that extends the capabilities of the basic Kalman filter by using Taylor
series linearization to approximate nonlinear system and measurement models,
allowing the recursive estimation algorithm to work with systems described
by nonlinear differential equations while maintaining the computational
efficiency of the original linear Kalman filter. The EKF maintains a state
vector and covariance matrix that are updated in two phases: a prediction
phase where the system model advances the state to the next time step using
numerical integration or analytical solutions depending on the model
complexity, and an update phase where new measurement data is incorporated
using Bayes' rule to adjust the state estimate and uncertainty based on the
measurement innovation and the relative confidence in the model versus the
sensor. The key advantage of the EKF over the standard Kalman filter is that
it can handle the nonlinearities inherent in most real-world robotics systems
such as the nonlinear kinematics of robot arms, the nonlinear dynamics of
aircraft or spacecraft, and the nonlinear observation equations from cameras
or other nonlinear sensors, making it the most commonly used filtering
approach in practical robotic applications despite some limitations in
accuracy for highly nonlinear systems where more sophisticated approaches like
the unscented Kalman filter or particle filters may be preferred.

[Single paragraph, 250+ words, no breaks, no visuals, dense content]
```

**AFTER:**
```
## Extended Kalman Filter: Theory and Practice

### What Is the Extended Kalman Filter?

The Extended Kalman Filter (EKF) is a state estimation algorithm that handles
nonlinear systems. Unlike the basic Kalman filter (which assumes linear models),
the EKF can work with real-world systems that have nonlinear behavior.

**Key insight**: The EKF uses linearization—approximating nonlinear equations as
linear at each time step. This keeps the algorithm efficient while handling
nonlinearity.

### How It Works: Two-Phase Update

The EKF operates in two phases:

1. **Prediction**: The system model predicts the next state
   - Integrate the nonlinear system equations forward in time
   - Compute how uncertainty grows due to process noise
   - Result: predicted state and uncertainty

2. **Update**: New measurements refine the prediction
   - Calculate measurement innovation (difference from prediction)
   - Weight by relative confidence (model vs. sensor)
   - Adjust state estimate and uncertainty
   - Result: improved state estimate

[Diagram showing prediction and update cycle]

### Why the EKF Matters in Robotics

Real robotic systems are typically nonlinear:
- Robot arm kinematics (positions don't scale linearly with joint angles)
- Aircraft dynamics (aerodynamic forces are velocity-squared)
- Camera observations (image coordinates are nonlinear in 3D space)

The EKF handles these nonlinearities while remaining computationally efficient—
a balance that makes it the industry standard.

### When to Use the EKF

✓ **Use the EKF when**:
- Your system has moderate nonlinearity
- You need real-time performance
- Computational resources are limited

⚠ **Consider alternatives when**:
- Nonlinearity is extreme (high-speed aircraft, chaotic systems)
- You can afford higher computational cost (unscented Kalman filter, particle filter)

### Summary

The EKF bridges linear and nonlinear estimation. By linearizing at each step,
it maintains efficiency while handling the nonlinear behavior of real robots.

[Code example: 25 lines showing EKF implementation]
```

**Improvements:**
- Broken into logical sections (What / How / Why / When)
- Short paragraphs (3–5 sentences each)
- Uses lists for parallel concepts
- Includes diagram
- Callout boxes for key insights
- Code example at end
- Grade level: 16 → 13
- Reading ease: 35 → 55
- Academic rigor: Maintained ✓
```

### Example 2: Dense Implementation Tutorial

**BEFORE:**
```
## Implementing ROS 2 Publishers

To implement a ROS 2 publisher, you need to create a node, initialize it,
create a publisher object with the appropriate topic name and message type,
and then implement a publishing loop that sends messages at regular intervals.
The following code demonstrates the basic structure, but you should be aware
that proper error handling, parameter configuration, and Quality of Service
settings should be considered for production systems. Additionally, you need
to ensure that your message types are properly defined in the package's
interfaces directory and that you've added the necessary dependencies to your
package.xml file including rclpy for the ROS 2 Python client library and the
message package definitions. The key function is create_publisher which takes
the message type, topic name, and QoS settings, and returns a publisher object
that you can use to publish messages. Once you have the publisher, you can
call its publish method with the message data and it will be sent to all
subscribers on that topic. Here is the code:

def main():
    node = rclpy.Node('publisher_node')
    publisher = node.create_publisher(String, '/topic_name', 10)
    message = String()
    message.data = 'Hello'
    publisher.publish(message)
```

[Dense explanation, code at end without setup, no structure]
```

**AFTER:**
```
## Implementing ROS 2 Publishers

### Setup: Package Dependencies

First, ensure your `package.xml` includes the ROS 2 dependencies:

```xml
<exec_depend>rclpy</exec_depend>
<exec_depend>std_msgs</exec_depend>
```

### Step 1: Import Required Libraries

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
```

### Step 2: Create the Node

Every ROS 2 program starts with a node:

```python
def main():
    rclpy.init()  # Initialize ROS 2
    node = Node('publisher_node')  # Create a node named 'publisher_node'
```

The node is your entry point to the ROS 2 system.

### Step 3: Create the Publisher

```python
publisher = node.create_publisher(
    String,           # Message type
    '/topic_name',    # Topic name where messages go
    10                # QoS queue size
)
```

**What this does**:
- `String`: Publishes text messages (define custom types in `.msg` files)
- `'/topic_name'`: Subscribers listen on this exact topic name
- `10`: Queues up to 10 messages if subscribers are slow

### Step 4: Publish Messages

```python
message = String()
message.data = 'Hello, ROS 2!'
publisher.publish(message)  # Send the message
```

### Complete Example

Here's the full working program:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class PublisherNode(Node):
    def __init__(self):
        super().__init__('publisher_node')
        self.publisher = self.create_publisher(String, '/greeting', 10)
        self.timer = self.create_timer(1.0, self.publish_message)
        self.counter = 0

    def publish_message(self):
        message = String()
        message.data = f'Message #{self.counter}'
        self.publisher.publish(message)
        self.counter += 1
        self.get_logger().info(f'Published: {message.data}')

def main():
    rclpy.init()
    node = PublisherNode()
    rclpy.spin(node)  # Keep running

if __name__ == '__main__':
    main()
```

**How to run**:
```bash
python3 publisher.py
```

### Testing Your Publisher

In another terminal, check if messages are being sent:
```bash
ros2 topic echo /greeting
```

You should see messages appearing every second.

### Common Configuration

**Important parameters**:
- `queue_size`: How many messages to queue (10 is typical)
- `topic_name`: Must match subscriber's topic exactly
- `message_type`: Must be same on both sides

[Structured steps, code with comments, testing section, parameters highlighted]
```

**Improvements:**
- Clear step-by-step progression
- Code broken into small chunks with explanation
- Each step explained before code
- Complete working example separate from step-by-step
- Testing instructions included
- Key parameters highlighted
- No overwhelming prose blocks
- Academic rigor maintained, but accessible
```

## Tools & Resources

### Readability Analysis Tools
- **Flesch-Kincaid Grade Level** — Calculate grade level
- **Hemingway Editor** — Highlight complex sentences
- **Grammarly** — Grammar and clarity suggestions
- **WebFX Readability Tools** — Multiple metrics
- **Readability Checker** — Online grade calculation

### Visualization & Diagramming
- **Excalidraw** — Quick diagrams and sketches
- **Lucidchart** — Professional diagrams
- **Miro** — Collaborative whiteboarding
- **Draw.io** — Simple diagrams
- **Figma** — Design and prototyping

### Content Organization
- **Outline View** (in most editors) — See page structure
- **Table of Contents Generator** — Auto-generate from headers
- **Mind Map Tools** — Organize concepts hierarchically
- **Obsidian/Roam Research** — Concept mapping

### Accessibility Checking
- **WAVE** — Web accessibility checker
- **Axe DevTools** — Accessibility audit
- **Color Contrast Checker** — WCAG compliance

## Acceptance Criteria

- [ ] Readability metrics meet targets (Grade 12–14, Reading Ease 50–60)
- [ ] All paragraphs have clear topic sentences
- [ ] Transitions between sentences are smooth
- [ ] Transitions between sections are explicit
- [ ] Sentences vary in length (8–25 words, avg 15–20)
- [ ] No paragraph exceeds 8 sentences
- [ ] Concepts introduced sequentially (one at a time)
- [ ] New concepts clearly marked (bold, italics, subheading)
- [ ] Content has regular visual breaks (image, code, diagram, callout every 300–400 words)
- [ ] Text/visual/code ratio appropriate (50–60% text, 20–30% visual, 15–25% code)
- [ ] Code examples include comments explaining key lines
- [ ] No more than 50 lines of code in single block
- [ ] Cross-references included to related content
- [ ] Page is scannable (headings, lists, emphasis visible at a glance)
- [ ] No content removed without documented justification

## Quality Checklist

**Flow & Transitions:**
- [ ] Topic sentences clear and specific
- [ ] Logical progression through content
- [ ] Transitions smooth between ideas
- [ ] Section transitions explicit
- [ ] Reader guided through narrative

**Cognitive Load:**
- [ ] One major concept per paragraph
- [ ] Concepts introduced sequentially
- [ ] Technical terms defined before use
- [ ] Examples provided after explanation
- [ ] Mental resting points frequent (visuals, breaks)

**Readability:**
- [ ] Sentence variety (length and structure)
- [ ] Active voice predominates
- [ ] Jargon minimized or explained
- [ ] No unfamiliar abbreviations without definition
- [ ] Metrics within target ranges

**Visual Balance:**
- [ ] Visuals strategically placed (not random)
- [ ] Code separate from explanation (not mixed)
- [ ] Appropriate amount of whitespace
- [ ] Lists used for parallel items
- [ ] Callouts highlight key points

**Content Preservation:**
- [ ] All essential content retained
- [ ] Rigor maintained
- [ ] Academic tone preserved
- [ ] Accuracy uncompromised
- [ ] Only presentation changed (not substance)

---

Save it as `.claude/skills/page-flow/skill.md`
