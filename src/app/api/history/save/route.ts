import { NextRequest, NextResponse } from 'next/server';
import { optionalAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;
    
    // Only save if the user is authenticated
    if (!userId) {
      return NextResponse.json({ success: true, message: 'Skipped (unauthenticated)' });
    }

    const { sessionId, title, messages } = await req.json();

    if (!sessionId || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    // Upsert the session
    const session = await prisma.chatSession.upsert({
      where: { sessionId },
      update: {
        title: title || 'New Conversation',
        updatedAt: new Date(),
      },
      create: {
        userId,
        sessionId,
        title: title || 'New Conversation',
      },
    });

    // We only append the new messages to avoid duplicating existing ones.
    // The client should send only the newest messages, or we check existing.
    // To make it robust, we can just insert all messages that don't already exist.
    // For simplicity, we assume the client sends the *last two messages* (User + AI).
    
    for (const msg of messages) {
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          content: msg.text,
          sender: msg.sender,
        }
      });
    }

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error: any) {
    console.error('Failed to save chat to database:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save chat', error: error.message },
      { status: 500 }
    );
  }
}

export const POST = optionalAuth(handler);
