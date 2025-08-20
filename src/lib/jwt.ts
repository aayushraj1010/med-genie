import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Ensure JWT_SECRET is always set - no fallback secrets!
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // Short-lived access tokens
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

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
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
    issuer: 'med-genie',
    audience: 'med-genie-users',
  });
};

export const signRefreshToken = (payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
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
    const decoded = jwt.verify(token, JWT_SECRET, {
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
    const decoded = jwt.verify(token, JWT_SECRET, {
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
