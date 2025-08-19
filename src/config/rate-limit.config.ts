/**
 * Rate Limiting Configuration
 * 
 * This file contains all rate limiting settings for the application.
 * Modify these values to adjust security levels for different endpoints.
 */

export const RATE_LIMIT_CONFIG = {
  // Login endpoint: 5 attempts per 15 minutes
  LOGIN: {
    maxRequests: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '5'),
    windowMs: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW || '900000'), // 15 minutes
    keyPrefix: 'login',
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    description: 'Login attempts - 5 per 15 minutes'
  },
  
  // Registration endpoint: 3 attempts per hour
  REGISTER: {
    maxRequests: parseInt(process.env.RATE_LIMIT_REGISTER_MAX || '3'),
    windowMs: parseInt(process.env.RATE_LIMIT_REGISTER_WINDOW || '3600000'), // 1 hour
    keyPrefix: 'register',
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    description: 'Registration attempts - 3 per hour'
  },
  
  // Email check endpoint: 10 attempts per 15 minutes
  CHECK_EMAIL: {
    maxRequests: parseInt(process.env.RATE_LIMIT_CHECK_EMAIL_MAX || '10'),
    windowMs: parseInt(process.env.RATE_LIMIT_CHECK_EMAIL_WINDOW || '900000'), // 15 minutes
    keyPrefix: 'check_email',
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    description: 'Email availability checks - 10 per 15 minutes'
  },
  
  // General API endpoints: 100 requests per 15 minutes
  GENERAL: {
    maxRequests: parseInt(process.env.RATE_LIMIT_GENERAL_MAX || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW || '900000'), // 15 minutes
    keyPrefix: 'general',
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
    description: 'General API requests - 100 per 15 minutes'
  },
  
  // Password reset endpoint: 3 attempts per hour
  PASSWORD_RESET: {
    maxRequests: parseInt(process.env.RATE_LIMIT_PASSWORD_RESET_MAX || '3'),
    windowMs: parseInt(process.env.RATE_LIMIT_PASSWORD_RESET_WINDOW || '3600000'), // 1 hour
    keyPrefix: 'password_reset',
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    description: 'Password reset attempts - 3 per hour'
  },
  
  // OTP verification: 5 attempts per 15 minutes
  OTP_VERIFICATION: {
    maxRequests: parseInt(process.env.RATE_LIMIT_OTP_MAX || '5'),
    windowMs: parseInt(process.env.RATE_LIMIT_OTP_WINDOW || '900000'), // 15 minutes
    keyPrefix: 'otp_verification',
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    description: 'OTP verification attempts - 5 per 15 minutes'
  }
};

// Environment variable documentation
export const ENV_VARS = {
  RATE_LIMIT_LOGIN_MAX: 'Maximum login attempts per time window',
  RATE_LIMIT_LOGIN_WINDOW: 'Login time window in milliseconds',
  RATE_LIMIT_REGISTER_MAX: 'Maximum registration attempts per time window',
  RATE_LIMIT_REGISTER_WINDOW: 'Registration time window in milliseconds',
  RATE_LIMIT_CHECK_EMAIL_MAX: 'Maximum email check attempts per time window',
  RATE_LIMIT_CHECK_EMAIL_WINDOW: 'Email check time window in milliseconds',
  RATE_LIMIT_GENERAL_MAX: 'Maximum general API requests per time window',
  RATE_LIMIT_GENERAL_WINDOW: 'General API time window in milliseconds',
  RATE_LIMIT_PASSWORD_RESET_MAX: 'Maximum password reset attempts per time window',
  RATE_LIMIT_PASSWORD_RESET_WINDOW: 'Password reset time window in milliseconds',
  RATE_LIMIT_OTP_MAX: 'Maximum OTP verification attempts per time window',
  RATE_LIMIT_OTP_WINDOW: 'OTP verification time window in milliseconds'
};

// Default values for reference
export const DEFAULT_VALUES = {
  LOGIN: { max: 5, window: '15 minutes' },
  REGISTER: { max: 3, window: '1 hour' },
  CHECK_EMAIL: { max: 10, window: '15 minutes' },
  GENERAL: { max: 100, window: '15 minutes' },
  PASSWORD_RESET: { max: 3, window: '1 hour' },
  OTP_VERIFICATION: { max: 5, window: '15 minutes' }
};
