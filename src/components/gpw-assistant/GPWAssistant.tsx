import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ASSISTANT_NAME } from "@/lib/assistant/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChatWindow } from "./ChatWindow";
import { GPW_ASSISTANT_OPEN_EVENT } from "./events";
import { useAssistantChat } from "./useAssistantChat";
import type { AssistantPanelState } from "./types";

export function GPWAssistant() {
  const [panelState, setPanelState] = useState<AssistantPanelState>("closed");
  const chat = useAssistantChat();
  const isOpen = panelState === "open" || panelState === "minimized";

  useEffect(() => {
    const open = () => setPanelState("open");
    window.addEventListener(GPW_ASSISTANT_OPEN_EVENT, open);
    return () => window.removeEventListener(GPW_ASSISTANT_OPEN_EVENT, open);
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="gpw-assistant-root" data-panel={panelState} aria-live="polite">
        {isOpen ? (
          <ChatWindow
            panelState={panelState}
            chat={chat}
            onClose={() => setPanelState("closed")}
            onMinimize={() => setPanelState((s) => (s === "minimized" ? "open" : "minimized"))}
          />
        ) : null}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn("gpw-assistant-fab", isOpen && "gpw-assistant-fab--active")}
              onClick={() => setPanelState((s) => (s === "closed" ? "open" : "closed"))}
              aria-expanded={isOpen}
              aria-label={`Ask ${ASSISTANT_NAME}`}
            >
              <MessageCircle className="size-6" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            Ask {ASSISTANT_NAME}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
