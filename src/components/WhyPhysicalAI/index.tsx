/**
 * Why Physical AI Matters Section
 * 60% text content (left), 40% image (right)
 * Responsive stacking on mobile
 */

import React from 'react';
import styles from './styles.module.css';

export default function WhyPhysicalAI(): JSX.Element {
  const keyPoints = [
    {
      icon: '🤖',
      title: 'Embodied Intelligence',
      description:
        'Physical AI bridges the gap between digital cognition and real-world interaction, enabling robots to understand and navigate complex environments.',
    },
    {
      icon: '🏭',
      title: 'Industry Revolution',
      description:
        'From manufacturing to healthcare, humanoid robots are transforming industries by performing tasks in human-designed environments.',
    },
    {
      icon: '🚀',
      title: 'Rapid Innovation',
      description:
        'Recent breakthroughs in vision-language models and simulation platforms have accelerated humanoid robotics development exponentially.',
    },
    {
      icon: '🎓',
      title: 'Hands-On Learning',
      description:
        'Master simulation-first development with ROS 2, Gazebo, and Isaac Sim before deploying to physical systems.',
    },
  ];

  return (
    <section className={styles.whyPhysicalAI} aria-labelledby="why-physical-ai-title">
      <div className={styles.whyPhysicalAIInner}>
        {/* Text Content */}
        <div className={styles.content}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>The Future is Here</span>
            <h2 id="why-physical-ai-title" className={styles.sectionTitle}>
              <span className="gradient-text">Why Physical AI Matters</span>
            </h2>
          </div>

          <div className={styles.keyPoints}>
            {keyPoints.map((point, index) => (
              <div key={index} className={styles.keyPoint}>
                <div className={styles.pointIcon}>{point.icon}</div>
                <div className={styles.pointContent}>
                  <h3 className={styles.pointTitle}>{point.title}</h3>
                  <p className={styles.pointDescription}>{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div className={styles.visualization}>
          <div className={styles.robotIllustration}>
            <svg
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.robotSvg}
            >
              {/* Robot Head */}
              <rect
                x="150"
                y="80"
                width="100"
                height="80"
                rx="8"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.robotPart}
              />
              <circle cx="175" cy="110" r="8" fill="currentColor" className={styles.robotEye} />
              <circle cx="225" cy="110" r="8" fill="currentColor" className={styles.robotEye} />

              {/* Robot Neck */}
              <rect
                x="180"
                y="160"
                width="40"
                height="20"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.robotPart}
              />

              {/* Robot Body */}
              <rect
                x="140"
                y="180"
                width="120"
                height="100"
                rx="8"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.robotPart}
              />

              {/* Robot Arms */}
              <rect
                x="100"
                y="190"
                width="40"
                height="80"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.robotPart}
              />
              <rect
                x="260"
                y="190"
                width="40"
                height="80"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.robotPart}
              />

              {/* Robot Legs */}
              <rect
                x="160"
                y="280"
                width="35"
                height="90"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.robotPart}
              />
              <rect
                x="205"
                y="280"
                width="35"
                height="90"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.robotPart}
              />

              {/* Neural Network Overlay */}
              <g className={styles.neuralNetwork}>
                <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="1" opacity="0.1" />
              </g>
            </svg>
          </div>

          {/* Floating Labels */}
          <div className={`${styles.floatingLabel} ${styles.label1}`}>Vision</div>
          <div className={`${styles.floatingLabel} ${styles.label2}`}>Language</div>
          <div className={`${styles.floatingLabel} ${styles.label3}`}>Action</div>
        </div>
      </div>
    </section>
  );
}
