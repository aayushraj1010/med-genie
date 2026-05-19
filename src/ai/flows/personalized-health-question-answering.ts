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
  conversationHistory: z.string().optional().describe('Previous messages in the conversation for context.'),
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
  wellnessSuggestions: z
    .array(z.string())
    .optional()
    .describe('Brief contextual wellness suggestions to promote general health and prevention.'),
  preventiveCare: z
    .array(z.string())
    .optional()
    .describe('Basic preventive care recommendations relevant to the question.'),
  whenToSeeDoctor: z
    .string()
    .optional()
    .describe('Clear guidance on warning signs or situations when medical consultation is recommended.'),
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

IMPORTANT: Use available conversation history to provide personalized, non-diagnostic information. Always include clear, brief educational and preventive information when relevant.

You MUST respond in JSON format. The JSON object should conform to the following structure:
{
  "answer": "string (REQUIRED) - direct, user-facing explanation or guidance. Avoid definitive medical diagnoses.",
  "followUpQuestion": "string (OPTIONAL) - a concise question to request missing details, if necessary.",
  "wellnessSuggestions": ["string"] (OPTIONAL) - 2-4 short, actionable wellness tips relevant to the user's concern.
  "preventiveCare": ["string"] (OPTIONAL) - 1-4 basic preventive care recommendations (e.g., vaccinations, screenings, lifestyle changes) when applicable.
  "whenToSeeDoctor": "string (OPTIONAL) - clear, simple indicators or red flags that should prompt medical consultation or urgent care. Use plain language."
}

Example (Direct Answer with Wellness Info):
User question: "I have a sore throat and mild fever. What should I do?"
Your JSON response:
{
  "answer": "A sore throat with a mild fever can be due to a viral infection or mild pharyngitis. Rest, stay hydrated, and monitor your symptoms.",
  "wellnessSuggestions": ["Drink warm fluids and rest", "Use throat lozenges or saltwater gargles for comfort", "Avoid smoking and irritants"],
  "preventiveCare": ["Wash hands frequently to reduce spread", "Stay home while febrile to avoid infecting others"],
  "whenToSeeDoctor": "Seek medical attention if you have difficulty breathing, inability to swallow, high fever (>39°C / 102°F), or symptoms that worsen or persist beyond a few days."
}

If you need more information before answering, set "answer" to a brief request for information and include a specific "followUpQuestion".

Carefully review the user's input:
Question: {{{question}}}
Medical History: {{{medicalHistory}}}
Lifestyle: {{{lifestyle}}}
Symptoms: {{{symptoms}}}
Previous Conversation: {{{conversationHistory}}}

Generate the JSON response matching the schema above. Avoid giving definitive medical diagnoses; when unsure, advise the user to consult a healthcare professional.
`,
  prompt: `User Input:
Question: {{{question}}}
Medical History: {{{medicalHistory}}}
Lifestyle: {{{lifestyle}}}
Symptoms: {{{symptoms}}}
Previous Conversation: {{{conversationHistory}}}

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