/**
 * Header Component
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * Main site header with logo, navigation, and responsive mobile menu.
 * Implements glassmorphism effect and WCAG 2.1 AA accessibility.
 */

import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { tokens } from '../../theme/theme';

export interface HeaderProps {
  /** Additional CSS classes */
  className?: string;
  /** Whether to show transparent background (for hero sections) */
  transparent?: boolean;
}

/**
 * Main navigation header component.
 *
 * Features:
 * - Responsive design (mobile, tablet, desktop)
 * - Glassmorphism effect with blur
 * - Keyboard navigation support
 * - ARIA labels for screen readers
 * - Mobile hamburger menu toggle
 *
 * @example
 * ```tsx
 * <Header transparent={false} />
 * ```
 */
export default function Header({ className = '', transparent = false }: HeaderProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Modules', href: '/docs/modules' },
    { label: 'Course Timeline', href: '/timeline' },
    { label: 'Curriculum', href: '/curriculum' },
    { label: 'Hardware', href: '/hardware' },
    { label: 'Getting Started', href: '/docs/getting-started' },
  ];

  return (
    <header
      className={`header ${transparent ? 'header--transparent' : 'header--solid'} ${className}`}
      role="banner"
      aria-label="Main navigation"
    >
      <div className="header__container">
        {/* Logo and Site Title */}
        <div className="header__logo">
          <Link
            to="/"
            className="header__logo-link"
            aria-label={`${siteConfig.title} home`}
          >
            <span className="header__logo-icon" aria-hidden="true">
              🤖
            </span>
            <span className="header__logo-text">
              {siteConfig.title}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav" aria-label="Primary navigation">
          <ul className="header__nav-list" role="list">
            {navItems.map((item) => (
              <li key={item.href} className="header__nav-item">
                <Link
                  to={item.href}
                  className="header__nav-link"
                  activeClassName="header__nav-link--active"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="header__mobile-toggle"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="header__mobile-toggle-icon">
            {mobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="header__mobile-menu"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <nav className="header__mobile-nav" aria-label="Mobile primary navigation">
            <ul className="header__mobile-nav-list" role="list">
              {navItems.map((item) => (
                <li key={item.href} className="header__mobile-nav-item">
                  <Link
                    to={item.href}
                    className="header__mobile-nav-link"
                    onClick={closeMobileMenu}
                    activeClassName="header__mobile-nav-link--active"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: ${tokens.zIndex.sticky};
          width: 100%;
          transition: background-color ${tokens.transitions.duration.medium} ${tokens.transitions.timing.easeInOut},
                      backdrop-filter ${tokens.transitions.duration.medium} ${tokens.transitions.timing.easeInOut};
        }

        .header--solid {
          background: rgba(26, 34, 48, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid ${tokens.colors.border.default};
        }

        .header--transparent {
          background: transparent;
        }

        .header__container {
          max-width: 1280px;
          margin: 0 auto;
          padding: ${tokens.spacing[4]} ${tokens.spacing[6]};
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: ${tokens.spacing[8]};
        }

        .header__logo {
          flex-shrink: 0;
        }

        .header__logo-link {
          display: flex;
          align-items: center;
          gap: ${tokens.spacing[3]};
          text-decoration: none;
          color: ${tokens.colors.text.primary};
          font-family: ${tokens.typography.fontFamily.display};
          font-size: ${tokens.typography.fontSize.xl};
          font-weight: ${tokens.typography.fontWeight.bold};
          transition: color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut};
        }

        .header__logo-link:hover {
          color: ${tokens.colors.primary.main};
        }

        .header__logo-link:focus-visible {
          outline: ${tokens.a11y.focusRing.width} solid ${tokens.a11y.focusRing.color};
          outline-offset: ${tokens.a11y.focusRing.offset};
          border-radius: ${tokens.borderRadius.md};
        }

        .header__logo-icon {
          font-size: ${tokens.typography.fontSize['2xl']};
          line-height: 1;
        }

        .header__logo-text {
          display: none;
        }

        @media (min-width: ${tokens.breakpoints.md}) {
          .header__logo-text {
            display: inline;
          }
        }

        .header__nav {
          display: none;
          flex: 1;
        }

        @media (min-width: ${tokens.breakpoints.lg}) {
          .header__nav {
            display: block;
          }
        }

        .header__nav-list {
          display: flex;
          gap: ${tokens.spacing[2]};
          list-style: none;
          margin: 0;
          padding: 0;
          justify-content: flex-end;
        }

        .header__nav-item {
          margin: 0;
        }

        .header__nav-link {
          display: block;
          padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
          color: ${tokens.colors.text.secondary};
          text-decoration: none;
          font-family: ${tokens.typography.fontFamily.heading};
          font-size: ${tokens.typography.fontSize.base};
          font-weight: ${tokens.typography.fontWeight.medium};
          border-radius: ${tokens.borderRadius.md};
          transition: color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut},
                      background-color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut};
        }

        .header__nav-link:hover {
          color: ${tokens.colors.primary.main};
          background-color: rgba(0, 240, 255, 0.1);
        }

        .header__nav-link:focus-visible {
          outline: ${tokens.a11y.focusRing.width} solid ${tokens.a11y.focusRing.color};
          outline-offset: ${tokens.a11y.focusRing.offset};
        }

        .header__nav-link--active {
          color: ${tokens.colors.primary.main};
          background-color: rgba(0, 240, 255, 0.15);
        }

        .header__mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          padding: 0;
          background: transparent;
          border: 1px solid ${tokens.colors.border.default};
          border-radius: ${tokens.borderRadius.md};
          color: ${tokens.colors.text.primary};
          cursor: pointer;
          transition: border-color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut},
                      background-color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut};
        }

        @media (min-width: ${tokens.breakpoints.lg}) {
          .header__mobile-toggle {
            display: none;
          }
        }

        .header__mobile-toggle:hover {
          border-color: ${tokens.colors.primary.main};
          background-color: rgba(0, 240, 255, 0.1);
        }

        .header__mobile-toggle:focus-visible {
          outline: ${tokens.a11y.focusRing.width} solid ${tokens.a11y.focusRing.color};
          outline-offset: ${tokens.a11y.focusRing.offset};
        }

        .header__mobile-toggle-icon {
          font-size: ${tokens.typography.fontSize['2xl']};
          line-height: 1;
        }

        .header__mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${tokens.colors.background.overlay};
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: ${tokens.zIndex.modal};
          padding: ${tokens.spacing[20]} ${tokens.spacing[6]};
          animation: fadeIn ${tokens.transitions.duration.medium} ${tokens.transitions.timing.easeOut};
        }

        @media (min-width: ${tokens.breakpoints.lg}) {
          .header__mobile-menu {
            display: none;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .header__mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: ${tokens.spacing[4]};
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .header__mobile-nav-item {
          margin: 0;
        }

        .header__mobile-nav-link {
          display: block;
          padding: ${tokens.spacing[4]};
          color: ${tokens.colors.text.primary};
          text-decoration: none;
          font-family: ${tokens.typography.fontFamily.heading};
          font-size: ${tokens.typography.fontSize.xl};
          font-weight: ${tokens.typography.fontWeight.semibold};
          border-radius: ${tokens.borderRadius.lg};
          text-align: center;
          transition: color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut},
                      background-color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut};
        }

        .header__mobile-nav-link:hover {
          color: ${tokens.colors.primary.main};
          background-color: rgba(0, 240, 255, 0.1);
        }

        .header__mobile-nav-link:focus-visible {
          outline: ${tokens.a11y.focusRing.width} solid ${tokens.a11y.focusRing.color};
          outline-offset: ${tokens.a11y.focusRing.offset};
        }

        .header__mobile-nav-link--active {
          color: ${tokens.colors.primary.main};
          background-color: rgba(0, 240, 255, 0.15);
        }

        @media (prefers-reduced-motion: reduce) {
          .header,
          .header__logo-link,
          .header__nav-link,
          .header__mobile-toggle,
          .header__mobile-nav-link {
            transition: none;
          }

          .header__mobile-menu {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}

/**
 * Export named component for testing
 */
export { Header };
