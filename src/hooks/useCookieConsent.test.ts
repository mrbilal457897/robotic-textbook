/**
 * Tests for useCookieConsent Hook
 * Testing cookie preferences management and GDPR compliance
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useCookieConsent, CookiePreference } from './useCookieConsent';

const COOKIE_STORAGE_KEY = 'cookie_consent';

describe('useCookieConsent', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with no preferences and banner visible', async () => {
      const { result } = renderHook(() => useCookieConsent());

      await waitFor(() => {
        expect(result.current.showBanner).toBe(true);
      });

      expect(result.current.preferences).toBeNull();
    });

    it('should load existing preferences from localStorage', async () => {
      const mockPrefs: CookiePreference = {
        essential: true,
        analytics: true,
        preferences: false,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(mockPrefs));

      const { result } = renderHook(() => useCookieConsent());

      await waitFor(() => {
        expect(result.current.preferences).toEqual(mockPrefs);
      });

      expect(result.current.showBanner).toBe(false);
    });

    it('should handle corrupted localStorage data', async () => {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'invalid-json');

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useCookieConsent());

      await waitFor(() => {
        expect(result.current.showBanner).toBe(true);
      });

      expect(result.current.preferences).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Save Preferences', () => {
    it('should save preferences to localStorage', () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: true,
          preferences: false,
        });
      });

      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      expect(stored).not.toBeNull();

      const prefs: CookiePreference = JSON.parse(stored!);
      expect(prefs.essential).toBe(true);
      expect(prefs.analytics).toBe(true);
      expect(prefs.preferences).toBe(false);
      expect(prefs.timestamp).toBeDefined();
    });

    it('should hide banner after saving preferences', () => {
      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.showBanner).toBe(true);

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: false,
          preferences: false,
        });
      });

      expect(result.current.showBanner).toBe(false);
    });

    it('should update state with saved preferences', () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: true,
          preferences: true,
        });
      });

      expect(result.current.preferences).not.toBeNull();
      expect(result.current.preferences?.essential).toBe(true);
      expect(result.current.preferences?.analytics).toBe(true);
      expect(result.current.preferences?.preferences).toBe(true);
    });

    it('should merge partial preferences with defaults', () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          analytics: true,
        });
      });

      expect(result.current.preferences?.essential).toBe(true);
      expect(result.current.preferences?.analytics).toBe(true);
      expect(result.current.preferences?.preferences).toBe(false);
    });

    it('should update timestamp when saving', () => {
      const { result } = renderHook(() => useCookieConsent());

      const before = new Date();

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: true,
          preferences: false,
        });
      });

      const after = new Date();
      const timestamp = new Date(result.current.preferences?.timestamp!);

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should update existing preferences', () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: false,
          preferences: false,
        });
      });

      expect(result.current.preferences?.analytics).toBe(false);

      act(() => {
        result.current.savePreferences({
          analytics: true,
        });
      });

      expect(result.current.preferences?.analytics).toBe(true);
      expect(result.current.preferences?.essential).toBe(true);
      expect(result.current.preferences?.preferences).toBe(false);
    });
  });

  describe('Reset Preferences', () => {
    it('should clear preferences from localStorage', () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: true,
          preferences: true,
        });
      });

      expect(localStorage.getItem(COOKIE_STORAGE_KEY)).not.toBeNull();

      act(() => {
        result.current.resetPreferences();
      });

      expect(localStorage.getItem(COOKIE_STORAGE_KEY)).toBeNull();
    });

    it('should reset state to initial values', () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: true,
          preferences: true,
        });
      });

      act(() => {
        result.current.resetPreferences();
      });

      expect(result.current.preferences).toBeNull();
      expect(result.current.showBanner).toBe(true);
    });
  });

  describe('Hide Banner', () => {
    it('should hide banner without saving preferences', () => {
      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.showBanner).toBe(true);

      act(() => {
        result.current.hideBanner();
      });

      expect(result.current.showBanner).toBe(false);
      expect(result.current.preferences).toBeNull();
    });

    it('should not affect saved preferences', () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: true,
          preferences: false,
        });
      });

      const savedPrefs = result.current.preferences;

      act(() => {
        result.current.hideBanner();
      });

      expect(result.current.preferences).toEqual(savedPrefs);
    });
  });

  describe('Cookie Application', () => {
    it('should log analytics enabled when analytics is true', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: true,
          preferences: false,
        });
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('Analytics enabled');

      consoleLogSpy.mockRestore();
    });

    it('should log analytics disabled when analytics is false', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: false,
          preferences: false,
        });
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('Analytics disabled');

      consoleLogSpy.mockRestore();
    });

    it('should log preference cookies enabled when preferences is true', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          essential: true,
          analytics: false,
          preferences: true,
        });
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('Preference cookies enabled');

      consoleLogSpy.mockRestore();
    });

    it('should apply preferences when loaded from localStorage', async () => {
      const mockPrefs: CookiePreference = {
        essential: true,
        analytics: true,
        preferences: true,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(mockPrefs));

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      renderHook(() => useCookieConsent());

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('Analytics enabled');
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('Preference cookies enabled');

      consoleLogSpy.mockRestore();
    });
  });

  describe('GDPR Compliance', () => {
    it('should always set essential cookies to true', () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({
          analytics: false,
          preferences: false,
        });
      });

      expect(result.current.preferences?.essential).toBe(true);
    });

    it('should default non-essential cookies to false', () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.savePreferences({});
      });

      expect(result.current.preferences?.analytics).toBe(false);
      expect(result.current.preferences?.preferences).toBe(false);
    });

    it('should show banner when no consent is stored', async () => {
      const { result } = renderHook(() => useCookieConsent());

      await waitFor(() => {
        expect(result.current.showBanner).toBe(true);
      });
    });

    it('should not show banner when consent is stored', async () => {
      localStorage.setItem(
        COOKIE_STORAGE_KEY,
        JSON.stringify({
          essential: true,
          analytics: false,
          preferences: false,
          timestamp: new Date().toISOString(),
        })
      );

      const { result } = renderHook(() => useCookieConsent());

      await waitFor(() => {
        expect(result.current.showBanner).toBe(false);
      });
    });
  });
});
