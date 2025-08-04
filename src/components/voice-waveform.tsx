'use client';

import React from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  className?: string;
}

export function VoiceWaveform({ isActive, className = '' }: VoiceWaveformProps) {
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`w-0.5 rounded-full bg-white transition-all duration-300 ${
            isActive 
              ? 'animate-[waveform_1s_ease-in-out_infinite]' 
              : 'h-1'
          }`}
          style={{ 
            animationDelay: `${bar * 0.1}s`,
            opacity: isActive ? 1 : 0.5,
            height: isActive ? `${Math.max(3, Math.min(12, bar * 2))}px` : '2px'
          }}
        />
      ))}
    </div>
  );
}

// Add this to your globals.css or create a new keyframes in your component
// @keyframes waveform {
//   0%, 100% { height: 4px; }
//   50% { height: 16px; }
// }