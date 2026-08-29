import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.user!.userId;
    const reminderId = parseInt(params.id, 10);
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (isNaN(reminderId)) {
      return NextResponse.json({ success: false, message: 'Invalid reminder ID' }, { status: 400 });
    }

    // Ensure the reminder belongs to the user
    const existingReminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
    });

    if (!existingReminder || existingReminder.userId !== userId) {
      return NextResponse.json({ success: false, message: 'Reminder not found' }, { status: 404 });
    }

    if (req.method === 'PUT') {
      const body = await req.json();
      const { name, dosage, frequency, time, isActive } = body;

      const updatedReminder = await prisma.reminder.update({
        where: { id: reminderId },
        data: {
          name: name !== undefined ? name : existingReminder.name,
          dosage: dosage !== undefined ? dosage : existingReminder.dosage,
          frequency: frequency !== undefined ? frequency : existingReminder.frequency,
          time: time !== undefined ? time : existingReminder.time,
          isActive: isActive !== undefined ? isActive : existingReminder.isActive,
        },
      });

      return NextResponse.json({
        success: true,
        reminder: updatedReminder,
      });
    }

    if (req.method === 'DELETE') {
      await prisma.reminder.delete({
        where: { id: reminderId },
      });

      return NextResponse.json({
        success: true,
        message: 'Reminder deleted successfully',
      });
    }

    return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
  } catch (error: any) {
    console.error(`API /api/reminders/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);
