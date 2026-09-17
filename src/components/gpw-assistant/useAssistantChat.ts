import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  capabilityNeedsLive,
  detectCapabilityIntent,
  resolveCapabilityReply,
} from "@/lib/assistant/capability-intent";
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

/** Developer / Cursor-style prompts accidentally pasted into the campus chat. */
function isDeveloperAuditPrompt(text: string): boolean {
  const t = text.toLowerCase();
  return (
    (/audit|codebase|project structure|fix (the )?(website|bugs|css|react)/i.test(t) &&
      /(do not delete|kuch (mat )?uda|leave unchanged|tanstack|refactor)/i.test(t)) ||
    /exploring the project|before auditing|read files|cursor agent/i.test(t) ||
    (/\b(fix|audit)\b/.test(t) && /\b(full website|entire site|whole site)\b/.test(t) && t.length > 280)
  );
}

function developerAuditRedirect(language: ReturnType<typeof resolveAssistantLanguage>): string {
  if (language === "english") {
    return "I'm the campus GPWS Assistant for admissions, programmes, notices, and campus help — not a website developer. Ask me something about GPW Srinagar (for example Eligibility, Fees, or Latest Notices), or tap New chat and start fresh.";
  }
  return "Main GPWS Assistant hoon — admissions, programmes, notices aur campus help ke liye. Website code audit / developer kaam main nahi karta. GPW Srinagar ke baare mein poochhein (jaise Eligibility, Fees, Latest Notices), ya New chat dabakar naya sawal shuru karein.";
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadStoredMessages(): AssistantMessage[] {
  if (typeof window === "undefined") return [];
  try {
    /* Drop stale v1 chats that may contain developer-audit junk. */
    sessionStorage.removeItem("gpw-assistant-messages-v1");
    const raw = sessionStorage.getItem(ASSISTANT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AssistantMessage[];
    if (!Array.isArray(parsed)) return [];
    const cleaned = parsed
      .slice(-12)
      .filter((m) => {
        const c = String(m?.content ?? "");
        if (/exploring the project|codebase before auditing|audit the codebase/i.test(c)) {
          return false;
        }
        return Boolean(m?.id && m?.role && c.trim());
      });
    /* If audit junk polluted the thread, start fresh. */
    if (cleaned.length < parsed.length) return [];
    return cleaned;
  } catch {
    return [];
  }
}

type ChatApiSuccess = { content: string; imageUrl?: string; imageAlt?: string };
type ChatApiError = { error?: string; message?: string };

export function useAssistantChat() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isStreamingRef = useRef(false);
  /** Assistant message ids that must be spoken when they arrive (mic / live). */
  const speakIdsRef = useRef<Set<string>>(new Set());

  /* Restore after mount — avoid SSR [] wiping sessionStorage on hydrate. */
  useEffect(() => {
    setMessages(loadStoredMessages());
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    sessionStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(messages.slice(-12)));
  }, [messages, storageReady]);

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
    abortRef.current = null;
    isStreamingRef.current = false;
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

  const cancelInFlight = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    isStreamingRef.current = false;
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(
    async (rawText: string, options?: ChatSendOptions) => {
      const text = rawText.trim() || (options?.image ? "Please look at this image." : "");
      if ((!text && !options?.image) || isStreamingRef.current) return;

      isStreamingRef.current = true;
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

      /* Instant local FAQ — no network / no “typing…” wait. */
      if (!options?.image) {
        if (isDeveloperAuditPrompt(text)) {
          const lang = resolveAssistantLanguage(
            historyForApi.map((m) => ({ role: m.role, content: m.content })),
          );
          isStreamingRef.current = false;
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: developerAuditRedirect(lang),
              createdAt: Date.now(),
            },
          ]);
          return;
        }

        const capability = detectCapabilityIntent(text);
        if (capability && !capabilityNeedsLive(capability)) {
          const lang = resolveAssistantLanguage(
            historyForApi.map((m) => ({ role: m.role, content: m.content })),
          );
          const content = resolveCapabilityReply(capability, lang);
          isStreamingRef.current = false;
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content,
              createdAt: Date.now(),
            },
          ]);
          return;
        }
      }

      setIsStreaming(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const token = session?.access_token?.trim();
        /* Live turns: shorter context = faster replies. */
        const historyWindow = options?.live ? 6 : 12;
        const apiMessages = historyForApi
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role,
            content: String(m.content ?? "")
              .trim()
              .slice(0, options?.live ? 900 : 2000),
          }))
          .filter((m) => m.content.length > 0)
          .slice(-historyWindow);

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
        /* Don't clear a newer in-flight turn after barge-in cancel. */
        if (abortRef.current === controller) {
          abortRef.current = null;
          isStreamingRef.current = false;
          setIsStreaming(false);
        }
      }
    },
    [messages, session?.access_token],
  );

  return {
    messages,
    input,
    setInput,
    isStreaming,
    error,
    sendMessage,
    cancelInFlight,
    clearChat,
    goToContact,
    contextualActions,
    language,
    showWelcome: messages.length === 0,
    consumeSpeakFor,
  };
}
