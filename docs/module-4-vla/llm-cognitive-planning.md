---
title: "LLM-Based Cognitive Planning"
sidebar_label: "LLM Cognitive Planning"
sidebar_position: 2
reading_time: 34
---

# LLM-Based Cognitive Planning

**Reading Time:** ~34 minutes
**Difficulty Level:** Advanced

## Learning Objectives

By the end of this lesson, you will be able to:

1. Use Large Language Models (LLMs) for high-level task planning in robotics applications
2. Implement chain-of-thought reasoning for complex goal decomposition
3. Design prompts that handle physical constraints, preconditions, and spatial reasoning
4. Manage execution errors and implement fallback strategies using LLM re-planning
5. Integrate LLMs with robot perception and control systems while respecting latency and cost constraints

## Introduction

Traditional robot planning relies on hand-coded state machines or classical search algorithms (A*, RRT). While effective for well-defined problems, these approaches struggle with:

- **Semantic understanding**: "Tidy the living room" requires understanding object categories, spatial relationships, and human preferences
- **Generalization**: New tasks require new code (no transfer learning)
- **Common-sense reasoning**: "Don't put the laptop in the sink" (humans know this implicitly)

Large Language Models (LLMs) like GPT-4, Claude, and open-source alternatives (Llama 3, Mistral) offer a paradigm shift: **planning through natural language reasoning**. LLMs encode vast world knowledge from internet-scale training data, enabling robots to:

- Decompose abstract goals into executable steps
- Reason about object affordances ("mugs can be picked up")
- Handle novel situations without retraining

This lesson explores LLM-based cognitive planning, covering prompt engineering, integration with perception, and deployment strategies for production humanoid robots.

---

## 1. Large Language Models for Robotics

### LLM Capabilities and Limitations

**What LLMs Provide**:

1. **Semantic Understanding**: Map high-level goals to action sequences
2. **Common-Sense Reasoning**: Infer preconditions ("open fridge before taking milk")
3. **Few-Shot Learning**: Adapt to new tasks with 2-3 examples
4. **Explanation Generation**: Provide human-readable justifications for plans

**Critical Limitations**:

| Limitation | Impact on Robotics | Mitigation Strategy |
|------------|-------------------|---------------------|
| **No physical grounding** | Cannot predict force requirements, collision likelihood | Combine with physics simulators |
| **Hallucinations** | May generate invalid actions ("teleport to location") | Validate against action library |
| **No real-time guarantees** | Latency varies (100 ms - 10 s) | Cache plans, use local LLMs for latency-critical tasks |
| **Token costs** | API calls expensive for continuous replanning | Batch queries, use cheaper models for simple tasks |
| **No visual reasoning (text-only)** | Cannot identify "the red box on the left" | Integrate with vision-language models (VLMs) |

:::caution Safety First
**Never execute LLM outputs directly**. Always validate plans through:
1. Action whitelist (only allowed primitives)
2. Physics feasibility checks (collision detection)
3. Human-in-the-loop confirmation for high-risk actions
:::

### Prompt Engineering Fundamentals

**Prompt Structure** (5-part framework):

```
1. System Context: Define robot capabilities and constraints
2. Task Description: State the goal clearly
3. Examples (Few-Shot): Provide 2-3 successful task decompositions
4. Constraints: Physical limits, safety rules, preconditions
5. Output Format: Specify structured response (JSON, XML, code)
```

**Example Prompt**:

```
System: You are a planning assistant for a humanoid robot with the following capabilities:
- navigate(location): Move to a named location
- pick(object): Grasp an object
- place(object, location): Place held object at location
- open(container): Open doors/drawers
- close(container): Close doors/drawers

The robot has a gripper, stereo cameras, and can navigate using visual SLAM.

Task: "Bring me a cold drink from the kitchen"

Constraints:
- Only one object can be held at a time
- Doors must be opened before passing through
- Drinks are stored in the refrigerator
- The refrigerator is in the kitchen

Examples:
Task: "Get the book from the shelf"
Plan:
1. navigate("shelf")
2. pick("book")
3. navigate("user")
4. place("book", "user_hand")

Task: "Put the mug in the dishwasher"
Plan:
1. navigate("mug_location")
2. pick("mug")
3. navigate("dishwasher")
4. open("dishwasher")
5. place("mug", "dishwasher_rack")
6. close("dishwasher")

Now generate a plan for: "Bring me a cold drink from the kitchen"

Output Format (JSON):
{
  "plan": [
    {"action": "navigate", "parameters": {"location": "..."}},
    {"action": "pick", "parameters": {"object": "..."}}
  ],
  "reasoning": "Step-by-step explanation"
}
```

### Few-Shot Learning

**Providing Task Examples** (in-context learning):

```python
def build_few_shot_prompt(task, examples):
    """Construct prompt with task-specific examples."""
    prompt = "You are a robot task planner. Here are examples:\n\n"

    for example in examples:
        prompt += f"Task: {example['task']}\n"
        prompt += f"Plan:\n{example['plan']}\n\n"

    prompt += f"Now plan for: {task}\n"
    return prompt

# Example database
examples = [
    {
        "task": "Set the table for dinner",
        "plan": "1. navigate(cabinet)\n2. open(cabinet)\n3. pick(plate)\n4. navigate(table)\n5. place(plate, table)\n6. [repeat for utensils]"
    },
    {
        "task": "Water the plant",
        "plan": "1. navigate(sink)\n2. pick(watering_can)\n3. [fill with water]\n4. navigate(plant)\n5. [pour water]"
    }
]

prompt = build_few_shot_prompt("Clean the kitchen counter", examples)
```

**Example Selection** (retrieve most relevant examples):

```python
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

def select_relevant_examples(task, example_database, k=3):
    """Retrieve k most similar examples to task."""
    task_embedding = model.encode(task, convert_to_tensor=True)

    example_embeddings = model.encode(
        [ex['task'] for ex in example_database],
        convert_to_tensor=True
    )

    # Compute cosine similarity
    similarities = util.cos_sim(task_embedding, example_embeddings)[0]

    # Get top-k
    top_k_indices = similarities.argsort(descending=True)[:k]

    return [example_database[i] for i in top_k_indices]

# Usage
relevant_examples = select_relevant_examples("Prepare coffee", examples, k=2)
```

### Token Efficiency for Edge Devices

**Prompt Compression**:

```python
def compress_prompt(prompt, max_tokens=512):
    """Reduce prompt length while preserving key information."""
    # Remove redundant whitespace
    compressed = " ".join(prompt.split())

    # Abbreviate common terms
    abbreviations = {
        "navigate to": "nav",
        "pick up": "pick",
        "place at": "place"
    }

    for full, abbrev in abbreviations.items():
        compressed = compressed.replace(full, abbrev)

    # Truncate if still too long
    import tiktoken
    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(compressed)

    if len(tokens) > max_tokens:
        compressed = enc.decode(tokens[:max_tokens])

    return compressed
```

**Local LLM Deployment** (avoid API costs):

```bash
# Install Ollama (local LLM runtime)
curl -fsSL https://ollama.com/install.sh | sh

# Pull Llama 3 (8B parameters, runs on Jetson AGX Orin)
ollama pull llama3

# Pull Mistral (7B parameters, faster)
ollama pull mistral
```

```python
import requests

def query_local_llm(prompt, model="llama3"):
    """Query locally-hosted LLM via Ollama API."""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": model,
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"]

# Usage
plan = query_local_llm("Plan to navigate to the kitchen and pick up a mug")
```

---

## 2. Task Planning with LLMs

### Semantic Understanding

**Object Affordance Reasoning**:

```python
def generate_affordance_aware_plan(task, object_affordances):
    """Incorporate object properties into planning."""
    affordance_context = "Object properties:\n"

    for obj, props in object_affordances.items():
        affordance_context += f"- {obj}: {', '.join(props)}\n"

    prompt = f"""
{affordance_context}

Task: {task}

Generate a plan that respects object affordances.
For example:
- Fragile objects must be handled gently
- Heavy objects may require two-handed grasping
- Containers must be opened before accessing contents

Plan:
"""

    return query_llm(prompt)

# Example affordances
affordances = {
    "glass": ["fragile", "transparent", "graspable"],
    "laptop": ["fragile", "heavy", "electronic"],
    "drawer": ["openable", "container"]
}

plan = generate_affordance_aware_plan("Move the laptop to the drawer", affordances)
```

### Goal Decomposition

**Hierarchical Task Network (HTN) Generation**:

```python
def decompose_task(high_level_goal):
    """Use LLM to break down abstract goal into subtasks."""
    prompt = f"""
You are a task decomposition expert for robots.

High-level goal: {high_level_goal}

Decompose this into:
1. High-level steps (abstract actions)
2. Low-level actions (robot primitives)

Format:
High-Level Step 1: [description]
  - Low-level action 1.1: navigate(...)
  - Low-level action 1.2: pick(...)

High-Level Step 2: [description]
  - Low-level action 2.1: ...
"""

    response = query_llm(prompt)
    return parse_htn(response)

def parse_htn(response):
    """Parse LLM output into structured HTN."""
    import re

    high_level_steps = []
    current_step = None

    for line in response.split('\n'):
        # Match high-level step
        if re.match(r'^High-Level Step \d+:', line):
            if current_step:
                high_level_steps.append(current_step)

            current_step = {
                "description": line.split(':', 1)[1].strip(),
                "actions": []
            }

        # Match low-level action
        elif re.match(r'^\s*-', line) and current_step:
            action = line.strip('- ').strip()
            current_step["actions"].append(action)

    if current_step:
        high_level_steps.append(current_step)

    return high_level_steps

# Test
htn = decompose_task("Prepare the dining table for breakfast")
print(htn)
```

### Action Sequencing

**Constraint-Based Ordering**:

```python
def optimize_action_sequence(actions, constraints):
    """Use LLM to order actions respecting constraints."""
    action_list = "\n".join([f"{i+1}. {a}" for i, a in enumerate(actions)])
    constraint_list = "\n".join([f"- {c}" for c in constraints])

    prompt = f"""
Given these actions:
{action_list}

And these constraints:
{constraint_list}

Reorder the actions to:
1. Satisfy all constraints
2. Minimize total execution time
3. Avoid unnecessary back-and-forth navigation

Output the optimal sequence as a numbered list.
"""

    response = query_llm(prompt)
    return parse_sequence(response)

def parse_sequence(response):
    """Extract ordered action sequence."""
    import re
    sequence = []

    for line in response.split('\n'):
        match = re.match(r'^\d+\.\s*(.+)', line)
        if match:
            sequence.append(match.group(1).strip())

    return sequence

# Example
actions = [
    "pick(mug)",
    "navigate(kitchen)",
    "place(mug, counter)",
    "navigate(cabinet)"
]

constraints = [
    "Must navigate to location before interacting with objects there",
    "Can only hold one object at a time",
    "Minimize total navigation distance"
]

optimized = optimize_action_sequence(actions, constraints)
```

### Precondition Checking

**Automated Precondition Inference**:

```python
def infer_preconditions(action):
    """Use LLM to generate preconditions for action."""
    prompt = f"""
For the robot action: {action}

List all preconditions that must be true before executing this action.

Format:
- Precondition 1: [description]
- Precondition 2: [description]

Examples:
Action: pick(object)
Preconditions:
- Robot is at object location
- Object is graspable (size, weight)
- Gripper is empty

Action: open(door)
Preconditions:
- Robot is facing the door
- Door is closed
- Door is unlocked

Now generate preconditions for: {action}
"""

    response = query_llm(prompt)
    return parse_preconditions(response)

def parse_preconditions(response):
    """Extract precondition list."""
    import re
    preconditions = []

    for line in response.split('\n'):
        match = re.match(r'^\s*-\s*(.+)', line)
        if match:
            preconditions.append(match.group(1).strip())

    return preconditions

# Test
preconds = infer_preconditions("place(mug, shelf)")
print(preconds)
# ['Robot is holding the mug', 'Shelf is within reach', 'Shelf has empty space']
```

---

## 3. Reasoning and Decision Making

### Chain-of-Thought Prompting

**Step-by-Step Reasoning**:

```python
def chain_of_thought_planning(task):
    """Enable explicit reasoning steps."""
    prompt = f"""
Task: {task}

Think step-by-step:
1. What is the goal?
2. What objects/locations are involved?
3. What is the current state?
4. What actions are needed?
5. What constraints must be satisfied?
6. Generate the final plan.

Format your response with clear reasoning for each step.
"""

    response = query_llm(prompt)
    return response

# Example
cot_plan = chain_of_thought_planning("Clear the dining table after dinner")
print(cot_plan)
```

**Self-Consistency** (multiple reasoning paths):

```python
def self_consistent_planning(task, n_samples=5):
    """Generate multiple plans and select most consistent."""
    plans = []

    for _ in range(n_samples):
        plan = chain_of_thought_planning(task)
        plans.append(plan)

    # Vote on most common plan structure
    from collections import Counter
    plan_counter = Counter(plans)
    most_common_plan = plan_counter.most_common(1)[0][0]

    return most_common_plan
```

### Object Detection and Scene Understanding

**Vision-Language Integration**:

```python
def detect_objects_vlm(image_path):
    """Use vision-language model to detect objects."""
    import base64

    # Encode image
    with open(image_path, "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode()

    prompt = """
Describe this scene for a robot:
1. List all objects visible
2. Describe their positions (left, right, on table, etc.)
3. Identify any obstacles

Format:
Objects: [list]
Positions: [descriptions]
Obstacles: [list]
"""

    # Query GPT-4V or similar VLM
    response = query_vlm(prompt, image_b64)
    return parse_scene_description(response)

def query_vlm(prompt, image_b64):
    """Query vision-language model (GPT-4V API)."""
    import openai

    response = openai.ChatCompletion.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": f"data:image/jpeg;base64,{image_b64}"}
                ]
            }
        ]
    )

    return response.choices[0].message.content
```

**Grounding LLM Plans in Perception**:

```python
def ground_plan_in_scene(plan, scene_objects):
    """Validate plan against detected objects."""
    prompt = f"""
Plan: {plan}

Detected objects in scene: {scene_objects}

Questions:
1. Are all objects mentioned in the plan present in the scene?
2. If not, suggest modifications to the plan.

Output:
- Valid: Yes/No
- Missing objects: [list]
- Suggested modifications: [description]
"""

    response = query_llm(prompt)
    return response

# Example
plan = "Pick the red mug and place it on the shelf"
scene = ["blue mug", "shelf", "book"]

validation = ground_plan_in_scene(plan, scene)
print(validation)
# "Valid: No. Missing: red mug. Suggestion: Pick the blue mug instead."
```

### Spatial Reasoning

**Coordinate-Free Spatial Planning**:

```python
def spatial_reasoning_prompt(task, spatial_relationships):
    """Plan using spatial relationships (no coordinates)."""
    spatial_context = "Spatial layout:\n"

    for rel in spatial_relationships:
        spatial_context += f"- {rel}\n"

    prompt = f"""
{spatial_context}

Task: {task}

Generate a plan using spatial relationships (e.g., "left of", "on top of").
Do NOT use numeric coordinates.

Plan:
"""

    return query_llm(prompt)

# Example
relationships = [
    "The mug is on the table",
    "The table is left of the shelf",
    "The sink is right of the table"
]

plan = spatial_reasoning_prompt("Move the mug to the sink", relationships)
```

### Reference Resolution

**Anaphora and Deixis Handling**:

```python
def resolve_references(utterance, context):
    """Resolve pronouns and demonstratives."""
    prompt = f"""
Context: {context}

Utterance: "{utterance}"

Resolve references (it, that, there, this) to specific entities.

Output format:
Original: [utterance]
Resolved: [utterance with references replaced]
"""

    return query_llm(prompt)

# Example
context = {
    "last_mentioned_object": "red box",
    "last_mentioned_location": "shelf",
    "robot_position": "kitchen"
}

utterance = "Pick it up and put it there"
resolved = resolve_references(utterance, context)
print(resolved)
# "Pick the red box up and put it on the shelf"
```

---

## 4. Integration with Perception

### Visual Question Answering

**Scene Interrogation**:

```python
def visual_qa(image_path, question):
    """Answer questions about scene using VLM."""
    import base64

    with open(image_path, "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode()

    prompt = f"Question: {question}\nProvide a concise answer."

    response = query_vlm(prompt, image_b64)
    return response

# Examples
vqa_response = visual_qa("scene.jpg", "Is there a red object on the table?")
# "Yes, there is a red mug on the left side of the table."

vqa_response = visual_qa("scene.jpg", "How many chairs are in the room?")
# "There are 4 chairs around the dining table."
```

**Interactive Perception**:

```python
def interactive_object_search(target_object):
    """Use LLM to guide visual search."""
    prompt = f"""
The robot is searching for: {target_object}

Current view: [camera feed analysis]

Suggest:
1. Where to look next (left, right, up, down)
2. What visual features to focus on (color, shape, size)
3. How close to approach

Output format:
- Look direction: [direction]
- Visual cues: [list]
- Approach distance: [meters]
"""

    response = query_llm(prompt)
    return response
```

### Physical Constraint Reasoning

**Collision Prediction**:

```python
def check_collision_feasibility(action, scene_description):
    """Use LLM to predict potential collisions."""
    prompt = f"""
Scene: {scene_description}

Proposed action: {action}

Questions:
1. Could this action cause a collision?
2. If yes, with which objects?
3. Suggest a collision-free alternative.

Output:
- Collision risk: High/Medium/Low
- Potential collisions: [list]
- Safe alternative: [action]
"""

    response = query_llm(prompt)
    return response

# Example
scene = "Table with vase in center, chairs on both sides"
action = "Navigate directly from left chair to right chair"

collision_check = check_collision_feasibility(action, scene)
# "Collision risk: High. Potential: Table, vase. Alternative: Navigate around table."
```

**Weight and Stability Estimation**:

```python
def estimate_grasp_feasibility(object_description):
    """Predict if object can be grasped."""
    prompt = f"""
Object: {object_description}

Estimate:
1. Approximate weight (kg)
2. Graspability (can a single gripper hold it?)
3. Stability (will it tip over during transport?)

Output:
- Weight estimate: [value] kg
- Graspable: Yes/No
- Stable when held: Yes/No
- Recommendation: [action]
"""

    response = query_llm(prompt)
    return response

# Example
obj_desc = "Large cardboard box (40cm x 40cm x 60cm), appears empty"
feasibility = estimate_grasp_feasibility(obj_desc)
# "Weight: ~2 kg. Graspable: Yes. Stable: No (top-heavy). Recommendation: Grasp from middle."
```

---

## 5. Deployment and Optimization

### Local vs Cloud LLMs

**Decision Matrix**:

| Factor | Cloud LLM (GPT-4) | Local LLM (Llama 3 8B) |
|--------|-------------------|------------------------|
| **Latency** | 500-3000 ms | 100-500 ms (GPU) |
| **Cost** | $0.01-0.06 per 1K tokens | $0 (hardware amortized) |
| **Model Quality** | Highest accuracy | Good (80-90% of GPT-4) |
| **Privacy** | Data sent to API | Fully local |
| **Connectivity** | Requires internet | Offline capable |
| **Use Case** | Complex reasoning, rare tasks | Real-time, privacy-critical |

**Hybrid Strategy**:

```python
def hybrid_planning(task, complexity_threshold=0.7):
    """Route to cloud or local based on task complexity."""
    # Estimate complexity
    complexity = estimate_task_complexity(task)

    if complexity > complexity_threshold:
        print("Complex task → using cloud LLM (GPT-4)")
        return query_cloud_llm(task)
    else:
        print("Simple task → using local LLM (Llama 3)")
        return query_local_llm(task)

def estimate_task_complexity(task):
    """Heuristic complexity scoring."""
    complexity_score = 0.0

    # Long tasks are more complex
    complexity_score += min(len(task.split()) / 50, 0.3)

    # Multiple objects increase complexity
    objects_mentioned = len(re.findall(r'\b(pick|place|move|put)\b', task.lower()))
    complexity_score += min(objects_mentioned / 5, 0.4)

    # Conditional logic increases complexity
    if any(kw in task.lower() for kw in ['if', 'unless', 'when', 'after']):
        complexity_score += 0.3

    return complexity_score
```

### Token Budget Management

**Cost Tracking**:

```python
import tiktoken

class TokenBudgetManager:
    def __init__(self, max_tokens_per_hour=10000, cost_per_1k_tokens=0.03):
        self.max_tokens_per_hour = max_tokens_per_hour
        self.cost_per_1k = cost_per_1k_tokens
        self.tokens_used = 0
        self.start_time = time.time()

    def count_tokens(self, text):
        """Count tokens in text."""
        enc = tiktoken.get_encoding("cl100k_base")
        return len(enc.encode(text))

    def can_afford(self, prompt):
        """Check if request fits budget."""
        tokens_needed = self.count_tokens(prompt)

        # Reset counter if hour elapsed
        if time.time() - self.start_time > 3600:
            self.tokens_used = 0
            self.start_time = time.time()

        return self.tokens_used + tokens_needed <= self.max_tokens_per_hour

    def track_usage(self, prompt, response):
        """Record token usage."""
        prompt_tokens = self.count_tokens(prompt)
        response_tokens = self.count_tokens(response)
        total = prompt_tokens + response_tokens

        self.tokens_used += total

        cost = (total / 1000) * self.cost_per_1k
        print(f"Tokens used: {total} (${cost:.4f})")

# Usage
budget = TokenBudgetManager(max_tokens_per_hour=5000)

if budget.can_afford(prompt):
    response = query_llm(prompt)
    budget.track_usage(prompt, response)
else:
    print("Token budget exceeded. Using fallback planner.")
```

### Real-Time Constraints

**Timeout Handling**:

```python
import asyncio

async def query_llm_with_timeout(prompt, timeout_seconds=5):
    """Query LLM with timeout fallback."""
    try:
        response = await asyncio.wait_for(
            query_llm_async(prompt),
            timeout=timeout_seconds
        )
        return response

    except asyncio.TimeoutError:
        print(f"LLM timeout after {timeout_seconds}s. Using cached plan.")
        return get_cached_plan(prompt)

async def query_llm_async(prompt):
    """Async LLM query."""
    # Implementation depends on API (OpenAI supports async)
    pass

def get_cached_plan(prompt):
    """Retrieve similar cached plan."""
    # Semantic search in plan database
    pass
```

### Safety Guardrails

**Action Validation**:

```python
ALLOWED_ACTIONS = [
    "navigate", "pick", "place", "open", "close", "wait"
]

FORBIDDEN_KEYWORDS = [
    "delete", "destroy", "throw", "break", "damage"
]

def validate_plan(plan):
    """Check plan safety before execution."""
    for action in plan:
        # Ensure action is in whitelist
        action_name = action.split('(')[0]

        if action_name not in ALLOWED_ACTIONS:
            return False, f"Forbidden action: {action_name}"

        # Check for dangerous keywords
        for keyword in FORBIDDEN_KEYWORDS:
            if keyword in action.lower():
                return False, f"Dangerous keyword detected: {keyword}"

    return True, "Plan validated"

# Example
plan = [
    "navigate(kitchen)",
    "pick(knife)",  # Potentially dangerous
    "throw(knife, trash)"  # FORBIDDEN
]

is_safe, message = validate_plan(plan)
if not is_safe:
    print(f"Plan rejected: {message}")
```

**Human-in-the-Loop Confirmation**:

```python
def execute_with_confirmation(plan, require_confirmation_threshold=0.8):
    """Request human approval for risky actions."""
    risk_score = assess_plan_risk(plan)

    if risk_score > require_confirmation_threshold:
        print(f"Plan risk: {risk_score:.2f}")
        print("Plan:", plan)

        confirmation = input("Approve execution? (yes/no): ")

        if confirmation.lower() != "yes":
            print("Plan execution cancelled by user.")
            return False

    # Execute plan
    for action in plan:
        execute_action(action)

    return True

def assess_plan_risk(plan):
    """Heuristic risk scoring."""
    risk = 0.0

    high_risk_actions = ["pick", "place", "open"]
    for action in plan:
        if any(hr in action for hr in high_risk_actions):
            risk += 0.2

    # Complex plans are riskier
    risk += min(len(plan) / 20, 0.4)

    return min(risk, 1.0)
```

---

## Summary

This lesson explored LLM-based cognitive planning for humanoid robotics:

- **LLM capabilities**: Semantic understanding, common-sense reasoning, and few-shot learning enable flexible task planning
- **Prompt engineering**: Structured prompts with examples, constraints, and output formats guide LLMs to generate valid plans
- **Task decomposition**: LLMs break down abstract goals into executable action sequences with precondition checking
- **Perception integration**: Vision-language models ground plans in real-world scenes through visual question answering
- **Deployment strategies**: Hybrid cloud/local approaches balance latency, cost, and quality; safety guardrails prevent invalid actions

**Key Takeaway**: LLMs excel at **high-level semantic planning** but require grounding in perception, physics validation, and safety constraints. Never execute LLM outputs directly—always validate through whitelists, simulation, and human oversight.

---

## Next Steps

1. **Hands-On Exercise**: Build an LLM-powered task planner that decomposes "Clean the kitchen" into executable steps
2. **Advanced Topic**: Explore [Capstone Project](./capstone-project.md) to integrate voice, LLM planning, and robot control
3. **Research Frontiers**: Investigate embodied AI (LLMs trained with robot interaction data) for improved physical reasoning
4. **Community Resources**:
   - [Ollama](https://ollama.com/) — Local LLM deployment
   - [LangChain](https://www.langchain.com/) — LLM application framework
   - [Code as Policies](https://code-as-policies.github.io/) — LLMs generate executable Python

---

## Further Reading

- **"Language Models as Zero-Shot Planners"** (Huang et al., 2022) — Foundational work on LLM planning
- **"Code as Policies: Language Model Programs for Embodied Control"** (Liang et al., 2023) — Generate Python code instead of action sequences
- **"PaLM-E: An Embodied Multimodal Language Model"** (Google, 2023) — Vision-language model for robotics
- **"RT-2: Vision-Language-Action Models"** (Google DeepMind, 2023) — End-to-end VLA training

:::info Practice Quiz
Test your understanding with the [Module 4 Quiz](./quiz.md) after completing the capstone project.
:::
