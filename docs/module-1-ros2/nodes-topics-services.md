---
title: "Nodes, Topics, and Services"
sidebar_label: "Nodes, Topics, and Services"
sidebar_position: 1
description: "Master ROS 2 architecture through nodes, topics, and services. Learn the node-graph model, pub/sub patterns, QoS settings, and debugging techniques."
reading_time: "~32 minutes"
---

# Nodes, Topics, and Services

**Reading Time:** ~32 minutes
**Difficulty Level:** Intermediate

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Understand** ROS 2 architecture and the node-graph model, including how nodes communicate in a distributed system
2. **Describe** topic-based (pub/sub) and service-based (request/reply) communication patterns and when to use each
3. **Work with** ROS 2 message types and Quality of Service (QoS) settings to ensure reliable communication
4. **Debug** ROS 2 communication using CLI tools to troubleshoot node connectivity and data flow issues

---

## Introduction

The Robot Operating System 2 (ROS 2) represents a fundamental shift in how we architect robotic software. Unlike monolithic applications where all functionality exists in a single executable, ROS 2 embraces a distributed, modular architecture that mirrors the complexity of biological nervous systems. Just as neurons communicate through synaptic connections to coordinate complex behaviors, ROS 2 nodes exchange messages through well-defined communication channels to achieve sophisticated robotic tasks.

This lesson explores the foundational building blocks of ROS 2: **nodes**, **topics**, and **services**. These abstractions enable you to design scalable, maintainable robotic systems where individual components can be developed, tested, and deployed independently. Whether you're building a humanoid robot with dozens of actuators or a simple perception pipeline, understanding these core concepts is essential.

We'll progress from high-level architectural concepts to practical implementation details, examining real code examples that demonstrate how these patterns work in production systems. By grounding abstract concepts in concrete use cases, you'll develop both conceptual understanding and practical skill.

:::tip Why This Matters
Modern humanoid robots may run hundreds of concurrent processes: sensor drivers, perception pipelines, motion planners, and controllers. The ROS 2 communication architecture enables these components to cooperate seamlessly while remaining loosely coupled—a critical property for complex robotic systems.
:::

---

## 1. Introduction to ROS 2 Architecture

### 1.1 What is a Node?

A **node** in ROS 2 is the fundamental unit of computation—a single executable process that performs a specific function within the robotic system. Think of nodes as specialized workers in a factory: one node might read sensor data, another processes images, while a third controls motor positions. Each node has a well-defined responsibility and communicates with other nodes exclusively through ROS 2's standardized interfaces.

**Key characteristics of nodes:**

- **Single Responsibility:** Each node should focus on one task (sensor reading, path planning, control, etc.)
- **Independent Execution:** Nodes run as separate processes, enabling isolation and fault tolerance
- **Language Agnostic:** Nodes can be written in Python, C++, or other supported languages
- **Discoverable:** ROS 2 provides automatic discovery mechanisms so nodes can find each other at runtime

**Example node responsibilities:**

- **Camera Driver Node:** Interfaces with a physical camera and publishes raw image data
- **Object Detector Node:** Subscribes to images, runs inference, publishes detected object positions
- **Motion Planner Node:** Subscribes to object positions, computes safe trajectories
- **Joint Controller Node:** Subscribes to trajectories, sends commands to motor actuators

This decomposition enables **horizontal scaling** (run multiple detector nodes for parallel processing), **independent development** (teams work on separate nodes), and **graceful degradation** (if the planner crashes, the detector continues running).

### 1.2 The ROS 2 Graph

The **ROS 2 graph** is a network representation of all active nodes and their communication channels. Nodes are vertices, and communication channels (topics, services, actions) are directed edges. This graph is dynamic: nodes join and leave at runtime, and the graph topology evolves as the system operates.

**Graph properties:**

- **Decentralized:** No single master process coordinates communication (unlike ROS 1)
- **Dynamic Discovery:** Nodes announce their presence using DDS (Data Distribution Service) middleware
- **Introspectable:** Tools like `ros2 node list` and `rqt_graph` visualize the live graph
- **Fault-Tolerant:** Node failures don't cascade; other nodes can detect unavailability and adapt

```mermaid
graph LR
    A[Camera Driver] -->|Image Topic| B[Object Detector]
    B -->|Detections Topic| C[Motion Planner]
    C -->|Trajectory Topic| D[Joint Controller]
    D -->|Joint States Topic| E[State Monitor]
    E -->|/check_status Service| C

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#e1ffe1
    style E fill:#f5e1ff
```

**Figure 1:** A simplified ROS 2 graph showing topic-based communication (solid arrows) and a service call (dashed). Each node performs a distinct function, and the graph structure reveals system architecture.

### 1.3 Pub/Sub vs. Services vs. Actions

ROS 2 provides three primary communication patterns, each optimized for different use cases:

#### **Topics (Publisher/Subscriber Pattern)**

- **Use Case:** Continuous data streams (sensor readings, state updates, video feeds)
- **Cardinality:** 1-to-N (one publisher can have multiple subscribers)
- **Synchrony:** Asynchronous—publishers send data without waiting for subscribers
- **Example:** A camera node publishes images at 30 Hz; multiple nodes subscribe (detector, recorder, display)

**When to use topics:**
- High-frequency sensor data
- System state broadcasts
- Event notifications where response isn't required

#### **Services (Request/Reply Pattern)**

- **Use Case:** Occasional, transactional interactions requiring a response
- **Cardinality:** 1-to-1 (client sends request, server sends reply)
- **Synchrony:** Synchronous—client blocks until server responds
- **Example:** A navigation client requests path computation; planner returns waypoints

**When to use services:**
- Configuration changes (set camera exposure)
- Triggered computations (compute inverse kinematics)
- State queries (get robot battery level)

#### **Actions (Goal-Oriented Pattern with Feedback)**

- **Use Case:** Long-running tasks requiring progress updates and cancellation
- **Cardinality:** 1-to-1 with continuous feedback
- **Synchrony:** Asynchronous with feedback loop
- **Example:** A "move to position" action that reports progress and allows preemption

**When to use actions:**
- Tasks with measurable progress (navigation, grasping)
- Operations requiring cancellation (abort motion)
- Processes with intermediate results

:::important Choosing the Right Pattern
The decision between topics, services, and actions is architectural. Topics decouple producers from consumers (good for scalability); services enforce synchronous contracts (good for reliability); actions balance responsiveness with cancellation (good for user interaction). For humanoid control, you'll typically use topics for sensor data, services for configuration, and actions for high-level behaviors.
:::

### 1.4 Real-World Analogy: The Nervous System

The comparison between ROS 2 and biological nervous systems is instructive:

| Biological System | ROS 2 Equivalent | Function |
|-------------------|------------------|----------|
| **Sensory Neurons** | Sensor Driver Nodes | Gather information from environment |
| **Motor Neurons** | Actuator Controller Nodes | Execute physical actions |
| **Interneurons** | Processing Nodes | Transform, filter, analyze data |
| **Synapses** | Topics | Transmit signals between neurons |
| **Reflex Arcs** | Low-Latency Topic Chains | Fast, automatic responses |
| **Conscious Thought** | Service Calls | Deliberate, high-level decisions |

Just as your nervous system doesn't require your conscious brain to pull your hand from a hot stove (a reflex arc handles it), a humanoid robot can implement low-latency obstacle avoidance using a direct sensor-to-controller topic connection, while high-level planning queries a service for strategic decisions.

**Key Takeaway:** ROS 2's architecture mirrors distributed, fault-tolerant biological systems. Understanding this analogy helps you design robotic systems that are both reactive (fast reflexes via topics) and deliberative (strategic decisions via services).

---

## 2. Deep Dive: Nodes

### 2.1 Node Lifecycle

ROS 2 introduces **managed nodes** with explicit lifecycle states, enabling controlled startup, configuration, and shutdown. While basic nodes start immediately, lifecycle nodes progress through defined states:

1. **Unconfigured:** Node exists but isn't ready for operation
2. **Inactive:** Node is configured but not actively processing data
3. **Active:** Node is fully operational
4. **Finalized:** Node is shutting down

**Lifecycle transitions:**

- `configure()`: Load parameters, allocate resources (Unconfigured → Inactive)
- `activate()`: Begin processing (Inactive → Active)
- `deactivate()`: Pause processing without releasing resources (Active → Inactive)
- `cleanup()`: Release resources (Inactive → Unconfigured)
- `shutdown()`: Final cleanup (any state → Finalized)

**Why lifecycle management matters:**

- **Graceful Startup:** Configure all nodes before activation, preventing partial initialization issues
- **Hot Reconfiguration:** Deactivate node, change parameters, reactivate without restart
- **Fault Recovery:** Automatically deactivate misbehaving nodes, reconfigure, reactivate
- **Deterministic Shutdown:** Clean up resources in defined order

:::tip Simulation-First Development
In simulation environments like Gazebo or Isaac Sim, lifecycle nodes enable you to pause simulations, reconfigure parameters (e.g., sensor noise levels), and resume without restarting the entire system—essential for iterative development.
:::

### 2.2 Executors and Spinners

An **executor** manages callback execution for one or more nodes. When a message arrives on a topic or a service request comes in, the executor invokes the appropriate callback function. Understanding executors is critical for writing responsive, efficient ROS 2 code.

**Executor types:**

- **SingleThreadedExecutor:** Processes callbacks serially on one thread (default)
- **MultiThreadedExecutor:** Processes callbacks in parallel using a thread pool
- **StaticSingleThreadedExecutor:** Optimized single-threaded executor with lower overhead

**Spinning strategies:**

```python
# Spin once (process one callback, then return)
rclpy.spin_once(node, timeout_sec=1.0)

# Spin forever (block, processing callbacks until shutdown)
rclpy.spin(node)

# Manual control loop
while rclpy.ok():
    rclpy.spin_once(node, timeout_sec=0.1)
    # Custom logic between callbacks
```

**Multi-node executors:**

```python
executor = rclpy.executors.MultiThreadedExecutor()
executor.add_node(sensor_node)
executor.add_node(processing_node)
executor.spin()  # Both nodes share callback processing
```

**Performance considerations:**

- **Callback Duration:** Long-running callbacks block other callbacks in `SingleThreadedExecutor`
- **Thread Safety:** With `MultiThreadedExecutor`, callbacks may execute concurrently; protect shared state with locks
- **Priority Inversion:** High-priority callbacks may wait for low-priority ones; consider separate executors for critical paths

### 2.3 Parameter Servers

Every ROS 2 node can declare and manage **parameters**—typed configuration values that can be set at launch time or modified at runtime. Parameters enable flexible, reusable nodes.

**Parameter types:**

- `bool`, `int64`, `float64`, `string`
- Arrays: `bool_array`, `integer_array`, `double_array`, `string_array`

**Declaring parameters with defaults and constraints:**

```python
self.declare_parameter('update_rate', 10.0,
    ParameterDescriptor(
        description='Control loop frequency in Hz',
        type=ParameterType.PARAMETER_DOUBLE,
        read_only=False,
        floating_point_range=[
            FloatingPointRange(from_value=1.0, to_value=100.0, step=0.1)
        ]
    ))
```

**Runtime parameter modification:**

```bash
# Get parameter value
ros2 param get /my_node update_rate

# Set parameter value
ros2 param set /my_node update_rate 20.0

# List all parameters
ros2 param list /my_node
```

**Parameter event callbacks:**

Nodes can register callbacks triggered when parameters change:

```python
self.add_on_set_parameters_callback(self.parameter_callback)

def parameter_callback(self, params):
    for param in params:
        if param.name == 'update_rate':
            self.timer.timer_period_ns = int(1e9 / param.value)
    return SetParametersResult(successful=True)
```

### 2.4 Node Discovery

ROS 2 uses **DDS (Data Distribution Service)** for automatic node discovery. When a node starts, it announces its presence via multicast, allowing other nodes to discover topics, services, and parameters without a central broker.

**Discovery process:**

1. Node broadcasts presence announcement
2. Other nodes receive announcement and establish peer connections
3. Topic/service information exchanged
4. Data communication begins

**Discovery can fail due to:**

- Network segmentation (VLANs, firewalls)
- DDS domain ID mismatch
- Multicast disabled on network interfaces

**Debugging discovery issues:**

```bash
# Check active nodes
ros2 node list

# Inspect node details
ros2 node info /my_node

# Verify DDS domain
export ROS_DOMAIN_ID=42  # Set before launching nodes

# Test with ros2 doctor
ros2 doctor --report
```

### 2.5 Code Example: Creating a Sensor Node

Let's create a simple temperature sensor node that publishes readings at a configurable rate.

```python
#!/usr/bin/env python3
"""
Temperature Sensor Node

Simulates a temperature sensor by publishing periodic readings.
Demonstrates node creation, parameter handling, and topic publishing.
"""

import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import random


class TemperatureSensorNode(Node):
    """Simulated temperature sensor that publishes periodic readings."""

    def __init__(self):
        super().__init__('temperature_sensor')

        # Declare parameters with defaults and constraints
        self.declare_parameter('publish_rate', 1.0)  # Hz
        self.declare_parameter('mean_temp', 22.0)    # Celsius
        self.declare_parameter('std_dev', 2.0)       # Celsius

        # Retrieve parameter values
        rate = self.get_parameter('publish_rate').value
        self.mean = self.get_parameter('mean_temp').value
        self.std_dev = self.get_parameter('std_dev').value

        # Create publisher
        self.publisher = self.create_publisher(
            Float32,
            'temperature',
            10  # Queue size
        )

        # Create timer for periodic publishing
        self.timer = self.create_timer(1.0 / rate, self.publish_temperature)

        self.get_logger().info(
            f'Temperature sensor initialized: '
            f'rate={rate}Hz, mean={self.mean}°C, std_dev={self.std_dev}°C'
        )

    def publish_temperature(self):
        """Generate and publish simulated temperature reading."""
        # Simulate sensor reading with Gaussian noise
        temperature = random.gauss(self.mean, self.std_dev)

        # Create and publish message
        msg = Float32()
        msg.data = temperature
        self.publisher.publish(msg)

        self.get_logger().debug(f'Published temperature: {temperature:.2f}°C')


def main(args=None):
    rclpy.init(args=args)
    node = TemperatureSensorNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Expected output when running:**

```bash
$ ros2 run my_package temperature_sensor --ros-args -p publish_rate:=2.0
[INFO] [temperature_sensor]: Temperature sensor initialized: rate=2.0Hz, mean=22.0°C, std_dev=2.0°C
```

**Key implementation details:**

- **Parameter Declaration:** Parameters are declared with defaults, enabling launch-time configuration
- **Timer-Based Publishing:** `create_timer()` ensures periodic execution without manual loop management
- **Logging:** Uses ROS 2 logger for consistent, configurable output (supports DEBUG, INFO, WARN, ERROR levels)
- **Clean Shutdown:** `try/finally` block ensures proper cleanup on termination

### 2.6 Code Example: Creating a Lifecycle Node

Now let's create a more sophisticated camera node using lifecycle management:

```python
#!/usr/bin/env python3
"""
Lifecycle Camera Node

Demonstrates lifecycle state management for controlled startup and shutdown.
Simulates a camera driver with configuration and activation phases.
"""

import rclpy
from rclpy.lifecycle import LifecycleNode, TransitionCallbackReturn
from rclpy.lifecycle import LifecycleState
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import numpy as np


class LifecycleCameraNode(LifecycleNode):
    """Lifecycle-managed camera node with state transitions."""

    def __init__(self, node_name='camera_node'):
        super().__init__(node_name)

        # Not yet configured
        self.publisher = None
        self.timer = None
        self.bridge = CvBridge()
        self.frame_count = 0

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        """
        Configure node: load parameters, allocate resources.
        Transition: Unconfigured → Inactive
        """
        self.get_logger().info('Configuring camera...')

        # Declare and retrieve parameters
        self.declare_parameter('width', 640)
        self.declare_parameter('height', 480)
        self.declare_parameter('fps', 30.0)

        self.width = self.get_parameter('width').value
        self.height = self.get_parameter('height').value
        self.fps = self.get_parameter('fps').value

        # Create publisher (but don't start publishing yet)
        self.publisher = self.create_lifecycle_publisher(
            Image,
            'camera/image_raw',
            10
        )

        self.get_logger().info(
            f'Camera configured: {self.width}x{self.height} @ {self.fps}fps'
        )
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        """
        Activate node: begin publishing.
        Transition: Inactive → Active
        """
        self.get_logger().info('Activating camera...')

        # Start publishing timer
        self.timer = self.create_timer(1.0 / self.fps, self.publish_frame)

        # Activate publisher
        self.publisher.on_activate(state)

        self.get_logger().info('Camera active and streaming')
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state: LifecycleState) -> TransitionCallbackReturn:
        """
        Deactivate node: stop publishing but retain configuration.
        Transition: Active → Inactive
        """
        self.get_logger().info('Deactivating camera...')

        # Stop timer
        if self.timer:
            self.timer.cancel()
            self.timer = None

        # Deactivate publisher
        self.publisher.on_deactivate(state)

        self.get_logger().info('Camera deactivated')
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state: LifecycleState) -> TransitionCallbackReturn:
        """
        Cleanup: release resources.
        Transition: Inactive → Unconfigured
        """
        self.get_logger().info('Cleaning up camera...')

        # Destroy publisher
        if self.publisher:
            self.destroy_publisher(self.publisher)
            self.publisher = None

        self.get_logger().info('Camera cleaned up')
        return TransitionCallbackReturn.SUCCESS

    def on_shutdown(self, state: LifecycleState) -> TransitionCallbackReturn:
        """
        Shutdown: final cleanup from any state.
        Transition: * → Finalized
        """
        self.get_logger().info('Shutting down camera...')

        if self.timer:
            self.timer.cancel()

        self.get_logger().info('Camera shutdown complete')
        return TransitionCallbackReturn.SUCCESS

    def publish_frame(self):
        """Generate and publish simulated camera frame."""
        # Create synthetic image (gradient pattern)
        image_np = np.zeros((self.height, self.width, 3), dtype=np.uint8)
        image_np[:, :, 0] = (self.frame_count % 256)  # Red channel varies with frame

        # Convert to ROS Image message
        msg = self.bridge.cv2_to_imgmsg(image_np, encoding='rgb8')
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.header.frame_id = 'camera_frame'

        # Publish
        self.publisher.publish(msg)
        self.frame_count += 1


def main(args=None):
    rclpy.init(args=args)
    node = LifecycleCameraNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Controlling lifecycle state via CLI:**

```bash
# Check current state
ros2 lifecycle get /camera_node

# Transition: Unconfigured → Inactive
ros2 lifecycle set /camera_node configure

# Transition: Inactive → Active (camera starts publishing)
ros2 lifecycle set /camera_node activate

# Transition: Active → Inactive (camera stops publishing)
ros2 lifecycle set /camera_node deactivate

# Transition: Inactive → Unconfigured (release resources)
ros2 lifecycle set /camera_node cleanup
```

**Key Takeaway:** Lifecycle nodes provide deterministic control over node initialization and shutdown. This is essential for complex systems where startup order matters (e.g., configure all sensors before activating the perception pipeline) or where hot reconfiguration is needed (pause the detector, adjust sensitivity, resume).

---

## 3. Topics and Pub/Sub Pattern

### 3.1 Message Types and Definitions

ROS 2 topics transport **messages**—strongly typed data structures defined using an Interface Definition Language (IDL). Standard message types are provided in packages like `std_msgs`, `sensor_msgs`, and `geometry_msgs`.

**Common message types:**

- `std_msgs/Float32`: Single floating-point value
- `std_msgs/String`: Text data
- `sensor_msgs/Image`: Camera images with metadata
- `sensor_msgs/JointState`: Robot joint positions/velocities/efforts
- `geometry_msgs/Twist`: Linear and angular velocity commands
- `geometry_msgs/PoseStamped`: Position and orientation with timestamp

**Message anatomy (example: `geometry_msgs/PoseStamped`):**

```
std_msgs/Header header
  builtin_interfaces/Time stamp
  string frame_id
geometry_msgs/Pose pose
  geometry_msgs/Point position
    float64 x
    float64 y
    float64 z
  geometry_msgs/Quaternion orientation
    float64 x
    float64 y
    float64 z
    float64 w
```

**Creating custom messages:**

1. **Define message file** (`my_package/msg/Temperature.msg`):

```
std_msgs/Header header
float32 celsius
float32 fahrenheit
uint8 sensor_id
```

2. **Update `package.xml`:**

```xml
<build_depend>rosidl_default_generators</build_depend>
<exec_depend>rosidl_default_runtime</exec_depend>
<member_of_group>rosidl_interface_packages</member_of_group>
```

3. **Update `CMakeLists.txt`:**

```cmake
find_package(rosidl_default_generators REQUIRED)

rosidl_generate_interfaces(${PROJECT_NAME}
  "msg/Temperature.msg"
)
```

4. **Build and use:**

```python
from my_package.msg import Temperature

msg = Temperature()
msg.header.stamp = self.get_clock().now().to_msg()
msg.celsius = 22.5
msg.fahrenheit = 72.5
msg.sensor_id = 1
```

### 3.2 Quality of Service (QoS)

**Quality of Service (QoS)** policies control message delivery behavior—reliability, durability, history depth, and more. QoS is critical for ensuring data reaches subscribers under varying network conditions.

**Key QoS policies:**

#### **Reliability**

- **Reliable:** Guarantees message delivery (uses acknowledgments, retransmits if needed)
- **Best Effort:** Sends messages without acknowledgment (lower overhead, may drop messages)

**Use Reliable for:** Commands, state updates, critical sensor data
**Use Best Effort for:** High-frequency sensor streams where occasional loss is acceptable (e.g., video)

#### **Durability**

- **Transient Local:** New subscribers receive last N messages published before they joined
- **Volatile:** Subscribers only receive messages published after they subscribe

**Use Transient Local for:** Configuration data, robot state (new nodes need current state)
**Use Volatile for:** Real-time sensor streams

#### **History**

- **Keep Last(N):** Store only the last N messages in queue
- **Keep All:** Store all messages until delivered (unbounded, risky)

**Use Keep Last:** Most cases (balance memory and latency)
**Use Keep All:** When every message must be processed (rare)

#### **Deadline**

- Specifies maximum time between messages; triggers event if missed
- **Use case:** Detect sensor failures (camera should publish at 30 Hz; deadline = 40 ms)

#### **Lifespan**

- Messages expire after specified duration
- **Use case:** Discard stale sensor data (laser scans older than 100 ms)

**QoS Profile Examples:**

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy, DurabilityPolicy

# Sensor data profile (best effort, volatile, keep last 10)
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    durability=DurabilityPolicy.VOLATILE,
    history=HistoryPolicy.KEEP_LAST,
    depth=10
)

# System state profile (reliable, transient local, keep last 1)
state_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    history=HistoryPolicy.KEEP_LAST,
    depth=1
)

# Create publisher with custom QoS
self.publisher = self.create_publisher(
    Image,
    'camera/image',
    sensor_qos
)
```

**QoS Compatibility:**

Publisher and subscriber QoS policies must be **compatible**. Mismatches prevent communication:

- **Reliable publisher + Best Effort subscriber:** ❌ Incompatible
- **Best Effort publisher + Reliable subscriber:** ✅ Compatible (subscriber accepts lower guarantee)
- **Transient Local publisher + Volatile subscriber:** ✅ Compatible

:::warning Common QoS Mistake
Forgetting to match QoS profiles is a frequent source of "topic not receiving data" issues. Always verify QoS compatibility with `ros2 topic info /topic_name --verbose`.
:::

### 3.3 Latching and Reliability

**Latching** (via `TRANSIENT_LOCAL` durability) ensures late-joining subscribers receive the most recent message. This is essential for infrequently updated topics like robot configuration or map data.

**Example: Robot Description Publisher**

```python
from rclpy.qos import QoSProfile, DurabilityPolicy

# Create latched publisher for robot description
qos_profile = QoSProfile(depth=1, durability=DurabilityPolicy.TRANSIENT_LOCAL)
self.urdf_publisher = self.create_publisher(
    String,
    'robot_description',
    qos_profile
)

# Publish once; all future subscribers will receive it
urdf_msg = String()
urdf_msg.data = load_urdf_file('my_robot.urdf')
self.urdf_publisher.publish(urdf_msg)
```

**Reliability Strategies:**

For critical data (e.g., joint commands to a physical robot), combine:

1. **Reliable QoS:** Ensures delivery
2. **Sequence Numbers:** Detect dropped messages at application level
3. **Watchdog Timers:** Detect communication failures
4. **Fallback Behaviors:** Safe defaults when communication fails

```python
class ReliableSubscriber(Node):
    def __init__(self):
        super().__init__('reliable_subscriber')

        self.last_seq = -1
        self.create_subscription(
            JointCommand,
            'joint_commands',
            self.command_callback,
            QoSProfile(reliability=ReliabilityPolicy.RELIABLE, depth=10)
        )

        # Watchdog: trigger if no message received in 1 second
        self.watchdog = self.create_timer(1.0, self.check_watchdog)
        self.last_msg_time = self.get_clock().now()

    def command_callback(self, msg):
        # Check sequence
        if msg.sequence != self.last_seq + 1:
            self.get_logger().warn(f'Dropped messages detected: {self.last_seq} → {msg.sequence}')

        self.last_seq = msg.sequence
        self.last_msg_time = self.get_clock().now()

        # Process command
        self.execute_joint_command(msg)

    def check_watchdog(self):
        elapsed = (self.get_clock().now() - self.last_msg_time).nanoseconds / 1e9
        if elapsed > 1.0:
            self.get_logger().error('Watchdog triggered: no commands received')
            self.execute_safe_stop()
```

### 3.4 Best Practices for Topic Design

**1. Namespace Your Topics**

Use hierarchical namespaces to organize topics logically:

```
/robot_name/sensor_type/data_stream
  /atlas/camera/left/image_raw
  /atlas/camera/left/camera_info
  /atlas/imu/data
  /atlas/joint_states
```

**2. Use Standard Message Types When Possible**

Prefer `sensor_msgs`, `geometry_msgs`, etc., over custom messages to maximize interoperability with existing tools (RViz, rosbag, rqt).

**3. Include Timestamps and Frame IDs**

Always populate `header` fields for spatiotemporal data:

```python
msg.header.stamp = self.get_clock().now().to_msg()
msg.header.frame_id = 'camera_optical_frame'
```

**4. Avoid Publishing Redundant Data**

Don't publish both raw and processed versions on the same topic; use separate topics:

```
/camera/image_raw        # Raw Bayer pattern
/camera/image_rect       # Rectified RGB
/camera/image_compressed # JPEG-compressed
```

**5. Document QoS Requirements**

In node documentation, specify expected QoS profiles for published/subscribed topics.

**6. Monitor Topic Health**

Use CLI tools to inspect topic behavior:

```bash
# Check topic publication rate
ros2 topic hz /camera/image

# Monitor topic bandwidth
ros2 topic bw /camera/image

# Echo messages (watch data in real-time)
ros2 topic echo /temperature

# Inspect message type
ros2 topic type /camera/image
```

### 3.5 Code Example: Publisher and Subscriber

**Publisher: Joint State Publisher**

```python
#!/usr/bin/env python3
"""
Joint State Publisher

Publishes simulated joint states for a humanoid robot arm.
Demonstrates array messages, timestamps, and periodic publishing.
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
import math


class JointStatePublisher(Node):
    """Publishes periodic joint state updates."""

    def __init__(self):
        super().__init__('joint_state_publisher')

        # Joint names for a 7-DOF arm
        self.joint_names = [
            'shoulder_pan', 'shoulder_lift', 'shoulder_roll',
            'elbow_flex', 'wrist_flex', 'wrist_roll', 'gripper'
        ]

        # Create publisher
        self.publisher = self.create_publisher(
            JointState,
            'joint_states',
            10
        )

        # Publish at 50 Hz
        self.timer = self.create_timer(0.02, self.publish_joint_states)

        self.t = 0.0
        self.get_logger().info('Joint state publisher started')

    def publish_joint_states(self):
        """Publish simulated joint positions."""
        msg = JointState()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.name = self.joint_names

        # Simulate sinusoidal joint motion
        msg.position = [
            0.5 * math.sin(self.t),           # shoulder_pan
            0.3 * math.cos(self.t),           # shoulder_lift
            0.2 * math.sin(2 * self.t),       # shoulder_roll
            0.7 * math.cos(self.t),           # elbow_flex
            0.4 * math.sin(1.5 * self.t),     # wrist_flex
            0.3 * math.cos(2 * self.t),       # wrist_roll
            0.1 * math.sin(self.t)            # gripper
        ]

        # Compute velocities (derivative of position)
        msg.velocity = [
            0.5 * math.cos(self.t),
            -0.3 * math.sin(self.t),
            0.4 * math.cos(2 * self.t),
            -0.7 * math.sin(self.t),
            0.6 * math.cos(1.5 * self.t),
            -0.6 * math.sin(2 * self.t),
            0.1 * math.cos(self.t)
        ]

        # Placeholder efforts (torques)
        msg.effort = [0.0] * len(self.joint_names)

        self.publisher.publish(msg)
        self.t += 0.02


def main(args=None):
    rclpy.init(args=args)
    node = JointStatePublisher()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Subscriber: Joint State Monitor**

```python
#!/usr/bin/env python3
"""
Joint State Monitor

Subscribes to joint states and computes statistics.
Demonstrates subscription callbacks and data processing.
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
import numpy as np


class JointStateMonitor(Node):
    """Monitors joint states and logs statistics."""

    def __init__(self):
        super().__init__('joint_state_monitor')

        # Create subscription
        self.subscription = self.create_subscription(
            JointState,
            'joint_states',
            self.joint_state_callback,
            10
        )

        # Statistics storage
        self.position_history = {}
        self.max_history = 100

        # Periodic statistics reporting
        self.create_timer(5.0, self.report_statistics)

        self.get_logger().info('Joint state monitor started')

    def joint_state_callback(self, msg: JointState):
        """Process incoming joint state message."""
        # Validate message
        if len(msg.name) != len(msg.position):
            self.get_logger().warn('Mismatched joint names and positions')
            return

        # Store positions in history
        for name, position in zip(msg.name, msg.position):
            if name not in self.position_history:
                self.position_history[name] = []

            self.position_history[name].append(position)

            # Maintain fixed history size
            if len(self.position_history[name]) > self.max_history:
                self.position_history[name].pop(0)

    def report_statistics(self):
        """Log statistical summary of joint positions."""
        if not self.position_history:
            return

        self.get_logger().info('=== Joint Statistics (last 100 samples) ===')

        for joint_name, positions in self.position_history.items():
            if not positions:
                continue

            mean_pos = np.mean(positions)
            std_pos = np.std(positions)
            min_pos = np.min(positions)
            max_pos = np.max(positions)

            self.get_logger().info(
                f'{joint_name:15s}: '
                f'mean={mean_pos:6.3f}, std={std_pos:6.3f}, '
                f'range=[{min_pos:6.3f}, {max_pos:6.3f}]'
            )


def main(args=None):
    rclpy.init(args=args)
    node = JointStateMonitor()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Running both nodes:**

```bash
# Terminal 1: Start publisher
ros2 run my_package joint_state_publisher

# Terminal 2: Start monitor
ros2 run my_package joint_state_monitor

# Terminal 3: Verify topic connection
ros2 topic info /joint_states
```

**Expected output (monitor):**

```
[INFO] [joint_state_monitor]: Joint state monitor started
[INFO] [joint_state_monitor]: === Joint Statistics (last 100 samples) ===
[INFO] [joint_state_monitor]: shoulder_pan   : mean= 0.012, std= 0.354, range=[-0.500,  0.500]
[INFO] [joint_state_monitor]: shoulder_lift  : mean=-0.003, std= 0.212, range=[-0.300,  0.300]
...
```

**Key Takeaway:** The pub/sub pattern decouples data producers (publishers) from consumers (subscribers). The monitor node has no knowledge of the publisher's implementation—it simply subscribes to a topic contract. This enables modular development and testing (e.g., swap the simulated publisher with a real robot driver without changing the monitor).

---

## 4. Services and Request/Reply Pattern

### 4.1 Service Definitions

**Services** enable synchronous, transactional interactions between nodes. Unlike topics (continuous streams), services are called explicitly and return a response.

**Service anatomy:**

A service definition file (`.srv`) specifies request and response structures:

**Example: `AddTwoInts.srv`**

```
# Request
int64 a
int64 b
---
# Response
int64 sum
```

The `---` separator divides request fields (above) from response fields (below).

**Standard service types:**

- `std_srvs/SetBool`: Enable/disable functionality (request: bool, response: bool success, string message)
- `std_srvs/Trigger`: Trigger an action (request: empty, response: bool success, string message)
- `sensor_msgs/srv/SetCameraInfo`: Configure camera parameters

### 4.2 Request/Reply Pattern

**Service client:**

1. Sends request to server
2. Blocks (waits) for response
3. Receives response or timeout

**Service server:**

1. Listens for requests
2. Processes request (runs callback)
3. Sends response

**Synchronous vs. Asynchronous Calls:**

**Synchronous (blocking):**

```python
response = client.call(request)  # Blocks until response or timeout
```

**Asynchronous (non-blocking):**

```python
future = client.call_async(request)
# Do other work...
rclpy.spin_until_future_complete(node, future)
response = future.result()
```

**When to use services:**

- **Configuration:** Set camera exposure, update PID gains
- **Triggered Computations:** Compute inverse kinematics for target pose
- **State Queries:** Get battery level, check system status
- **One-off Operations:** Save map, reset odometry

**When NOT to use services:**

- **High-frequency data:** Use topics instead (services have overhead)
- **Fire-and-forget:** If no response needed, use topics
- **Long-running tasks:** Use actions (services timeout)

### 4.3 Synchronous vs. Asynchronous

**Synchronous services block the calling thread**, which can freeze node execution if the server is slow or unresponsive. Use asynchronous calls in time-critical nodes:

**Problematic synchronous call:**

```python
def control_loop(self):
    # BAD: Blocks control loop until IK service responds
    response = self.ik_client.call(ik_request)
    self.execute_trajectory(response.joint_positions)
```

**Improved asynchronous call:**

```python
def control_loop(self):
    # GOOD: Send request, continue control loop
    future = self.ik_client.call_async(ik_request)
    future.add_done_callback(self.handle_ik_response)

def handle_ik_response(self, future):
    try:
        response = future.result()
        self.execute_trajectory(response.joint_positions)
    except Exception as e:
        self.get_logger().error(f'IK service failed: {e}')
```

:::tip Performance Consideration
For real-time control loops (e.g., 1 kHz joint control), avoid service calls entirely within the loop. Pre-compute necessary values or use asynchronous patterns with separate execution threads.
:::

### 4.4 Practical Tutorial: Building a Calculator Service

Let's build a complete service example: a calculator that performs arithmetic operations.

**Step 1: Define Service (`srv/Calculate.srv`)**

```
# Request: operation and operands
string operation  # "add", "subtract", "multiply", "divide"
float64 a
float64 b
---
# Response: result and status
float64 result
bool success
string message
```

**Step 2: Implement Service Server**

```python
#!/usr/bin/env python3
"""
Calculator Service Server

Provides arithmetic operations via ROS 2 service.
Demonstrates service creation, request validation, and error handling.
"""

import rclpy
from rclpy.node import Node
from my_package.srv import Calculate


class CalculatorServer(Node):
    """Service server providing arithmetic calculations."""

    def __init__(self):
        super().__init__('calculator_server')

        # Create service
        self.service = self.create_service(
            Calculate,
            'calculate',
            self.calculate_callback
        )

        self.get_logger().info('Calculator service ready')

    def calculate_callback(self, request, response):
        """
        Process calculation request and populate response.

        Args:
            request (Calculate.Request): Contains operation and operands
            response (Calculate.Response): To be populated with result

        Returns:
            Calculate.Response: Populated response
        """
        op = request.operation.lower()
        a, b = request.a, request.b

        self.get_logger().info(f'Received request: {a} {op} {b}')

        try:
            if op == 'add':
                response.result = a + b
            elif op == 'subtract':
                response.result = a - b
            elif op == 'multiply':
                response.result = a * b
            elif op == 'divide':
                if b == 0.0:
                    raise ValueError('Division by zero')
                response.result = a / b
            else:
                raise ValueError(f'Unknown operation: {op}')

            response.success = True
            response.message = f'Successfully computed {a} {op} {b} = {response.result}'

        except Exception as e:
            response.success = False
            response.result = 0.0
            response.message = f'Error: {str(e)}'
            self.get_logger().error(response.message)

        return response


def main(args=None):
    rclpy.init(args=args)
    node = CalculatorServer()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Step 3: Implement Service Client**

```python
#!/usr/bin/env python3
"""
Calculator Service Client

Calls calculator service with user-provided operations.
Demonstrates asynchronous service calls and error handling.
"""

import rclpy
from rclpy.node import Node
from my_package.srv import Calculate
import sys


class CalculatorClient(Node):
    """Service client for calculator operations."""

    def __init__(self):
        super().__init__('calculator_client')

        # Create service client
        self.client = self.create_client(Calculate, 'calculate')

        # Wait for service to become available
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Waiting for calculator service...')

        self.get_logger().info('Connected to calculator service')

    def call_calculate(self, operation, a, b):
        """
        Call calculator service asynchronously.

        Args:
            operation (str): Operation name
            a (float): First operand
            b (float): Second operand

        Returns:
            Calculate.Response: Service response
        """
        request = Calculate.Request()
        request.operation = operation
        request.a = a
        request.b = b

        self.get_logger().info(f'Calling service: {a} {operation} {b}')

        # Asynchronous call
        future = self.client.call_async(request)
        rclpy.spin_until_future_complete(self, future)

        if future.result() is not None:
            return future.result()
        else:
            self.get_logger().error('Service call failed')
            return None


def main(args=None):
    rclpy.init(args=args)

    # Parse command-line arguments
    if len(sys.argv) < 4:
        print('Usage: calculator_client <operation> <a> <b>')
        print('Example: calculator_client add 5.0 3.0')
        return

    operation = sys.argv[1]
    a = float(sys.argv[2])
    b = float(sys.argv[3])

    # Create client and call service
    client = CalculatorClient()
    response = client.call_calculate(operation, a, b)

    if response:
        if response.success:
            client.get_logger().info(f'Result: {response.result}')
            client.get_logger().info(f'Message: {response.message}')
        else:
            client.get_logger().error(f'Operation failed: {response.message}')

    client.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Running the calculator service:**

```bash
# Terminal 1: Start server
ros2 run my_package calculator_server

# Terminal 2: Call service via client
ros2 run my_package calculator_client add 10.0 5.0

# Output:
# [INFO] [calculator_client]: Calling service: 10.0 add 5.0
# [INFO] [calculator_client]: Result: 15.0
# [INFO] [calculator_client]: Message: Successfully computed 10.0 add 5.0 = 15.0

# Test error handling
ros2 run my_package calculator_client divide 10.0 0.0

# Output:
# [ERROR] [calculator_client]: Operation failed: Error: Division by zero
```

**Alternative: CLI-based service call**

```bash
# Call service directly from command line
ros2 service call /calculate my_package/srv/Calculate "{operation: 'multiply', a: 7.0, b: 6.0}"

# Response:
# result: 42.0
# success: true
# message: 'Successfully computed 7.0 multiply 6.0 = 42.0'
```

**Key implementation details:**

- **Input Validation:** Server validates operation type and operands (prevents division by zero)
- **Error Reporting:** Response includes `success` flag and human-readable `message`
- **Asynchronous Client:** Uses `call_async()` to avoid blocking
- **Service Discovery:** Client waits for server availability before attempting calls

**Key Takeaway:** Services provide a robust mechanism for request/reply interactions. Unlike topics, services guarantee a response (or timeout), making them ideal for operations where confirmation is required. The calculator example demonstrates error handling, validation, and graceful failure—essential patterns for production systems.

---

## Summary

This lesson covered the foundational communication patterns in ROS 2:

- **Nodes** are the fundamental computational units in ROS 2, each with a well-defined responsibility. Lifecycle nodes provide deterministic state management for controlled startup and shutdown.

- **Topics** implement the publish/subscribe pattern for continuous data streams. Publishers send messages asynchronously; subscribers receive them without direct coupling. Quality of Service (QoS) policies control reliability, durability, and history.

- **Services** implement the request/reply pattern for synchronous, transactional interactions. Clients send requests and block (or wait asynchronously) for server responses. Services are ideal for triggered computations, configuration, and state queries.

- **The ROS 2 Graph** visualizes the network of nodes and communication channels. Understanding graph structure is essential for debugging and system design.

- **Debugging Tools** like `ros2 node`, `ros2 topic`, and `ros2 service` enable inspection of live systems, facilitating rapid troubleshooting.

**Key Architectural Principles:**

1. **Loose Coupling:** Nodes communicate through defined interfaces (topics/services), not direct function calls
2. **Modularity:** Each node has a single, testable responsibility
3. **Scalability:** Add nodes without modifying existing code
4. **Fault Isolation:** Node crashes don't propagate; affected subsystems can recover independently

By mastering these patterns, you can design robotic systems that are maintainable, testable, and resilient—critical properties for complex applications like humanoid robotics.

---

## Further Reading

- **ROS 2 Documentation:** [https://docs.ros.org/en/humble/](https://docs.ros.org/en/humble/) — Official ROS 2 tutorials and API reference
- **DDS Specification:** [https://www.omg.org/spec/DDS/](https://www.omg.org/spec/DDS/) — Underlying middleware standard
- **QoS Design Patterns:** [ROS 2 QoS Guide](https://docs.ros.org/en/humble/Concepts/About-Quality-of-Service-Settings.html) — Deep dive into QoS configuration
- **rclpy API Documentation:** [https://docs.ros2.org/latest/api/rclpy/](https://docs.ros2.org/latest/api/rclpy/) — Python client library reference
- **ROS 2 Design Documents:** [https://design.ros2.org/](https://design.ros2.org/) — Architectural decisions and rationale

**Next Steps:** In the following lessons, we'll explore Python development with rclpy in depth, then examine URDF for robot description. These build directly on the communication patterns you've learned here.
