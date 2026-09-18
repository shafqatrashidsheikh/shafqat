import { Mic, MicOff, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OFFICER_DESK_META } from "@/components/virtual-office/officer-meta";
import type { VoOfficerId } from "@/lib/virtual-office/types";

export function OfficerCommandDock({
  officerId,
  command,
  onCommandChange,
  onSubmit,
  onClose,
  busy,
  listening,
  voiceSupported,
  onToggleVoice,
  voiceError,
}: {
  officerId: VoOfficerId;
  command: string;
  onCommandChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  busy: boolean;
  listening: boolean;
  voiceSupported: boolean;
  onToggleVoice: () => void;
  voiceError?: string | null;
}) {
  const meta = OFFICER_DESK_META[officerId];

  return (
    <div className="vo-command-dock" role="dialog" aria-label={`${meta.name} command panel`}>
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-brand">At this desk</p>
          <p className="font-display text-xs font-bold text-navy sm:text-sm">{meta.name}</p>
        </div>
        <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-navy" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={command}
        onChange={(e) => onCommandChange(e.target.value)}
        rows={2}
        disabled={busy}
        placeholder={meta.prompt}
        className="resize-none border-border bg-background text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <p className="mt-1.5 text-[0.65rem] text-muted-foreground">
        English · Hindi · Hinglish · Roman Urdu · Urdu · Ctrl/⌘+Enter to send
      </p>
      {voiceError ? <p className="mt-1 text-xs text-red">{voiceError}</p> : null}
      <div className="mt-2.5 flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0"
          disabled={!voiceSupported || busy}
          aria-label={listening ? "Stop listening" : "Start voice input"}
          onClick={onToggleVoice}
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button type="button" className="flex-1" disabled={busy || !command.trim()} onClick={onSubmit}>
          <Send className="mr-2 h-4 w-4" />
          {busy ? "Working…" : "Instruct officer"}
        </Button>
      </div>
    </div>
  );
}
