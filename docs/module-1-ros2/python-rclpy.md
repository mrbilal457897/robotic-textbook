---
title: "Python with rclpy"
sidebar_label: "Python with rclpy"
sidebar_position: 2
description: "Master ROS 2 Python development with rclpy. Set up your environment, create nodes, write publishers and subscribers, and apply production-ready best practices."
reading_time: "~28 minutes"
---

# Python with rclpy

**Reading Time:** ~28 minutes
**Difficulty Level:** Intermediate

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Set up** a ROS 2 Python development environment with proper workspace structure and build tools
2. **Create and manage** ROS 2 nodes using rclpy, including initialization, execution, and graceful shutdown
3. **Write** publishers and subscribers with appropriate message types, QoS settings, and callback patterns
4. **Handle** errors and logging effectively using ROS 2's logger infrastructure
5. **Apply** best practices for production-ready code, including testing, performance optimization, and maintainability

---

## Introduction

While ROS 2 supports multiple programming languages (C++, Python, and others through language bindings), **Python** has emerged as the preferred choice for rapid prototyping, research applications, and high-level robotic behaviors. The **rclpy** library (ROS Client Library for Python) provides idiomatic Python interfaces to ROS 2's core functionality—nodes, publishers, subscribers, services, actions, parameters, and timers.

Python's expressiveness and rich ecosystem (NumPy for numerical computation, OpenCV for vision, TensorFlow/PyTorch for machine learning) make it ideal for robotics development. However, Python's performance characteristics require careful consideration: while suitable for perception, planning, and control coordination, computationally intensive tasks (low-level control loops, real-time processing) often benefit from C++ implementations.

This lesson guides you through the complete lifecycle of ROS 2 Python development: from environment setup through building production-ready nodes. We'll explore common patterns, examine working code examples, and address practical challenges you'll encounter when developing real robotic systems.

:::tip Simulation-First Philosophy
Throughout this lesson, all examples are designed for simulation environments (Gazebo, Isaac Sim). This enables rapid iteration without hardware dependencies, and the code you write will transfer directly to physical robots once hardware interfaces are available.
:::

---

## 1. Introduction to rclpy

### 1.1 What is rclpy?

**rclpy** (ROS Client Library for Python) is the official Python API for ROS 2. It provides Python bindings to the underlying ROS 2 middleware (DDS) and implements the ROS 2 computational graph abstractions—nodes, topics, services, actions, parameters, and more.

**rclpy architecture:**

```
┌─────────────────────────────────────┐
│   Your Python Application           │
│   (Nodes, Publishers, Subscribers)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         rclpy Library               │
│  (Python API, Executors, Timers)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      rcl (ROS Client Library)       │
│      (C implementation)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   DDS Middleware (Fast-DDS, etc.)   │
│   (Network communication layer)     │
└─────────────────────────────────────┘
```

**Key features:**

- **Object-Oriented Design:** Nodes are Python classes; callbacks are methods
- **Pythonic Idioms:** Context managers, decorators, type hints (in modern ROS 2 versions)
- **Integration with Python Ecosystem:** Use NumPy arrays, OpenCV images, ML frameworks seamlessly
- **Garbage Collection Aware:** Proper resource cleanup when nodes are destroyed

### 1.2 Relationship to ROS 2 Core

rclpy is one of several client libraries (rcl* family):

- **rclcpp:** C++ client library (highest performance, lowest overhead)
- **rclpy:** Python client library (rapid development, ecosystem integration)
- **rclnodejs:** JavaScript client library (web interfaces, IoT)
- **rclada, rcljava, rclrust:** Community-supported libraries for other languages

All client libraries interact with the same underlying **rcl** (ROS Client Library) C implementation, ensuring consistent behavior across languages. This means:

- **Interoperability:** Python nodes communicate seamlessly with C++ nodes
- **Consistent API:** Concepts (nodes, topics, QoS) work identically across languages
- **Portability:** Switching from Python to C++ (for performance) requires minimal redesign

### 1.3 Development Environment Overview

A typical ROS 2 Python development environment includes:

1. **ROS 2 Installation:** Core libraries, middleware, CLI tools
2. **Workspace:** Organized directory structure for your packages
3. **Build System (colcon):** Builds and installs packages
4. **IDE/Editor:** VS Code, PyCharm, or Vim with ROS 2 extensions
5. **Python Environment:** Virtual environment or system Python (≥3.8)

**Development workflow:**

```
1. Create/modify Python code
2. Build workspace with colcon
3. Source workspace overlay
4. Run nodes with ros2 run
5. Test with ros2 topic/service/param commands
6. Debug with logs and visualization tools
7. Iterate
```

**Key Takeaway:** rclpy abstracts low-level ROS 2 details, enabling you to focus on robot behavior rather than middleware configuration. Understanding rclpy's relationship to the ROS 2 stack helps you diagnose issues and optimize performance when needed.

---

## 2. Setting Up Your Environment

### 2.1 Installing ROS 2

ROS 2 is available for Ubuntu, macOS, and Windows. This guide assumes **ROS 2 Humble Hawksbill** (LTS release) on **Ubuntu 22.04**, though concepts apply to other versions and platforms.

**Installation steps (Ubuntu 22.04):**

```bash
# Set locale
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8

# Add ROS 2 repository
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

# Install ROS 2 Humble Desktop (includes RViz, demos, tutorials)
sudo apt update
sudo apt install ros-humble-desktop

# Install development tools
sudo apt install python3-colcon-common-extensions python3-rosdep
```

**Verify installation:**

```bash
# Source ROS 2 environment
source /opt/ros/humble/setup.bash

# Test with a demo
ros2 run demo_nodes_py talker
# You should see: [INFO] [talker]: Publishing: "Hello World: 1"
```

**Windows/macOS users:** Refer to official installation guides at [docs.ros.org](https://docs.ros.org/en/humble/Installation.html).

### 2.2 Creating a Workspace

A **ROS 2 workspace** organizes your packages using a standard directory structure. The **colcon** build system expects this layout.

**Workspace structure:**

```
ros2_ws/                      # Workspace root
├── src/                      # Source code (your packages go here)
│   ├── my_robot_package/
│   │   ├── my_robot_package/
│   │   │   ├── __init__.py
│   │   │   ├── node1.py
│   │   │   └── node2.py
│   │   ├── package.xml      # Package metadata
│   │   ├── setup.py          # Python package setup
│   │   └── setup.cfg
│   └── another_package/
├── build/                    # Build artifacts (auto-generated)
├── install/                  # Installed packages (auto-generated)
└── log/                      # Build logs (auto-generated)
```

**Create workspace:**

```bash
# Create workspace directory
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws

# Initialize rosdep (dependency management)
sudo rosdep init  # Only needed once per system
rosdep update

# Build workspace (even though it's empty)
colcon build

# Source workspace overlay
source install/setup.bash
```

**Sourcing explained:**

- `source /opt/ros/humble/setup.bash` — Loads ROS 2 base installation
- `source ~/ros2_ws/install/setup.bash` — Overlays your workspace (includes base + your packages)

**Always source your workspace** before running your nodes, otherwise ROS 2 won't find them.

:::warning Common Mistake
Forgetting to source the workspace after rebuilding is a frequent cause of "package not found" errors. Add `source ~/ros2_ws/install/setup.bash` to your `~/.bashrc` for convenience, or use workspace-specific aliases.
:::

### 2.3 The Colcon Build System

**colcon** (collective construction) is the ROS 2 build tool. It discovers packages, resolves dependencies, and builds them in topological order.

**Basic colcon commands:**

```bash
# Build all packages
colcon build

# Build specific package
colcon build --packages-select my_robot_package

# Build with symbolic links (changes to Python files take effect immediately, no rebuild needed)
colcon build --symlink-install

# Build in parallel (faster)
colcon build --parallel-workers 4

# Clean build artifacts
rm -rf build/ install/ log/
```

**Why `--symlink-install` is essential for Python:**

Without it, colcon copies Python files to `install/`. Every code change requires a rebuild. With `--symlink-install`, colcon creates symbolic links—changes to source files are immediately visible.

**Example workflow:**

```bash
# Initial build with symlinks
cd ~/ros2_ws
colcon build --symlink-install

# Modify Python code in src/my_robot_package/my_robot_package/node1.py
# No rebuild needed! Just source and run:
source install/setup.bash
ros2 run my_robot_package node1
```

**Dependency management with rosdep:**

```bash
# Install dependencies for all packages in workspace
cd ~/ros2_ws
rosdep install --from-paths src --ignore-src -r -y
```

This reads `package.xml` files, resolves dependencies, and installs missing packages.

### 2.4 VS Code Setup for ROS 2

**Visual Studio Code** is a popular choice for ROS 2 development. The ROS extension provides syntax highlighting, code completion, and debugging support.

**Setup steps:**

1. **Install VS Code:** [https://code.visualstudio.com/](https://code.visualstudio.com/)

2. **Install ROS extension:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "ROS" (by Microsoft)
   - Install

3. **Configure workspace:**

Create `.vscode/settings.json` in your workspace root:

```json
{
  "ros.distro": "humble",
  "python.autoComplete.extraPaths": [
    "/opt/ros/humble/lib/python3.10/site-packages",
    "${workspaceFolder}/install/my_robot_package/lib/python3.10/site-packages"
  ],
  "python.analysis.extraPaths": [
    "/opt/ros/humble/lib/python3.10/site-packages",
    "${workspaceFolder}/install/my_robot_package/lib/python3.10/site-packages"
  ],
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "editor.formatOnSave": true,
  "python.formatting.provider": "black"
}
```

4. **Install Python tools:**

```bash
pip3 install black pylint mypy
```

**Debugging in VS Code:**

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ROS: Launch Node",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/install/my_robot_package/lib/my_robot_package/my_node",
      "console": "integratedTerminal",
      "env": {
        "PYTHONPATH": "${env:PYTHONPATH}:${workspaceFolder}/install/my_robot_package/lib/python3.10/site-packages"
      }
    }
  ]
}
```

Now you can set breakpoints, inspect variables, and step through code.

**Key Takeaway:** Proper environment setup accelerates development. Invest time configuring your workspace, build system, and IDE—it pays dividends in productivity and reduces frustrating debugging sessions.

---

## 3. Writing Your First Publisher

### 3.1 Package Creation

Before writing nodes, create a Python package using the ROS 2 package template.

```bash
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python my_robot_package --dependencies rclpy std_msgs
```

This generates:

```
my_robot_package/
├── my_robot_package/
│   └── __init__.py
├── package.xml
├── setup.py
├── setup.cfg
├── resource/
│   └── my_robot_package
└── test/
    ├── test_copyright.py
    ├── test_flake8.py
    └── test_pep257.py
```

**Key files:**

- **package.xml:** Package metadata (name, version, dependencies, maintainer)
- **setup.py:** Python package setup (entry points for nodes)
- **setup.cfg:** Configuration for install locations

### 3.2 Node Creation Fundamentals

A minimal ROS 2 Python node requires:

1. Import `rclpy` and `Node` class
2. Define a class inheriting from `Node`
3. Initialize the node with a name
4. Implement main function with initialization, spinning, and shutdown

**Minimal node template:**

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node


class MinimalNode(Node):
    def __init__(self):
        super().__init__('minimal_node')
        self.get_logger().info('Minimal node started')


def main(args=None):
    rclpy.init(args=args)
    node = MinimalNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Breakdown:**

- `rclpy.init()`: Initializes ROS 2 communication
- `MinimalNode()`: Creates node instance
- `rclpy.spin(node)`: Processes callbacks (blocks forever)
- `node.destroy_node()`: Cleanup
- `rclpy.shutdown()`: Final ROS 2 shutdown

### 3.3 Creating a Publisher

Let's create a node that publishes string messages to a topic.

**File: `my_robot_package/string_publisher.py`**

```python
#!/usr/bin/env python3
"""
String Publisher Node

Publishes periodic string messages to demonstrate basic publishing patterns.
"""

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class StringPublisher(Node):
    """Publishes string messages at a fixed rate."""

    def __init__(self):
        super().__init__('string_publisher')

        # Declare parameters
        self.declare_parameter('publish_rate', 1.0)  # Hz
        self.declare_parameter('topic_name', 'chatter')

        # Get parameter values
        rate = self.get_parameter('publish_rate').value
        topic = self.get_parameter('topic_name').value

        # Create publisher
        self.publisher = self.create_publisher(
            String,        # Message type
            topic,         # Topic name
            10             # Queue size (QoS depth)
        )

        # Create timer for periodic publishing
        self.timer = self.create_timer(1.0 / rate, self.timer_callback)

        self.counter = 0
        self.get_logger().info(f'Publishing to "{topic}" at {rate} Hz')

    def timer_callback(self):
        """Called periodically to publish messages."""
        msg = String()
        msg.data = f'Hello World: {self.counter}'

        self.publisher.publish(msg)
        self.get_logger().info(f'Published: "{msg.data}"')

        self.counter += 1


def main(args=None):
    rclpy.init(args=args)
    node = StringPublisher()

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

### 3.4 Registering the Node as an Executable

Edit `setup.py` to register the node as an executable:

```python
from setuptools import setup

package_name = 'my_robot_package'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Your Name',
    maintainer_email='your.email@example.com',
    description='ROS 2 tutorial package',
    license='Apache License 2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'string_publisher = my_robot_package.string_publisher:main',
        ],
    },
)
```

**Build and run:**

```bash
cd ~/ros2_ws
colcon build --packages-select my_robot_package --symlink-install
source install/setup.bash

# Run the node
ros2 run my_robot_package string_publisher

# Output:
# [INFO] [string_publisher]: Publishing to "chatter" at 1.0 Hz
# [INFO] [string_publisher]: Published: "Hello World: 0"
# [INFO] [string_publisher]: Published: "Hello World: 1"
# ...
```

**Verify with CLI tools:**

```bash
# In another terminal
source ~/ros2_ws/install/setup.bash

# List active topics
ros2 topic list
# /chatter

# Echo messages
ros2 topic echo /chatter
# data: 'Hello World: 5'
# ---

# Check publication rate
ros2 topic hz /chatter
# average rate: 1.000
```

### 3.5 Advanced Publisher Example: Sensor Data

Let's create a more realistic publisher that simulates an IMU (Inertial Measurement Unit) sensor.

**File: `my_robot_package/imu_publisher.py`**

```python
#!/usr/bin/env python3
"""
IMU Sensor Publisher

Simulates an IMU sensor publishing orientation, angular velocity, and linear acceleration.
Demonstrates complex message types and realistic sensor simulation.
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu
from std_msgs.msg import Header
import math
import random


class ImuPublisher(Node):
    """Simulated IMU sensor publisher."""

    def __init__(self):
        super().__init__('imu_publisher')

        # Parameters
        self.declare_parameter('publish_rate', 100.0)  # IMUs typically run at 100+ Hz
        self.declare_parameter('frame_id', 'imu_link')
        self.declare_parameter('noise_level', 0.01)

        rate = self.get_parameter('publish_rate').value
        self.frame_id = self.get_parameter('frame_id').value
        self.noise = self.get_parameter('noise_level').value

        # Create publisher with sensor QoS profile
        from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy

        qos_profile = QoSProfile(
            reliability=ReliabilityPolicy.BEST_EFFORT,
            history=HistoryPolicy.KEEP_LAST,
            depth=10
        )

        self.publisher = self.create_publisher(
            Imu,
            'imu/data',
            qos_profile
        )

        self.timer = self.create_timer(1.0 / rate, self.publish_imu_data)

        self.time = 0.0
        self.dt = 1.0 / rate

        self.get_logger().info(f'IMU publisher started at {rate} Hz')

    def publish_imu_data(self):
        """Generate and publish IMU data."""
        msg = Imu()

        # Header
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.header.frame_id = self.frame_id

        # Simulate orientation (rotating around Z-axis)
        yaw = math.sin(self.time)  # Oscillating yaw
        pitch = 0.0
        roll = 0.0

        # Convert Euler to quaternion (simplified for Z-rotation)
        msg.orientation.x = 0.0
        msg.orientation.y = 0.0
        msg.orientation.z = math.sin(yaw / 2.0)
        msg.orientation.w = math.cos(yaw / 2.0)

        # Orientation covariance (known orientation)
        msg.orientation_covariance[0] = self.noise
        msg.orientation_covariance[4] = self.noise
        msg.orientation_covariance[8] = self.noise

        # Angular velocity (derivative of orientation)
        msg.angular_velocity.x = 0.0
        msg.angular_velocity.y = 0.0
        msg.angular_velocity.z = math.cos(self.time) + random.gauss(0, self.noise)

        msg.angular_velocity_covariance[0] = self.noise
        msg.angular_velocity_covariance[4] = self.noise
        msg.angular_velocity_covariance[8] = self.noise

        # Linear acceleration (gravity + noise)
        msg.linear_acceleration.x = random.gauss(0, self.noise)
        msg.linear_acceleration.y = random.gauss(0, self.noise)
        msg.linear_acceleration.z = 9.81 + random.gauss(0, self.noise)

        msg.linear_acceleration_covariance[0] = self.noise
        msg.linear_acceleration_covariance[4] = self.noise
        msg.linear_acceleration_covariance[8] = self.noise

        self.publisher.publish(msg)
        self.time += self.dt


def main(args=None):
    rclpy.init(args=args)
    node = ImuPublisher()

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

**Register in `setup.py`:**

```python
entry_points={
    'console_scripts': [
        'string_publisher = my_robot_package.string_publisher:main',
        'imu_publisher = my_robot_package.imu_publisher:main',
    ],
},
```

**Run and inspect:**

```bash
colcon build --packages-select my_robot_package --symlink-install
source install/setup.bash

ros2 run my_robot_package imu_publisher

# In another terminal
ros2 topic echo /imu/data --once
# header:
#   stamp:
#     sec: 1234567890
#     nanosec: 123456789
#   frame_id: imu_link
# orientation:
#   x: 0.0
#   y: 0.0
#   z: 0.12345
#   w: 0.98765
# ...
```

**Key Takeaway:** Publishers are straightforward to implement in rclpy. The pattern is always the same: create publisher, create timer, populate message in callback, publish. Focus on choosing appropriate message types, QoS settings, and publication rates for your application.

---

## 4. Writing Your First Subscriber

### 4.1 Subscription Fundamentals

Subscribers listen to topics and invoke callbacks when messages arrive. The callback receives the message as an argument.

**Basic subscription pattern:**

```python
class MySubscriber(Node):
    def __init__(self):
        super().__init__('my_subscriber')

        self.subscription = self.create_subscription(
            String,                  # Message type
            'chatter',               # Topic name
            self.listener_callback,  # Callback function
            10                       # QoS depth
        )

    def listener_callback(self, msg):
        self.get_logger().info(f'Received: "{msg.data}"')
```

### 4.2 String Subscriber Example

Let's create a subscriber that listens to the publisher we created earlier.

**File: `my_robot_package/string_subscriber.py`**

```python
#!/usr/bin/env python3
"""
String Subscriber Node

Subscribes to string messages and logs them.
Demonstrates basic subscription pattern.
"""

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class StringSubscriber(Node):
    """Subscribes to string messages."""

    def __init__(self):
        super().__init__('string_subscriber')

        # Declare parameters
        self.declare_parameter('topic_name', 'chatter')

        topic = self.get_parameter('topic_name').value

        # Create subscription
        self.subscription = self.create_subscription(
            String,
            topic,
            self.listener_callback,
            10
        )

        self.message_count = 0
        self.get_logger().info(f'Subscribed to "{topic}"')

    def listener_callback(self, msg):
        """Called when a message is received."""
        self.message_count += 1
        self.get_logger().info(
            f'[{self.message_count}] Received: "{msg.data}"'
        )


def main(args=None):
    rclpy.init(args=args)
    node = StringSubscriber()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.get_logger().info(
            f'Shutting down. Total messages received: {node.message_count}'
        )
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Register in `setup.py`:**

```python
entry_points={
    'console_scripts': [
        'string_publisher = my_robot_package.string_publisher:main',
        'imu_publisher = my_robot_package.imu_publisher:main',
        'string_subscriber = my_robot_package.string_subscriber:main',
    ],
},
```

**Run publisher and subscriber together:**

```bash
# Terminal 1: Publisher
ros2 run my_robot_package string_publisher

# Terminal 2: Subscriber
ros2 run my_robot_package string_subscriber

# Output (subscriber):
# [INFO] [string_subscriber]: Subscribed to "chatter"
# [INFO] [string_subscriber]: [1] Received: "Hello World: 12"
# [INFO] [string_subscriber]: [2] Received: "Hello World: 13"
# ...
```

### 4.3 Advanced Subscriber Example: Joint State Monitor

Let's create a subscriber that processes joint state data and computes useful statistics.

**File: `my_robot_package/joint_state_monitor.py`**

```python
#!/usr/bin/env python3
"""
Joint State Monitor

Subscribes to joint states and computes real-time statistics.
Demonstrates message processing, data buffering, and periodic reporting.
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
import numpy as np
from collections import defaultdict


class JointStateMonitor(Node):
    """Monitors joint states and computes statistics."""

    def __init__(self):
        super().__init__('joint_state_monitor')

        # Parameters
        self.declare_parameter('buffer_size', 100)
        self.declare_parameter('report_interval', 5.0)  # seconds

        self.buffer_size = self.get_parameter('buffer_size').value
        report_interval = self.get_parameter('report_interval').value

        # Subscription
        self.subscription = self.create_subscription(
            JointState,
            'joint_states',
            self.joint_state_callback,
            10
        )

        # Data storage
        self.joint_data = defaultdict(lambda: {
            'positions': [],
            'velocities': [],
            'efforts': []
        })

        # Periodic reporting
        self.report_timer = self.create_timer(
            report_interval,
            self.report_statistics
        )

        self.message_count = 0
        self.get_logger().info('Joint state monitor started')

    def joint_state_callback(self, msg: JointState):
        """Process incoming joint state message."""
        # Validate message
        n_joints = len(msg.name)
        if len(msg.position) != n_joints:
            self.get_logger().warn('Position array size mismatch')
            return

        # Store data for each joint
        for i, joint_name in enumerate(msg.name):
            # Position
            self.joint_data[joint_name]['positions'].append(msg.position[i])
            if len(self.joint_data[joint_name]['positions']) > self.buffer_size:
                self.joint_data[joint_name]['positions'].pop(0)

            # Velocity (if available)
            if msg.velocity and len(msg.velocity) > i:
                self.joint_data[joint_name]['velocities'].append(msg.velocity[i])
                if len(self.joint_data[joint_name]['velocities']) > self.buffer_size:
                    self.joint_data[joint_name]['velocities'].pop(0)

            # Effort (if available)
            if msg.effort and len(msg.effort) > i:
                self.joint_data[joint_name]['efforts'].append(msg.effort[i])
                if len(self.joint_data[joint_name]['efforts']) > self.buffer_size:
                    self.joint_data[joint_name]['efforts'].pop(0)

        self.message_count += 1

    def report_statistics(self):
        """Compute and log statistics for all joints."""
        if not self.joint_data:
            self.get_logger().info('No joint data received yet')
            return

        self.get_logger().info(
            f'\n{"="*70}\n'
            f'Joint Statistics (last {self.buffer_size} samples, '
            f'{self.message_count} total messages)\n'
            f'{"="*70}'
        )

        for joint_name, data in sorted(self.joint_data.items()):
            positions = np.array(data['positions'])

            if len(positions) == 0:
                continue

            # Compute statistics
            mean_pos = np.mean(positions)
            std_pos = np.std(positions)
            min_pos = np.min(positions)
            max_pos = np.max(positions)
            range_pos = max_pos - min_pos

            stats_str = (
                f'{joint_name:20s} | '
                f'μ={mean_pos:7.3f} rad | '
                f'σ={std_pos:6.3f} | '
                f'range=[{min_pos:6.3f}, {max_pos:6.3f}] ({range_pos:6.3f})'
            )

            # Add velocity stats if available
            if data['velocities']:
                velocities = np.array(data['velocities'])
                mean_vel = np.mean(velocities)
                stats_str += f' | v_μ={mean_vel:6.3f} rad/s'

            self.get_logger().info(stats_str)


def main(args=None):
    rclpy.init(args=args)
    node = JointStateMonitor()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.get_logger().info('Shutting down joint state monitor')
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

**Testing with simulated joint states:**

```bash
# Terminal 1: Run monitor
ros2 run my_robot_package joint_state_monitor

# Terminal 2: Publish test data
ros2 topic pub /joint_states sensor_msgs/msg/JointState \
  "{name: ['joint1', 'joint2'], position: [0.5, 1.2], velocity: [0.1, 0.3]}" \
  --rate 10

# Output (every 5 seconds):
# ======================================================================
# Joint Statistics (last 100 samples, 523 total messages)
# ======================================================================
# [INFO] [joint_state_monitor]: joint1               | μ=  0.500 rad | σ= 0.000 | range=[ 0.500,  0.500] ( 0.000) | v_μ= 0.100 rad/s
# [INFO] [joint_state_monitor]: joint2               | μ=  1.200 rad | σ= 0.000 | range=[ 1.200,  1.200] ( 0.000) | v_μ= 0.300 rad/s
```

**Key Takeaway:** Subscribers enable data-driven behaviors. The callback pattern is simple, but powerful applications emerge from how you process the data—buffering for statistics, filtering for noise reduction, transforming for coordinate frame changes, or triggering actions based on conditions.

---

## 5. Best Practices and Troubleshooting

### 5.1 Error Handling

Robust ROS 2 nodes handle errors gracefully without crashing the entire system.

**Common error scenarios:**

1. **Message validation failures**
2. **Computation errors (division by zero, invalid inputs)**
3. **Resource unavailability (files, network services)**
4. **Timeout violations**

**Error handling pattern:**

```python
def listener_callback(self, msg):
    try:
        # Validate message
        if not self.validate_message(msg):
            self.get_logger().warn('Invalid message received, skipping')
            return

        # Process message
        result = self.process_data(msg.data)

        # Publish result
        self.publisher.publish(result)

    except ValueError as e:
        self.get_logger().error(f'Value error in processing: {e}')
    except Exception as e:
        self.get_logger().error(f'Unexpected error: {e}', exc_info=True)

def validate_message(self, msg):
    """Validate message fields."""
    if not msg.name or not msg.position:
        return False
    if len(msg.name) != len(msg.position):
        return False
    return True
```

**Exception safety in timers:**

```python
def timer_callback(self):
    try:
        self.do_work()
    except Exception as e:
        self.get_logger().error(f'Timer callback failed: {e}', exc_info=True)
        # Timer continues running; error doesn't crash node
```

### 5.2 Graceful Shutdown

Ensure proper cleanup when nodes terminate.

**Cleanup checklist:**

- Stop timers
- Close file handles
- Release hardware resources
- Log shutdown messages

**Implementation:**

```python
class RobustNode(Node):
    def __init__(self):
        super().__init__('robust_node')

        self.timer = self.create_timer(1.0, self.timer_callback)
        self.file_handle = open('data.log', 'w')

    def destroy_node(self):
        """Override to add custom cleanup."""
        self.get_logger().info('Cleaning up resources...')

        # Cancel timers
        if self.timer:
            self.timer.cancel()

        # Close files
        if self.file_handle:
            self.file_handle.close()

        # Call parent cleanup
        super().destroy_node()


def main(args=None):
    rclpy.init(args=args)
    node = RobustNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Keyboard interrupt received')
    except Exception as e:
        node.get_logger().error(f'Unexpected error: {e}', exc_info=True)
    finally:
        node.destroy_node()
        rclpy.shutdown()
```

### 5.3 Logging Best Practices

ROS 2 provides a hierarchical logging system with severity levels.

**Log levels (increasing severity):**

1. **DEBUG:** Detailed diagnostic information
2. **INFO:** Informational messages (normal operation)
3. **WARN:** Warning messages (potential issues)
4. **ERROR:** Error messages (failures that don't crash the node)
5. **FATAL:** Fatal errors (node cannot continue)

**Usage:**

```python
self.get_logger().debug('Entering computation loop')
self.get_logger().info('Node initialized successfully')
self.get_logger().warn(f'Received stale data (age: {age}s)')
self.get_logger().error('Failed to compute inverse kinematics')
self.get_logger().fatal('Critical sensor disconnected, shutting down')
```

**Configure log level:**

```bash
# Set log level for specific node
ros2 run my_robot_package my_node --ros-args --log-level debug

# Set log level via environment variable
ROS_LOG_LEVEL=DEBUG ros2 run my_robot_package my_node
```

**Structured logging:**

```python
self.get_logger().info(
    f'Processed sensor data: '
    f'timestamp={msg.header.stamp.sec}, '
    f'frame={msg.header.frame_id}, '
    f'value={msg.data:.3f}'
)
```

### 5.4 Performance Considerations

**Callback execution time:**

Callbacks should complete quickly to avoid blocking the executor. Long-running computations should be offloaded to separate threads.

**Problematic:**

```python
def callback(self, msg):
    # BAD: Blocks executor for 1 second
    result = expensive_computation(msg.data)  # Takes 1 second
    self.publisher.publish(result)
```

**Improved:**

```python
import threading

def callback(self, msg):
    # GOOD: Offload to thread
    thread = threading.Thread(target=self.process_in_background, args=(msg,))
    thread.start()

def process_in_background(self, msg):
    result = expensive_computation(msg.data)
    # Publishing from another thread is safe
    self.publisher.publish(result)
```

**Memory management:**

Python's garbage collector handles most memory management, but be mindful of:

- **Large message buffers:** Limit history size
- **Circular references:** Explicitly break cycles in cleanup
- **NumPy arrays:** Reuse arrays instead of allocating new ones

```python
# Allocate array once
self.buffer = np.zeros((1000,))

def callback(self, msg):
    # Reuse buffer (avoid allocation)
    np.copyto(self.buffer, msg.data)
```

### 5.5 Common Issues and Solutions

**Issue: "Package not found"**

**Solution:**

```bash
# Ensure workspace is built
colcon build --packages-select my_robot_package

# Source workspace
source install/setup.bash

# Verify package is visible
ros2 pkg list | grep my_robot_package
```

**Issue: "No executable found"**

**Solution:** Check `entry_points` in `setup.py` and rebuild.

**Issue: "Topic not receiving data"**

**Solution:**

```bash
# Check if publisher is active
ros2 node list
ros2 topic info /my_topic

# Verify QoS compatibility
ros2 topic info /my_topic --verbose

# Echo to confirm data flow
ros2 topic echo /my_topic
```

**Issue: "Callbacks not executing"**

**Solution:** Ensure `rclpy.spin()` is called. Without spinning, callbacks never execute.

**Issue: "High CPU usage"**

**Solution:**

- Reduce publication rate
- Optimize callback computations
- Use `MultiThreadedExecutor` for parallelism
- Profile with `cProfile` or `py-spy`

```bash
# Profile node execution
python3 -m cProfile -o profile.out $(which ros2) run my_robot_package my_node

# Analyze profile
python3 -m pstats profile.out
```

**Key Takeaway:** Production ROS 2 code requires attention to error handling, logging, performance, and graceful shutdown. Anticipate failure modes, validate inputs, log appropriately, and test under realistic conditions (high message rates, network latency, resource constraints).

---

## Summary

This lesson provided a comprehensive introduction to ROS 2 Python development with rclpy:

- **rclpy** is the official Python API for ROS 2, providing idiomatic Python interfaces to nodes, publishers, subscribers, services, and more. It abstracts the underlying DDS middleware while exposing necessary control over QoS and lifecycle.

- **Environment Setup** involves installing ROS 2, creating a workspace with the standard directory structure, using the colcon build system, and configuring your IDE (VS Code) for efficient development.

- **Publishers** send messages to topics at a specified rate. The pattern is simple: create publisher, create timer, populate message in callback, publish. Choose appropriate message types and QoS settings for your application.

- **Subscribers** listen to topics and invoke callbacks when messages arrive. Callbacks should be fast; offload long computations to separate threads. Use subscribers to react to sensor data, state updates, and commands.

- **Best Practices** include robust error handling, graceful shutdown, effective logging, performance optimization, and thorough testing. Production nodes must handle failures without crashing and provide useful diagnostics.

**Key Principles:**

1. **Modularity:** Each node has a single responsibility
2. **Robustness:** Anticipate and handle errors gracefully
3. **Observability:** Log meaningful information at appropriate levels
4. **Performance:** Optimize callback execution, manage memory, profile when necessary
5. **Testability:** Write nodes that can be tested in isolation

By mastering these patterns and practices, you can develop ROS 2 Python nodes that are reliable, maintainable, and ready for deployment in complex robotic systems.

---

## Further Reading

- **rclpy API Documentation:** [https://docs.ros2.org/latest/api/rclpy/](https://docs.ros2.org/latest/api/rclpy/) — Complete API reference
- **ROS 2 Python Tutorials:** [https://docs.ros.org/en/humble/Tutorials.html](https://docs.ros.org/en/humble/Tutorials.html) — Official beginner and intermediate tutorials
- **Python Performance Guide:** [https://wiki.python.org/moin/PythonSpeed](https://wiki.python.org/moin/PythonSpeed) — Optimization techniques
- **ROS 2 Design Patterns:** [https://design.ros2.org/](https://design.ros2.org/) — Architectural best practices
- **Colcon Documentation:** [https://colcon.readthedocs.io/](https://colcon.readthedocs.io/) — Build system reference

**Next Steps:** In the next lesson, we'll explore URDF (Unified Robot Description Format) for modeling humanoid robots. You'll learn how to describe kinematic chains, define joint limits, and visualize robot models in RViz—building on the ROS 2 foundation you've established here.
