/**
 * ModeSelector Component
 * Toggle between answering modes (Book-Only, Selected-Text-Only, General Knowledge)
 */

import * as React from "react";
import { Book, Highlighter, Globe } from "lucide-react";
import { cn } from "../../lib/utils";
import type { AnsweringMode } from "../../../../shared/types";

export interface ModeSelectorProps {
  mode: AnsweringMode;
  onChange: (mode: AnsweringMode) => void;
  disabled?: boolean;
  className?: string;
}

const MODES: Array<{
  value: AnsweringMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    value: "book-only",
    label: "Book Only",
    icon: Book,
    description: "Answers grounded strictly in textbook content",
  },
  {
    value: "selected-text-only",
    label: "Selected Text",
    icon: Highlighter,
    description: "Answers based only on highlighted passage",
  },
  {
    value: "general-knowledge",
    label: "General",
    icon: Globe,
    description: "Combines textbook with general knowledge",
  },
];

export function ModeSelector({
  mode,
  onChange,
  disabled = false,
  className,
}: ModeSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Answering Mode
      </label>

      <div className="grid grid-cols-3 gap-2">
        {MODES.map((modeOption) => {
          const Icon = modeOption.icon;
          const isActive = mode === modeOption.value;

          return (
            <button
              key={modeOption.value}
              onClick={() => onChange(modeOption.value)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all",
                isActive
                  ? "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-100"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800",
                disabled && "cursor-not-allowed opacity-50"
              )}
              title={modeOption.description}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                )}
              />
              <span className="text-xs font-medium">{modeOption.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode Description */}
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {MODES.find((m) => m.value === mode)?.description}
      </div>
    </div>
  );
}
