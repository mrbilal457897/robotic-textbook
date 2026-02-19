/**
 * Root Component
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * This component wraps the entire application and provides:
 * - Cookie consent management
 * - Global context providers
 */

import React, { useState } from 'react';
import { CookieConsentBanner } from '../components/CookieConsent/Banner';
import { PreferencesModal } from '../components/CookieConsent/PreferencesModal';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { ChatPanel } from '../components/chat/ChatPanel';
import { ThemeProvider } from '../lib/theme/ThemeContext';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  const { showBanner, preferences, savePreferences, resetPreferences } = useCookieConsent();
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  return (
    <ThemeProvider>
      {children}
      <ChatPanel defaultOpen={false} />
      {showBanner && (
        <CookieConsentBanner
          onAcceptAll={() => {
            savePreferences({
              essential: true,
              analytics: true,
              preferences: true,
            });
          }}
          onRejectNonEssential={() => {
            savePreferences({
              essential: true,
              analytics: false,
              preferences: false,
            });
          }}
          onCustomize={() => {
            setShowPreferencesModal(true);
          }}
        />
      )}
      {showPreferencesModal && (
        <PreferencesModal
          currentPreferences={preferences}
          onSave={prefs => {
            savePreferences(prefs);
            setShowPreferencesModal(false);
          }}
          onClose={() => setShowPreferencesModal(false)}
        />
      )}
    </ThemeProvider>
  );
}
