-- Migration: 004_add_chapter_id_and_status
-- Description: Add chapter_id and status columns to conversations table
-- Date: 2026-02-28

-- Add chapter_id column (nullable for backward compatibility)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'conversations' AND column_name = 'chapter_id'
    ) THEN
        ALTER TABLE conversations ADD COLUMN chapter_id INTEGER;
    END IF;
END $$;

-- Add status column with default value
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'conversations' AND column_name = 'status'
    ) THEN
        ALTER TABLE conversations ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active';
    END IF;
END $$;

-- Add constraint for status values (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_conversation_status'
    ) THEN
        ALTER TABLE conversations
        ADD CONSTRAINT chk_conversation_status
        CHECK (status IN ('active', 'archived', 'expired'));
    END IF;
END $$;

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_conversations_status
ON conversations(status) WHERE status != 'active';

-- Update existing rows to have active status (if needed)
UPDATE conversations
SET status = 'active'
WHERE status IS NULL OR status = '';

-- Add comments
COMMENT ON COLUMN conversations.chapter_id IS 'Current chapter ID that user is viewing';
COMMENT ON COLUMN conversations.status IS 'Conversation status: active, archived, or expired';
