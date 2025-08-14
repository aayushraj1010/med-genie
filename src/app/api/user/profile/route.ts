import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";

async function handler(req: AuthenticatedRequest) {
  try {
    // Access the authenticated user from req.user
    const user = req.user!;
    
    if (req.method === 'GET') {
      // Return user profile data
      return NextResponse.json({
        success: true,
        user: {
          id: user.userId,
          name: user.name,
          email: user.email
        }
      });
    }

    if (req.method === 'PUT') {
      // Update user profile
      const body = await req.json();
      const { name } = body;

      // Here you would typically update the user in your database
      // For now, we'll just return a success response
      
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user.userId,
          name: name || user.name,
          email: user.email
        }
      });
    }

    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

// Export protected methods
export const GET = withAuth(handler);
export const PUT = withAuth(handler);
