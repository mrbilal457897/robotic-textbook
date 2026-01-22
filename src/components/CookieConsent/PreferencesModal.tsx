import React, { useState } from "react";
import { CookiePreference } from "@/hooks/useCookieConsent";
import styles from "./styles.module.css";

interface PreferencesModalProps {
  currentPreferences: CookiePreference | null;
  onSave: (preferences: Partial<CookiePreference>) => void;
  onClose: () => void;
}

export function PreferencesModal({
  currentPreferences,
  onSave,
  onClose,
}: PreferencesModalProps) {
  const [analytics, setAnalytics] = useState(
    currentPreferences?.analytics ?? false
  );
  const [preferences, setPreferences] = useState(
    currentPreferences?.preferences ?? false
  );

  const handleSave = () => {
    onSave({
      essential: true, // Always true
      analytics,
      preferences,
    });
    onClose();
  };

  const handleAcceptAll = () => {
    onSave({
      essential: true,
      analytics: true,
      preferences: true,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="cookie-preferences-title"
        aria-modal="true"
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close preferences modal"
        >
          &times;
        </button>

        <div className={styles.modalHeader}>
          <h2 id="cookie-preferences-title">Cookie Preferences</h2>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.preferencesGroup}>
            <div className={styles.preferenceItem}>
              <div className={styles.preferenceInfo}>
                <h3>Essential Cookies</h3>
                <p>
                  Required for the website to function properly. These cookies
                  cannot be disabled as they are necessary for core
                  functionality like authentication and security.
                </p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  aria-label="Essential cookies (always enabled)"
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.preferenceItem}>
              <div className={styles.preferenceInfo}>
                <h3>Analytics Cookies</h3>
                <p>
                  Help us understand how visitors interact with our website by
                  collecting and reporting information anonymously. We use this
                  data to improve user experience and site performance.
                </p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  aria-label="Enable analytics cookies"
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.preferenceItem}>
              <div className={styles.preferenceInfo}>
                <h3>Preference Cookies</h3>
                <p>
                  Allow the website to remember choices you make (such as
                  language, theme, or region) and provide enhanced, more
                  personalized features.
                </p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                  aria-label="Enable preference cookies"
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            aria-label="Cancel and close preferences"
          >
            Cancel
          </button>
          <button
            className={styles.saveButton}
            onClick={handleAcceptAll}
            aria-label="Accept all cookies"
          >
            Accept All
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            aria-label="Save cookie preferences"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
