import OpenAI from "openai";
import { aiEnv } from "@/lib/assistant/ai-env";

/** OpenAI SDK client — works with OpenAI or Groq (OpenAI-compatible base URL). */
export function createAssistantClient(): OpenAI {
  if (!aiEnv.openaiApiKey) {
    throw new Error("ASSISTANT_NOT_CONFIGURED");
  }

  return new OpenAI({
    apiKey: aiEnv.openaiApiKey,
    ...(aiEnv.baseURL ? { baseURL: aiEnv.baseURL } : {}),
  });
}
