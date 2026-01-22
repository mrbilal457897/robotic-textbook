/**
 * Reading Time Component
 * Calculates and displays estimated reading time for content pages
 * Formula: ⌈wordCount / 200⌉ + (codeBlocks × 1) + (diagrams × 0.5) minutes
 */

import React from 'react';
import styles from './styles.module.css';

interface ReadingTimeProps {
  wordCount: number;
  codeBlocks?: number;
  diagrams?: number;
  className?: string;
}

/**
 * Calculate reading time based on word count, code blocks, and diagrams
 * @param wordCount - Total word count of the content
 * @param codeBlocks - Number of code blocks (default: 0)
 * @param diagrams - Number of diagrams/images (default: 0)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(
  wordCount: number,
  codeBlocks: number = 0,
  diagrams: number = 0
): number {
  const baseReadingTime = Math.ceil(wordCount / 200);
  const codeTime = codeBlocks * 1;
  const diagramTime = diagrams * 0.5;

  return baseReadingTime + codeTime + diagramTime;
}

/**
 * Format reading time into user-friendly string
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read", "1 hour 15 min read")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return 'Less than 1 min read';
  }

  if (minutes < 60) {
    return `${minutes} min read`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} read`;
  }

  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min read`;
}

export default function ReadingTime({
  wordCount,
  codeBlocks = 0,
  diagrams = 0,
  className,
}: ReadingTimeProps): JSX.Element {
  const readingTime = calculateReadingTime(wordCount, codeBlocks, diagrams);
  const formattedTime = formatReadingTime(readingTime);

  return (
    <div className={`${styles.readingTime} ${className || ''}`} aria-label={`Estimated reading time: ${formattedTime}`}>
      <svg
        className={styles.icon}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 4V8L10.5 9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.text}>{formattedTime}</span>
    </div>
  );
}
