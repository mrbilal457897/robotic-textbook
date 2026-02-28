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
        'flex flex-col gap-2 rounded-lg border bg-white p-3 shadow-sm transition-shadow dark:bg-gray-900',
        isFocused && 'ring-2 ring-blue-500 ring-offset-2',
        disabled && 'opacity-50',
        className
      )}
    >
      <div className="flex items-end gap-2">
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
          className="shrink-0 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳' : '📤'}
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

      <div className="text-xs text-gray-500">
        Press <kbd className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">Enter</kbd> to send,{' '}
        <kbd className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">Shift+Enter</kbd> for new
        line
      </div>
    </form>
  );
}
