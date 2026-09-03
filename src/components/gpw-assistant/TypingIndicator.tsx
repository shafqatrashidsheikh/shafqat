import { ASSISTANT_NAME } from "@/lib/assistant/constants";
import { cn } from "@/lib/utils";

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn("gpw-assistant-typing", className)}
      aria-label={`${ASSISTANT_NAME} is typing`}
      role="status"
    >
      <span className="gpw-assistant-typing-dot" />
      <span className="gpw-assistant-typing-dot" />
      <span className="gpw-assistant-typing-dot" />
    </div>
  );
}
