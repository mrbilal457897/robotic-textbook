/**
 * SelectionToolbar Component
 * Toolbar that appears when text is selected
 */

import React from 'react';

export interface TextSelection {
  text: string;
  range: Range | null;
  rect: DOMRect | null;
}

interface SelectionToolbarProps {
  selection: TextSelection | null;
  onAction: (action: 'explain' | 'summarize' | 'example' | 'simplify', text: string) => void;
  onClose: () => void;
}

export function SelectionToolbar({ selection, onAction, onClose }: SelectionToolbarProps) {
  if (!selection || !selection.text || !selection.rect) return null;

  const { text, rect } = selection;

  return (
    <div
      className="fixed z-50 flex gap-2 rounded-lg bg-gray-900 px-3 py-2 shadow-xl"
      style={{
        top: `${rect.top + window.scrollY - 50}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <button
        onClick={() => onAction('explain', text)}
        className="rounded px-3 py-1 text-sm text-white hover:bg-gray-700"
        title="Explain this"
      >
        💡 Explain
      </button>
      <button
        onClick={() => onAction('summarize', text)}
        className="rounded px-3 py-1 text-sm text-white hover:bg-gray-700"
        title="Summarize this"
      >
        📝 Summarize
      </button>
      <button
        onClick={() => onAction('example', text)}
        className="rounded px-3 py-1 text-sm text-white hover:bg-gray-700"
        title="Show example"
      >
        🔍 Example
      </button>
      <button
        onClick={() => onAction('simplify', text)}
        className="rounded px-3 py-1 text-sm text-white hover:bg-gray-700"
        title="Simplify this"
      >
        ⚡ Simplify
      </button>
      <button
        onClick={onClose}
        className="rounded px-2 py-1 text-sm text-white hover:bg-gray-700"
        title="Close"
        aria-label="Close toolbar"
      >
        ✕
      </button>
    </div>
  );
}
