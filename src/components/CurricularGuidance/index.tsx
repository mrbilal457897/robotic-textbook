/**
 * Curricular Guidance Component
 * Tabbed interface showing Learning Outcomes, Assessments, and Prerequisites
 */

import React, { useState } from 'react';
import styles from './styles.module.css';

type TabKey = 'outcomes' | 'assessments' | 'prerequisites';

interface TabContent {
  key: TabKey;
  label: string;
  icon: string;
  items: Array<{
    title: string;
    description: string;
  }>;
}

export default function CurricularGuidance(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>('outcomes');

  const tabs: TabContent[] = [
    {
      key: 'outcomes',
      label: 'Learning Outcomes',
      icon: '🎯',
      items: [
        {
          title: 'Master ROS 2 Architecture',
          description:
            'Design and implement robotic systems using ROS 2 nodes, topics, and services for distributed computation.',
        },
        {
          title: 'Build Digital Twin Simulations',
          description:
            'Create high-fidelity digital twins using Gazebo, Unity, and Isaac Sim for robot testing and validation.',
        },
        {
          title: 'Implement Vision-Language-Action Models',
          description:
            'Integrate multimodal AI systems that transform natural language commands into executable robot actions.',
        },
        {
          title: 'Deploy Humanoid Robot Systems',
          description:
            'Configure, simulate, and deploy complete humanoid robot systems with perception, planning, and control.',
        },
      ],
    },
    {
      key: 'assessments',
      label: 'Assessments',
      icon: '📝',
      items: [
        {
          title: 'Module Quizzes (40%)',
          description:
            'Four comprehensive quizzes (10 questions each) testing conceptual understanding and practical knowledge.',
        },
        {
          title: 'Hands-On Labs (30%)',
          description:
            'Weekly coding assignments implementing ROS 2 nodes, simulation environments, and AI integrations.',
        },
        {
          title: 'Capstone Project (30%)',
          description:
            'End-to-end humanoid robot project integrating speech recognition, LLM planning, and physical simulation.',
        },
      ],
    },
    {
      key: 'prerequisites',
      label: 'Prerequisites',
      icon: '📚',
      items: [
        {
          title: 'Python Programming',
          description:
            'Intermediate Python knowledge including OOP, async/await, decorators, and data structures.',
        },
        {
          title: 'Linear Algebra & Calculus',
          description:
            'Understanding of vectors, matrices, transformations, derivatives, and optimization fundamentals.',
        },
        {
          title: 'Computer Vision Basics',
          description:
            'Familiarity with image processing, camera models, feature detection, and basic neural networks.',
        },
        {
          title: 'Ubuntu/Linux Environment',
          description:
            'Comfortable with terminal commands, package management, and basic system administration.',
        },
      ],
    },
  ];

  const currentContent = tabs.find((tab) => tab.key === activeTab)!;

  return (
    <section className={styles.guidance} aria-labelledby="guidance-title">
      <div className={styles.guidanceInner}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Academic Framework</span>
          <h2 id="guidance-title" className={styles.sectionTitle}>
            <span className="gradient-text">Curricular Guidance</span>
          </h2>
          <p className={styles.sectionDescription}>
            Comprehensive framework aligning learning objectives, assessments, and prerequisite knowledge
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabBar} role="tablist" aria-label="Curricular guidance categories">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
              id={`tab-${tab.key}`}
              className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className={styles.tabContent}
        >
          <div className={styles.contentGrid}>
            {currentContent.items.map((item, index) => (
              <div key={index} className={styles.contentCard}>
                <div className={styles.cardIcon}>{currentContent.icon}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
