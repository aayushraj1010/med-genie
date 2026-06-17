// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Implements a Genkit flow for answering health-related questions using the Gemini API.
 *
 * - healthQuestionAnswering - A function that takes a health-related question and returns an answer from the AI assistant.
 * - HealthQuestionAnsweringInput - The input type for the healthQuestionAnswering function.
 * - HealthQuestionAnsweringOutput - The return type for the healthQuestionAnswering function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthQuestionAnsweringInputSchema = z.object({
  question: z.string().describe('The health-related question to be answered.'),
  medicalHistory: z.string().optional().describe('The user medical history'),
  lifestyle: z.string().optional().describe('The user lifestyle'),
  symptoms: z.string().optional().describe('The user symptoms'),
});
export type HealthQuestionAnsweringInput = z.infer<
  typeof HealthQuestionAnsweringInputSchema
>;

const HealthQuestionAnsweringOutputSchema = z.object({
  answer: z.string().describe('The answer to the health-related question.'),
  additionalQuestions: z
    .array(z.string())
    .optional()
    .describe('A list of questions to ask the user for more context.'),
});
export type HealthQuestionAnsweringOutput = z.infer<
  typeof HealthQuestionAnsweringOutputSchema
>;

export async function healthQuestionAnswering(
  input: HealthQuestionAnsweringInput
): Promise<HealthQuestionAnsweringOutput> {
  return healthQuestionAnsweringFlow(input);
}

const needsMoreInformation = ai.defineTool({
  name: 'needsMoreInformation',
  description: 'Use this to ask the user to provide more information to provide a better answer.',
  inputSchema: z.object({
    questions: z
      .array(z.string())
      .describe('The list of questions to ask the user.'),
  }),
  outputSchema: z.object({
    clarification: z.string().describe('Confirmation that information has been requested.')
  }),
},
  async (input) => {
    return {
      clarification: `I will ask the user for: ${input.questions.join(', ')}`
    };
  });

const healthQuestionAnsweringPrompt = ai.definePrompt({
  name: 'healthQuestionAnsweringPrompt',
  input: {schema: HealthQuestionAnsweringInputSchema},
  output: {schema: HealthQuestionAnsweringOutputSchema},
  tools: [needsMoreInformation],
  prompt: `You are a medical AI assistant providing health-related information.

Answer the following question:

{{question}}

Consider the following information about the user:

Medical History: {{medicalHistory}}
Lifestyle: {{lifestyle}}
Symptoms: {{symptoms}}

If you need more information to provide a better answer, use the needsMoreInformation tool to ask the user for clarification.
`, system: `You are a medical assistant chatbot.
* If a user asks a question that requires medical expertise, you will answer it.
* You should avoid providing medical advice or diagnoses. Instead, provide general information.
* If you are unsure, politely suggest that the user consult a healthcare professional.`
});

const healthQuestionAnsweringFlow = ai.defineFlow(
  {
    name: 'healthQuestionAnsweringFlow',
    inputSchema: HealthQuestionAnsweringInputSchema,
    outputSchema: HealthQuestionAnsweringOutputSchema,
  },
  async input => {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error('[Med Genie] GOOGLE_API_KEY is not set. Cannot process health question.');
      return {
        answer: "⚠️ The AI service is not configured. The server is missing a GOOGLE_API_KEY. Please contact the administrator.",
        additionalQuestions: undefined,
      };
    }

    try {
      const {output} = await healthQuestionAnsweringPrompt(input);
      return output!;
    } catch (error: any) {
      console.error('[Med Genie] Health QA flow error:', error?.message || error);
      const errorMsg = error?.message || String(error);

      if (errorMsg.includes('API_KEY') || errorMsg.includes('api_key') || errorMsg.includes('apiKey') || errorMsg.includes('API key')) {
        return {
          answer: "⚠️ The AI service API key is invalid or missing. Please check that GOOGLE_API_KEY is set correctly.",
          additionalQuestions: undefined,
        };
      }

      if (errorMsg.includes('quota') || errorMsg.includes('rate limit') || errorMsg.includes('429')) {
        return {
          answer: "⚠️ The AI service has hit its rate limit. Please try again in a few minutes.",
          additionalQuestions: undefined,
        };
      }

      return {
        answer: "😔 I encountered an error while processing your question. Please try again.",
        additionalQuestions: undefined,
      };
    }
  }
);
