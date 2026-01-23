/**
 * Custom Navbar Component
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * Features:
 * - Logo linking to homepage
 * - Navigation links (Home, Modules, Resources, About)
 * - Search bar placeholder (functional in US5)
 * - Language selector placeholder (functional in US3)
 * - GitHub login button placeholder (functional in US4)
 * - Mobile hamburger menu (<768px)
 */

import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import { SearchUI } from '../../components/Search/SearchUI';
import { LanguageSelector } from '../../components/LanguageSelector';
import { LoginButton } from '../../components/Auth/LoginButton';
import { UserProfile } from '../../components/Auth/UserProfile';
import { useAuth } from '../../hooks/useAuth';
import styles from './styles.module.css';

export default function Navbar(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Modules', to: '/docs/intro' },
    { label: 'Resources', to: '/resources' },
    { label: 'About', to: '/about' },
  ];

  const isActiveLink = (to: string) => {
    if (to === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <nav
        className={`navbar ${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.navbarInner}>
          {/* Logo */}
          <Link to="/" className={styles.navbarLogo} aria-label="Home">
            <div className={styles.logoIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M16 8 L16 24 M10 16 L22 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className={styles.logoText}>{siteConfig.title}</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className={styles.navbarLinks}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`${styles.navLink} ${isActiveLink(link.to) ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className={styles.navbarActions}>
            {/* Search Button */}
            <button
              className={styles.searchButton}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search (Ctrl+K)"
              title="Search modules and lessons (Ctrl+K)"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M14 14 L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Authentication */}
            {isLoading ? (
              <div className={styles.loadingSpinner} aria-label="Loading authentication status">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.spinner}
                  aria-hidden="true"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M14 8a6 6 0 0 0-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ) : isAuthenticated && user ? (
              <UserProfile user={user} onLogout={logout} />
            ) : (
              <LoginButton onLogin={() => {}} disabled={false} />
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={toggleMobileMenu} aria-hidden="true" />
      )}

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className={styles.mobileMenuHeader}>
          <span className={styles.mobileMenuTitle}>Menu</span>
          <button
            className={styles.mobileMenuClose}
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.mobileMenuLinks}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.mobileNavLink} ${
                isActiveLink(link.to) ? styles.mobileNavLinkActive : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.mobileMenuActions}>
          {isLoading ? (
            <div className={styles.loadingSpinner} aria-label="Loading authentication status">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.spinner}
                aria-hidden="true"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                />
                <path
                  d="M14 8a6 6 0 0 0-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ) : isAuthenticated && user ? (
            <div className={styles.mobileUserSection}>
              <div className={styles.mobileUserInfo}>
                <img
                  src={user.avatar}
                  alt={`${user.username}'s avatar`}
                  className={styles.mobileAvatar}
                />
                <div>
                  <div className={styles.mobileUsername}>{user.username}</div>
                  {user.email && <div className={styles.mobileEmail}>{user.email}</div>}
                </div>
              </div>
              <button onClick={logout} className={`${styles.mobileActionButton} btn-danger`}>
                Logout
              </button>
            </div>
          ) : (
            <LoginButton onLogin={() => {}} disabled={false} />
          )}
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && <SearchUI />}
    </>
  );
}
