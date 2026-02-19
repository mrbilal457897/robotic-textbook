/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,md,mdx}', './docs/**/*.{md,mdx}', './blog/**/*.{md,mdx}'],
  // Support both the legacy `.dark` class AND Docusaurus's data-theme="dark" attribute.
  // This ensures Tailwind dark: utilities work with Docusaurus's native theme system.
  darkMode: ['class', '[data-theme="dark"]', '[data-color-theme="high-contrast"]'],
  theme: {
    extend: {
      // Colors - Velvet Cosmos theme
      colors: {
        primary: {
          DEFAULT: '#A78BFA', // Soft Amethyst Violet
          light: '#B9A3FC',
          dark: '#8562EC',
          contrast: '#0D0B1A',
        },
        secondary: {
          DEFAULT: '#818CF8', // Periwinkle Indigo
          light: '#9BA6FA',
          dark: '#6170F4',
          contrast: '#0D0B1A',
        },
        accent: {
          DEFAULT: '#FB923C', // Warm Sunset Orange
          light: '#FCA55E',
          dark: '#EA7520',
          contrast: '#FFFFFF',
        },
        background: {
          primary: '#0D0B1A', // Deep Cosmic
          card: '#171230', // Rich Midnight Purple
          surface: '#211A3F',
          overlay: 'rgba(23, 18, 48, 0.95)',
          elevated: '#2A2250',
        },
        text: {
          primary: '#EDE8FA',
          secondary: '#B4A8D6',
          tertiary: '#7B6FA8',
          disabled: '#4D4570',
          inverse: '#0D0B1A',
        },
        status: {
          success: '#34D399',
          warning: '#FBBF24',
          error: '#F87171',
          info: '#60A5FA',
        },
      },

      // Typography - Velvet Cosmos
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        heading: ['"DM Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        code: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.625' }],
        xl: ['1.25rem', { lineHeight: '1.625' }],
        '2xl': ['1.5rem', { lineHeight: '1.375' }],
        '3xl': ['1.875rem', { lineHeight: '1.375' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1.25' }],
        '6xl': ['3.75rem', { lineHeight: '1.25' }],
        '7xl': ['4.5rem', { lineHeight: '1.25' }],
      },

      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },

      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },

      // Spacing
      spacing: {
        px: '1px',
        0: '0',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
      },

      // Breakpoints
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      // Border Radius
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      // Box Shadow
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
        // Glow effects
        'glow-primary': '0 0 20px rgba(167, 139, 250, 0.5)',
        'glow-accent': '0 0 20px rgba(251, 146, 60, 0.5)',
        'glow-success': '0 0 20px rgba(52, 211, 153, 0.5)',
      },

      // Transitions
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '200ms',
        medium: '300ms',
        slow: '400ms',
      },

      transitionTimingFunction: {
        ease: 'ease',
        'ease-in': 'ease-in',
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
        linear: 'linear',
      },

      // Z-index
      zIndex: {
        hide: '-1',
        base: '0',
        dropdown: '1000',
        sticky: '1100',
        fixed: '1200',
        'modal-backdrop': '1300',
        modal: '1400',
        popover: '1500',
        tooltip: '1600',
      },

      // Backdrop Blur for glassmorphism
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // Animation
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'glow-expand': 'glowExpand 0.4s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowExpand: {
          '0%': { boxShadow: '0 0 0 rgba(167, 139, 250, 0)' },
          '50%': { boxShadow: '0 0 20px rgba(167, 139, 250, 0.5)' },
          '100%': { boxShadow: '0 0 10px rgba(167, 139, 250, 0.3)' },
        },
      },
    },
  },
  plugins: [
    // Custom utility for glassmorphism
    function ({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(13, 11, 26, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(167, 139, 250, 0.12)',
        },
        '.glass-light': {
          background: 'rgba(13, 11, 26, 0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(167, 139, 250, 0.08)',
        },
        '.glass-heavy': {
          background: 'rgba(13, 11, 26, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(167, 139, 250, 0.18)',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },

    // Custom utility for focus ring (accessibility)
    function ({ addUtilities }) {
      const newUtilities = {
        '.focus-ring': {
          outline: '2px solid #A78BFA',
          outlineOffset: '2px',
        },
        '.focus-ring-error': {
          outline: '2px solid #F87171',
          outlineOffset: '2px',
        },
      };

      addUtilities(newUtilities);
    },
  ],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with Docusaurus
  },
};
