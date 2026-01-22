/**
 * Course Modules Section
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * Features:
 * - 4 ModuleCard components for each module
 * - Grid layout: 4 columns desktop → 2 columns tablet → 1 column mobile
 * - Staggered entrance animation
 */

import React from 'react';
import ModuleCard from '../ModuleCard';
import styles from './styles.module.css';

export default function CourseModules(): JSX.Element {
  const modules = [
    {
      number: 1,
      title: 'The Robotic Nervous System (ROS 2)',
      description:
        'Master the Robot Operating System 2 (ROS 2) - the industry-standard middleware for building intelligent robots. Learn nodes, topics, services, and how to control humanoid robots with Python.',
      link: '/docs/module-1-ros2/',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
          <path d="M32 4v8M32 52v8M4 32h8M52 32h8" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Digital Twin & Physics Simulation',
      description:
        'Build realistic virtual replicas of humanoid robots using Gazebo and Unity. Learn physics engines, sensor simulation, and how to test behaviors safely before real-world deployment.',
      link: '/docs/module-2-digital-twin/',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <rect x="12" y="12" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="32" y="32" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M22 32v8h8M32 32l8 8" stroke="currentColor" strokeWidth="2" />
          <path d="M42 22l-10 10" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'NVIDIA Isaac Platform',
      description:
        'Harness GPU-accelerated robotics simulation with NVIDIA Isaac Sim. Explore photorealistic rendering, AI model training, and advanced navigation planning for autonomous humanoid systems.',
      link: '/docs/module-3-isaac/',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <path
            d="M8 32l8-8 8 8 8-8 8 8 8-8 8 8"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M8 42l8-8 8 8 8-8 8 8 8-8 8 8"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="4"
            y="20"
            width="56"
            height="28"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
    },
    {
      number: 4,
      title: 'Vision-Language-Action (VLA) Models',
      description:
        'Integrate cutting-edge AI with robotics. Connect voice commands to physical actions, leverage LLMs for cognitive planning, and build a complete humanoid robot capstone project.',
      link: '/docs/module-4-vla/',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <path d="M32 8v48M16 16l32 32M16 48l32-32" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
          <path
            d="M24 24l-8-8M40 24l8-8M24 40l-8 8M40 40l8 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className={styles.courseModules} aria-labelledby="course-modules-title">
      <div className={styles.courseModulesInner}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Curriculum</span>
          <h2 id="course-modules-title" className={styles.sectionTitle}>
            <span className="gradient-text">Four Foundational Modules</span>
          </h2>
          <p className={styles.sectionDescription}>
            Master the complete Physical AI stack through hands-on learning with simulation-first
            approach
          </p>
        </div>

        <div className={`${styles.modulesGrid} stagger-children`}>
          {modules.map((module, index) => (
            <div
              key={module.number}
              className={styles.moduleCardWrapper}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ModuleCard {...module} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
