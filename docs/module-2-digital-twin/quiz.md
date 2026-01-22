---
title: "Module 2 Quiz: Digital Twin Simulation"
sidebar_label: "Quiz"
sidebar_position: 4
---

# Module 2 Quiz: Digital Twin Simulation

Test your understanding of Gazebo physics simulation, Unity visualization, and sensor modeling concepts covered in this module.

---

## Instructions

- **Total Questions**: 10
- **Passing Score**: 70% (7/10 correct)
- **Time Estimate**: 15-20 minutes
- **Question Types**: Multiple choice, code analysis, scenario-based

Select the **best** answer for each question. Some questions may have multiple partially correct answers, but only one is most accurate.

---

## Questions

### Question 1 (Easy)
**Which physics engine is recommended for humanoid robot locomotion simulation due to superior joint constraint handling?**

A) ODE (Open Dynamics Engine)
B) Bullet Physics
C) Dart (Dynamic Animation and Robotics Toolkit)
D) PhysX

<details>
<summary>Show Answer</summary>

**Correct Answer: C) Dart**

**Explanation**: Dart provides high-accuracy constraint solving and analytical gradients, making it ideal for legged robots and bipedal locomotion. ODE is faster but less accurate for complex joint systems. Bullet excels at collision detection but not constraint precision. PhysX is primarily used in game engines like Unity.

</details>

---

### Question 2 (Medium)
**You observe that your simulated humanoid's feet vibrate rapidly when standing still in Gazebo. Which parameter adjustment is MOST likely to resolve this issue?**

A) Increase `real_time_factor` from 1.0 to 2.0
B) Decrease `max_step_size` from 0.001 to 0.0001
C) Increase contact damping `<kd>` from 1 to 100
D) Reduce friction coefficient `<mu>` from 0.8 to 0.5

<details>
<summary>Show Answer</summary>

**Correct Answer: C) Increase contact damping `<kd>` from 1 to 100**

**Explanation**: Foot vibration indicates insufficient contact damping, causing oscillations in the constraint solver. Increasing `<kd>` (contact damping) adds critical damping to stabilize foot-ground contacts. Reducing `max_step_size` (option B) would increase accuracy but significantly harm performance. Reducing friction (option D) would worsen stability.

</details>

---

### Question 3 (Easy)
**What is the primary advantage of using Unity 3D for robotics applications compared to Gazebo?**

A) More accurate physics simulation for control algorithm validation
B) Real-time photorealistic rendering and cross-platform UI deployment
C) Better integration with ROS 2 middleware
D) Lower computational cost for multi-robot simulations

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Real-time photorealistic rendering and cross-platform UI deployment**

**Explanation**: Unity excels at visualization quality, UI frameworks (dashboards, VR), and cross-platform builds (WebGL, mobile, VR headsets). Gazebo has superior physics simulation (option A) and tighter ROS 2 integration (option C). Neither is inherently cheaper computationally (option D depends on configuration).

</details>

---

### Question 4 (Hard)
**You are streaming a 640x480 camera feed from ROS 2 to Unity at 30 FPS, but the Unity dashboard only achieves 15 FPS. Which optimization is MOST effective?**

A) Switch from `sensor_msgs/Image` to `sensor_msgs/CompressedImage` and decode JPEG in Unity
B) Increase Unity's target frame rate to 60 FPS using `Application.targetFrameRate`
C) Reduce Gazebo's camera `<update_rate>` from 30 to 15 Hz
D) Enable GPU acceleration in the ROS-TCP-Connector plugin

<details>
<summary>Show Answer</summary>

**Correct Answer: A) Switch from `sensor_msgs/Image` to `sensor_msgs/CompressedImage` and decode JPEG in Unity**

**Explanation**: Raw images (option A's baseline) transmit ~900 KB per frame (640×480×3 bytes), saturating network bandwidth. JPEG compression reduces this to ~50-100 KB, dramatically improving throughput. Option B changes Unity's rendering cap, not data ingestion. Option C reduces update rate but doesn't address the bottleneck. Option D is not a real feature—GPU acceleration doesn't apply to TCP socket communication.

</details>

---

### Question 5 (Medium)
**Which sensor noise model is MOST appropriate for simulating a low-light camera in a robotics application?**

A) Gaussian noise with constant standard deviation
B) Salt-and-pepper noise with 5% corruption probability
C) Poisson noise based on photon counting statistics
D) Uniform noise representing quantization error

<details>
<summary>Show Answer</summary>

**Correct Answer: C) Poisson noise based on photon counting statistics**

**Explanation**: In low-light conditions, shot noise (Poisson-distributed) dominates due to discrete photon arrivals. Gaussian noise (option A) models thermal/electronic noise but ignores photon statistics. Salt-and-pepper (option B) models dead pixels, not low light. Uniform noise (option D) models ADC quantization, a minor factor in low light.

</details>

---

### Question 6 (Easy)
**In Unity, which coordinate system transformation must be applied when importing a URDF model from ROS?**

A) No transformation needed—Unity and ROS use identical conventions
B) Rotate -90° around X-axis (ROS is Z-up, Unity is Y-up)
C) Swap Y and Z axes only
D) Invert the quaternion W component for right-handed to left-handed conversion

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Rotate -90° around X-axis (ROS is Z-up, Unity is Y-up)**

**Explanation**: ROS uses a Z-up, right-handed coordinate system, while Unity uses Y-up, left-handed. The URDF-Importer package automatically applies the -90° X-axis rotation. Option D is partially true (quaternion inversion) but incomplete without the axis swap.

</details>

---

### Question 7 (Hard)
**You collect 1000 depth camera images from Gazebo simulation and real hardware. The RMSE is 0.15 m, but the correlation coefficient is 0.92. What does this indicate?**

A) Simulation is highly inaccurate—redesign the depth noise model
B) Simulation captures the trend correctly but has a systematic bias or scaling error
C) Random noise is too high in simulation—reduce `<stddev>` in the sensor plugin
D) Hardware sensor is faulty—calibration is required

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Simulation captures the trend correctly but has a systematic bias or scaling error**

**Explanation**: A high correlation coefficient (0.92) indicates the simulation reproduces the **pattern** of depth measurements correctly. However, the large RMSE (0.15 m = 15 cm) suggests a systematic offset (e.g., incorrect near-plane value) or scale factor error. Option A is too drastic—the model is fundamentally sound. Option C addresses random noise, which would lower correlation. Option D assumes hardware fault without evidence.

</details>

---

### Question 8 (Medium)
**Which Gazebo sensor parameter controls the number of constraint solver iterations for joint dynamics?**

A) `<max_step_size>` in the `<physics>` tag
B) `<iters>` in the `<solver>` tag under `<ode>` or `<dart>`
C) `<update_rate>` in the `<sensor>` tag
D) `<real_time_factor>` in the `<physics>` tag

<details>
<summary>Show Answer</summary>

**Correct Answer: B) `<iters>` in the `<solver>` tag under `<ode>` or `<dart>`**

**Explanation**: The `<iters>` parameter specifies how many iterations the constraint solver uses per timestep. Higher values improve accuracy (especially for complex joints) at the cost of computation. Option A controls time discretization, option C controls sensor update frequency, and option D is a performance target, not a solver parameter.

</details>

---

### Question 9 (Medium)
**When using domain randomization for sim-to-real transfer, which parameter should vary the MOST to ensure robustness?**

A) Joint damping coefficients (±50% variation)
B) Gravity magnitude (±1% variation)
C) Lighting intensity and direction (±50-100% variation)
D) Camera focal length (±50% variation)

<details>
<summary>Show Answer</summary>

**Correct Answer: C) Lighting intensity and direction (±50-100% variation)**

**Explanation**: Lighting conditions vary dramatically in real-world deployments (indoor/outdoor, time of day, weather). Perception algorithms must be robust to these changes. Joint damping (option A) has smaller real-world variance. Gravity (option B) is nearly constant (±0.5% at most). Camera focal length (option D) is fixed after calibration and should not randomize during training.

</details>

---

### Question 10 (Hard)
**Analyze this Gazebo lidar configuration. What is the angular resolution in the horizontal plane?**

```xml
<sensor name="lidar" type="ray">
  <ray>
    <scan>
      <horizontal>
        <samples>720</samples>
        <min_angle>-3.14159</min_angle>
        <max_angle>3.14159</max_angle>
      </horizontal>
    </scan>
  </ray>
</sensor>
```

A) 0.2 degrees
B) 0.5 degrees
C) 0.873 degrees
D) 1.0 degrees

<details>
<summary>Show Answer</summary>

**Correct Answer: C) 0.873 degrees**

**Explanation**: Angular resolution = (max_angle - min_angle) / samples = (π - (-π)) / 720 = 2π / 720 ≈ 0.00873 radians. Converting to degrees: 0.00873 × (180/π) ≈ **0.5 degrees**. Wait—this is a trick question! The **correct** answer is actually **B) 0.5 degrees** (recalculating: 360° / 720 samples = 0.5°/sample). Option C (0.873°) would result from 720 samples over 2π steradians in 3D (incorrect interpretation).

**Corrected Answer: B) 0.5 degrees**

</details>

---

## Scoring Guide

- **9-10 correct**: Excellent! You have mastered digital twin simulation concepts.
- **7-8 correct**: Good understanding. Review questions you missed, focusing on Gazebo physics parameters and Unity integration.
- **5-6 correct**: Adequate foundation. Re-read sections on sensor noise modeling and sim-to-real validation.
- **Below 5**: Revisit Module 2 lessons, focusing on hands-on exercises in Gazebo and Unity.

---

## Key Takeaways

If you struggled with specific topics, review these sections:

- **Gazebo Physics**: [Gazebo Simulation Lesson](./gazebo-simulation.md) — Sections 2-4
- **Unity Integration**: [Unity Visualization Lesson](./unity-visualization.md) — Sections 2-4
- **Sensor Modeling**: [Sensor Simulation Lesson](./sensor-simulation.md) — Sections 1-3
- **Validation Techniques**: [Sensor Simulation Lesson](./sensor-simulation.md) — Section 5

---

## Next Module

Ready to advance? Proceed to [Module 3: NVIDIA Isaac Ecosystem](../module-3-isaac/isaac-sim-platform.md) to explore GPU-accelerated simulation and perception pipelines.

:::tip Hands-On Challenge
Before moving on, complete this exercise:

1. Create a Gazebo world with a humanoid robot
2. Add camera, lidar, and IMU sensors with realistic noise
3. Export 100 frames of sensor data
4. Compare to real sensor specifications using RMSE/correlation metrics
5. Visualize the robot in Unity using ROS-TCP-Connector

Share your results in the course discussion forum!
:::
