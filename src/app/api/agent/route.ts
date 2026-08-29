// src/app/api/agent/route.ts
import { NextRequest } from "next/server";
import { getAgentExecutor } from "@/ai/agent";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = "medgenie-2025" } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { response: "Please provide a valid message." },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("[Med Genie] Agent route: GEMINI_API_KEY is not set.");
      return Response.json(
        {
          response:
            "⚠️ The AI agent is not configured. The server is missing a GEMINI_API_KEY. Please contact the administrator.",
        },
        { status: 503 }
      );
    }

    const agentExecutor = await getAgentExecutor();
    const config = { configurable: { thread_id: sessionId } };

    const result = await agentExecutor.invoke(
      { messages: [{ role: "user", content: message }] },
      config
    );

    const aiResponse = result.messages[result.messages.length - 1].content;
    return Response.json({ response: aiResponse });
  } catch (error: any) {
    console.error("[Med Genie] Agent error:", error?.message || error);

    const errorMsg = error?.message || String(error);
    let userMessage = "I'm having trouble thinking right now. Try again!";

    if (
      errorMsg.includes("API_KEY") ||
      errorMsg.includes("api_key") ||
      errorMsg.includes("apiKey") ||
      errorMsg.includes("API key")
    ) {
      userMessage =
        "⚠️ The AI service API key is invalid or missing. Please check that GEMINI_API_KEY is set correctly in the server environment.";
    } else if (
      errorMsg.includes("quota") ||
      errorMsg.includes("rate limit") ||
      errorMsg.includes("429")
    ) {
      userMessage =
        "⚠️ The AI service has hit its rate limit. Please try again in a few minutes.";
    }

    return Response.json({ response: userMessage }, { status: 500 });
  }
}