// 'use server'
'use server';

/**
 * @fileOverview Implements personalized health question answering using Genkit and Gemini.
 *
 * This file defines a Genkit flow that takes a user's health-related question as input,
 * uses the Gemini API to provide an answer, and optionally asks the user follow up questions
 * about their medical history, lifestyle, and symptoms to improve the precision of the answer.
 *
 * @module src/ai/flows/personalized-health-question-answering
 *
 * @interface PersonalizedHealthQuestionAnsweringInput - Defines the input schema for the flow.
 * @interface PersonalizedHealthQuestionAnsweringOutput - Defines the output schema for the flow.
 * @function personalizedHealthQuestionAnswering - The main exported function to start the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHealthQuestionAnsweringInputSchema = z.object({
  question: z.string().describe('The user\u0027s health-related question.'),
  medicalHistory: z.string().optional().describe('The user\u0027s medical history.'),
  lifestyle: z.string().optional().describe('The user\u0027s lifestyle information.'),
  symptoms: z.string().optional().describe('The user\u0027s symptoms.'),
});
export type PersonalizedHealthQuestionAnsweringInput = z.infer<
  typeof PersonalizedHealthQuestionAnsweringInputSchema
>;

const PersonalizedHealthQuestionAnsweringOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user\u0027s question, or a statement indicating more information is needed.'),
  followUpQuestion: z
    .string()
    .optional()
    .describe('A follow-up question to ask the user for more information.'),
});
export type PersonalizedHealthQuestionAnsweringOutput = z.infer<
  typeof PersonalizedHealthQuestionAnsweringOutputSchema
>;

export async function personalizedHealthQuestionAnswering(
  input: PersonalizedHealthQuestionAnsweringInput
): Promise<PersonalizedHealthQuestionAnsweringOutput> {
  return personalizedHealthQuestionAnsweringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHealthQuestionAnsweringPrompt',
  input: {schema: PersonalizedHealthQuestionAnsweringInputSchema},
  output: {schema: PersonalizedHealthQuestionAnsweringOutputSchema},
  // Tools removed as the LLM is now instructed to directly output the JSON
  system: `You are a medical AI assistant. Your goal is to answer the user's question or ask for more information if needed.
You MUST respond in JSON format. The JSON object should conform to the following structure:
{
  "answer": "string (This field is REQUIRED. It should contain the direct answer to the user's question. If you need to ask a follow-up question, this field should state that more information is needed, e.g., 'I need more information to help you effectively.')",
  "followUpQuestion": "string (This field is OPTIONAL. If you need more details from the user to provide a complete answer, include your specific follow-up question here. Otherwise, omit this field or provide an empty string.)"
}

Example 1 (Direct Answer):
User question: "What are common flu symptoms?"
Your JSON response:
{
  "answer": "Common flu symptoms include fever, cough, sore throat, runny or stuffy nose, muscle or body aches, headaches, and fatigue."
}

Example 2 (Need More Information):
User question: "I have a cough, what could it be?"
Your JSON response:
{
  "answer": "To understand what might be causing your cough, I need a bit more information.",
  "followUpQuestion": "Could you tell me more about your cough (e.g., is it dry or wet, how long have you had it) and if you have any other symptoms like fever or shortness of breath?"
}

Carefully review the user's input:
Question: {{{question}}}
Medical History: {{{medicalHistory}}}
Lifestyle: {{{lifestyle}}}
Symptoms: {{{symptoms}}}

Based on this, decide if you can answer directly or if a follow-up question is necessary, and then generate the JSON response as described.
You should avoid providing medical advice or diagnoses. Instead, provide general information. If you are unsure, politely suggest that the user consult a healthcare professional.
`,
  prompt: `User Input:
Question: {{{question}}}
Medical History: {{{medicalHistory}}}
Lifestyle: {{{lifestyle}}}
Symptoms: {{{symptoms}}}

Generate your JSON response:`,
});

const personalizedHealthQuestionAnsweringFlow = ai.defineFlow(
  {
    name: 'personalizedHealthQuestionAnsweringFlow',
    inputSchema: PersonalizedHealthQuestionAnsweringInputSchema,
    outputSchema: PersonalizedHealthQuestionAnsweringOutputSchema,
  },
  async input => {
    const result = await prompt(input);

    if (!result.output) {
      // This case should be rare if the LLM adheres to the prompt and schema.
      // Genkit's validation against outputSchema would likely throw an error before this.
      console.error('Personalized Health QA Flow: No valid output from AI model matching the expected schema.', result);
      // Fallback to a generic error response that fits the schema
      return {
        answer: "I'm sorry, I encountered an issue processing your request. Please try again.",
        followUpQuestion: undefined,
      };
    }
    
    // `result.output` is guaranteed by Genkit (if no error during prompt execution) 
    // to conform to PersonalizedHealthQuestionAnsweringOutputSchema.
    // So, result.output.answer exists, and result.output.followUpQuestion is optional.
    return result.output;
  }
);