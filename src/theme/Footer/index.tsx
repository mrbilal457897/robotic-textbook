/**
 * Custom Footer Component
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * Features:
 * - Logo and tagline
 * - Quick links section
 * - Social media links
 * - Copyright notice
 * - Cookie Settings link (functional in US6)
 */

import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function Footer(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const currentYear = new Date().getFullYear();
  const humanIconUrl = useBaseUrl('/img/human.png');

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Modules', to: '/docs/intro' },
    { label: 'Resources', to: '/resources' },
    { label: 'About', to: '/about' },
  ];

  const socialLinks = [
    {
      label: 'GitHub',
      href: 'https://github.com',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-1.025-.014-1.861-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531.103 1.531.103.893 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.019 10.019 0 0020 10c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
        </svg>
      ),
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
  ];

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerInner}>
        {/* Footer Top Section */}
        <div className={styles.footerTop}>
          {/* Logo and Tagline */}
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.footerLogo} aria-label="Home">
              <div className={styles.logoIcon}>
                <img
                  src={humanIconUrl}
                  alt="Physical AI & Humanoid Robotics"
                  width="40"
                  height="40"
                />
              </div>
              <span className={styles.logoText}>{siteConfig.title}</span>
            </Link>
            <p className={styles.footerTagline}>{siteConfig.tagline}</p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>Quick Links</h3>
            <ul className={styles.footerLinksList}>
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>Resources</h3>
            <ul className={styles.footerLinksList}>
              <li>
                <Link to="/docs/intro" className={styles.footerLink}>
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/resources" className={styles.footerLink}>
                  Learning Resources
                </Link>
              </li>
              <li>
                <Link to="/about" className={styles.footerLink}>
                  About the Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerSectionTitle}>Legal</h3>
            <ul className={styles.footerLinksList}>
              <li>
                <Link to="/privacy-policy" className={styles.footerLink}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-settings" className={styles.footerLink}>
                  Cookie Settings
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className={styles.footerBottom}>
          {/* Social Links */}
          <div className={styles.socialLinks}>
            {socialLinks.map(social => (
              <a
                key={social.label}
                href={social.href}
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className={styles.copyright}>
            © {currentYear} {siteConfig.title}. Built with{' '}
            <a
              href="https://docusaurus.io/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.copyrightLink}
            >
              Docusaurus
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
