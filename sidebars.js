const sidebars = {
    tutorialSidebar: [
        {
            type: 'doc',
            id: 'intro',
            label: 'Introduction',
        },
        {
            type: 'category',
            label: 'Module 1: The Robotic Nervous System (ROS 2)',
            collapsed: false,
            items: [
                'modules/01-ros2/index',
                'modules/01-ros2/01-nodes-topics-services',
                'modules/01-ros2/02-python-rclpy',
                'modules/01-ros2/03-urdf-humanoids',
            ],
        },
        {
            type: 'category',
            label: 'Module 2: Digital Twin',
            collapsed: false,
            items: [
                'modules/02-digital-twin/index',
                'modules/02-digital-twin/01-gazebo-physics',
                'modules/02-digital-twin/02-unity-rendering',
                'modules/02-digital-twin/03-sensor-simulation',
            ],
        },
        {
            type: 'category',
            label: 'Module 3: NVIDIA Isaac',
            collapsed: false,
            items: [
                'modules/03-isaac/index',
                'modules/03-isaac/01-isaac-sim',
                'modules/03-isaac/02-isaac-vslam',
                'modules/03-isaac/03-nav2-planning',
            ],
        },
        {
            type: 'category',
            label: 'Module 4: Vision-Language-Action (VLA) Models',
            collapsed: false,
            items: [
                'modules/04-vla/index',
                'modules/04-vla/01-voice-action',
                'modules/04-vla/02-llm-planning',
                'modules/04-vla/03-capstone',
            ],
        },
    ],
};
export default sidebars;
