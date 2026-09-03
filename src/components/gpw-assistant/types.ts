export type AssistantRole = "user" | "assistant";

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  createdAt: number;
};

export type AssistantPanelState = "closed" | "open" | "minimized";

export const ASSISTANT_STORAGE_KEY = "gpw-assistant-messages-v1";
