'use server';

/**
 * @fileOverview Implements a Genkit flow for recommending medical specialists based on symptoms and user profile.
 *
 * - specialistRecommendation - A function that analyzes symptoms and recommends appropriate medical specialists.
 * - SpecialistRecommendationInput - The input type for the specialist recommendation function.
 * - SpecialistRecommendationOutput - The return type for the specialist recommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpecialistRecommendationInputSchema = z.object({
  symptoms: z.string().describe('The symptoms or health concerns described by the user.'),
  age: z.string().optional().describe('The user age'),
  gender: z.string().optional().describe('The user gender'),
  location: z.string().optional().describe('The user location'),
  medicalHistory: z.string().optional().describe('The user medical history'),
  duration: z.string().optional().describe('How long the symptoms have been present'),
  severity: z.string().optional().describe('The severity of the symptoms'),
});

export type SpecialistRecommendationInput = z.infer<
  typeof SpecialistRecommendationInputSchema
>;

const SpecialistRecommendationSchema = z.object({
  specialty: z.string().describe('The medical specialty (e.g., Cardiologist, Dermatologist, etc.)'),
  description: z.string().describe('Brief description of what this specialist treats'),
  urgency: z.enum(['low', 'medium', 'high']).describe('The urgency level for seeing this specialist'),
  reason: z.string().describe('Why this specialist is recommended based on the symptoms'),
  additionalInfo: z.string().optional().describe('Additional information or next steps'),
});

const SpecialistRecommendationOutputSchema = z.object({
  recommendations: z.array(SpecialistRecommendationSchema).describe('List of recommended specialists'),
  disclaimers: z.array(z.string()).optional().describe('Important medical disclaimers'),
});

export type SpecialistRecommendationOutput = z.infer<
  typeof SpecialistRecommendationOutputSchema
>;

export async function specialistRecommendation(
  input: SpecialistRecommendationInput
): Promise<SpecialistRecommendationOutput> {
  return specialistRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'specialistRecommendationPrompt',
  input: { schema: SpecialistRecommendationInputSchema },
  output: { schema: SpecialistRecommendationOutputSchema },
  system: `You are a medical AI assistant that helps users find appropriate medical specialists based on their symptoms and health profile.

IMPORTANT: You MUST respond in JSON format that conforms to the following structure:
{
  "recommendations": [
    {
      "specialty": "Medical Specialty Name",
      "description": "Brief description of what this specialist treats",
      "urgency": "low" | "medium" | "high",
      "reason": "Why this specialist is recommended based on the symptoms",
      "additionalInfo": "Optional additional information or next steps"
    }
  ],
  "disclaimers": [
    "Important medical disclaimers"
  ]
}

Guidelines:
1. Analyze symptoms carefully and recommend 1-3 most appropriate specialists
2. If symptoms indicate emergency (chest pain with breathing issues, stroke symptoms, severe allergic reactions), recommend Emergency Medicine with HIGH urgency
3. Consider age, gender, medical history when making recommendations
4. Provide clear reasons for each recommendation
5. Include relevant disclaimers about seeking professional medical advice
6. Set appropriate urgency levels based on symptom severity and duration

Common specialists:
- Primary Care Physician (General Medicine)
- Cardiologist (Heart conditions)
- Dermatologist (Skin conditions)  
- Orthopedic Surgeon (Bone/joint issues)
- Neurologist (Nervous system)
- Gastroenterologist (Digestive system)
- Pulmonologist (Lung conditions)
- Endocrinologist (Hormonal disorders)
- Rheumatologist (Autoimmune conditions)
- Ophthalmologist (Eye conditions)
- ENT Specialist (Ear, Nose, Throat)
- Urologist (Urinary system)
- Gynecologist (Women's health)
- Psychiatrist/Psychologist (Mental health)
- Emergency Medicine (Urgent care)`,
  prompt: `User Input:
Symptoms: {{{symptoms}}}
Age: {{{age}}}
Gender: {{{gender}}}
Location: {{{location}}}
Medical History: {{{medicalHistory}}}
Duration: {{{duration}}}
Severity: {{{severity}}}

Analyze the symptoms and provide specialist recommendations in JSON format:`,
});

const specialistRecommendationFlow = ai.defineFlow(
  {
    name: 'specialistRecommendationFlow',
    inputSchema: SpecialistRecommendationInputSchema,
    outputSchema: SpecialistRecommendationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
