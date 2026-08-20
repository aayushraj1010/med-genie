export const runtime = "nodejs"
import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  const origin = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    const referer = req.headers.get("referer") || "";
    const redirectToPath = referer.includes("/sign-up") ? "/sign-up" : "/login";
    return NextResponse.redirect(new URL(`${redirectToPath}?error=google_not_configured`, req.nextUrl));
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const scope = encodeURIComponent("openid email profile");
  const responseType = "code";

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=select_account`;

  // Redirect the user to Google login
  return NextResponse.redirect(googleAuthUrl);
};
