import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Read data sent from chat page
    const body = await req.json();
    const { userId, question, aiResponse, sessionId } = body;

    // Make sure required data exists
    if (!userId || !aiResponse || !sessionId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to database
    const auditEntry = await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        content: aiResponse,
        sender: "ai",
        metadata: JSON.stringify({
          question: question,
          auditLogged: true,
          loggedAt: new Date().toISOString(),
        }),
      },
    });

    // Send back success
    return NextResponse.json({
      success: true,
      message: "Audit log saved!",
      data: auditEntry,
    });

  } catch (error: any) {
    console.error("Audit log error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
