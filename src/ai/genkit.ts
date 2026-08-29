import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Validate that the required API key is present at startup
const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  console.warn(
    '[Med Genie] ⚠️  GOOGLE_API_KEY is not set. AI chat features will not work.\n' +
    '  Get a key at: https://aistudio.google.com/apikey\n' +
    '  Then add GOOGLE_API_KEY=your-key to .env.local'
  );
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
