/**
 * ThemeContext — Physical AI Textbook
 *
 * WHY no useColorMode():
 *   Root.tsx is Docusaurus's outermost wrapper — it renders ABOVE
 *   Docusaurus's ColorModeProvider. useColorMode() requires that provider
 *   in the ancestor tree, so calling it here throws:
 *   "useColorMode is called outside the <ColorModeProvider>"
 *
 * FIX — direct DOM + dual-localStorage strategy:
 *   1. We write `data-theme` directly on <html> for immediate effect.
 *   2. We also write to Docusaurus's own localStorage key ('theme') so its
 *      ColorModeProvider agrees when it mounts and on subsequent page loads
 *      (Docusaurus handles its own light/dark FOUC from this key).
 *   3. For 'system' mode we remove Docusaurus's key so its
 *      respectPrefersColorScheme logic takes over naturally.
 *   4. Extended modes (sepia, high-contrast) use our data-color-theme
 *      attribute, handled entirely by our own code.
 *
 * This approach has zero dependency on Docusaurus internals beyond the
 * documented localStorage key and the data-theme attribute convention.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  ThemeMode,
  ResolvedTheme,
  THEME_MODES,
  readStoredTheme,
  writeStoredTheme,
  applyColorThemeAttr,
  getSystemTheme,
} from './index';

// ─── Docusaurus internals (stable, documented) ───────────────────────────────

/** Docusaurus reads this key on startup to determine initial color mode. */
const DOC_THEME_KEY = 'theme';

/**
 * Apply light/dark to the DOM and sync Docusaurus's own localStorage key.
 * - 'system': removes DOC_THEME_KEY so Docusaurus uses respectPrefersColorScheme.
 * - 'light'|'dark': writes to DOC_THEME_KEY and sets data-theme immediately.
 */
function applyDocBase(docBase: 'light' | 'dark' | 'system'): void {
  if (typeof document === 'undefined') return;
  try {
    if (docBase === 'system') {
      localStorage.removeItem(DOC_THEME_KEY);
      // Immediately reflect the OS preference on the <html> element
      const osTheme = getSystemTheme();
      document.documentElement.setAttribute('data-theme', osTheme);
    } else {
      localStorage.setItem(DOC_THEME_KEY, docBase);
      document.documentElement.setAttribute('data-theme', docBase);
    }
  } catch {
    // localStorage blocked (private browsing, etc.) — DOM attr still applied
    if (docBase !== 'system') {
      document.documentElement.setAttribute('data-theme', docBase);
    }
  }
}

// ─── Context Shape ───────────────────────────────────────────────────────────

export interface ThemeContextValue {
  /** The stored user preference (may be 'system') */
  mode: ThemeMode;
  /** The actually applied theme (never 'system') */
  resolvedMode: ResolvedTheme;
  /** Set a new theme mode and persist it */
  setMode: (mode: ThemeMode) => void;
  /** True while the initial theme is being resolved (avoids flicker in toggle UI) */
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [resolvedMode, setResolvedMode] = useState<ResolvedTheme>('dark');
  const [isLoading, setIsLoading] = useState(true);

  // ── Core apply logic (no Docusaurus hook dependency) ──
  const applyMode = useCallback((nextMode: ThemeMode) => {
    const config = THEME_MODES.find(m => m.mode === nextMode);
    if (!config) return;

    // For 'system', pass 'system' so applyDocBase removes DOC_THEME_KEY
    const docArg: 'light' | 'dark' | 'system' =
      nextMode === 'system' ? 'system' : config.docusaurusBase;

    // 1. Sync data-theme + Docusaurus localStorage
    applyDocBase(docArg);

    // 2. Sync data-color-theme for sepia / high-contrast
    applyColorThemeAttr(nextMode);

    // 3. Compute resolved mode (what's actually rendered)
    const resolved: ResolvedTheme =
      nextMode === 'system' ? getSystemTheme() : (nextMode as ResolvedTheme);

    setResolvedMode(resolved);
  }, []);

  // ── Mount: read stored preference, apply, lift no-transition guard ──
  useEffect(() => {
    const stored = readStoredTheme() ?? 'system';
    setModeState(stored);
    applyMode(stored);
    setIsLoading(false);

    // Remove the FOUC guard class added by the headTags inline script.
    // Using rAF ensures transitions are enabled after the first paint.
    const raf = requestAnimationFrame(() => {
      document.documentElement.classList.remove('no-theme-transition');
    });
    return () => cancelAnimationFrame(raf);
  }, [applyMode]);

  // ── OS preference change listener (only active in 'system' mode) ──
  useEffect(() => {
    if (typeof window === 'undefined' || mode !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => {
      applyMode('system');
      setResolvedMode(getSystemTheme());
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode, applyMode]);

  // ── Public setMode ──
  const setMode = useCallback(
    (nextMode: ThemeMode) => {
      setModeState(nextMode);
      writeStoredTheme(nextMode);
      applyMode(nextMode);
    },
    [applyMode]
  );

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, setMode, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() must be used inside <ThemeProvider>');
  }
  return ctx;
}

/** Safe version — returns null when context is unavailable (tests, Storybook). */
export function useThemeSafe(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
