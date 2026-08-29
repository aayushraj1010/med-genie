import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { SecurePrisma } from "@/lib/secure-prisma";

async function handler(req: AuthenticatedRequest) {
  try {
    const user = req.user!;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    if (req.method === 'GET') {
      const exportData = await SecurePrisma.exportUserData(user.userId, ipAddress);

      // Create a response with the JSON data
      const response = NextResponse.json(exportData);
      
      // Set headers to force download as a file
      response.headers.set('Content-Disposition', `attachment; filename="med-genie-data-${user.userId}-${new Date().toISOString().split('T')[0]}.json"`);
      response.headers.set('Content-Type', 'application/json');

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );

  } catch (error: any) {
    console.error('Data export error:', error);
    
    // Check if it's a rate limit error
    if (error.message?.includes('Rate limit')) {
       return NextResponse.json({
         success: false,
         message: error.message
       }, { status: 429 });
    }

    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

export const GET = withAuth(handler);
