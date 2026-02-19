/**
 * Resources Page - Physical AI & Humanoid Robotics Interactive Textbook
 * Curated links, tools, documentation, and community resources
 */

import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './resources.module.css';

type Category = 'all' | 'documentation' | 'tools' | 'community' | 'research';

interface Resource {
  id: string;
  title: string;
  description: string;
  href: string;
  category: Exclude<Category, 'all'>;
  badge?: string;
  badgeType?: 'primary' | 'accent' | 'success';
}

const resources: Resource[] = [
  // Documentation
  {
    id: 'ros2-docs',
    title: 'ROS 2 Humble Documentation',
    description:
      'Official ROS 2 Humble documentation covering architecture, CLI tools, rclpy API, and migration guides from ROS 1.',
    href: 'https://docs.ros.org/en/humble/',
    category: 'documentation',
    badge: 'Official',
    badgeType: 'primary',
  },
  {
    id: 'gazebo-docs',
    title: 'Gazebo Sim Documentation',
    description:
      'Complete reference for Gazebo physics simulation — SDF format, plugins, sensors, and ROS 2 integration.',
    href: 'https://gazebosim.org/docs',
    category: 'documentation',
    badge: 'Official',
    badgeType: 'primary',
  },
  {
    id: 'isaac-sim-docs',
    title: 'NVIDIA Isaac Sim',
    description:
      'GPU-accelerated robot simulation built on Omniverse. Covers USD robots, ROS 2 bridge, synthetic data, and OmniGraph.',
    href: 'https://docs.isaacsim.omniverse.nvidia.com/',
    category: 'documentation',
    badge: 'Official',
    badgeType: 'primary',
  },
  {
    id: 'isaac-ros-docs',
    title: 'NVIDIA Isaac ROS',
    description:
      'Hardware-accelerated ROS 2 packages for perception, navigation, and manipulation using NVIDIA Jetson and GPU platforms.',
    href: 'https://nvidia-isaac-ros.github.io/',
    category: 'documentation',
    badge: 'Official',
    badgeType: 'primary',
  },
  {
    id: 'nav2-docs',
    title: 'Nav2 Navigation Stack',
    description:
      'ROS 2 Navigation Stack — path planning, costmaps, behavior trees, and robot navigation algorithms.',
    href: 'https://navigation.ros.org/',
    category: 'documentation',
    badge: 'Official',
    badgeType: 'primary',
  },
  {
    id: 'rclpy-api',
    title: 'rclpy API Reference',
    description:
      'Python client library for ROS 2. Complete API for nodes, publishers, subscribers, services, actions, and parameters.',
    href: 'https://docs.ros2.org/latest/api/rclpy/',
    category: 'documentation',
  },
  // Tools
  {
    id: 'vscode-ros',
    title: 'VS Code ROS Extension',
    description:
      'Official ROS 2 extension for VS Code — syntax highlighting, build tools, launch file support, and debugging.',
    href: 'https://marketplace.visualstudio.com/items?itemName=ms-iot.vscode-ros',
    category: 'tools',
    badge: 'Recommended',
    badgeType: 'accent',
  },
  {
    id: 'foxglove',
    title: 'Foxglove Studio',
    description:
      'Powerful robotics visualization and debugging tool. Supports ROS bags, live data streams, and custom panels.',
    href: 'https://foxglove.dev/',
    category: 'tools',
    badge: 'Free',
    badgeType: 'success',
  },
  {
    id: 'docker-ros',
    title: 'Docker for ROS 2',
    description:
      'Official ROS 2 Docker images for containerized development. Includes Humble, Iron, and Rolling distributions.',
    href: 'https://hub.docker.com/_/ros',
    category: 'tools',
  },
  {
    id: 'plotjuggler',
    title: 'PlotJuggler',
    description:
      'Fast, intuitive time-series visualization for ROS 2. Real-time plotting of topics, custom transformations, and recording.',
    href: 'https://plotjuggler.io/',
    category: 'tools',
    badge: 'Free',
    badgeType: 'success',
  },
  {
    id: 'moveit2',
    title: 'MoveIt 2',
    description:
      'Motion planning framework for ROS 2. Arm manipulation, inverse kinematics, collision checking, and trajectory execution.',
    href: 'https://moveit.picknik.ai/',
    category: 'tools',
    badge: 'Official',
    badgeType: 'primary',
  },
  {
    id: 'rviz2',
    title: 'RViz 2',
    description:
      'The standard ROS 2 3D visualization tool. View sensor data, robot state, transforms, paths, and simulation output.',
    href: 'https://github.com/ros2/rviz',
    category: 'tools',
  },
  // Community
  {
    id: 'ros-discourse',
    title: 'ROS Discourse',
    description:
      'Official ROS community forum. Ask questions, share projects, follow announcements, and discuss ROS development.',
    href: 'https://discourse.ros.org/',
    category: 'community',
    badge: 'Active',
    badgeType: 'success',
  },
  {
    id: 'nvidia-forums',
    title: 'NVIDIA Developer Forums',
    description:
      'Official support forum for Isaac Sim, Isaac ROS, Jetson, and GPU-accelerated robotics. Direct NVIDIA engineer support.',
    href: 'https://forums.developer.nvidia.com/c/isaac/404',
    category: 'community',
    badge: 'Official',
    badgeType: 'primary',
  },
  {
    id: 'robotics-reddit',
    title: 'r/robotics',
    description:
      'Largest robotics subreddit for news, project showcases, tutorials, career advice, and discussions.',
    href: 'https://www.reddit.com/r/robotics/',
    category: 'community',
  },
  {
    id: 'ros-answers',
    title: 'ROS Answers',
    description:
      'Q&A platform specifically for ROS and ROS 2 questions. Searchable database of thousands of solved problems.',
    href: 'https://answers.ros.org/',
    category: 'community',
  },
  {
    id: 'open-robotics-github',
    title: 'Open Robotics GitHub',
    description:
      'Source code for ROS 2 core packages, Gazebo, and related tools. File issues and contribute to open-source robotics.',
    href: 'https://github.com/ros2',
    category: 'community',
  },
  // Research
  {
    id: 'arxiv-robotics',
    title: 'arXiv Robotics',
    description:
      'Pre-print archive for cutting-edge robotics research — manipulation, locomotion, planning, and Physical AI.',
    href: 'https://arxiv.org/list/cs.RO/recent',
    category: 'research',
    badge: 'Open Access',
    badgeType: 'success',
  },
  {
    id: 'ieee-ral',
    title: 'IEEE Robotics & Automation Letters',
    description:
      'Peer-reviewed journal publishing high-impact research in robotics, automation, and related areas.',
    href: 'https://www.ieee-ras.org/publications/ra-l',
    category: 'research',
  },
  {
    id: 'rt2-paper',
    title: 'RT-2: Vision-Language-Action Models',
    description:
      'Google DeepMind paper on RT-2 — transferring vision-language knowledge to robotic control via large-scale training.',
    href: 'https://arxiv.org/abs/2307.15818',
    category: 'research',
    badge: 'Foundational',
    badgeType: 'accent',
  },
  {
    id: 'openai-robotics',
    title: 'OpenAI Robotics Research',
    description:
      'Landmark OpenAI dexterous manipulation research including Dactyl and reinforcement learning for in-hand manipulation.',
    href: 'https://openai.com/research/#robot',
    category: 'research',
  },
  {
    id: 'deepmind-robotics',
    title: 'Google DeepMind Robotics',
    description:
      'DeepMind research on robotic learning, RT-X, SayCan, and applying large models to physical robot control.',
    href: 'https://deepmind.google/research/areas/robotics/',
    category: 'research',
    badge: 'Foundational',
    badgeType: 'accent',
  },
];

const categoryLabels: Record<Category, string> = {
  all: 'All Resources',
  documentation: 'Documentation',
  tools: 'Tools & Software',
  community: 'Community',
  research: 'Research & Papers',
};

const categoryIcons: Record<Category, string> = {
  all: '🗂️',
  documentation: '📚',
  tools: '🛠️',
  community: '🤝',
  research: '🔬',
};

export default function Resources(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const heroImgSrc = useBaseUrl('/img/resources/resources-hero.jpg');
  const bannerImgSrc = useBaseUrl('/img/resources/robotics-lab.jpg');
  const aiImgSrc = useBaseUrl('/img/resources/ai-learning.jpg');

  const filtered =
    activeCategory === 'all' ? resources : resources.filter(r => r.category === activeCategory);

  return (
    <Layout
      title="Resources"
      description="Curated documentation, tools, community links, and research papers for learning Physical AI and humanoid robotics."
    >
      <main className={styles.resourcesPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Learning <span className="gradient-text">Resources</span>
              </h1>
              <p className={styles.heroDescription}>
                Curated documentation, tools, communities, and research papers to support your
                journey through Physical AI and humanoid robotics.
              </p>
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{resources.length}+</span>
                  <span className={styles.statLabel}>Resources</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statNumber}>4</span>
                  <span className={styles.statLabel}>Categories</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statNumber}>Free</span>
                  <span className={styles.statLabel}>Always</span>
                </div>
              </div>
            </div>
            <div className={styles.heroImageWrapper}>
              <img
                src={heroImgSrc}
                alt="Humanoid robot in an advanced research laboratory"
                className={styles.heroImage}
                loading="eager"
              />
              <div className={styles.heroImageOverlay} aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className={styles.filterSection} aria-label="Filter resources by category">
          <div className={styles.filterInner}>
            <div className={styles.filterTabs} role="tablist" aria-label="Resource categories">
              {(Object.keys(categoryLabels) as Category[]).map(cat => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`${styles.filterTab} ${activeCategory === cat ? styles.filterTabActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span className={styles.filterTabIcon}>{categoryIcons[cat]}</span>
                  {categoryLabels[cat]}
                  <span className={styles.filterTabCount}>
                    {cat === 'all'
                      ? resources.length
                      : resources.filter(r => r.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className={styles.gridSection} aria-label="Resources list">
          <div className={styles.gridInner}>
            {activeCategory !== 'all' && (
              <div className={styles.categoryHeader}>
                <span className={styles.categoryHeaderIcon}>{categoryIcons[activeCategory]}</span>
                <h2 className={styles.categoryTitle}>{categoryLabels[activeCategory]}</h2>
                <div className={styles.categoryDivider} />
              </div>
            )}
            <div className={styles.resourceGrid}>
              {filtered.map(resource => (
                <a
                  key={resource.id}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.resourceCard}
                  aria-label={`${resource.title} — opens in new tab`}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.cardCategoryIcon}>
                      {categoryIcons[resource.category]}
                    </span>
                    {resource.badge && (
                      <span
                        className={`${styles.cardBadge} ${resource.badgeType ? styles[`badge_${resource.badgeType}`] : ''}`}
                      >
                        {resource.badge}
                      </span>
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{resource.title}</h3>
                  <p className={styles.cardDescription}>{resource.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardLink}>
                      Visit Resource
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 7h12M7 1l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Community Image Banner */}
        <section className={styles.bannerSection}>
          <div className={styles.bannerInner}>
            <div className={styles.bannerImageWrapper}>
              <img
                src={bannerImgSrc}
                alt="Engineers collaborating in a robotics research lab"
                className={styles.bannerImage}
                loading="lazy"
              />
              <div className={styles.bannerOverlay} aria-hidden="true" />
            </div>
            <div className={styles.bannerContent}>
              <h2 className={styles.bannerTitle}>Learn by Doing</h2>
              <p className={styles.bannerText}>
                Every resource listed here is used directly within our simulation-first curriculum.
                As you progress through the modules, you will apply these tools hands-on in Gazebo,
                Isaac Sim, and ROS 2 environments.
              </p>
              <div className={styles.bannerPoints}>
                <div className={styles.bannerPoint}>
                  <span className={styles.bannerPointIcon}>✓</span>
                  Safe simulation before real-world deployment
                </div>
                <div className={styles.bannerPoint}>
                  <span className={styles.bannerPointIcon}>✓</span>
                  Industry-standard tools used in production robotics
                </div>
                <div className={styles.bannerPoint}>
                  <span className={styles.bannerPointIcon}>✓</span>
                  All resources are free or have free tiers for learners
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Learning Image + Quick Links */}
        <section className={styles.quickLinksSection}>
          <div className={styles.quickLinksInner}>
            <div className={styles.quickLinksContent}>
              <h2 className={styles.quickLinksTitle}>Start with the Modules</h2>
              <p className={styles.quickLinksText}>
                These resources complement the four core modules of the Physical AI textbook. Begin
                with Module 1 and reference the documentation as you build your skills.
              </p>
              <div className={styles.moduleLinks}>
                <Link to="/docs/module-1-ros2" className={styles.moduleLink}>
                  <span className={styles.moduleLinkNumber}>01</span>
                  <span>ROS 2 Fundamentals</span>
                </Link>
                <Link to="/docs/module-2-digital-twin" className={styles.moduleLink}>
                  <span className={styles.moduleLinkNumber}>02</span>
                  <span>Digital Twin & Gazebo</span>
                </Link>
                <Link to="/docs/module-3-isaac" className={styles.moduleLink}>
                  <span className={styles.moduleLinkNumber}>03</span>
                  <span>NVIDIA Isaac Platform</span>
                </Link>
                <Link to="/docs/module-4-vla" className={styles.moduleLink}>
                  <span className={styles.moduleLinkNumber}>04</span>
                  <span>VLA Models</span>
                </Link>
              </div>
            </div>
            <div className={styles.quickLinksImageWrapper}>
              <img
                src={aiImgSrc}
                alt="Abstract AI and technology visualization"
                className={styles.quickLinksImage}
                loading="lazy"
              />
              <div className={styles.quickLinksImageOverlay} aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Build?</h2>
            <p className={styles.ctaDescription}>
              Jump into the interactive modules and start writing your first ROS 2 nodes in
              simulation today.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/docs/intro" className="btn-primary">
                Start Learning
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn About the Project
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
