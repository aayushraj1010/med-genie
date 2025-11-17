// src/ai/agent.ts - Fixed for LangGraph 0.3+ (Nov 2025)
import { createReactAgent } from "@langchain/langgraph/prebuilt";  // ← FIXED: New path for prebuilt ReAct agent
import { pull } from "langchain/hub";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { searchTool, calculatorTool } from "./tools";
import { MemorySaver } from "@langchain/langgraph";

// Memory for conversation history (stateful agent)
const memory = new MemorySaver();

// Gemini model setup
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.7,
  apiKey: process.env.GEMINI_API_KEY,  // Ensure this is in .env.local
});

// Lazy-load the agent (avoids top-level await issues)
let agentExecutor: any;

export async function getAgentExecutor() {
  if (agentExecutor) return agentExecutor;

  // Pull the ReAct prompt asynchronously
  const prompt = await pull("hwchase17/react");

  // FIXED: Create ReAct agent with tools, prompt, and memory
  agentExecutor = createReactAgent({
    llm,
    tools: [searchTool, calculatorTool],
    prompt,
    checkpointSaver: memory,  // Enables memory across sessions
  });

  return agentExecutor;
}