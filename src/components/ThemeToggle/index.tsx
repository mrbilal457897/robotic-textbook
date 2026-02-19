/**
 * ThemeToggle — Physical AI Textbook
 *
 * Navbar button that opens a popover with 5 theme mode options.
 *
 * Accessibility:
 * - role="menu" on popover, role="menuitem" on each option
 * - aria-haspopup, aria-expanded on trigger button
 * - aria-checked on active option
 * - Keyboard: Tab to open, Arrow keys to navigate, Enter/Space to select, Escape to close
 * - Focus trap within open popover
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useThemeSafe } from '../../lib/theme/ThemeContext';
import { THEME_MODES, ThemeMode } from '../../lib/theme';
import styles from './styles.module.css';

// ─── Icon Components ─────────────────────────────────────────────────────────

function IconSystem(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLight(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDark(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSepia(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHighContrast(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 3v18" stroke="currentColor" strokeWidth="2" />
      <path d="M12 3a9 9 0 0 1 0 18V3z" fill="currentColor" />
    </svg>
  );
}

function IconCheck(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MODE_ICONS: Record<ThemeMode, JSX.Element> = {
  system: <IconSystem />,
  light: <IconLight />,
  dark: <IconDark />,
  sepia: <IconSepia />,
  'high-contrast': <IconHighContrast />,
};

// ─── Component ───────────────────────────────────────────────────────────────

export function ThemeToggle(): JSX.Element {
  const themeCtx = useThemeSafe();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentMode = themeCtx?.mode ?? 'system';

  // ── Close on outside click / Escape ──
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, THEME_MODES.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (!triggerRef.current?.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ── Focus management within menu ──
  useEffect(() => {
    if (isOpen) {
      const activeIndex = THEME_MODES.findIndex(m => m.mode === currentMode);
      const startIndex = activeIndex >= 0 ? activeIndex : 0;
      setFocusedIndex(startIndex);
    }
  }, [isOpen, currentMode]);

  useEffect(() => {
    if (isOpen) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  const handleTriggerClick = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSelect = useCallback(
    (mode: ThemeMode) => {
      themeCtx?.setMode(mode);
      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [themeCtx]
  );

  const currentConfig = THEME_MODES.find(m => m.mode === currentMode);

  return (
    <div className={styles.wrapper}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={handleTriggerClick}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Theme: ${currentConfig?.label ?? 'System'}. Click to change.`}
        title="Change theme"
      >
        <span className={styles.triggerIcon}>{MODE_ICONS[currentMode]}</span>
        <span className={styles.triggerLabel} aria-hidden="true">
          {currentConfig?.shortLabel ?? 'Auto'}
        </span>
        <span
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Popover menu */}
      {isOpen && (
        <div ref={menuRef} className={styles.popover} role="menu" aria-label="Theme options">
          <div className={styles.popoverHeader}>Reading Mode</div>
          {THEME_MODES.map((config, idx) => {
            const isActive = currentMode === config.mode;
            return (
              <button
                key={config.mode}
                ref={el => {
                  itemRefs.current[idx] = el;
                }}
                type="button"
                role="menuitem"
                aria-checked={isActive}
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                onClick={() => handleSelect(config.mode)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(config.mode);
                  }
                }}
              >
                <span className={styles.menuItemIcon}>{MODE_ICONS[config.mode]}</span>
                <span className={styles.menuItemText}>
                  <span className={styles.menuItemLabel}>{config.label}</span>
                  <span className={styles.menuItemDesc}>{config.description}</span>
                </span>
                {isActive && (
                  <span className={styles.menuItemCheck}>
                    <IconCheck />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
