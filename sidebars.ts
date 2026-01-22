import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2',
      items: [
        'module-1-ros2/index',
        'module-1-ros2/nodes-topics-services',
        'module-1-ros2/python-rclpy',
        'module-1-ros2/urdf-humanoids',
        'module-1-ros2/quiz',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twin',
      items: [
        'module-2-digital-twin/index',
        'module-2-digital-twin/gazebo-simulation',
        'module-2-digital-twin/sensor-simulation',
        'module-2-digital-twin/unity-visualization',
        'module-2-digital-twin/quiz',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: NVIDIA Isaac',
      items: [
        'module-3-isaac/index',
        'module-3-isaac/isaac-sim-platform',
        'module-3-isaac/isaac-ros-vslam',
        'module-3-isaac/nav2-path-planning',
        'module-3-isaac/quiz',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: VLA Models',
      items: [
        'module-4-vla/index',
        'module-4-vla/voice-to-action-systems',
        'module-4-vla/llm-cognitive-planning',
        'module-4-vla/capstone-project',
        'module-4-vla/quiz',
      ],
    },
  ],
};

export default sidebars;
