'use server';

/**
 * @fileOverview Implements specialist recommendation flow using Genkit and Gemini.
 *
 * This file defines a Genkit flow that takes user's symptoms, medical concerns,
 * demographics, and location to recommend appropriate medical specialists.
 *
 * @module src/ai/flows/specialist-recommendation
 *
 * @interface SpecialistRecommendationInput - Defines the input schema for the flow.
 * @interface SpecialistRecommendationOutput - Defines the output schema for the flow.
 * @function specialistRecommendation - The main exported function to start the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpecialistRecommendationInputSchema = z.object({
  symptoms: z.string().describe('The user\'s symptoms or medical concerns.'),
  age: z.number().optional().describe('The user\'s age.'),
  gender: z.string().optional().describe('The user\'s gender.'),
  location: z.string().optional().describe('The user\'s location for better personalization.'),
  medicalHistory: z.string().optional().describe('Any relevant medical history.'),
  urgency: z.enum(['low', 'medium', 'high']).optional().describe('The urgency level of the condition.'),
});
export type SpecialistRecommendationInput = z.infer<
  typeof SpecialistRecommendationInputSchema
>;

const SpecialistRecommendationOutputSchema = z.object({
  recommendedSpecialists: z.array(z.object({
    specialistType: z.string().describe('The type of medical specialist (e.g., Cardiologist, Dermatologist).'),
    reason: z.string().describe('Why this specialist is recommended for the symptoms.'),
    urgency: z.enum(['low', 'medium', 'high']).describe('Recommended urgency level for seeing this specialist.'),
    additionalInfo: z.string().optional().describe('Additional information or preparation tips.')
  })).describe('List of recommended specialists.'),
  generalAdvice: z.string().describe('General advice or next steps for the user.'),
  disclaimer: z.string().describe('Medical disclaimer about seeking professional medical care.')
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
  input: {schema: SpecialistRecommendationInputSchema},
  output: {schema: SpecialistRecommendationOutputSchema},
  system: `You are a medical AI assistant specialized in recommending appropriate medical specialists based on symptoms and patient information.

IMPORTANT: You MUST respond in valid JSON format that matches the expected schema.

Your task is to analyze the symptoms and patient information to recommend appropriate medical specialists. Consider:
- The specific symptoms described
- Patient demographics (age, gender) if provided
- Medical history if available
- Urgency level based on symptom severity

Common medical specialists include:
- Cardiologist (heart conditions)
- Dermatologist (skin conditions)
- Orthopedic Surgeon (bone/joint issues)
- Neurologist (nervous system)
- Gastroenterologist (digestive system)
- Endocrinologist (hormonal conditions)
- Pulmonologist (lung conditions)
- Rheumatologist (autoimmune/joint conditions)
- Urologist (urinary system)
- Gynecologist (women's health)
- Ophthalmologist (eye conditions)
- ENT Specialist (ear, nose, throat)
- Psychiatrist (mental health)
- General Practitioner (primary care)

Respond with a JSON object containing:
1. An array of recommended specialists with reasons and urgency
2. General advice for the patient
3. A clear medical disclaimer

Always include a disclaimer that this is not a substitute for professional medical diagnosis.`,
  prompt: `Based on the following patient information, recommend appropriate medical specialists:

Symptoms: {{{symptoms}}}
Age: {{{age}}}
Gender: {{{gender}}}
Location: {{{location}}}
Medical History: {{{medicalHistory}}}
Urgency: {{{urgency}}}

Provide specialist recommendations in the required JSON format.`
});

const specialistRecommendationFlow = ai.defineFlow(
  {
    name: 'specialistRecommendationFlow',
    inputSchema: SpecialistRecommendationInputSchema,
    outputSchema: SpecialistRecommendationOutputSchema,
  },
  async input => {
    const result = await prompt(input);

    if (!result.output) {
      console.error('Specialist Recommendation Flow: No valid output from AI model matching the expected schema.', result);
      // Fallback response
      return {
        recommendedSpecialists: [
          {
            specialistType: 'General Practitioner',
            reason: 'For initial evaluation and assessment of your symptoms.',
            urgency: 'medium' as const,
            additionalInfo: 'A general practitioner can provide initial assessment and refer you to appropriate specialists if needed.'
          }
        ],
        generalAdvice: 'Please consult with a healthcare professional for proper diagnosis and treatment recommendations.',
        disclaimer: 'This recommendation is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers.'
      };
    }
    
    return result.output;
  }
);