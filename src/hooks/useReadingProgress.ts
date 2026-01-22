/**
 * Reading Progress Hook
 * Tracks scroll position and detects page completion threshold
 * Stores progress in localStorage for authenticated users
 */

import { useState, useEffect, useCallback } from 'react';

interface ReadingProgress {
  scrollPercentage: number;
  isCompleted: boolean;
  completionTime?: Date;
}

interface UseReadingProgressOptions {
  pageId: string;
  completionThreshold?: number;
  enableStorage?: boolean;
}

interface UseReadingProgressReturn {
  scrollPercentage: number;
  isCompleted: boolean;
  markAsComplete: () => void;
  resetProgress: () => void;
}

const STORAGE_KEY_PREFIX = 'reading_progress_';

/**
 * Custom hook for tracking reading progress on content pages
 * @param options - Configuration options
 * @returns Reading progress state and control functions
 */
export function useReadingProgress({
  pageId,
  completionThreshold = 80,
  enableStorage = true,
}: UseReadingProgressOptions): UseReadingProgressReturn {
  const storageKey = `${STORAGE_KEY_PREFIX}${pageId}`;

  // Initialize state from localStorage if available
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(() => {
    if (!enableStorage || typeof window === 'undefined') {
      return false;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const progress: ReadingProgress = JSON.parse(stored);
        return progress.isCompleted;
      }
    } catch (error) {
      console.error('Error reading progress from localStorage:', error);
    }

    return false;
  });

  // Calculate scroll percentage
  const calculateScrollPercentage = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const totalScrollableHeight = documentHeight - windowHeight;
    const percentage = totalScrollableHeight > 0 ? (scrollTop / totalScrollableHeight) * 100 : 0;

    return Math.min(100, Math.max(0, percentage));
  }, []);

  // Mark page as complete
  const markAsComplete = useCallback(() => {
    setIsCompleted(true);

    if (enableStorage && typeof window !== 'undefined') {
      try {
        const progress: ReadingProgress = {
          scrollPercentage: 100,
          isCompleted: true,
          completionTime: new Date(),
        };
        localStorage.setItem(storageKey, JSON.stringify(progress));
      } catch (error) {
        console.error('Error saving progress to localStorage:', error);
      }
    }
  }, [enableStorage, storageKey]);

  // Reset progress
  const resetProgress = useCallback(() => {
    setIsCompleted(false);
    setScrollPercentage(0);

    if (enableStorage && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error('Error removing progress from localStorage:', error);
      }
    }
  }, [enableStorage, storageKey]);

  // Track scroll position
  useEffect(() => {
    const updateScrollProgress = () => {
      const percentage = calculateScrollPercentage();
      setScrollPercentage(percentage);

      // Auto-complete when threshold reached
      if (percentage >= completionThreshold && !isCompleted) {
        markAsComplete();
      }
    };

    // Calculate on mount
    updateScrollProgress();

    // Add scroll listener with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [calculateScrollPercentage, completionThreshold, isCompleted, markAsComplete]);

  return {
    scrollPercentage,
    isCompleted,
    markAsComplete,
    resetProgress,
  };
}

/**
 * Get all completed pages from localStorage
 * @returns Array of completed page IDs
 */
export function getCompletedPages(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const completedPages: string[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const progress: ReadingProgress = JSON.parse(stored);
          if (progress.isCompleted) {
            const pageId = key.replace(STORAGE_KEY_PREFIX, '');
            completedPages.push(pageId);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading completed pages:', error);
  }

  return completedPages;
}

/**
 * Calculate module completion percentage
 * @param moduleId - Module identifier
 * @param totalPages - Total number of pages in the module
 * @returns Completion percentage (0-100)
 */
export function calculateModuleCompletion(moduleId: string, totalPages: number): number {
  const completedPages = getCompletedPages();
  const modulePages = completedPages.filter((pageId) => pageId.startsWith(moduleId));

  if (totalPages === 0) {
    return 0;
  }

  return Math.round((modulePages.length / totalPages) * 100);
}
