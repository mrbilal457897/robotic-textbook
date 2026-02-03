/**
 * useTextSelection Hook
 * Detects text selection and provides selection metadata for highlight-to-ask feature
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SelectionInfo {
  text: string;
  range: Range | null;
  rect: DOMRect | null;
  isValid: boolean;
}

export interface UseTextSelectionOptions {
  minLength?: number;
  maxLength?: number;
  onSelectionChange?: (selection: SelectionInfo) => void;
  containerRef?: React.RefObject<HTMLElement>;
}

export function useTextSelection(options: UseTextSelectionOptions = {}) {
  const {
    minLength = 10,
    maxLength = 8000,
    onSelectionChange,
    containerRef,
  } = options;

  const [selection, setSelection] = useState<SelectionInfo>({
    text: '',
    range: null,
    rect: null,
    isValid: false,
  });

  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getSelectionInfo = useCallback((): SelectionInfo => {
    const windowSelection = window.getSelection();

    if (!windowSelection || windowSelection.rangeCount === 0) {
      return {
        text: '',
        range: null,
        rect: null,
        isValid: false,
      };
    }

    const range = windowSelection.getRangeAt(0);
    const text = windowSelection.toString().trim();

    // If containerRef is provided, ensure selection is within container
    if (containerRef?.current) {
      const container = containerRef.current;
      if (!container.contains(range.commonAncestorContainer)) {
        return {
          text: '',
          range: null,
          rect: null,
          isValid: false,
        };
      }
    }

    // Get bounding rect for toolbar positioning
    const rect = range.getBoundingClientRect();

    // Validate selection
    const isValid =
      text.length >= minLength &&
      text.length <= maxLength &&
      rect.width > 0 &&
      rect.height > 0;

    return {
      text,
      range,
      rect,
      isValid,
    };
  }, [minLength, maxLength, containerRef]);

  const handleSelectionChange = useCallback(() => {
    // Debounce selection changes to avoid excessive updates
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }

    selectionTimeoutRef.current = setTimeout(() => {
      const selectionInfo = getSelectionInfo();
      setSelection(selectionInfo);

      if (onSelectionChange) {
        onSelectionChange(selectionInfo);
      }
    }, 150); // 150ms debounce
  }, [getSelectionInfo, onSelectionChange]);

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      // Don't trigger if clicking on a button or interactive element
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button, a')
      ) {
        return;
      }

      handleSelectionChange();
    },
    [handleSelectionChange]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      // Mobile touch selection handling
      // Wait a bit for the selection to be finalized
      setTimeout(() => {
        handleSelectionChange();
      }, 100);
    },
    [handleSelectionChange]
  );

  const clearSelection = useCallback(() => {
    const windowSelection = window.getSelection();
    if (windowSelection) {
      windowSelection.removeAllRanges();
    }

    setSelection({
      text: '',
      range: null,
      rect: null,
      isValid: false,
    });
  }, []);

  useEffect(() => {
    // Add event listeners for selection
    const container = containerRef?.current || document;

    container.addEventListener('mouseup', handleMouseUp as EventListener);
    container.addEventListener('touchend', handleTouchEnd as EventListener);
    document.addEventListener('selectionchange', handleSelectionChange);

    // Cleanup
    return () => {
      container.removeEventListener('mouseup', handleMouseUp as EventListener);
      container.removeEventListener('touchend', handleTouchEnd as EventListener);
      document.removeEventListener('selectionchange', handleSelectionChange);

      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, [
    handleMouseUp,
    handleTouchEnd,
    handleSelectionChange,
    containerRef,
  ]);

  return {
    selection,
    clearSelection,
    hasSelection: selection.isValid,
  };
}
