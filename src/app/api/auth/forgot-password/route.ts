import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { Prisma } from "../../../../../prisma/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user safely
    let user;
    try {
      user = await Prisma.user.findUnique({
        where: { email },
      });
    } catch (dbErr) {
      console.error("Database error:", dbErr);
      return NextResponse.json(
        { error: "Database temporarily unavailable" },
        { status: 503 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Save token safely
    try {
      await Prisma.user.update({
        where: { email },
        data: {
          resetToken: token,
          resetTokenExpiry: expiry,
        },
      });
    } catch (dbErr) {
      console.error("Database error on update:", dbErr);
      return NextResponse.json(
        { error: "Failed to save reset token" },
        { status: 503 }
      );
    }

    // Build reset URL
    const resetUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email
    const html = `
      <p>Hello ${user.name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({ to: email, subject: "MedGenie Password Reset", html });

    return NextResponse.json({
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
