export const runtime = "nodejs"
import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/google/callback`;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: "Google OAuth is not configured. Missing GOOGLE_CLIENT_ID." },
      { status: 500 }
    );
  }

  // Build the Google OAuth URL with properly encoded parameters
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    access_type: "offline",
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  // Redirect the user to Google login
  return NextResponse.redirect(googleAuthUrl);
};
