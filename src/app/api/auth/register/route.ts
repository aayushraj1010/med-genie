import { registerSchema } from "@/validation/userRegister";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { Prisma } from "../../../../../prisma/prisma";

export async function POST(req: NextRequest) {
  try {
    
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
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

    const existing = await Prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: "User already exists"
      }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await Prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        confirmpassword : hashed
      }
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: newUser
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}
