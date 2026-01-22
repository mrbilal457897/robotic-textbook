import React, { useState, useRef, useEffect } from "react";
import { useLanguage, SupportedLanguage } from "../../hooks/useLanguage";
import styles from "./styles.module.css";

export function LanguageSelector() {
  const { currentLanguage, currentConfig, availableLanguages, switchLanguage } =
    useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setIsOpen(false);
    switchLanguage(lang);
  };

  return (
    <div
      className={styles.languageSelector}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        className={styles.selectorButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.flag}>{currentConfig.flag}</span>
        <span className={styles.languageName}>{currentConfig.name}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.open : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu" aria-label="Language options">
          <ul className={styles.dropdownList}>
            {availableLanguages.map((lang) => (
              <li key={lang.code}>
                <button
                  className={`${styles.languageOption} ${
                    lang.code === currentLanguage ? styles.current : ""
                  }`}
                  onClick={() => handleLanguageSelect(lang.code)}
                  role="menuitem"
                  aria-label={`Switch to ${lang.name}`}
                >
                  <span className={styles.flag}>{lang.flag}</span>
                  <div className={styles.languageInfo}>
                    <span className={styles.name}>{lang.name}</span>
                    <span className={styles.nativeName}>{lang.nativeName}</span>
                  </div>
                  {lang.code === currentLanguage && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
