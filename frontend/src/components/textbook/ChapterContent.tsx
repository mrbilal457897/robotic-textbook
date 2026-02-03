/**
 * ChapterContent Component
 * Client component wrapper for chapter content with highlight-to-ask functionality
 * and citation-based paragraph highlighting (T122)
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { useTextSelection } from '../highlight/useTextSelection';
import { SelectionToolbar } from '../highlight/SelectionToolbar';

export interface ChapterContentProps {
  children: React.ReactNode;
  bookId: string;
  chapterId: string;
  onAskAI?: (action: string, text: string, bookId: string, chapterId: string) => void;
}

export function ChapterContent({ children, bookId, chapterId, onAskAI }: ChapterContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const { selection, clearSelection, hasSelection } = useTextSelection({
    minLength: 10,
    maxLength: 8000,
    containerRef: contentRef,
  });

  /**
   * T122: Handle citation-based navigation and paragraph highlighting
   * Highlights the target paragraph with a 2-second fade animation
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for hash in URL (e.g., #chunk_00042 or #paragraph-3)
    const hash = window.location.hash.slice(1); // Remove #
    if (!hash) return;

    // Find the target element
    let targetElement = document.getElementById(hash);

    // If direct ID not found, try finding by data attribute (chunk_id)
    if (!targetElement) {
      targetElement = document.querySelector(`[data-chunk-id="${hash}"]`) as HTMLElement;
    }

    // If still not found, try finding closest paragraph
    if (!targetElement && contentRef.current) {
      // Try to find paragraph by index if hash is numeric
      const paragraphIndex = parseInt(hash.replace('paragraph-', ''));
      if (!isNaN(paragraphIndex)) {
        const paragraphs = contentRef.current.querySelectorAll('p, h2, h3, blockquote');
        targetElement = paragraphs[paragraphIndex] as HTMLElement;
      }
    }

    if (targetElement) {
      // Scroll to element with offset for header
      const yOffset = -100; // Offset for fixed header
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });

      // Apply highlight with fade animation
      setHighlightedElement(targetElement);

      // Add highlight class
      targetElement.classList.add('citation-highlight');

      // Remove highlight after 2 seconds (T122 requirement)
      const timeout = setTimeout(() => {
        targetElement?.classList.remove('citation-highlight');
        setHighlightedElement(null);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [chapterId]); // Re-run when chapter changes

  const handleAction = (action: 'explain' | 'summarize' | 'example' | 'simplify', text: string) => {
    if (onAskAI) {
      onAskAI(action, text, bookId, chapterId);
    } else {
      // Default behavior: log to console
      console.log('Ask AI:', { action, text, bookId, chapterId });

      // TODO: Implement actual API call to chatbot
      // This would trigger the selected-text mode in the chatbot
      // and send the query with the selected text
    }

    clearSelection();
  };

  return (
    <div ref={contentRef} className="relative">
      {children}

      {/* Selection Toolbar */}
      {hasSelection && (
        <SelectionToolbar
          selection={selection}
          onAction={handleAction}
          onClose={clearSelection}
        />
      )}
    </div>
  );
}
