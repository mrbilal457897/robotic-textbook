/**
 * ModeSelector Component
 * Toggle between answering modes (Book-Only, Selected-Text-Only, General Knowledge)
 */

import * as React from 'react';
import { cn } from '../../lib/utils';
import type { AnsweringMode } from '../../../shared/types';

export interface ModeSelectorProps {
  mode: AnsweringMode;
  onChange: (mode: AnsweringMode) => void;
  disabled?: boolean;
  className?: string;
}

const MODES: Array<{
  value: AnsweringMode;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    value: 'book-only',
    label: 'Book Only',
    icon: '📚',
    description: 'Answers grounded strictly in textbook content',
  },
  {
    value: 'selected-text-only',
    label: 'Selected Text',
    icon: '✏️',
    description: 'Answers based only on highlighted passage',
  },
  {
    value: 'general-knowledge',
    label: 'General',
    icon: '🌐',
    description: 'Combines textbook with general knowledge',
  },
];

export function ModeSelector({ mode, onChange, disabled = false, className }: ModeSelectorProps) {
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [pendingMode, setPendingMode] = React.useState<AnsweringMode | null>(null);

  const handleModeClick = (newMode: AnsweringMode) => {
    if (newMode === mode) {
      return;
    }

    setPendingMode(newMode);
    setShowConfirmation(true);
  };

  const confirmModeSwitch = () => {
    if (pendingMode) {
      onChange(pendingMode);
    }
    setShowConfirmation(false);
    setPendingMode(null);
  };

  const cancelModeSwitch = () => {
    setShowConfirmation(false);
    setPendingMode(null);
  };

  const getPendingModeInfo = () => {
    return MODES.find(m => m.value === pendingMode);
  };

  const getCurrentModeInfo = () => {
    return MODES.find(m => m.value === mode);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Answering Mode</label>

      <div className="grid grid-cols-3 gap-2">
        {MODES.map(modeOption => {
          const isActive = mode === modeOption.value;

          return (
            <button
              key={modeOption.value}
              onClick={() => handleModeClick(modeOption.value)}
              disabled={disabled}
              className={cn(
                'flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all',
                isActive
                  ? 'border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-100'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              title={modeOption.description}
            >
              <span className="text-xl">{modeOption.icon}</span>
              <span className="text-xs font-medium">{modeOption.label}</span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400">
        {MODES.find(m => m.value === mode)?.description}
      </div>

      {showConfirmation && pendingMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Switch Answering Mode?
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              You're about to switch from <strong>{getCurrentModeInfo()?.label}</strong> to{' '}
              <strong>{getPendingModeInfo()?.label}</strong>.
            </p>

            <div className="mb-4 space-y-2 rounded-md bg-gray-50 p-3 text-xs dark:bg-gray-900">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Current:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {getCurrentModeInfo()?.description}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Switching to:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {getPendingModeInfo()?.description}
                </span>
              </div>
            </div>

            {pendingMode === 'general-knowledge' && (
              <div className="mb-4 rounded-md bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200">
                ⚠️ General Knowledge mode combines textbook content with external knowledge.
                Responses will be labeled to distinguish sources.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={cancelModeSwitch}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmModeSwitch}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Switch Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
