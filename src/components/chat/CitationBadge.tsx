/**
 * CitationBadge Component
 * Displays inline citation with hover tooltip
 */

import * as React from 'react';
import { cn } from '../../lib/utils';
import type { Citation } from '../../../shared/types';

export interface CitationBadgeProps {
  citation: Citation;
  index: number;
  onClick?: (citation: Citation) => void;
  className?: string;
}

export function CitationBadge({ citation, index, onClick, className }: CitationBadgeProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    onClick?.(citation);
  };

  const formatConfidence = (score: number) => {
    return `${Math.round(score * 100)}%`;
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800',
        className
      )}
      title={`Citation ${index + 1}: Ch${citation.chapter}${citation.section ? `:${citation.section}` : ''}`}
    >
      <span className="text-sm">📖</span>
      <span>{index + 1}</span>

      {/* Hover Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-gray-700">
          <div className="space-y-1">
            <div className="font-semibold">
              Chapter {citation.chapter}
              {citation.section && `, Section ${citation.section}`}
            </div>
            {citation.page && <div>Page {citation.page}</div>}
            <div className="text-gray-300">
              Confidence: {formatConfidence(citation.confidence_score)}
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 transform">
            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
          </div>
        </div>
      )}
    </button>
  );
}
