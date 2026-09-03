import { Link } from "@tanstack/react-router";
import { ASSISTANT_NAME } from "@/lib/assistant/constants";
import { parseAssistantContent } from "@/lib/assistant/chat-schemas";
import type { AssistantMessage } from "./types";

type ChatMessageProps = {
  message: AssistantMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="gpw-assistant-bubble gpw-assistant-bubble--user max-w-[88%]">{message.content}</div>
      </div>
    );
  }

  const segments = parseAssistantContent(message.content);

  return (
    <div className="flex justify-start">
      <div className="gpw-assistant-bubble gpw-assistant-bubble--assistant max-w-[92%]">
        {segments.map((segment, index) => {
          if (segment.type === "link") {
            return (
              <Link
                key={`${segment.href}-${index}`}
                to={segment.href}
                className="gpw-assistant-inline-link"
              >
                {segment.label} →
              </Link>
            );
          }

          return (
            <span key={index} className="whitespace-pre-wrap">
              {segment.value}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function WelcomeMessage() {
  return (
    <div className="gpw-assistant-bubble gpw-assistant-bubble--assistant max-w-[95%]">
      <p className="font-medium text-navy">Hi! I&apos;m the {ASSISTANT_NAME} 👋</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        I can help you find information about admissions, courses, academics, campus facilities, examinations,
        results, notices and other college-related information.
        {"\n\n"}
        What would you like to know?
      </p>
    </div>
  );
}

export function ErrorMessage({ onContact }: { onContact: () => void }) {
  return (
    <div className="gpw-assistant-bubble gpw-assistant-bubble--assistant border border-destructive/20 bg-destructive/5">
      <p className="text-sm leading-relaxed text-navy">
        Sorry, I&apos;m having trouble responding right now. Please try again or use the Contact section for
        official assistance.
      </p>
      <button type="button" onClick={onContact} className="gpw-assistant-chip mt-3">
        Contact GPW Srinagar →
      </button>
    </div>
  );
}

export function FallbackMessage({ onContact }: { onContact: () => void }) {
  return (
    <div className="gpw-assistant-bubble gpw-assistant-bubble--assistant">
      <p className="text-sm leading-relaxed text-navy">
        I couldn&apos;t find verified information about that on the website.
      </p>
      <button type="button" onClick={onContact} className="gpw-assistant-chip mt-3">
        Contact GPW Srinagar →
      </button>
    </div>
  );
}
