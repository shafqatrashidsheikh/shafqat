import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  getContextualQuickActions,
  WELCOME_QUICK_ACTIONS,
  type QuickAction,
} from "@/lib/assistant/quick-actions";
import { ASSISTANT_STORAGE_KEY, type AssistantMessage } from "./types";

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

type ChatApiSuccess = { content: string };
type ChatApiError = { error?: string; message?: string };

export function useAssistantChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AssistantMessage[]>(loadStoredMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    sessionStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(messages.slice(-12)));
  }, [messages]);

  const lastUserMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i]?.role === "user") return messages[i]?.content ?? "";
    }
    return "";
  }, [messages]);

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
    sessionStorage.removeItem(ASSISTANT_STORAGE_KEY);
  }, []);

  const goToContact = useCallback(() => {
    navigate({ to: "/contact" });
  }, [navigate]);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isStreaming) return;

      setError(null);
      const userMessage: AssistantMessage = {
        id: createId(),
        role: "user",
        content: text.slice(0, 2000),
        createdAt: Date.now(),
      };

      const assistantId = createId();
      const historyForApi = [...messages, userMessage];
      setMessages(historyForApi);
      setInput("");
      setIsStreaming(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: historyForApi.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        });

        const data = (await response.json()) as ChatApiSuccess & ChatApiError;

        if (!response.ok) {
          setError(data.message ?? FALLBACK_ERROR);
          return;
        }

        if (!data.content?.trim()) {
          setError(FALLBACK_ERROR);
          return;
        }

        const assistantMessage: AssistantMessage = {
          id: assistantId,
          role: "assistant",
          content: data.content.trim(),
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(FALLBACK_ERROR);
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, messages],
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
    showWelcome: messages.length === 0,
  };
}
