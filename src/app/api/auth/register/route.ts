import { registerSchema } from "@/validation/userRegister";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { SecurePrisma } from "@/lib/secure-prisma";
import { DatabaseSecurity } from "@/lib/database-security";
import { signTokenPair } from "@/lib/jwt";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { InputSanitizer } from "@/lib/input-sanitizer";

// Apply rate limiting: 3 attempts per hour
const registerHandler = async (req: NextRequest) => {
  try {
    const body = await req.json();

    // Extract IP address for security monitoring
    const ipAddress = req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Sanitize inputs before validation
    const sanitizedBody = {
      name: InputSanitizer.sanitizeString(body.name),
      email: InputSanitizer.sanitizeEmail(body.email),
      password: body.password, // Don't sanitize password
      confirmPassword: body.confirmPassword
    };

    const parsed = registerSchema.safeParse(sanitizedBody);
    if (!parsed.success) {
      // Log failed validation attempt
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'REGISTER_VALIDATION_FAILED',
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

    const { name, email, password, confirmPassword } = parsed.data;

    if (password !== confirmPassword) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'REGISTER_PASSWORD_MISMATCH',
        table: 'user',
        details: 'Password confirmation mismatch',
        ipAddress,
        success: false,
        error: 'Passwords do not match'
      });

      return NextResponse.json({
        success: false,
        message: "Passwords do not match"
      }, { status: 400 });
    }

    // Additional password strength check
    const passwordCheck = InputSanitizer.validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'REGISTER_WEAK_PASSWORD',
        table: 'user',
        details: `Weak password: ${passwordCheck.errors.join(', ')}`,
        ipAddress,
        success: false,
        error: 'Weak password'
      });

      return NextResponse.json({
        success: false,
        message: `Weak password: ${passwordCheck.errors.join(', ')}`
      }, { status: 400 });
    }

    // Check for common patterns
    if (!InputSanitizer.checkCommonPatterns(password)) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'REGISTER_COMMON_PASSWORD',
        table: 'user',
        details: 'Password contains common patterns',
        ipAddress,
        success: false,
        error: 'Common password pattern'
      });

      return NextResponse.json({
        success: false,
        message: "Password contains common patterns that are easily guessable"
      }, { status: 400 });
    }

    // Check for sequential characters
    if (!InputSanitizer.checkSequentialCharacters(password)) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'REGISTER_SEQUENTIAL_PASSWORD',
        table: 'user',
        details: 'Password contains sequential characters',
        ipAddress,
        success: false,
        error: 'Sequential characters'
      });

      return NextResponse.json({
        success: false,
        message: "Password contains sequential characters"
      }, { status: 400 });
    }

    // Check for suspicious IP
    if (DatabaseSecurity.isSuspiciousIP(ipAddress)) {
      DatabaseSecurity.logDatabaseAccess({
        userId: undefined,
        action: 'REGISTER_SUSPICIOUS_IP',
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

    // Check if user already exists using secure database layer
    try {
      const existing = await SecurePrisma.findUserByEmail(email, ipAddress);
      if (existing) {
        DatabaseSecurity.logDatabaseAccess({
          userId: undefined,
          action: 'REGISTER_USER_EXISTS',
          table: 'user',
          details: `User already exists: ${email}`,
          ipAddress,
          success: false,
          error: 'User already exists'
        });

        return NextResponse.json({
          success: false,
          message: "User already exists"
        }, { status: 400 });
      }
    } catch (error) {
      // If user not found, continue with registration
      if (error instanceof Error && error.message.includes('User not found')) {
        // Continue with registration
      } else {
        throw error;
      }
    }

    const hashed = await bcrypt.hash(password, 12); // Increased salt rounds for better security

    // Create user using secure database layer
    const newUser = await SecurePrisma.createUser({
      name,
      email,
      password: hashed,
      confirmPassword: hashed
    }, ipAddress);

    // Generate JWT token pair for immediate login
    const tokenPair = signTokenPair(newUser.id, newUser.email, newUser.name);

    // Log successful registration
    DatabaseSecurity.logDatabaseAccess({
      userId: newUser.id,
      action: 'REGISTER_SUCCESS',
      table: 'user',
      details: `New user registered: ${newUser.email}`,
      ipAddress,
      success: true
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);

    // Log error for security monitoring
    DatabaseSecurity.logDatabaseAccess({
      userId: undefined,
      action: 'REGISTER_ERROR',
      table: 'user',
      details: `Registration error: ${error.message}`,
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
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.REGISTER)(registerHandler);
