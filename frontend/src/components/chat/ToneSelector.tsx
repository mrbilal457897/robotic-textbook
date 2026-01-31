/**
 * ToneSelector Component
 * Dropdown to select response tone (Academic, Beginner-friendly, Concise)
 */

import * as React from "react";
import { GraduationCap, Smile, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import type { ToneType } from "../../../../shared/types";

export interface ToneSelectorProps {
  tone: ToneType;
  onChange: (tone: ToneType) => void;
  disabled?: boolean;
  className?: string;
}

const TONES: Array<{
  value: ToneType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    value: "academic",
    label: "Academic",
    icon: GraduationCap,
    description: "Technical language with formal terminology",
  },
  {
    value: "beginner-friendly",
    label: "Beginner",
    icon: Smile,
    description: "Simple explanations with analogies",
  },
  {
    value: "concise",
    label: "Concise",
    icon: Zap,
    description: "Brief, to-the-point answers",
  },
];

export function ToneSelector({
  tone,
  onChange,
  disabled = false,
  className,
}: ToneSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedTone = TONES.find((t) => t.value === tone);

  return (
    <div className={cn("relative flex flex-col gap-2", className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Response Tone
      </label>

      {/* Dropdown Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="flex items-center gap-2">
          {selectedTone && <selectedTone.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
          <span className="font-medium">{selectedTone?.label}</span>
        </div>
        <svg
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full z-20 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
            {TONES.map((toneOption) => {
              const Icon = toneOption.icon;
              const isActive = tone === toneOption.value;

              return (
                <button
                  key={toneOption.value}
                  onClick={() => {
                    onChange(toneOption.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-gray-200 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800",
                    isActive && "bg-blue-50 dark:bg-blue-950"
                  )}
                >
                  <Icon
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                    )}
                  />
                  <div className="flex-1">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isActive ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-100"
                      )}
                    >
                      {toneOption.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {toneOption.description}
                    </div>
                  </div>
                  {isActive && (
                    <svg
                      className="h-4 w-4 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
