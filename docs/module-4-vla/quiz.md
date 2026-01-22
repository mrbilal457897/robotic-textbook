---
title: "Module 4 Quiz: Vision-Language-Action Models"
sidebar_label: "Quiz"
sidebar_position: 4
---

# Module 4 Quiz: Vision-Language-Action Models

Test your understanding of voice-to-action systems, LLM-based cognitive planning, and integration strategies covered in this module.

---

## Instructions

- **Total Questions**: 10
- **Passing Score**: 70% (7/10 correct)
- **Time Estimate**: 15-20 minutes
- **Question Types**: Multiple choice, scenario-based, code analysis

Select the **best** answer for each question.

---

## Questions

### Question 1 (Easy)
**Which Whisper model variant is MOST suitable for real-time deployment on NVIDIA Jetson Nano (4 GB RAM)?**

A) large-v2 (1550M parameters)
B) medium (769M parameters)
C) small (244M parameters)
D) tiny (39M parameters)

<details>
<summary>Show Answer</summary>

**Correct Answer: D) tiny (39M parameters)**

**Explanation**: The Jetson Nano has limited memory (4 GB) and compute capacity. The tiny model (39M parameters) provides the best trade-off between accuracy (8% WER) and latency (~0.5s on GPU). The small model (option C) might fit but would be slower. Medium and large models (options A and B) would exceed memory constraints or run unacceptably slowly.

</details>

---

### Question 2 (Medium)
**You're building a voice command system and observe 15% Word Error Rate (WER) in a quiet room but 45% WER in a factory environment. What is the MOST effective solution?**

A) Switch from Whisper base to Whisper large for better accuracy
B) Implement noise reduction preprocessing using spectral subtraction before transcription
C) Increase microphone sensitivity to capture louder audio
D) Retrain Whisper on factory-specific audio data

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Implement noise reduction preprocessing using spectral subtraction before transcription**

**Explanation**: The dramatic WER increase (15% → 45%) indicates noise interference. Preprocessing with noise reduction (noisereduce library, spectral subtraction) directly addresses the root cause. Option A (larger model) helps slightly but doesn't solve noise. Option C (sensitivity) would amplify noise equally. Option D (retraining) is impractical for most users and requires extensive data.

</details>

---

### Question 3 (Easy)
**In intent classification, what does "few-shot learning" refer to?**

A) Training a model with millions of examples for high accuracy
B) Providing 2-5 task examples in the prompt to guide the LLM without fine-tuning
C) Using a small neural network with few parameters
D) Classifying intents in less than 100 milliseconds

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Providing 2-5 task examples in the prompt to guide the LLM without fine-tuning**

**Explanation**: Few-shot learning in the context of LLMs means including a small number (typically 2-5) of example input-output pairs in the prompt to demonstrate the desired behavior. This is also called "in-context learning." Option A describes traditional supervised learning (many-shot). Option C describes model size, not learning strategy. Option D describes inference latency.

</details>

---

### Question 4 (Hard)
**You're using GPT-4 for task planning and observe the following costs over one hour: 50 commands × 500 tokens/command × $0.03/1K tokens = $0.75/hour. Your budget is $5/day (24 hours). Which strategy reduces costs MOST effectively while maintaining quality?**

A) Switch to GPT-3.5-turbo ($0.001/1K tokens, 30x cheaper)
B) Cache plans for common commands and reuse them
C) Use a local LLM (Llama 3 8B) for all planning tasks
D) Reduce prompt length from 500 to 250 tokens by removing examples

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Cache plans for common commands and reuse them**

**Explanation**: Caching eliminates redundant API calls for repeated commands (e.g., "Go to kitchen" likely occurs frequently). This can reduce costs by 60-80% for common tasks while maintaining full GPT-4 quality for novel commands. Option A (GPT-3.5) is cheaper but lower quality. Option C (local LLM) is free but requires GPU hardware and has 10-20% lower accuracy. Option D (shorter prompts) degrades quality significantly by removing critical context.

**Calculation check**: At current rate, 24 hours = $0.75 × 24 = $18/day, exceeding budget. Caching 70% of commands → $18 × 0.3 = $5.40/day (close to budget).

</details>

---

### Question 5 (Medium)
**Which prompt engineering technique is MOST effective for preventing LLM hallucinations (generating invalid robot actions)?**

A) Increase temperature parameter to 1.5 for more creative outputs
B) Provide explicit action whitelist and output format constraints in the prompt
C) Use longer prompts (>2000 tokens) with extensive context
D) Enable streaming mode to get partial responses faster

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Provide explicit action whitelist and output format constraints in the prompt**

**Explanation**: Constraining the output space (e.g., "Only use these actions: navigate, pick, place") dramatically reduces hallucinations by guiding the LLM to valid responses. Specifying JSON format also enables validation. Option A (high temperature) increases randomness and hallucinations. Option C (long prompts) can help but risks token limits and doesn't prevent invalid actions. Option D (streaming) affects latency, not accuracy.

</details>

---

### Question 6 (Medium)
**In LLM-based task planning, what is "chain-of-thought prompting"?**

A) Connecting multiple LLMs in a pipeline (LLM1 → LLM2 → LLM3)
B) Asking the LLM to show step-by-step reasoning before generating the final plan
C) Using a Markov chain to model task transitions
D) Implementing feedback loops where the robot's execution informs replanning

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Asking the LLM to show step-by-step reasoning before generating the final plan**

**Explanation**: Chain-of-thought (CoT) prompting explicitly requests intermediate reasoning steps (e.g., "Think step-by-step: 1) What objects are involved? 2) What constraints exist? 3) Generate plan."). This improves accuracy on complex tasks by 20-50%. Option A describes model chaining (not CoT). Option C describes probabilistic models (unrelated). Option D describes closed-loop control (not prompting technique).

</details>

---

### Question 7 (Hard)
**You deploy a voice assistant on a Jetson AGX Orin and observe the following latencies: Whisper ASR = 800 ms, LLM planning = 1200 ms, navigation initiation = 300 ms. Total = 2.3 seconds. Your target is less than 1.5 seconds. Which optimization provides the LARGEST latency reduction?**

A) Switch Whisper from base to tiny model (reduces ASR to 400 ms, saves 400 ms)
B) Replace cloud LLM with local Llama 3 8B (reduces planning to 500 ms, saves 700 ms)
C) Optimize navigation code to reduce initiation to 100 ms (saves 200 ms)
D) Use faster-whisper library with int8 quantization (reduces ASR to 500 ms, saves 300 ms)

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Replace cloud LLM with local Llama 3 8B (reduces planning to 500 ms, saves 700 ms)**

**Explanation**: LLM planning is the bottleneck (1200 ms = 52% of total latency). Local inference eliminates network round-trip time. Option B saves 700 ms, bringing total to 1.6 seconds (close to target; combine with option D to reach 1.3s). Option A saves 400 ms but degrades ASR accuracy. Option C saves only 200 ms (small fraction). Option D provides moderate improvement (300 ms).

</details>

---

### Question 8 (Easy)
**What is the primary safety risk of executing LLM-generated plans without validation?**

A) High computational cost from running complex plans
B) LLMs may generate physically infeasible or dangerous actions (e.g., "throw laptop")
C) Plans may be too slow for real-time control
D) LLMs require internet connectivity, creating privacy risks

<details>
<summary>Show Answer</summary>

**Correct Answer: B) LLMs may generate physically infeasible or dangerous actions (e.g., "throw laptop")**

**Explanation**: LLMs lack physical grounding and can hallucinate invalid actions or misinterpret context (e.g., "get rid of the laptop" might be interpreted as "throw laptop"). Validation (action whitelist, physics checks, human confirmation) is mandatory. Option A (cost) is a resource issue, not safety. Option C (speed) affects performance, not safety. Option D (privacy) is valid but not the primary execution safety risk.

</details>

---

### Question 9 (Hard)
**You're integrating a vision-language model (VLM) for scene understanding. The robot must identify "the red box on the left side of the table." Which approach BEST combines VLM with task planning?**

A) Use VLM to generate a full text description, then pass the entire description to the LLM planner
B) Use VLM to detect bounding boxes for all objects, then have LLM select the correct object based on spatial descriptions
C) Use VLM only for object detection (YOLO), then use rule-based logic for spatial reasoning
D) Fine-tune the LLM on VLM outputs to eliminate the need for separate vision processing

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Use VLM to detect bounding boxes for all objects, then have LLM select the correct object based on spatial descriptions**

**Explanation**: This combines the strengths of both models: VLM provides grounded visual information (bounding boxes with labels), and LLM performs spatial reasoning ("left side of table"). Option A loses structured spatial information in text conversion. Option C (rule-based) is brittle and doesn't generalize. Option D (fine-tuning) is impractical and doesn't solve the grounding problem—LLMs still need vision input.

</details>

---

### Question 10 (Medium)
**In the capstone project, you observe that 30% of voice commands fail because users say "Pick up the cup" but the robot's object detector labels it as "mug." What is the BEST solution?**

A) Retrain Whisper to transcribe "cup" as "mug" automatically
B) Use LLM semantic understanding to map "cup" → "mug" based on object synonyms
C) Force users to use exact object labels from the detector
D) Disable voice control and switch to a GUI-based command interface

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Use LLM semantic understanding to map "cup" → "mug" based on object synonyms**

**Explanation**: LLMs excel at semantic reasoning. Add a disambiguation step: "The user said 'cup.' Detected objects: ['mug', 'plate']. Map 'cup' to the most similar detected object." This handles synonyms gracefully. Option A (modify Whisper) is inappropriate—Whisper should transcribe accurately. Option C (force exact labels) creates poor UX. Option D (remove voice) defeats the project purpose.

**Prompt example**: "User said: cup. Detected: [mug, plate, spoon]. Question: Which detected object is 'cup' most likely referring to? Answer: mug (cups and mugs are both drinking vessels)."

</details>

---

## Scoring Guide

- **9-10 correct**: Excellent! You have mastered VLA systems and are ready for advanced robotics AI.
- **7-8 correct**: Good understanding. Review questions you missed, focusing on LLM deployment strategies and safety validation.
- **5-6 correct**: Adequate foundation. Re-read sections on prompt engineering and integration testing.
- **Below 5**: Revisit Module 4 lessons, focusing on hands-on exercises with Whisper and LLM planning.

---

## Key Takeaways

If you struggled with specific topics, review these sections:

- **Speech Recognition**: [Voice-to-Action Systems Lesson](./voice-to-action-systems.md) — Sections 2-3
- **LLM Planning**: [LLM Cognitive Planning Lesson](./llm-cognitive-planning.md) — Sections 2-4
- **Integration**: [Capstone Project Lesson](./capstone-project.md) — Sections 3-4
- **Safety and Validation**: [LLM Cognitive Planning Lesson](./llm-cognitive-planning.md) — Section 5

---

## Course Completion

🎉 **Congratulations!** You've completed the Physical AI & Humanoid Robotics Interactive Textbook!

**What You've Learned**:

- **Module 1**: ROS 2 fundamentals, control frameworks, and URDF modeling
- **Module 2**: Digital twin simulation with Gazebo, Unity, and sensor validation
- **Module 3**: GPU-accelerated simulation (Isaac Sim), vSLAM, and autonomous navigation
- **Module 4**: Voice-language-action systems with Whisper, LLMs, and safe deployment

**Next Steps**:

1. **Build Your Portfolio**: Showcase your capstone project on GitHub
2. **Join the Community**: Contribute to ROS 2, Isaac Sim, or open-source robotics projects
3. **Advanced Learning**: Explore research papers on embodied AI, VLA models (RT-2, PaLM-E)
4. **Career Pathways**: Apply skills to robotics engineering, AI research, or autonomous systems

**Recommended Resources**:

- [ROS 2 Documentation](https://docs.ros.org/)
- [NVIDIA Isaac Resources](https://developer.nvidia.com/isaac)
- [Hugging Face Robotics](https://huggingface.co/learn/deep-rl-course/)
- [arXiv Robotics Papers](https://arxiv.org/list/cs.RO/recent)

**Stay Connected**:

- Course Discord: [Link in syllabus]
- Alumni Network: [Link in syllabus]
- Monthly Office Hours: Every first Tuesday, 3-5 PM

:::tip Final Challenge
Build something amazing! Take your capstone project further:
- Add multi-modal interaction (gesture + voice)
- Deploy on real humanoid hardware (Unitree H1, Agility Digit)
- Contribute to open-source robotics (ROS 2 packages, Isaac Sim extensions)
- Publish your work (GitHub, YouTube, blog posts)

**Share your creations with #PhysicalAITextbook on social media!**
:::

---

## Certificate of Completion

Upon achieving:
- All module quizzes: ≥70% score
- Capstone project: Passing grade

You will receive a **Certificate of Completion** for the Physical AI & Humanoid Robotics Interactive Textbook.

**Request your certificate**: Email your quiz scores and capstone submission to [course email].

---

**Thank you for learning with us! The future of humanoid robotics is in your hands.** 🤖✨
