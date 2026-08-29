import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get userId from the URL
    // Example: /api/audit/history?userId=1
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Make sure userId exists
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    // Find all chat sessions for this user
    const chatSessions = await prisma.chatSession.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        messages: {
          where: {
            sender: "ai",
          },
          orderBy: {
            timestamp: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format data as tree structure
    const treeData = {
      name: "My Health History",
      children: chatSessions.map((session) => ({
        name: new Date(session.createdAt).toLocaleDateString(),
        children: session.messages.map((msg) => ({
          name: msg.content.substring(0, 50) + "...",
          attributes: {
            time: new Date(msg.timestamp).toLocaleTimeString(),
          },
        })),
      })),
    };

    // Send back the tree data
    return NextResponse.json({
      success: true,
      data: treeData,
    });

  } catch (error: any) {
    console.error("Audit history error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
