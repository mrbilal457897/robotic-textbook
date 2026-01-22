/**
 * Tests for useLanguage Hook
 * Testing language selection, i18n, and RTL support
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useLanguage, SupportedLanguage } from './useLanguage';

const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

// Mock @docusaurus/router
const mockLocation = { pathname: '/' };
jest.mock('@docusaurus/router', () => ({
  useLocation: () => mockLocation,
}));

describe('useLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockLocation.pathname = '/';
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  describe('Initial State', () => {
    it('should initialize with default language (en)', () => {
      const { result } = renderHook(() => useLanguage());

      expect(result.current.currentLanguage).toBe('en');
      expect(result.current.currentConfig.code).toBe('en');
      expect(result.current.isRTL).toBe(false);
    });

    it('should provide all available languages', () => {
      const { result } = renderHook(() => useLanguage());

      expect(result.current.availableLanguages).toHaveLength(5);
      expect(result.current.availableLanguages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'en' }),
          expect.objectContaining({ code: 'ur' }),
          expect.objectContaining({ code: 'ar' }),
          expect.objectContaining({ code: 'zh' }),
          expect.objectContaining({ code: 'es' }),
        ])
      );
    });
  });

  describe('Language Detection from URL', () => {
    it('should detect language from URL path', async () => {
      mockLocation.pathname = '/es/docs/intro';

      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('es');
      });
    });

    it('should detect RTL languages from URL', async () => {
      mockLocation.pathname = '/ar/docs/intro';

      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
        expect(result.current.isRTL).toBe(true);
      });
    });

    it('should handle Urdu (RTL) language', async () => {
      mockLocation.pathname = '/ur/docs/intro';

      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ur');
        expect(result.current.isRTL).toBe(true);
      });
    });

    it('should use default language if URL has no language prefix', async () => {
      mockLocation.pathname = '/docs/intro';

      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('en');
      });
    });

    it('should ignore invalid language codes in URL', async () => {
      mockLocation.pathname = '/invalid/docs/intro';

      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('en');
      });
    });
  });

  describe('Language Detection from localStorage', () => {
    it('should use saved language preference when no URL prefix', async () => {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'zh');
      mockLocation.pathname = '/docs/intro';

      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('zh');
      });
    });

    it('should prioritize URL language over localStorage', async () => {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
      mockLocation.pathname = '/zh/docs/intro';

      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('zh');
      });
    });

    it('should handle corrupted localStorage data', async () => {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'invalid-lang');
      mockLocation.pathname = '/docs/intro';

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('en');
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Switch Language', () => {
    it('should save language preference to localStorage', () => {
      const { result } = renderHook(() => useLanguage());

      act(() => {
        result.current.switchLanguage('es');
      });

      expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
    });

    it('should navigate to URL with language prefix', () => {
      mockLocation.pathname = '/docs/intro';
      const { result } = renderHook(() => useLanguage());

      act(() => {
        result.current.switchLanguage('es');
      });

      expect(window.location.href).toBe('/es/docs/intro');
    });

    it('should remove language prefix when switching to default (en)', () => {
      mockLocation.pathname = '/es/docs/intro';
      const { result } = renderHook(() => useLanguage());

      act(() => {
        result.current.switchLanguage('en');
      });

      expect(window.location.href).toBe('/docs/intro');
    });

    it('should replace existing language prefix', () => {
      mockLocation.pathname = '/es/docs/intro';
      const { result } = renderHook(() => useLanguage());

      act(() => {
        result.current.switchLanguage('zh');
      });

      expect(window.location.href).toBe('/zh/docs/intro');
    });

    it('should handle unsupported language codes', () => {
      const { result } = renderHook(() => useLanguage());
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      act(() => {
        result.current.switchLanguage('invalid' as SupportedLanguage);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Unsupported language: invalid');
      expect(window.location.href).toBe('');

      consoleErrorSpy.mockRestore();
    });

    it('should handle localStorage errors gracefully', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useLanguage());

      act(() => {
        result.current.switchLanguage('es');
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save language preference:',
        expect.any(Error)
      );

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Language Configuration', () => {
    it('should provide correct config for English', () => {
      mockLocation.pathname = '/docs/intro';
      const { result } = renderHook(() => useLanguage());

      expect(result.current.currentConfig).toEqual({
        code: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
        flag: '🇬🇧',
      });
    });

    it('should provide correct config for Arabic (RTL)', async () => {
      mockLocation.pathname = '/ar/docs/intro';
      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentConfig).toEqual({
          code: 'ar',
          name: 'Arabic',
          nativeName: 'العربية',
          direction: 'rtl',
          flag: '🇸🇦',
        });
      });
    });

    it('should provide correct config for Urdu (RTL)', async () => {
      mockLocation.pathname = '/ur/docs/intro';
      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentConfig).toEqual({
          code: 'ur',
          name: 'Urdu',
          nativeName: 'اردو',
          direction: 'rtl',
          flag: '🇵🇰',
        });
      });
    });

    it('should provide correct config for Chinese', async () => {
      mockLocation.pathname = '/zh/docs/intro';
      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentConfig).toEqual({
          code: 'zh',
          name: 'Chinese',
          nativeName: '中文',
          direction: 'ltr',
          flag: '🇨🇳',
        });
      });
    });

    it('should provide correct config for Spanish', async () => {
      mockLocation.pathname = '/es/docs/intro';
      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.currentConfig).toEqual({
          code: 'es',
          name: 'Spanish',
          nativeName: 'Español',
          direction: 'ltr',
          flag: '🇪🇸',
        });
      });
    });
  });

  describe('RTL Support', () => {
    it('should return isRTL false for LTR languages', () => {
      mockLocation.pathname = '/en/docs/intro';
      const { result } = renderHook(() => useLanguage());

      expect(result.current.isRTL).toBe(false);
    });

    it('should return isRTL true for Arabic', async () => {
      mockLocation.pathname = '/ar/docs/intro';
      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.isRTL).toBe(true);
      });
    });

    it('should return isRTL true for Urdu', async () => {
      mockLocation.pathname = '/ur/docs/intro';
      const { result } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result.current.isRTL).toBe(true);
      });
    });

    it('should update isRTL when switching between LTR and RTL', async () => {
      mockLocation.pathname = '/en/docs/intro';
      const { result } = renderHook(() => useLanguage());

      expect(result.current.isRTL).toBe(false);

      // Simulate switching to Arabic
      mockLocation.pathname = '/ar/docs/intro';
      const { result: result2 } = renderHook(() => useLanguage());

      await waitFor(() => {
        expect(result2.current.isRTL).toBe(true);
      });
    });
  });

  describe('URL Path Handling', () => {
    it('should handle root path', () => {
      mockLocation.pathname = '/';
      const { result } = renderHook(() => useLanguage());

      act(() => {
        result.current.switchLanguage('es');
      });

      expect(window.location.href).toBe('/es/');
    });

    it('should handle paths with trailing slash', () => {
      mockLocation.pathname = '/docs/intro/';
      const { result } = renderHook(() => useLanguage());

      act(() => {
        result.current.switchLanguage('zh');
      });

      // Note: trailing slashes may be removed during path processing
      expect(window.location.href).toMatch(/^\/zh\/docs\/intro\/?$/);
    });

    it('should handle deep nested paths', () => {
      mockLocation.pathname = '/docs/modules/01-ros2/lesson1';
      const { result } = renderHook(() => useLanguage());

      act(() => {
        result.current.switchLanguage('ar');
      });

      expect(window.location.href).toBe('/ar/docs/modules/01-ros2/lesson1');
    });
  });
});
