/**
 * Shared TypeScript types for RAG Textbook Chatbot
 * Used by both frontend and backend API contracts
 */

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  id: string;
  email?: string;
  name?: string;
  provider?: 'github' | 'google' | 'anonymous';
  created_at: string;
}

export interface Session {
  session_id: string;
  user_id: string;
  expires_at: string;
  is_anonymous: boolean;
}

// ============================================
// Chat & Message Types
// ============================================

export type AnsweringMode = 'book-only' | 'selected-text-only' | 'general-knowledge';

export type ToneType = 'academic' | 'beginner-friendly' | 'concise';

export type TextAction = 'explain' | 'summarize' | 'example' | 'simplify';

export interface KeyTerm {
  term: string;
  matched_text: string;
  definition: string;
  category: string;
  start_pos: number;
  end_pos: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  mode: AnsweringMode;
  tone?: ToneType;
  citations?: Citation[];
  confidence_score?: number;
  selected_text?: string;
  action?: TextAction;
  key_terms?: KeyTerm[];
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  book_id?: string;
  title?: string;
  mode: AnsweringMode;
  tone: ToneType;
  message_count: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

// ============================================
// Citation & Source Types
// ============================================

export interface Citation {
  chunk_id: string;
  book_id: string;
  chapter: string;
  section?: string;
  page?: number;
  start_char?: number;
  end_char?: number;
  text: string;
  confidence_score: number;
  metadata?: ChunkMetadata;
}

export interface ChunkMetadata {
  book_title?: string;
  authors?: string[];
  chapter_title?: string;
  section_title?: string;
  subsection_title?: string;
  url?: string;
}

export interface SourcePreview {
  citation: Citation;
  context_before?: string;
  context_after?: string;
  full_paragraph?: string;
}

// ============================================
// API Request/Response Types
// ============================================

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  mode: AnsweringMode;
  tone?: ToneType;
  selected_text?: string;
  action?: TextAction;
  book_id: string;
  chapter_id?: number;
}

export interface ChatResponse {
  conversation_id: string;
  message: Message;
  should_create_new_conversation: boolean;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  per_page: number;
}

export interface ConversationDetailResponse {
  conversation: Conversation;
  messages: Message[];
}

// ============================================
// Error Types
// ============================================

export interface APIError {
  error: string;
  message: string;
  details?: Record<string, any>;
  status_code: number;
}

// ============================================
// Ingestion Types (Backend only, but shared schema)
// ============================================

export interface BookMetadata {
  book_id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publication_year?: number;
  isbn?: string;
  language: string;
  total_pages?: number;
  total_chapters?: number;
  created_at: string;
}

export interface ChunkIngestionRequest {
  book_id: string;
  chunks: ChunkData[];
}

export interface ChunkData {
  text: string;
  chapter: string;
  section?: string;
  page?: number;
  start_char?: number;
  end_char?: number;
  metadata?: ChunkMetadata;
}

// ============================================
// Validation Constants
// ============================================

export const VALIDATION_LIMITS = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_SELECTED_TEXT_LENGTH: 8000,
  MIN_SELECTED_TEXT_LENGTH: 50,
  MAX_CONVERSATION_MESSAGES: 100,
  MIN_CONFIDENCE_THRESHOLD: 0.7,
} as const;

// ============================================
// Type Guards
// ============================================

export function isValidMode(mode: string): mode is AnsweringMode {
  return ['book-only', 'selected-text-only', 'general-knowledge'].includes(mode);
}

export function isValidTone(tone: string): tone is ToneType {
  return ['academic', 'beginner-friendly', 'concise'].includes(tone);
}

export function isValidAction(action: string): action is TextAction {
  return ['explain', 'summarize', 'example', 'simplify'].includes(action);
}
