/**
 * Cookie Manager Utilities
 * Handles reading, writing, and deleting cookies based on preferences
 */

export interface CookiePreference {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
  timestamp: string;
}

const COOKIE_STORAGE_KEY = "cookie_consent";

/**
 * Get stored cookie preferences
 */
export function getCookiePreferences(): CookiePreference | null {
  try {
    const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to get cookie preferences:", error);
  }
  return null;
}

/**
 * Save cookie preferences to localStorage
 */
export function saveCookiePreferences(prefs: CookiePreference): void {
  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    applyPreferences(prefs);
  } catch (error) {
    console.error("Failed to save cookie preferences:", error);
  }
}

/**
 * Clear cookie preferences
 */
export function clearCookiePreferences(): void {
  try {
    localStorage.removeItem(COOKIE_STORAGE_KEY);
    // Clear all non-essential cookies
    clearNonEssentialCookies();
  } catch (error) {
    console.error("Failed to clear cookie preferences:", error);
  }
}

/**
 * Apply cookie preferences by enabling/disabling tracking
 */
function applyPreferences(prefs: CookiePreference): void {
  if (prefs.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }

  if (prefs.preferences) {
    enablePreferenceCookies();
  } else {
    disablePreferenceCookies();
  }
}

/**
 * Enable analytics tracking
 */
function enableAnalytics(): void {
  // This would integrate with Google Analytics, Mixpanel, etc.
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
  }
}

/**
 * Disable analytics tracking
 */
function disableAnalytics(): void {
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }
}

/**
 * Enable preference cookies (marketing, etc.)
 */
function enablePreferenceCookies(): void {
  // Implementation for preference cookies
  if (window.gtag) {
    window.gtag("consent", "update", {
      ad_storage: "granted",
    });
  }
}

/**
 * Disable preference cookies
 */
function disablePreferenceCookies(): void {
  if (window.gtag) {
    window.gtag("consent", "update", {
      ad_storage: "denied",
    });
  }
}

/**
 * Clear all non-essential cookies
 */
function clearNonEssentialCookies(): void {
  // Get all cookies
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();

    // Don't delete essential cookies (customize list as needed)
    const essentialCookies = [
      "session",
      "csrf",
      "lang",
      "auth",
      "cookie_consent",
    ];

    if (!essentialCookies.includes(cookieName.toLowerCase())) {
      // Delete the cookie
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}

/**
 * Set a cookie with preferences check
 */
export function setTrackedCookie(
  name: string,
  value: string,
  options: {
    category?: "essential" | "analytics" | "preferences";
    maxAge?: number;
  } = {}
): void {
  const { category = "essential", maxAge = 86400 * 365 } = options;

  // Essential cookies are always set
  if (category === "essential") {
    setCookie(name, value, maxAge);
    return;
  }

  // Check preferences for other categories
  const prefs = getCookiePreferences();
  if (!prefs) return;

  if (category === "analytics" && prefs.analytics) {
    setCookie(name, value, maxAge);
  } else if (category === "preferences" && prefs.preferences) {
    setCookie(name, value, maxAge);
  }
}

/**
 * Low-level cookie setter
 */
function setCookie(
  name: string,
  value: string,
  maxAge: number = 86400 * 365
): void {
  const date = new Date();
  date.setTime(date.getTime() + maxAge * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null;
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: Function;
  }
}
