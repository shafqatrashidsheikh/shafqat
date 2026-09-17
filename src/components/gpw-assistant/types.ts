export type AssistantRole = "user" | "assistant";

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  createdAt: number;
  /** Optional image shown with the bubble (upload preview or assistant photo). */
  imageUrl?: string;
  imageAlt?: string;
};

export type AssistantPanelState = "closed" | "open" | "minimized";

export type ChatSendOptions = {
  /** Speak the next assistant reply aloud (mic / live talk). */
  speakReply?: boolean;
  /** Local preview URL for an attached image. */
  imagePreviewUrl?: string;
  /** Payload for vision API. */
  image?: {
    mimeType: "image/jpeg" | "image/png" | "image/webp";
    dataBase64: string;
  };
};

export const ASSISTANT_STORAGE_KEY = "gpw-assistant-messages-v1";
