/**
 * CSS-in-JS Theming System
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * This file provides React hooks and utilities for applying theme tokens
 * programmatically in components using CSS-in-JS patterns.
 */

import type React from 'react';
import tokens from './design-tokens';

export type ThemeMode = 'light' | 'dark';

/**
 * Theme context interface
 */
export interface Theme {
  mode: ThemeMode;
  colors: typeof tokens.colors;
  typography: typeof tokens.typography;
  spacing: typeof tokens.spacing;
  breakpoints: typeof tokens.breakpoints;
  borderRadius: typeof tokens.borderRadius;
  shadows: typeof tokens.shadows;
  transitions: typeof tokens.transitions;
  zIndex: typeof tokens.zIndex;
  a11y: typeof tokens.a11y;
  animations: typeof tokens.animations;
}

/**
 * Create theme object based on mode
 * Currently only dark mode is implemented (Neural Circuitry Futurism)
 */
export function createTheme(mode: ThemeMode = 'dark'): Theme {
  // For now, we only implement dark mode per constitution.md
  // Light mode can be added in future iterations if needed
  return {
    mode,
    ...tokens,
  };
}

/**
 * Default theme (dark mode)
 */
export const defaultTheme = createTheme('dark');

/**
 * Generate CSS variable declarations from theme tokens
 * Useful for injecting theme variables into global styles
 */
export function generateCSSVariables(theme: Theme): Record<string, string> {
  const cssVars: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors).forEach(([category, values]) => {
    if (typeof values === 'object' && values !== null) {
      Object.entries(values).forEach(([key, value]) => {
        cssVars[`--color-${category}-${key}`] = value as string;
      });
    } else {
      cssVars[`--color-${category}`] = values as string;
    }
  });

  // Typography
  Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
    cssVars[`--font-${key}`] = value;
  });

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value;
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    cssVars[`--font-weight-${key}`] = String(value);
  });

  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    cssVars[`--line-height-${key}`] = String(value);
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  // Border Radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });

  // Breakpoints
  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    cssVars[`--breakpoint-${key}`] = value;
  });

  // Z-index
  Object.entries(theme.zIndex).forEach(([key, value]) => {
    cssVars[`--z-${key}`] = String(value);
  });

  // Transitions
  Object.entries(theme.transitions.duration).forEach(([key, value]) => {
    cssVars[`--duration-${key}`] = value;
  });

  Object.entries(theme.transitions.timing).forEach(([key, value]) => {
    cssVars[`--timing-${key}`] = value;
  });

  return cssVars;
}

/**
 * Apply CSS variables to an element
 */
export function applyCSSVariables(
  element: HTMLElement,
  theme: Theme = defaultTheme
): void {
  const cssVars = generateCSSVariables(theme);

  Object.entries(cssVars).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
}

/**
 * Helper function to create responsive styles
 */
export function responsive(styles: {
  base?: React.CSSProperties;
  sm?: React.CSSProperties;
  md?: React.CSSProperties;
  lg?: React.CSSProperties;
  xl?: React.CSSProperties;
  '2xl'?: React.CSSProperties;
}): string {
  const { base = {}, sm, md, lg, xl, '2xl': xxl } = styles;

  let css = '';

  // Base styles (mobile first)
  if (Object.keys(base).length > 0) {
    css += Object.entries(base)
      .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
      .join(' ');
  }

  // Responsive breakpoints
  if (sm) {
    css += ` @media (min-width: ${tokens.breakpoints.sm}) { ${Object.entries(sm)
      .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
      .join(' ')} }`;
  }

  if (md) {
    css += ` @media (min-width: ${tokens.breakpoints.md}) { ${Object.entries(md)
      .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
      .join(' ')} }`;
  }

  if (lg) {
    css += ` @media (min-width: ${tokens.breakpoints.lg}) { ${Object.entries(lg)
      .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
      .join(' ')} }`;
  }

  if (xl) {
    css += ` @media (min-width: ${tokens.breakpoints.xl}) { ${Object.entries(xl)
      .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
      .join(' ')} }`;
  }

  if (xxl) {
    css += ` @media (min-width: ${tokens.breakpoints['2xl']}) { ${Object.entries(
      xxl
    )
      .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
      .join(' ')} }`;
  }

  return css;
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * Create glassmorphism effect styles
 */
export function glassmorphism(
  blur: string = '12px',
  opacity: number = 0.7
): React.CSSProperties {
  return {
    background: `rgba(26, 34, 48, ${opacity})`,
    backdropFilter: `blur(${blur})`,
    WebkitBackdropFilter: `blur(${blur})`,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: tokens.borderRadius.xl,
  };
}

/**
 * Create glow effect styles
 */
export function glow(
  color: keyof typeof tokens.colors.status | 'primary' | 'accent' = 'primary',
  intensity: number = 0.5
): React.CSSProperties {
  const colorMap = {
    primary: `rgba(0, 240, 255, ${intensity})`,
    accent: `rgba(255, 107, 53, ${intensity})`,
    success: `rgba(0, 230, 118, ${intensity})`,
    warning: `rgba(255, 179, 0, ${intensity})`,
    error: `rgba(255, 82, 82, ${intensity})`,
    info: `rgba(0, 240, 255, ${intensity})`,
  };

  return {
    boxShadow: `0 0 20px ${colorMap[color]}`,
    transition: `box-shadow ${tokens.transitions.duration.medium} ${tokens.transitions.timing.easeInOut}`,
  };
}

/**
 * Create transition styles
 */
export function transition(
  properties: string[] = ['all'],
  duration: keyof typeof tokens.transitions.duration = 'base',
  timing: keyof typeof tokens.transitions.timing = 'easeInOut'
): React.CSSProperties {
  return {
    transition: properties
      .map(
        (prop) =>
          `${prop} ${tokens.transitions.duration[duration]} ${tokens.transitions.timing[timing]}`
      )
      .join(', '),
  };
}

/**
 * Create focus ring styles for accessibility
 */
export function focusRing(): React.CSSProperties {
  return {
    outline: `${tokens.a11y.focusRing.width} solid ${tokens.a11y.focusRing.color}`,
    outlineOffset: tokens.a11y.focusRing.offset,
  };
}

/**
 * Create card styles with glassmorphism
 */
export function card(elevated: boolean = false): React.CSSProperties {
  return {
    ...glassmorphism(),
    padding: tokens.spacing[6],
    borderRadius: tokens.borderRadius['2xl'],
    ...(elevated && {
      boxShadow: tokens.shadows.lg,
      transform: 'translateY(-2px)',
    }),
    ...transition(['box-shadow', 'transform']),
  };
}

/**
 * Media query helpers
 */
export const media = {
  xs: `@media (min-width: ${tokens.breakpoints.xs})`,
  sm: `@media (min-width: ${tokens.breakpoints.sm})`,
  md: `@media (min-width: ${tokens.breakpoints.md})`,
  lg: `@media (min-width: ${tokens.breakpoints.lg})`,
  xl: `@media (min-width: ${tokens.breakpoints.xl})`,
  '2xl': `@media (min-width: ${tokens.breakpoints['2xl']})`,
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
} as const;

// Export theme and utilities
export { tokens };
export default defaultTheme;
