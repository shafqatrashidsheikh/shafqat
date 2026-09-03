import { createFileRoute } from "@tanstack/react-router";
import { handleChatPost } from "@/server/assistant/chat-handler";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => handleChatPost(request),
    },
  },
});
