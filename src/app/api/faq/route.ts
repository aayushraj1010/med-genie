import { NextResponse } from 'next/server';
import { faqs } from '@/lib/faq-data';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error('FAQ API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}
