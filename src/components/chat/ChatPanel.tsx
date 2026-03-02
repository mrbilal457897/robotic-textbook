/**
 * ChatPanel Component
 * Main chat interface with collapsible panel
 */

import * as React from 'react';
import { useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { X, Settings, AlertCircle } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ModeSelector } from './ModeSelector';
import { ToneSelector } from './ToneSelector';
import { SourcePreview } from './SourcePreview';
import { useChat } from '../../hooks/useChat';
import { cn } from '../../lib/utils';
import type { Citation } from '../../../shared/types';
import styles from './ChatPanel.module.css';

export interface ChatPanelProps {
  bookId?: string;
  chapter?: string;
  conversationId?: string;
  defaultOpen?: boolean;
  initialMessage?: {
    text: string;
    selectedText?: string;
    action?: 'explain' | 'summarize' | 'example' | 'simplify';
  } | null;
  onClose?: () => void;
  className?: string;
}

export function ChatPanel({
  bookId,
  chapter,
  conversationId,
  defaultOpen = false,
  initialMessage = null,
  onClose,
  className,
}: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [showSourcePreview, setShowSourcePreview] = useState(false);
  const bookIconSrc = useBaseUrl('/img/book.png');
  const lastInitialMessageRef = React.useRef<string | null>(null);

  const { messages, isLoading, error, mode, tone, setMode, setTone, sendMessage, clearError } =
    useChat({
      conversationId,
      bookId,
      chapter,
    });

  // Sync with parent's defaultOpen prop changes
  React.useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  // Handle closing chat
  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    lastInitialMessageRef.current = null; // Reset to allow re-sending on next open
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Prevent body scroll when chat is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Auto-send initial message when provided (only once per unique message)
  React.useEffect(() => {
    if (initialMessage && isOpen) {
      const messageKey = `${initialMessage.text}-${initialMessage.selectedText}`;
      if (lastInitialMessageRef.current !== messageKey) {
        lastInitialMessageRef.current = messageKey;
        sendMessage(initialMessage.text, initialMessage.selectedText, initialMessage.action);
      }
    }
  }, [initialMessage, isOpen, sendMessage]);

  const handleCitationClick = (citation: Citation) => {
    setSelectedCitation(citation);
    setShowSourcePreview(true);
  };

  const handleNavigateToSource = (citation: Citation) => {
    // Build URL to navigate to the source
    const url = citation.metadata?.url || `/textbook/${bookId}/chapter-${citation.chapter}`;

    // Navigate to the source
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/25 shadow-lg shadow-black/30 transition-transform hover:scale-110 hover:bg-white/15 hover:border-[#A78BFA]/60',
          'sm:bottom-6 sm:right-6 sm:h-14 sm:w-14',
          className
        )}
        style={{ zIndex: 9997 }}
        aria-label="Open chat"
      >
        <img
          src={bookIconSrc}
          alt="Textbook Assistant"
          className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-sm"
        />
      </button>
    );
  }

  return (
    <>
      {/* Backdrop Overlay - Click to close */}
      <div className={styles.backdrop} onClick={() => handleClose()} aria-hidden="true" />

      {/* Chat Panel */}
      <div
        className={cn(
          styles.chatPanel,
          // Mobile: full width with margins
          'fixed bottom-4 right-4 left-4 z-40 flex flex-col shadow-2xl shadow-black/60',
          'h-[85vh] max-h-[600px] rounded-2xl',
          // Desktop: fixed width, no left positioning
          'sm:left-auto sm:bottom-6 sm:right-6 sm:h-[480px] sm:w-[20rem]',
          'md:h-[520px] md:w-[22rem]',
          'lg:h-[550px] lg:w-[24rem]',
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn(styles.chatHeader, 'flex items-center justify-between px-4 py-3')}>
          <div className="flex items-center gap-2">
            <img
              src={bookIconSrc}
              alt="Textbook"
              className="h-7 w-7 object-contain drop-shadow-sm"
            />
            <h2 className={styles.chatTitle}>Textbook Assistant</h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              className={cn(styles.settingsButton, showSettings && styles.active)}
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              className={styles.closeButton}
              aria-label="Close chat"
              title="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={cn(styles.settingsPanel, 'p-4')}>
            <div className="space-y-4">
              <ModeSelector mode={mode} onChange={setMode} />
              <ToneSelector tone={tone} onChange={setTone} />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="border-b border-white/10 bg-red-500/10 p-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div className="flex-1">
                <p className="text-xs font-medium text-red-300">{error.message}</p>
              </div>
              <button
                onClick={clearError}
                className="shrink-0 rounded-md p-1 text-red-400 hover:bg-red-500/20"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Message List */}
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onCitationClick={handleCitationClick}
            className="h-full"
          />
        </div>

        {/* Message Input */}
        <div className={cn(styles.inputContainer, 'p-3')}>
          <MessageInput
            onSend={sendMessage}
            isLoading={isLoading}
            placeholder={
              mode === 'selected-text-only'
                ? 'Highlight text first, then ask...'
                : 'Ask a question about the textbook...'
            }
          />
        </div>

        {/* Source Preview Modal */}
        <SourcePreview
          citation={selectedCitation}
          isOpen={showSourcePreview}
          onClose={() => {
            setShowSourcePreview(false);
            setSelectedCitation(null);
          }}
          onNavigateToSource={handleNavigateToSource}
        />
      </div>
    </>
  );
}
