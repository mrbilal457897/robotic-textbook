/**
 * FloatingFocusButton Component
 * Floating button to toggle focus mode on module pages
 */

import React, { useState } from 'react';

interface FloatingFocusButtonProps {
  modulesSectionRef: React.RefObject<HTMLDivElement>;
}

export default function FloatingFocusButton({
  modulesSectionRef,
}: FloatingFocusButtonProps): JSX.Element {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = () => {
    const newFocusMode = !isFocusMode;
    setIsFocusMode(newFocusMode);

    if (typeof document !== 'undefined') {
      if (newFocusMode) {
        document.body.classList.add('focus-mode-active');
        // Also add focus-mode class to the module content
        const moduleContent = document.querySelector('[data-module-content="true"]');
        if (moduleContent) {
          moduleContent.classList.add('focus-mode');
        }
      } else {
        document.body.classList.remove('focus-mode-active');
        const moduleContent = document.querySelector('[data-module-content="true"]');
        if (moduleContent) {
          moduleContent.classList.remove('focus-mode');
        }
      }
    }
  };

  return (
    <button
      onClick={toggleFocusMode}
      style={{
        position: 'fixed',
        bottom: '96px', // Positioned above chat button (24px + 56px + 16px gap)
        right: '24px',
        zIndex: 9999,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: isFocusMode ? '#9333ea' : '#6366f1',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: isFocusMode
          ? '0 8px 24px rgba(147, 51, 234, 0.4)'
          : '0 8px 24px rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = isFocusMode ? '#7c3aed' : '#4f46e5';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = isFocusMode ? '#9333ea' : '#6366f1';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title={isFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
      aria-label={isFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
    >
      {isFocusMode ? (
        // Exit Focus Icon - Maximize/Expand
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      ) : (
        // Enter Focus Icon - Minimize/Focus
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
      )}
    </button>
  );
}
