import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.user!.userId;
    const sessionId = parseInt(params.id);
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (isNaN(sessionId)) {
      return NextResponse.json({ success: false, message: 'Invalid session ID' }, { status: 400 });
    }

    // Verify session belongs to the authenticated user
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    // Delete the session
    // Prisma cascade delete will automatically delete associated ChatMessages
    await prisma.chatSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete chat session:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete session', error: error.message },
      { status: 500 }
    );
  }
}

export const DELETE = withAuth(handler as any);
