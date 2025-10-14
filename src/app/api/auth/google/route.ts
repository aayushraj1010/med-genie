import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  const redirectUri = `${process.env.APP_URL}/api/auth/google/callback`;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const scope = encodeURIComponent("openid email profile");
  const responseType = "code";

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=select_account`;

  // Redirect the user to Google login
  return NextResponse.redirect(googleAuthUrl);
};
