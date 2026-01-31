/**
 * ChatPanel Component
 * Main chat interface with collapsible panel
 */

import * as React from "react";
import { useState } from "react";
import { MessageCircle, X, Settings, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ModeSelector } from "./ModeSelector";
import { ToneSelector } from "./ToneSelector";
import { SourcePreview } from "./SourcePreview";
import { useChat } from "../../hooks/useChat";
import { cn } from "../../lib/utils";
import type { Citation } from "../../../../shared/types";

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

  const {
    messages,
    isLoading,
    error,
    mode,
    tone,
    setMode,
    setTone,
    sendMessage,
    clearError,
  } = useChat({
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
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-blue-700",
          className
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-40 flex h-[600px] w-full flex-col bg-white shadow-2xl dark:bg-gray-950 sm:bottom-6 sm:right-6 sm:h-[700px] sm:w-96 sm:rounded-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            Textbook Assistant
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
              showSettings && "bg-gray-100 dark:bg-gray-800"
            )}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close chat"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-4">
            <ModeSelector mode={mode} onChange={setMode} />
            <ToneSelector tone={tone} onChange={setTone} />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="border-b border-gray-200 bg-red-50 p-4 dark:border-gray-800 dark:bg-red-950">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error.message}
              </p>
            </div>
            <button
              onClick={clearError}
              className="shrink-0 rounded-md p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          onCitationClick={handleCitationClick}
          className="h-full"
        />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <MessageInput
          onSend={sendMessage}
          isLoading={isLoading}
          placeholder={
            mode === "selected-text-only"
              ? "Highlight text first, then ask..."
              : "Ask a question about the textbook..."
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
