---
name: code-expert
description: Generate correct, clean, and runnable robotics code examples for ROS 2, Gazebo, and Isaac Sim. Create well-commented, tested code with realistic simulation-only examples following best practices, version specifications, and safety guidelines for the Physical AI & Humanoid Robotics Interactive Textbook.
---

# Code Expert Skill

## Overview

This skill enables the creation of production-grade, well-tested robotics code examples for ROS 2, Gazebo, and Isaac Sim environments. It ensures all code is functional, clearly documented, follows best practices, and prioritizes simulation-only deployment with proper safety considerations.

## When to Use This Skill

- Adding code examples to textbook lessons
- Writing ROS 2 nodes (publishers, subscribers, services, actions)
- Creating Gazebo simulation plugins and launch files
- Developing Isaac Sim Python scripts for automation
- Debugging or improving existing example code
- Refactoring code for clarity and performance
- Creating reproducible test cases for concepts

## Core Principles

### Code Quality
- **Correctness**: All code must be tested in target environments before inclusion
- **Clarity**: Code is self-documenting with meaningful variable names and structure
- **Simplicity**: Examples focus on core concepts without unnecessary complexity
- **Consistency**: Code follows project style guides and conventions
- **Best Practices**: Apply established patterns for each framework (ROS 2, Gazebo, Isaac Sim)

### Simulation-First Approach
- All code examples run in simulation environments (ROS 2 + Gazebo, Isaac Sim)
- Real-world deployment is explicitly excluded
- Simulation-specific parameters and assumptions are clearly documented
- Physics simulation is leveraged for validation
- Virtual sensors and actuators are used instead of hardware drivers

### Safety & Responsibility
- Never include hardcoded paths to physical hardware devices
- Avoid real-time critical code without explicit testing
- Include guards against unsafe operations (e.g., infinite loops, unbounded memory)
- Document limitations and edge cases clearly
- Warn about behavior differences between simulation and reality

### Testing & Validation
- Every code example must be tested in its target environment
- Include expected output and success criteria
- Provide reproduction steps for debugging
- Use assertions and logging for validation
- Test on supported versions before release

### Version Awareness
- Specify exact package versions (ROS 2 distribution, Gazebo version, Isaac Sim SDK)
- Include version compatibility matrix where applicable
- Document breaking changes between versions
- Provide fallback code for older versions if necessary
- Update examples when dependencies change

## Step-by-Step Code Development Workflow

### Phase 1: Planning & Design

**1.1 Define Code Purpose & Scope**
- Write a one-sentence purpose statement
- Identify what concept(s) the code demonstrates
- List inputs, outputs, and expected behavior
- Determine the target framework (ROS 2, Gazebo, Isaac Sim, or combination)
- Identify version constraints and dependencies

**1.2 Research & Verify Existing Patterns**
- Review official documentation for the framework
- Check for existing, similar examples in the codebase
- Identify best practices and design patterns to follow
- Note any deprecated APIs to avoid
- Verify version compatibility with textbook target versions

**1.3 Plan Code Structure**
- Design class/function hierarchy
- Identify imports and dependencies
- Plan error handling strategy
- Outline initialization and cleanup logic
- Sketch the main execution flow

**1.4 Define Test Strategy**
- Plan unit tests (if applicable)
- Design integration tests with simulation environment
- Identify success criteria and expected output
- Plan error cases and edge conditions to test
- Define performance requirements (latency, CPU usage)

### Phase 2: Implementation

**2.1 Write Clean, Documented Code**
- Use meaningful variable and function names
- Follow naming conventions (snake_case for Python, camelCase for C++)
- Include docstrings/comments for all public functions
- Add inline comments for non-obvious logic
- Keep functions small and focused (single responsibility)
- Use type hints (Python 3.10+) or explicit types (C++)

**2.2 Implement Error Handling**
- Use try-except blocks appropriately (Python)
- Handle expected errors gracefully
- Log errors with context for debugging
- Avoid silently ignoring errors
- Provide informative error messages

**2.3 Add Logging & Diagnostics**
- Use ROS 2 logging (rclpy.logging for Python, rclcpp for C++)
- Log important state transitions and events
- Include DEBUG, INFO, WARN, ERROR levels appropriately
- Avoid excessive logging that impacts performance
- Use structured logging with meaningful messages

**2.4 Structure for Simulation**
- Use Gazebo/Isaac Sim APIs for environment interaction
- Configure simulation parameters explicitly
- Use virtual sensors and actuators
- Avoid direct hardware access
- Include simulation environment setup instructions

### Phase 3: Testing & Validation

**3.1 Local Testing**
- Run code in clean, isolated environment
- Test on supported ROS 2 distribution(s)
- Verify all dependencies are correctly specified
- Test with expected inputs and outputs
- Verify logging and error handling

**3.2 Simulation Testing**
- Launch code with Gazebo or Isaac Sim
- Verify physics simulation behavior
- Test sensor data flow and actuator responses
- Validate numerical results against expected behavior
- Test at multiple timescales and configurations

**3.3 Edge Case Testing**
- Test with empty/null inputs
- Test with extreme values (max/min)
- Test with unexpected parameter values
- Verify graceful degradation
- Test cleanup and resource release

**3.4 Performance Testing**
- Measure CPU/memory usage in simulation
- Verify callback execution frequency
- Check for memory leaks
- Measure latency where applicable
- Document performance characteristics

### Phase 4: Documentation & Comments

**4.1 Add Docstrings & Function Comments**
```python
def apply_control_law(state: np.ndarray, gains: Dict[str, float]) -> np.ndarray:
    """
    Apply a simple proportional-derivative control law.

    This function implements a PD controller for joint control in simulation.
    It is designed to work with ROS 2 JointTrajectoryController.

    Args:
        state: Current joint state [position, velocity]
        gains: Dictionary with 'kp' (proportional) and 'kd' (derivative) gains

    Returns:
        Control effort (torque or force) to apply

    Raises:
        ValueError: If state dimensions don't match expected shape

    Note:
        This is simulation-only code. Real hardware requires additional
        safety features and validation.
    """
```

**4.2 Explain Non-Obvious Code**
- Add inline comments for complex logic
- Explain why, not just what
- Reference external documentation where applicable
- Comment state transitions and conditionals
- Avoid over-commenting obvious code

**4.3 Create Setup Instructions**
- List all dependencies and versions
- Provide installation commands
- Include environment setup steps
- Document required launch files or configuration
- Provide command-line examples for running the code

**4.4 Document Expected Output**
- Show example output from successful execution
- Explain what each line means
- Include timing and performance metrics
- Show log messages and their significance
- Provide screenshots of RViz visualization if applicable

### Phase 5: Integration & Review

**5.1 Test in Textbook Context**
- Verify code integrates with lesson narrative
- Check that example matches explained concepts
- Validate that all mentioned features are present
- Test code runs exactly as described in text
- Verify estimated execution time

**5.2 Code Review Checklist**
- [ ] Code runs without errors
- [ ] All dependencies are specified
- [ ] Docstrings are complete and accurate
- [ ] Error handling is appropriate
- [ ] Naming conventions are followed
- [ ] No hardcoded paths or credentials
- [ ] Simulation-only (no real hardware access)
- [ ] Performance is acceptable
- [ ] Comments explain non-obvious logic
- [ ] Test cases pass

**5.3 Documentation Review**
- [ ] Setup instructions are complete
- [ ] Expected output is documented
- [ ] Version requirements are specified
- [ ] Prerequisites are listed
- [ ] Safety warnings are included
- [ ] Related examples are linked

**5.4 Final Validation**
- Run code in clean environment one final time
- Verify all file paths are relative (no absolute paths)
- Check that all imports resolve correctly
- Validate that documentation matches code
- Confirm version compatibility

## Code Structure & Best Practices

### ROS 2 Python Node Structure

```python
import sys
import rclpy
from rclpy.node import Node
from rclpy.logging import get_logger
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan


class SimpleRobotController(Node):
    """
    A simple ROS 2 node demonstrating publisher and subscriber patterns.

    This node subscribes to laser scan data and publishes velocity commands
    based on simple obstacle avoidance logic. It runs entirely in simulation.

    Subscriptions:
        /scan (LaserScan): Laser range data

    Publications:
        /cmd_vel (Twist): Velocity commands for differential drive

    Parameters:
        forward_speed (float): Forward velocity in m/s [default: 0.3]
        turn_speed (float): Angular velocity in rad/s [default: 1.0]
        safety_distance (float): Minimum safe distance in meters [default: 1.0]

    Simulation Only:
        This node is designed for use with Gazebo simulation and includes
        simulation-specific parameters. It will not work with real hardware
        without significant modifications.
    """

    def __init__(self):
        super().__init__('simple_robot_controller')

        # Declare parameters with default values
        self.declare_parameter('forward_speed', 0.3)
        self.declare_parameter('turn_speed', 1.0)
        self.declare_parameter('safety_distance', 1.0)

        # Get parameter values
        self.forward_speed = self.get_parameter('forward_speed').value
        self.turn_speed = self.get_parameter('turn_speed').value
        self.safety_distance = self.get_parameter('safety_distance').value

        # Create subscription to laser scan
        self.scan_subscription = self.create_subscription(
            LaserScan,
            '/scan',
            self.scan_callback,
            10  # QoS queue depth
        )

        # Create publisher for velocity commands
        self.cmd_vel_publisher = self.create_publisher(
            Twist,
            '/cmd_vel',
            10
        )

        self.get_logger().info(
            f'Controller initialized with safety_distance={self.safety_distance}m'
        )

    def scan_callback(self, msg: LaserScan):
        """
        Process incoming laser scan data and decide movement.

        This callback implements a simple obstacle avoidance algorithm:
        - If obstacles are detected within safety_distance, turn
        - Otherwise, move forward

        Args:
            msg: LaserScan message with range data
        """
        # Extract minimum distance from laser scan
        # The scan has 360 ranges; we check the forward direction (index 180)
        ranges = msg.ranges

        # Ignore invalid measurements (inf, nan)
        valid_ranges = [r for r in ranges if r > 0 and r < float('inf')]

        if not valid_ranges:
            self.get_logger().warn('No valid laser measurements received')
            return

        # Find minimum distance (closest obstacle)
        min_distance = min(valid_ranges)

        # Create velocity command based on obstacle detection
        cmd = Twist()

        if min_distance < self.safety_distance:
            # Obstacle detected: turn in place
            cmd.linear.x = 0.0
            cmd.angular.z = self.turn_speed
            self.get_logger().info(
                f'Obstacle detected at {min_distance:.2f}m, turning'
            )
        else:
            # No obstacle: move forward
            cmd.linear.x = self.forward_speed
            cmd.angular.z = 0.0

        # Publish velocity command
        self.cmd_vel_publisher.publish(cmd)


def main(args=None):
    """
    Entry point for ROS 2 node.

    Initializes the ROS 2 client library, creates the node, and starts
    the event loop.
    """
    rclpy.init(args=args)
    node = SimpleRobotController()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Shutting down controller')
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### ROS 2 Launch File Best Practices

```xml
<?xml version="1.0"?>
<launch>
    <!--
    Launch configuration for simple robot controller with Gazebo simulation.

    This launch file starts:
    1. Gazebo with a simple differential drive robot
    2. The obstacle avoidance controller node
    3. RViz for visualization

    Usage:
        ros2 launch my_package controller.launch.xml

    Arguments:
        use_sim_time (bool): Use simulation time from Gazebo [default: true]
        paused (bool): Start Gazebo in paused state [default: false]

    Simulation Only:
        This configuration is designed exclusively for Gazebo simulation.
        It uses virtual sensors and actuators and cannot interact with
        real hardware.
    -->

    <arg name="use_sim_time" default="true"/>
    <arg name="paused" default="false"/>

    <!-- Start Gazebo simulator -->
    <include file="$(find-pkg-share gazebo_ros)/launch/gazebo.launch.py">
        <arg name="use_sim_time" value="$(var use_sim_time)"/>
        <arg name="paused" value="$(var paused)"/>
        <arg name="world" value="$(find-pkg-share my_package)/worlds/simple_world.sdf"/>
    </include>

    <!-- Spawn robot model -->
    <node pkg="gazebo_ros" exec="spawn_entity.py"
        args="-topic robot_description -entity robot"/>

    <!-- Launch controller node with parameters -->
    <node pkg="my_package" exec="controller_node"
        name="controller">
        <param name="forward_speed" value="0.3"/>
        <param name="turn_speed" value="1.0"/>
        <param name="safety_distance" value="1.0"/>
        <param name="use_sim_time" value="$(var use_sim_time)"/>
    </node>

    <!-- Start RViz for visualization -->
    <node pkg="rviz2" exec="rviz2"
        args="-d $(find-pkg-share my_package)/rviz/controller.rviz"
        condition="$(eval 'not $(var paused)')"/>
</launch>
```

### Isaac Sim Python Script Structure

```python
#!/usr/bin/env python3
"""
Isaac Sim humanoid robot controller example.

This script demonstrates how to control a humanoid robot in Isaac Sim
using the Python API. It loads a humanoid model, applies joint commands,
and reads sensor data.

Requirements:
    - Isaac Sim 2023.1.0 or later
    - Python 3.10+
    - OmniPython (included with Isaac Sim)

Simulation Only:
    This code is designed exclusively for Isaac Sim simulation.
    It uses virtual joints, sensors, and physics without hardware drivers.

Usage:
    python3 humanoid_controller.py
"""

from typing import Dict, List, Optional
import numpy as np
from omni.isaac.kit import SimulationApp
from omni.isaac.core import World
from omni.isaac.core.robots import Robot
from omni.isaac.core.articulations import Articulation
from omni.isaac.core.prims import XFormPrim
from omni.isaac.motion_generation import ArticulationMotionPolicy


class HumanoidController:
    """
    Controller for humanoid robot in Isaac Sim.

    This class demonstrates:
    - Loading a humanoid robot model
    - Setting joint targets
    - Reading joint states
    - Applying control signals

    All interactions are simulation-only and use Isaac Sim's physics engine.
    """

    def __init__(self, sim_app: SimulationApp, world: World):
        """
        Initialize the humanoid controller.

        Args:
            sim_app: Isaac Sim application instance
            world: Isaac Sim world instance

        Raises:
            RuntimeError: If robot model cannot be loaded
        """
        self.sim_app = sim_app
        self.world = world
        self.robot: Optional[Articulation] = None
        self.joint_targets: Dict[str, float] = {}

        self._load_robot()
        self._initialize_joint_targets()

    def _load_robot(self):
        """
        Load humanoid robot from USD model.

        This method loads a pre-defined humanoid model from Isaac Sim's
        asset library. The model includes physics properties, joint limits,
        and sensor definitions.
        """
        try:
            # Load humanoid robot from built-in assets
            robot_asset_path = "/home/user/Isaac-Sim/assets/humanoid.usd"

            self.robot = self.world.scene.add(
                Articulation(
                    prim_path="/World/Humanoid",
                    usd_path=robot_asset_path,
                    name="humanoid"
                )
            )

            print(f"Loaded humanoid with {self.robot.num_dof} degrees of freedom")

        except Exception as e:
            raise RuntimeError(f"Failed to load humanoid model: {e}")

    def _initialize_joint_targets(self):
        """
        Initialize joint targets to default (rest) position.

        In simulation, we can safely initialize to any configuration.
        For real robots, this would require a home/calibration routine.
        """
        if self.robot is None:
            return

        # Get joint names
        joint_names = self.robot.dof_names

        # Initialize targets to current positions (rest pose)
        current_positions = self.robot.get_joint_positions()

        for name, pos in zip(joint_names, current_positions):
            self.joint_targets[name] = pos

        print(f"Initialized {len(self.joint_targets)} joint targets")

    def set_joint_target(self, joint_name: str, target_position: float):
        """
        Set target position for a single joint.

        Args:
            joint_name: Name of the joint
            target_position: Target position in radians

        Raises:
            KeyError: If joint name is not found
            ValueError: If position exceeds joint limits
        """
        if joint_name not in self.joint_targets:
            raise KeyError(f"Joint '{joint_name}' not found in robot model")

        # Verify position is within joint limits
        joint_idx = self.robot.dof_names.index(joint_name)
        joint_limits = self.robot.dof_limits
        lower, upper = joint_limits[joint_idx]

        if not (lower <= target_position <= upper):
            raise ValueError(
                f"Position {target_position} outside limits [{lower}, {upper}]"
            )

        self.joint_targets[joint_name] = target_position

    def apply_control(self):
        """
        Apply current joint targets as control commands.

        This method sends target positions to the robot's joint controllers.
        In simulation, this uses Isaac Sim's physics-based joint control.
        """
        if self.robot is None:
            return

        # Extract target positions in correct order
        target_positions = [
            self.joint_targets[name] for name in self.robot.dof_names
        ]

        # Apply position control
        self.robot.set_joint_positions(np.array(target_positions))

    def read_sensor_data(self) -> Dict[str, np.ndarray]:
        """
        Read sensor data from robot.

        Returns:
            Dictionary with 'positions', 'velocities', and 'efforts'

        Note:
            In simulation, sensor data is noise-free and perfectly synchronized.
            Real hardware would include sensor noise and communication delays.
        """
        if self.robot is None:
            return {}

        return {
            'positions': self.robot.get_joint_positions(),
            'velocities': self.robot.get_joint_velocities(),
            'efforts': self.robot.get_joint_efforts()
        }

    def step_simulation(self, steps: int = 1):
        """
        Step simulation forward.

        Args:
            steps: Number of simulation steps to execute
        """
        for _ in range(steps):
            self.world.step(render=True)


def main():
    """
    Main execution function.

    Sets up Isaac Sim, loads humanoid, and demonstrates basic control.
    """
    # Initialize Isaac Sim application
    sim_app = SimulationApp(launch_editor=False)

    # Create world
    world = World()

    # Create controller
    controller = HumanoidController(sim_app, world)

    # Simulation loop
    try:
        for step in range(100):  # 100 simulation steps
            # Read current state
            sensor_data = controller.read_sensor_data()

            # Simple control: oscillate first joint
            joint_name = controller.robot.dof_names[0]
            target = np.sin(step * 0.1)
            controller.set_joint_target(joint_name, target)

            # Apply control and step simulation
            controller.apply_control()
            controller.step_simulation()

            if step % 20 == 0:
                print(f"Step {step}: Joint position = {sensor_data['positions'][0]:.3f}")

    except KeyboardInterrupt:
        print("Interrupted by user")

    finally:
        sim_app.close()


if __name__ == "__main__":
    main()
```

### Python Package Structure

```
my_robotics_package/
├── setup.py                    # Package configuration
├── setup.cfg                   # Package metadata
├── package.xml                 # ROS 2 package descriptor
├── README.md                   # Usage and setup instructions
├── src/
│   └── my_package/
│       ├── __init__.py
│       ├── controller.py       # Main controller node
│       ├── utils.py            # Helper functions
│       └── config.py           # Configuration constants
├── launch/
│   ├── controller.launch.py    # ROS 2 launch file
│   └── simulation.launch.py    # Full simulation launch
├── tests/
│   ├── test_controller.py      # Unit tests
│   └── test_integration.py     # Integration tests
├── worlds/
│   └── simple_world.sdf        # Gazebo world definition
├── urdf/
│   └── robot.urdf              # Robot model
└── rviz/
    └── controller.rviz         # RViz configuration
```

## Example Code Snippets

### Example 1: ROS 2 Service Server

```python
"""
Example ROS 2 service server for motion planning.

This demonstrates how to implement a simple service that processes
motion requests and returns trajectories (simulation-only).
"""

from my_interfaces.srv import PlanMotion
from rclpy.node import Node
import numpy as np


class MotionPlanner(Node):
    """Service server for motion planning requests."""

    def __init__(self):
        super().__init__('motion_planner')
        self.srv = self.create_service(
            PlanMotion,
            'plan_motion',
            self.plan_callback
        )
        self.get_logger().info('Motion planner service ready')

    def plan_callback(self, request, response):
        """
        Process motion planning request.

        Args:
            request: Motion goal with start and end positions
            response: Trajectory response

        Returns:
            response: Planned trajectory points
        """
        try:
            # Simple linear interpolation between start and goal
            start = np.array(request.start_position)
            goal = np.array(request.goal_position)
            num_points = 10

            trajectory = np.linspace(start, goal, num_points)

            # Convert to response format
            response.trajectory = [tuple(point) for point in trajectory]
            response.success = True

            self.get_logger().info(
                f'Planned trajectory with {num_points} waypoints'
            )

        except Exception as e:
            self.get_logger().error(f'Planning failed: {e}')
            response.success = False

        return response
```

### Example 2: Gazebo Plugin (C++)

```cpp
/*
 * Gazebo world plugin for simulation control.
 *
 * This plugin demonstrates how to interact with Gazebo's physics engine
 * and manage simulation timing for robotics experiments.
 */

#include <gazebo/common/Plugin.hh>
#include <gazebo/physics/physics.hh>
#include <gazebo/common/common.hh>
#include <rclcpp/rclcpp.hpp>

namespace gazebo {

class SimulationControlPlugin : public WorldPlugin {
public:
    /// Plugin initialization
    void Load(physics::WorldPtr _parent, sdf::ElementPtr _sdf) override {
        world_ = _parent;

        // Connect to world update event (every simulation step)
        connection_ = event::Events::ConnectWorldUpdateBegin(
            std::bind(&SimulationControlPlugin::OnUpdate, this)
        );

        RCLCPP_INFO(
            rclcpp::get_logger("gazebo"),
            "Simulation control plugin loaded"
        );
    }

private:
    /// Called every simulation step
    void OnUpdate() {
        // Access physics engine
        double sim_time = world_->SimTime().Double();

        // Example: Print simulation time every 1 second
        if (fmod(sim_time, 1.0) < world_->Physics()->GetMaxStepSize()) {
            RCLCPP_INFO(
                rclcpp::get_logger("gazebo"),
                "Simulation time: %.2f seconds",
                sim_time
            );
        }
    }

    physics::WorldPtr world_;
    event::ConnectionPtr connection_;
};

GZ_REGISTER_WORLD_PLUGIN(SimulationControlPlugin)
}
```

### Example 3: Data Processing Function

```python
"""
Example: Filter and process sensor data.

Demonstrates best practices for signal processing in robotics,
with simulation-appropriate assumptions.
"""

from typing import Tuple
import numpy as np
from scipy import signal


def filter_sensor_data(
    raw_data: np.ndarray,
    cutoff_frequency: float = 10.0,
    sampling_rate: float = 100.0
) -> np.ndarray:
    """
    Apply low-pass Butterworth filter to sensor data.

    This function demonstrates how to clean noisy sensor measurements.
    For simulation, sensor noise is typically minimal, but filtering
    helps demonstrate real-world sensor processing techniques.

    Args:
        raw_data: Raw sensor measurements (shape: [N,])
        cutoff_frequency: Filter cutoff frequency in Hz
        sampling_rate: Sensor sampling rate in Hz

    Returns:
        Filtered sensor data

    Raises:
        ValueError: If sampling_rate <= cutoff_frequency

    Example:
        >>> raw_readings = np.random.randn(1000)
        >>> filtered = filter_sensor_data(raw_readings, cutoff=10.0)

    Note:
        - Simulation sensors are typically noise-free
        - This filter is included for educational purposes
        - Real hardware would benefit from more sophisticated filtering
    """
    if sampling_rate <= cutoff_frequency:
        raise ValueError(
            f"Sampling rate ({sampling_rate} Hz) must exceed "
            f"cutoff frequency ({cutoff_frequency} Hz)"
        )

    # Design Butterworth filter
    nyquist_freq = sampling_rate / 2.0
    normalized_cutoff = cutoff_frequency / nyquist_freq

    b, a = signal.butter(4, normalized_cutoff, btype='low')

    # Apply filter
    filtered_data = signal.filtfilt(b, a, raw_data)

    return filtered_data


def compute_moving_average(data: np.ndarray, window_size: int = 5) -> np.ndarray:
    """
    Compute moving average for smoothing.

    Args:
        data: Input data
        window_size: Number of samples in averaging window

    Returns:
        Smoothed data
    """
    return np.convolve(data, np.ones(window_size) / window_size, mode='valid')
```

## Tools & Dependencies

### Python Environment Setup

```bash
# Create virtual environment
python3.10 -m venv robotics_env
source robotics_env/bin/activate  # On Windows: robotics_env\Scripts\activate

# Install ROS 2 (follow official installation guide for your distribution)
# For Ubuntu 22.04 with ROS 2 Humble:
sudo apt install ros-humble-desktop

# Install development tools
pip install --upgrade pip
pip install pytest pytest-cov black flake8 mypy

# Install robotics libraries
pip install numpy scipy
pip install transforms3d  # For rotation matrices
pip install matplotlib    # For plotting

# Source ROS 2 environment
source /opt/ros/humble/setup.bash
```

### Project Dependencies (package.xml)

```xml
<?xml version="1.0"?>
<package format="3">
    <name>my_robotics_package</name>
    <version>0.1.0</version>
    <description>Robotics examples for Interactive Textbook</description>
    <maintainer email="author@example.com">Author Name</maintainer>
    <license>Apache-2.0</license>

    <!-- Build dependencies -->
    <build_depend>ament_cmake_python</build_depend>
    <build_depend>rclpy</build_depend>
    <build_depend>std_msgs</build_depend>
    <build_depend>geometry_msgs</build_depend>
    <build_depend>sensor_msgs</build_depend>

    <!-- Runtime dependencies -->
    <exec_depend>rclpy</exec_depend>
    <exec_depend>ros2launch</exec_depend>
    <exec_depend>gazebo_ros</exec_depend>
    <exec_depend>geometry_msgs</exec_depend>
    <exec_depend>sensor_msgs</exec_depend>

    <!-- Test dependencies -->
    <test_depend>ament_cmake_pytest</test_depend>
    <test_depend>pytest</test_depend>

    <export>
        <build_type>ament_cmake_python</build_type>
    </export>
</package>
```

### Version Specifications

```
# ROS 2 Distributions (choose one)
ROS_DISTRO=humble      # Ubuntu 22.04, LTS until May 2027
ROS_DISTRO=iron        # Latest, fast-moving
ROS_DISTRO=jazzy       # Latest LTS (May 2024)

# Gazebo Classic vs. Gazebo
Gazebo Classic: gazebo, gazebo_ros_pkgs  (End of life: September 2025)
Gazebo (new):   gazebo, gz-sim            (Recommended)

# Isaac Sim
Isaac_Sim>=2023.1.0

# Python Version
Python>=3.10
```

## Testing & Validation

### Unit Testing Example

```python
"""Unit tests for controller node."""

import unittest
import numpy as np
from my_package.controller import SimpleRobotController


class TestRobotController(unittest.TestCase):
    """Test suite for SimpleRobotController."""

    def setUp(self):
        """Set up test fixtures."""
        self.controller = SimpleRobotController()
        self.controller.forward_speed = 0.5
        self.controller.turn_speed = 1.0
        self.controller.safety_distance = 1.5

    def test_initialization(self):
        """Test that controller initializes correctly."""
        self.assertIsNotNone(self.controller)
        self.assertEqual(self.controller.forward_speed, 0.5)

    def test_obstacle_detection(self):
        """Test obstacle avoidance logic."""
        # Create mock laser scan with obstacle at 0.5m
        ranges = [float('inf')] * 360
        ranges[180] = 0.5  # Forward direction

        # With safety_distance = 1.5, should detect obstacle
        min_dist = min([r for r in ranges if r > 0 and r < float('inf')])
        self.assertLess(min_dist, self.controller.safety_distance)

    def test_safe_motion(self):
        """Test forward motion when clear."""
        ranges = [2.0] * 360  # All directions clear
        min_dist = min(ranges)
        self.assertGreater(min_dist, self.controller.safety_distance)


if __name__ == '__main__':
    unittest.main()
```

### Integration Testing with Gazebo

```bash
#!/bin/bash
# Test script: run controller with Gazebo and validate output

set -e  # Exit on error

echo "Starting Gazebo simulation..."
ros2 launch my_package controller.launch.py &
GAZEBO_PID=$!

# Give Gazebo time to start
sleep 5

echo "Running controller for 30 seconds..."
timeout 30 ros2 run my_package controller_node || true

echo "Checking controller output..."
ros2 topic echo --once /cmd_vel

# Clean up
kill $GAZEBO_PID || true

echo "Integration test complete"
```

## Safety & Deployment Guidelines

### Simulation-Only Code Patterns

✅ **Good:**
```python
# Use simulation APIs
from omni.isaac.core import World
world = World()

# Use virtual sensors
imu_data = robot.get_imu_readings()

# Use simulation physics
robot.apply_joint_torques(torques)
```

❌ **Bad:**
```python
# Don't access hardware directly
import serial
port = serial.Serial('/dev/ttyUSB0')  # NEVER IN EXAMPLES

# Don't use real-time critical timing without warnings
time.sleep(0.001)  # 1ms sleep - not guaranteed in Python

# Don't assume real hardware properties
robot_mass = 80.0  # Could vary significantly
```

### Safety Warnings

Always include warnings for simulation-specific assumptions:

```python
"""
⚠️  SIMULATION-ONLY CODE

This example is designed exclusively for use with Gazebo/Isaac Sim
simulation. Do NOT deploy this code to physical hardware without:

1. Adding comprehensive safety checks
2. Implementing hardware-specific communication protocols
3. Adding real-time constraints and synchronization
4. Testing extensively in controlled environments
5. Getting approval from safety review

Simulation assumes:
- Perfect sensor data (no noise)
- Instantaneous communication
- No hardware faults or saturation
- Unlimited actuator capabilities

These assumptions do NOT hold on real hardware.
"""
```

## Acceptance Criteria

- [ ] Code runs without errors in target environment
- [ ] All imports resolve correctly
- [ ] Dependencies are specified with exact versions
- [ ] Code follows project style guide (PEP 8 for Python)
- [ ] All functions have docstrings with Args/Returns/Raises
- [ ] Error handling is appropriate and informative
- [ ] No hardcoded paths or credentials
- [ ] Simulation-only (no hardware drivers or device access)
- [ ] Comments explain non-obvious logic
- [ ] Unit tests pass (if applicable)
- [ ] Integration tests pass in simulation
- [ ] Expected output is documented
- [ ] Performance is acceptable (CPU/memory usage)
- [ ] Version compatibility is specified
- [ ] No deprecated APIs used
- [ ] Safety warnings are included where applicable

## Quality Checklist

**Code Quality:**
- [ ] Meaningful variable and function names
- [ ] Consistent indentation and formatting
- [ ] No unused imports or variables
- [ ] Single responsibility per function
- [ ] DRY principle applied (no code duplication)

**Documentation:**
- [ ] Module-level docstring explains purpose
- [ ] Function docstrings complete (purpose, args, returns, raises)
- [ ] Inline comments explain "why", not "what"
- [ ] Usage examples provided
- [ ] Expected output documented

**Testing:**
- [ ] Runs in clean environment without errors
- [ ] All dependencies specified
- [ ] Edge cases handled
- [ ] Error cases tested
- [ ] Performance validated

**Simulation Compliance:**
- [ ] Uses only simulation APIs
- [ ] No hardware drivers or device access
- [ ] Simulation-specific parameters documented
- [ ] Sim-to-real differences acknowledged
- [ ] Safety warnings included

---

Save it as `.claude/skills/code-expert/skill.md`
