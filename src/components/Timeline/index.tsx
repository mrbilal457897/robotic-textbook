/**
 * Timeline Component
 * Vertical timeline with accordion behavior
 * Single expand (only one week open at a time)
 */

import React, { useState } from 'react';
import styles from './styles.module.css';

interface WeekData {
  week: number;
  title: string;
  description: string;
}

export default function Timeline(): JSX.Element {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const toggleWeek = (week: number) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  const weeks: WeekData[] = [
    {
      week: 1,
      title: 'ROS 2 Fundamentals',
      description:
        'Introduction to Robot Operating System 2, nodes, topics, and services. Set up development environment and create first publisher-subscriber system.',
    },
    {
      week: 2,
      title: 'Python rclpy & Message Passing',
      description:
        'Deep dive into Python client library for ROS 2. Build custom messages, implement action servers, and master inter-process communication.',
    },
    {
      week: 3,
      title: 'URDF & Humanoid Modeling',
      description:
        'Create robot models using URDF (Unified Robot Description Format). Define joints, links, and visualize humanoid robot structures in RViz.',
    },
    {
      week: 4,
      title: 'Gazebo Physics Simulation',
      description:
        'Launch realistic physics simulations with Gazebo. Simulate gravity, collisions, and environmental interactions for humanoid robots.',
    },
    {
      week: 5,
      title: 'Unity Rendering & Visualization',
      description:
        'Integrate Unity for photorealistic rendering. Build digital twin visualizations and create interactive robot control interfaces.',
    },
    {
      week: 6,
      title: 'Sensor Simulation & Data',
      description:
        'Simulate cameras, LiDAR, IMU sensors. Process sensor data streams and implement perception pipelines for robot awareness.',
    },
    {
      week: 7,
      title: 'NVIDIA Isaac Sim Setup',
      description:
        'Install and configure Isaac Sim. Explore GPU-accelerated physics, photorealistic rendering, and synthetic data generation.',
    },
    {
      week: 8,
      title: 'Isaac Visual SLAM',
      description:
        'Implement Visual Simultaneous Localization and Mapping (VSLAM). Enable robots to map environments and track their position.',
    },
    {
      week: 9,
      title: 'Nav2 Motion Planning',
      description:
        'Master ROS 2 Navigation Stack (Nav2). Implement path planning, obstacle avoidance, and autonomous navigation for humanoid robots.',
    },
    {
      week: 10,
      title: 'Voice-to-Action Pipeline',
      description:
        'Integrate Whisper speech recognition with ROS 2 action servers. Convert natural language commands into robot behaviors.',
    },
    {
      week: 11,
      title: 'LLM Cognitive Planning',
      description:
        'Use Large Language Models for high-level task planning. Implement reasoning layers that break down complex goals into actionable steps.',
    },
    {
      week: 12,
      title: 'Capstone Project Development',
      description:
        'Build a complete humanoid robot system integrating all learned technologies. Design, simulate, and test your vision-language-action system.',
    },
    {
      week: 13,
      title: 'Project Showcase & Reflection',
      description:
        'Present capstone projects, review key learnings, and explore advanced topics. Prepare for real-world Physical AI development careers.',
    },
  ];

  return (
    <section className={styles.timeline} aria-labelledby="timeline-title">
      <div className={styles.timelineInner}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Learning Path</span>
          <h2 id="timeline-title" className={styles.sectionTitle}>
            <span className="gradient-text">13-Week Breakdown</span>
          </h2>
          <p className={styles.sectionDescription}>
            Progressive curriculum designed for hands-on mastery of Physical AI technologies
          </p>
        </div>

        <div className={styles.timelineContainer} role="list">
          {weeks.map((weekData) => (
            <div
              key={weekData.week}
              className={`${styles.timelineItem} ${
                expandedWeek === weekData.week ? styles.timelineItemExpanded : ''
              }`}
              role="listitem"
            >
              <button
                className={styles.timelineButton}
                onClick={() => toggleWeek(weekData.week)}
                aria-expanded={expandedWeek === weekData.week}
                aria-controls={`week-${weekData.week}-content`}
              >
                <div className={styles.timelineNode}>
                  <div className={styles.nodeCircle}>
                    <span className={styles.nodeNumber}>{weekData.week}</span>
                  </div>
                </div>

                <div className={styles.timelineHeader}>
                  <div className={styles.weekLabel}>Week {weekData.week}</div>
                  <h3 className={styles.weekTitle}>{weekData.title}</h3>
                </div>

                <div className={styles.chevron}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>

              <div
                id={`week-${weekData.week}-content`}
                className={styles.timelineContent}
                aria-hidden={expandedWeek !== weekData.week}
              >
                <p className={styles.weekDescription}>{weekData.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
