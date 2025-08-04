import type { SVGProps } from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Modern Medical Cross with AI Elements */}
      
      {/* Outer Circle - Medical/Healthcare Theme */}
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      
      {/* Main Medical Cross - Bold and Clean */}
      <path d="M12 5v14" strokeWidth="2.5" />
      <path d="M5 12h14" strokeWidth="2.5" />
      
      {/* AI/Technology Circuit Elements */}
      {/* Top Left Circuit */}
      <path d="M6 6l2-1 1 1" strokeWidth="1" />
      <path d="M6 6l1 2-1 1" strokeWidth="1" />
      
      {/* Top Right Circuit */}
      <path d="M18 6l-2-1-1 1" strokeWidth="1" />
      <path d="M18 6l-1 2 1 1" strokeWidth="1" />
      
      {/* Bottom Left Circuit */}
      <path d="M6 18l2 1 1-1" strokeWidth="1" />
      <path d="M6 18l1-2-1-1" strokeWidth="1" />
      
      {/* Bottom Right Circuit */}
      <path d="M18 18l-2 1-1-1" strokeWidth="1" />
      <path d="M18 18l-1-2 1-1" strokeWidth="1" />
      
      {/* Central AI Brain/Neural Network */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.4" />
      
      {/* Neural Network Connections */}
      <path d="M9.5 9.5l2.5 2.5 2.5-2.5" strokeWidth="0.8" opacity="0.7" />
      <path d="M9.5 14.5l2.5-2.5 2.5 2.5" strokeWidth="0.8" opacity="0.7" />
      
      {/* AI Data Flow Lines */}
      <path d="M12 9.5v-2" strokeWidth="0.5" opacity="0.5" />
      <path d="M12 16.5v2" strokeWidth="0.5" opacity="0.5" />
      <path d="M9.5 12h-2" strokeWidth="0.5" opacity="0.5" />
      <path d="M16.5 12h2" strokeWidth="0.5" opacity="0.5" />
      
      {/* Pulse/Heartbeat Effect */}
      <path d="M10 7l1 2 1-2 1 2" strokeWidth="1" opacity="0.6" />
      <path d="M10 17l1-2 1 2 1-2" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
