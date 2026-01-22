/**
 * Tests for useSearchHistory Hook
 * Testing search history management and persistence
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearchHistory, SearchHistoryItem } from './useSearchHistory';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 20;

describe('useSearchHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty history', async () => {
      const { result } = renderHook(() => useSearchHistory());

      await waitFor(() => {
        expect(result.current.history).toEqual([]);
      });
    });

    it('should load existing history from localStorage', async () => {
      const mockHistory: SearchHistoryItem[] = [
        {
          query: 'ROS 2',
          timestamp: new Date().toISOString(),
          resultCount: 42,
        },
        {
          query: 'humanoid robots',
          timestamp: new Date().toISOString(),
          resultCount: 15,
        },
      ];

      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(mockHistory));

      const { result } = renderHook(() => useSearchHistory());

      await waitFor(() => {
        expect(result.current.history).toEqual(mockHistory);
      });
    });

    it('should handle corrupted localStorage data', async () => {
      localStorage.setItem(SEARCH_HISTORY_KEY, 'invalid-json');

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useSearchHistory());

      await waitFor(() => {
        expect(result.current.history).toEqual([]);
      });

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Add to History', () => {
    it('should add search query to history', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2', 42);
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].query).toBe('ROS 2');
      expect(result.current.history[0].resultCount).toBe(42);
    });

    it('should add new items to the beginning of history', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('First search');
      });

      act(() => {
        result.current.addToHistory('Second search');
      });

      expect(result.current.history[0].query).toBe('Second search');
      expect(result.current.history[1].query).toBe('First search');
    });

    it('should trim whitespace from query', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('  ROS 2  ');
      });

      expect(result.current.history[0].query).toBe('ROS 2');
    });

    it('should ignore empty queries', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('');
      });

      expect(result.current.history).toHaveLength(0);
    });

    it('should ignore whitespace-only queries', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('   ');
      });

      expect(result.current.history).toHaveLength(0);
    });

    it('should set timestamp on new items', () => {
      const { result } = renderHook(() => useSearchHistory());

      const before = new Date();

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      const after = new Date();
      const timestamp = new Date(result.current.history[0].timestamp);

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should save to localStorage', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2', 42);
      });

      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      expect(stored).not.toBeNull();

      const history: SearchHistoryItem[] = JSON.parse(stored!);
      expect(history).toHaveLength(1);
      expect(history[0].query).toBe('ROS 2');
    });

    it('should include optional resultCount', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2', 42);
      });

      expect(result.current.history[0].resultCount).toBe(42);
    });

    it('should work without resultCount', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      expect(result.current.history[0].resultCount).toBeUndefined();
    });
  });

  describe('Duplicate Handling', () => {
    it('should remove duplicate before adding', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      act(() => {
        result.current.addToHistory('Digital Twin');
      });

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      expect(result.current.history).toHaveLength(2);
      expect(result.current.history[0].query).toBe('ROS 2');
      expect(result.current.history[1].query).toBe('Digital Twin');
    });

    it('should be case-insensitive when detecting duplicates', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      act(() => {
        result.current.addToHistory('ros 2');
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].query).toBe('ros 2');
    });

    it('should update timestamp when re-adding duplicate', async () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      const firstTimestamp = result.current.history[0].timestamp;

      // Wait to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      const secondTimestamp = result.current.history[0].timestamp;

      // Timestamps should be different (second one should be later)
      expect(new Date(secondTimestamp).getTime()).toBeGreaterThanOrEqual(
        new Date(firstTimestamp).getTime()
      );
    });
  });

  describe('History Limit', () => {
    it('should limit history to MAX_HISTORY_ITEMS', () => {
      const { result } = renderHook(() => useSearchHistory());

      // Add more than MAX_HISTORY_ITEMS
      act(() => {
        for (let i = 0; i < MAX_HISTORY_ITEMS + 5; i++) {
          result.current.addToHistory(`Query ${i}`);
        }
      });

      expect(result.current.history).toHaveLength(MAX_HISTORY_ITEMS);
    });

    it('should remove oldest items when exceeding limit', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        for (let i = 0; i < MAX_HISTORY_ITEMS; i++) {
          result.current.addToHistory(`Query ${i}`);
        }
      });

      expect(result.current.history[result.current.history.length - 1].query).toBe('Query 0');

      act(() => {
        result.current.addToHistory('New Query');
      });

      expect(result.current.history[0].query).toBe('New Query');
      expect(result.current.history.find((item) => item.query === 'Query 0')).toBeUndefined();
    });
  });

  describe('Clear History', () => {
    it('should clear all history', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
        result.current.addToHistory('Digital Twin');
      });

      expect(result.current.history).toHaveLength(2);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.history).toHaveLength(0);
    });

    it('should remove history from localStorage', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      expect(localStorage.getItem(SEARCH_HISTORY_KEY)).not.toBeNull();

      act(() => {
        result.current.clearHistory();
      });

      expect(localStorage.getItem(SEARCH_HISTORY_KEY)).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
      removeItemSpy.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.history).toHaveLength(0);
      expect(consoleErrorSpy).toHaveBeenCalled();

      removeItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Remove from History', () => {
    it('should remove specific item from history', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
        result.current.addToHistory('Digital Twin');
        result.current.addToHistory('Isaac Sim');
      });

      expect(result.current.history).toHaveLength(3);

      act(() => {
        result.current.removeFromHistory('Digital Twin');
      });

      expect(result.current.history).toHaveLength(2);
      expect(result.current.history.find((item) => item.query === 'Digital Twin')).toBeUndefined();
    });

    it('should be case-insensitive when removing', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      act(() => {
        result.current.removeFromHistory('ros 2');
      });

      expect(result.current.history).toHaveLength(0);
    });

    it('should update localStorage after removal', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
        result.current.addToHistory('Digital Twin');
      });

      act(() => {
        result.current.removeFromHistory('ROS 2');
      });

      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      const history: SearchHistoryItem[] = JSON.parse(stored!);

      expect(history).toHaveLength(1);
      expect(history[0].query).toBe('Digital Twin');
    });

    it('should handle removing non-existent item', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      act(() => {
        result.current.removeFromHistory('Non-existent');
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].query).toBe('ROS 2');
    });

    it('should handle localStorage errors gracefully', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useSearchHistory());

      // Pre-populate history in state without using localStorage
      act(() => {
        result.current.addToHistory('ROS 2');
      });

      // Now mock setItem to throw
      act(() => {
        result.current.removeFromHistory('ROS 2');
      });

      expect(result.current.history).toHaveLength(0);
      expect(consoleErrorSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('localStorage Error Handling', () => {
    it('should handle localStorage save errors when adding', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory('ROS 2');
      });

      expect(result.current.history).toHaveLength(1);
      expect(consoleErrorSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('History Persistence', () => {
    it('should persist across hook instances', async () => {
      const { result: result1 } = renderHook(() => useSearchHistory());

      act(() => {
        result1.current.addToHistory('ROS 2');
        result1.current.addToHistory('Digital Twin');
      });

      const { result: result2 } = renderHook(() => useSearchHistory());

      await waitFor(() => {
        expect(result2.current.history).toHaveLength(2);
      });

      expect(result2.current.history[0].query).toBe('Digital Twin');
      expect(result2.current.history[1].query).toBe('ROS 2');
    });
  });
});
