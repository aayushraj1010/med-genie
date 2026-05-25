import { genkit } from 'genkit';
import { compatOaiModelRef, openAICompatible } from '@genkit-ai/compat-oai';

const openRouterBaseUrl = process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';
const openRouterModel = process.env.OPENROUTER_MODEL ?? 'openrouter/openai/gpt-4o-mini';

export const ai = genkit({
  plugins: [
    openAICompatible({
      name: 'openrouter',
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: openRouterBaseUrl,
    }),
  ],
  model: compatOaiModelRef({ name: openRouterModel }),
});
