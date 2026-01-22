/**
 * ModuleCard Component
 * Individual module card with glassmorphism styling
 */

import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export interface ModuleCardProps {
  number: number;
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

export default function ModuleCard({
  number,
  title,
  description,
  link,
  icon,
}: ModuleCardProps): JSX.Element {
  return (
    <div className={styles.moduleCard}>
      <div className={styles.moduleCardInner}>
        <div className={styles.moduleNumber}>Module {number}</div>
        <div className={styles.moduleIcon}>{icon}</div>
        <h3 className={styles.moduleTitle}>{title}</h3>
        <p className={styles.moduleDescription}>{description}</p>
        <Link to={link} className={`${styles.moduleButton} btn-secondary`}>
          Explore Module
        </Link>
      </div>
      <div className={styles.shimmerOverlay} aria-hidden="true" />
    </div>
  );
}
