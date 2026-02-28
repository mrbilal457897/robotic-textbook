/**
 * useLanguage Hook
 * Manages language selection and persistence using Docusaurus's built-in i18n
 */

import { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export type SupportedLanguage = 'en' | 'ur' | 'ar' | 'zh' | 'es';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇬🇧',
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    direction: 'rtl',
    flag: '🇵🇰',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    flag: '🇨🇳',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    flag: '🇪🇸',
  },
};

const LANGUAGE_STORAGE_KEY = 'preferredLanguage';
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

interface UseLanguageReturn {
  currentLanguage: SupportedLanguage;
  currentConfig: LanguageConfig;
  availableLanguages: LanguageConfig[];
  switchLanguage: (lang: SupportedLanguage) => void;
  isRTL: boolean;
}

/**
 * Hook for managing language selection and i18n
 * @returns Current language and control functions
 */
export function useLanguage(): UseLanguageReturn {
  const location = useLocation();
  const { i18n } = useDocusaurusContext();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  // Extract language from Docusaurus i18n context
  useEffect(() => {
    const docusaurusLocale = i18n.currentLocale as SupportedLanguage;
    if (Object.keys(SUPPORTED_LANGUAGES).includes(docusaurusLocale)) {
      setCurrentLanguage(docusaurusLocale);

      // Save to localStorage
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, docusaurusLocale);
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    }
  }, [i18n.currentLocale]);

  const switchLanguage = (lang: SupportedLanguage) => {
    if (!Object.keys(SUPPORTED_LANGUAGES).includes(lang)) {
      console.error(`Unsupported language: ${lang}`);
      return;
    }

    // Save preference to localStorage
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }

    // SIMPLIFIED APPROACH: Use window.location.origin and rebuild URL
    const currentPath = window.location.pathname;
    const baseUrl = '/physical-ai-textbook/'; // From docusaurus.config.ts

    // Remove baseUrl from current path to get the page path
    let pagePath = currentPath;
    if (currentPath.startsWith(baseUrl)) {
      pagePath = currentPath.substring(baseUrl.length);
    }

    // Remove current locale from page path if it exists
    const locales = ['en', 'ur', 'ar', 'zh', 'es'];
    for (const locale of locales) {
      if (pagePath.startsWith(`${locale}/`)) {
        pagePath = pagePath.substring(locale.length + 1);
        break;
      } else if (pagePath === locale) {
        pagePath = '';
        break;
      }
    }

    // Build new URL
    let newUrl = window.location.origin + baseUrl;

    // Add locale prefix for non-default languages
    if (lang !== 'en') {
      newUrl += `${lang}/`;
    }

    // Add page path
    newUrl += pagePath;

    // Remove trailing slash if it's not the root
    if (
      newUrl.endsWith('/') &&
      newUrl !== window.location.origin + baseUrl &&
      newUrl !== window.location.origin + baseUrl + `${lang}/`
    ) {
      newUrl = newUrl.slice(0, -1);
    }

    console.log('Switching language:', {
      from: currentLanguage,
      to: lang,
      currentPath,
      pagePath,
      newUrl,
      baseUrl,
    });

    // Navigate to new URL
    window.location.href = newUrl;
  };

  const currentConfig = SUPPORTED_LANGUAGES[currentLanguage];
  const availableLanguages = Object.values(SUPPORTED_LANGUAGES);
  const isRTL = currentConfig.direction === 'rtl';

  return {
    currentLanguage,
    currentConfig,
    availableLanguages,
    switchLanguage,
    isRTL,
  };
}
