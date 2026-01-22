# Academic Tone Skill

**name:** academic-tone
**description:** Enforces academic and professional writing tone by detecting casual language, converting to textbook style, and ensuring consistent terminology while preserving clarity and engagement.

---

## Skill Overview

The Academic Tone skill transforms informal, blog-style, or conversational writing into rigorous academic and professional language appropriate for a university-level textbook. It detects linguistic markers of informality—contractions, colloquialisms, informal pronouns, filler words, and blog-style transitions—and systematically converts them to academic equivalents. The skill preserves meaning, clarity, and reader engagement by maintaining technical precision and logical flow while eliminating casual tone.

**Primary Use:** Before final review or when content sounds informal.

---

## When to Use This Skill

- **Before final review** of completed lessons, modules, or chapters
- **When content sounds informal** (detected by peer review or self-assessment)
- **When transitioning** from rough draft to polished textbook
- **For consistency** across multi-author contributions (standardizing tone across writers)
- **When converting** blog posts, lecture notes, or informal documentation into textbook format
- **Before publishing** to ensure professional standards

**Do NOT use this skill for:**
- Conversational elements intentionally included (e.g., student-facing discussion prompts, dialogue in case studies)
- Code examples or pseudocode (preserve as-is)
- Quotes or citations (preserve original language)
- Dialogue in narratives or scenarios (unless converting narrative itself)
- Abstract or conclusion with intentional accessibility tone (review context first)

---

## Workflow: Tone Correction in 5 Phases

### Phase 1: Tone Assessment & Language Pattern Detection

**Objective:** Identify all instances of casual, informal, or blog-style language.

**Steps:**

1. **Scan for linguistic markers of informality:**
   - **Contractions:** "don't," "it's," "we'll," "that's" → formal equivalents
   - **Casual pronouns:** "You," "we" (inclusive), "our," "I," "me" → passive or formal constructions
   - **Filler words:** "really," "very," "quite," "actually," "basically," "literally" → remove or replace with precise terms
   - **Colloquialisms:** "lots of," "kind of," "sort of," "cool," "awesome," "neat" → formal alternatives
   - **Informal transitions:** "so," "well," "anyway," "now let's," "by the way" → academic connectors
   - **Exclamation marks:** "This is exciting!" → measured emphasis or removal
   - **Question rhetorical style:** "Wondering how this works?" → declarative statements
   - **Hyperbole or exaggeration:** "literally impossible," "always fails" → qualified statements
   - **Informal imperatives:** "Check this out," "Let's dive in" → formal instructions
   - **Hedging qualifiers:** "kind of works," "pretty much solves" → precise language

2. **Map severity of informality:**
   - **Tier 1 (Minor):** Single contraction, occasional filler word
   - **Tier 2 (Moderate):** Multiple casual pronouns, colloquial phrasing, informal transitions
   - **Tier 3 (Major):** Pervasive blog-style tone, conversational narrative, casual framing

3. **Preserve intentional elements:**
   - Distinguish between casual language and intentional accessibility
   - Flag elements like definitions for non-specialists (legitimate, not "dumbed down")
   - Note if section has pedagogical reason for informality

4. **Document findings:**
   - Create a list: `[Line #] [Original] [Pattern Type] [Severity]`
   - Example: `[42] "So basically, ROS 2 works like..." [Transition + Filler] [Tier 2]`

**Acceptance Check:**
- ✅ All informal markers identified
- ✅ Severity levels assigned accurately
- ✅ Intentional vs. unintentional informality distinguished
- ✅ No false positives (e.g., formal "sort of" in philosophical context)

---

### Phase 2: Casual-to-Academic Conversion Mapping

**Objective:** Create precise conversion pairs before editing.

**Steps:**

1. **Build conversion table for flagged items:**

   | Informal | Academic | Context/Notes |
   |----------|----------|---------------|
   | "don't" | "do not" | Standard contraction conversion |
   | "You can think of it as..." | "One may conceptualize this as..." | Formal pronoun + precision |
   | "We apply the algorithm by..." | "The algorithm is applied via..." | Passive voice for objectivity |
   | "So what's happening here?" | "What occurs in this process?" | Rhetorical question → statement |
   | "basically works" | "functions" or "operates" | Remove filler, use precise verb |
   | "really important" | "critical" or "essential" | Quantify importance precisely |
   | "sort of like a filter" | "analogous to a filter" | Use formal simile/analogy |
   | "Anyway, let's move on" | "We now proceed to..." | Formal transition |
   | "This is awesome!" | "This approach offers significant advantages." | Remove exclamation, add substance |
   | "Lots of applications" | "Numerous applications" or "Many applications" | Formal quantifier |

2. **Apply domain-specific terminology:**
   - Ensure robotics terms are consistent throughout
   - Replace colloquial robot descriptions with technical terms
   - Example: "the robot moves its arm" → "the manipulator executes a trajectory"

3. **Rationalize academic choices:**
   - Why this conversion? (e.g., "one" is more formal than "you"; passive voice for processes vs. actors)
   - Note any tradeoffs (e.g., passive voice can reduce clarity; use sparingly)

4. **Flag non-obvious conversions for review:**
   - Conversions requiring rewording (not just substitution)
   - Cases where multiple academic alternatives exist (pick strongest)

**Acceptance Check:**
- ✅ All flagged items have conversion pairs
- ✅ Conversions maintain meaning precisely
- ✅ Terminology is consistent with textbook glossary
- ✅ Academic alternatives are justified
- ✅ Non-obvious cases are flagged for review

---

### Phase 3: Terminology Standardization & Consistency

**Objective:** Ensure consistent use of technical and academic terms throughout.

**Steps:**

1. **Cross-reference against project glossary:**
   - Verify all robotics/AI terms match `.specify/memory/glossary.md` or project standards
   - Ensure consistent hyphenation (e.g., "real-time" vs. "realtime")
   - Maintain capitalization conventions (e.g., "Kalman filter" vs. "kalman filter")

2. **Identify terminology inconsistencies:**
   - Same concept with multiple names (e.g., "torque command," "motor command," "actuation signal")
   - Informal synonyms (e.g., "the bot," "the arm," "the manipulator" → pick one per context)
   - Abbreviations (e.g., "ROS" vs. "Robot Operating System" → define first use, abbreviate thereafter)

3. **Standardize across sections:**
   - First mention: full term + definition or abbreviation introduction
   - Subsequent mentions: abbreviation or consistent short form
   - Cross-module consistency: same term used same way in all modules

4. **Create terminology map for this document:**
   - Preferred term | Variants to replace | Context
   - Example: "joint angle" | "joint position," "rotation," "pose" (use "pose" only for 6D; "joint angle" for 1D)

5. **Check for jargon consistency:**
   - Discipline-specific jargon (robotics, control theory, simulation) is consistent with field norms
   - Define jargon on first mention or link to glossary
   - Avoid mixing colloquial and technical terms for the same concept

**Acceptance Check:**
- ✅ All terms match project glossary
- ✅ No inconsistent terminology within document
- ✅ Abbreviations introduced formally (full term first)
- ✅ Cross-module consistency verified
- ✅ Jargon is defined or linked on first mention

---

### Phase 4: Academic Voice & Clarity Verification

**Objective:** Ensure converted text maintains academic tone while preserving clarity and engagement.

**Steps:**

1. **Verify passive vs. active voice balance:**
   - **Passive voice:** Appropriate for processes, established facts, objectivity (e.g., "The algorithm is initialized...")
   - **Active voice:** Preferred for actions, agents, clarity (e.g., "The controller adjusts...")
   - Guideline: Lean toward active (modern academic writing favors clarity), use passive strategically
   - Avoid: Unnecessary passive chains ("It was determined to be found that...")

2. **Check sentence structure:**
   - Average sentence length: 15–20 words (academic sweet spot)
   - Too short: Sounds choppy; combine related ideas
   - Too long: Becomes unwieldy; split into multiple sentences
   - Variety: Mix sentence lengths to maintain rhythm

3. **Evaluate word choice:**
   - Precision over formality: "analyze" is formal *and* precise; prefer over "investigate" if accurate
   - No vague adverbs: "significantly improves" requires quantification or evidence
   - Avoid redundancy: "future prospects ahead" → "future prospects"
   - Use Latin-derived terms appropriately (don't overdo for affectation)

4. **Verify logical flow:**
   - Transitions between sentences: Smooth with academic connectors ("Moreover," "However," "Subsequently")
   - Paragraph coherence: Topic sentence + supporting detail + connection to next
   - Argument structure: Claim → evidence → implication

5. **Assess engagement:**
   - Academic writing can be engaging through precision and intellectual rigor
   - "This result is significant because..." (engaging) vs. "This result is important." (bland)
   - Use conceptual bridges ("As discussed previously...") to maintain reader context

**Acceptance Check:**
- ✅ Passive/active voice balance is appropriate
- ✅ Sentence length varies (15–20 word average)
- ✅ Word choice is precise, not pretentious
- ✅ Logical flow is smooth with academic transitions
- ✅ Engagement comes from rigor, not informality

---

### Phase 5: Final Review & Academic Integrity Check

**Objective:** Ensure tone conversions are complete, consistent, and maintain academic standards.

**Steps:**

1. **Re-read full passage** after all edits:
   - Does it sound like university-level textbook material?
   - Is tone consistent throughout?
   - Any lingering informal language?

2. **Verify no meaning loss:**
   - Compare original and revised side-by-side
   - Did the conversion add/remove nuance?
   - Are technical implications preserved?

3. **Check for over-correction:**
   - Tone should be formal, not stuffy
   - Academic writing can be clear and direct
   - Avoid "fancy" language that obscures meaning

4. **Validate against textbook style guide:**
   - Review any project-specific tone guidelines (if available in constitution.md)
   - Ensure consistency with other chapters/modules

5. **Final scan for markers:**
   - Exclamation marks: Should be rare, reserved for emphasis
   - Rhetorical questions: All converted to statements?
   - Contractions: All expanded to formal?
   - Filler words: All removed or replaced?

6. **Academic integrity:**
   - No plagiarism introduced (all conversions are original rephrasing)
   - Citations and attributions remain accurate
   - No distortion of cited sources

**Acceptance Check:**
- ✅ Tone is consistent and appropriately academic
- ✅ No meaning loss in conversions
- ✅ Over-correction avoided (clarity maintained)
- ✅ Style guide compliance verified
- ✅ No plagiarism; citations accurate
- ✅ Final scan for informal markers complete

---

## Tone Correction: Real Examples

### Example 1: Casual Blog-Style Explanation → Academic Textbook

**Original (Casual/Blog-Style):**

"So here's the thing about ROS 2—it's basically a middleware that lets different robot programs talk to each other. You've probably heard about publish-subscribe messaging; well, ROS 2 takes that idea and runs with it! The publisher sends messages to a topic, and subscribers listen in. Pretty cool, right? What's really awesome is that the publisher doesn't have to know anything about the subscribers. They're totally decoupled, which means you can swap out parts of your robot system without breaking everything."

**Academic Issues Identified:**
- "So here's the thing" (informal opening)
- "basically" (filler word)
- "lets" (too casual)
- Rhetorical "You've probably heard" (informal pronoun + assumption)
- "well" (informal transition)
- "Pretty cool, right?" (colloquialism + rhetorical question)
- "really awesome" (informal evaluation)
- "totally decoupled" (intensifier "totally")

**Conversion Mapping:**
| Informal | Academic | Reason |
|----------|----------|--------|
| "So here's the thing" | "ROS 2 is..." | Direct, formal opening |
| "basically a middleware" | "a middleware framework" | Remove filler; add precision |
| "lets different robot programs talk" | "enables communication among distributed robot modules" | Formal phrasing + technical accuracy |
| "You've probably heard about" | "The publish-subscribe messaging pattern" | Remove informal pronoun; direct to concept |
| "well, ROS 2 takes that idea and runs with it" | "ROS 2 implements this pattern via" | Formal transition + precise verb |
| "Pretty cool, right?" | Remove or convert | Eliminate rhetorical question |
| "really awesome" | "significant advantage" or "important characteristic" | Replace intensifier + evaluation with substance |
| "totally decoupled" | "decoupled" | Remove intensifier; let precision stand alone |

**Revised (Academic):**

"ROS 2 is a middleware framework that enables communication among distributed robot modules through a publish-subscribe messaging pattern. In this architecture, a publisher sends messages to a named topic, while subscribers receive these messages. A key advantage of this design is that the publisher and subscriber are decoupled—the publisher requires no knowledge of subscriber existence, identity, or location. This decoupling enables modular system design, allowing components to be replaced or updated independently without affecting the entire system."

**Why This Works:**
- Removes all informal markers (contractions, filler, rhetorical tone)
- Maintains clarity (actually more precise)
- Elevates to academic level
- Preserves the core concept and engagement through intellectual rigor

---

### Example 2: Informal Narrative → Academic Exposition

**Original (Informal):**

"When you're building a humanoid robot, one of the trickiest things is figuring out where all the joints should go. Like, you've got a shoulder, an elbow, a wrist—and they all have to work together, you know? The Kalman filter helps out here by taking noisy sensor data and cleaning it up so the robot actually knows where its joints are. It's pretty magical when you think about it!"

**Academic Issues:**
- "When you're building" (informal pronoun "you")
- "one of the trickiest things" (colloquial + informal evaluation)
- "figuring out" (too casual)
- "Like" (filler)
- "you've got" (colloquial)
- "they all have to work together, you know?" (informal tone + rhetorical marker)
- "helps out" (too casual)
- "cleaning it up" (colloquial for processing)
- "pretty magical" (hyperbolic, informal)

**Conversion Mapping:**
| Informal | Academic | Reason |
|----------|----------|--------|
| "When you're building a humanoid robot" | "In humanoid robot design" | Formal nominalization |
| "one of the trickiest things" | "a significant challenge" | Replace colloquialism with precise term |
| "figuring out where" | "determining the spatial configuration of" | Formal verb + precision |
| "you've got" | "comprises" or "includes" | Formal equivalent |
| "they all have to work together" | "joint movements must be coordinated" | Active, precise phrasing |
| "you know?" | Remove | Eliminate rhetorical marker |
| "helps out" | "assists" or "enables" | Formal verb |
| "cleaning it up" | "filtering" or "noise reduction" | Technical terminology |
| "pretty magical" | "provides substantial improvement" or "enables robust estimation" | Replace hyperbole with substance |

**Revised (Academic):**

"In humanoid robot design, determining the spatial configuration and kinematics of articulated joints presents significant challenges. A humanoid arm comprises multiple joints (shoulder, elbow, wrist) whose movements must be coordinated to achieve desired end-effector trajectories. Sensor noise—from accelerometers, gyroscopes, and joint encoders—introduces uncertainty in joint state estimation. The Kalman filter addresses this challenge by fusing noisy measurements into an optimal estimate of joint positions and velocities, enabling reliable kinematic control."

**Why This Works:**
- All informal pronouns and transitions removed
- Technical terminology introduced (kinematics, end-effector, encoders)
- "Magical" replaced with technical description of what the filter actually does
- Maintains engagement through intellectual rigor and clarity

---

### Example 3: Excited Announcement → Measured Academic Statement

**Original (Too Excited):**

"We've developed an amazing new approach to trajectory planning that seriously outperforms traditional methods! It's so fast, and it handles constraints way better than existing algorithms. You absolutely have to try this technique—it will blow your mind!"

**Academic Issues:**
- "We've developed" (informal contraction + casual pronoun)
- "amazing" (informal superlative)
- "seriously outperforms" (intensifier)
- "so fast" (vague intensity)
- "way better" (colloquial intensifier)
- "You absolutely have to try" (informal imperative + pronoun)
- "blow your mind" (hyperbolic colloquialism)

**Conversion Mapping:**
| Informal | Academic | Reason |
|----------|----------|--------|
| "We've developed" | "We present" | Formal, contracton-free |
| "amazing new approach" | "novel approach" | Formal superlative in academic context |
| "seriously outperforms" | "demonstrates superior performance relative to" | Quantifiable comparison |
| "so fast" | "exhibits reduced computational complexity" | Specific technical measure |
| "way better" | "more robust in constraint satisfaction" | Technical specificity |
| "You absolutely have to try" | "This technique is particularly valuable for applications requiring..." | Specific context for utility |
| "blow your mind" | "yields remarkable efficiency gains" | Technical consequence |

**Revised (Academic):**

"We present a novel trajectory planning approach that demonstrates superior performance compared to traditional methods. The algorithm exhibits reduced computational complexity while more effectively satisfying kinematic and collision-avoidance constraints. This technique is particularly valuable for real-time applications requiring rapid replanning under dynamic environmental constraints."

**Why This Works:**
- Replaces hyperbole with measurable claims
- Maintains the positive assessment but grounds it in specifics
- Appropriate for academic discourse (claims supported by substance)

---

### Example 4: Informal Instruction → Academic Directive

**Original (Informal):**

"Just check out the code below—it's super simple! Basically, we're setting up a timer that calls the function every 100 milliseconds. Don't worry if it looks complicated at first; you'll get it once you play around with it."

**Academic Issues:**
- "Just check out" (casual imperative)
- "super simple" (informal evaluation)
- "Basically" (filler)
- "Don't worry" (conversational reassurance)
- "you'll get it" (informal, vague)
- "play around" (colloquial for "experiment")

**Conversion Mapping:**
| Informal | Academic | Reason |
|----------|----------|--------|
| "Just check out the code below" | "Consider the following code" or "The code below demonstrates" | Formal directive |
| "super simple" | Remove evaluation | Let code speak; add explanation instead |
| "Basically, we're setting up" | "This initializes" or "This code establishes" | Formal phrasing |
| "Don't worry if it looks complicated" | "While the syntax may appear unfamiliar" | Academic acknowledgment without casualness |
| "you'll get it" | "understanding develops through careful study" or "the logic becomes clear upon examination" | Formal description of learning process |
| "play around" | "experiment with" or "modify" | Formal equivalent |

**Revised (Academic):**

"The following code establishes a timer that invokes a callback function at 100-millisecond intervals. While the ROS 2 timer syntax may appear unfamiliar, the logic becomes clear upon careful examination. Students are encouraged to modify parameters (e.g., timer frequency) and observe the resulting behavior to reinforce conceptual understanding."

**Why This Works:**
- Formal directives replace casual language
- Acknowledges difficulty without condescension
- Frames learning as active engagement
- Maintains pedagogical intent in academic voice

---

## Tools & Resources

### Language & Tone Analysis Tools

1. **Hemingway Editor** (https://hemingwayapp.com/)
   - Identifies long, complex sentences
   - Flags passive voice, filler words, adverbs
   - Use to detect readability issues and informal markers

2. **Grammarly** (https://www.grammarly.com/)
   - Checks grammar, tone, clarity
   - Tone detector identifies casual language
   - Useful for consistent voice

3. **Language Tool** (https://languagetool.org/)
   - Open-source grammar and style checker
   - Identifies redundant phrases

### Academic Writing Resources

1. **"The Elements of Style" (Strunk & White):**
   - Classic guide to clear, concise writing
   - Emphasizes active voice and precision

2. **"Academic Writing Today" (Hacker & Sommers):**
   - Modern guide to academic conventions
   - Distinguishes academic from popular writing

3. **"The Craft of Scientific Writing" (Alley):**
   - Emphasizes clarity and precision
   - Practical examples from technical fields

### Terminology & Consistency Tools

1. **Project Glossary** (`.specify/memory/glossary.md`)
   - Reference for terminology consistency
   - Robotics and AI term definitions

2. **Find & Replace (IDE):**
   - Identify inconsistent terminology
   - Batch replacements with confidence (e.g., "joint position" → "joint angle")

3. **Style Guide Template:**
   - Create project-specific conventions
   - Example: capitalization, abbreviations, formatting

---

## Academic Tone Quality Checklist

Before finalizing, verify:

- [ ] **Contractions:** All expanded to formal equivalents (don't → do not, it's → it is, etc.)
- [ ] **Pronouns:** Informal pronouns (you, we, I) eliminated or formalized (one, the reader, this work)
- [ ] **Filler words:** Removed (really, very, quite, actually, basically, literally)
- [ ] **Colloquialisms:** Replaced with formal equivalents (lots of → numerous; cool → advantageous)
- [ ] **Informal transitions:** Converted to academic connectors (so → therefore; well → however)
- [ ] **Exclamation marks:** Removed or used very sparingly (max 1–2 per chapter)
- [ ] **Rhetorical questions:** Converted to declarative statements
- [ ] **Hyperbole:** Removed; replaced with measured claims
- [ ] **Informal imperatives:** "Check this out" → "Consider the following"
- [ ] **Hedging qualifiers:** Qualified rigorously ("kind of works" → "exhibits partial effectiveness")
- [ ] **Terminology consistency:** All terms match glossary and are used consistently
- [ ] **Sentence length:** Average 15–20 words; variety maintained
- [ ] **Passive/active balance:** Passive used strategically for processes; active for clarity
- [ ] **Logical flow:** Smooth transitions; paragraph coherence verified
- [ ] **Engagement:** Derives from intellectual rigor, not informality
- [ ] **No meaning loss:** Original intent preserved in academic conversion
- [ ] **Over-correction:** Tone is formal, not pretentious or unnecessarily complex
- [ ] **Academic integrity:** No plagiarism; citations accurate

---

## Acceptance Criteria

✅ **All casual language detected** and flagged with severity levels
✅ **Conversion pairs created** for each informal element
✅ **Terminology standardized** against project glossary
✅ **Academic voice consistent** throughout (formal, objective, rigorous)
✅ **Clarity preserved or improved** (academic ≠ obscure)
✅ **Meaning unchanged** (no distortion of original intent)
✅ **Engagement maintained** through intellectual rigor
✅ **Style guide compliance** verified
✅ **No over-correction** (tone is appropriate, not stuffy)
✅ **Final scan complete** (no lingering informal markers)

---

## Examples: Effective vs. Ineffective Academic Tone

### ❌ Ineffective (Still Casual)

"So basically, the Kalman filter is really cool because it combines data from sensors and stuff. You can use it to figure out where the robot is, and it's way better than just using one sensor by itself. Honestly, it's kind of magical how well it works!"

**Problems:**
- "So basically" (opening filler)
- "really cool" (informal evaluation)
- "and stuff" (vague colloquialism)
- "You can use it to figure out" (informal pronoun + verb)
- "way better" (intensifier)
- "Honestly" (conversational interjection)
- "kind of magical" (hyperbole + hedging)

### ✅ Effective (Rigorous Academic)

"The Kalman filter addresses the challenge of state estimation in systems with noisy measurements by implementing an optimal, recursive algorithm. By fusing data from multiple sensors—each with known noise characteristics—the filter produces a maximum-likelihood estimate of system state. This approach demonstrates superior accuracy compared to single-sensor estimates, particularly in dynamic environments where measurement latency and uncertainty are significant."

**Strengths:**
- Formal opening statement of purpose
- Technical terminology (optimal, recursive, maximum-likelihood, covariance)
- Specific advantages (accuracy, robustness to latency) rather than hyperbole
- Academic voice throughout
- Intellectual rigor creates engagement

---

## Examples: Inappropriate Over-Correction

### ❌ Over-Corrected (Too Stuffy)

"The aforementioned algorithmic framework, which shall be designated herein as the entity of interest, manifests a propensity toward computational efficaciousness in the aforementioned domain of discourse."

**Problems:**
- "aforementioned" (unnecessary repetition)
- "shall be designated herein" (overly formal)
- "manifests a propensity toward" (pretentious)
- "computational efficaciousness" (fake-fancy; use "efficiency" or "performance")
- Meaning is obscured rather than clarified

### ✅ Appropriate Academic

"The Kalman filter exhibits superior computational efficiency compared to alternative state estimation methods."

**Strengths:**
- Formal but clear
- Specific claim (computational efficiency)
- Direct, active phrasing
- Academic without pretension

---

## Integration with Other Skills

**Academic Tone works with:**
- **Content-Writer:** Ensures lesson text meets academic standards
- **Code-Narrator:** Maintains formal tone in code explanations
- **Page-Flow:** Works together to ensure readability and formality
- **Learning-Objective-Mapper:** Academic tone supports rigorous learning objectives
- **Token-Optimizer:** May condense text while maintaining tone
- **Diagram-First:** Ensures accompanying text (diagram captions, explanations) is academically rigorous

---

## Common Pitfalls & Solutions

### Pitfall 1: Confusing Formality with Clarity
**Problem:** "The methodological implementation necessitates comprehensive parametric recalibration."
**Solution:** "The algorithm requires parameter tuning."
- Academic ≠ incomprehensible
- Clarity should increase, not decrease

### Pitfall 2: Losing Technical Specificity
**Original:** "The controller makes the robot move smoothly."
**Casual Conversion (Wrong):** "The controller is really good at smooth motion."
**Academic (Correct):** "The PID controller minimizes trajectory error through proportional, integral, and derivative feedback, enabling smooth motion."

### Pitfall 3: Removing All Personality
**Problem:** Academic writing is dull and impersonal.
**Solution:** Academic tone can be engaging through precision and intellectual rigor. A well-explained concept is inherently interesting.

### Pitfall 4: Inconsistent Terminology Mid-Edit
**Problem:** Switching between "joint position," "joint angle," "rotation" without consistency.
**Solution:** Define one term per concept and maintain it throughout. Use glossary as reference.

---

## When NOT to Apply Academic Tone

- **Code examples:** Preserve as-is (don't alter code comments unless necessary)
- **Direct quotes:** Preserve original language and attribution
- **Student discussions:** Some conversational tone may be pedagogically appropriate
- **Abstract/introduction:** May intentionally use accessible language to invite readers
- **Dialogue or narratives:** Preserve character voice
- **Review first:** Ask whether informality serves a pedagogical purpose before converting

---

## Save Location

Save it as `.claude/skills/academic-tone/skill.md`
