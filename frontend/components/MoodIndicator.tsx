'use client';

import { MOOD_COLORS } from '../../shared/constants';
import { MoodType } from '../../shared/types';

interface MoodIndicatorProps {
  mood: MoodType;
  confidence?: number;
}

export function MoodIndicator({ mood, confidence }: MoodIndicatorProps) {
  const color = MOOD_COLORS[mood];

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-text-primary capitalize">
          {mood}
        </span>
        {confidence !== undefined && (
          <span className="text-xs text-text-secondary">
            {Math.round(confidence * 100)}% confidence
          </span>
        )}
      </div>
    </div>
  );
}
