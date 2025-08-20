export class InputSanitizer {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  static sanitizeEmail(email: string): string {
    return email
      .toLowerCase()
      .trim()
      .replace(/[^\w@.-]/g, '') // Only allow valid email characters
      .substring(0, 254);
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 12) errors.push("Too short");
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (password.length > 16) score += 1;

    return {
      isValid: score >= 4 && errors.length === 0,
      errors,
      score: Math.min(score, 6)
    };
  }

  static checkCommonPatterns(password: string): boolean {
    const commonPatterns = [
      'password', '123456', 'qwerty', 'admin', 'letmein',
      'welcome', 'monkey', 'dragon', 'master', 'hello',
      'password123', 'admin123', '123456789', 'qwerty123'
    ];
    return !commonPatterns.some(pattern => 
      password.toLowerCase().includes(pattern)
    );
  }

  static checkSequentialCharacters(password: string): boolean {
    const sequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|012)/i;
    return !sequential.test(password);
  }
}
