-- Migration: 001_create_conversations
-- Description: Create conversations table for storing chat conversations
-- Date: 2026-01-30

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id VARCHAR(100),
    title VARCHAR(500),
    mode VARCHAR(50) NOT NULL CHECK (mode IN ('book-only', 'selected-text-only', 'general-knowledge')),
    tone VARCHAR(50) NOT NULL DEFAULT 'academic' CHECK (tone IN ('academic', 'beginner-friendly', 'concise')),
    message_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT chk_message_count_positive CHECK (message_count >= 0)
);

-- Create index on user_id for faster user conversation lookups
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);

-- Create index on book_id for book-specific queries
CREATE INDEX IF NOT EXISTS idx_conversations_book_id ON conversations(book_id) WHERE book_id IS NOT NULL;

-- Create index on expires_at for cleanup job
CREATE INDEX IF NOT EXISTS idx_conversations_expires_at ON conversations(expires_at) WHERE expires_at IS NOT NULL;

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trg_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_conversations_updated_at();

-- Add comments for documentation
COMMENT ON TABLE conversations IS 'Stores chat conversations between users and the RAG chatbot';
COMMENT ON COLUMN conversations.id IS 'Unique conversation identifier';
COMMENT ON COLUMN conversations.user_id IS 'ID of the user who created the conversation';
COMMENT ON COLUMN conversations.book_id IS 'Optional book identifier if conversation is book-specific';
COMMENT ON COLUMN conversations.title IS 'Conversation title (auto-generated from first message or user-defined)';
COMMENT ON COLUMN conversations.mode IS 'Answering mode: book-only, selected-text-only, or general-knowledge';
COMMENT ON COLUMN conversations.tone IS 'Response tone: academic, beginner-friendly, or concise';
COMMENT ON COLUMN conversations.message_count IS 'Number of messages in this conversation';
COMMENT ON COLUMN conversations.expires_at IS 'Expiration timestamp for anonymous sessions (NULL for authenticated users)';
