/**
 * About Page - Physical AI & Humanoid Robotics Interactive Textbook
 * Describes the project, mission, target audience, and course structure
 */

import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './about.module.css';

export default function About(): JSX.Element {
  const heroImgSrc = useBaseUrl('/img/about/about-hero.jpg');
  const simulationImgSrc = useBaseUrl('/img/about/about-simulation.jpg');

  return (
    <Layout
      title="About"
      description="Learn about the Physical AI & Humanoid Robotics Interactive Textbook - a comprehensive open-source resource for mastering ROS 2, Digital Twins, NVIDIA Isaac, and Vision-Language-Action models."
    >
      <main className={styles.aboutPage}>
        {/* Hero Section with Illustration */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                About <span className="gradient-text">Physical AI</span>
              </h1>
              <p className={styles.heroDescription}>
                An open-source, simulation-first interactive textbook for learning humanoid
                robotics, Physical AI, and autonomous systems development.
              </p>
            </div>
            <div className={styles.heroImageWrapper}>
              <img
                src={heroImgSrc}
                alt="Advanced humanoid robot in a research laboratory"
                className={styles.heroImage}
                loading="eager"
              />
              <div className={styles.heroImageOverlay} aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Our Mission</h2>
              <div className={styles.divider} />
            </div>
            <p className={styles.missionText}>
              To democratize access to world-class Physical AI and humanoid robotics education
              through an open-source, interactive, simulation-first learning platform that bridges
              the gap between theoretical knowledge and practical implementation.
            </p>
          </div>
        </section>

        {/* What is Physical AI */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>What is Physical AI?</h2>
              <div className={styles.divider} />
            </div>
            <p className={styles.bodyText}>
              Physical AI represents the convergence of artificial intelligence and robotics,
              enabling machines to perceive, understand, and interact with the physical world.
              Unlike traditional AI systems that operate purely in digital environments, Physical AI
              systems must navigate real-world physics, sensor noise, actuator limitations, and
              complex multi-body dynamics.
            </p>
            <p className={styles.bodyText}>
              This textbook focuses on <strong>humanoid robotics</strong> - the most challenging and
              promising frontier in Physical AI. Humanoid robots require mastery of:
            </p>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🤖</div>
                <h3 className={styles.featureTitle}>Multi-Body Control</h3>
                <p className={styles.featureDescription}>
                  Coordinating dozens of joints in real-time for locomotion, manipulation, and
                  balance
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>👁️</div>
                <h3 className={styles.featureTitle}>Perception Systems</h3>
                <p className={styles.featureDescription}>
                  Integrating cameras, lidar, IMU, and force sensors for environmental awareness
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🧠</div>
                <h3 className={styles.featureTitle}>Cognitive Planning</h3>
                <p className={styles.featureDescription}>
                  Leveraging LLMs and VLA models to translate natural language into physical actions
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>⚡</div>
                <h3 className={styles.featureTitle}>Real-Time Execution</h3>
                <p className={styles.featureDescription}>
                  Meeting strict timing constraints for balance control and reactive behaviors
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who Is This For */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Who Is This For?</h2>
              <div className={styles.divider} />
            </div>
            <div className={styles.audienceGrid}>
              <div className={styles.audienceCard}>
                <h3 className={styles.audienceTitle}>🎓 Students & Learners</h3>
                <p className={styles.audienceDescription}>
                  Computer science, robotics, or mechatronics students seeking practical robotics
                  skills with industry-standard tools (ROS 2, Gazebo, NVIDIA Isaac)
                </p>
              </div>
              <div className={styles.audienceCard}>
                <h3 className={styles.audienceTitle}>👨‍💻 Software Engineers</h3>
                <p className={styles.audienceDescription}>
                  Developers transitioning from web/mobile to robotics, seeking hands-on training
                  with Python, ROS 2, and AI integration
                </p>
              </div>
              <div className={styles.audienceCard}>
                <h3 className={styles.audienceTitle}>🤖 Robotics Professionals</h3>
                <p className={styles.audienceDescription}>
                  Industry practitioners looking to upskill in humanoid-specific techniques,
                  simulation frameworks, or VLA model integration
                </p>
              </div>
              <div className={styles.audienceCard}>
                <h3 className={styles.audienceTitle}>🔬 Researchers</h3>
                <p className={styles.audienceDescription}>
                  Academic researchers needing reproducible simulation environments and standardized
                  benchmarks for Physical AI experiments
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Course Structure */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Course Structure</h2>
              <div className={styles.divider} />
            </div>
            <p className={styles.bodyText}>
              The textbook is organized into four foundational modules, designed to be completed
              over 13 weeks with a capstone project:
            </p>
            <div className={styles.moduleList}>
              <div className={styles.moduleItem}>
                <div className={styles.moduleNumber}>01</div>
                <div className={styles.moduleInfo}>
                  <h3 className={styles.moduleItemTitle}>The Robotic Nervous System (ROS 2)</h3>
                  <p className={styles.moduleItemDescription}>
                    Master ROS 2 middleware, nodes, topics, services, Python rclpy, and URDF robot
                    descriptions
                  </p>
                </div>
              </div>
              <div className={styles.moduleItem}>
                <div className={styles.moduleNumber}>02</div>
                <div className={styles.moduleInfo}>
                  <h3 className={styles.moduleItemTitle}>Digital Twin & Physics Simulation</h3>
                  <p className={styles.moduleItemDescription}>
                    Build virtual replicas with Gazebo physics, Unity visualization, and sensor
                    simulation
                  </p>
                </div>
              </div>
              <div className={styles.moduleItem}>
                <div className={styles.moduleNumber}>03</div>
                <div className={styles.moduleInfo}>
                  <h3 className={styles.moduleItemTitle}>NVIDIA Isaac Platform</h3>
                  <p className={styles.moduleItemDescription}>
                    Harness GPU-accelerated robotics with Isaac Sim, Isaac ROS vSLAM, and Nav2 path
                    planning
                  </p>
                </div>
              </div>
              <div className={styles.moduleItem}>
                <div className={styles.moduleNumber}>04</div>
                <div className={styles.moduleInfo}>
                  <h3 className={styles.moduleItemTitle}>Vision-Language-Action (VLA) Models</h3>
                  <p className={styles.moduleItemDescription}>
                    Integrate voice-to-action systems, LLM cognitive planning, and complete a
                    humanoid robot capstone project
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pedagogical Approach */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Simulation-First Approach</h2>
              <div className={styles.divider} />
            </div>
            <div className={styles.simulationLayout}>
              <div className={styles.simulationText}>
                <p className={styles.bodyText}>
                  This textbook follows a <strong>simulation-first</strong> pedagogy, meaning all
                  examples, exercises, and projects are designed to run safely in virtual
                  environments before real-world deployment:
                </p>
                <ul className={styles.benefitsList}>
                  <li>
                    <strong>Safety:</strong> Test behaviors without risk of hardware damage or
                    injury
                  </li>
                  <li>
                    <strong>Accessibility:</strong> Learn without expensive robotic hardware
                  </li>
                  <li>
                    <strong>Rapid Iteration:</strong> Debug and refine faster than real-world
                    testing
                  </li>
                  <li>
                    <strong>Reproducibility:</strong> Share exact simulation environments for
                    collaboration
                  </li>
                  <li>
                    <strong>Scalability:</strong> Train AI models with thousands of simulated
                    scenarios
                  </li>
                </ul>
              </div>
              <div className={styles.simulationImageWrapper}>
                <img
                  src={simulationImgSrc}
                  alt="AI simulation and digital twin visualization"
                  className={styles.simulationImage}
                  loading="lazy"
                />
                <div className={styles.simulationImageOverlay} aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Learning?</h2>
            <p className={styles.ctaDescription}>
              Begin your journey into Physical AI and humanoid robotics with our comprehensive
              interactive modules.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/docs/intro" className="btn-primary">
                Explore Modules
              </Link>
              <Link
                to="https://github.com/YOUR_GITHUB_USERNAME/physical-ai-textbook"
                className="btn-secondary"
              >
                View on GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
