/**
 * Unit tests for ChatPanel component
 * Tests UI interactions, state management, and integration with useChat hook
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatPanel } from "../../src/components/chat/ChatPanel";
import type { Message, Citation } from "../../../shared/types";

// Mock child components
vi.mock("../../src/components/chat/MessageList", () => ({
  MessageList: ({ messages, onCitationClick }: any) => (
    <div data-testid="message-list">
      {messages.map((msg: Message) => (
        <div key={msg.id} data-testid={`message-${msg.role}`}>
          {msg.content}
          {msg.citations?.map((citation: Citation, idx: number) => (
            <button
              key={idx}
              onClick={() => onCitationClick(citation)}
              data-testid={`citation-${idx}`}
            >
              Citation {idx + 1}
            </button>
          ))}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../src/components/chat/MessageInput", () => ({
  MessageInput: ({ onSend, isLoading, placeholder }: any) => (
    <div data-testid="message-input">
      <input
        type="text"
        placeholder={placeholder}
        disabled={isLoading}
        data-testid="input-field"
        onChange={(e) => {
          if (e.target.value === "SUBMIT") {
            onSend("Test message");
          }
        }}
      />
    </div>
  ),
}));

vi.mock("../../src/components/chat/ModeSelector", () => ({
  ModeSelector: ({ mode, onChange }: any) => (
    <div data-testid="mode-selector">
      <button onClick={() => onChange("book-only")} data-testid="mode-book-only">
        Book Only
      </button>
      <button onClick={() => onChange("selected-text")} data-testid="mode-selected-text">
        Selected Text
      </button>
      <button onClick={() => onChange("general")} data-testid="mode-general">
        General
      </button>
      <span data-testid="current-mode">{mode}</span>
    </div>
  ),
}));

vi.mock("../../src/components/chat/ToneSelector", () => ({
  ToneSelector: ({ tone, onChange }: any) => (
    <div data-testid="tone-selector">
      <button onClick={() => onChange("academic")} data-testid="tone-academic">
        Academic
      </button>
      <button onClick={() => onChange("beginner")} data-testid="tone-beginner">
        Beginner
      </button>
      <button onClick={() => onChange("concise")} data-testid="tone-concise">
        Concise
      </button>
      <span data-testid="current-tone">{tone}</span>
    </div>
  ),
}));

vi.mock("../../src/components/chat/SourcePreview", () => ({
  SourcePreview: ({ citation, isOpen, onClose, onNavigateToSource }: any) =>
    isOpen ? (
      <div data-testid="source-preview">
        <button onClick={onClose} data-testid="close-preview">
          Close
        </button>
        <button onClick={() => onNavigateToSource(citation)} data-testid="navigate-to-source">
          Go to source
        </button>
      </div>
    ) : null,
}));

// Mock useChat hook
const mockUseChat = vi.fn();
vi.mock("../../src/hooks/useChat", () => ({
  useChat: (options: any) => mockUseChat(options),
}));

describe("ChatPanel", () => {
  const defaultMessages: Message[] = [
    {
      id: "msg-1",
      role: "user",
      content: "What is inverse kinematics?",
      timestamp: new Date("2026-01-30T10:00:00Z"),
    },
    {
      id: "msg-2",
      role: "assistant",
      content: "Inverse kinematics (IK) is the process...",
      timestamp: new Date("2026-01-30T10:00:05Z"),
      citations: [
        {
          chunk_id: "chunk-123",
          text: "Sample citation text",
          confidence: 0.92,
          source_type: "textbook",
          chapter: "3",
          section_title: "Motion Planning",
          page_number: 45,
        },
      ],
    },
  ];

  const defaultUseChatReturn = {
    messages: defaultMessages,
    isLoading: false,
    error: null,
    conversationId: "conv-123",
    mode: "book-only" as const,
    tone: "academic" as const,
    setMode: vi.fn(),
    setTone: vi.fn(),
    sendMessage: vi.fn(),
    clearError: vi.fn(),
    lastUpdatedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChat.mockReturnValue(defaultUseChatReturn);
    delete (window as any).location;
    (window as any).location = { href: "" };
  });

  describe("Rendering States", () => {
    it("should render collapsed state (floating button) when defaultOpen is false", () => {
      render(<ChatPanel defaultOpen={false} />);

      const openButton = screen.getByLabelText("Open chat");
      expect(openButton).toBeInTheDocument();
      expect(screen.queryByText("Textbook Assistant")).not.toBeInTheDocument();
    });

    it("should render expanded state when defaultOpen is true", () => {
      render(<ChatPanel defaultOpen={true} />);

      expect(screen.getByText("Textbook Assistant")).toBeInTheDocument();
      expect(screen.getByTestId("message-list")).toBeInTheDocument();
      expect(screen.getByTestId("message-input")).toBeInTheDocument();
    });

    it("should render all messages from useChat hook", () => {
      render(<ChatPanel defaultOpen={true} />);

      expect(screen.getByText("What is inverse kinematics?")).toBeInTheDocument();
      expect(screen.getByText(/Inverse kinematics \(IK\) is the process/)).toBeInTheDocument();
    });
  });

  describe("Panel Interactions", () => {
    it("should open panel when floating button is clicked", async () => {
      const user = userEvent.setup();
      render(<ChatPanel defaultOpen={false} />);

      const openButton = screen.getByLabelText("Open chat");
      await user.click(openButton);

      await waitFor(() => {
        expect(screen.getByText("Textbook Assistant")).toBeInTheDocument();
      });
    });

    it("should close panel when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<ChatPanel defaultOpen={true} />);

      const closeButton = screen.getByLabelText("Close chat");
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Textbook Assistant")).not.toBeInTheDocument();
        expect(screen.getByLabelText("Open chat")).toBeInTheDocument();
      });
    });

    it("should toggle settings panel when settings button is clicked", async () => {
      const user = userEvent.setup();
      render(<ChatPanel defaultOpen={true} />);

      const settingsButton = screen.getByLabelText("Settings");

      // Settings should be hidden initially
      expect(screen.queryByTestId("mode-selector")).not.toBeInTheDocument();

      // Open settings
      await user.click(settingsButton);
      await waitFor(() => {
        expect(screen.getByTestId("mode-selector")).toBeInTheDocument();
        expect(screen.getByTestId("tone-selector")).toBeInTheDocument();
      });

      // Close settings
      await user.click(settingsButton);
      await waitFor(() => {
        expect(screen.queryByTestId("mode-selector")).not.toBeInTheDocument();
      });
    });
  });

  describe("Mode and Tone Selection", () => {
    it("should call setMode when mode is changed", async () => {
      const user = userEvent.setup();
      const setMode = vi.fn();
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        setMode,
      });

      render(<ChatPanel defaultOpen={true} />);

      // Open settings
      await user.click(screen.getByLabelText("Settings"));

      // Change mode to selected-text
      await user.click(screen.getByTestId("mode-selected-text"));

      expect(setMode).toHaveBeenCalledWith("selected-text");
    });

    it("should call setTone when tone is changed", async () => {
      const user = userEvent.setup();
      const setTone = vi.fn();
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        setTone,
      });

      render(<ChatPanel defaultOpen={true} />);

      // Open settings
      await user.click(screen.getByLabelText("Settings"));

      // Change tone to beginner
      await user.click(screen.getByTestId("tone-beginner"));

      expect(setTone).toHaveBeenCalledWith("beginner");
    });

    it("should display current mode and tone in settings panel", async () => {
      const user = userEvent.setup();
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        mode: "selected-text",
        tone: "concise",
      });

      render(<ChatPanel defaultOpen={true} />);

      // Open settings
      await user.click(screen.getByLabelText("Settings"));

      expect(screen.getByTestId("current-mode")).toHaveTextContent("selected-text");
      expect(screen.getByTestId("current-tone")).toHaveTextContent("concise");
    });
  });

  describe("Error Handling", () => {
    it("should display error message when error exists", () => {
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        error: new Error("Failed to send message"),
      });

      render(<ChatPanel defaultOpen={true} />);

      expect(screen.getByText("Failed to send message")).toBeInTheDocument();
    });

    it("should call clearError when error dismiss button is clicked", async () => {
      const user = userEvent.setup();
      const clearError = vi.fn();
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        error: new Error("Test error"),
        clearError,
      });

      render(<ChatPanel defaultOpen={true} />);

      const dismissButtons = screen.getAllByRole("button", { name: "" });
      const dismissButton = dismissButtons.find((btn) =>
        btn.querySelector('svg[class*="h-4 w-4"]')
      );

      expect(dismissButton).toBeDefined();
      await user.click(dismissButton!);

      expect(clearError).toHaveBeenCalled();
    });

    it("should not display error alert when error is null", () => {
      render(<ChatPanel defaultOpen={true} />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Citation Handling", () => {
    it("should show source preview when citation is clicked", async () => {
      const user = userEvent.setup();
      render(<ChatPanel defaultOpen={true} />);

      const citationButton = screen.getByTestId("citation-0");
      await user.click(citationButton);

      await waitFor(() => {
        expect(screen.getByTestId("source-preview")).toBeInTheDocument();
      });
    });

    it("should close source preview when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<ChatPanel defaultOpen={true} />);

      // Open source preview
      await user.click(screen.getByTestId("citation-0"));
      expect(screen.getByTestId("source-preview")).toBeInTheDocument();

      // Close source preview
      await user.click(screen.getByTestId("close-preview"));

      await waitFor(() => {
        expect(screen.queryByTestId("source-preview")).not.toBeInTheDocument();
      });
    });

    it("should navigate to source when navigate button is clicked", async () => {
      const user = userEvent.setup();
      render(<ChatPanel bookId="test-book" defaultOpen={true} />);

      // Open source preview
      await user.click(screen.getByTestId("citation-0"));

      // Navigate to source
      await user.click(screen.getByTestId("navigate-to-source"));

      await waitFor(() => {
        expect(window.location.href).toBe("/textbook/test-book/chapter-3");
      });
    });

    it("should use citation metadata URL if available", async () => {
      const user = userEvent.setup();
      const customCitation: Citation = {
        chunk_id: "chunk-456",
        text: "Custom citation",
        confidence: 0.95,
        source_type: "textbook",
        chapter: "5",
        metadata: {
          url: "/custom/url/path",
        },
      };

      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        messages: [
          {
            id: "msg-3",
            role: "assistant",
            content: "Response with custom URL",
            timestamp: new Date(),
            citations: [customCitation],
          },
        ],
      });

      render(<ChatPanel bookId="test-book" defaultOpen={true} />);

      await user.click(screen.getByTestId("citation-0"));
      await user.click(screen.getByTestId("navigate-to-source"));

      await waitFor(() => {
        expect(window.location.href).toBe("/custom/url/path");
      });
    });
  });

  describe("Message Input Integration", () => {
    it("should call sendMessage when message is submitted", async () => {
      const user = userEvent.setup();
      const sendMessage = vi.fn();
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        sendMessage,
      });

      render(<ChatPanel defaultOpen={true} />);

      const input = screen.getByTestId("input-field");
      await user.type(input, "SUBMIT");

      await waitFor(() => {
        expect(sendMessage).toHaveBeenCalledWith("Test message");
      });
    });

    it("should disable input when isLoading is true", () => {
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        isLoading: true,
      });

      render(<ChatPanel defaultOpen={true} />);

      const input = screen.getByTestId("input-field");
      expect(input).toBeDisabled();
    });

    it("should show different placeholder for selected-text mode", async () => {
      const user = userEvent.setup();
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        mode: "selected-text",
      });

      render(<ChatPanel defaultOpen={true} />);

      const input = screen.getByPlaceholderText("Highlight text first, then ask...");
      expect(input).toBeInTheDocument();
    });

    it("should show default placeholder for book-only mode", () => {
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        mode: "book-only",
      });

      render(<ChatPanel defaultOpen={true} />);

      const input = screen.getByPlaceholderText("Ask a question about the textbook...");
      expect(input).toBeInTheDocument();
    });
  });

  describe("useChat Hook Integration", () => {
    it("should pass correct options to useChat hook", () => {
      render(
        <ChatPanel
          bookId="test-book"
          chapter="5"
          conversationId="conv-456"
          defaultOpen={true}
        />
      );

      expect(mockUseChat).toHaveBeenCalledWith({
        conversationId: "conv-456",
        bookId: "test-book",
        chapter: "5",
      });
    });

    it("should work without optional props", () => {
      render(<ChatPanel defaultOpen={true} />);

      expect(mockUseChat).toHaveBeenCalledWith({
        conversationId: undefined,
        bookId: undefined,
        chapter: undefined,
      });
    });
  });

  describe("Loading State", () => {
    it("should pass isLoading to MessageInput", () => {
      mockUseChat.mockReturnValue({
        ...defaultUseChatReturn,
        isLoading: true,
      });

      render(<ChatPanel defaultOpen={true} />);

      const input = screen.getByTestId("input-field");
      expect(input).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria labels for interactive elements", () => {
      render(<ChatPanel defaultOpen={true} />);

      expect(screen.getByLabelText("Settings")).toBeInTheDocument();
      expect(screen.getByLabelText("Close chat")).toBeInTheDocument();
    });

    it("should have proper aria label for floating button", () => {
      render(<ChatPanel defaultOpen={false} />);

      expect(screen.getByLabelText("Open chat")).toBeInTheDocument();
    });
  });
});
