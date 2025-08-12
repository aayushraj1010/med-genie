import React from 'react';

interface RobotDoctorIconProps {
  className?: string;
}

export function RobotDoctorIcon({ className }: RobotDoctorIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Robot Head */}
      <rect x="7" y="4" width="10" height="10" rx="2" />
      
      {/* Robot Eyes */}
      <circle cx="9" cy="8" r="1" fill="currentColor" />
      <circle cx="15" cy="8" r="1" fill="currentColor" />
      
      {/* Robot Mouth */}
      <path d="M9 11h6" />
      
      {/* Doctor Stethoscope */}
      <path d="M6 14c-1 0-2 1-2 2v2" />
      <circle cx="4" cy="19" r="1" />
      <path d="M6 14c0 0 1.5 0 2 1" />
      
      {/* Medical Cross */}
      <path d="M12 2v2" />
      <path d="M11 3h2" />
      
      {/* Robot Body */}
      <rect x="8" y="14" width="8" height="7" rx="1" />
      
      {/* Robot Arms */}
      <path d="M6 18h2" />
      <path d="M16 18h2" />
    </svg>
  );
}