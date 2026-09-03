import { createServerFn } from "@tanstack/react-start";
import { chatRequestSchema } from "@/lib/assistant/chat-schemas";
import {
  AssistantNotConfiguredError,
  AssistantUpstreamError,
  runAssistantChat,
} from "@/server/assistant/run-chat";

/** Secure server function — OpenAI key never reaches the browser. */
export const assistantChat = createServerFn({ method: "POST" })
  .validator(chatRequestSchema)
  .handler(async ({ data }) => {
    try {
      const content = await runAssistantChat(data.messages);
      return { content };
    } catch (error) {
      if (error instanceof AssistantNotConfiguredError) {
        throw new Error("ASSISTANT_NOT_CONFIGURED");
      }
      if (error instanceof AssistantUpstreamError) {
        throw new Error("ASSISTANT_UPSTREAM_ERROR");
      }
      throw new Error("ASSISTANT_UPSTREAM_ERROR");
    }
  });
