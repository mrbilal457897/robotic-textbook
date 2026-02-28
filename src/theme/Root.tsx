/**
 * Root Component
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * This component wraps the entire application and provides:
 * - Cookie consent management
 * - Global context providers
 * - Text selection highlighting with AI actions
 */

import React, { useState, useRef, useCallback } from 'react';
import { CookieConsentBanner } from '../components/CookieConsent/Banner';
import { PreferencesModal } from '../components/CookieConsent/PreferencesModal';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { ChatPanel } from '../components/chat/ChatPanel';
import { SelectionToolbar } from '../components/highlight/SelectionToolbar';
import { useTextSelection } from '../hooks/useTextSelection';
import { ThemeProvider } from '../lib/theme/ThemeContext';
import BackToTop from '../components/BackToTop';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  const { showBanner, preferences, savePreferences, resetPreferences } = useCookieConsent();
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<{
    text: string;
    selectedText?: string;
    action?: 'explain' | 'summarize' | 'example' | 'simplify';
  } | null>(null);

  // Text selection for highlight-to-ask feature
  const { selection, clearSelection } = useTextSelection({
    minLength: 10,
    maxLength: 8000,
  });

  // Handle selection toolbar actions
  const handleSelectionAction = useCallback(
    (action: 'explain' | 'summarize' | 'example' | 'simplify', text: string) => {
      // Format the message based on the action
      let message = '';
      switch (action) {
        case 'explain':
          message = `Explain this text:\n\n"${text}"`;
          break;
        case 'summarize':
          message = `Summarize this text:\n\n"${text}"`;
          break;
        case 'example':
          message = `Provide examples for:\n\n"${text}"`;
          break;
        case 'simplify':
          message = `Simplify this text:\n\n"${text}"`;
          break;
      }

      // Set the initial message with selected text and action
      setInitialMessage({
        text: message,
        selectedText: text,
        action,
      });

      // Open the chat panel
      setChatOpen(true);

      // Clear the selection after a brief delay
      setTimeout(() => {
        clearSelection();
      }, 100);
    },
    [clearSelection]
  );

  return (
    <ThemeProvider>
      {children}

      {/* Text Selection Toolbar */}
      <SelectionToolbar
        selection={selection}
        onAction={handleSelectionAction}
        onClose={clearSelection}
      />

      {/* Chat Panel */}
      <ChatPanel
        defaultOpen={chatOpen}
        initialMessage={initialMessage}
        onClose={() => {
          setChatOpen(false);
          setInitialMessage(null);
        }}
      />

      {/* Back to Top Button */}
      <BackToTop />

      {/* Cookie Consent */}
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
