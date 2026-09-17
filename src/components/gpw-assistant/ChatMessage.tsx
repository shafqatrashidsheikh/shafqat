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
      <div className="gpw-assistant-msg gpw-assistant-msg--user">
        <div className="gpw-assistant-bubble gpw-assistant-bubble--user">
          {message.imageUrl ? (
            <img
              src={message.imageUrl}
              alt={message.imageAlt ?? "Attached image"}
              className="mb-2 max-h-40 w-full rounded-lg object-cover"
            />
          ) : null}
          {message.content}
        </div>
      </div>
    );
  }

  const segments = parseAssistantContent(message.content);

  return (
    <div className="gpw-assistant-msg gpw-assistant-msg--assistant">
      <div className="gpw-assistant-bubble gpw-assistant-bubble--assistant">
        {message.imageUrl ? (
          <img
            src={message.imageUrl}
            alt={message.imageAlt ?? "Campus photograph"}
            className="mb-2 max-h-48 w-full rounded-lg object-cover"
          />
        ) : null}
        {segments.map((segment, index) => {
          if (segment.type === "link") {
            if (segment.external) {
              return (
                <a
                  key={`${segment.href}-${index}`}
                  href={segment.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gpw-assistant-inline-link"
                >
                  {segment.label}
                </a>
              );
            }

            return (
              <Link
                key={`${segment.href}-${index}`}
                to={segment.href}
                className="gpw-assistant-inline-link"
              >
                {segment.label}
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
      <p className="font-medium text-navy">Hi! I&apos;m the {ASSISTANT_NAME}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        Ask about admissions, diploma programmes, syllabus, campus, hostel rules, examinations,
        notices and contact details. Hostel room vacancy and roommate details unlock only after
        student login and HOD approval.
        {"\n\n"}
        Replies follow your language — English, Urdu, Hinglish, Roman Urdu, Roman Hindi, or Kashmiri.
        Use the mic for spoken questions; voice mode reads replies aloud.
        {"\n\n"}
        What would you like to know?
      </p>
    </div>
  );
}

export function ErrorMessage({
  onContact,
  message,
}: {
  onContact: () => void;
  message?: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="gpw-assistant-bubble gpw-assistant-bubble--assistant w-full border border-destructive/20 bg-destructive/5">
        <p className="text-sm leading-relaxed text-navy">
          {message?.trim() ||
            "Sorry, I'm having trouble responding right now. Please try again or use the Contact section for official assistance."}
        </p>
      </div>
      <button type="button" onClick={onContact} className="btn-primary min-h-10 px-5 text-sm">
        Contact GPW Srinagar
      </button>
    </div>
  );
}

export function FallbackMessage({ onContact }: { onContact: () => void }) {
  return (
    <div className="gpw-assistant-bubble gpw-assistant-bubble--assistant">
      <p className="text-sm leading-relaxed text-navy">
        I don&apos;t have that detail published yet. You can check Contact for the institute office.
      </p>
      <button type="button" onClick={onContact} className="gpw-assistant-chip mt-3">
        Contact GPW Srinagar
      </button>
    </div>
  );
}
