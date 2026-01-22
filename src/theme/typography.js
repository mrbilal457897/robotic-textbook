/**
 * Typography Scale Configuration
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * Defines typography hierarchy and font loading strategy
 * following the Neural Circuitry Futurism theme
 */
import { tokens } from './theme';
/**
 * Typography scale definitions
 */
export const typographyScale = {
    // Display styles (Hero titles - Orbitron)
    display: {
        '7xl': {
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize['7xl'],
            fontWeight: tokens.typography.fontWeight.black,
            lineHeight: tokens.typography.lineHeight.tight,
            letterSpacing: tokens.typography.letterSpacing.tight,
        },
        '6xl': {
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize['6xl'],
            fontWeight: tokens.typography.fontWeight.extrabold,
            lineHeight: tokens.typography.lineHeight.tight,
            letterSpacing: tokens.typography.letterSpacing.tight,
        },
        '5xl': {
            fontFamily: tokens.typography.fontFamily.display,
            fontSize: tokens.typography.fontSize['5xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            lineHeight: tokens.typography.lineHeight.tight,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
    },
    // Heading styles (Section titles - Rajdhani)
    heading: {
        '4xl': {
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize['4xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            lineHeight: tokens.typography.lineHeight.tight,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
        '3xl': {
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize['3xl'],
            fontWeight: tokens.typography.fontWeight.bold,
            lineHeight: tokens.typography.lineHeight.snug,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
        '2xl': {
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize['2xl'],
            fontWeight: tokens.typography.fontWeight.semibold,
            lineHeight: tokens.typography.lineHeight.snug,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
        xl: {
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.xl,
            fontWeight: tokens.typography.fontWeight.semibold,
            lineHeight: tokens.typography.lineHeight.normal,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
        lg: {
            fontFamily: tokens.typography.fontFamily.heading,
            fontSize: tokens.typography.fontSize.lg,
            fontWeight: tokens.typography.fontWeight.medium,
            lineHeight: tokens.typography.lineHeight.normal,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
    },
    // Body styles (Paragraph text - Source Code Pro)
    body: {
        xl: {
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.xl,
            fontWeight: tokens.typography.fontWeight.regular,
            lineHeight: tokens.typography.lineHeight.relaxed,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
        lg: {
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.lg,
            fontWeight: tokens.typography.fontWeight.regular,
            lineHeight: tokens.typography.lineHeight.relaxed,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
        base: {
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.base,
            fontWeight: tokens.typography.fontWeight.regular,
            lineHeight: tokens.typography.lineHeight.normal,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
        sm: {
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.sm,
            fontWeight: tokens.typography.fontWeight.regular,
            lineHeight: tokens.typography.lineHeight.normal,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
        xs: {
            fontFamily: tokens.typography.fontFamily.body,
            fontSize: tokens.typography.fontSize.xs,
            fontWeight: tokens.typography.fontWeight.regular,
            lineHeight: tokens.typography.lineHeight.tight,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
    },
    // Code styles (Code blocks - JetBrains Mono)
    code: {
        base: {
            fontFamily: tokens.typography.fontFamily.code,
            fontSize: tokens.typography.fontSize.sm,
            fontWeight: tokens.typography.fontWeight.regular,
            lineHeight: tokens.typography.lineHeight.relaxed,
            letterSpacing: tokens.typography.letterSpacing.normal,
        },
        inline: {
            fontFamily: tokens.typography.fontFamily.code,
            fontSize: '0.875em',
            fontWeight: tokens.typography.fontWeight.medium,
            lineHeight: 'inherit',
            letterSpacing: tokens.typography.letterSpacing.normal,
            padding: '0.125rem 0.375rem',
            borderRadius: tokens.borderRadius.sm,
            backgroundColor: tokens.colors.background.elevated,
            color: tokens.colors.status.info,
        },
    },
};
/**
 * Font loading configuration
 * These fonts should be loaded via Google Fonts or local files
 */
export const fontConfig = {
    googleFonts: [
        {
            family: 'Orbitron',
            weights: [400, 500, 600, 700, 800, 900],
            display: 'swap',
        },
        {
            family: 'Rajdhani',
            weights: [300, 400, 500, 600, 700],
            display: 'swap',
        },
        {
            family: 'Source Code Pro',
            weights: [300, 400, 500, 600, 700],
            display: 'swap',
        },
        {
            family: 'JetBrains Mono',
            weights: [400, 500, 600, 700],
            display: 'swap',
        },
    ],
    /**
     * Generate Google Fonts URL
     */
    getGoogleFontsUrl() {
        const families = this.googleFonts.map((font) => {
            const weights = font.weights.join(';');
            return `family=${font.family.replace(' ', '+')}:wght@${weights}`;
        });
        return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
    },
    /**
     * Generate font-face declarations for local fonts
     * (Use this if self-hosting fonts)
     */
    generateFontFaceCSS() {
        return `
      /* Orbitron */
      @font-face {
        font-family: 'Orbitron';
        font-style: normal;
        font-weight: 400 900;
        font-display: swap;
        src: url('/fonts/orbitron-variable.woff2') format('woff2');
      }

      /* Rajdhani */
      @font-face {
        font-family: 'Rajdhani';
        font-style: normal;
        font-weight: 300 700;
        font-display: swap;
        src: url('/fonts/rajdhani-variable.woff2') format('woff2');
      }

      /* Source Code Pro */
      @font-face {
        font-family: 'Source Code Pro';
        font-style: normal;
        font-weight: 300 700;
        font-display: swap;
        src: url('/fonts/source-code-pro-variable.woff2') format('woff2');
      }

      /* JetBrains Mono */
      @font-face {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: 400 700;
        font-display: swap;
        src: url('/fonts/jetbrains-mono-variable.woff2') format('woff2');
      }
    `;
    },
};
/**
 * Typography utility classes generator
 * Generates CSS class names for common typography patterns
 */
export const typographyClasses = {
    // Display classes
    displayXL: 'font-display text-7xl font-black leading-tight tracking-tight',
    displayLG: 'font-display text-6xl font-extrabold leading-tight tracking-tight',
    displayMD: 'font-display text-5xl font-bold leading-tight',
    // Heading classes
    heading1: 'font-heading text-4xl font-bold leading-tight',
    heading2: 'font-heading text-3xl font-bold leading-snug',
    heading3: 'font-heading text-2xl font-semibold leading-snug',
    heading4: 'font-heading text-xl font-semibold leading-normal',
    heading5: 'font-heading text-lg font-medium leading-normal',
    // Body classes
    bodyXL: 'font-body text-xl font-normal leading-relaxed',
    bodyLG: 'font-body text-lg font-normal leading-relaxed',
    bodyBase: 'font-body text-base font-normal leading-normal',
    bodySM: 'font-body text-sm font-normal leading-normal',
    bodyXS: 'font-body text-xs font-normal leading-tight',
    // Code classes
    code: 'font-code text-sm font-normal leading-relaxed',
    codeInline: 'font-code text-sm font-medium px-1.5 py-0.5 rounded bg-elevated text-info',
};
/**
 * Reading time calculation utility
 * As per constitution.md: ⌈wordCount / 200⌉ + (codeBlocks × 1) + (diagrams × 0.5)
 */
export function calculateReadingTime(wordCount, codeBlocks = 0, diagrams = 0) {
    const baseReadingTime = Math.ceil(wordCount / 200);
    const codeReadingTime = codeBlocks * 1;
    const diagramReadingTime = diagrams * 0.5;
    return baseReadingTime + codeReadingTime + diagramReadingTime;
}
/**
 * Format reading time for display
 */
export function formatReadingTime(minutes) {
    if (minutes < 1) {
        return '< 1 min read';
    }
    if (minutes === 1) {
        return '1 min read';
    }
    return `${minutes} min read`;
}
/**
 * Generate CSS for typography scale
 */
export function generateTypographyCSSVariables() {
    const cssVars = {};
    // Display
    Object.entries(typographyScale.display).forEach(([size, styles]) => {
        Object.entries(styles).forEach(([property, value]) => {
            cssVars[`--typography-display-${size}-${camelToKebab(property)}`] =
                String(value);
        });
    });
    // Heading
    Object.entries(typographyScale.heading).forEach(([size, styles]) => {
        Object.entries(styles).forEach(([property, value]) => {
            cssVars[`--typography-heading-${size}-${camelToKebab(property)}`] =
                String(value);
        });
    });
    // Body
    Object.entries(typographyScale.body).forEach(([size, styles]) => {
        Object.entries(styles).forEach(([property, value]) => {
            cssVars[`--typography-body-${size}-${camelToKebab(property)}`] =
                String(value);
        });
    });
    // Code
    Object.entries(typographyScale.code).forEach(([variant, styles]) => {
        Object.entries(styles).forEach(([property, value]) => {
            if (property !== 'padding' && property !== 'borderRadius') {
                cssVars[`--typography-code-${variant}-${camelToKebab(property)}`] =
                    String(value);
            }
        });
    });
    return cssVars;
}
/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str) {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
// Export all
export default {
    scale: typographyScale,
    config: fontConfig,
    classes: typographyClasses,
    utils: {
        calculateReadingTime,
        formatReadingTime,
        generateTypographyCSSVariables,
    },
};
