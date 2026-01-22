/**
 * useCookieConsent Hook
 * Manages cookie consent preferences
 */

import { useEffect, useState } from "react";

export interface CookiePreference {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
  timestamp: string;
}

interface UseCookieConsentReturn {
  preferences: CookiePreference | null;
  showBanner: boolean;
  savePreferences: (prefs: Partial<CookiePreference>) => void;
  resetPreferences: () => void;
  hideBanner: () => void;
}

const COOKIE_STORAGE_KEY = "cookie_consent";
// const COOKIE_EXPIRY_DAYS = 365; // Reserved for future expiry implementation

/**
 * Hook for managing cookie consent
 * @returns Cookie preferences and control functions
 */
export function useCookieConsent(): UseCookieConsentReturn {
  const [preferences, setPreferences] = useState<CookiePreference | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkCookieConsent = () => {
      try {
        const stored = localStorage.getItem(COOKIE_STORAGE_KEY);

        if (stored) {
          const prefs: CookiePreference = JSON.parse(stored);
          setPreferences(prefs);
          setShowBanner(false);
          applyCookiePreferences(prefs);
        } else {
          // No cookie preferences found, show banner
          setShowBanner(true);
        }
      } catch (error) {
        console.error("Failed to read cookie preferences:", error);
        setShowBanner(true);
      }
    };

    checkCookieConsent();
  }, []);

  const applyCookiePreferences = (prefs: CookiePreference) => {
    // Analytics consent
    if (prefs.analytics) {
      // Enable Google Analytics or similar
      // This is a placeholder for actual analytics integration
      console.log("Analytics enabled");
    } else {
      // Disable analytics
      console.log("Analytics disabled");
    }

    // Preferences (marketing, etc.)
    if (prefs.preferences) {
      console.log("Preference cookies enabled");
    } else {
      console.log("Preference cookies disabled");
    }
  };

  const savePreferences = (prefs: Partial<CookiePreference>) => {
    const currentPrefs = preferences || {
      essential: true,
      analytics: false,
      preferences: false,
      timestamp: new Date().toISOString(),
    };

    const updatedPrefs: CookiePreference = {
      ...currentPrefs,
      ...prefs,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(updatedPrefs));
    setPreferences(updatedPrefs);
    setShowBanner(false);
    applyCookiePreferences(updatedPrefs);
  };

  const resetPreferences = () => {
    localStorage.removeItem(COOKIE_STORAGE_KEY);
    setPreferences(null);
    setShowBanner(true);
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  return {
    preferences,
    showBanner,
    savePreferences,
    resetPreferences,
    hideBanner,
  };
}
