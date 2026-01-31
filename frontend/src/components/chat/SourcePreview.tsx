/**
 * SourcePreview Component
 * Modal to display citation source with "Go to source" button
 */

import * as React from "react";
import { X, ExternalLink, BookOpen } from "lucide-react";
import { Button } from "../ui/Button";
import { cn, formatConfidence } from "../../lib/utils";
import type { Citation } from "../../../../shared/types";

export interface SourcePreviewProps {
  citation: Citation | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSource?: (citation: Citation) => void;
  className?: string;
}

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full max-w-2xl rounded-lg bg-white shadow-2xl dark:bg-gray-900",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 p-6 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
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
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto p-6">
            {/* Passage Text */}
            <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-950/20">
              <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                {citation.text || "Source text not available"}
              </div>
            </div>

            {/* Metadata */}
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
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Chunk ID
                </div>
                <div className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">
                  {citation.chunk_id}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-800">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {onNavigateToSource && (
              <Button onClick={handleNavigate}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to Source
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
