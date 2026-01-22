/**
 * useSearchHistory Hook
 * Manages search history for authenticated users
 */

import { useEffect, useState } from "react";

export interface SearchHistoryItem {
  query: string;
  timestamp: string;
  resultCount?: number;
}

interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  addToHistory: (query: string, resultCount?: number) => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;
}

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 20;

/**
 * Hook for managing search history
 * @returns Search history items and control functions
 */
export function useSearchHistory(): UseSearchHistoryReturn {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (stored) {
          const items: SearchHistoryItem[] = JSON.parse(stored);
          setHistory(items);
        }
      } catch (error) {
        console.error("Failed to load search history:", error);
      }
    };

    loadHistory();
  }, []);

  const addToHistory = (query: string, resultCount?: number) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setHistory((prevHistory) => {
      // Remove duplicate if it exists
      const filtered = prevHistory.filter(
        (item) => item.query.toLowerCase() !== trimmedQuery.toLowerCase()
      );

      // Add new item to the beginning
      const newItem: SearchHistoryItem = {
        query: trimmedQuery,
        timestamp: new Date().toISOString(),
        resultCount,
      };

      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      // Save to localStorage
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save search history:", error);
      }

      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error("Failed to clear search history:", error);
    }
  };

  const removeFromHistory = (query: string) => {
    setHistory((prevHistory) => {
      const updated = prevHistory.filter(
        (item) => item.query.toLowerCase() !== query.toLowerCase()
      );

      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to update search history:", error);
      }

      return updated;
    });
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}
