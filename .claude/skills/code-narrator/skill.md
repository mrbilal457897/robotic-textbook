# Code Narrator Skill

**name:** code-narrator
**description:** Explains code step-by-step in human-friendly language, connecting code logic to robotics concepts and design decisions.

---

## Skill Overview

The Code Narrator skill transforms raw code into engaging, accessible explanations. It narrates code line-by-line, clarifies decision rationale, and bridges technical implementation to robotics principles. This skill ensures code examples in the textbook are understandable to students at all levels without redundant or inaccurate commentary.

**Primary Use:** After adding code examples to lesson modules to create accessible, concept-linked explanations.

---

## When to Use This Skill

- **After adding code examples** to lessons (ROS 2 nodes, Gazebo controllers, Isaac Sim scripts, sensor fusion pipelines)
- **When code complexity** warrants line-by-line narration
- **For teaching moments** where the "why" matters more than the "what"
- **When connecting code** to robotics principles, algorithms, or simulation concepts
- **Before publishing** code-heavy sections to ensure clarity

**Do NOT use this skill for:**
- Simple one-liners or trivial variable assignments
- Code already explained in adjacent text
- API reference documentation (use inline comments instead)
- Pseudocode that isn't actual executable code

---

## Workflow: Code Narration in 5 Phases

### Phase 1: Code Analysis & Audience Modeling

**Objective:** Understand the code structure and tailor narration to student comprehension level.

**Steps:**

1. **Read the complete code block** and map control flow (function calls, loops, conditionals, state transitions).
2. **Identify code sections** that advance understanding:
   - Critical decision points (conditionals, algorithm choices)
   - Non-obvious patterns (callbacks, threading, message passing)
   - Robotics-specific abstractions (ROS topics/services, sensor models, physics)
3. **Model your audience:**
   - Beginner: Explain every meaningful line; connect to foundational concepts
   - Intermediate: Explain "why" for non-standard choices; assume basic ROS/Python knowledge
   - Advanced: Focus on design rationale, performance implications, corner cases
4. **Identify redundancy traps:**
   - Don't re-explain built-in functions (e.g., `np.array()` if already taught)
   - Don't narrate obvious variable assignments (`x = 1`)
   - Don't repeat the same concept across consecutive lines

**Acceptance Check:**
- ✅ Control flow is fully mapped
- ✅ Audience level matches textbook context
- ✅ Redundancy risks are identified
- ✅ Code behavior is understood accurately

---

### Phase 2: Concept & Rationale Mapping

**Objective:** Define the "why" before writing narration—connect code decisions to robotics principles.

**Steps:**

1. **Extract core concepts** this code teaches:
   - Algorithm concept (e.g., PID control, Kalman filtering, inverse kinematics)
   - Robotics principle (e.g., sensor fusion, asynchronous communication, simulation physics)
   - System design pattern (e.g., pub/sub, state machine, request/response)

2. **Document design decisions and their rationale:**
   - Why this ROS 2 pattern? (e.g., pub/sub for decoupling, services for synchronous calls)
   - Why this parameter choice? (e.g., filter bandwidth, update frequency, coordinate frame)
   - Why this data structure? (e.g., numpy arrays for vectorization, deques for fixed-size buffers)

3. **Note performance/safety implications:**
   - Execution speed (real-time constraints, update rates)
   - Memory usage (array sizes, buffer lifetimes)
   - Robustness (error handling, timeout behavior)

4. **Plan narration depth:**
   - Highlight 1–3 "teachable moments" per code block
   - Reserve detailed explanation for non-obvious lines
   - Plan transitions between concepts

**Acceptance Check:**
- ✅ Core concepts identified and valid
- ✅ Design decisions are documented with clear rationale
- ✅ Robotics principles are mapped to code constructs
- ✅ Narration depth is appropriate to audience

---

### Phase 3: Narration Drafting & Code Linking

**Objective:** Write clear, concept-connected explanations linked directly to code.

**Steps:**

1. **Introduce the code block** (1–2 sentences):
   - State the purpose (what problem does this code solve?)
   - Note the robotics concept (algorithm, system pattern, simulation feature)
   - Example: "This ROS 2 node publishes joint commands to a humanoid robot's arm controller. It demonstrates the **publisher-subscriber pattern** for asynchronous, decoupled communication."

2. **Narrate line-by-line:**
   - For each meaningful line, explain **what it does** and **why**
   - Link to robotics concepts: "We use a `geometry_msgs/Twist` message because it's the standard ROS representation for 3D velocities."
   - Skip obvious lines (e.g., `import os` doesn't need explanation)
   - Use code references: `line:1:23` to pinpoint the exact location

3. **Explain control flow:**
   - Describe loop iterations and when code runs (e.g., "This callback executes every time a new sensor message arrives")
   - Clarify conditionals: "If the error exceeds the threshold, we trigger an emergency stop to protect the hardware"

4. **Highlight non-obvious patterns:**
   - Callbacks in ROS (asynchronous execution)
   - Array broadcasting in NumPy (performance optimization)
   - Message queuing (managing latency and data freshness)

5. **Connect to robotics principles:**
   - Algorithm: "This implements a proportional-integral-derivative (PID) controller, a fundamental control algorithm used in robotics for smooth motion"
   - Simulation: "In Gazebo, the physics engine solves these forces at 1000 Hz; our node updates control inputs at 100 Hz"
   - Sensor fusion: "This Kalman filter combines accelerometer (high-frequency noise) and gyroscope (low-frequency drift) to estimate orientation"

6. **Avoid redundancy:**
   - Don't re-explain ROS concepts if already covered earlier in the module
   - Reference earlier sections: "As discussed in Section 3.2, ROS topics are publish-subscribe channels..."
   - Group similar lines: "Lines 15–18 initialize all joint names and home positions"

**Acceptance Check:**
- ✅ Introduction states purpose and robotics concept
- ✅ All meaningful lines have code references (`file:line:end`)
- ✅ "Why" is explained for non-obvious decisions
- ✅ Control flow is clear (loops, callbacks, conditionals)
- ✅ Robotics principles are explicitly named and connected
- ✅ No redundant re-explanation of prior concepts

---

### Phase 4: Code Behavior Verification

**Objective:** Ensure narration matches the actual code behavior exactly.

**Steps:**

1. **Trace execution mentally:**
   - Start with function entry
   - Follow variable assignments and updates
   - Predict output/side effects
   - Note state changes (published messages, written files, modified globals)

2. **Verify types and values:**
   - Confirm data types match (e.g., `np.float32` vs. Python `float`)
   - Check array shapes (e.g., 3×1 vs. 1×3 vectors)
   - Validate enum/constant values (ROS quality-of-service levels, message types)

3. **Test edge cases mentally:**
   - What happens with zero/negative inputs?
   - What happens on the first iteration vs. subsequent ones?
   - What happens if a message is never received (timeout)?

4. **Cross-reference actual code:**
   - Re-read the code line-by-line
   - Confirm no steps are skipped in narration
   - Verify parameter values match the actual code (e.g., "frequency: 10 Hz" matches `rate = rospy.Rate(10)`)

5. **Validate robotics correctness:**
   - PID gains reasonable for the use case?
   - Filter parameters (cutoff frequency, damping ratio) physically meaningful?
   - Coordinate frame transformations (TF2) correct?
   - Message fields populated correctly?

**Acceptance Check:**
- ✅ Narration matches code behavior exactly (no invented steps)
- ✅ All variable types and values are accurate
- ✅ Edge cases are acknowledged if relevant
- ✅ Robotics calculations (PID, filters, transforms) are correct
- ✅ No implied behavior not present in the code

---

### Phase 5: Readability & Educational Impact

**Objective:** Ensure narration is clear, engaging, and educationally effective.

**Steps:**

1. **Review for clarity:**
   - Sentence structure: Short, active voice ("The filter combines...") not passive ("Combining is done...")
   - Jargon: Define robotics terms on first mention ("Kalman filter, a probabilistic algorithm for state estimation")
   - Analogies: Use familiar concepts (e.g., "Like an autopilot in an airplane, the controller adjusts continuously")

2. **Check narrative flow:**
   - Does explanation progress logically (setup → main logic → output)?
   - Are transitions smooth? ("Now that the message is decoded, we apply...")
   - Does it build on prior lessons?

3. **Optimize for learning:**
   - Highlight teachable moments: "Notice how we clip the command to ±100? This **safety constraint** prevents unrealistic accelerations that could damage the robot."
   - Use emphasis sparingly for key concepts
   - Include why-nots: "We don't sleep here; the callback is triggered by the message arrival, not a timer"

4. **Validate accessibility:**
   - Is robotics jargon explained or linked to glossary?
   - Are variable names self-explanatory (or do they map to domain terms)?
   - Can a beginner follow the logic without external references?

5. **Test against redundancy list:**
   - Cross-reference earlier modules to avoid re-explaining
   - Flag assumptions (e.g., "Assumes familiarity with ROS 2 publishers")

**Acceptance Check:**
- ✅ Narration is clear and uses active voice
- ✅ Robotics terms are defined or linked
- ✅ Narrative flows logically and builds on prior lessons
- ✅ Teachable moments are highlighted
- ✅ Accessibility level matches target audience
- ✅ No redundancy with earlier module sections

---

## Code-Linked Narration: Real Examples

### Example 1: ROS 2 Publisher Node for Joint Commands

**Code:**
```python
# file: joint_commander.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState

class JointCommanderNode(Node):  # line 5
    def __init__(self):
        super().__init__('joint_commander')  # line 7

        self.publisher = self.create_publisher(  # line 9
            JointState,
            'joint_commands',
            qos_profile=rclpy.qos.QoSProfile(depth=10)
        )

        self.timer = self.create_timer(  # line 15
            0.1,  # 10 Hz update frequency
            self.publish_commands
        )

    def publish_commands(self):  # line 19
        msg = JointState()  # line 20
        msg.name = ['shoulder_pan', 'shoulder_lift', 'elbow_flex']
        msg.position = [0.5, 1.2, 0.8]  # radians
        msg.velocity = [0.1, 0.1, 0.0]  # rad/s

        self.publisher.publish(msg)  # line 25
        self.get_logger().info(f"Published: {msg.position}")

def main():
    rclpy.init()
    node = JointCommanderNode()
    rclpy.spin(node)

if __name__ == '__main__':
    main()
```

**Narration:**

**Introduction:**
This ROS 2 node publishes joint commands to a humanoid robot's arm. It demonstrates the **publisher-subscriber pattern**, where the node decouples command generation from consumers (the arm controller). Instead of directly calling the controller, the node sends messages via a ROS topic, enabling independent operation and testing.

**Detailed Explanation:**

- **Line 7 (`super().__init__('joint_commander')`):**
  Initializes the ROS 2 node with name `'joint_commander'`. This name identifies the node in the ROS 2 network graph; other nodes can address messages to this node or discover its topics.

- **Lines 9–13 (`self.create_publisher(...)`):**
  Creates a publisher for the `JointState` message type on the topic `'joint_commands'`. Why `JointState`? It's the standard ROS representation for multi-joint configurations, containing arrays of names, positions, velocities, and efforts. The `qos_profile=depth(10)` parameter sets the **Quality of Service** to keep a history of the last 10 messages—useful if a subscriber connects after publication. This is a key ROS 2 feature: publishers and subscribers don't need to know about each other; the middleware handles message delivery.

- **Lines 15–17 (`self.create_timer(...)`):**
  Creates a timer that calls `publish_commands()` every 0.1 seconds (10 Hz). Why 10 Hz? This is a common control frequency for humanoid arm commands—fast enough to track smoothly (100 ms latency is acceptable for non-real-time motion planning), but slow enough to avoid network congestion. This frequency choice balances responsiveness with communication efficiency.

- **Line 20 (`msg = JointState()`):**
  Constructs a new `JointState` message. We create a fresh message each iteration to avoid stale data or accumulation bugs.

- **Lines 21–23 (Field assignment):**
  Populates the message fields:
  - `name`: Joint identifiers (must match the robot's URDF joint names)
  - `position`: Target angles in radians (0.5 rad ≈ 28.6°)
  - `velocity`: Target velocities (0.1 rad/s is slow, safe motion)

  Robotics principle: These are **setpoints**—desired values. The arm controller will read these and adjust motor torques to track them.

- **Line 25 (`self.publisher.publish(msg)`):**
  Sends the message to all subscribers on `'joint_commands'`. In ROS 2, publishing is **asynchronous** and **non-blocking**; the node doesn't wait for subscribers to receive it. This is essential for decoupling and scalability.

- **Line 26 (`self.get_logger().info(...)`):**
  Logs the published position for debugging. Logging is useful in development; in production, it can be disabled to reduce I/O overhead.

**Why This Pattern?**
Decoupling command generation from execution allows:
1. The commander to run on a laptop (or another robot)
2. The arm controller to run on the robot's embedded system
3. Easy testing: mock publishers/subscribers can inject test data
4. Modularity: add new subscribers (logging, planning, visualization) without modifying the commander

**Connection to Robotics Concepts:**
- **Asynchronous communication:** The command node doesn't block waiting for the arm to move; it publishes and continues
- **Message standards:** Using `JointState` ensures compatibility with ROS tools (visualization, monitoring, other controllers)
- **Control rate:** 10 Hz is typical for trajectory tracking; higher rates (100 Hz+) are reserved for low-level motor control

---

### Example 2: Kalman Filter for Sensor Fusion

**Code:**
```python
# file: sensor_fusion.py
import numpy as np
from scipy.linalg import block_diag

class KalmanFilter1D:  # line 5
    def __init__(self, process_variance, measurement_variance):
        self.Q = process_variance  # Process noise covariance (line 7)
        self.R = measurement_variance  # Measurement noise covariance (line 8)
        self.x = 0.0  # Estimated state (line 9)
        self.P = 1.0  # Estimation error covariance (line 10)

    def predict(self, dt):  # line 12
        # State transition: x_{k|k-1} = x_{k-1|k-1} (constant velocity model)
        self.x = self.x  # State unchanged for constant-velocity (line 14)
        self.P = self.P + self.Q  # line 15: Increase uncertainty due to process noise

    def update(self, measurement):  # line 17
        # Kalman gain: how much to trust the measurement
        K = self.P / (self.P + self.R)  # line 19

        # Innovation: prediction error
        innovation = measurement - self.x  # line 22

        # Update state estimate
        self.x = self.x + K * innovation  # line 25

        # Update error covariance
        self.P = (1 - K) * self.P  # line 28

def estimate_imu_orientation(accel, gyro, accel_variance, gyro_variance):
    filter = KalmanFilter1D(  # line 31
        process_variance=0.001,  # Gyro drift (line 32)
        measurement_variance=0.1  # Accelerometer noise (line 33)
    )

    for step in range(100):  # line 35
        filter.predict(dt=0.01)
        filter.update(measurement=accel[step])

    return filter.x  # line 39

if __name__ == '__main__':
    accel_readings = np.random.normal(loc=9.81, scale=0.5, size=100)
    gyro_readings = np.random.normal(loc=0.0, scale=0.1, size=100)

    orientation = estimate_imu_orientation(
        accel_readings, gyro_readings,
        accel_variance=0.5, gyro_variance=0.1
    )
    print(f"Estimated orientation: {orientation:.3f} m/s²")
```

**Narration:**

**Introduction:**
This code implements a 1D Kalman filter for **sensor fusion**—combining noisy measurements from multiple sources (accelerometer and gyroscope) into a single, more accurate estimate. The Kalman filter is foundational in robotics for orientation tracking, position estimation, and state inference. It solves a core problem: how to optimally blend noisy sensor data when we know the noise characteristics.

**Detailed Explanation:**

- **Lines 7–8 (Noise covariances):**
  `Q` (process variance) represents how much we expect the system to drift between measurements (e.g., gyro bias drift). `R` (measurement variance) represents sensor noise magnitude. Why do we specify both? Because the filter's behavior depends on their ratio. If `R` is very small, the filter trusts measurements heavily; if `Q` is very small, it trusts the prediction. Tuning these is crucial for real robots.

- **Lines 9–10 (Initial state and covariance):**
  `x = 0.0` is our initial estimate (e.g., no tilt). `P = 1.0` is the initial uncertainty—we have low confidence in the estimate. As the filter runs, `P` shrinks (uncertainty decreases) as measurements provide evidence.

- **Line 15 (`self.P = self.P + self.Q`):**
  The **predict step** increases uncertainty because time passes and the system can drift. Why? Without new measurements, our estimate gets stale. `Q` quantifies expected drift; adding it accounts for the passage of time. This is why Kalman filters work best with frequent measurements—the longer the gap, the larger the uncertainty grows.

- **Line 19 (`K = self.P / (self.P + self.R)`):**
  This is the **Kalman gain**, the magic formula. It determines how much to weight the new measurement:
  - If `P` is large (high uncertainty), `K` approaches 1, trusting the measurement
  - If `P` is small (low certainty) and `R` is large (noisy sensor), `K` approaches 0, favoring the prediction

  Robotics principle: This is **optimal** in a probabilistic sense; it minimizes expected error variance.

- **Line 22 (`innovation = measurement - self.x`):**
  The innovation is the **prediction error**—how much the measurement surprised us. A large innovation might indicate sensor malfunction or sudden system change; algorithms using Kalman filters often flag large innovations for anomaly detection.

- **Line 25 (`self.x = self.x + K * innovation`):**
  The **update step**: we shift our estimate toward the measurement, scaled by Kalman gain `K`. This is the fusion point—blending prediction (prior) and measurement (likelihood).

- **Line 28 (`self.P = (1 - K) * self.P`):**
  The **covariance update**: uncertainty shrinks proportionally to gain. If we trust the measurement (high `K`), we reduce uncertainty significantly. This feedback loop is self-regulating: as data accumulates, we become more confident.

**Why This Pattern?**
The Kalman filter is optimal for linear systems with Gaussian noise. Variants (Extended Kalman Filter, Unscented Kalman Filter) handle nonlinear systems like rotations and robot dynamics.

**Connection to Robotics Concepts:**
- **Sensor fusion:** Accelerometers drift (integration bias) but are responsive; gyroscopes are stable but drift. The Kalman filter combines both optimally
- **Real-time estimation:** The filter runs in O(1) time, enabling real-time onboard estimation
- **Uncertainty quantification:** `P` is a rigorous measure of confidence, used by planning algorithms (e.g., to decide whether to move or request recalibration)

---

### Example 3: PID Control for Joint Tracking

**Code:**
```python
# file: pid_controller.py
import time

class PIDController:  # line 4
    def __init__(self, Kp, Ki, Kd, dt):
        self.Kp = Kp  # Proportional gain (line 6)
        self.Ki = Ki  # Integral gain (line 7)
        self.Kd = Kd  # Derivative gain (line 8)
        self.dt = dt  # Time step (line 9)

        self.integral = 0.0  # Accumulator for integral term (line 11)
        self.prev_error = 0.0  # Previous error for derivative (line 12)

    def compute(self, setpoint, current_state):  # line 14
        error = setpoint - current_state  # line 15: How far from target?

        # Proportional term: immediate response to error
        P = self.Kp * error  # line 18

        # Integral term: accumulate steady-state error
        self.integral += error * self.dt  # line 21
        self.integral = np.clip(self.integral, -1.0, 1.0)  # line 22: Anti-windup
        I = self.Ki * self.integral

        # Derivative term: dampen oscillation
        derivative = (error - self.prev_error) / self.dt  # line 26
        D = self.Kd * derivative

        # Command: sum of three terms
        command = P + I + D  # line 29
        command = np.clip(command, -100, 100)  # line 30: Saturation

        # Update state for next iteration
        self.prev_error = error  # line 33

        return command  # line 35

def track_joint_trajectory(target_angles, control_rate=100):  # line 37
    controller = PIDController(Kp=10.0, Ki=0.5, Kd=2.0, dt=1/control_rate)  # line 38
    commands = []

    simulated_position = 0.0  # line 40: Assume we start at zero

    for target in target_angles:  # line 42: For each setpoint
        command = controller.compute(target, simulated_position)  # line 43
        commands.append(command)

        # Simple first-order dynamics: position += velocity * dt
        simulated_position += (command / 100) * (1 / control_rate)  # line 46

    return np.array(commands)
```

**Narration:**

**Introduction:**
This code implements a **PID (Proportional-Integral-Derivative) controller**, the workhorse of robotics motion control. PID controllers convert a desired angle (setpoint) and current angle (feedback) into motor commands. They're used everywhere: humanoid joint control, drone altitude, robot manipulator positioning. Understanding PID is essential for robotics.

**Detailed Explanation:**

- **Lines 6–8 (Gain parameters):**
  `Kp`, `Ki`, `Kd` are tuning parameters that determine controller behavior:
  - `Kp` (proportional): Larger → faster response, but risks overshoot and instability
  - `Ki` (integral): Eliminates steady-state error (e.g., friction bias), but can cause slow oscillation if too large
  - `Kd` (derivative): Dampens overshoot, providing stability, but amplifies measurement noise

  Tuning these gains is a blend of theory and empirical testing. Typical humanoid arm joints use `Kp ≈ 10–100`, `Ki ≈ 0.1–1.0`, `Kd ≈ 1–5`.

- **Line 15 (`error = setpoint - current_state`):**
  The **control error** is how far the current state is from the goal. Positive error means we're below target (need to move up); negative means we're above. Everything else flows from this error.

- **Line 18 (`P = self.Kp * error`):**
  The **proportional term** scales with error magnitude. It's the instantaneous correction. Robotics principle: in the absence of `Ki` and `Kd`, the system would oscillate around the setpoint because `P` produces overshoot.

- **Line 21 (`self.integral += error * self.dt`):**
  The **integral term** accumulates error over time. Why? If there's persistent error (e.g., motor friction prevents reaching the target with `P` alone), the integral builds up, eventually providing enough command to overcome it. This eliminates **steady-state error**.

- **Line 22 (`self.integral = np.clip(...)`):**
  **Anti-windup protection**: we cap the integral to prevent unbounded growth. Without this, if the system saturates (motor at max speed), the integral would keep climbing, causing overshoot when saturation ends. Clamping the integral prevents this pathological behavior.

- **Line 26 (`derivative = (error - self.prev_error) / self.dt`):**
  The **derivative term** estimates the rate of change of error. If error is decreasing rapidly, the derivative is negative, reducing the command (avoiding overshoot). If error is increasing, the derivative is positive, boosting the command. Robotics principle: derivative acts as a **damper**, smoothing motion and suppressing oscillation.

- **Line 29 (`command = P + I + D`):**
  The **control law**: sum the three contributions to get the final command. This linear combination is simple yet powerful; it stabilizes a wide class of systems.

- **Line 30 (`command = np.clip(command, -100, 100)`):**
  **Output saturation**: motors have physical limits. We clip the command to ±100 (arbitrary units here, could be velocity in rad/s or torque in N⋅m). Exceeding limits serves no purpose and wastes energy.

- **Lines 42–46 (Simulation loop):**
  For each target angle, we:
  1. Compute the control command
  2. Apply it to (simulated) plant dynamics
  3. Observe the new position
  4. Repeat next iteration with updated feedback

  This closed-loop cycle is the essence of feedback control.

**Why This Pattern?**
PID is widely used because:
- Tuning is empirical; engineers can adjust gains without deep theory
- It handles model uncertainty (doesn't assume an accurate system model)
- It's computationally cheap (O(1) per sample)

**Connection to Robotics Concepts:**
- **Feedback control:** Without feedback, an open-loop command has no guarantee of reaching the target (disturbances, model error)
- **Stability and performance tradeoffs:** Higher `Kp` is faster but riskier; lower `Kp` is sluggish but safer. Real tuning balances these
- **Frequency response:** The PID parameters shape how the system responds to different disturbance frequencies. This is why control engineers use Bode plots and root-locus analysis

---

## Tools & Resources

### Code Analysis Tools

1. **Python AST (Abstract Syntax Tree):** Parse and analyze Python code structure
   - Identify functions, classes, control flow
   - Map variable scope and data dependencies
   - Tool: `import ast; tree = ast.parse(code)`

2. **Code Execution Tracing:** Step through code mentally or with a debugger
   - Identify side effects and state changes
   - Verify output values
   - Tool: Python `pdb` (debugger) or IDE step-through

3. **Type Checking:** Validate types and array shapes
   - Tool: `mypy` for static type checking in Python
   - Tool: NumPy array shape inspection (`arr.shape`, `arr.dtype`)

### Robotics Documentation

1. **ROS 2 Official Documentation:** https://docs.ros.org/
   - Message types (std_msgs, sensor_msgs, geometry_msgs)
   - Node, publisher, subscriber patterns
   - Quality of Service profiles

2. **NumPy/SciPy Documentation:** https://numpy.org/, https://scipy.org/
   - Array operations, linear algebra
   - Signal processing, Kalman filter implementation

3. **Gazebo & Isaac Sim Docs:** Physics simulation parameters, sensor models, plugin interfaces

### Example Code Repositories

1. **ROS 2 Examples:** https://github.com/ros2/examples
2. **Control Algorithm Tutorials:** Robotics textbooks (e.g., "Planning Algorithms" by LaValle, "Modern Robotics" by Lynch & Park)

---

## Quality Checklist: Code Narration

Before publishing narration, verify:

- [ ] **Accuracy:** Narration matches code behavior exactly (trace execution mentally)
- [ ] **Audience Fit:** Explanation level matches textbook context (beginner/intermediate/advanced)
- [ ] **Concept Connection:** Robotics principles are named and linked (PID, Kalman filter, pub/sub, etc.)
- [ ] **Redundancy Check:** No re-explanation of prior-taught concepts without reference
- [ ] **Clarity:** Active voice, clear sentences, defined jargon
- [ ] **Code References:** Each significant line has a reference (file:line:end)
- [ ] **Why Not What:** Emphasis is on decision rationale, not just syntax
- [ ] **Edge Cases:** Relevant corner cases are noted (e.g., anti-windup, saturation)
- [ ] **Flow:** Narrative progresses logically; transitions are smooth
- [ ] **Teachable Moments:** Key insights are highlighted (e.g., "Notice how...")

---

## Acceptance Criteria

✅ **Narration explains code step-by-step** in human-friendly language without jargon overload
✅ **Design decisions are justified** with robotics principles and tradeoffs
✅ **Code references** link to exact lines (file:line)
✅ **Robotics concepts** are explicitly named (PID, Kalman filter, ROS pattern, etc.)
✅ **No redundant explanations** of prior-taught concepts
✅ **Behavior matches actual code** (no invented steps or implied logic)
✅ **Appropriate depth** for audience level and learning objectives
✅ **Clear, active voice** with logical flow and smooth transitions

---

## Examples of Effective vs. Ineffective Narration

### ❌ Ineffective (Too Surface-Level)

"This code creates a publisher. It publishes messages. The timer calls the function every 0.1 seconds."

**Why:** No explanation of *why* ROS 2 uses publishers, no mention of decoupling or message standards, no robotics concept.

### ✅ Effective (Concept-Linked)

"This ROS 2 node creates a **publisher** to decouple command generation from execution. The **publisher-subscriber pattern** enables the command node to run on any machine (laptop, cloud, another robot) without knowing where the arm controller lives. The 0.1-second timer (10 Hz) is a typical control frequency: fast enough for smooth motion, slow enough to avoid network congestion and computational load."

**Why:** Explains *what* (publisher), *why* (decoupling), *how* it enables robotics architectures (distributed systems), and *when* (10 Hz is justified).

---

## When NOT to Narrate Code

- **Simple boilerplate:** `import os`, `import sys`, standard library initializations (unless teaching Python basics)
- **Obvious assignments:** `x = 5` (unless demonstrating a non-obvious convention)
- **API calls already explained:** If the module taught `np.array()` earlier, don't re-narrate it here
- **Pseudocode:** Only narrate real, executable code that students can run

---

## Integration with Other Skills

**Code Narrator works with:**
- **Code-Expert:** Generates code examples; Code Narrator explains them
- **Content-Writer:** Embeds code narrations into lesson text
- **Token-Optimizer:** May compress narration for space efficiency (in textbook)
- **Diagram-First:** May precede code with a diagram-first explanation, then Code Narrator provides line-by-line details
- **Learning-Objective-Mapper:** Ensures narration aligns with lesson learning objectives

---

## Save Location

Save it as `.claude/skills/code-narrator/skill.md`
