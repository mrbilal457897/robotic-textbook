/**
 * GlossaryTooltip Component (Stub)
 * Displays glossary term tooltips
 */

import * as React from 'react';
import type { KeyTerm } from '../../../shared/types';

export interface GlossaryTooltipProps {
  term: KeyTerm;
  children: React.ReactNode;
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <span
      className="relative inline-block cursor-help border-b border-dotted border-blue-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={term.definition}
    >
      {children}
      {isHovered && term.definition && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-3 py-1 text-xs text-white shadow-lg">
          {term.definition}
        </span>
      )}
    </span>
  );
}
