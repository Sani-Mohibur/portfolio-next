import Groq from "groq-sdk";
import { SYSTEM_PROMPT, AI_MODEL, GENERATION_CONFIG } from "@/src/app/lib/ai-config";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "AI service is not configured. Please set the GROQ_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages } = body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    // Build messages array with system prompt
    const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    const groq = new Groq({ apiKey });

    const stream = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: groqMessages,
      stream: true,
      ...GENERATION_CONFIG,
    });

    // Create a ReadableStream to stream the response to the client
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (streamError) {
          console.error("Streaming error:", streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    const errorObj = error as { status?: number; message?: string };
    const status = errorObj.status ?? 500;
    const rawMessage = errorObj.message ?? "";

    let userMessage: string;

    if (status === 429 || rawMessage.includes("429") || rawMessage.includes("rate_limit")) {
      userMessage =
        "The AI service is temporarily rate-limited. Please wait a moment and try again.";
    } else if (status === 401 || status === 403 || rawMessage.includes("invalid_api_key")) {
      userMessage =
        "The AI API key is invalid or expired. Please check your GROQ_API_KEY in .env.local.";
    } else {
      userMessage = "Failed to generate response. Please try again.";
    }

    return Response.json({ error: userMessage }, { status });
  }
}
