import {
  getCookiePreferences,
  saveCookiePreferences,
  clearCookiePreferences,
} from './cookieManager';
import { CookiePreference } from '../types';

describe('cookieManager', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()}`);
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('saveCookiePreferences', () => {
    it('should save preferences to localStorage', () => {
      const prefs: CookiePreference = {
        essential: true,
        analytics: true,
        preferences: false,
        timestamp: new Date().toISOString(),
      };

      saveCookiePreferences(prefs);
      const stored = localStorage.getItem('cookie_consent');

      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.analytics).toBe(true);
      expect(parsed.preferences).toBe(false);
    });
  });

  describe('getCookiePreferences', () => {
    it('should retrieve preferences from localStorage', () => {
      const prefs: CookiePreference = {
        essential: true,
        analytics: true,
        preferences: false,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('cookie_consent', JSON.stringify(prefs));
      const retrieved = getCookiePreferences();

      expect(retrieved.analytics).toBe(true);
      expect(retrieved.essential).toBe(true);
    });

    it('should return default preferences if none stored', () => {
      const prefs = getCookiePreferences();
      expect(prefs.essential).toBe(true);
      expect(prefs.analytics).toBe(false);
      expect(prefs.preferences).toBe(false);
    });
  });

  describe('clearCookiePreferences', () => {
    it('should clear preferences from localStorage', () => {
      const prefs: CookiePreference = {
        essential: true,
        analytics: true,
        preferences: false,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('cookie_consent', JSON.stringify(prefs));
      clearCookiePreferences();

      expect(localStorage.getItem('cookie_consent')).toBeNull();
    });
  });
});
