import { NextRequest, NextResponse } from "next/server";
import { SecurePrisma } from "@/lib/secure-prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, email, newPassword } = body;

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await SecurePrisma.user.findUnique({
      where: { email },
    });

    if (!user || user.resetToken !== token) {
      return NextResponse.json(
        { error: "Invalid token or email" },
        { status: 400 }
      );
    }

    // Check token expiry
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Reset token expired" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await SecurePrisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        confirmpassword: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        lastPasswordChange: new Date(),
        passwordVersion: user.passwordVersion + 1,
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
