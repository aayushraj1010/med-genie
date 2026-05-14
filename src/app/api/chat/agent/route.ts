// In src/app/api/chat/agent/route.ts (keep the try/catch as-is)
import { NextRequest, NextResponse } from "next/server";
import { getAgentExecutor } from "@/ai/agent";  // ← Uses the fixed async getter

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = "medgenie-2025" } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { response: "Please provide a message." },
        { status: 400 }
      );
    }
    
    const agentExecutor = await getAgentExecutor();  // ← Await the fixed executor

    const config = { configurable: { thread_id: sessionId } };

    const result = await agentExecutor.invoke(
      { messages: [{ role: "user", content: message }] },
      config
    );

    const aiResponse = result.messages[result.messages.length - 1].content;

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Agent error:", error);
    
    // Return more helpful error message
    const errorMessage = error?.message?.includes("API key") 
      ? "API configuration error. Please contact the administrator."
      : "I apologize, but I'm having trouble processing your request right now. Please try again.";
    
    return NextResponse.json(
      { response: errorMessage },
      { status: 500 }
    );
  }
}