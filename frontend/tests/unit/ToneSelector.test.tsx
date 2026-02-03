/**
 * ToneSelector Component Tests
 * Tests T113: Component tests for ToneSelector
 */

import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ToneSelector } from "../../src/components/chat/ToneSelector";
import type { ToneType } from "../../../shared/types";

describe("ToneSelector Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render with academic tone selected by default", () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      expect(screen.getByText("Response Tone")).toBeInTheDocument();
      expect(screen.getByText("Academic")).toBeInTheDocument();
    });

    it("should render with beginner-friendly tone selected", () => {
      render(<ToneSelector tone="beginner-friendly" onChange={mockOnChange} />);

      expect(screen.getByText("Beginner")).toBeInTheDocument();
    });

    it("should render with concise tone selected", () => {
      render(<ToneSelector tone="concise" onChange={mockOnChange} />);

      expect(screen.getByText("Concise")).toBeInTheDocument();
    });

    it("should display tone icon for selected tone", () => {
      const { container } = render(
        <ToneSelector tone="academic" onChange={mockOnChange} />
      );

      // Check that an icon SVG is present (lucide-react icons)
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should render with custom className", () => {
      const { container } = render(
        <ToneSelector
          tone="academic"
          onChange={mockOnChange}
          className="custom-class"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom-class");
    });
  });

  describe("Dropdown Interaction", () => {
    it("should open dropdown when button is clicked", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      const button = screen.getByRole("button", { name: /Academic/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Technical language with formal terminology")).toBeInTheDocument();
        expect(screen.getByText("Simple explanations with analogies")).toBeInTheDocument();
        expect(screen.getByText("Brief, to-the-point answers")).toBeInTheDocument();
      });
    });

    it("should close dropdown when backdrop is clicked", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      // Open dropdown
      const button = screen.getByRole("button", { name: /Academic/i });
      fireEvent.click(button);

      // Wait for dropdown to open
      await waitFor(() => {
        expect(screen.getByText("Technical language with formal terminology")).toBeInTheDocument();
      });

      // Click backdrop
      const backdrop = document.querySelector(".fixed.inset-0");
      expect(backdrop).toBeInTheDocument();
      fireEvent.click(backdrop!);

      // Dropdown should close
      await waitFor(() => {
        expect(screen.queryByText("Technical language with formal terminology")).not.toBeInTheDocument();
      });
    });

    it("should toggle dropdown on button click", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      const button = screen.getByRole("button", { name: /Academic/i });

      // Open dropdown
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText("Technical language with formal terminology")).toBeInTheDocument();
      });

      // Close dropdown
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.queryByText("Technical language with formal terminology")).not.toBeInTheDocument();
      });
    });
  });

  describe("Tone Selection", () => {
    it("should call onChange when academic tone is selected", async () => {
      render(<ToneSelector tone="beginner-friendly" onChange={mockOnChange} />);

      // Open dropdown
      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Click academic option
      await waitFor(() => {
        const academicButton = screen.getByText("Academic").closest("button");
        expect(academicButton).toBeInTheDocument();
        fireEvent.click(academicButton!);
      });

      expect(mockOnChange).toHaveBeenCalledWith("academic");
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("should call onChange when beginner-friendly tone is selected", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      // Open dropdown
      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Click beginner-friendly option
      await waitFor(() => {
        const beginnerButton = screen.getByText("Beginner").closest("button");
        expect(beginnerButton).toBeInTheDocument();
        fireEvent.click(beginnerButton!);
      });

      expect(mockOnChange).toHaveBeenCalledWith("beginner-friendly");
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("should call onChange when concise tone is selected", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      // Open dropdown
      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Click concise option
      await waitFor(() => {
        const conciseButton = screen.getByText("Concise").closest("button");
        expect(conciseButton).toBeInTheDocument();
        fireEvent.click(conciseButton!);
      });

      expect(mockOnChange).toHaveBeenCalledWith("concise");
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("should close dropdown after tone selection", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      // Open dropdown
      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Select a tone
      await waitFor(() => {
        const conciseButton = screen.getByText("Concise").closest("button");
        fireEvent.click(conciseButton!);
      });

      // Dropdown should close
      await waitFor(() => {
        expect(screen.queryByText("Brief, to-the-point answers")).not.toBeInTheDocument();
      });
    });
  });

  describe("Active State", () => {
    it("should highlight currently selected tone", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      // Open dropdown
      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        const academicButton = screen.getByText("Academic").closest("button");
        expect(academicButton).toBeInTheDocument();
        expect(academicButton).toHaveClass("bg-blue-50");
      });
    });

    it("should show checkmark for active tone", async () => {
      const { container } = render(
        <ToneSelector tone="beginner-friendly" onChange={mockOnChange} />
      );

      // Open dropdown
      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        const beginnerButton = screen.getByText("Beginner").closest("button");
        expect(beginnerButton).toBeInTheDocument();

        // Check for checkmark SVG in the active button
        const checkmark = beginnerButton!.querySelector("svg path[fill-rule='evenodd']");
        expect(checkmark).toBeInTheDocument();
      });
    });
  });

  describe("Disabled State", () => {
    it("should render in disabled state", () => {
      render(
        <ToneSelector tone="academic" onChange={mockOnChange} disabled />
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("cursor-not-allowed", "opacity-50");
    });

    it("should not open dropdown when disabled", () => {
      render(
        <ToneSelector tone="academic" onChange={mockOnChange} disabled />
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Dropdown should not open
      expect(screen.queryByText("Technical language with formal terminology")).not.toBeInTheDocument();
    });

    it("should not call onChange when disabled and clicked", () => {
      render(
        <ToneSelector tone="academic" onChange={mockOnChange} disabled />
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe("Tone Descriptions", () => {
    it("should display academic tone description", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Technical language with formal terminology")).toBeInTheDocument();
      });
    });

    it("should display beginner-friendly tone description", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Simple explanations with analogies")).toBeInTheDocument();
      });
    });

    it("should display concise tone description", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Brief, to-the-point answers")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible button", () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "button");
    });

    it("should show all tone options in dropdown", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        const options = screen.getAllByRole("button");
        // 1 main button + 3 tone options
        expect(options.length).toBe(4);
      });
    });

    it("should support keyboard navigation", async () => {
      render(<ToneSelector tone="academic" onChange={mockOnChange} />);

      const button = screen.getByRole("button");

      // Open dropdown with Enter key
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

      await waitFor(() => {
        expect(screen.getByText("Technical language with formal terminology")).toBeInTheDocument();
      });
    });
  });

  describe("Type Safety", () => {
    it("should accept all valid tone types", () => {
      const validTones: ToneType[] = ["academic", "beginner-friendly", "concise"];

      validTones.forEach((tone) => {
        const { unmount } = render(
          <ToneSelector tone={tone} onChange={mockOnChange} />
        );
        expect(screen.getByText("Response Tone")).toBeInTheDocument();
        unmount();
      });
    });

    it("should call onChange with correct ToneType", async () => {
      const handleChange = jest.fn((tone: ToneType) => {
        // Verify type is correct
        const validTones: ToneType[] = ["academic", "beginner-friendly", "concise"];
        expect(validTones).toContain(tone);
      });

      render(<ToneSelector tone="academic" onChange={handleChange} />);

      // Open dropdown and select concise
      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        const conciseButton = screen.getByText("Concise").closest("button");
        fireEvent.click(conciseButton!);
      });

      expect(handleChange).toHaveBeenCalledWith("concise");
    });
  });
});
