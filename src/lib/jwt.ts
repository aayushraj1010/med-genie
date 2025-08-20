import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from './config';

// Validate JWT secret on import
if (!config.jwtSecret || config.jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  tokenId: string; // Unique token identifier for blacklisting
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenId: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const generateTokenId = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const signAccessToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    algorithm: 'HS256',
    issuer: 'med-genie',
    audience: 'med-genie-users',
  });
};

export const signRefreshToken = (payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.refreshTokenExpiresIn,
    algorithm: 'HS256',
    issuer: 'med-genie',
    audience: 'med-genie-refresh',
  });
};

export const signTokenPair = (userId: number, email: string, name: string): TokenPair => {
  const tokenId = generateTokenId();

  const accessToken = signAccessToken({
    userId,
    email,
    name,
    tokenId,
  });

  const refreshToken = signRefreshToken({
    userId,
    tokenId,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 * 1000, // 15 minutes in milliseconds
  };
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
      issuer: 'med-genie',
      audience: 'med-genie-users',
    }) as JWTPayload;

    // Check if token is blacklisted
    if (isTokenBlacklisted(decoded.tokenId)) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
      issuer: 'med-genie',
      audience: 'med-genie-refresh',
    }) as RefreshTokenPayload;

    // Check if refresh token is blacklisted
    if (isTokenBlacklisted(decoded.tokenId)) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

// Token blacklisting (implement with Redis or database)
export const blacklistToken = async (tokenId: string): Promise<void> => {
  // Add to blacklist with expiration
  // await redis.setex(`blacklist:${tokenId}`, 7 * 24 * 60 * 60, '1');
  // For now, we'll implement a simple in-memory blacklist
  // TODO: Implement with Redis or database for production
};

export const isTokenBlacklisted = async (tokenId: string): Promise<boolean> => {
  // Check if token is in blacklist
  // return await redis.exists(`blacklist:${tokenId}`);
  // TODO: Implement with actual storage
  return false;
};

// Legacy function for backward compatibility
export const signToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  console.warn('Warning: Using legacy signToken function. Use signTokenPair instead.');
  return signAccessToken(payload);
};

export const getTokenFromRequest = (request: Request): string | null => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

// Generate cryptographically secure random strings
export const generateSecureSecret = (length: number = 64): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Validate secret strength
export const validateSecretStrength = (secret: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (secret.length >= 32) score += 2;
  else feedback.push('Secret should be at least 32 characters long');

  if (secret.length >= 64) score += 1;
  if (/[A-Z]/.test(secret)) score += 1;
  if (/[a-z]/.test(secret)) score += 1;
  if (/[0-9]/.test(secret)) score += 1;
  if (/[^A-Za-z0-9]/.test(secret)) score += 1;

  return {
    isValid: score >= 4,
    score: Math.min(score, 7),
    feedback
  };
};
