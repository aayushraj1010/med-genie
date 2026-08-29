import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.userId;
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Delete all chat sessions for this user (cascades to messages)
    await prisma.chatSession.deleteMany({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      message: 'All chat history cleared successfully',
    });
  } catch (error: any) {
    console.error('Failed to clear chat history:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear history', error: error.message },
      { status: 500 }
    );
  }
}

export const DELETE = withAuth(handler as any);
