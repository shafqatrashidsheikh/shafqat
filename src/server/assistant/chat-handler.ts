import OpenAI from "openai";
import { aiEnv } from "@/lib/assistant/ai-env";
import { chatRequestSchema, type ChatMessage } from "@/lib/assistant/chat-schemas";
import { checkRateLimit, getClientKey } from "@/lib/assistant/rate-limit";
import { buildAssistantSystemPrompt } from "@/lib/assistant/system-prompt";

export async function handleChatPost(request: Request): Promise<Response> {
  const clientKey = getClientKey(request);
  const rate = checkRateLimit(clientKey);
  if (!rate.allowed) {
    return Response.json(
      { error: "rate_limit", message: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rate.retryAfterMs ?? 60_000) / 1000)) } },
    );
  }

  if (!aiEnv.isConfigured) {
    console.error("[GPWS Assistant] OPENAI_API_KEY is not configured.");
    return Response.json(
      {
        error: "not_configured",
        message:
          "Sorry, I'm having trouble responding right now. Please try again or use the Contact section for official assistance.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json", message: "Invalid request body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "validation", message: "Invalid chat messages." }, { status: 400 });
  }

  const messages = parsed.data.messages.slice(-aiEnv.maxHistoryMessages);
  const openai = new OpenAI({ apiKey: aiEnv.openaiApiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: aiEnv.model,
      stream: false,
      max_tokens: aiEnv.maxOutputTokens,
      temperature: 0.35,
      messages: [
        { role: "system", content: buildAssistantSystemPrompt() },
        ...messages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!content) {
      console.error("[GPWS Assistant] OpenAI returned an empty response.");
      return Response.json(
        {
          error: "empty_response",
          message:
            "Sorry, I'm having trouble responding right now. Please try again or use the Contact section for official assistance.",
        },
        { status: 502 },
      );
    }

    return Response.json({ content });
  } catch (error) {
    console.error("[GPWS Assistant] OpenAI API error:", error);
    return Response.json(
      {
        error: "openai_error",
        message:
          "Sorry, I'm having trouble responding right now. Please try again or use the Contact section for official assistance.",
      },
      { status: 502 },
    );
  }
}
