import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Prisma } from "../../../../../prisma/prisma";
import { signTokenPair } from "@/lib/jwt";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { InputSanitizer } from "@/lib/input-sanitizer";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

// Apply rate limiting: 5 attempts per 15 minutes
const loginHandler = async (req: NextRequest) => {
  try {
    const body = await req.json();

    // Sanitize inputs before validation
    const sanitizedBody = {
      email: InputSanitizer.sanitizeEmail(body.email),
      password: body.password // Don't sanitize password
    };

    const parsed = loginSchema.safeParse(sanitizedBody);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        message: parsed.error.errors[0].message
      }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Find user by email
    const user = await Prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "No user found with this email address. Please check your email or create a new account."
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password"
      }, { status: 401 });
    }

    // Generate JWT token pair
    const tokenPair = signTokenPair(user.id, user.email, user.name);

    // Return success response with token pair and user data
    return NextResponse.json({
      success: true,
      message: "Login successful",
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
};

// Export the rate-limited POST handler
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.LOGIN)(loginHandler);
