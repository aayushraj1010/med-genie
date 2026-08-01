import { NextRequest, NextResponse } from "next/server";
import { SecurePrisma } from "@/lib/secure-prisma";
import { DatabaseSecurity } from "@/lib/database-security";
import { signTokenPair } from "@/lib/jwt";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { InputSanitizer } from "@/lib/input-sanitizer";
import jwt from "jsonwebtoken";

const BLACKBOX_CALLBACK_HANDLER = async (req: NextRequest) => {
  const ipAddress =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const authUrl = process.env.BLACKBOX_TOKEN_URL;
  const clientId = process.env.BLACKBOX_CLIENT_ID;
  const clientSecret = process.env.BLACKBOX_CLIENT_SECRET;
  const redirectUri = `${process.env.APP_URL}/api/auth/blackbox/callback`;
  const userInfoUrl = process.env.BLACKBOX_USERINFO_URL;

  if (!authUrl || !clientId || !clientSecret) {
    DatabaseSecurity.logDatabaseAccess({
      userId: undefined,
      action: "BLACKBOX_OAUTH_CONFIG_MISSING",
      table: "user",
      details: "Missing Blackbox OAuth environment variables",
      ipAddress,
      success: false,
      error: "Configuration error",
    });

    return NextResponse.json(
      {
        success: false,
        message:
          "Blackbox auth is not configured. Please set BLACKBOX_CLIENT_ID, BLACKBOX_CLIENT_SECRET, and BLACKBOX_TOKEN_URL.",
      },
      { status: 500 }
    );
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: "BLACKBOX_OAUTH_NO_CODE",
        table: "user",
        details: "Blackbox OAuth callback missing code",
        ipAddress,
        success: false,
        error: "No code provided",
      });

      return NextResponse.json(
        { success: false, message: "Missing authorization code" },
        { status: 400 }
      );
    }

    const tokenResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: "BLACKBOX_OAUTH_TOKEN_ERROR",
        table: "user",
        details: `Error exchanging code: ${errText}`,
        ipAddress,
        success: false,
        error: errText,
      });
      return NextResponse.json(
        { success: false, message: "Failed to exchange code for token" },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    let userInfo: any = null;

    if (tokenData.id_token) {
      userInfo = jwt.decode(tokenData.id_token) as any;
    }

    if (!userInfo && userInfoUrl && tokenData.access_token) {
      const userInfoResponse = await fetch(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (userInfoResponse.ok) {
        userInfo = await userInfoResponse.json();
      }
    }

    if (!userInfo || !userInfo.email) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: "BLACKBOX_OAUTH_USERINFO_ERROR",
        table: "user",
        details: "Unable to obtain user email from Blackbox provider",
        ipAddress,
        success: false,
        error: "Missing email",
      });

      return NextResponse.json(
        { success: false, message: "Failed to read user profile from Blackbox" },
        { status: 500 }
      );
    }

    const sanitizedEmail = InputSanitizer.sanitizeEmail(userInfo.email);
    let user = await SecurePrisma.findUserByEmail(sanitizedEmail, ipAddress);

    if (!user) {
      user = await SecurePrisma.createUser(
        {
          name: userInfo.name || sanitizedEmail,
          email: sanitizedEmail,
        },
        ipAddress
      );
    }

    const tokenPair = signTokenPair(user.id, user.email, user.name);

    DatabaseSecurity.logDatabaseAccess({
      userId: user.id,
      action: "BLACKBOX_OAUTH_SUCCESS",
      table: "user",
      details: "User logged in via Blackbox OAuth",
      ipAddress,
      success: true,
    });

    const redirectUrl = `${process.env.APP_URL}/blackbox-redirect?accessToken=${encodeURIComponent(
      tokenPair.accessToken
    )}&user=${encodeURIComponent(
      JSON.stringify({ id: user.id, name: user.name, email: user.email })
    )}`;

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("refreshToken", tokenPair.refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Blackbox OAuth callback error:", error);

    DatabaseSecurity.logDatabaseAccess({
      userId: undefined,
      action: "BLACKBOX_OAUTH_ERROR",
      table: "user",
      details: `Blackbox OAuth callback error: ${error.message}`,
      ipAddress,
      success: false,
      error: error.message,
    });

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = withRateLimit(RATE_LIMIT_CONFIGS.LOGIN)(
  BLACKBOX_CALLBACK_HANDLER
);
