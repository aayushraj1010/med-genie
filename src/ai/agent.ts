// src/ai/agent.ts - Fixed for LangGraph 0.3+ (Nov 2025)
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { pull } from "langchain/hub";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { searchTool, calculatorTool } from "./tools";
import { MemorySaver } from "@langchain/langgraph";

// Memory for conversation history (stateful agent)
const memory = new MemorySaver();

// Lazy-load the agent AND the LLM (avoids top-level throw when API key is missing)
let agentExecutor: any;

export async function getAgentExecutor() {
  if (agentExecutor) return agentExecutor;

  // Validate API key at call time, not module load time
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiApiKey) {
    throw new Error(
      '[Med Genie] GEMINI_API_KEY is not set. Get a key at https://aistudio.google.com/apikey and add it to .env.local'
    );
  }

  // Create the LLM only when actually needed
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0.7,
    apiKey: geminiApiKey,
  });

  // Pull the ReAct prompt asynchronously
  const prompt = await pull("hwchase17/react");

  // Create ReAct agent with tools, prompt, and memory
  agentExecutor = createReactAgent({
    llm,
    tools: [searchTool, calculatorTool],
    prompt,
    checkpointSaver: memory,
  });

  return agentExecutor;
}