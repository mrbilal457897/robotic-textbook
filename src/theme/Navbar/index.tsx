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

import React, { useState, useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation, useHistory } from '@docusaurus/router';
import { LanguageSelector } from '../../components/LanguageSelector';
import { LoginButton } from '../../components/Auth/LoginButton';
import { UserProfile } from '../../components/Auth/UserProfile';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../../components/ThemeToggle';
import styles from './styles.module.css';

export default function Navbar(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const history = useHistory();
  const robotIconUrl = useBaseUrl('/img/human.png');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

  // Perform search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      // Simple search simulation - in production, connect to your search index
      const mockResults = [
        {
          id: '1',
          title: 'Module 1: ROS 2 Basics',
          url: '/docs/module-1-ros2/',
          snippet: 'Learn the fundamentals of ROS 2...',
        },
        {
          id: '2',
          title: 'Module 2: Digital Twins',
          url: '/docs/module-2-digital-twin/',
          snippet: 'Build virtual replicas of robots...',
        },
        {
          id: '3',
          title: 'Module 3: NVIDIA Isaac',
          url: '/docs/module-3-isaac/',
          snippet: 'GPU-accelerated robotics simulation...',
        },
        {
          id: '4',
          title: 'Module 4: VLA Models',
          url: '/docs/module-4-vla/',
          snippet: 'Vision-Language-Action integration...',
        },
      ].filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.snippet.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(mockResults);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      const selected = searchResults[selectedIndex];
      if (selected) {
        history.push(selected.url);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchOpen(false);
      setSearchQuery('');
      inputRef.current?.blur();
    }
  };

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
              <img src={robotIconUrl} alt="Robot Agent" width="32" height="32" />
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
            {/* Inline Search */}
            <div className={styles.searchContainer} ref={searchRef}>
              <div
                className={`${styles.searchInputWrapper} ${isSearchOpen ? styles.searchInputExpanded : ''}`}
              >
                {/* Search Icon Button */}
                {!isSearchOpen && (
                  <button
                    className={styles.searchIconButton}
                    onClick={() => {
                      setIsSearchOpen(true);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    aria-label="Open search"
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
                )}

                {/* Expanded Search Input */}
                {isSearchOpen && (
                  <>
                    <svg
                      className={styles.searchIcon}
                      width="18"
                      height="18"
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
                    <input
                      ref={inputRef}
                      type="text"
                      className={styles.searchInput}
                      placeholder="Search modules, lessons..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      aria-label="Search modules and lessons"
                    />
                    <button
                      className={styles.searchCloseButton}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      aria-label="Close search"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 4L4 12M4 4l8 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery && (
                <div className={styles.searchDropdown}>
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((result, index) => (
                        <Link
                          key={result.id}
                          to={result.url}
                          className={`${styles.searchResultItem} ${index === selectedIndex ? styles.searchResultActive : ''}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className={styles.resultTitle}>{result.title}</div>
                          <div className={styles.resultSnippet}>{result.snippet}</div>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <div className={styles.noResults}>
                      <span>No results found</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

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

        {/* Mobile Utilities: Theme Toggle */}
        <div className={styles.mobileMenuUtilities}>
          <ThemeToggle />
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
    </>
  );
}
