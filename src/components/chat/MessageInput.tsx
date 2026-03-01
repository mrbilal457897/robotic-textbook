/**
 * MessageInput Component
 * Text input field with submit button for chat messages
 */

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

const VALIDATION_LIMITS = {
  MAX_MESSAGE_LENGTH: 2000,
};

export interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export function MessageInput({
  onSend,
  isLoading = false,
  disabled = false,
  placeholder = 'Ask a question about the textbook...',
  maxLength = VALIDATION_LIMITS.MAX_MESSAGE_LENGTH,
  className,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || isLoading || disabled) return;

    await onSend(trimmed);

    setMessage('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars < 100;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white p-3 shadow-sm dark:bg-gray-900',
        disabled && 'opacity-50',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          maxLength={maxLength}
          rows={1}
          className="flex-1 resize-none border-none bg-transparent text-sm focus:outline-none disabled:cursor-not-allowed"
          style={{
            minHeight: '24px',
            maxHeight: '120px',
          }}
        />

        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="shrink-0 rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {isLoading ? (
            <span className="inline-block animate-spin text-base">⏳</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </div>

      {isNearLimit && (
        <div
          className={cn(
            'text-xs',
            remainingChars < 0
              ? 'text-red-600'
              : remainingChars < 50
                ? 'text-yellow-600'
                : 'text-gray-500'
          )}
        >
          {remainingChars < 0
            ? `${Math.abs(remainingChars)} characters over limit`
            : `${remainingChars} characters remaining`}
        </div>
      )}
    </form>
  );
}
