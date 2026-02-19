/**
 * Theme Token System — Physical AI Textbook
 *
 * Supports 5 modes: system | light | dark | sepia | high-contrast
 * Scalable: add new modes by extending ThemeMode and the modeConfig map.
 *
 * Architecture:
 * - light / dark → managed by Docusaurus useColorMode() + data-theme attribute
 * - sepia / high-contrast → managed via data-color-theme attribute (layered on top)
 * - system → resolves to light or dark based on prefers-color-scheme
 */

/** All selectable theme modes */
export type ThemeMode = 'system' | 'light' | 'dark' | 'sepia' | 'high-contrast';

/** Resolved (actual applied) theme — never 'system' */
export type ResolvedTheme = 'light' | 'dark' | 'sepia' | 'high-contrast';

/** localStorage key for theme persistence */
export const THEME_STORAGE_KEY = 'phyai-color-mode';

/** data-color-theme attribute name for extended modes */
export const COLOR_THEME_ATTR = 'data-color-theme';

/**
 * Modes that map to Docusaurus's native light/dark system.
 * These set data-theme="light" or data-theme="dark" via useColorMode().
 */
export const DOCUSAURUS_MODES = new Set<ThemeMode>(['light', 'dark', 'system']);

/**
 * Modes that use the extended data-color-theme attribute.
 * These layer on top of the dark base (Docusaurus stays in dark mode).
 */
export const EXTENDED_MODES = new Set<ThemeMode>(['sepia', 'high-contrast']);

/** Metadata for each mode — used by the toggle UI */
export interface ThemeModeConfig {
  mode: ThemeMode;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  /** Which Docusaurus colorMode this uses as its base */
  docusaurusBase: 'light' | 'dark';
  /** The data-color-theme value, or null for native modes */
  colorThemeAttr: string | null;
}

export const THEME_MODES: ThemeModeConfig[] = [
  {
    mode: 'system',
    label: 'System Default',
    shortLabel: 'Auto',
    icon: '⬡',
    description: 'Follows your OS light/dark preference',
    docusaurusBase: 'dark', // fallback; resolved dynamically
    colorThemeAttr: null,
  },
  {
    mode: 'light',
    label: 'Light',
    shortLabel: 'Light',
    icon: '☀',
    description: 'Bright background, ideal for well-lit environments',
    docusaurusBase: 'light',
    colorThemeAttr: null,
  },
  {
    mode: 'dark',
    label: 'Dark',
    shortLabel: 'Dark',
    icon: '◑',
    description: 'Velvet Cosmos dark — the default reading experience',
    docusaurusBase: 'dark',
    colorThemeAttr: null,
  },
  {
    mode: 'sepia',
    label: 'Sepia',
    shortLabel: 'Sepia',
    icon: '☕',
    description: 'Warm parchment tones — optimized for long reading sessions',
    docusaurusBase: 'light',
    colorThemeAttr: 'sepia',
  },
  {
    mode: 'high-contrast',
    label: 'High Contrast',
    shortLabel: 'HC',
    icon: '◐',
    description: 'Maximum contrast — WCAG AAA accessible',
    docusaurusBase: 'dark',
    colorThemeAttr: 'high-contrast',
  },
];

/**
 * Detect the OS color scheme preference.
 * Returns 'light' or 'dark'. Safe to call on server (returns 'dark' fallback).
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Resolve a ThemeMode to an actual ResolvedTheme.
 * 'system' is resolved using the OS preference.
 */
export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') {
    return getSystemTheme() as ResolvedTheme;
  }
  return mode as ResolvedTheme;
}

/**
 * Read stored theme from localStorage. Returns null if unavailable.
 */
export function readStoredTheme(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isValidThemeMode(stored)) return stored as ThemeMode;
  } catch {
    // localStorage blocked (private browsing, etc.)
  }
  return null;
}

/**
 * Write theme mode to localStorage.
 */
export function writeStoredTheme(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // silently fail
  }
}

/**
 * Apply extended data-color-theme attribute to <html>.
 * Extended modes: sepia, high-contrast.
 * Docusaurus modes: remove the attribute.
 */
export function applyColorThemeAttr(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const config = THEME_MODES.find(m => m.mode === mode);
  if (config?.colorThemeAttr) {
    document.documentElement.setAttribute(COLOR_THEME_ATTR, config.colorThemeAttr);
  } else {
    document.documentElement.removeAttribute(COLOR_THEME_ATTR);
  }
}

function isValidThemeMode(value: string): boolean {
  return ['system', 'light', 'dark', 'sepia', 'high-contrast'].includes(value);
}
