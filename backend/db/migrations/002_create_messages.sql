-- Migration: 002_create_messages
-- Description: Create messages table for storing individual chat messages
-- Date: 2026-01-30

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    mode VARCHAR(50) NOT NULL CHECK (mode IN ('book-only', 'selected-text-only', 'general-knowledge')),
    tone VARCHAR(50) CHECK (tone IN ('academic', 'beginner-friendly', 'concise')),

    -- Optional fields for selected-text mode
    selected_text TEXT,
    action VARCHAR(20) CHECK (action IN ('explain', 'summarize', 'example', 'simplify')),

    -- Citations stored as JSONB array
    citations JSONB DEFAULT '[]'::jsonb,

    -- Confidence score for assistant responses
    confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),

    -- Additional metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_content_not_empty CHECK (char_length(content) > 0),
    CONSTRAINT chk_selected_text_length CHECK (
        selected_text IS NULL OR
        (char_length(selected_text) >= 50 AND char_length(selected_text) <= 8000)
    )
);

-- Create index on conversation_id for message retrieval
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- Create index on created_at for ordering messages
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);

-- Create GIN index on citations JSONB for citation queries
CREATE INDEX IF NOT EXISTS idx_messages_citations ON messages USING GIN (citations);

-- Create GIN index on metadata JSONB for flexible queries
CREATE INDEX IF NOT EXISTS idx_messages_metadata ON messages USING GIN (metadata);

-- Add comments for documentation
COMMENT ON TABLE messages IS 'Stores individual messages within conversations';
COMMENT ON COLUMN messages.id IS 'Unique message identifier';
COMMENT ON COLUMN messages.conversation_id IS 'Reference to parent conversation';
COMMENT ON COLUMN messages.role IS 'Message role: user, assistant, or system';
COMMENT ON COLUMN messages.content IS 'Message content text';
COMMENT ON COLUMN messages.mode IS 'Answering mode used for this message';
COMMENT ON COLUMN messages.tone IS 'Response tone (NULL for user messages)';
COMMENT ON COLUMN messages.selected_text IS 'Selected text for highlight-to-ask mode';
COMMENT ON COLUMN messages.action IS 'Action requested on selected text';
COMMENT ON COLUMN messages.citations IS 'Array of citation objects (JSONB)';
COMMENT ON COLUMN messages.confidence_score IS 'Confidence score for assistant responses (0.0-1.0)';
COMMENT ON COLUMN messages.metadata IS 'Additional metadata (tokens used, retrieval stats, etc.)';
