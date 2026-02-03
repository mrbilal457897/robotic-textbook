"""
Pydantic Models for RAG Textbook Chatbot
"""

from .conversation import (
    Conversation,
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
)
from .message import (
    Message,
    MessageCreate,
    MessageResponse,
    Citation,
)
from .chunk import (
    Chunk,
    ChunkMetadata,
    ChunkCreate,
    ChunkSearchResult,
    ChunkBatchResponse,
)
from .chat import (
    ChatRequest,
    ChatResponse,
    ChatError,
    OptimisticLockError,
)

__all__ = [
    # Conversation models
    "Conversation",
    "ConversationCreate",
    "ConversationUpdate",
    "ConversationResponse",
    # Message models
    "Message",
    "MessageCreate",
    "MessageResponse",
    "Citation",
    # Chunk models
    "Chunk",
    "ChunkMetadata",
    "ChunkCreate",
    "ChunkSearchResult",
    "ChunkBatchResponse",
    # Chat models
    "ChatRequest",
    "ChatResponse",
    "ChatError",
    "OptimisticLockError",
]
