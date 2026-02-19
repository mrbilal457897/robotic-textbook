/**
 * ChatPanel Component
 * Main chat interface with collapsible panel
 */

import * as React from 'react';
import { useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { BookOpen, X, Settings, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ModeSelector } from './ModeSelector';
import { ToneSelector } from './ToneSelector';
import { SourcePreview } from './SourcePreview';
import { useChat } from '../../hooks/useChat';
import { cn } from '../../lib/utils';
import type { Citation } from '../../../shared/types';

export interface ChatPanelProps {
  bookId?: string;
  chapter?: string;
  conversationId?: string;
  defaultOpen?: boolean;
  className?: string;
}

export function ChatPanel({
  bookId,
  chapter,
  conversationId,
  defaultOpen = false,
  className,
}: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [showSourcePreview, setShowSourcePreview] = useState(false);
  const bookIconSrc = useBaseUrl('/img/book.png');

  const { messages, isLoading, error, mode, tone, setMode, setTone, sendMessage, clearError } =
    useChat({
      conversationId,
      bookId,
      chapter,
    });

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
          'fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/25 shadow-lg shadow-black/30 transition-transform hover:scale-110 hover:bg-white/15 hover:border-[#A78BFA]/60',
          className
        )}
        aria-label="Open chat"
      >
        <img
          src={bookIconSrc}
          alt="Textbook Assistant"
          className="h-22 w-22 object-contain drop-shadow-sm"
        />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 z-40 flex h-[500px] w-full flex-col border border-white/10 bg-black/70 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:bottom-6 sm:right-6 sm:h-[540px] sm:w-[22rem] sm:rounded-2xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#A78BFA]" />
          <h2 className="text-sm font-semibold text-white">Textbook Assistant</h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              'rounded-md p-1.5 transition-all hover:bg-white/10',
              showSettings && 'bg-white/10'
            )}
            aria-label="Settings"
          >
            <Settings className="h-4 w-4 text-white/60" />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1.5 transition-all hover:bg-white/10"
            aria-label="Close chat"
          >
            <X className="h-4 w-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-white/10 bg-white/5 p-4">
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
        <MessageList messages={messages} onCitationClick={handleCitationClick} className="h-full" />
      </div>

      {/* Message Input */}
      <div className="border-t border-white/10 p-3">
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
  );
}
