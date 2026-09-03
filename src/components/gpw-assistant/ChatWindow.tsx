import { useEffect, useRef } from "react";
import { Minus, RotateCcw, X } from "lucide-react";
import { ASSISTANT_NAME } from "@/lib/assistant/constants";
import { INSTITUTE } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, ErrorMessage, WelcomeMessage } from "./ChatMessage";
import { QuickActions } from "./QuickActions";
import { TypingIndicator } from "./TypingIndicator";
import type { useAssistantChat } from "./useAssistantChat";
import type { AssistantPanelState } from "./types";

type ChatWindowProps = {
  panelState: AssistantPanelState;
  chat: ReturnType<typeof useAssistantChat>;
  onClose: () => void;
  onMinimize: () => void;
};

export function ChatWindow({ panelState, chat, onClose, onMinimize }: ChatWindowProps) {
  const {
    messages,
    input,
    setInput,
    isStreaming,
    error,
    sendMessage,
    clearChat,
    goToContact,
    contextualActions,
    showWelcome,
  } = chat;

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (panelState !== "open") return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming, panelState]);

  useEffect(() => {
    if (panelState !== "open") return;
    inputRef.current?.focus();
  }, [panelState]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "2.75rem";
    el.style.height = `${Math.min(el.scrollHeight, 88)}px`;
  }, [input]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (panelState === "closed") return null;

  const minimized = panelState === "minimized";

  function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    if (!input.trim()) return;
    void sendMessage(input);
  }

  return (
    <div
      id="gpw-assistant-panel"
      className="gpw-assistant-panel"
      data-state={panelState}
      role="dialog"
      aria-modal="true"
      aria-label={ASSISTANT_NAME}
    >
      <header className="gpw-assistant-header">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="gpw-assistant-status shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold leading-tight text-on-dark">{ASSISTANT_NAME}</h2>
            <p className="mt-0.5 text-[11px] leading-snug text-on-dark-muted">{INSTITUTE.name}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-start gap-1 pt-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-on-dark-muted hover:bg-on-dark/10 hover:text-on-dark"
            onClick={clearChat}
            aria-label="Clear conversation"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-on-dark-muted hover:bg-on-dark/10 hover:text-on-dark"
            onClick={onMinimize}
            aria-label={minimized ? "Restore chat" : "Minimize chat"}
          >
            <Minus className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-on-dark-muted hover:bg-on-dark/10 hover:text-on-dark"
            onClick={onClose}
            aria-label="Close assistant"
          >
            <X className="size-4" />
          </Button>
        </div>
      </header>

      {!minimized ? (
        <>
          <div ref={scrollRef} className="gpw-assistant-scroll">
            <div className="gpw-assistant-messages">
              {showWelcome ? <WelcomeMessage /> : null}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isStreaming ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TypingIndicator />
                  <span>{ASSISTANT_NAME} is typing…</span>
                </div>
              ) : null}
              {error ? <ErrorMessage onContact={goToContact} /> : null}
            </div>

            <div className="gpw-assistant-quick">
              <QuickActions
                actions={contextualActions}
                onSelect={(message) => void sendMessage(message)}
                disabled={isStreaming}
              />
            </div>
          </div>

          <form className="gpw-assistant-composer" onSubmit={handleSubmit}>
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about admissions, courses, campus..."
              rows={1}
              maxLength={2000}
              disabled={isStreaming}
              className="gpw-assistant-input"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              aria-label={`Message ${ASSISTANT_NAME}`}
            />
            <Button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="gpw-assistant-send"
            >
              Send
            </Button>
          </form>
        </>
      ) : null}
    </div>
  );
}
