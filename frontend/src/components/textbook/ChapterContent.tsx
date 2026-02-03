/**
 * ChapterContent Component
 * Client component wrapper for chapter content with highlight-to-ask functionality
 */

'use client';

import { useRef } from 'react';
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

  const { selection, clearSelection, hasSelection } = useTextSelection({
    minLength: 10,
    maxLength: 8000,
    containerRef: contentRef,
  });

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
