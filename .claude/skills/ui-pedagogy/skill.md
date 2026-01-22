# UI Pedagogy Skill

**name:** ui-pedagogy
**description:** Aligns UI components with learning psychology by strategically placing callouts, warnings, tips, and layout elements to improve student focus, reduce cognitive distraction, and maintain WCAG accessibility standards.

---

## Skill Overview

The UI Pedagogy skill bridges learning psychology and interface design. It determines optimal placement and styling of UI elements (callouts, tips, warnings, notes, examples, summaries) based on cognitive load theory, visual hierarchy, and pedagogical principles. The skill ensures that layout decisions support learning objectives, guide student attention to critical concepts, reduce extraneous distraction, and maintain accessibility (WCAG 2.1 AA compliance) throughout. Well-designed pedagogical UI makes content more engaging, memorable, and effective.

**Primary Use:** While designing layouts or before UI finalization.

---

## When to Use This Skill

- **While designing layouts** for lesson pages, modules, or chapters
- **Before UI finalization** to ensure pedagogical effectiveness
- **When creating new component types** (callouts, admonitions, sidebars)
- **When refactoring** existing layouts for improved learning
- **When structuring** complex or dense content
- **For multi-level content** (concepts, examples, advanced topics)
- **When optimizing** mobile/tablet/desktop responsiveness with learning in mind
- **For accessibility review** to ensure pedagogical elements don't create barriers

**Do NOT use this skill for:**
- Pure aesthetic design choices (color trends, fashionable styling unrelated to learning)
- Branding guidelines (use brand standards, not pedagogy, as primary driver)
- Navigation structure (use information architecture principles)
- Code implementation details (use stylish-ui or ui-animations skills)

---

## Core Learning Psychology Principles

### 1. Cognitive Load Theory (CLT)

**Concept:** Learner working memory is limited (~7 items simultaneously). UI design should manage three types of cognitive load:

- **Intrinsic Load:** Inherent difficulty of the concept (can't reduce, but can structure)
- **Extraneous Load:** Wasted effort from poor design (should minimize)
- **Germane Load:** Productive effort toward learning (should maximize)

**UI Implications:**
- Reduce extraneous load by eliminating visual clutter
- Chunking: Group related information
- Segmenting: Break complex content into smaller, digestible pieces
- Modality: Use visuals + text (not text alone) for complex concepts
- Redundancy: Remove duplicate information

### 2. Visual Hierarchy & Attention

**Concept:** Learners' eyes and attention follow visual weight, color, size, and spatial position.

**UI Implications:**
- **Primary information:** Largest, darkest, centered, first in reading order
- **Secondary information:** Medium size/weight, supporting role
- **Tertiary information:** Small, de-emphasized, accessible if needed (expandable sections, footnotes)
- **Color:** Use sparingly for emphasis; avoid competing colors
- **Whitespace:** Use to separate concepts and rest eyes

### 3. Dual Coding Theory

**Concept:** Information presented in both visual and verbal form is better remembered than either alone.

**UI Implications:**
- Pair diagrams with text explanations
- Use icons alongside labels
- Combine code examples with narration
- Associate images with conceptual descriptions

### 4. Spacing Effect & Interleaving

**Concept:** Information is better retained when:
- Concepts are spaced in time (repeated, varied exposure)
- Different topics are interleaved (not blocked)

**UI Implications:**
- Callouts/tips spaced throughout (not concentrated)
- Examples interleaved with explanation (not all together)
- Review/summary sections strategically placed
- Varied content types (text, code, diagram, exercise) prevent monotony

### 5. Segmentation & Chunking

**Concept:** Breaking content into meaningful, digestible segments improves comprehension.

**UI Implications:**
- Use heading hierarchy (H1 → H6) to signal structure
- Paragraph breaks: ~3–4 sentences before break
- Callouts break visual monotony and signal importance
- Section summaries help consolidate understanding

---

## Workflow: UI Pedagogy in 5 Phases

### Phase 1: Content & Learning Objectives Analysis

**Objective:** Understand what students should learn and identify content structure.

**Steps:**

1. **Clarify learning objectives:**
   - What should students know/do after reading this section?
   - Bloom's level: Remember, Understand, Apply, Analyze, Evaluate, Create?
   - Is content foundational, integrative, or advanced?

2. **Map content structure:**
   - Main concept → supporting details → examples → applications
   - Identify prerequisite knowledge needed
   - Flag complex topics requiring breakdown

3. **Identify pedagogical needs:**
   - What might confuse students? (Mark for callouts/tips)
   - What are common misconceptions? (Flag for warnings)
   - What requires hands-on practice? (Earmark for examples/exercises)
   - What's critical for success? (Mark for emphasis)
   - What's optional/advanced? (Mark for expandable or separate section)

4. **Assess cognitive load:**
   - Intrinsic load: Is the concept inherently complex? (Requires breaking into pieces)
   - Current extraneous load: What extra visual/cognitive burden exists? (Reduce)
   - How to maximize germane load: What UI helps productive thinking?

5. **Document findings:**
   - List: [Section Title] → [Learning Objective] → [Key Concept] → [Pedagogical Need]
   - Example: "[ROS 2 Publishers] → [Understand pub/sub pattern] → [Asynchronous communication] → [Needs diagram + tip on callback timing]"

**Acceptance Check:**
- ✅ Learning objectives clearly defined
- ✅ Content structure mapped
- ✅ Pedagogical needs identified
- ✅ Cognitive load assessed
- ✅ Markup plan created

---

### Phase 2: UI Component Selection & Placement Strategy

**Objective:** Decide which UI elements (callouts, tips, warnings, notes, examples) to use and where.

**Steps:**

1. **Choose appropriate component types:**

   | Component | When to Use | Example | CLT Strategy |
   |-----------|------------|---------|--------------|
   | **Callout (Info)** | Additional context, enrichment | "ROS 2 evolved from ROS 1 to improve real-time performance" | Supports understanding without overloading |
   | **Tip** | Practical advice, best practices | "Always validate sensor data before using in control loops" | Germane load (practical skill) |
   | **Warning** | Common mistakes, safety concerns | "⚠️ Incorrect transform can cause unstable control" | Prevents extraneous load from errors |
   | **Important/Critical** | Non-negotiable concepts | "The Kalman filter must be initialized before first update" | Intrinsic load (essential concept) |
   | **Note** | Clarification, edge case | "This assumes the robot is in free space; add collision avoidance for real use" | Manages misconceptions |
   | **Example (Code/Diagram)** | Concrete illustration | Code snippet showing publisher-subscriber | Dual coding (visual + textual) |
   | **Summary/Key Takeaway** | Consolidate learning | "Key points: [Bullet list of 3–4 essential ideas]" | Spacing effect (reinforcement) |
   | **Advanced/Expandable** | Optional deeper dive | "For details on Extended Kalman Filters, see Chapter 7" | Respects varying student backgrounds |
   | **Exercise/Interactive** | Active learning | "Modify the PID gains and observe behavior" | Germane load (productive practice) |

2. **Apply CLT principles to placement:**
   - **Just-in-time information:** Place tip/callout immediately after introducing the concept (not chapters later)
   - **Cumulative emphasis:** For critical concepts, use multiple reinforcements (explanation + example + summary)
   - **Spacing:** Don't cluster all callouts; distribute throughout section
   - **Contrast:** Don't overuse components; too many callouts create visual fatigue and dilute emphasis

3. **Map component placement to content:**
   - For each paragraph/section, ask: Does this benefit from a callout/tip/warning?
   - Create a sketch: [Text block] → [Callout/Tip location] → [Example location]
   - Ensure visual balance (not all callouts on left, not too dense)

4. **Prioritize components:**
   - **Critical (must include):** Safety, misconceptions, essential concepts
   - **High value (should include):** Practical tips, examples that illuminate concepts
   - **Nice-to-have:** Enrichment, advanced topics

5. **Consider interaction patterns:**
   - Should some content be expandable/collapsible? (Manages cognitive load)
   - Should exercises be inline or separate? (Inline for immediate practice, separate for chunking)
   - Progressive disclosure: Hide advanced content until requested

**Acceptance Check:**
- ✅ Component types chosen match learning objectives
- ✅ Placement aligns with cognitive load theory
- ✅ Critical concepts receive appropriate emphasis
- ✅ Distribution is balanced (not clustered, not sparse)
- ✅ Interaction patterns support learning flow

---

### Phase 3: Visual Hierarchy & Focus Management

**Objective:** Design visual layout to guide attention, reduce distraction, and establish clear information priority.

**Steps:**

1. **Establish visual hierarchy:**
   - **Primary (Main Content):** Large, clear, centered in reading flow
   - **Secondary (Supporting):** Medium emphasis, adjacent to primary
   - **Tertiary (Optional/Advanced):** De-emphasized, expandable, clearly optional
   - **Distraction (Minimize):** Ads, social media, unrelated navigation

2. **Apply visual weight strategically:**
   - **Size:** Primary content is larger; scale down for secondary
   - **Color:** Use neutral (black/gray) for main text; accent colors (1–2 max) for emphasis
   - **Font weight:** Regular for body; bold for key terms and headings
   - **Spacing:** More whitespace around important elements; tight spacing for grouped details

3. **Implement focus zones:**
   - **Content zone:** Central, generous whitespace, primary reading focus
   - **Sidebar (if any):** Secondary information, callouts, related links (not competing with content)
   - **Distraction-free mode:** Option to hide sidebar, navigation for reading focus
   - **Mobile:** Sidebar → stacked below (or toggle) to preserve focus

4. **Color strategy for pedagogy:**
   - **Body text:** Dark gray on light background (high contrast, readability)
   - **Links:** Consistent, clearly distinguishable (not just color; use underline or icon)
   - **Accent colors:** Reserve for callouts, tips, warnings (use consistent color for each type)
     - Callout (Info): Blue
     - Tip: Green
     - Warning: Orange/Yellow
     - Critical/Important: Red
     - Note: Gray
   - Avoid: Red + green combinations (colorblind accessibility), color alone for meaning

5. **Typography for focus:**
   - **Line length:** 45–75 characters (optimal reading width); too long causes eye strain
   - **Line spacing:** 1.5–1.8x for body text (not single-spaced; improves readability)
   - **Font size:** 16px+ for body text (accessible for all users)
   - **Font family:** Sans-serif for screen (easier to read); high contrast letters

6. **Whitespace as pedagogy:**
   - Use whitespace to "breathe" content and rest eyes
   - Separate concepts with whitespace (signals boundaries)
   - Avoid walls of text (break into paragraphs, use lists)
   - Callouts/sidebars need breathing room (whitespace around them)

**Acceptance Check:**
- ✅ Visual hierarchy clearly guides attention
- ✅ Color used strategically (not overwhelming)
- ✅ Line length optimal for reading (45–75 characters)
- ✅ Font size accessible (16px+ body text)
- ✅ Whitespace reduces cognitive load
- ✅ Content zone is distinct from distractions

---

### Phase 4: WCAG Accessibility & Inclusive Design

**Objective:** Ensure all UI components meet WCAG 2.1 AA standards and serve all learners.

**Steps:**

1. **Color contrast requirements (WCAG AA minimum):**
   - Normal text: 4.5:1 contrast ratio
   - Large text (18px+): 3:1 contrast ratio
   - Graphical elements: 3:1 contrast ratio
   - **Tool:** Use WebAIM Contrast Checker; aim for AAA (7:1) when possible

2. **Avoid color alone for meaning:**
   - Don't rely on color to distinguish callout types (add icons, text labels)
   - Example: ✅ Tip (green) with "💡 Tip:" label (not just green background)

3. **Text alternatives for visual elements:**
   - Callout icons: Semantic HTML (`<aside>`, `<figure>`) and ARIA labels
   - Diagrams in callouts: Alt text or description
   - Color-coded elements: Include text/symbol alternative

4. **Focus management:**
   - Interactive elements (expandable sections, exercises) are keyboard accessible
   - Focus indicator is visible (not hidden by styling)
   - Tab order is logical

5. **Responsive design principles:**
   - Callouts stack on mobile (not side-by-side)
   - Touch targets ≥ 44×44 pixels (for interactive callouts)
   - Font size remains readable on mobile
   - Sidebar/sidebar content is accessible via toggle on mobile

6. **Motion & animation:**
   - Respect `prefers-reduced-motion` CSS media query
   - No auto-playing videos or animations in callouts
   - Ensure callouts are readable without animation

7. **Screen reader compatibility:**
   - Use semantic HTML: `<aside>`, `<section>`, `<figure>`, `<article>`
   - Callout type announced: "Callout: Tip—..." (use `<h3>` or ARIA)
   - Ensure reading order is logical in source code

**Acceptance Check:**
- ✅ All text meets 4.5:1 contrast (AA minimum)
- ✅ Color not used as sole method of conveying information
- ✅ Interactive elements are keyboard accessible
- ✅ Touch targets ≥ 44×44 pixels
- ✅ Responsive design tested on mobile
- ✅ `prefers-reduced-motion` respected
- ✅ Semantic HTML used for screen readers
- ✅ No auto-playing content in callouts

---

### Phase 5: Testing & Iteration

**Objective:** Validate that UI design achieves pedagogical goals and doesn't introduce barriers.

**Steps:**

1. **Cognitive load validation:**
   - Ask: Does a learner feel overwhelmed by visual clutter?
   - Check: Is content chunked appropriately?
   - Verify: Are callouts/tips helpful (not distracting)?
   - Test: Can students identify primary content at a glance?

2. **Focus & attention testing:**
   - Eye tracking (if available): Where do eyes go first? Does this align with learning goals?
   - Manual inspection: Is there visual balance? Are callouts too prominent or too subtle?
   - Check: Are warnings/critical info highly visible?

3. **Accessibility testing:**
   - Use automated tools: WAVE, Axe DevTools, Lighthouse
   - Manual keyboard navigation: Tab through page; is focus clear?
   - Screen reader testing: Callout types are announced; reading order is logical
   - Color contrast: Verify with WebAIM or Chrome DevTools
   - Responsive: Test on phone, tablet, desktop

4. **Usability testing with students:**
   - Ask 3–5 students to read a page with new layout
   - Observe: Do they notice critical callouts? Are they distracted?
   - Question: What is the main idea? (Should map to learning objective)
   - Feedback: Did the layout help understanding?

5. **Iteration:**
   - Too many callouts? Consolidate or move to sidebar
   - Callouts not noticed? Increase visual weight (larger, color, icon)
   - Too much whitespace? Tighten; add more content (or intentional breathing room)
   - Accessibility failures? Fix per WCAG guidance

**Acceptance Check:**
- ✅ Cognitive load assessment passed
- ✅ Focus is guided to primary learning content
- ✅ WCAG AA compliance verified (automated + manual)
- ✅ Keyboard navigation works smoothly
- ✅ Screen reader announces content correctly
- ✅ Mobile/tablet/desktop responsive
- ✅ Usability feedback positive (from student testing if possible)

---

## Pedagogical UI Components: Real Examples

### Example 1: ROS 2 Publisher-Subscriber Pattern Lesson

**Learning Objective:** Understand the publish-subscribe pattern and why ROS 2 uses it.

**Cognitive Load Analysis:**
- Intrinsic load: Moderate (asynchronous communication is new concept for many)
- Extraneous load currently: Could be high if we explain all ROS 2 features at once
- Germane load target: Help students understand decoupling benefit

**Content Structure + UI Plan:**

```
[Heading] ROS 2 Publish-Subscribe Pattern

[Body: Introduction paragraph explaining what pub/sub is]

[Callout/Info: Background on why decoupling matters in distributed systems]
  └─ "📚 Background: Decoupling is a key principle in distributed systems..."
  └─ Color: Blue (informational)
  └─ Placement: Right after introducing concept
  └─ Rationale: Enrichment; helps advanced students connect to larger context

[Body: How ROS 2 implements pub/sub]

[Code Example (inline): Simple publisher code]

[Tip: Best practice for publisher]
  └─ "💡 Tip: Always define QoS profiles explicitly to match your use case"
  └─ Color: Green (practical advice)
  └─ Placement: Immediately after code example
  └─ Rationale: Prevents common mistake

[Body: Explanation of subscriber side]

[Diagram: Publisher → Topic → Subscriber flow]

[Note: Important clarification about timing]
  └─ "📝 Note: Subscribers don't receive messages older than their QoS history depth"
  └─ Color: Gray (clarification)
  └─ Placement: After diagram, prevents misconception
  └─ Rationale: Common confusion point

[Exercise (Expandable): Modify the code]
  └─ "✏️ Try it: Change the topic name. What happens?"
  └─ Placement: At section end, consolidates learning
  └─ Rationale: Active engagement

[Summary Box: Key takeaways]
  └─ "🔑 Key Points:
     • Pub/sub decouples publishers and subscribers
     • Publishers send to topics; subscribers listen
     • QoS profiles control message history"
  └─ Placement: End of section
  └─ Rationale: Spacing effect; reinforces learning

[Advanced/Expandable: Detailed QoS profiles]
  └─ "➕ Advanced: Learn more about ROS 2 Quality of Service profiles"
  └─ Placement: Below main section, optional
  └─ Rationale: Respects varying student background; doesn't overwhelm beginners
```

**Visual Hierarchy Layout:**

```
┌─────────────────────────────────────────┐
│         ROS 2 Pub/Sub Pattern           │ ← H1 (Large, bold)
├─────────────────────────────────────────┤
│ Introduction paragraph (body text)      │ ← Primary content
│                                         │
│ ┌─ Blue Callout ─────────────────────┐ │ ← Secondary (slightly indented)
│ │ 📚 Background: Decoupling...        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ How ROS 2 implements pub/sub (paragraph)│
│                                         │
│ Code example (light background)         │ ← Visual/textual (dual coding)
│ ┌─ Green Tip ───────────────────────┐  │ ← Callout (emphasis)
│ │ 💡 Tip: Define QoS profiles...    │  │
│ └───────────────────────────────────┘  │
│                                         │
│ Explanation paragraph                  │
│                                         │
│ [Diagram: Pub → Topic → Sub]            │ ← Visual hierarchy
│                                         │
│ ┌─ Gray Note ───────────────────────┐  │ ← Clarification
│ │ 📝 Note: Subscribers don't...     │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ┌─ Exercise (Expandable) ────────────┐ │ ← Interactive
│ │ ✏️ Try it: Modify the code...      │ │
│ └────────────────────────────────────┘ │
│                                         │
│ ┌─ Key Points Box ──────────────────┐  │ ← Summary (consolidation)
│ │ 🔑 • Pub/sub decouples...         │  │
│ │    • Publishers send...            │  │
│ │    • QoS controls...               │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ➕ Advanced (collapsed) [Expand]        │ ← Optional depth
└─────────────────────────────────────────┘
```

**Accessibility Checks:**
- ✅ Main content text: 18px, dark gray on white (7:1 contrast—exceeds AA)
- ✅ Callout icons: Semantic `<aside>` with ARIA role
- ✅ Color + text: Each callout type has icon + label (not color alone)
- ✅ Code: Syntax highlighting high contrast; readable on mobile
- ✅ Responsive: Callouts stack on mobile; no horizontal scroll
- ✅ Keyboard: Exercise toggle is keyboard accessible (Enter/Space)
- ✅ Screen reader: Callout type announced ("Note: Important clarification...")

---

### Example 2: Kalman Filter Lesson (Complex Topic)

**Learning Objective:** Understand how Kalman filter fuses sensor data.

**Cognitive Load Analysis:**
- Intrinsic load: High (probabilistic algorithm, matrix algebra)
- Extraneous load risk: Very high if we show equations + code + theory simultaneously
- Strategy: Break into modules; use progressive disclosure

**Content Structure + UI Plan:**

```
[Heading] Sensor Fusion with Kalman Filters

[Callout/Critical: Why this matters]
  └─ "⚠️ Critical: Understanding sensor fusion is essential for robust robot control"
  └─ Color: Red (importance)
  └─ Rationale: Motivates learning; flags as high-priority

[Body: Conceptual introduction (no equations yet)]

[Diagram 1: Simple example (temperature sensor + thermometer fusion)]
  └─ Visual → avoids equation overload
  └─ Rationale: Dual coding; concrete example before abstraction

[Section: The Problem (subsection heading)]
  └─ Explain sensor noise, drift in simple terms
  └─ Avoid equations here

[Callout/Tip: Practical example]
  └─ "💡 Tip: Gyroscopes drift over time; accelerometers are noisy. The Kalman filter combines both."
  └─ Rationale: Real-world motivation

[Section: The Kalman Filter Solution (subsection)]
  └─ Introduce core idea (prediction + update) before math

[Diagram 2: Prediction-Update cycle]
  └─ High-level flowchart (no equations)
  └─ Rationale: Chunking; separate concept from math

[Section: Mathematics (collapsible/expandable)]
  └─ ➕ Advanced: For those interested in the derivation...
  └─ Show equations, covariance matrices
  └─ Rationale: Respects different backgrounds; doesn't overwhelm beginners

[Code Example: Simple 1D Kalman filter]
  └─ Clear implementation (not pseudocode)
  └─ Rationale: Dual coding; executable

[Tip: Parameter tuning]
  └─ "💡 Tip: Q and R govern how much to trust prediction vs. measurement. Tune empirically."
  └─ Rationale: Practical skill for robotics

[Exercise (Interactive): Adjust Q, R; observe filter behavior]
  └─ Requires simulation or interactive component
  └─ Rationale: Active learning; germane load

[Summary: Key concepts]
  └─ "🔑 Key Points:
     • Sensor fusion combines multiple noisy sensors
     • Kalman filter is optimal for linear, Gaussian systems
     • Q and R control the filter's trust in prediction vs. measurement"
  └─ Rationale: Consolidates learning

[Note: Limitations]
  └─ "📝 Note: This assumes linear dynamics. For nonlinear (e.g., rotations), use Extended or Unscented Kalman Filter (see Chapter 8)."
  └─ Rationale: Prevents overgeneralization
```

**Cognitive Load Management:**
- **Chunking:** Concept → Diagram → Code → Math (advanced)
- **Segmentation:** Separate subsections; whitespace between
- **Progressive disclosure:** Math hidden in expandable section
- **Multiple modalities:** Concept + Diagram + Code + Intuition (not equations alone)

**Accessibility + Responsiveness:**
- ✅ All diagrams have text descriptions (SVG alt text or adjacent paragraph)
- ✅ Code is copy-paste-able; syntax highlighting high contrast
- ✅ Expandable section is keyboard accessible
- ✅ Font size: Body 18px; headings proportionally larger
- ✅ Mobile: Stack vertically; diagrams responsive (scale down, not crop)

---

### Example 3: Safety-Critical Topic (Warnings & Critical Info)

**Topic:** Collision Avoidance in Real Robots

**Learning Objective:** Understand why collision detection is critical and implement safely.

**UI Strategy:**

```
[Heading] Collision Avoidance in Real Robots

[Critical/Warning: Safety notice]
  └─ "⚠️ CRITICAL: Always test collision avoidance in simulation first!"
  └─ Color: Red background, white text (high visibility)
  └─ Placement: Very top of section (before any content)
  └─ Size: Larger font for visibility
  └─ Rationale: Safety-critical; must be noticed

[Body: Why collision detection matters]

[Callout/Important: Real-world consequence]
  └─ "🚨 Important: Undetected collisions can damage hardware or injure people"
  └─ Rationale: Motivates careful implementation

[Section: Safe Simulation Environment]
  └─ Guidelines for testing in Gazebo/Isaac Sim

[Code Example: Gazebo with collision detection enabled]

[Warning: Common pitfall]
  └─ "⚠️ Warning: If collision geometry is incorrect, detection will fail silently"
  └─ Color: Orange (warning)
  └─ Rationale: Prevents common implementation error

[Section: Deploying on Real Robot]

[Critical Note: Hardware verification]
  └─ "🔴 Before real deployment:
     1. Verify sensor range is sufficient
     2. Test E-stop functionality
     3. Run simulation validation
     4. Test with slow speed first"
  └─ Rationale: Checklist prevents mistakes

[Exercise: Simulation-based testing]
  └─ "✏️ Task: Implement collision detection. Verify it stops the robot before contact."

[Summary: Safety checklist]
  └─ "✓ Safety Checklist:
     ☐ Collision geometry validated in simulation
     ☐ Detection algorithm tested with various speeds
     ☐ E-stop functional
     ☐ Real robot tested at slow speed first
     ☐ All team members trained"
```

**Color & Visual Priority:**
- Red box (warning) dominates page (highest visual weight)
- Orange boxes (secondary warnings) are still prominent
- Green tips are lower visual weight (less critical than safety)

**Accessibility:**
- ✅ Red/orange warning colors have icons (🚨, ⚠️) for colorblind users
- ✅ All warnings use text labels, not color alone
- ✅ Critical checklist is readable on all screen sizes (no tiny text)
- ✅ High contrast: White text on colored background (>7:1 ratio)

---

## Tools & Resources

### UI Design & Accessibility Tools

1. **WebAIM Contrast Checker** (https://webaim.org/resources/contrastchecker/)
   - Verify color contrast meets WCAG standards
   - Test color blindness mode

2. **WAVE Browser Extension** (https://wave.webaim.org/)
   - Automated accessibility scanning
   - Identifies color contrast, missing alt text, keyboard issues

3. **Axe DevTools** (https://www.deque.com/axe/devtools/)
   - Comprehensive accessibility audit
   - Identifies WCAG violations with explanations

4. **Lighthouse (Chrome DevTools)** (https://developers.google.com/web/tools/lighthouse)
   - Built-in accessibility, performance, and SEO audit
   - Provides specific fixes

5. **Excalidraw / Draw.io** (https://excalidraw.com/, https://draw.io/)
   - Create pedagogical diagrams and flowcharts
   - Whiteboard-style for rough sketches

### Learning Psychology Resources

1. **"Sweller, J. et al. (2011). Cognitive Load Theory"**
   - Foundational work on managing intrinsic, extraneous, germane load

2. **"Mayer, R. (2014). The Cambridge Handbook of Multimedia Learning"**
   - Research on dual coding, modality effects, segmentation

3. **"Clark, R. C., & Mayer, R. E. (2016). E-Learning and the Science of Instruction"**
   - Practical application of cognitive load theory to instructional design

4. **Nielsen Norman Group Articles:**
   - "Cognitive Load: The Case for Simplicity" (Nielsen)
   - "Visual Hierarchy" (Norman)

### Typography & Readability

1. **Readable.com Typography Guide:**
   - Font size, line spacing, line length recommendations
   - Optimal: 16px font, 1.5–1.8x line spacing, 45–75 character line length

2. **Font Pairing Resources:**
   - Google Fonts (https://fonts.google.com/)
   - Pairing suggestions for body + heading fonts

### Academic UI Examples

1. **MIT OpenCourseWare:** Clean, focused layouts
2. **Khan Academy:** Effective use of callouts, progress tracking
3. **Coursera:** Clear visual hierarchy, spaced content
4. **Textbooks:** Design patterns in well-designed academic textbooks

---

## Pedagogical UI Components Library

### Callout Types & When to Use

**1. Info/Background Callout (Blue)**
```
📚 Background:
Historical context, enrichment, "nice to know" information
Usage: Not essential but helpful for curious learners
Placement: After introducing main concept
Color: Blue (informational)
Icon: 📚 or ℹ️
```

**2. Tip (Green)**
```
💡 Tip:
Practical advice, best practice, efficiency
Usage: Helps students succeed in implementation
Placement: Immediately after code example or instruction
Color: Green (positive)
Icon: 💡
```

**3. Warning (Orange)**
```
⚠️ Warning:
Common pitfall, frequent mistake, subtle issue
Usage: Prevents common errors
Placement: Before students might make mistake
Color: Orange (caution)
Icon: ⚠️
```

**4. Important/Critical (Red)**
```
🔴 Important / Critical:
Non-negotiable concept, safety concern, prerequisite
Usage: Flags essential knowledge
Placement: Very prominent, top of section if critical
Color: Red (critical)
Icon: 🔴 or ⚠️
```

**5. Note/Clarification (Gray)**
```
📝 Note:
Edge case, clarification, assumption statement
Usage: Prevents misconceptions
Placement: Immediately after statement that needs clarification
Color: Gray (neutral)
Icon: 📝
```

**6. Example (Purple/Indigo)**
```
📖 Example:
Concrete illustration, real-world scenario
Usage: Dual coding; visual + textual learning
Placement: After concept explanation, before exercises
Color: Purple/Indigo (separate visual category)
Icon: 📖 or 🎯
```

**7. Exercise/Try It (Purple)**
```
✏️ Exercise / Try It:
Active learning, hands-on practice
Usage: Consolidates understanding
Placement: Section end or after concept
Color: Purple
Icon: ✏️ or 🎮
```

**8. Key Takeaway/Summary (Gold/Yellow)**
```
🔑 Key Takeaways:
Essential points, recap, memory aids
Usage: Spacing effect; reinforces learning
Placement: Section end
Color: Gold/Yellow
Icon: 🔑
```

**9. Advanced/Optional (Gray with border)**
```
➕ Advanced:
Deeper dive, optional, requires prerequisite knowledge
Usage: Respects varying backgrounds
Placement: Below main section, collapsible
Color: Gray or muted
Icon: ➕
```

---

## Quality Checklist: Pedagogical UI

Before finalizing layout, verify:

- [ ] **Learning objective clarity:** UI design supports stated learning objectives
- [ ] **Cognitive load:** Extraneous load is minimized; intrinsic/germane load is managed
- [ ] **Visual hierarchy:** Primary content is most prominent; focus is guided correctly
- [ ] **Component selection:** Callouts/tips/warnings are chosen for pedagogical value (not overused)
- [ ] **Spacing:** Components are spaced to prevent clustering; whitespace aids comprehension
- [ ] **Color strategy:** Accent colors are limited (2–3 max); each callout type has consistent color + icon
- [ ] **Accessibility:** WCAG AA compliance verified (contrast, keyboard, screen reader, responsive)
- [ ] **Typography:** Font size 16px+, line spacing 1.5–1.8x, line length 45–75 characters
- [ ] **Diagram integration:** Visuals paired with text explanations (dual coding)
- [ ] **Mobile responsiveness:** Tested on phone, tablet, desktop; callouts stack appropriately
- [ ] **No distractions:** Sidebar/navigation doesn't compete with content
- [ ] **Interactive elements:** Keyboard accessible; focus indicator visible
- [ ] **Color blindness:** Color not sole method of conveying information
- [ ] **Readability:** Font size, weight, and color provide high contrast
- [ ] **Logical flow:** Content order follows learning progression
- [ ] **Redundancy:** No repeated callouts on same concept (consolidate if needed)
- [ ] **Academic tone:** Component language is formal, not casual (use academic-tone skill)

---

## Acceptance Criteria

✅ **UI components strategically placed** based on cognitive load theory and learning psychology
✅ **Callout/tip/warning types chosen** for pedagogical value (not overused)
✅ **Visual hierarchy clearly guides** student attention to primary content
✅ **WCAG 2.1 AA compliance** verified (contrast, keyboard, screen reader, responsive)
✅ **Color strategy consistent** (each component type has signature color + icon)
✅ **Typography accessible:** 16px+ font, 1.5–1.8x line spacing, 45–75 char line length
✅ **Whitespace reduces** cognitive load and aids focus
✅ **Mobile/responsive tested** across devices
✅ **Distracting elements minimized** (sidebar, navigation, ads)
✅ **Interactive elements keyboard accessible**
✅ **Dual coding implemented** (visuals paired with text)
✅ **Academic-friendly tone** maintained throughout

---

## Examples: Effective vs. Ineffective UI Pedagogy

### ❌ Ineffective (Poor UX & Pedagogy)

- Everything is bright colors (rainbow of callouts overwhelms)
- Text in callouts is same size as body (hard to scan hierarchy)
- Callouts clustered (cognitive overload)
- No whitespace (walls of text)
- No icons or visual markers (students miss warnings)
- Callouts placed far from relevant content (discontinuity)
- Mobile view: Callouts are cut off or tiny (inaccessible)
- No clear labeling (students unsure if callout is warning or tip)

### ✅ Effective (Good UX & Pedagogy)

- 2–3 accent colors (consistent with component types)
- Clear visual hierarchy (body text is largest; secondary is smaller)
- Spaced callouts (breathing room, not clustered)
- Whitespace used strategically (rest eyes, separate concepts)
- Icons + text labels (accessible to colorblind users; clear meaning)
- Callouts placed immediately after relevant content
- Mobile view: Responsive; readable on all sizes
- Clear headers: "💡 Tip:", "⚠️ Warning:", "🔑 Key Points:"

---

## Integration with Other Skills

**UI Pedagogy works with:**
- **Stylish-UI:** Provides visual design foundation; UI Pedagogy applies learning principles
- **UI-Animations:** Animations should support learning (not distract); respect `prefers-reduced-motion`
- **Content-Writer:** Content structure drives UI layout; UI supports content organization
- **Academic-Tone:** Callout language should match academic tone
- **Learning-Objective-Mapper:** UI components reinforce learning objectives
- **Page-Flow:** Readability and cognitive load work together
- **Accessibility-Reviewer:** Ensures WCAG compliance of pedagogical components
- **Code-Narrator:** Code examples in callouts should be readable, well-formatted

---

## When NOT to Use UI Pedagogy

- Don't overuse callouts; too many dilute effectiveness
- Don't make callouts visually compete with body text
- Don't rely on color alone for callout distinction
- Don't place callouts so far from relevant content that students miss connection
- Don't use warning style for non-critical information

---

## Common Pitfalls & Solutions

### Pitfall 1: Too Many Callouts
**Problem:** Every sentence has a callout or tip → visual fatigue, cognitive overload
**Solution:** Reserve callouts for high-value moments (common mistakes, non-obvious concepts, safety)
- Guideline: ~1 callout per 300 words of body text

### Pitfall 2: Callout Not Noticed
**Problem:** Important warning is in gray text; students miss it
**Solution:** Use appropriate color, icon, and size; ensure visibility matches importance
- Safety/critical: Red, large, top of section
- Tip/practical: Green, medium, inline
- Note/clarification: Gray, smaller, still visible

### Pitfall 3: Poor Mobile Rendering
**Problem:** Callout cuts off on phone; text wraps awkwardly
**Solution:** Test responsive design; ensure callouts stack and remain readable on mobile

### Pitfall 4: Accessibility Failure
**Problem:** Color contrast 3:1; fails WCAG AA (needs 4.5:1)
**Solution:** Use WebAIM Contrast Checker; test combinations before design approval

### Pitfall 5: Distracting from Main Content
**Problem:** Sidebar callouts are too bright, drawing eyes away from primary text
**Solution:** Use whitespace around callouts; keep body text high-contrast; de-emphasize sidebar visually

---

## Save Location

Save it as `.claude/skills/ui-pedagogy/skill.md`
