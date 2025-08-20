import { registerSchema } from "@/validation/userRegister";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { Prisma } from "../../../../../prisma/prisma";
import { signToken } from "@/lib/jwt";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { InputSanitizer } from "@/lib/input-sanitizer";

// Apply rate limiting: 3 attempts per hour
const registerHandler = async (req: NextRequest) => {
  try {
    const body = await req.json();
    
    // Sanitize inputs before validation
    const sanitizedBody = {
      name: InputSanitizer.sanitizeString(body.name),
      email: InputSanitizer.sanitizeEmail(body.email),
      password: body.password, // Don't sanitize password
      confirmPassword: body.confirmPassword
    };

    const parsed = registerSchema.safeParse(sanitizedBody);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        message: parsed.error.errors[0].message
      }, { status: 400 });
    }

    const { name, email, password, confirmPassword } = parsed.data;

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Passwords do not match"
      }, { status: 400 });
    }

    // Additional password strength check
    const passwordCheck = InputSanitizer.validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      return NextResponse.json({
        success: false,
        message: `Weak password: ${passwordCheck.errors.join(', ')}`
      }, { status: 400 });
    }

    // Check for common patterns
    if (!InputSanitizer.checkCommonPatterns(password)) {
      return NextResponse.json({
        success: false,
        message: "Password contains common patterns that are easily guessable"
      }, { status: 400 });
    }

    // Check for sequential characters
    if (!InputSanitizer.checkSequentialCharacters(password)) {
      return NextResponse.json({
        success: false,
        message: "Password contains sequential characters"
      }, { status: 400 });
    }

    const existing = await Prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: "User already exists"
      }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12); // Increased salt rounds for better security

    const newUser = await Prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        confirmpassword: hashed
      }
    });

    // Generate JWT token for immediate login
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
};

// Export the rate-limited POST handler
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.REGISTER)(registerHandler);
