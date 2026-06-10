import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { SecurePrisma } from '@/lib/secure-prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.userId;
    
    // Check if user is authenticated properly
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's chat sessions ordered by date descending
    const chatSessions = await prisma.chatSession.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        messages: {
          orderBy: {
            timestamp: 'asc',
          },
          take: 1, // Only need the first message for the preview
        },
        _count: {
          select: { messages: true }
        }
      },
    });

    // Format the response
    const formattedHistory = chatSessions.map((session) => ({
      id: session.id,
      sessionId: session.sessionId,
      title: session.title || 'New Conversation',
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: session._count.messages,
      preview: session.messages.length > 0 ? session.messages[0].content : 'Empty conversation',
    }));

    return NextResponse.json({
      success: true,
      sessions: formattedHistory,
    });
  } catch (error: any) {
    console.error('Failed to fetch chat history:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch history', error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
