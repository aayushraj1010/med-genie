import { NextRequest, NextResponse } from "next/server";
import { SecurePrisma } from "@/lib/secure-prisma";
import { DatabaseSecurity } from "@/lib/database-security";
import { signTokenPair } from "@/lib/jwt";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import jwt from "jsonwebtoken";

const GOOGLE_CALLBACK_HANDLER = async (req: NextRequest) => {
  const ipAddress =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: "GOOGLE_OAUTH_NO_CODE",
        table: "user",
        details: "Google OAuth callback missing code",
        ipAddress,
        success: false,
        error: "No code provided",
      });
      return NextResponse.json(
        { success: false, message: "Missing authorization code" },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: "GOOGLE_OAUTH_TOKEN_ERROR",
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

    const tokenData = await tokenRes.json();
    const { id_token } = tokenData;

    if (!id_token) {
      return NextResponse.json(
        { success: false, message: "No ID token returned by Google" },
        { status: 500 }
      );
    }

    const userInfo = jwt.decode(id_token) as any;

    if (!userInfo?.email) {
      return NextResponse.json(
        { success: false, message: "Failed to decode user info" },
        { status: 500 }
      );
    }

    // Check if user exists, otherwise create
    let user = await SecurePrisma.findUserByEmail(userInfo.email, ipAddress);
    if (!user) {
      user = await SecurePrisma.createUser(
        {
          name: userInfo.name || userInfo.email,
          email: userInfo.email,
          password: "", // OAuth users don't need password
        },
        ipAddress
      );
    }

    // Generate JWT token pair
    const tokenPair = signTokenPair(user.id, user.email, user.name);

    // Log successful OAuth login
    DatabaseSecurity.logDatabaseAccess({
      userId: user.id,
      action: "GOOGLE_OAUTH_SUCCESS",
      table: "user",
      details: "User logged in via Google OAuth",
      ipAddress,
      success: true,
    });

    // redirect to frontend route with accessToken
    const redirectUrl = `${
      process.env.APP_URL
    }/google-redirect?accessToken=${
      tokenPair.accessToken
    }&user=${encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    )}`;

    const response = NextResponse.redirect(redirectUrl);

    // Set refresh token as HttpOnly cookie
    response.cookies.set("refreshToken", tokenPair.refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Google OAuth callback error:", error);

    DatabaseSecurity.logDatabaseAccess({
      userId: undefined,
      action: "GOOGLE_OAUTH_ERROR",
      table: "user",
      details: `Google OAuth callback error: ${error.message}`,
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

// rate-limit Google OAuth callback
export const GET = withRateLimit(RATE_LIMIT_CONFIGS.LOGIN)(
  GOOGLE_CALLBACK_HANDLER
);
