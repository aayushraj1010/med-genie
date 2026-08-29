// src/ai/agent.ts - Fixed for LangGraph 0.3+ (Nov 2025)
import { createReactAgent } from "@langchain/langgraph/prebuilt";  // ← FIXED: New path for prebuilt ReAct agent
import { pull } from "langchain/hub";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { searchTool, calculatorTool } from "./tools";
import { MemorySaver } from "@langchain/langgraph";

// Memory for conversation history (stateful agent)
const memory = new MemorySaver();

// Defer llm initialization to prevent build errors when env vars are missing
let llm: ChatGoogleGenerativeAI;

function getLLM() {
  if (!llm) {
    llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0.7,
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "dummy-key-for-build",
    });
  }
  return llm;
}

// Lazy-load the agent (avoids top-level await issues)
let agentExecutor: any;

export async function getAgentExecutor() {
  if (agentExecutor) return agentExecutor;

  // Pull the ReAct prompt asynchronously
  const prompt = await pull("hwchase17/react");

  // FIXED: Create ReAct agent with tools, prompt, and memory
  agentExecutor = createReactAgent({
    llm: getLLM(),
    tools: [searchTool, calculatorTool],
    prompt,
    checkpointSaver: memory,  // Enables memory across sessions
  });

  return agentExecutor;
}