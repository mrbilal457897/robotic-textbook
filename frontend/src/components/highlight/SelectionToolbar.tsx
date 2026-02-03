/**
 * SelectionToolbar Component
 * Floating toolbar that appears when text is selected, offering AI actions
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { SelectionInfo } from './useTextSelection';

export interface SelectionToolbarProps {
  selection: SelectionInfo;
  onAction: (action: 'explain' | 'summarize' | 'example' | 'simplify', text: string) => void;
  onClose?: () => void;
}

export function SelectionToolbar({ selection, onAction, onClose }: SelectionToolbarProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selection.isValid || !selection.rect) {
      setPosition(null);
      return;
    }

    // Calculate toolbar position
    const rect = selection.rect;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Position above the selection by default
    let top = rect.top + scrollY - 60; // 60px for toolbar height + margin
    let left = rect.left + scrollX + rect.width / 2;

    // Ensure toolbar doesn't go off-screen
    const toolbarWidth = 280; // Approximate toolbar width
    const toolbarHeight = 50;

    // Adjust horizontal position
    if (left - toolbarWidth / 2 < 10) {
      left = toolbarWidth / 2 + 10;
    } else if (left + toolbarWidth / 2 > window.innerWidth - 10) {
      left = window.innerWidth - toolbarWidth / 2 - 10;
    }

    // If toolbar would go above viewport, position below selection
    if (top < scrollY + 10) {
      top = rect.bottom + scrollY + 10;
    }

    setPosition({ top, left });
  }, [selection]);

  const handleAction = (action: 'explain' | 'summarize' | 'example' | 'simplify') => {
    onAction(action, selection.text);
    if (onClose) {
      onClose();
    }
  };

  if (!selection.isValid || !position) {
    return null;
  }

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2">
        {/* Explain Action */}
        <button
          onClick={() => handleAction('explain')}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Explain this text"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="hidden sm:inline">Explain</span>
        </button>

        {/* Summarize Action */}
        <button
          onClick={() => handleAction('summarize')}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Summarize this text"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          <span className="hidden sm:inline">Summarize</span>
        </button>

        {/* Example Action */}
        <button
          onClick={() => handleAction('example')}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Get examples"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="hidden sm:inline">Example</span>
        </button>

        {/* Simplify Action */}
        <button
          onClick={() => handleAction('simplify')}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Simplify this text"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span className="hidden sm:inline">Simplify</span>
        </button>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
            title="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Arrow pointing to selection */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"
        style={{
          bottom: '-8px',
        }}
      />
    </div>
  );
}
