import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { SecurePrisma } from "@/lib/secure-prisma";
import { DatabaseSecurity } from "@/lib/database-security";

async function handler(req: AuthenticatedRequest) {
  try {
    // Access the authenticated user from req.user
    const user = req.user!;

    // Extract IP address for security monitoring
    const ipAddress = req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (req.method === 'GET') {
      // Get user profile using secure database layer
      const userProfile = await SecurePrisma.getUserProfile(user.userId, ipAddress);

      if (!userProfile) {
        DatabaseSecurity.logDatabaseAccess({
          userId: user.userId,
          action: 'GET_PROFILE_NOT_FOUND',
          table: 'user',
          details: 'User profile not found',
          ipAddress,
          success: false,
          error: 'Profile not found'
        });

        return NextResponse.json({
          success: false,
          message: "User profile not found"
        }, { status: 404 });
      }

      // Log successful profile access
      DatabaseSecurity.logDatabaseAccess({
        userId: user.userId,
        action: 'GET_PROFILE_SUCCESS',
        table: 'user',
        details: 'Profile accessed successfully',
        ipAddress,
        success: true
      });

      // Return user profile data
      return NextResponse.json({
        success: true,
        user: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          createdAt: userProfile.createdAt
        }
      });
    }

    if (req.method === 'PUT') {
      // Update user profile
      const body = await req.json();
      const { name } = body;

      // Validate update data
      if (name !== undefined) {
        const validation = DatabaseSecurity.validateUserData({ name });
        if (!validation.isValid) {
          DatabaseSecurity.logDatabaseAccess({
            userId: user.userId,
            action: 'UPDATE_PROFILE_VALIDATION_FAILED',
            table: 'user',
            details: `Validation failed: ${validation.errors.join(', ')}`,
            ipAddress,
            success: false,
            error: validation.errors.join(', ')
          });

          return NextResponse.json({
            success: false,
            message: `Invalid data: ${validation.errors.join(', ')}`
          }, { status: 400 });
        }
      }

      // Update user profile using secure database layer
      const updatedUser = await SecurePrisma.updateUser(user.userId, { name }, ipAddress);

      // Log successful profile update
      DatabaseSecurity.logDatabaseAccess({
        userId: user.userId,
        action: 'UPDATE_PROFILE_SUCCESS',
        table: 'user',
        details: 'Profile updated successfully',
        ipAddress,
        success: true
      });

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email
        }
      });
    }

    // Log unsupported method
    DatabaseSecurity.logDatabaseAccess({
      userId: user.userId,
      action: 'PROFILE_METHOD_NOT_ALLOWED',
      table: 'user',
      details: `Method not allowed: ${req.method}`,
      ipAddress,
      success: false,
      error: 'Method not allowed'
    });

    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );

  } catch (error: any) {
    console.error('Profile operation error:', error);

    // Log error for security monitoring
    DatabaseSecurity.logDatabaseAccess({
      userId: req.user?.userId,
      action: 'PROFILE_OPERATION_ERROR',
      table: 'user',
      details: `Profile operation error: ${error.message}`,
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      success: false,
      error: error.message
    });

    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

// Export protected methods
export const GET = withAuth(handler);
export const PUT = withAuth(handler);
