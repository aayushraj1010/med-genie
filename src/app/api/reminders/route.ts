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

    if (req.method === 'GET') {
      const reminders = await prisma.reminder.findMany({
        where: {
          userId: userId,
          isActive: true,
        },
        orderBy: {
          time: 'asc',
        },
      });

      return NextResponse.json({
        success: true,
        reminders,
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const { name, dosage, frequency, time } = body;

      if (!name || !frequency || !time) {
        return NextResponse.json(
          { success: false, message: 'Name, frequency, and time are required' },
          { status: 400 }
        );
      }

      const reminder = await prisma.reminder.create({
        data: {
          userId,
          name,
          dosage,
          frequency,
          time,
        },
      });

      return NextResponse.json({
        success: true,
        reminder,
      }, { status: 201 });
    }

    return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
  } catch (error: any) {
    console.error('API /api/reminders error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
