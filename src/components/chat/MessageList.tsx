/**
 * MessageList Component
 * Displays chat message history with citations
 */

import * as React from 'react';
import { useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../lib/utils';
import { CitationBadge } from './CitationBadge';
import { GlossaryTooltip } from './GlossaryTooltip';
import type { Message, Citation, KeyTerm } from '../../../shared/types';

export interface MessageListProps {
  messages: Message[];
  onCitationClick?: (citation: Citation) => void;
  className?: string;
}

const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const formatConfidence = (score: number): string => {
  return `${Math.round(score * 100)}%`;
};

const getConfidenceColor = (score: number): string => {
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

export function MessageList({ messages, onCitationClick, className }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-4 p-8 text-center', className)}
      >
        <div className="text-6xl">🤖</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No messages yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ask a question about the textbook to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4 overflow-y-auto p-4', className)}>
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} onCitationClick={onCitationClick} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  onCitationClick?: (citation: Citation) => void;
}

function parseSourceSections(
  content: string
): Array<{ type: 'textbook' | 'general' | 'default'; content: string }> {
  const sections: Array<{ type: 'textbook' | 'general' | 'default'; content: string }> = [];

  const hasTextbookLabel = content.includes('**[Textbook]**');
  const hasGeneralLabel = content.includes('**[General Knowledge]**');

  if (!hasTextbookLabel && !hasGeneralLabel) {
    return [{ type: 'default', content }];
  }

  const parts = content.split(/(?=\*\*\[(?:Textbook|General Knowledge)\]\*\*)/);

  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    if (trimmedPart.startsWith('**[Textbook]**')) {
      const contentOnly = trimmedPart
        .replace(/^\*\*\[Textbook\]\*\*\n*/, '')
        .replace(/\n*---\n*$/, '')
        .trim();
      if (contentOnly) {
        sections.push({ type: 'textbook', content: contentOnly });
      }
    } else if (trimmedPart.startsWith('**[General Knowledge]**')) {
      const contentOnly = trimmedPart
        .replace(/^\*\*\[General Knowledge\]\*\*\n*/, '')
        .replace(/\n*---\n*$/, '')
        .trim();
      if (contentOnly) {
        sections.push({ type: 'general', content: contentOnly });
      }
    } else {
      sections.push({ type: 'default', content: trimmedPart });
    }
  }

  return sections;
}

function highlightKeyTerms(content: string, keyTerms?: KeyTerm[]): React.ReactNode {
  if (!keyTerms || keyTerms.length === 0) {
    return content;
  }

  const sortedTerms = [...keyTerms].sort((a, b) => a.start_pos - b.start_pos);
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedTerms.forEach((term, index) => {
    if (term.start_pos > lastIndex) {
      elements.push(
        <span key={`text-${index}`}>{content.substring(lastIndex, term.start_pos)}</span>
      );
    }

    elements.push(
      <GlossaryTooltip key={`term-${index}`} term={term}>
        {term.matched_text}
      </GlossaryTooltip>
    );

    lastIndex = term.end_pos;
  });

  if (lastIndex < content.length) {
    elements.push(<span key="text-final">{content.substring(lastIndex)}</span>);
  }

  return <>{elements}</>;
}

function MarkdownWithGlossary({ content, keyTerms }: { content: string; keyTerms?: KeyTerm[] }) {
  if (!keyTerms || keyTerms.length === 0) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
  }

  const contentWithHighlights = useMemo(() => {
    return highlightKeyTerms(content, keyTerms);
  }, [content, keyTerms]);

  return (
    <div className="markdown-content">
      {typeof contentWithHighlights === 'string' ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentWithHighlights}</ReactMarkdown>
      ) : (
        contentWithHighlights
      )}
    </div>
  );
}

function MessageBubble({ message, onCitationClick }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>⚠️</span>
        <span>{message.content}</span>
      </div>
    );
  }

  const sourceSections = !isUser ? parseSourceSections(message.content) : [];
  const hasMultipleSources =
    sourceSections.length > 1 && sourceSections.some(s => s.type !== 'default');

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        )}
      >
        {isUser ? '👤' : '🤖'}
      </div>

      <div className={cn('flex max-w-[80%] flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
        {hasMultipleSources ? (
          <div className="flex w-full flex-col gap-3">
            {sourceSections.map((section, index) => {
              const isTextbook = section.type === 'textbook';
              const isGeneral = section.type === 'general';

              return (
                <div
                  key={index}
                  className={cn(
                    'rounded-lg px-4 py-3',
                    isTextbook && 'border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30',
                    isGeneral && 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30',
                    !isTextbook && !isGeneral && 'bg-gray-100 dark:bg-gray-800'
                  )}
                >
                  {(isTextbook || isGeneral) && (
                    <div
                      className={cn(
                        'mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide',
                        isTextbook && 'text-green-700 dark:text-green-400',
                        isGeneral && 'text-blue-700 dark:text-blue-400'
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          isTextbook && 'bg-green-500',
                          isGeneral && 'bg-blue-500'
                        )}
                      />
                      {isTextbook ? 'Textbook' : 'General Knowledge'}
                    </div>
                  )}

                  <div
                    className={cn(
                      'prose prose-sm dark:prose-invert max-w-none',
                      isTextbook && 'prose-green',
                      isGeneral && 'prose-blue'
                    )}
                  >
                    <MarkdownWithGlossary content={section.content} keyTerms={message.key_terms} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={cn(
              'rounded-lg px-4 py-2',
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
            )}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <MarkdownWithGlossary content={message.content} keyTerms={message.key_terms} />
              </div>
            )}
          </div>
        )}

        {!isUser && (
          <div className="flex flex-wrap items-center gap-2 px-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatRelativeTime(message.created_at)}</span>

            {message.mode && (
              <>
                <span>•</span>
                <span className="capitalize">{message.mode.replace('-', ' ')}</span>
              </>
            )}

            {message.confidence_score !== undefined && (
              <>
                <span>•</span>
                <span className={getConfidenceColor(message.confidence_score)}>
                  {formatConfidence(message.confidence_score)} confidence
                </span>
              </>
            )}
          </div>
        )}

        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2">
            {message.citations.map((citation, index) => (
              <CitationBadge
                key={`${citation.chunk_id}-${index}`}
                citation={citation}
                index={index}
                onClick={onCitationClick}
              />
            ))}
          </div>
        )}

        {isUser && message.selected_text && (
          <div className="flex items-start gap-2 rounded-md bg-yellow-50 px-3 py-2 text-xs dark:bg-yellow-950">
            <div className="font-medium text-yellow-900 dark:text-yellow-100">Selected text:</div>
            <div className="flex-1 italic text-yellow-800 dark:text-yellow-200">
              "{message.selected_text.substring(0, 100)}
              {message.selected_text.length > 100 && '...'}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
