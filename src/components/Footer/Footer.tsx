/**
 * Footer Component
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * Site footer with navigation links, copyright, and social links.
 * Implements glassmorphism effect and WCAG 2.1 AA accessibility.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { tokens } from '../../theme/theme';

export interface FooterProps {
  /** Additional CSS classes */
  className?: string;
}

interface FooterSection {
  title: string;
  items: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

/**
 * Main site footer component.
 *
 * Features:
 * - Multi-column responsive layout
 * - Glassmorphism effect
 * - Internal and external link support
 * - Keyboard navigation
 * - ARIA landmarks and labels
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export default function Footer({ className = '' }: FooterProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const currentYear = new Date().getFullYear();

  const footerSections: FooterSection[] = [
    {
      title: 'Content',
      items: [
        { label: 'Modules', href: '/docs/modules' },
        { label: 'Course Timeline', href: '/timeline' },
        { label: 'Curriculum', href: '/curriculum' },
        { label: 'Getting Started', href: '/docs/getting-started' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { label: 'Hardware', href: '/hardware' },
        { label: 'Documentation', href: '/docs/intro' },
        { label: 'FAQ', href: '/faq' },
        { label: 'About', href: '/about' },
      ],
    },
    {
      title: 'Community',
      items: [
        { label: 'GitHub', href: 'https://github.com', external: true },
        { label: 'Discord', href: 'https://discord.com', external: true },
        { label: 'Twitter', href: 'https://twitter.com', external: true },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'License', href: '/license' },
      ],
    },
  ];

  return (
    <footer
      className={`footer ${className}`}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="footer__container">
        {/* Footer Grid */}
        <div className="footer__grid">
          {/* Brand Section */}
          <div className="footer__brand">
            <Link
              to="/"
              className="footer__brand-link"
              aria-label={`${siteConfig.title} home`}
            >
              <span className="footer__brand-icon" aria-hidden="true">
                🤖
              </span>
              <span className="footer__brand-text">
                {siteConfig.title}
              </span>
            </Link>
            <p className="footer__tagline">
              {siteConfig.tagline || 'An Interactive Learning Experience'}
            </p>
            <p className="footer__description">
              Master physical AI and humanoid robotics through hands-on simulation,
              rigorous theory, and industry best practices.
            </p>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="footer__section">
              <h3 className="footer__section-title">{section.title}</h3>
              <ul className="footer__section-list" role="list">
                {section.items.map((item) => (
                  <li key={item.href} className="footer__section-item">
                    <Link
                      to={item.href}
                      className="footer__section-link"
                      {...(item.external && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        'aria-label': `${item.label} (opens in new tab)`,
                      })}
                    >
                      {item.label}
                      {item.external && (
                        <span className="footer__external-icon" aria-hidden="true">
                          ↗
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>
              © {currentYear} {siteConfig.title}. All rights reserved.
            </p>
            <p className="footer__simulation-notice">
              All code examples are simulation-only. Not intended for real hardware deployment.
            </p>
          </div>
          <div className="footer__meta">
            <p>
              Built with <Link to="https://docusaurus.io" target="_blank" rel="noopener noreferrer">Docusaurus</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: ${tokens.colors.background.card};
          border-top: 1px solid ${tokens.colors.border.default};
          margin-top: ${tokens.spacing[20]};
        }

        .footer__container {
          max-width: 1280px;
          margin: 0 auto;
          padding: ${tokens.spacing[16]} ${tokens.spacing[6]} ${tokens.spacing[8]};
        }

        .footer__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: ${tokens.spacing[12]};
          margin-bottom: ${tokens.spacing[12]};
        }

        @media (min-width: ${tokens.breakpoints.sm}) {
          .footer__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: ${tokens.breakpoints.md}) {
          .footer__grid {
            grid-template-columns: 2fr repeat(2, 1fr);
          }
        }

        @media (min-width: ${tokens.breakpoints.lg}) {
          .footer__grid {
            grid-template-columns: 2fr repeat(4, 1fr);
          }
        }

        .footer__brand {
          grid-column: 1 / -1;
        }

        @media (min-width: ${tokens.breakpoints.md}) {
          .footer__brand {
            grid-column: 1 / 2;
          }
        }

        .footer__brand-link {
          display: inline-flex;
          align-items: center;
          gap: ${tokens.spacing[3]};
          text-decoration: none;
          color: ${tokens.colors.text.primary};
          font-family: ${tokens.typography.fontFamily.display};
          font-size: ${tokens.typography.fontSize['2xl']};
          font-weight: ${tokens.typography.fontWeight.bold};
          margin-bottom: ${tokens.spacing[4]};
          transition: color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut};
        }

        .footer__brand-link:hover {
          color: ${tokens.colors.primary.main};
        }

        .footer__brand-link:focus-visible {
          outline: ${tokens.a11y.focusRing.width} solid ${tokens.a11y.focusRing.color};
          outline-offset: ${tokens.a11y.focusRing.offset};
          border-radius: ${tokens.borderRadius.md};
        }

        .footer__brand-icon {
          font-size: ${tokens.typography.fontSize['3xl']};
          line-height: 1;
        }

        .footer__tagline {
          color: ${tokens.colors.text.secondary};
          font-family: ${tokens.typography.fontFamily.heading};
          font-size: ${tokens.typography.fontSize.lg};
          font-weight: ${tokens.typography.fontWeight.medium};
          margin: ${tokens.spacing[3]} 0;
        }

        .footer__description {
          color: ${tokens.colors.text.tertiary};
          font-family: ${tokens.typography.fontFamily.body};
          font-size: ${tokens.typography.fontSize.sm};
          line-height: ${tokens.typography.lineHeight.relaxed};
          max-width: 400px;
          margin: 0;
        }

        .footer__section {
          display: flex;
          flex-direction: column;
          gap: ${tokens.spacing[4]};
        }

        .footer__section-title {
          color: ${tokens.colors.text.primary};
          font-family: ${tokens.typography.fontFamily.heading};
          font-size: ${tokens.typography.fontSize.lg};
          font-weight: ${tokens.typography.fontWeight.semibold};
          margin: 0;
        }

        .footer__section-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: ${tokens.spacing[2]};
        }

        .footer__section-item {
          margin: 0;
        }

        .footer__section-link {
          display: inline-flex;
          align-items: center;
          gap: ${tokens.spacing[1]};
          color: ${tokens.colors.text.secondary};
          text-decoration: none;
          font-family: ${tokens.typography.fontFamily.body};
          font-size: ${tokens.typography.fontSize.sm};
          transition: color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut};
        }

        .footer__section-link:hover {
          color: ${tokens.colors.primary.main};
        }

        .footer__section-link:focus-visible {
          outline: ${tokens.a11y.focusRing.width} solid ${tokens.a11y.focusRing.color};
          outline-offset: ${tokens.a11y.focusRing.offset};
          border-radius: ${tokens.borderRadius.sm};
        }

        .footer__external-icon {
          font-size: ${tokens.typography.fontSize.xs};
          line-height: 1;
        }

        .footer__bottom {
          display: flex;
          flex-direction: column;
          gap: ${tokens.spacing[4]};
          padding-top: ${tokens.spacing[8]};
          border-top: 1px solid ${tokens.colors.border.default};
        }

        @media (min-width: ${tokens.breakpoints.md}) {
          .footer__bottom {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .footer__copyright {
          color: ${tokens.colors.text.tertiary};
          font-family: ${tokens.typography.fontFamily.body};
          font-size: ${tokens.typography.fontSize.xs};
          line-height: ${tokens.typography.lineHeight.relaxed};
        }

        .footer__copyright p {
          margin: ${tokens.spacing[1]} 0;
        }

        .footer__simulation-notice {
          color: ${tokens.colors.status.warning};
          font-weight: ${tokens.typography.fontWeight.medium};
        }

        .footer__meta {
          color: ${tokens.colors.text.tertiary};
          font-family: ${tokens.typography.fontFamily.body};
          font-size: ${tokens.typography.fontSize.xs};
        }

        .footer__meta p {
          margin: 0;
        }

        .footer__meta a {
          color: ${tokens.colors.primary.main};
          text-decoration: none;
          transition: color ${tokens.transitions.duration.fast} ${tokens.transitions.timing.easeOut};
        }

        .footer__meta a:hover {
          color: ${tokens.colors.primary.light};
          text-decoration: underline;
        }

        .footer__meta a:focus-visible {
          outline: ${tokens.a11y.focusRing.width} solid ${tokens.a11y.focusRing.color};
          outline-offset: ${tokens.a11y.focusRing.offset};
          border-radius: ${tokens.borderRadius.sm};
        }

        @media (prefers-reduced-motion: reduce) {
          .footer__brand-link,
          .footer__section-link,
          .footer__meta a {
            transition: none;
          }
        }
      `}</style>
    </footer>
  );
}

/**
 * Export named component for testing
 */
export { Footer };
