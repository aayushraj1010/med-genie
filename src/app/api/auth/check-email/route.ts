import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { Prisma } from "../../../../../prisma/prisma";

const checkEmailSchema = z.object({
  email: z.string().email("Invalid email address")
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkEmailSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        message: parsed.error.errors[0].message
      }, { status: 400 });
    }

    const { email } = parsed.data;

    // Check if user exists
    const user = await Prisma.user.findUnique({ 
      where: { email },
      select: { id: true }
    });

    return NextResponse.json({
      success: true,
      exists: !!user,
      message: user ? "Email is already registered" : "Email is available"
    }, { status: 200 });

  } catch (error: any) {
    console.error('Check email error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}
