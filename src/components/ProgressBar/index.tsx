/**
 * Progress Bar Component
 * Displays scroll progress at top of page
 * Detects 80% threshold for page completion tracking
 */

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface ProgressBarProps {
  onCompletion?: () => void;
  completionThreshold?: number;
}

export default function ProgressBar({
  onCompletion,
  completionThreshold = 80,
}: ProgressBarProps): JSX.Element {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const calculateScrollPercentage = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Calculate scroll percentage
      const totalScrollableHeight = documentHeight - windowHeight;
      const percentage = totalScrollableHeight > 0 ? (scrollTop / totalScrollableHeight) * 100 : 0;

      setScrollPercentage(Math.min(100, Math.max(0, percentage)));

      // Check completion threshold
      if (percentage >= completionThreshold && !isCompleted) {
        setIsCompleted(true);
        if (onCompletion) {
          onCompletion();
        }
      }
    };

    // Calculate on mount
    calculateScrollPercentage();

    // Add scroll event listener with throttling for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateScrollPercentage();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [completionThreshold, isCompleted, onCompletion]);

  return (
    <div
      className={styles.progressContainer}
      role="progressbar"
      aria-valuenow={Math.round(scrollPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Page scroll progress: ${Math.round(scrollPercentage)}%`}
    >
      <div
        className={styles.progressBar}
        style={{ width: `${scrollPercentage}%` }}
        data-completed={isCompleted}
      />
    </div>
  );
}
