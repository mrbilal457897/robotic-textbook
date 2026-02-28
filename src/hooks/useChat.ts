/**
 * useChat Hook
 * Manages chat state, message history, and API communication
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  Message,
  AnsweringMode,
  ToneType,
  TextAction,
  ChatRequest,
  ChatResponse,
  ConversationDetailResponse,
} from '../../shared/types';
import { apiFetch, APIClientError } from '../config/api';

export interface UseChatOptions {
  conversationId?: string;
  bookId?: string;
  chapter?: string;
  initialMode?: AnsweringMode;
  initialTone?: ToneType;
  onError?: (error: Error) => void;
}

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  conversationId: string | null;
  mode: AnsweringMode;
  tone: ToneType;
  setMode: (mode: AnsweringMode) => void;
  setTone: (tone: ToneType) => void;
  sendMessage: (message: string, selectedText?: string, action?: TextAction) => Promise<void>;
  clearError: () => void;
  lastUpdatedAt: string | null;
}

/**
 * Send a chat message to the API
 */
async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  return apiFetch<ChatResponse>('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Get conversation details with messages
 */
async function getConversation(
  conversationId: string,
  includeMessages = true,
  messageLimit = 50
): Promise<ConversationDetailResponse> {
  const params = new URLSearchParams({
    include_messages: includeMessages.toString(),
    message_limit: messageLimit.toString(),
  });

  return apiFetch<ConversationDetailResponse>(`/api/v1/conversations/${conversationId}?${params}`);
}

/**
 * Chat state management hook with optimistic locking support
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    conversationId: initialConversationId,
    bookId = 'physical-ai-robotics',
    chapter,
    initialMode = 'book-only',
    initialTone = 'academic',
    onError,
  } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId || null
  );
  const [mode, setMode] = useState<AnsweringMode>(initialMode);
  const [tone, setTone] = useState<ToneType>(initialTone);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadConversationHistory(conversationId);
    }
  }, [conversationId]);

  const loadConversationHistory = useCallback(
    async (convId: string) => {
      try {
        setIsLoading(true);
        const response = await getConversation(convId, true, 50);

        if (!isMounted.current) return;

        setMessages(response.messages);
        setLastUpdatedAt(response.conversation.updated_at);
      } catch (err) {
        if (!isMounted.current) return;

        const error = err instanceof Error ? err : new Error('Failed to load conversation');
        setError(error);
        onError?.(error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [onError]
  );

  const sendMessage = useCallback(
    async (message: string, selectedText?: string, action?: TextAction) => {
      if (!message.trim()) return;

      const optimisticUserMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId || '',
        role: 'user',
        content: message,
        mode,
        tone,
        selected_text: selectedText,
        action,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, optimisticUserMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const request: ChatRequest = {
          message,
          conversation_id: conversationId || undefined,
          mode,
          tone,
          selected_text: selectedText,
          action,
          book_id: bookId,
          chapter_id: chapter ? parseInt(chapter, 10) || undefined : undefined,
        };

        const response = await sendChatMessage(request);

        if (!isMounted.current) return;

        if (!conversationId) {
          setConversationId(response.conversation_id);
        }

        setMessages(prev => [
          ...prev.filter(m => m.id !== optimisticUserMessage.id),
          {
            ...optimisticUserMessage,
            id: optimisticUserMessage.id,
            conversation_id: response.conversation_id,
          },
          response.message,
        ]);

        setLastUpdatedAt(response.message.created_at);
      } catch (err) {
        if (!isMounted.current) return;

        setMessages(prev => prev.filter(m => m.id !== optimisticUserMessage.id));

        let error: Error;

        if (err instanceof APIClientError) {
          if (err.status === 409) {
            error = new Error('Conversation was updated in another tab. Refreshing...');
            if (conversationId) {
              loadConversationHistory(conversationId);
            }
          } else if (err.status === 429) {
            error = new Error(
              'Rate limit exceeded. Please wait a moment before sending another message.'
            );
          } else {
            error = new Error(err.error || 'Failed to send message');
          }
        } else {
          error = err instanceof Error ? err : new Error('Failed to send message');
        }

        setError(error);
        onError?.(error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [conversationId, mode, tone, bookId, chapter, onError, loadConversationHistory]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleSetMode = useCallback((newMode: AnsweringMode) => {
    setMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbot-mode', newMode);
    }
  }, []);

  const handleSetTone = useCallback((newTone: ToneType) => {
    setTone(newTone);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbot-tone', newTone);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('chatbot-mode') as AnsweringMode | null;
      const savedTone = localStorage.getItem('chatbot-tone') as ToneType | null;

      if (
        savedMode &&
        ['book-only', 'selected-text-only', 'general-knowledge'].includes(savedMode)
      ) {
        setMode(savedMode);
      }

      if (savedTone && ['academic', 'beginner-friendly', 'concise'].includes(savedTone)) {
        setTone(savedTone);
      }
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    conversationId,
    mode,
    tone,
    setMode: handleSetMode,
    setTone: handleSetTone,
    sendMessage,
    clearError,
    lastUpdatedAt,
  };
}
