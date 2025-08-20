import { useState, useEffect } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    const checkStrength = () => {
      let score = 0;
      const feedbackItems: string[] = [];

      if (password.length >= 12) score += 1;
      else feedbackItems.push("At least 12 characters");

      if (/[A-Z]/.test(password)) score += 1;
      else feedbackItems.push("One uppercase letter");

      if (/[a-z]/.test(password)) score += 1;
      else feedbackItems.push("One lowercase letter");

      if (/[0-9]/.test(password)) score += 1;
      else feedbackItems.push("One number");

      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      else feedbackItems.push("One special character");

      if (password.length > 16) score += 1;
      else feedbackItems.push("Longer than 16 characters");

      setStrength(score);
      setFeedback(feedbackItems);
    };

    checkStrength();
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 2) return 'text-red-500';
    if (strength <= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Fair';
    return 'Strong';
  };

  const getStrengthBarColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/70">Strength:</span>
        <span className={`text-sm font-medium ${getStrengthColor()}`}>
          {getStrengthText()}
        </span>
        <span className="text-sm text-white/50">({strength}/6)</span>
      </div>
      
      {/* Strength bar */}
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor()}`}
          style={{ width: `${(strength / 6) * 100}%` }}
        />
      </div>
      
      {feedback.length > 0 && (
        <div className="mt-2 text-sm text-white/60">
          <p className="mb-1">To improve your password:</p>
          <ul className="list-disc list-inside space-y-1">
            {feedback.map((item, index) => (
              <li key={index} className="text-xs">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
