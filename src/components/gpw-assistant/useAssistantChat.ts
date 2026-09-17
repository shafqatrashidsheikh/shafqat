import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { isSafeAssistantImageUrl } from "@/lib/assistant/image-intent";
import { resolveAssistantLanguage } from "@/lib/assistant/language-intent";
import {
  getContextualQuickActions,
  WELCOME_QUICK_ACTIONS,
  type QuickAction,
} from "@/lib/assistant/quick-actions";
import {
  ASSISTANT_STORAGE_KEY,
  type AssistantMessage,
  type ChatSendOptions,
} from "./types";

const FALLBACK_ERROR =
  "Sorry, I'm having trouble responding right now. Please try again or use the Contact section for official assistance.";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadStoredMessages(): AssistantMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(ASSISTANT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AssistantMessage[];
    return Array.isArray(parsed) ? parsed.slice(-12) : [];
  } catch {
    return [];
  }
}

type ChatApiSuccess = { content: string; imageUrl?: string; imageAlt?: string };
type ChatApiError = { error?: string; message?: string };

export function useAssistantChat() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [messages, setMessages] = useState<AssistantMessage[]>(loadStoredMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  /** Assistant message ids that must be spoken when they arrive (mic / live). */
  const speakIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    sessionStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(messages.slice(-12)));
  }, [messages]);

  const lastUserMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i]?.role === "user") return messages[i]?.content ?? "";
    }
    return "";
  }, [messages]);

  const language = useMemo(
    () => resolveAssistantLanguage(messages.map((m) => ({ role: m.role, content: m.content }))),
    [messages],
  );

  const contextualActions: QuickAction[] = useMemo(() => {
    if (!messages.length) return WELCOME_QUICK_ACTIONS;
    const actions = getContextualQuickActions(lastUserMessage);
    return actions.length ? actions : [];
  }, [messages.length, lastUserMessage]);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setError(null);
    setIsStreaming(false);
    speakIdsRef.current.clear();
    sessionStorage.removeItem(ASSISTANT_STORAGE_KEY);
  }, []);

  const goToContact = useCallback(() => {
    navigate({ to: "/contact" });
  }, [navigate]);

  const consumeSpeakFor = useCallback((messageId: string) => {
    if (!speakIdsRef.current.has(messageId)) return false;
    speakIdsRef.current.delete(messageId);
    return true;
  }, []);

  const sendMessage = useCallback(
    async (rawText: string, options?: ChatSendOptions) => {
      const text = rawText.trim() || (options?.image ? "Please look at this image." : "");
      if ((!text && !options?.image) || isStreaming) return;

      setError(null);
      const userMessage: AssistantMessage = {
        id: createId(),
        role: "user",
        content: text.slice(0, 2000),
        createdAt: Date.now(),
        ...(options?.imagePreviewUrl
          ? { imageUrl: options.imagePreviewUrl, imageAlt: "Attached image" }
          : {}),
      };

      const assistantId = createId();
      if (options?.speakReply) speakIdsRef.current.add(assistantId);

      const historyForApi = [...messages, userMessage];
      setMessages(historyForApi);
      setInput("");
      setIsStreaming(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const token = session?.access_token?.trim();
        const apiMessages = historyForApi
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role,
            content: String(m.content ?? "")
              .trim()
              .slice(0, 2000),
          }))
          .filter((m) => m.content.length > 0)
          .slice(-12);

        if (!apiMessages.length) {
          speakIdsRef.current.delete(assistantId);
          setError("Please type a short message or attach an image.");
          return;
        }

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            ...(token && token.length >= 20 ? { accessToken: token } : {}),
            ...(options?.image ? { image: options.image } : {}),
          }),
          signal: controller.signal,
        });

        const data = (await response.json()) as ChatApiSuccess & ChatApiError;

        if (!response.ok) {
          speakIdsRef.current.delete(assistantId);
          setError(data.message ?? FALLBACK_ERROR);
          return;
        }

        if (!data.content?.trim()) {
          speakIdsRef.current.delete(assistantId);
          setError(FALLBACK_ERROR);
          return;
        }

        const imageUrl =
          data.imageUrl && isSafeAssistantImageUrl(data.imageUrl) ? data.imageUrl : undefined;

        const assistantMessage: AssistantMessage = {
          id: assistantId,
          role: "assistant",
          content: data.content.trim(),
          createdAt: Date.now(),
          ...(imageUrl
            ? { imageUrl, imageAlt: data.imageAlt?.trim() || "Assistant image" }
            : {}),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        speakIdsRef.current.delete(assistantId);
        if ((err as Error).name === "AbortError") return;
        setError(FALLBACK_ERROR);
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, messages, session?.access_token],
  );

  return {
    messages,
    input,
    setInput,
    isStreaming,
    error,
    sendMessage,
    clearChat,
    goToContact,
    contextualActions,
    language,
    showWelcome: messages.length === 0,
    consumeSpeakFor,
  };
}
