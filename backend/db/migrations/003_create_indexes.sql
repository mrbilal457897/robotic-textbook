-- Migration: 003_create_indexes
-- Description: Create additional indexes for performance optimization
-- Date: 2026-01-30

-- Composite index for conversation + user queries (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_conversations_user_created
    ON conversations(user_id, created_at DESC);

-- Composite index for message retrieval ordered by time
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
    ON messages(conversation_id, created_at ASC);

-- Index for finding conversations that need cleanup
CREATE INDEX IF NOT EXISTS idx_conversations_expired
    ON conversations(expires_at)
    WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP;

-- Index for finding recent conversations by mode
CREATE INDEX IF NOT EXISTS idx_conversations_mode_created
    ON conversations(mode, created_at DESC);

-- Partial index for assistant messages (for analytics)
CREATE INDEX IF NOT EXISTS idx_messages_assistant_confidence
    ON messages(confidence_score, created_at DESC)
    WHERE role = 'assistant' AND confidence_score IS NOT NULL;

-- Index for finding conversations with low confidence responses
CREATE INDEX IF NOT EXISTS idx_messages_low_confidence
    ON messages(conversation_id, confidence_score)
    WHERE role = 'assistant' AND confidence_score < 0.75;

-- Index for citation analysis (messages with citations)
CREATE INDEX IF NOT EXISTS idx_messages_with_citations
    ON messages(conversation_id, created_at)
    WHERE citations IS NOT NULL AND jsonb_array_length(citations) > 0;

-- Add comments
COMMENT ON INDEX idx_conversations_user_created IS 'Optimizes user conversation list queries';
COMMENT ON INDEX idx_messages_conversation_created IS 'Optimizes message retrieval within conversations';
COMMENT ON INDEX idx_conversations_expired IS 'Optimizes cleanup job for expired conversations';
COMMENT ON INDEX idx_messages_assistant_confidence IS 'Enables confidence score analytics';
COMMENT ON INDEX idx_messages_low_confidence IS 'Identifies conversations needing review';
COMMENT ON INDEX idx_messages_with_citations IS 'Optimizes citation-based queries';
