/**
 * ResponsiveLayout Component
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * Responsive layout wrapper with breakpoint-aware rendering.
 * Provides consistent padding, max-width, and grid structure.
 */

import React, { ReactNode } from 'react';
import { tokens } from '../../theme/theme';

export interface ResponsiveLayoutProps {
  /** Child content to render */
  children: ReactNode;
  /** Layout variant */
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  /** Additional CSS classes */
  className?: string;
  /** Whether to add vertical padding */
  withPadding?: boolean;
  /** ARIA landmark role */
  as?: 'div' | 'main' | 'section' | 'article';
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Get max-width for layout variant
 */
export function getMaxWidth(variant: ResponsiveLayoutProps['variant']): string {
  switch (variant) {
    case 'narrow':
      return '768px'; // Reading-optimized width
    case 'wide':
      return '1536px'; // Full desktop width
    case 'full':
      return '100%'; // No constraint
    case 'default':
    default:
      return '1280px'; // Standard content width
  }
}

/**
 * Get horizontal padding for breakpoint
 */
export function getHorizontalPadding(): Record<string, string> {
  return {
    mobile: tokens.spacing[4], // 16px
    tablet: tokens.spacing[6], // 24px
    desktop: tokens.spacing[8], // 32px
  };
}

/**
 * Responsive layout wrapper component.
 *
 * Features:
 * - Mobile-first responsive design
 * - Configurable max-width variants
 * - Consistent horizontal padding across breakpoints
 * - Optional vertical padding
 * - Semantic HTML with ARIA landmarks
 *
 * Breakpoints:
 * - Mobile: 375px - 767px (padding: 16px)
 * - Tablet: 768px - 1023px (padding: 24px)
 * - Desktop: 1024px+ (padding: 32px)
 *
 * @example
 * ```tsx
 * <ResponsiveLayout variant="default" withPadding>
 *   <h1>Page Content</h1>
 * </ResponsiveLayout>
 * ```
 *
 * @example
 * ```tsx
 * <ResponsiveLayout variant="narrow" as="article" ariaLabel="Blog post">
 *   <p>Reading-optimized content...</p>
 * </ResponsiveLayout>
 * ```
 */
export default function ResponsiveLayout({
  children,
  variant = 'default',
  className = '',
  withPadding = true,
  as: Component = 'div',
  ariaLabel,
}: ResponsiveLayoutProps): JSX.Element {
  const maxWidth = getMaxWidth(variant);
  const padding = getHorizontalPadding();

  return (
    <Component
      className={`responsive-layout responsive-layout--${variant} ${className}`}
      {...(ariaLabel && { 'aria-label': ariaLabel })}
    >
      {children}

      <style jsx>{`
        .responsive-layout {
          width: 100%;
          max-width: ${maxWidth};
          margin-left: auto;
          margin-right: auto;
          padding-left: ${padding.mobile};
          padding-right: ${padding.mobile};
        }

        @media (min-width: ${tokens.breakpoints.md}) {
          .responsive-layout {
            padding-left: ${padding.tablet};
            padding-right: ${padding.tablet};
          }
        }

        @media (min-width: ${tokens.breakpoints.lg}) {
          .responsive-layout {
            padding-left: ${padding.desktop};
            padding-right: ${padding.desktop};
          }
        }

        .responsive-layout--full {
          max-width: 100%;
          padding-left: 0;
          padding-right: 0;
        }

        ${withPadding ? `
          .responsive-layout {
            padding-top: ${tokens.spacing[8]};
            padding-bottom: ${tokens.spacing[8]};
          }

          @media (min-width: ${tokens.breakpoints.md}) {
            .responsive-layout {
              padding-top: ${tokens.spacing[12]};
              padding-bottom: ${tokens.spacing[12]};
            }
          }

          @media (min-width: ${tokens.breakpoints.lg}) {
            .responsive-layout {
              padding-top: ${tokens.spacing[16]};
              padding-bottom: ${tokens.spacing[16]};
            }
          }
        ` : ''}
      `}</style>
    </Component>
  );
}

/**
 * Grid Layout Component
 * Provides responsive grid structure for content layout
 */
export interface GridLayoutProps {
  /** Child content (grid items) */
  children: ReactNode;
  /** Number of columns at different breakpoints */
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  /** Gap between grid items */
  gap?: keyof typeof tokens.spacing;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Responsive grid layout component.
 *
 * Features:
 * - Auto-responsive grid columns
 * - Configurable gap spacing
 * - Mobile-first breakpoints
 *
 * @example
 * ```tsx
 * <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap={6}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </GridLayout>
 * ```
 */
export function GridLayout({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 6,
  className = '',
}: GridLayoutProps): JSX.Element {
  const gapValue = tokens.spacing[gap];

  return (
    <div className={`grid-layout ${className}`}>
      {children}

      <style jsx>{`
        .grid-layout {
          display: grid;
          grid-template-columns: repeat(${columns.mobile || 1}, 1fr);
          gap: ${gapValue};
        }

        @media (min-width: ${tokens.breakpoints.md}) {
          .grid-layout {
            grid-template-columns: repeat(${columns.tablet || 2}, 1fr);
          }
        }

        @media (min-width: ${tokens.breakpoints.lg}) {
          .grid-layout {
            grid-template-columns: repeat(${columns.desktop || 3}, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Stack Layout Component
 * Provides vertical spacing between child elements
 */
export interface StackLayoutProps {
  /** Child content */
  children: ReactNode;
  /** Spacing between items */
  spacing?: keyof typeof tokens.spacing;
  /** Alignment of items */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Vertical stack layout component.
 *
 * Features:
 * - Consistent vertical spacing
 * - Configurable alignment
 * - Responsive spacing adjustments
 *
 * @example
 * ```tsx
 * <StackLayout spacing={4} align="center">
 *   <Heading>Title</Heading>
 *   <Text>Content</Text>
 *   <Button>Action</Button>
 * </StackLayout>
 * ```
 */
export function StackLayout({
  children,
  spacing = 4,
  align = 'stretch',
  className = '',
}: StackLayoutProps): JSX.Element {
  const spacingValue = tokens.spacing[spacing];

  const alignmentMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };

  return (
    <div className={`stack-layout ${className}`}>
      {children}

      <style jsx>{`
        .stack-layout {
          display: flex;
          flex-direction: column;
          gap: ${spacingValue};
          align-items: ${alignmentMap[align]};
        }
      `}</style>
    </div>
  );
}

/**
 * Container Component
 * Simple centered container with max-width
 */
export interface ContainerProps {
  /** Child content */
  children: ReactNode;
  /** Maximum width */
  maxWidth?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Simple container component for centering content.
 *
 * @example
 * ```tsx
 * <Container maxWidth="800px">
 *   <Content />
 * </Container>
 * ```
 */
export function Container({
  children,
  maxWidth = '1280px',
  className = '',
}: ContainerProps): JSX.Element {
  return (
    <div className={`container ${className}`}>
      {children}

      <style jsx>{`
        .container {
          width: 100%;
          max-width: ${maxWidth};
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
}

/**
 * Export all layout components
 */
export { ResponsiveLayout, getMaxWidth, getHorizontalPadding };
