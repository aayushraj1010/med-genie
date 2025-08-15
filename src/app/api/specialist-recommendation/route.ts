import { NextRequest, NextResponse } from 'next/server';
import { specialistRecommendation } from '@/ai/flows/specialist-recommendation';
import { z } from 'zod';

// Input validation schema
const SpecialistRecommendationRequestSchema = z.object({
  symptoms: z.string().min(1, 'Symptoms are required'),
  age: z.number().int().min(0).max(150).optional(),
  gender: z.string().optional(),
  location: z.string().optional(),
  medicalHistory: z.string().optional(),
  urgency: z.enum(['low', 'medium', 'high']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedInput = SpecialistRecommendationRequestSchema.parse(body);
    
    // Call the AI flow
    const result = await specialistRecommendation(validatedInput);
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Specialist recommendation API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          details: error.errors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get specialist recommendations'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Specialist recommendation endpoint',
      usage: 'POST with symptoms, age, gender, location, medicalHistory, urgency'
    },
    { status: 200 }
  );
}