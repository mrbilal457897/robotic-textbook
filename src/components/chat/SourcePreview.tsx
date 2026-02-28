/**
 * SourcePreview Component
 * Modal to display citation source with "Go to source" button
 */

import * as React from 'react';
import { cn } from '../../lib/utils';
import type { Citation } from '../../../shared/types';

export interface SourcePreviewProps {
  citation: Citation | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSource?: (citation: Citation) => void;
  className?: string;
}

const formatConfidence = (score: number): string => {
  return `${Math.round(score * 100)}%`;
};

export function SourcePreview({
  citation,
  isOpen,
  onClose,
  onNavigateToSource,
  className,
}: SourcePreviewProps) {
  if (!isOpen || !citation) return null;

  const handleNavigate = () => {
    if (onNavigateToSource && citation) {
      onNavigateToSource(citation);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full max-w-2xl rounded-lg bg-white shadow-2xl dark:bg-gray-900',
            className
          )}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-gray-200 p-6 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-2xl">📖</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Source Citation
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Chapter {citation.chapter}
                  {citation.section && `, Section ${citation.section}`}
                  {citation.page && ` • Page ${citation.page}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-6">
            <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-950/20">
              <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                {citation.text || 'Source text not available'}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {citation.metadata?.chapter_title && (
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Chapter Title
                  </div>
                  <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {citation.metadata.chapter_title}
                  </div>
                </div>
              )}

              {citation.metadata?.section_title && (
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Section Title
                  </div>
                  <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {citation.metadata.section_title}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Confidence Score
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatConfidence(citation.confidence_score)}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Chunk ID</div>
                <div className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">
                  {citation.chunk_id}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-800">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>

            {onNavigateToSource && (
              <button
                onClick={handleNavigate}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                🔗 Go to Source
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
