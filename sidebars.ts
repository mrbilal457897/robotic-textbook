import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'doc',
      id: 'modules/ros2/index',
      label: 'Module 1: ROS 2',
    },
    {
      type: 'doc',
      id: 'modules/digital-twin/index',
      label: 'Module 2: Digital Twin',
    },
    {
      type: 'doc',
      id: 'modules/isaac/index',
      label: 'Module 3: NVIDIA Isaac',
    },
    {
      type: 'doc',
      id: 'modules/vla/index',
      label: 'Module 4: VLA Models',
    },
  ],
};

export default sidebars;
