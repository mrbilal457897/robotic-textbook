import React from "react";
import styles from "./styles.module.css";

export interface SearchResult {
  id: string;
  title: string;
  breadcrumb: string[];
  snippet: string;
  url: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelectResult: (url: string) => void;
  query: string;
}

export function SearchResults({
  results,
  selectedIndex,
  onSelectResult,
  query,
}: SearchResultsProps) {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className={styles.highlight}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  if (results.length === 0) {
    return (
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
    );
  }

  // Group results by module
  const groupedResults = results.reduce(
    (acc, result) => {
      const module = result.breadcrumb[0] || "General";
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  return (
    <div>
      {Object.entries(groupedResults).map(([module, moduleResults]) => (
        <div key={module} className={styles.resultsSection}>
          <div className={styles.sectionTitle}>{module}</div>
          <div className={styles.searchResults}>
            {moduleResults.map((result, index) => {
              const globalIndex = results.indexOf(result);
              return (
                <a
                  key={result.id}
                  href={result.url}
                  className={`${styles.resultItem} ${
                    globalIndex === selectedIndex ? styles.selected : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectResult(result.url);
                  }}
                >
                  <div className={styles.resultTitle}>
                    {highlightText(result.title, query)}
                  </div>
                  <div className={styles.resultBreadcrumb}>
                    {result.breadcrumb.map((crumb, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && (
                          <span className={styles.breadcrumbSeparator}>›</span>
                        )}
                        <span>{crumb}</span>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className={styles.resultSnippet}>
                    {highlightText(result.snippet, query)}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
