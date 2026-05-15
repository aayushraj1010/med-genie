import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const googleApiKey = process.env.GOOGLE_API_KEY;

if (!googleApiKey) {
  console.warn(
    'GOOGLE_API_KEY is missing. AI features may not function correctly.'
  );
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});