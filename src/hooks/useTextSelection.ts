/**
 * useTextSelection Hook
 * Tracks text selection and provides selection state
 */

import { useState, useEffect, useCallback } from 'react';

export interface TextSelection {
  text: string;
  range: Range | null;
  rect: DOMRect | null;
}

export interface UseTextSelectionOptions {
  minLength?: number;
  maxLength?: number;
}

export function useTextSelection(options: UseTextSelectionOptions = {}) {
  const { minLength = 1, maxLength = 10000 } = options;

  const [selection, setSelection] = useState<TextSelection>({
    text: '',
    range: null,
    rect: null,
  });

  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();

    if (sel && sel.rangeCount > 0 && sel.toString().trim()) {
      const selectedText = sel.toString().trim();
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Validate selection length
      if (selectedText.length >= minLength && selectedText.length <= maxLength) {
        setSelection({
          text: selectedText,
          range,
          rect,
        });
      } else {
        setSelection({
          text: '',
          range: null,
          rect: null,
        });
      }
    } else {
      setSelection({
        text: '',
        range: null,
        rect: null,
      });
    }
  }, [minLength, maxLength]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    setSelection({
      text: '',
      range: null,
      rect: null,
    });
  }, []);

  return {
    selection,
    clearSelection,
  };
}
