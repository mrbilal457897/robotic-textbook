/**
 * Homepage - Main Landing Page
 * Orchestrates all 6 homepage sections in proper order
 */

import React from 'react';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero';
import CourseModules from '@site/src/components/CourseModules';
import WhyPhysicalAI from '@site/src/components/WhyPhysicalAI';
import Timeline from '@site/src/components/Timeline';
import CurricularGuidance from '@site/src/components/CurricularGuidance';
import HardwareRequirements from '@site/src/components/HardwareRequirements';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Comprehensive interactive textbook covering ROS 2, Digital Twins, NVIDIA Isaac, and Vision-Language-Action models for humanoid robotics development."
    >
      <main>
        {/* Section 1: Hero with CTA */}
        <Hero />

        {/* Section 2: Course Modules (4 cards) */}
        <CourseModules />

        {/* Section 3: Why Physical AI Matters */}
        <WhyPhysicalAI />

        {/* Section 4: Weekly Breakdown (13 weeks timeline) */}
        <Timeline />

        {/* Section 5: Curricular Guidance (tabs) */}
        <CurricularGuidance />

        {/* Section 6: Hardware Requirements (tabs) */}
        <HardwareRequirements />
      </main>
    </Layout>
  );
}
