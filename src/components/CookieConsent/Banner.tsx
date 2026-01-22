import React from "react";
import styles from "./styles.module.css";

interface BannerProps {
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onCustomize: () => void;
}

export function CookieConsentBanner({
  onAcceptAll,
  onRejectNonEssential,
  onCustomize,
}: BannerProps) {
  return (
    <div className={styles.cookieBanner} role="dialog" aria-label="Cookie consent">
      <div className={styles.bannerContent}>
        <div className={styles.bannerText}>
          <h3>Cookie Preferences</h3>
          <p>
            We use cookies to enhance your experience, analyze site traffic, and
            personalize content. You can choose to accept all cookies or customize
            your preferences.
          </p>
        </div>

        <div className={styles.bannerActions}>
          <button
            className={styles.acceptButton}
            onClick={onAcceptAll}
            aria-label="Accept all cookies"
          >
            Accept All
          </button>
          <button
            className={styles.rejectButton}
            onClick={onRejectNonEssential}
            aria-label="Reject non-essential cookies"
          >
            Reject Non-Essential
          </button>
          <button
            className={styles.customizeButton}
            onClick={onCustomize}
            aria-label="Customize cookie preferences"
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}
