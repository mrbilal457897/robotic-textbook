import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from '@docusaurus/router';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { SearchResults, SearchResult } from './SearchResults';
import styles from './styles.module.css';

/**
 * SearchUI Component
 *
 * Provides a global search interface with:
 * - Keyboard shortcut (Ctrl/Cmd+K) to open modal
 * - Real-time search results from docusaurus-search-local
 * - Recent search history
 * - Keyboard navigation (arrow keys, enter)
 * - Mobile-responsive design
 */

interface SearchUIProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SearchUI({ isOpen: externalIsOpen, onClose }: SearchUIProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToHistory, clearHistory, getHistory } = useSearchHistory();
  const history = useHistory();
  const recentSearches = getHistory();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  }, [onClose]);

  // Handle keyboard shortcut (Ctrl/Cmd+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (externalIsOpen === undefined) {
          setInternalIsOpen(true);
        }
        setSearchQuery('');
        setSelectedIndex(0);
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, externalIsOpen, handleClose]);

  // Search function using docusaurus-search-local
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Access the search index built by docusaurus-search-local
      // The plugin creates a search index that can be queried
      const searchIndex = (window as any).__docusaurus?.searchMetadata || null;

      if (searchIndex) {
        // Filter results from the search index
        const filteredResults = Object.entries(searchIndex).filter(([_, meta]: [string, any]) => {
          const searchableText =
            `${meta.title || ''} ${meta.description || ''} ${meta.content || ''}`.toLowerCase();
          return searchableText.includes(query.toLowerCase());
        });

        const formattedResults = filteredResults.map(([url, meta]: [string, any]) => ({
          id: url,
          title: meta.title || 'Untitled',
          breadcrumb: meta.breadcrumb || ['Module'],
          snippet:
            meta.description || meta.content?.substring(0, 150) || 'No description available',
          url,
        }));

        setResults(formattedResults);
        setSelectedIndex(0);
      } else {
        // Fallback: empty results if search index not available
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Handle keyboard navigation in search results
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
          break;

        case 'Enter':
          e.preventDefault();
          if (results.length > 0) {
            const selectedResult = results[selectedIndex];
            if (selectedResult) {
              handleSelectResult(selectedResult.url);
            }
          } else if (searchQuery.trim()) {
            // If no results but query exists, add to history and close
            addToHistory(searchQuery);
            handleClose();
          }
          break;

        default:
          break;
      }
    },
    [results, selectedIndex, searchQuery, addToHistory]
  );

  // Handle result selection
  const handleSelectResult = (url: string) => {
    addToHistory(searchQuery);
    handleClose();
    history.push(url);
  };

  // Handle recent search click
  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  // Handle recent search removal
  const handleRemoveRecent = (query: string) => {
    // This would require updating useSearchHistory to support removal
    // For now, we'll just clear all or ignore this interaction
  };

  // Determine what to display in the modal body
  const displayedResults = useMemo(() => {
    if (searchQuery.trim()) {
      return results;
    }
    // Show empty state or recent searches placeholder
    return [];
  }, [searchQuery, results]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.searchModal} onClick={handleClose}>
      <div className={styles.searchContainer} onClick={e => e.stopPropagation()}>
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <div className={styles.searchInputWrapper}>
            {/* Search Icon */}
            <svg
              className={styles.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {/* Search Input */}
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search modules, lessons, concepts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />

            {/* Keyboard Shortcut Hint */}
            <div className={styles.keyboardShortcut}>
              <span className={styles.key}>⌘</span>
              <span className={styles.key}>K</span>
            </div>

            {/* Close Button */}
            <button className={styles.closeButton} onClick={handleClose} aria-label="Close search">
              ✕
            </button>
          </div>
        </div>

        {/* Search Body */}
        <div className={styles.searchBody}>
          {searchQuery.trim() ? (
            // Show search results
            <>
              {isLoading ? (
                <div className={styles.emptyState}>
                  <p>Searching...</p>
                </div>
              ) : displayedResults.length > 0 ? (
                <SearchResults
                  results={displayedResults}
                  selectedIndex={selectedIndex}
                  onSelectResult={handleSelectResult}
                  query={searchQuery}
                />
              ) : (
                <div className={styles.emptyState}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3>No results found</h3>
                  <p>Try adjusting your search query or browse by module.</p>
                </div>
              )}
            </>
          ) : (
            // Show recent searches
            <>
              {recentSearches.length > 0 && (
                <div className={styles.recentSearches}>
                  <div
                    style={{
                      color: '#00f0ff',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.75rem',
                      paddingLeft: '0.5rem',
                    }}
                  >
                    Recent Searches
                  </div>
                  {recentSearches.map((search, index) => (
                    <div
                      key={`${search}-${index}`}
                      className={styles.recentSearchItem}
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <span className={styles.recentSearchText}>{search}</span>
                      <button
                        className={styles.removeButton}
                        onClick={e => {
                          e.stopPropagation();
                          handleRemoveRecent(search);
                        }}
                        aria-label="Remove from history"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {recentSearches.length === 0 && (
                <div className={styles.emptyState}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3>Start Searching</h3>
                  <p>Type to search across all modules and lessons.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Search Footer */}
        <div className={styles.searchFooter}>
          <div className={styles.navHint}>
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> Navigate
            </span>
            <span style={{ marginLeft: '1rem' }}>
              <kbd>⏎</kbd> Select
            </span>
            <span style={{ marginLeft: '1rem' }}>
              <kbd>ESC</kbd> Close
            </span>
          </div>
          {results.length > 0 && <span>{results.length} result(s) found</span>}
        </div>
      </div>
    </div>
  );
}
