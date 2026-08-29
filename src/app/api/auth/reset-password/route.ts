export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { SecurePrisma } from "@/lib/secure-prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the token
    const resetToken = await SecurePrisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    if (resetToken.expiresAt < new Date()) {
      await SecurePrisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ error: "Reset token expired" }, { status: 400 });
    }

    // Hash new password using bcryptjs instead of bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await SecurePrisma.user.findUnique({ where: { email: resetToken.email }});
    if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Update password
    await SecurePrisma.user.update({
      where: { email: resetToken.email },
      data: {
        password: hashedPassword,
        confirmpassword: hashedPassword,
        lastPasswordChange: new Date(),
        passwordVersion: user.passwordVersion + 1,
      },
    });

    // Delete token
    await SecurePrisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
