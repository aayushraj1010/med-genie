import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { SecurePrisma } from "@/lib/secure-prisma";
import { DatabaseSecurity } from "@/lib/database-security";
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

    // Extract IP address for security monitoring
    const ipAddress = req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Sanitize inputs before validation
    const sanitizedBody = {
      email: InputSanitizer.sanitizeEmail(body.email),
      password: body.password // Don't sanitize password
    };

    const parsed = loginSchema.safeParse(sanitizedBody);

    if (!parsed.success) {
      // Log failed validation attempt
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'LOGIN_VALIDATION_FAILED',
        table: 'user',
        details: `Validation failed: ${parsed.error.errors[0].message}`,
        ipAddress,
        success: false,
        error: parsed.error.errors[0].message
      });

      return NextResponse.json({
        success: false,
        message: parsed.error.errors[0].message
      }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Additional email validation using database security layer
    if (!DatabaseSecurity.validateEmail(email)) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'LOGIN_INVALID_EMAIL',
        table: 'user',
        details: `Invalid email format: ${email}`,
        ipAddress,
        success: false,
        error: 'Invalid email format'
      });

      return NextResponse.json({
        success: false,
        message: "Invalid email format"
      }, { status: 400 });
    }

    // Check for suspicious IP
    if (DatabaseSecurity.isSuspiciousIP(ipAddress)) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'LOGIN_SUSPICIOUS_IP',
        table: 'user',
        details: `Suspicious IP detected: ${ipAddress}`,
        ipAddress,
        success: false,
        error: 'Suspicious IP address'
      });

      return NextResponse.json({
        success: false,
        message: "Access denied from this location"
      }, { status: 403 });
    }

    // Find user by email using secure database layer
    const user = await SecurePrisma.findUserByEmail(email, ipAddress);

    if (!user) {
      // Log failed login attempt
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'LOGIN_USER_NOT_FOUND',
        table: 'user',
        details: `User not found: ${email}`,
        ipAddress,
        success: false,
        error: 'User not found'
      });

      return NextResponse.json({
        success: false,
        message: "No user found with this email address. Please check your email or create a new account."
      }, { status: 401 });
    }

    // Check if user account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      DatabaseSecurity.logDatabaseAccess({
        userId: user.id,
        action: 'LOGIN_ACCOUNT_LOCKED',
        table: 'user',
        details: `Account locked until: ${user.lockedUntil}`,
        ipAddress,
        success: false,
        error: 'Account temporarily locked'
      });

      return NextResponse.json({
        success: false,
        message: "Account temporarily locked due to multiple failed attempts. Please try again later."
      }, { status: 423 });
    }

    // Check if user account is active
    if (!user.isActive) {
      DatabaseSecurity.logDatabaseAccess({
        userId: user.id,
        action: 'LOGIN_INACTIVE_ACCOUNT',
        table: 'user',
        details: 'Inactive account login attempt',
        ipAddress,
        success: false,
        error: 'Account inactive'
      });

      return NextResponse.json({
        success: false,
        message: "Account is inactive. Please contact support."
      }, { status: 423 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Increment failed login attempts
      try {
        await SecurePrisma.updateUser(user.id, {
          failedLoginAttempts: (user.failedLoginAttempts || 0) + 1
        }, ipAddress);
      } catch (error) {
        console.error('Failed to update login attempts:', error);
      }

      // Log failed login attempt
      DatabaseSecurity.logDatabaseAccess({
        userId: user.id,
        action: 'LOGIN_PASSWORD_MISMATCH',
        table: 'user',
        details: 'Invalid password provided',
        ipAddress,
        success: false,
        error: 'Invalid password'
      });

      return NextResponse.json({
        success: false,
        message: "Invalid email or password"
      }, { status: 401 });
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts && user.failedLoginAttempts > 0) {
      try {
        await SecurePrisma.updateUser(user.id, {
          failedLoginAttempts: 0,
          lastLoginAt: new Date()
        }, ipAddress);
      } catch (error) {
        console.error('Failed to reset login attempts:', error);
      }
    }

    // Generate JWT token pair
    const tokenPair = signTokenPair(user.id, user.email, user.name);

    // Log successful login
    DatabaseSecurity.logDatabaseAccess({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      table: 'user',
      details: 'Successful login',
      ipAddress,
      success: true
    });

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

    // Log error for security monitoring
    DatabaseSecurity.logDatabaseAccess({
      userId: undefined,
      action: 'LOGIN_ERROR',
      table: 'user',
      details: `Login error: ${error.message}`,
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      success: false,
      error: error.message
    });

    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
};

// Export the rate-limited POST handler
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.LOGIN)(loginHandler);
