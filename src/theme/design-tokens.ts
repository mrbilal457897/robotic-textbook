/**
 * Design Tokens: Neural Circuitry Futurism Theme
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * This file defines the core design system tokens following the
 * "Neural Circuitry Futurism" aesthetic as specified in constitution.md
 */

export const colors = {
  // Primary Colors
  primary: {
    main: '#00F0FF', // Electric Cyan
    light: '#33F3FF',
    dark: '#00B8CC',
    contrast: '#0A0E14',
  },

  // Secondary Colors
  secondary: {
    main: '#B8C4CE', // Titanium Silver
    light: '#D1DAE0',
    dark: '#8A9AA8',
    contrast: '#0A0E14',
  },

  // Accent Colors
  accent: {
    main: '#FF6B35', // Plasma Orange
    light: '#FF8F66',
    dark: '#CC5529',
    contrast: '#FFFFFF',
  },

  // Background Colors
  background: {
    primary: '#0A0E14', // Deep Space Black
    card: '#1A2230', // Midnight Blue
    surface: '#242D3C',
    overlay: 'rgba(10, 14, 20, 0.95)',
    elevated: '#2A3544',
  },

  // Text Colors
  text: {
    primary: '#E8EDF3',
    secondary: '#9AABB8',
    tertiary: '#6B7E8F',
    disabled: '#4A5766',
    inverse: '#0A0E14',
  },

  // Semantic Colors
  status: {
    success: '#00E676',
    warning: '#FFB300',
    error: '#FF5252',
    info: '#00F0FF',
  },

  // Border Colors
  border: {
    default: 'rgba(184, 196, 206, 0.12)',
    focus: '#00F0FF',
    error: '#FF5252',
  },

  // Glassmorphism Colors
  glass: {
    background: 'rgba(26, 34, 48, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    backdrop: 'blur(12px)',
  },
} as const;

export const typography = {
  // Font Families
  fontFamily: {
    display: '"Orbitron", "Rajdhani", sans-serif', // Hero titles
    heading: '"Rajdhani", sans-serif', // Section titles
    body: '"Source Code Pro", monospace', // Paragraph text
    code: '"JetBrains Mono", "Courier New", monospace', // Code blocks
  },

  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Font Sizes (rem units)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  base: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',

  // Special glow effects for futuristic theme
  glow: {
    primary: '0 0 20px rgba(0, 240, 255, 0.5)',
    accent: '0 0 20px rgba(255, 107, 53, 0.5)',
    success: '0 0 20px rgba(0, 230, 118, 0.5)',
  },
} as const;

export const transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    medium: '300ms',
    slow: '400ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

// Accessibility
export const a11y = {
  // WCAG AA contrast ratios
  contrast: {
    normal: 4.5, // Minimum for normal text
    large: 3, // Minimum for large text (18pt+ or 14pt+ bold)
  },
  // Focus indicator minimum size
  focusRing: {
    width: '2px',
    offset: '2px',
    color: colors.border.focus,
  },
} as const;

// Animation presets
export const animations = {
  fadeIn: {
    duration: transitions.duration.medium,
    timing: transitions.timing.easeOut,
  },
  slideIn: {
    duration: transitions.duration.medium,
    timing: transitions.timing.easeOut,
  },
  glowExpand: {
    duration: transitions.duration.slow,
    timing: transitions.timing.easeInOut,
  },
} as const;

// Export all tokens as default
export default {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  a11y,
  animations,
} as const;
