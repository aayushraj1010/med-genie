// In src/app/api/chat/agent/route.ts (keep the try/catch as-is)
import { getAgentExecutor } from "@/ai/agent";  // ← Uses the fixed async getter

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = "medgenie-2025" } = await req.json();
    const agentExecutor = await getAgentExecutor();  // ← Await the fixed executor

    const config = { configurable: { thread_id: sessionId } };

    const result = await agentExecutor.invoke(
      { messages: [{ role: "user", content: message }] },
      config
    );

    const aiResponse = result.messages[result.messages.length - 1].content;

    return Response.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Agent error:", error);
    return Response.json(
      { response: "I'm having trouble thinking right now. Try again!" },
      { status: 500 }
    );
  }
}