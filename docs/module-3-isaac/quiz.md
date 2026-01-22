---
title: "Module 3 Quiz: NVIDIA Isaac Ecosystem"
sidebar_label: "Quiz"
sidebar_position: 4
---

# Module 3 Quiz: NVIDIA Isaac Ecosystem

Test your understanding of Isaac Sim, Isaac ROS vSLAM, and Nav2 navigation concepts covered in this module.

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
**What is the primary advantage of Isaac Sim over Gazebo for machine learning applications?**

A) Better ROS 2 integration and easier setup
B) GPU-accelerated physics and native synthetic data generation with RTX ray tracing
C) Lower computational requirements for real-time simulation
D) Support for more robot file formats (URDF, SDF, USD)

<details>
<summary>Show Answer</summary>

**Correct Answer: B) GPU-accelerated physics and native synthetic data generation with RTX ray tracing**

**Explanation**: Isaac Sim leverages NVIDIA RTX for photorealistic rendering and PhysX GPU acceleration for parallel physics simulation (thousands of robots simultaneously). This makes it ideal for generating large-scale synthetic datasets for perception models. Gazebo (option A) actually has more mature ROS 2 integration. Isaac Sim requires powerful GPUs (option C is incorrect). While Isaac Sim supports USD, Gazebo also supports URDF/SDF (option D is not the primary advantage).

</details>

---

### Question 2 (Medium)
**You're generating a synthetic dataset in Isaac Sim for object detection. Which annotation type provides 2D bounding boxes directly?**

A) `semantic_segmentation` with per-pixel class IDs
B) `bounding_box_2d_tight` from SyntheticDataHelper
C) `depth_map` converted to 3D bounding boxes
D) `instance_segmentation` with connected components analysis

<details>
<summary>Show Answer</summary>

**Correct Answer: B) `bounding_box_2d_tight` from SyntheticDataHelper**

**Explanation**: Isaac Sim's `SyntheticDataHelper.get_groundtruth()` provides pre-computed 2D bounding boxes via the `bounding_box_2d_tight` annotator. Option A (semantic segmentation) requires post-processing to extract boxes. Option C (depth maps) provides 3D data but requires projection for 2D boxes. Option D (instance segmentation) also needs post-processing.

</details>

---

### Question 3 (Easy)
**In visual SLAM, what is the purpose of loop closure detection?**

A) Speed up feature matching by reducing the search space
B) Correct accumulated pose drift by recognizing previously visited locations
C) Filter outliers from feature correspondences
D) Optimize camera calibration parameters online

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Correct accumulated pose drift by recognizing previously visited locations**

**Explanation**: Loop closure detects when the robot revisits a known location, enabling global optimization (pose graph adjustment) to reduce drift. Option A describes spatial indexing (e.g., kd-trees), not loop closure. Option C is RANSAC's role. Option D is online calibration, unrelated to loop closure.

</details>

---

### Question 4 (Hard)
**Your Isaac ROS vSLAM node loses tracking in a long, featureless hallway. Which modification is MOST likely to improve robustness?**

A) Increase ORB feature count from 1000 to 5000
B) Switch from stereo to monocular camera mode
C) Add visual texture to the environment (e.g., posters, patterns)
D) Reduce the DBoW2 loop closure threshold for more frequent closures

<details>
<summary>Show Answer</summary>

**Correct Answer: C) Add visual texture to the environment (e.g., posters, patterns)**

**Explanation**: Visual SLAM fails in low-texture environments because feature detectors (ORB, SIFT) require corners/edges. Adding visual texture (posters, floor markers) solves the root cause. Option A helps slightly but doesn't address the fundamental lack of features. Option B (monocular) removes depth information, worsening performance. Option D (lowering loop closure threshold) causes false positives, not improved tracking.

</details>

---

### Question 5 (Medium)
**What is the purpose of the inflation layer in a Nav2 costmap?**

A) Expand the map size to include unexplored regions
B) Add a safety margin around obstacles by assigning increasing costs radially outward
C) Compress costmap data for network transmission
D) Smooth the static map to remove noise from SLAM

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Add a safety margin around obstacles by assigning increasing costs radially outward**

**Explanation**: The inflation layer propagates obstacle costs radially, creating a gradient that penalizes paths near obstacles. This ensures the robot maintains clearance. Option A describes map expansion (not inflation). Option C is unrelated to inflation. Option D is map filtering, not a costmap layer function.

</details>

---

### Question 6 (Medium)
**In Isaac Sim, you want to simulate 500 robot environments in parallel for reinforcement learning. Which parameter enables GPU-parallel physics?**

A) `PhysxSchema.PhysxSceneAPI.CreateEnableGPUDynamicsAttr(True)`
B) Increase `num_envs` in the environment configuration
C) Set `physx.update_simulation_parameters(substeps=500)`
D) Enable `multi_gpu_mode` in Isaac Lab config

<details>
<summary>Show Answer</summary>

**Correct Answer: A) `PhysxSchema.PhysxSceneAPI.CreateEnableGPUDynamicsAttr(True)`**

**Explanation**: This PhysX parameter enables GPU-accelerated physics, allowing parallel simulation of multiple environments. Option B (`num_envs`) specifies the number of environments but doesn't enable GPU mode. Option C (substeps) controls solver iterations, not parallelism. Option D (`multi_gpu_mode`) is not a real Isaac Sim parameter.

</details>

---

### Question 7 (Hard)
**You calibrate a stereo camera and obtain the following translation vector: `T = [0.12, 0.0, 0.0]` (meters). What does this represent?**

A) The camera's position relative to the robot base
B) The baseline (horizontal separation) between left and right cameras (12 cm)
C) The focal length in meters
D) The principal point offset from the image center

<details>
<summary>Show Answer</summary>

**Correct Answer: B) The baseline (horizontal separation) between left and right cameras (12 cm)**

**Explanation**: In stereo calibration, the translation vector `T` describes the right camera's position relative to the left camera. A value of `[0.12, 0, 0]` indicates 12 cm horizontal separation (typical for stereo rigs). Option A describes extrinsic calibration (camera-to-robot). Options C and D are intrinsic parameters (focal length and principal point).

</details>

---

### Question 8 (Easy)
**Which Nav2 component is responsible for executing recovery behaviors like "spin in place" or "back up"?**

A) Planner Server
B) Controller Server
C) Recovery Server
D) Behavior Tree Executor

<details>
<summary>Show Answer</summary>

**Correct Answer: C) Recovery Server**

**Explanation**: The Recovery Server manages recovery behaviors (rotate, backup, wait). The Behavior Tree Executor (option D) coordinates all components but doesn't directly execute recoveries. The Planner Server (option A) computes paths, and the Controller Server (option B) tracks paths.

</details>

---

### Question 9 (Hard)
**Your DWB local planner generates jerky, oscillating motion. Which parameter adjustment is MOST effective?**

A) Increase `vx_samples` from 20 to 50 for finer velocity discretization
B) Increase `sim_time` from 1.7 to 3.0 seconds for longer look-ahead
C) Enable `velocity_smoother` plugin with acceleration limits
D) Reduce `cost_scaling_factor` in the inflation layer

<details>
<summary>Show Answer</summary>

**Correct Answer: C) Enable `velocity_smoother` plugin with acceleration limits**

**Explanation**: Oscillation is often caused by discontinuous velocity commands. The `velocity_smoother` enforces acceleration limits, creating smooth transitions. Option A (more samples) improves path quality but doesn't address jerk. Option B (longer sim_time) can worsen oscillation by overreacting to distant obstacles. Option D (cost scaling) affects path choice, not motion smoothness.

</details>

---

### Question 10 (Medium)
**In Isaac ROS vSLAM, which ROS 2 message type is published at the highest frequency (30 Hz)?**

A) `/visual_slam/tracking/slam_path` (full trajectory)
B) `/visual_slam/tracking/odometry` (local frame-to-frame motion)
C) `/visual_slam/tracking/vo_pose` (globally optimized pose)
D) `/visual_slam/vis/landmarks_cloud` (map points)

<details>
<summary>Show Answer</summary>

**Correct Answer: B) `/visual_slam/tracking/odometry` (local frame-to-frame motion)**

**Explanation**: Visual odometry (VO) provides high-frequency pose estimates (30 Hz) for real-time control. Option C (`vo_pose`, globally optimized) updates slower (10 Hz) after loop closure. Options A and D (trajectory and landmarks) update even less frequently for visualization.

</details>

---

## Scoring Guide

- **9-10 correct**: Excellent! You have mastered Isaac Sim, vSLAM, and Nav2 concepts.
- **7-8 correct**: Good understanding. Review questions you missed, focusing on costmap configuration and vSLAM failure modes.
- **5-6 correct**: Adequate foundation. Re-read sections on GPU acceleration (Isaac Sim) and behavior trees (Nav2).
- **Below 5**: Revisit Module 3 lessons, focusing on hands-on exercises with Isaac Sim and Nav2.

---

## Key Takeaways

If you struggled with specific topics, review these sections:

- **Isaac Sim Fundamentals**: [Isaac Sim Platform Lesson](./isaac-sim-platform.md) — Sections 1-3
- **Visual SLAM**: [Isaac ROS vSLAM Lesson](./isaac-ros-vslam.md) — Sections 2-4
- **Navigation**: [Nav2 Path Planning Lesson](./nav2-path-planning.md) — Sections 2-4
- **Sensor Fusion**: [Isaac ROS vSLAM Lesson](./isaac-ros-vslam.md) — Section 5

---

## Next Module

Ready to advance? Proceed to [Module 4: Vision-Language-Action Models](../module-4-vla/voice-to-action-systems.md) to explore natural language interfaces for robot control.

:::tip Hands-On Challenge
Before moving on, complete this exercise:

1. Set up Isaac Sim and generate 100 synthetic images with bounding box annotations
2. Run Isaac ROS vSLAM on a recorded ROS 2 bag file and visualize the trajectory in RViz
3. Configure Nav2 for a simulated humanoid and navigate through a 10-obstacle course
4. Tune costmap inflation and observe the effect on path selection

Share your results and configurations in the course discussion forum!
:::
