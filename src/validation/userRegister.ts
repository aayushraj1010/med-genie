import { z } from 'zod';

// Password strength validator with comprehensive requirements
const passwordStrength = z.string()
  .min(12, "Password must be at least 12 characters long")
  .max(128, "Password must be less than 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .refine((password) => {
    // Check for common patterns
    const commonPatterns = [
      'password', '123456', 'qwerty', 'admin', 'letmein',
      'welcome', 'monkey', 'dragon', 'master', 'hello',
      'password123', 'admin123', '123456789', 'qwerty123'
    ];
    return !commonPatterns.some(pattern => 
      password.toLowerCase().includes(pattern)
    );
  }, "Password contains common patterns that are easily guessable")
  .refine((password) => {
    // Check for sequential characters
    const sequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|012)/i;
    return !sequential.test(password);
  }, "Password contains sequential characters");

export const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters")
    .transform(val => val.trim()),
  
  email: z.string()
    .email("Invalid email address")
    .max(254, "Email too long")
    .transform(val => val.toLowerCase().trim()),
  
  password: passwordStrength,
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});