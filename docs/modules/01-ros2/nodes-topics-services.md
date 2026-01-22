---
sidebar_position: 1
title: 'ROS 2 Nodes, Topics, and Services'
description: 'Master the fundamental communication patterns in ROS 2 for humanoid robotics'
---

# ROS 2 Nodes, Topics, and Services

**Reading Time:** ~35 minutes
**Difficulty Level:** Intermediate

## Learning Objectives

By the end of this comprehensive guide, you will be able to:

- **Understand** the architectural differences between ROS 1 and ROS 2, including the role of DDS middleware
- **Explain** the ROS 2 computational graph and how nodes, topics, and services interact
- **Create** functional ROS 2 nodes in Python using rclpy with proper lifecycle management
- **Implement** publisher-subscriber patterns with appropriate QoS policies for humanoid robotics applications
- **Design** service-based request-response patterns and understand when to use them versus topics
- **Apply** best practices for node composition, topic design, and integration with Gazebo simulation environments

---

## Section 1: Introduction & ROS 2 Architecture

### What is ROS 2 and Why It Replaced ROS 1

The Robot Operating System (ROS) has been the de facto standard for robotics software development since its initial release in 2007. However, ROS 1 was designed primarily for research environments and carried fundamental architectural limitations that became increasingly problematic as robotics moved toward production systems, real-time control, and distributed multi-robot deployments.

**ROS 2** represents a complete redesign from the ground up, addressing critical shortcomings while preserving the developer-friendly ecosystem that made ROS 1 successful. The transition to ROS 2 was driven by several non-negotiable requirements for modern robotics:

**1. Real-Time Performance**
ROS 1's single-threaded executor and lack of deterministic timing made it unsuitable for control loops requiring precise timing guarantees. Humanoid robots demand real-time responsiveness for balance control, joint coordination, and sensor fusion. ROS 2 provides configurable executors with priority-based scheduling and real-time operating system (RTOS) support, enabling deterministic behavior critical for walking gaits and dynamic motion control.

**2. Security and Authentication**
ROS 1 had no built-in security model—any node could publish to any topic, and communication was unencrypted. In production environments, especially for humanoid robots operating in public spaces or industrial settings, this was unacceptable. ROS 2 integrates security through DDS-Security (DDSSEC), providing authentication, encryption, and access control at the middleware level.

**3. Multi-Robot and Distributed Systems**
ROS 1's architecture relied on a centralized master node (roscore), creating a single point of failure and scalability bottleneck. Modern humanoid robotics research often involves fleets of robots, cloud-based processing, and edge computing. ROS 2's peer-to-peer discovery eliminates the master node, enabling robust distributed systems that can span local networks, cloud infrastructure, and edge devices seamlessly.

**4. Platform Diversity and Embedded Support**
ROS 1 was heavily Linux-centric and struggled on resource-constrained embedded platforms. Humanoid robots integrate diverse compute platforms—from high-performance GPU workstations for vision processing to ARM-based microcontrollers for motor control. ROS 2 supports Linux, Windows, macOS, and real-time embedded systems, with reduced memory footprint and minimal dependencies.

**5. Production-Ready Quality of Service (QoS)**
Industrial robotics and autonomous systems require fine-grained control over message delivery guarantees, bandwidth usage, and fault tolerance. ROS 1 used TCP for all communication, which was inefficient for high-frequency sensor data and lacked configurability. ROS 2 exposes DDS QoS policies, allowing developers to tune reliability, durability, and latency for each topic independently.

### The Data Distribution Service (DDS) Middleware

At the heart of ROS 2's architectural transformation is **DDS (Data Distribution Service)**, an Object Management Group (OMG) standard for real-time, distributed publish-subscribe communication. Unlike ROS 1's custom TCPROS/UDPROS protocols, DDS is a mature, vendor-neutral middleware with decades of deployment in aerospace, defense, and industrial automation.

**Why DDS?**

DDS provides several critical capabilities that align perfectly with modern robotics requirements:

- **Automatic Discovery**: Nodes discover each other automatically without a central broker, using multicast or Simple Discovery Protocol (SDP). When a humanoid robot's perception node starts, it automatically finds the motion planning node without manual configuration.

- **Data-Centric Architecture**: DDS focuses on data flows rather than connections. You define "data topics" (e.g., `/robot/joint_states`), and publishers/subscribers interact through these topics with configurable delivery semantics.

- **Quality of Service Policies**: DDS exposes 22 QoS policies controlling reliability, durability, deadline, lifespan, and resource limits. For example, IMU data at 1kHz might use BEST_EFFORT reliability to minimize latency, while configuration parameters use RELIABLE delivery with TRANSIENT_LOCAL durability to ensure new nodes receive the last published value.

- **Vendor Interoperability**: ROS 2 supports multiple DDS vendors (Fast DDS, Cyclone DDS, Connext DDS) through a common abstraction layer (rmw - ROS middleware). You can switch DDS implementations without changing application code, optimizing for performance, footprint, or licensing needs.

**DDS in Practice: A Humanoid Sensor Example**

Consider a humanoid robot with 50 joint encoders publishing position feedback at 500Hz. In ROS 1, this would create 50 TCP connections, overwhelming the network and CPU. With ROS 2's DDS:

1. Publishers declare a topic `/joint_states` with message type `sensor_msgs/JointState`
2. Subscribers express interest in this topic with desired QoS (e.g., BEST_EFFORT, keep last 10 samples)
3. DDS matches publishers and subscribers, establishing optimized multicast or shared memory communication
4. Data flows directly from publisher to subscriber without intermediary routing

The result is lower latency (sub-millisecond on shared memory), reduced CPU overhead, and better scalability. When running in Gazebo simulation, the same communication stack works identically whether nodes run in separate processes or in a single-process composition for performance.

### ROS 2 Computational Graph Concepts

The **ROS 2 computational graph** is the runtime structure formed by nodes and their communication channels. Understanding this graph is essential for designing scalable, maintainable robotics systems.

**Core Graph Elements:**

1. **Nodes**: The atomic unit of computation. A node encapsulates a specific capability (e.g., camera driver, path planner, joint controller). Nodes are isolated processes (or threads in composed mode) that communicate only through defined interfaces.

2. **Topics**: Named buses for asynchronous, many-to-many publish-subscribe messaging. Topics carry typed messages (e.g., `geometry_msgs/Twist` for velocity commands). Publishers send data to topics; subscribers receive data from topics. Topics are ideal for continuous data streams like sensor readings and control commands.

3. **Services**: Synchronous request-response channels for infrequent, client-server interactions. Services are typed with request and response message structures. Useful for triggering actions (e.g., "start walking gait") or querying state (e.g., "get current pose").

4. **Actions**: Long-running tasks with feedback, cancellation, and result semantics. Actions extend services with intermediate progress updates. Ideal for humanoid behaviors like "walk to waypoint" where you need continuous feedback and the ability to preempt.

5. **Parameters**: Runtime configuration values that can be queried and set dynamically. Parameters follow a hierarchical namespace and support type enforcement (int, double, string, bool, arrays).

**Graph Introspection**

ROS 2 provides powerful introspection tools to visualize and debug the computational graph:

```bash
# List all active nodes
ros2 node list

# Show node information (topics, services, actions, parameters)
ros2 node info /camera_driver

# List all topics
ros2 topic list

# Show topic details (type, publishers, subscribers, QoS)
ros2 topic info /robot/joint_states

# Echo topic messages in real-time
ros2 topic echo /robot/joint_states

# Visualize the graph (requires rqt)
rqt_graph
```

These tools are invaluable when debugging why a humanoid robot's control node isn't receiving camera data or when optimizing communication patterns for a digital twin simulation.

### Key Differences from ROS 1

For developers transitioning from ROS 1, understanding these breaking changes is critical:

| Aspect | ROS 1 | ROS 2 |
|--------|-------|-------|
| **Architecture** | Master-based (roscore required) | Peer-to-peer discovery (no master) |
| **Middleware** | Custom TCPROS/UDPROS | DDS standard (pluggable vendors) |
| **Communication** | TCP for topics, services | DDS with QoS policies |
| **Real-Time** | Not deterministic | RTOS support, configurable executors |
| **Security** | None | DDS-Security (authentication, encryption) |
| **Platforms** | Linux-focused | Linux, Windows, macOS, RTOS |
| **Python API** | rospy | rclpy (Python 3 only) |
| **Build System** | catkin (CMake wrapper) | colcon (vendor-agnostic) |
| **Launch System** | XML (roslaunch) | Python-based (ros2 launch) |
| **Node Composition** | Separate processes only | In-process composition supported |

**Critical Behavioral Differences:**

- **No roscore**: Simply start nodes. Discovery happens automatically via multicast or configured peers.
- **QoS Mismatches**: If a publisher uses RELIABLE and a subscriber uses BEST_EFFORT, they won't connect (by default). You must align QoS policies.
- **Lifecycle Management**: ROS 2 supports managed nodes with explicit lifecycle states (unconfigured → inactive → active → finalized), crucial for safety-critical humanoid control.
- **Parameter Server Replacement**: No global parameter server. Each node owns its parameters and exposes them via services.

### ROS 2 Communication Architecture Diagram

```mermaid
graph TD
    subgraph "ROS 2 Computational Graph"
        A[Camera Driver Node] -->|publishes| T1[/sensor/image_raw Topic]
        T1 -->|subscribes| B[Perception Node]
        B -->|publishes| T2[/humanoid/pose Topic]
        T2 -->|subscribes| C[Motion Planner Node]
        C -->|publishes| T3[/cmd_vel Topic]
        T3 -->|subscribes| D[Joint Controller Node]

        E[State Estimator Node] -->|service call| S1[/get_robot_state Service]
        C -->|provides| S1

        F[Behavior Coordinator] -->|action goal| A1[/execute_gait Action]
        D -->|action server| A1
    end

    subgraph "DDS Layer"
        DDS[DDS Middleware<br/>Fast DDS / Cyclone DDS]
        T1 -.->|DDS topic| DDS
        T2 -.->|DDS topic| DDS
        T3 -.->|DDS topic| DDS
        S1 -.->|DDS service| DDS
        A1 -.->|DDS action| DDS
    end

    subgraph "Network Transport"
        UDP[UDP Multicast]
        SHM[Shared Memory]
        DDS --> UDP
        DDS --> SHM
    end

    style T1 fill:#00F0FF,stroke:#B8C4CE,color:#000
    style T2 fill:#00F0FF,stroke:#B8C4CE,color:#000
    style T3 fill:#00F0FF,stroke:#B8C4CE,color:#000
    style S1 fill:#FF6B35,stroke:#B8C4CE,color:#000
    style A1 fill:#00E676,stroke:#B8C4CE,color:#000
    style DDS fill:#1A2230,stroke:#00F0FF,color:#E8EDF3
```

**Diagram Explanation:**

This diagram illustrates a simplified ROS 2 computational graph for a humanoid robot:

- **Topic Communication (Cyan)**: Asynchronous publish-subscribe flows. The camera driver publishes raw images, the perception node processes them and publishes pose estimates, the motion planner generates velocity commands, and the joint controller executes them.

- **Service Communication (Orange)**: Synchronous request-response. The state estimator queries the motion planner for the current robot state on demand.

- **Action Communication (Green)**: Long-running tasks with feedback. The behavior coordinator requests gait execution, and the joint controller provides progress updates.

- **DDS Middleware Layer**: All communication types are implemented on top of DDS topics and services. The ROS 2 client libraries (rclpy, rclcpp) abstract DDS complexity while exposing QoS configuration.

- **Transport Optimization**: DDS intelligently selects transport—shared memory for intra-host communication (simulation), UDP multicast for local networks (distributed robot systems).

### Why This Matters for Humanoid Robotics

Humanoid robots present unique challenges that make ROS 2's architecture essential:

1. **High-Frequency Sensor Fusion**: Balancing a bipedal robot requires fusing IMU (1kHz), force-torque sensors (500Hz), and joint encoders (500Hz) with low latency. ROS 2's BEST_EFFORT QoS and shared memory transport achieve sub-millisecond latency.

2. **Real-Time Control Loops**: Joint-level control for walking gaits demands deterministic 1kHz control loops. ROS 2's real-time executor and RTOS support (with `RT_PREEMPT` patches or dedicated RTOS) enable hard real-time guarantees.

3. **Digital Twin Synchronization**: Simulating a humanoid in Gazebo or Isaac Sim while mirroring real-world robot state requires bidirectional, low-latency communication. ROS 2's DDS layer handles this efficiently, whether running locally or across networks.

4. **Safety and Fault Tolerance**: Humanoid robots must detect and respond to failures (e.g., lost sensor data, missed deadlines). ROS 2's DEADLINE and LIVELINESS QoS policies provide automatic fault detection, triggering safe fallback behaviors.

In simulation environments like Gazebo Classic, Gazebo Ignition (Gazebo Sim), or NVIDIA Isaac Sim, ROS 2 provides the same communication patterns and APIs as real hardware, enabling true sim-to-real transfer of control algorithms. This is critical for humanoid research, where physical testing is expensive and time-consuming.

---

## Section 2: Nodes Deep Dive

### What Are Nodes and Why They Matter

In ROS 2, a **node** is the fundamental building block of a robotic system. Each node represents a single, modular purpose—a camera driver, a motion planner, a sensor filter, or a control algorithm. This modular design enables:

- **Separation of Concerns**: Each node focuses on one well-defined task, making code easier to test, debug, and maintain.
- **Reusability**: A well-designed camera driver node works with any camera type by simply swapping parameters, avoiding code duplication.
- **Distributed Deployment**: Nodes can run on different machines (e.g., perception on GPU workstation, control on embedded ARM board) or within the same process for performance.
- **Fault Isolation**: If a perception node crashes, the control nodes continue running, enabling graceful degradation.

For humanoid robotics, the node architecture might include:

- **Sensor Nodes**: IMU driver, camera driver, force-torque sensor driver
- **Perception Nodes**: Pose estimation, object detection, semantic segmentation
- **Planning Nodes**: Footstep planner, trajectory optimizer, gait generator
- **Control Nodes**: Joint-level PID controller, whole-body controller, compliance controller
- **Coordination Nodes**: Behavior state machine, mission planner, safety monitor

Each node communicates through topics and services, forming a computational graph that mirrors the robot's functional architecture.

### Node Lifecycle States

ROS 2 introduces **managed nodes** with explicit lifecycle states, a feature absent in ROS 1. Lifecycle management is critical for safety-critical systems like humanoid robots, where you need controlled initialization, configuration, and shutdown sequences.

**Lifecycle State Transitions:**

1. **Unconfigured**: Node exists but has not allocated resources (no hardware access, no publishers/subscribers created).
2. **Inactive**: Node has loaded configuration and allocated resources but is not actively processing data (motors powered but not moving).
3. **Active**: Node is fully operational and processing data (control loop running, publishing commands).
4. **Finalized**: Node is shutting down, releasing resources cleanly.

**State Transition Triggers:**

- `configure()`: Unconfigured → Inactive (load parameters, initialize sensors)
- `activate()`: Inactive → Active (start control loops, enable actuators)
- `deactivate()`: Active → Inactive (stop control loops, hold position)
- `cleanup()`: Inactive → Unconfigured (release resources)
- `shutdown()`: Any state → Finalized (emergency shutdown)

**Why This Matters:**

Imagine a humanoid robot's walking controller. You want to:

1. Load configuration parameters (step length, frequency) without starting the motors (Inactive).
2. Perform safety checks (check joint limits, verify sensor data).
3. Only after verification, enable the walking gait (Active).
4. If an emergency stop is triggered, immediately deactivate without abrupt motor commands (Active → Inactive).

Lifecycle nodes make this sequence explicit and testable. In simulation (Gazebo, Isaac Sim), lifecycle management allows you to pause the robot, reconfigure parameters, and resume without restarting the entire simulation.

### Creating Nodes in Python with rclpy

The **rclpy** library is the Python client for ROS 2. It provides an object-oriented API for creating nodes, publishers, subscribers, services, and timers.

**Basic Node Anatomy:**

1. Import `rclpy` and initialize the ROS 2 context.
2. Create a class inheriting from `rclpy.node.Node`.
3. Define publishers, subscribers, timers, and callbacks in `__init__`.
4. Spin the node to process callbacks (executor pattern).
5. Clean up and shutdown on exit.

Let's explore this with practical examples.

---

### Code Example 1: Basic Node Creation

This example demonstrates a minimal ROS 2 node in Python, suitable for understanding the fundamental structure.

```python
#!/usr/bin/env python3
"""
Basic ROS 2 Node Example
Demonstrates minimal node structure with lifecycle and logging.
"""

import rclpy
from rclpy.node import Node


class MinimalHumanoidNode(Node):
    """
    A minimal ROS 2 node for humanoid robotics.

    This node demonstrates:
    - Node initialization with namespace and name
    - Logging at different severity levels
    - Proper shutdown handling
    """

    def __init__(self):
        # Initialize node with name (will appear as /humanoid_minimal in graph)
        super().__init__('humanoid_minimal')

        # Log node startup
        self.get_logger().info('Humanoid Minimal Node has been started.')
        self.get_logger().debug('Running in DEBUG mode for development.')

        # Declare a simple parameter with default value
        self.declare_parameter('robot_name', 'Atlas')
        robot_name = self.get_parameter('robot_name').get_parameter_value().string_value

        self.get_logger().info(f'Initialized node for robot: {robot_name}')

    def shutdown(self):
        """Graceful shutdown handler."""
        self.get_logger().warn('Shutting down Humanoid Minimal Node.')


def main(args=None):
    """Main entry point for the ROS 2 node."""
    # Initialize the ROS 2 Python client library
    rclpy.init(args=args)

    # Create the node instance
    node = MinimalHumanoidNode()

    try:
        # Spin the node (process callbacks in a loop)
        # This blocks until Ctrl+C or rclpy.shutdown() is called
        rclpy.spin(node)
    except KeyboardInterrupt:
        # Handle Ctrl+C gracefully
        node.get_logger().info('Keyboard interrupt detected.')
    finally:
        # Clean up
        node.shutdown()
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Expected Output:**
```
[INFO] [<timestamp>] [humanoid_minimal]: Humanoid Minimal Node has been started.
[INFO] [<timestamp>] [humanoid_minimal]: Initialized node for robot: Atlas
# Node runs until Ctrl+C
[WARN] [<timestamp>] [humanoid_minimal]: Shutting down Humanoid Minimal Node.
```

**Key Concepts:**

- **`super().__init__('node_name')`**: Initializes the node with a unique name. Nodes are identified in the graph by their name (with optional namespace).
- **Logging**: Use `self.get_logger().info()`, `.warn()`, `.error()`, `.debug()` for severity-aware logging. Logs can be filtered by severity at runtime.
- **Parameters**: `declare_parameter()` registers a parameter with a default. Parameters can be overridden via command line (`ros2 run pkg node --ros-args -p robot_name:=NAO`) or launch files.
- **Spinning**: `rclpy.spin(node)` runs the executor loop, processing timers, subscriptions, and service callbacks. Without spinning, callbacks never execute.

**Common Mistake:**

Forgetting to call `rclpy.init()` before creating a node causes a runtime error: `"rclpy.init() must be called before creating a node"`. Always initialize the context first.

---

### Code Example 2: Node with Parameters and Timers

This example extends the basic node with parameter handling and a periodic timer for state updates, common in control nodes.

```python
#!/usr/bin/env python3
"""
ROS 2 Node with Parameters and Timers
Demonstrates periodic execution and dynamic reconfiguration.
"""

import rclpy
from rclpy.node import Node
from rclpy.parameter import Parameter


class HumanoidStatePublisher(Node):
    """
    Publishes humanoid robot state at a configurable frequency.

    This node demonstrates:
    - Parameter declaration with type enforcement
    - Timer-based periodic callbacks
    - Dynamic parameter updates (for simulation tuning)
    """

    def __init__(self):
        super().__init__('humanoid_state_publisher')

        # Declare parameters with defaults and types
        self.declare_parameter('publish_frequency', 10.0)  # Hz
        self.declare_parameter('robot_id', 'humanoid_01')
        self.declare_parameter('enable_debug', False)

        # Read parameters
        self.freq = self.get_parameter('publish_frequency').get_parameter_value().double_value
        self.robot_id = self.get_parameter('robot_id').get_parameter_value().string_value
        self.debug = self.get_parameter('enable_debug').get_parameter_value().bool_value

        # Validate parameters
        if self.freq <= 0 or self.freq > 1000:
            self.get_logger().error(f'Invalid frequency: {self.freq}. Using default 10 Hz.')
            self.freq = 10.0

        # Create a timer that fires at the specified frequency
        # Timer period = 1 / frequency (in seconds)
        timer_period = 1.0 / self.freq
        self.timer = self.create_timer(timer_period, self.timer_callback)

        # Internal state counter
        self.counter = 0

        self.get_logger().info(
            f'State Publisher initialized for {self.robot_id} at {self.freq} Hz'
        )

    def timer_callback(self):
        """
        Called periodically by the timer.
        In a real system, this would publish sensor data or control commands.
        """
        self.counter += 1

        if self.debug:
            self.get_logger().debug(f'Timer tick {self.counter} for {self.robot_id}')

        # Simulate state update (in real code, publish to a topic)
        if self.counter % int(self.freq) == 0:  # Every 1 second
            self.get_logger().info(f'{self.robot_id} state update: tick {self.counter}')

    def on_parameter_event(self, event):
        """
        Callback for parameter changes (advanced usage).
        Allows dynamic reconfiguration without restarting the node.
        """
        # Note: Full parameter event handling requires registering a callback
        # with add_on_set_parameters_callback(). Simplified here for clarity.
        self.get_logger().info('Parameter change detected (implement callback for live updates)')


def main(args=None):
    rclpy.init(args=args)

    node = HumanoidStatePublisher()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Shutting down state publisher.')
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Running with Custom Parameters:**
```bash
# Default parameters (10 Hz, robot_id=humanoid_01, debug=False)
ros2 run my_package humanoid_state_publisher

# Override frequency and enable debug logging
ros2 run my_package humanoid_state_publisher --ros-args \
  -p publish_frequency:=50.0 \
  -p robot_id:=atlas_sim \
  -p enable_debug:=true
```

**Expected Output (debug enabled, 50 Hz):**
```
[INFO] [<timestamp>] [humanoid_state_publisher]: State Publisher initialized for atlas_sim at 50.0 Hz
[DEBUG] [<timestamp>] [humanoid_state_publisher]: Timer tick 1 for atlas_sim
[DEBUG] [<timestamp>] [humanoid_state_publisher]: Timer tick 2 for atlas_sim
...
[INFO] [<timestamp>] [humanoid_state_publisher]: atlas_sim state update: tick 50
```

**Key Concepts:**

- **Timers**: `self.create_timer(period_sec, callback)` schedules periodic execution. Ideal for control loops, state publishing, and periodic diagnostics.
- **Parameter Validation**: Always validate user-provided parameters to prevent invalid configurations (e.g., negative frequencies, out-of-range joint limits).
- **Type-Safe Parameters**: ROS 2 enforces parameter types (int, double, string, bool, arrays). Attempting to set a string parameter with an int raises an error.
- **Dynamic Reconfiguration**: Advanced nodes can register parameter change callbacks to update behavior without restarting (useful in simulation for tuning controllers).

**Common Mistake:**

Forgetting to store the timer object (`self.timer = self.create_timer(...)`) can lead to the timer being garbage collected, causing callbacks to stop firing silently.

---

### Node Composition and Executors

Traditional ROS nodes run as separate OS processes, communicating via network or shared memory. While this provides isolation, it incurs overhead—process startup time, inter-process communication (IPC) latency, and memory duplication.

**Node Composition** allows multiple nodes to run in a single process, sharing memory and reducing overhead. This is particularly valuable in simulation and embedded systems.

**Composition Benefits:**

- **Zero-Copy Communication**: When nodes are composed, topic messages can be passed by pointer (zero-copy) instead of serializing/deserializing, drastically reducing latency and CPU usage.
- **Reduced Memory Footprint**: Shared libraries and data structures reduce memory consumption—critical on embedded platforms.
- **Faster Startup**: Loading nodes as plugins avoids process spawn overhead, reducing system initialization time.

**How Composition Works:**

1. Write nodes as classes derived from `rclpy.node.Node` (no change from standalone nodes).
2. Register nodes as composable components using entry points in `setup.py`.
3. Use `ros2 component` CLI or a composition launch file to load nodes into a container.

**Example: Composing Two Nodes**

```python
# In launch file (Python-based)
from launch import LaunchDescription
from launch_ros.actions import ComposableNodeContainer
from launch_ros.descriptions import ComposableNode


def generate_launch_description():
    """Compose camera driver and perception node in a single process."""

    container = ComposableNodeContainer(
        name='humanoid_perception_container',
        namespace='',
        package='rclcpp_components',
        executable='component_container',
        composable_node_descriptions=[
            ComposableNode(
                package='humanoid_sensors',
                plugin='humanoid_sensors::CameraDriver',
                name='camera_driver',
                parameters=[{'frame_rate': 30}]
            ),
            ComposableNode(
                package='humanoid_perception',
                plugin='humanoid_perception::PoseEstimator',
                name='pose_estimator',
                parameters=[{'model_path': '/models/pose_net.onnx'}]
            ),
        ],
        output='screen',
    )

    return LaunchDescription([container])
```

When the camera driver publishes images, the pose estimator receives them via in-process shared pointers, achieving sub-100μs latency—impossible with separate processes.

**Executors:**

ROS 2 provides multiple executor types to control callback processing:

- **SingleThreadedExecutor** (default): Processes all callbacks in a single thread sequentially.
- **MultiThreadedExecutor**: Distributes callbacks across a thread pool for parallelism.
- **StaticSingleThreadedExecutor**: Optimized single-threaded executor with reduced overhead for embedded systems.

For real-time systems, custom executors with priority-based scheduling ensure critical control callbacks preempt lower-priority callbacks.

### Best Practices for Node Design

Designing robust, maintainable ROS 2 nodes requires discipline and foresight. Follow these principles:

**1. Single Responsibility Principle**

Each node should do one thing well. Avoid "god nodes" that handle sensors, planning, and control. Instead:

- **Bad**: `humanoid_controller` node that reads IMU, plans footsteps, and commands joints.
- **Good**: Separate `imu_driver`, `footstep_planner`, and `joint_controller` nodes.

**2. Fail Safely and Explicitly**

Validate all inputs and handle errors explicitly. For example:

- Check message timestamps to detect stale data (critical for sensor fusion).
- Verify parameter ranges on startup (e.g., joint limits, control gains).
- Use QoS DEADLINE policies to detect missing messages and trigger safe fallbacks.

**3. Use Namespaces for Multi-Robot Systems**

When running multiple humanoids in simulation or real-world fleets, use namespaces to avoid topic name collisions:

```bash
# Launch robot 1 in namespace /robot1
ros2 run humanoid_control joint_controller --ros-args -r __ns:=/robot1

# Launch robot 2 in namespace /robot2
ros2 run humanoid_control joint_controller --ros-args -r __ns:=/robot2
```

Now topics become `/robot1/cmd_vel` and `/robot2/cmd_vel`, preventing cross-talk.

**4. Minimize State in Nodes**

Nodes should be as stateless as possible, relying on parameters and incoming messages rather than persistent internal state. This makes nodes easier to test and reason about.

**5. Log Appropriately**

- Use `DEBUG` for verbose diagnostics (disabled by default).
- Use `INFO` for important events (node startup, mode changes).
- Use `WARN` for recoverable issues (missed deadlines, fallback mode).
- Use `ERROR` for critical failures requiring intervention.

Avoid logging in high-frequency callbacks (e.g., 1kHz control loops) as it degrades performance.

---

## Section 3: Topics and Pub/Sub Pattern

### What Are Topics and Message Types

**Topics** are named buses for streaming data in ROS 2. They implement the **publish-subscribe pattern**, where publishers send messages to topics, and subscribers receive messages from topics. This decoupling is fundamental to ROS's modularity:

- Publishers and subscribers don't know about each other—they only know the topic name and message type.
- Multiple publishers can write to the same topic, and multiple subscribers can read from it (many-to-many communication).
- Topics are **unidirectional**: data flows from publishers to subscribers, never the reverse.

**Message Types** define the structure of data transmitted on topics. ROS 2 uses strongly typed messages defined in `.msg` files, which are compiled into language-specific classes (Python, C++, etc.).

**Common Message Types for Humanoid Robotics:**

| Package | Message Type | Purpose | Example Field |
|---------|--------------|---------|---------------|
| `std_msgs` | `String`, `Int32`, `Float64` | Simple scalar values | `data: "status_ok"` |
| `geometry_msgs` | `Twist`, `Pose`, `Vector3` | Velocity, position, orientation | `linear.x: 0.5` (m/s) |
| `sensor_msgs` | `JointState`, `Imu`, `Image` | Sensor readings | `position: [0.1, 0.2, ...]` (rad) |
| `trajectory_msgs` | `JointTrajectory` | Motion planning waypoints | `points: [...]` |
| `control_msgs` | `JointControllerState` | Controller feedback | `error: 0.01` |

**Custom Messages:**

For domain-specific data (e.g., humanoid gait parameters), define custom messages:

```msg
# HumanoidGaitCommand.msg
float64 step_length       # meters
float64 step_frequency    # Hz
float64 step_height       # meters
float64 lateral_offset    # meters
bool enable_balance_mode
```

After building the package, this becomes `my_msgs/HumanoidGaitCommand` usable in Python as:

```python
from my_msgs.msg import HumanoidGaitCommand

cmd = HumanoidGaitCommand()
cmd.step_length = 0.15
cmd.step_frequency = 2.0
```

### Publisher-Subscriber Pattern Explained

The pub/sub pattern is asynchronous and event-driven:

1. **Publisher**: Declares a topic with a specific message type and publishes data at will (periodic or event-triggered).
2. **Subscriber**: Registers interest in a topic with a callback function. When new data arrives, the callback executes asynchronously.

**Key Characteristics:**

- **Loose Coupling**: Publishers and subscribers can start/stop independently without coordination.
- **Scalability**: Adding a new subscriber doesn't affect publishers or existing subscribers.
- **Buffering**: Subscribers maintain a message queue (configurable depth) to handle bursts.

**Contrast with Services:**

- Topics are continuous streams (e.g., sensor data at 100 Hz).
- Services are one-off request-response transactions (e.g., "calculate inverse kinematics for this pose").

### Quality of Service (QoS) Policies

ROS 2's QoS policies control message delivery semantics at a fine-grained level. QoS mismatch is a common source of confusion for newcomers transitioning from ROS 1.

**Critical QoS Policies:**

1. **Reliability**:
   - `RELIABLE`: Guarantees delivery (retransmits lost packets). Use for commands and critical data.
   - `BEST_EFFORT`: No delivery guarantee (no retransmits). Use for high-frequency sensor data where the latest value matters more than every value.

2. **Durability**:
   - `VOLATILE`: Only deliver messages to subscribers that exist when the message is published.
   - `TRANSIENT_LOCAL`: New subscribers receive the last N messages published before they joined (useful for configuration data).

3. **History**:
   - `KEEP_LAST(depth)`: Keep the last N messages in the queue (e.g., depth=10).
   - `KEEP_ALL`: Keep all messages (risk of unbounded memory growth).

4. **Deadline**:
   - Specifies the expected maximum time between messages. If violated, a callback triggers (useful for detecting sensor failures).

5. **Liveliness**:
   - Declares that a publisher is "alive" within a time period. Useful for fault detection in distributed systems.

**QoS Compatibility:**

Publishers and subscribers must have **compatible** QoS. For example:

- A `RELIABLE` publisher **can** communicate with a `RELIABLE` subscriber ✅
- A `BEST_EFFORT` publisher **can** communicate with a `BEST_EFFORT` subscriber ✅
- A `RELIABLE` publisher **cannot** communicate with a `BEST_EFFORT` subscriber by default ❌ (policy mismatch)

**Common QoS Profiles:**

ROS 2 provides predefined profiles:

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy

# Sensor data profile (best effort, volatile, keep last 10)
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    history=HistoryPolicy.KEEP_LAST,
    depth=10
)

# System default (reliable, volatile, keep last 10)
default_qos = QoSProfile(depth=10)
```

For humanoid control, you might use:

- **Joint Commands** (100 Hz): BEST_EFFORT (latency-critical, latest command matters most)
- **Safety Limits**: RELIABLE (critical configuration must be received)
- **Configuration Parameters**: TRANSIENT_LOCAL + RELIABLE (new nodes get last config)

---

### Code Example 3: Publisher Node for Humanoid Robot Joint Commands

This example demonstrates a publisher that sends joint position commands for a humanoid robot in simulation.

```python
#!/usr/bin/env python3
"""
Humanoid Joint Command Publisher
Publishes periodic joint position commands for a simulated humanoid robot.
"""

import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy
from sensor_msgs.msg import JointState
from typing import List
import math


class HumanoidJointPublisher(Node):
    """
    Publishes joint commands for a humanoid robot in Gazebo/Isaac Sim.

    This demonstrates:
    - Creating a publisher with custom QoS
    - Generating realistic joint trajectories (sine wave for demo)
    - Publishing at a controlled frequency (100 Hz control loop)
    """

    def __init__(self):
        super().__init__('humanoid_joint_publisher')

        # Declare parameters
        self.declare_parameter('publish_rate', 100.0)  # Hz
        self.declare_parameter('num_joints', 12)  # Typical humanoid: 2 legs × 6 DOF

        self.rate = self.get_parameter('publish_rate').value
        self.num_joints = self.get_parameter('num_joints').value

        # Define joint names (simulated humanoid)
        self.joint_names: List[str] = [
            'left_hip_pitch', 'left_hip_roll', 'left_hip_yaw',
            'left_knee_pitch', 'left_ankle_pitch', 'left_ankle_roll',
            'right_hip_pitch', 'right_hip_roll', 'right_hip_yaw',
            'right_knee_pitch', 'right_ankle_pitch', 'right_ankle_roll',
        ]

        # QoS profile for control commands (BEST_EFFORT for low latency)
        qos_profile = QoSProfile(
            reliability=ReliabilityPolicy.BEST_EFFORT,
            history=HistoryPolicy.KEEP_LAST,
            depth=1  # Only latest command matters
        )

        # Create publisher
        self.publisher = self.create_publisher(
            JointState,
            '/humanoid/joint_commands',
            qos_profile
        )

        # Create timer for periodic publishing
        timer_period = 1.0 / self.rate
        self.timer = self.create_timer(timer_period, self.publish_command)

        # Internal state for trajectory generation
        self.time_step = 0.0
        self.dt = timer_period

        self.get_logger().info(
            f'Joint Publisher started: {self.num_joints} joints at {self.rate} Hz'
        )

    def publish_command(self):
        """
        Publish joint commands.
        Generates a simple sinusoidal trajectory for demonstration.
        In a real system, this would come from a motion planner.
        """
        msg = JointState()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.name = self.joint_names

        # Generate sinusoidal joint positions (amplitude 0.5 rad, period 2 sec)
        frequency = 0.5  # Hz
        amplitude = 0.5  # radians
        msg.position = [
            amplitude * math.sin(2 * math.pi * frequency * self.time_step + i * 0.1)
            for i in range(self.num_joints)
        ]

        # Zero velocity and effort (not used in this example)
        msg.velocity = [0.0] * self.num_joints
        msg.effort = [0.0] * self.num_joints

        self.publisher.publish(msg)

        # Update time
        self.time_step += self.dt

        # Log periodically (every 1 second to avoid spam)
        if int(self.time_step * self.rate) % int(self.rate) == 0:
            self.get_logger().debug(
                f'Published joint command at t={self.time_step:.2f}s'
            )


def main(args=None):
    rclpy.init(args=args)
    node = HumanoidJointPublisher()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Shutting down joint publisher.')
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Expected Behavior:**

When running in a Gazebo simulation with a humanoid model:

1. The node publishes `JointState` messages at 100 Hz to `/humanoid/joint_commands`.
2. A joint controller plugin (Gazebo or Isaac Sim) subscribes to this topic and moves the robot's joints.
3. The robot performs a slow, smooth sinusoidal motion across all joints.

**Introspection:**

```bash
# Check that the topic exists and shows message rate
ros2 topic hz /humanoid/joint_commands
# Output: average rate: 100.023 Hz

# View message structure
ros2 topic echo /humanoid/joint_commands --once

# Check QoS profile
ros2 topic info /humanoid/joint_commands -v
# Shows: Reliability: BEST_EFFORT, History: KEEP_LAST(1)
```

---

### Code Example 4: Subscriber Node for Sensor Data Processing

This example demonstrates a subscriber that processes simulated IMU data for a humanoid robot, implementing sensor filtering.

```python
#!/usr/bin/env python3
"""
Humanoid IMU Subscriber
Subscribes to IMU data and processes it for balance control.
"""

import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy
from sensor_msgs.msg import Imu
from collections import deque
import math


class HumanoidImuSubscriber(Node):
    """
    Subscribes to IMU sensor data and applies filtering.

    This demonstrates:
    - Creating a subscriber with sensor-appropriate QoS
    - Validating message timestamps for freshness
    - Implementing a moving average filter
    - Detecting anomalies (simulation-safe example)
    """

    def __init__(self):
        super().__init__('humanoid_imu_subscriber')

        # Parameters
        self.declare_parameter('filter_window_size', 10)
        self.declare_parameter('max_angular_velocity', 10.0)  # rad/s

        self.window_size = self.get_parameter('filter_window_size').value
        self.max_angular_vel = self.get_parameter('max_angular_velocity').value

        # QoS profile for sensor data (BEST_EFFORT, high frequency)
        sensor_qos = QoSProfile(
            reliability=ReliabilityPolicy.BEST_EFFORT,
            history=HistoryPolicy.KEEP_LAST,
            depth=10
        )

        # Create subscriber
        self.subscription = self.create_subscription(
            Imu,
            '/humanoid/imu',
            self.imu_callback,
            sensor_qos
        )

        # Internal state for filtering
        self.angular_vel_buffer = {
            'x': deque(maxlen=self.window_size),
            'y': deque(maxlen=self.window_size),
            'z': deque(maxlen=self.window_size)
        }

        self.last_msg_time = None
        self.message_count = 0

        self.get_logger().info(
            f'IMU Subscriber started with filter window size {self.window_size}'
        )

    def imu_callback(self, msg: Imu):
        """
        Process incoming IMU message.
        """
        self.message_count += 1

        # Validate timestamp freshness
        current_time = self.get_clock().now()
        msg_time = rclpy.time.Time.from_msg(msg.header.stamp)
        time_diff = (current_time - msg_time).nanoseconds / 1e9  # seconds

        if time_diff > 0.1:  # 100ms threshold
            self.get_logger().warn(
                f'Stale IMU data detected: {time_diff:.3f}s old'
            )

        # Extract angular velocity
        angular_vel = msg.angular_velocity

        # Anomaly detection: check for unrealistic values
        magnitude = math.sqrt(
            angular_vel.x**2 + angular_vel.y**2 + angular_vel.z**2
        )
        if magnitude > self.max_angular_vel:
            self.get_logger().error(
                f'Anomalous angular velocity: {magnitude:.2f} rad/s (max: {self.max_angular_vel})'
            )
            return  # Discard this sample

        # Add to filter buffer
        self.angular_vel_buffer['x'].append(angular_vel.x)
        self.angular_vel_buffer['y'].append(angular_vel.y)
        self.angular_vel_buffer['z'].append(angular_vel.z)

        # Compute filtered values (moving average)
        filtered_x = sum(self.angular_vel_buffer['x']) / len(self.angular_vel_buffer['x'])
        filtered_y = sum(self.angular_vel_buffer['y']) / len(self.angular_vel_buffer['y'])
        filtered_z = sum(self.angular_vel_buffer['z']) / len(self.angular_vel_buffer['z'])

        # Log periodically (every 100 messages at ~500 Hz = every 0.2 sec)
        if self.message_count % 100 == 0:
            self.get_logger().info(
                f'Filtered angular velocity: '
                f'x={filtered_x:.3f}, y={filtered_y:.3f}, z={filtered_z:.3f} rad/s'
            )

        # In a real system, publish filtered data to another topic or feed to controller


def main(args=None):
    rclpy.init(args=args)
    node = HumanoidImuSubscriber()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Shutting down IMU subscriber.')
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Expected Output:**

```
[INFO] [<timestamp>] [humanoid_imu_subscriber]: IMU Subscriber started with filter window size 10
[INFO] [<timestamp>] [humanoid_imu_subscriber]: Filtered angular velocity: x=0.023, y=-0.012, z=0.005 rad/s
[WARN] [<timestamp>] [humanoid_imu_subscriber]: Stale IMU data detected: 0.125s old
[INFO] [<timestamp>] [humanoid_imu_subscriber]: Filtered angular velocity: x=0.018, y=-0.010, z=0.003 rad/s
```

**Key Concepts:**

- **Timestamp Validation**: Always check `msg.header.stamp` against current time to detect stale data (critical for sensor fusion).
- **Anomaly Detection**: Validate sensor readings against physical limits before using them in control loops.
- **Filtering**: Moving average filter smooths noisy sensor data. For production, use Kalman filters or complementary filters.
- **QoS BEST_EFFORT**: IMU data at 500 Hz doesn't need guaranteed delivery—the latest value is what matters for balance control.

**Common Mistake:**

Forgetting to check if the subscriber callback is firing. Use `ros2 topic echo` to verify messages are published:

```bash
ros2 topic echo /humanoid/imu
```

If no output appears, the topic name might be wrong, or the publisher hasn't started.

---

### Topic Introspection Tools

ROS 2 provides powerful CLI tools for debugging and analyzing topics in real-time.

**1. List All Topics**

```bash
ros2 topic list
# Output:
# /humanoid/joint_commands
# /humanoid/imu
# /parameter_events
# /rosout
```

**2. Show Topic Details**

```bash
ros2 topic info /humanoid/imu -v
# Output:
# Type: sensor_msgs/msg/Imu
# Publisher count: 1
# Subscription count: 1
# QoS profile:
#   Reliability: BEST_EFFORT
#   Durability: VOLATILE
#   History: KEEP_LAST(10)
```

**3. Measure Publishing Rate**

```bash
ros2 topic hz /humanoid/joint_commands
# Output:
# average rate: 100.023
#   min: 0.009s max: 0.011s std dev: 0.00012s window: 102
```

**4. Echo Topic Messages**

```bash
ros2 topic echo /humanoid/imu --once
# Prints one message and exits
```

**5. Publish from Command Line (Testing)**

```bash
ros2 topic pub /humanoid/joint_commands sensor_msgs/msg/JointState \
  "{name: ['joint1'], position: [0.5], velocity: [0.0], effort: [0.0]}"
# Useful for testing subscribers without a publisher node
```

**6. Bandwidth Usage**

```bash
ros2 topic bw /humanoid/imu
# Output:
# average: 125.3 KB/s
#   mean: 250 B min: 250 B max: 250 B window: 500
```

These tools are essential during development and debugging, especially in simulation where you can't physically inspect the robot.

### Best Practices for Topic Design

**1. Use Semantic Namespaces**

Organize topics hierarchically to reflect system architecture:

```
/humanoid/
  /sensors/
    /imu
    /camera/left/image_raw
    /camera/right/image_raw
  /control/
    /joint_commands
    /cmd_vel
  /perception/
    /pose_estimate
    /obstacles
```

**2. Choose Message Types Wisely**

- Use standard message types (`sensor_msgs`, `geometry_msgs`) when possible for tool compatibility.
- Create custom messages only when necessary, and document them thoroughly.

**3. Match QoS to Use Case**

- High-frequency sensor data: BEST_EFFORT
- Control commands: BEST_EFFORT (latency critical)
- Configuration: RELIABLE + TRANSIENT_LOCAL
- Safety-critical events: RELIABLE + DEADLINE

**4. Avoid Publishing at Arbitrarily High Rates**

Publishing faster than necessary wastes CPU and network bandwidth. Match the publishing rate to the consumer's needs (e.g., 30 Hz for visualization, 100 Hz for control, 500 Hz for high-speed sensors).

**5. Version Your Custom Message Definitions**

When modifying custom messages, maintain backward compatibility or version them (e.g., `HumanoidGaitCommandV2.msg`) to avoid breaking existing code.

---

