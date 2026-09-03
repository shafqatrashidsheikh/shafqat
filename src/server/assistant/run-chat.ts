import OpenAI from "openai";
import { aiEnv } from "@/lib/assistant/ai-env";
import type { ChatMessage } from "@/lib/assistant/chat-schemas";
import { buildAssistantSystemPrompt } from "@/lib/assistant/system-prompt";

export class AssistantNotConfiguredError extends Error {
  constructor() {
    super("ASSISTANT_NOT_CONFIGURED");
    this.name = "AssistantNotConfiguredError";
  }
}

export class AssistantUpstreamError extends Error {
  constructor(cause?: unknown) {
    super("ASSISTANT_UPSTREAM_ERROR");
    this.name = "AssistantUpstreamError";
    this.cause = cause;
  }
}

export async function runAssistantChat(messages: ChatMessage[]): Promise<string> {
  if (!aiEnv.isConfigured || !aiEnv.openaiApiKey) {
    console.error("[GPWS Assistant] OPENAI_API_KEY is not configured.");
    throw new AssistantNotConfiguredError();
  }

  const history = messages.slice(-aiEnv.maxHistoryMessages);
  const openai = new OpenAI({ apiKey: aiEnv.openaiApiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: aiEnv.model,
      stream: false,
      max_tokens: aiEnv.maxOutputTokens,
      temperature: 0.35,
      messages: [
        { role: "system", content: buildAssistantSystemPrompt() },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new AssistantUpstreamError(new Error("Empty model response"));
    }

    return content;
  } catch (error) {
    if (error instanceof AssistantNotConfiguredError) throw error;
    console.error("[GPWS Assistant] OpenAI API error:", error);
    throw new AssistantUpstreamError(error);
  }
}
