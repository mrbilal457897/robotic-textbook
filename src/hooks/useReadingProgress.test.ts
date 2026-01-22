/**
 * Tests for useReadingProgress Hook
 * Testing scroll tracking, completion detection, and localStorage persistence
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useReadingProgress,
  getCompletedPages,
  calculateModuleCompletion,
} from './useReadingProgress';

const STORAGE_KEY_PREFIX = 'reading_progress_';

describe('useReadingProgress', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    // Mock window dimensions and scroll
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 3000,
    });

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  describe('Initial State', () => {
    it('should initialize with 0% scroll and not completed', () => {
      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      expect(result.current.scrollPercentage).toBe(0);
      expect(result.current.isCompleted).toBe(false);
    });

    it('should load completion status from localStorage', () => {
      const storageKey = `${STORAGE_KEY_PREFIX}test-page`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          scrollPercentage: 100,
          isCompleted: true,
          completionTime: new Date().toISOString(),
        })
      );

      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      expect(result.current.isCompleted).toBe(true);
    });

    it('should handle corrupted localStorage data', () => {
      const storageKey = `${STORAGE_KEY_PREFIX}test-page`;
      localStorage.setItem(storageKey, 'invalid-json');

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      expect(result.current.isCompleted).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should respect enableStorage option', () => {
      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page', enableStorage: false })
      );

      act(() => {
        result.current.markAsComplete();
      });

      expect(result.current.isCompleted).toBe(true);
      expect(localStorage.getItem(`${STORAGE_KEY_PREFIX}test-page`)).toBeNull();
    });
  });

  describe('Scroll Percentage Calculation', () => {
    it('should calculate scroll percentage correctly at 0%', () => {
      Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      expect(result.current.scrollPercentage).toBe(0);
    });

    it('should calculate scroll percentage correctly at 50%', async () => {
      // scrollHeight: 3000, innerHeight: 1000, scrollY: 1000
      // totalScrollableHeight = 3000 - 1000 = 2000
      // percentage = (1000 / 2000) * 100 = 50
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });

      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      // Trigger scroll event
      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(result.current.scrollPercentage).toBeCloseTo(50, 0);
    });

    it('should calculate scroll percentage correctly at 100%', async () => {
      // At bottom: scrollY = 2000 (scrollHeight - innerHeight)
      Object.defineProperty(window, 'scrollY', { value: 2000, writable: true });

      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(result.current.scrollPercentage).toBeCloseTo(100, 0);
    });

    it('should handle pages with no scrollable content', () => {
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 1000,
        writable: true,
      });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      expect(result.current.scrollPercentage).toBe(0);
    });
  });

  describe('Auto-completion', () => {
    it('should auto-complete when reaching threshold (80%)', async () => {
      const { result } = renderHook(() =>
        useReadingProgress({
          pageId: 'test-page',
          completionThreshold: 80,
        })
      );

      // Scroll to 80%: scrollY = 1600 (80% of 2000)
      Object.defineProperty(window, 'scrollY', { value: 1600, writable: true });

      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      await waitFor(() => {
        expect(result.current.isCompleted).toBe(true);
      });
    });

    it('should respect custom completion threshold', async () => {
      const { result } = renderHook(() =>
        useReadingProgress({
          pageId: 'test-page',
          completionThreshold: 90,
        })
      );

      // Scroll to 85% (below 90% threshold)
      Object.defineProperty(window, 'scrollY', { value: 1700, writable: true });

      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(result.current.isCompleted).toBe(false);

      // Scroll to 90%
      Object.defineProperty(window, 'scrollY', { value: 1800, writable: true });

      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      await waitFor(() => {
        expect(result.current.isCompleted).toBe(true);
      });
    });

    it('should not trigger auto-complete multiple times', async () => {
      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      // Scroll to 80%
      Object.defineProperty(window, 'scrollY', { value: 1600, writable: true });

      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      await waitFor(() => {
        expect(result.current.isCompleted).toBe(true);
      });

      const firstCompletionState = result.current.isCompleted;

      // Scroll further
      Object.defineProperty(window, 'scrollY', { value: 2000, writable: true });

      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(result.current.isCompleted).toBe(firstCompletionState);
    });
  });

  describe('Manual Completion', () => {
    it('should mark page as complete', () => {
      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      act(() => {
        result.current.markAsComplete();
      });

      expect(result.current.isCompleted).toBe(true);
    });

    it('should save completion to localStorage', () => {
      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      act(() => {
        result.current.markAsComplete();
      });

      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}test-page`);
      expect(stored).not.toBeNull();

      const progress = JSON.parse(stored!);
      expect(progress.isCompleted).toBe(true);
      expect(progress.scrollPercentage).toBe(100);
      expect(progress.completionTime).toBeDefined();
    });

    it('should handle localStorage errors gracefully', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      act(() => {
        result.current.markAsComplete();
      });

      expect(result.current.isCompleted).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Reset Progress', () => {
    it('should reset completion state', () => {
      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      act(() => {
        result.current.markAsComplete();
      });

      expect(result.current.isCompleted).toBe(true);

      act(() => {
        result.current.resetProgress();
      });

      expect(result.current.isCompleted).toBe(false);
      expect(result.current.scrollPercentage).toBe(0);
    });

    it('should remove data from localStorage', () => {
      const { result } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      act(() => {
        result.current.markAsComplete();
      });

      expect(localStorage.getItem(`${STORAGE_KEY_PREFIX}test-page`)).not.toBeNull();

      act(() => {
        result.current.resetProgress();
      });

      expect(localStorage.getItem(`${STORAGE_KEY_PREFIX}test-page`)).toBeNull();
    });
  });

  describe('Event Listeners', () => {
    it('should clean up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useReadingProgress({ pageId: 'test-page' })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });
});

describe('getCompletedPages', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return empty array when no pages are completed', () => {
    const completed = getCompletedPages();
    expect(completed).toEqual([]);
  });

  it('should return all completed page IDs', () => {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}page-1`,
      JSON.stringify({ isCompleted: true, scrollPercentage: 100 })
    );
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}page-2`,
      JSON.stringify({ isCompleted: true, scrollPercentage: 100 })
    );
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}page-3`,
      JSON.stringify({ isCompleted: false, scrollPercentage: 50 })
    );

    const completed = getCompletedPages();
    expect(completed).toHaveLength(2);
    expect(completed).toContain('page-1');
    expect(completed).toContain('page-2');
    expect(completed).not.toContain('page-3');
  });

  it('should handle corrupted data gracefully', () => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}page-1`, 'invalid-json');

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const completed = getCompletedPages();
    expect(completed).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

describe('calculateModuleCompletion', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return 0% when no pages are completed', () => {
    const completion = calculateModuleCompletion('module-01', 10);
    expect(completion).toBe(0);
  });

  it('should calculate completion percentage correctly', () => {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}module-01-page-1`,
      JSON.stringify({ isCompleted: true, scrollPercentage: 100 })
    );
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}module-01-page-2`,
      JSON.stringify({ isCompleted: true, scrollPercentage: 100 })
    );
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}module-01-page-3`,
      JSON.stringify({ isCompleted: true, scrollPercentage: 100 })
    );

    const completion = calculateModuleCompletion('module-01', 10);
    expect(completion).toBe(30);
  });

  it('should only count pages from specified module', () => {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}module-01-page-1`,
      JSON.stringify({ isCompleted: true, scrollPercentage: 100 })
    );
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}module-02-page-1`,
      JSON.stringify({ isCompleted: true, scrollPercentage: 100 })
    );

    const completion = calculateModuleCompletion('module-01', 5);
    expect(completion).toBe(20);
  });

  it('should handle 0 total pages', () => {
    const completion = calculateModuleCompletion('module-01', 0);
    expect(completion).toBe(0);
  });

  it('should return 100% when all pages are completed', () => {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}module-01-page-1`,
      JSON.stringify({ isCompleted: true, scrollPercentage: 100 })
    );
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}module-01-page-2`,
      JSON.stringify({ isCompleted: true, scrollPercentage: 100 })
    );

    const completion = calculateModuleCompletion('module-01', 2);
    expect(completion).toBe(100);
  });
});
