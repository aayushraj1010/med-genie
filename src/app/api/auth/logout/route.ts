import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken, blacklistToken } from "@/lib/jwt";
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Get the access token from the request
    const token = getTokenFromRequest(req);

    if (token) {
      // Verify and blacklist the access token
      const decoded = await verifyToken(token);
      if (decoded) {
        await blacklistToken(decoded.tokenId);
      }
    }

    // Get refresh token from cookies and blacklist it
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (refreshToken) {
      // Parse the refresh token to get tokenId (simple approach)
      try {
        const payload = JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString());
        if (payload.tokenId) {
          await blacklistToken(payload.tokenId);
        }
      } catch (error) {
        console.error('Error parsing refresh token:', error);
      }
    }

    // Create response with success message
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    }, { status: 200 });

    // Clear the refresh token cookie
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}
