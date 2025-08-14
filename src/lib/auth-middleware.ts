import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest, JWTPayload } from '@/lib/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      const token = getTokenFromRequest(req);
      
      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Access token is required' },
          { status: 401 }
        );
      }

      const user = verifyToken(token);
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Attach user to request
      req.user = user;
      
      return handler(req);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function optionalAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      const token = getTokenFromRequest(req);
      
      if (token) {
        const user = verifyToken(token);
        if (user) {
          req.user = user;
        }
      }
      
      return handler(req);
    } catch (error) {
      // Continue without authentication if optional
      return handler(req);
    }
  };
}
