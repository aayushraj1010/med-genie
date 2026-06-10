import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.user!.userId;
    const sessionIdStr = params.id;
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Verify session belongs to the authenticated user
    const session = await prisma.chatSession.findUnique({
      where: { sessionId: sessionIdStr },
      include: {
        messages: {
          orderBy: {
            timestamp: 'asc',
          }
        }
      }
    });

    if (!session || session.userId !== userId) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        sessionId: session.sessionId,
        title: session.title,
        createdAt: session.createdAt,
        messages: session.messages.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp,
        }))
      }
    });
  } catch (error: any) {
    console.error('Failed to fetch chat messages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch messages', error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler as any);
