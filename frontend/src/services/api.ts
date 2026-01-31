/**
 * API Client for RAG Textbook Chatbot
 * Handles all backend communication with error handling and type safety
 */

import type {
  ChatRequest,
  ChatResponse,
  ConversationDetailResponse,
  ConversationListResponse,
  APIError,
} from "../../../shared/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * API Error class with structured error information
 */
export class APIClientError extends Error {
  constructor(
    public status: number,
    public error: string,
    public details?: Record<string, any>
  ) {
    super(error);
    this.name = "APIClientError";
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Include cookies for session management
  });

  if (!response.ok) {
    const errorData: APIError = await response.json().catch(() => ({
      error: "UNKNOWN_ERROR",
      message: response.statusText,
      status_code: response.status,
    }));

    throw new APIClientError(
      response.status,
      errorData.message,
      errorData.details
    );
  }

  return response.json();
}

/**
 * Chat API: Send a message and get a response
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  return apiFetch<ChatResponse>("/api/v1/chat", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

/**
 * Conversations API: Get conversation details with messages
 */
export async function getConversation(
  conversationId: string,
  includeMessages = true,
  messageLimit = 50
): Promise<ConversationDetailResponse> {
  const params = new URLSearchParams({
    include_messages: includeMessages.toString(),
    message_limit: messageLimit.toString(),
  });

  return apiFetch<ConversationDetailResponse>(
    `/api/v1/conversations/${conversationId}?${params}`
  );
}

/**
 * Conversations API: List user's conversations
 */
export async function listConversations(
  bookId?: string,
  limit = 20,
  offset = 0
): Promise<ConversationListResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (bookId) {
    params.append("book_id", bookId);
  }

  return apiFetch<ConversationListResponse>(
    `/api/v1/conversations?${params}`
  );
}

/**
 * Conversations API: Delete a conversation
 */
export async function deleteConversation(
  conversationId: string
): Promise<void> {
  return apiFetch<void>(`/api/v1/conversations/${conversationId}`, {
    method: "DELETE",
  });
}

/**
 * Health Check: Verify API is reachable
 */
export async function healthCheck(): Promise<{ status: string }> {
  return apiFetch<{ status: string }>("/api/health");
}
