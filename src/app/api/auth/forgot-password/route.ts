import { NextRequest, NextResponse } from "next/server";
import { SecurePrisma } from "@/lib/secure-prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await SecurePrisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Prevent enumeration
      return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Save to PasswordResetToken table
    await SecurePrisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    console.log('\n=======================================');
    console.log(`PASSWORD RESET LINK FOR ${email}:`);
    console.log(resetUrl);
    console.log('=======================================\n');

    // Attempt email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Med Genie" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Reset your Med Genie password',
          html: `
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password for Med Genie.</p>
            <p>Click the link below to set a new password. This link expires in 15 minutes.</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>If you didn't request this, you can safely ignore this email.</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
