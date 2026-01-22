/**
 * Hardware Requirements Component
 * Tabbed interface showing different hardware configurations
 * Displays component specifications and pricing for 4 setup options
 */

import React, { useState } from 'react';
import styles from './styles.module.css';

type TabKey = 'workstation' | 'edge' | 'lab' | 'cloud';

interface HardwareSpec {
  component: string;
  specification: string;
  price: string;
}

interface TabContent {
  key: TabKey;
  label: string;
  icon: string;
  description: string;
  specs: HardwareSpec[];
  totalPrice: string;
}

export default function HardwareRequirements(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>('workstation');

  const tabs: TabContent[] = [
    {
      key: 'workstation',
      label: 'Workstation',
      icon: '🖥️',
      description: 'High-performance development workstation for simulation and training',
      specs: [
        { component: 'CPU', specification: 'AMD Ryzen 9 7950X (16-core, 32-thread)', price: '$549' },
        { component: 'GPU', specification: 'NVIDIA RTX 4090 (24GB VRAM)', price: '$1,599' },
        { component: 'RAM', specification: '64GB DDR5-6000 (2x32GB)', price: '$220' },
        { component: 'Storage', specification: '2TB NVMe Gen4 SSD', price: '$150' },
        { component: 'Motherboard', specification: 'X670E Chipset with PCIe 5.0', price: '$350' },
        { component: 'Power Supply', specification: '1000W 80+ Platinum', price: '$180' },
        { component: 'Cooling', specification: 'AIO Liquid Cooler 360mm', price: '$140' },
      ],
      totalPrice: '$3,188',
    },
    {
      key: 'edge',
      label: 'Edge Kit',
      icon: '📦',
      description: 'Compact edge computing kit for on-robot processing',
      specs: [
        { component: 'Edge Device', specification: 'NVIDIA Jetson AGX Orin (64GB)', price: '$1,999' },
        { component: 'Storage', specification: '1TB NVMe SSD (M.2 2280)', price: '$80' },
        { component: 'Power Supply', specification: '65W USB-C PD Adapter', price: '$35' },
        { component: 'Camera Module', specification: 'Intel RealSense D455 (Depth)', price: '$389' },
        { component: 'IMU Sensor', specification: 'VectorNav VN-100 (9-axis)', price: '$695' },
        { component: 'LiDAR', specification: 'RPLIDAR A3M1 (360° Laser)', price: '$599' },
        { component: 'Case & Cooling', specification: 'Aluminum enclosure with fans', price: '$85' },
      ],
      totalPrice: '$3,882',
    },
    {
      key: 'lab',
      label: 'Robot Lab',
      icon: '🤖',
      description: 'Complete laboratory setup for physical humanoid robot testing',
      specs: [
        { component: 'Humanoid Platform', specification: 'TurtleBot 4 Pro or equivalent', price: '$3,499' },
        { component: 'Motion Capture', specification: 'OptiTrack System (8 cameras)', price: '$18,000' },
        { component: 'Force Plates', specification: 'AMTI OR6-7 (2x dual-axis)', price: '$12,000' },
        { component: 'Computing Server', specification: 'Dual Xeon + RTX A6000 (48GB)', price: '$8,500' },
        { component: 'Network Switch', specification: 'Managed 10GbE 24-port', price: '$1,200' },
        { component: 'Safety System', specification: 'E-stop + Light curtains', price: '$3,500' },
        { component: 'Lab Infrastructure', specification: 'Flooring, lighting, workspace', price: '$15,000' },
      ],
      totalPrice: '$61,699',
    },
    {
      key: 'cloud',
      label: 'Cloud Option',
      icon: '☁️',
      description: 'Cloud-based development without local hardware investment',
      specs: [
        {
          component: 'AWS EC2 Instance',
          specification: 'g5.4xlarge (NVIDIA A10G, 16 vCPU, 64GB RAM)',
          price: '$1.62/hr',
        },
        {
          component: 'Storage (EBS)',
          specification: '500GB SSD (gp3, 3000 IOPS)',
          price: '$40/month',
        },
        {
          component: 'Data Transfer',
          specification: 'Internet egress (first 100GB free)',
          price: '$0.09/GB',
        },
        {
          component: 'Estimated Monthly',
          specification: '100 hours compute + storage + 50GB transfer',
          price: '$206/month',
        },
        {
          component: 'Alternative',
          specification: 'Google Colab Pro+ (A100, 500 compute units)',
          price: '$49.99/month',
        },
      ],
      totalPrice: '~$206-250/mo',
    },
  ];

  const currentContent = tabs.find((tab) => tab.key === activeTab)!;

  return (
    <section className={styles.hardware} aria-labelledby="hardware-title">
      <div className={styles.hardwareInner}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Technical Requirements</span>
          <h2 id="hardware-title" className={styles.sectionTitle}>
            <span className="gradient-text">Hardware Requirements</span>
          </h2>
          <p className={styles.sectionDescription}>
            Flexible hardware options from cloud-based to full robotics laboratory setups
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabBar} role="tablist" aria-label="Hardware configuration options">
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
          <div className={styles.contentHeader}>
            <p className={styles.contentDescription}>{currentContent.description}</p>
            <div className={styles.totalPrice}>
              <span className={styles.priceLabel}>Total:</span>
              <span className={styles.priceValue}>{currentContent.totalPrice}</span>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.specsTable}>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Specification</th>
                  <th className={styles.priceColumn}>Price</th>
                </tr>
              </thead>
              <tbody>
                {currentContent.specs.map((spec, index) => (
                  <tr key={index}>
                    <td className={styles.componentCell}>{spec.component}</td>
                    <td className={styles.specCell}>{spec.specification}</td>
                    <td className={`${styles.priceCell} ${styles.priceColumn}`}>{spec.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
