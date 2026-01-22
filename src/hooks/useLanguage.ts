/**
 * useLanguage Hook
 * Manages language selection and persistence
 */

import { useEffect, useState } from "react";
import { useLocation } from "@docusaurus/router";

export type SupportedLanguage = "en" | "ur" | "ar" | "zh" | "es";

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  flag: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    flag: "🇬🇧",
  },
  ur: {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    direction: "rtl",
    flag: "🇵🇰",
  },
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    flag: "🇸🇦",
  },
  zh: {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    direction: "ltr",
    flag: "🇨🇳",
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    flag: "🇪🇸",
  },
};

const LANGUAGE_STORAGE_KEY = "preferredLanguage";
const DEFAULT_LANGUAGE: SupportedLanguage = "en";

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
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  // Extract language from URL path
  useEffect(() => {
    const extractLanguageFromPath = (): SupportedLanguage => {
      const pathSegments = location.pathname.split("/").filter(Boolean);

      // Check if first segment is a valid language code
      if (pathSegments.length > 0) {
        const potentialLang = pathSegments[0] as SupportedLanguage;
        if (Object.keys(SUPPORTED_LANGUAGES).includes(potentialLang)) {
          return potentialLang;
        }
      }

      // Check localStorage for saved preference
      try {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored && Object.keys(SUPPORTED_LANGUAGES).includes(stored)) {
          return stored as SupportedLanguage;
        }
      } catch (error) {
        console.error("Failed to read language preference:", error);
      }

      return DEFAULT_LANGUAGE;
    };

    const detectedLang = extractLanguageFromPath();
    setCurrentLanguage(detectedLang);
  }, [location.pathname]);

  const switchLanguage = (lang: SupportedLanguage) => {
    if (!Object.keys(SUPPORTED_LANGUAGES).includes(lang)) {
      console.error(`Unsupported language: ${lang}`);
      return;
    }

    // Save preference to localStorage
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }

    // Build new URL with language prefix
    const currentPath = location.pathname;
    const pathSegments = currentPath.split("/").filter(Boolean);

    // Remove current language prefix if exists
    if (
      pathSegments.length > 0 &&
      Object.keys(SUPPORTED_LANGUAGES).includes(pathSegments[0])
    ) {
      pathSegments.shift();
    }

    // Add new language prefix (except for default language)
    let newPath = "/";
    if (lang !== DEFAULT_LANGUAGE) {
      newPath += `${lang}/`;
    }
    newPath += pathSegments.join("/");

    // Navigate to new URL
    window.location.href = newPath;
  };

  const currentConfig = SUPPORTED_LANGUAGES[currentLanguage];
  const availableLanguages = Object.values(SUPPORTED_LANGUAGES);
  const isRTL = currentConfig.direction === "rtl";

  return {
    currentLanguage,
    currentConfig,
    availableLanguages,
    switchLanguage,
    isRTL,
  };
}
