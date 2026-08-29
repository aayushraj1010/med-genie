export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  const redirectUri = `${process.env.APP_URL}/api/auth/blackbox/callback`;
  const clientId = process.env.BLACKBOX_CLIENT_ID;
  const authUrl = process.env.BLACKBOX_AUTH_URL;
  const scope = encodeURIComponent(
    process.env.BLACKBOX_SCOPE || "openid email profile"
  );

  if (!clientId || !authUrl) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Blackbox auth is not configured. Please set BLACKBOX_CLIENT_ID and BLACKBOX_AUTH_URL.",
      },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    prompt: "select_account",
  });

  return NextResponse.redirect(`${authUrl}?${params.toString()}`);
};
