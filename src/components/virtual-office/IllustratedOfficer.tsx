import type { MouseEvent } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VoOfficerId } from "@/lib/virtual-office/types";
import { OFFICER_DESK_META, type OfficerWorkPhase } from "@/components/virtual-office/officer-meta";
import { cn } from "@/lib/utils";

/** Cache-bust when portraits are replaced in public/virtual-office */
const PORTRAIT_VER = "v6-cut";

const OFFICER_PORTRAIT: Record<VoOfficerId, string> = {
  student_approval: `/virtual-office/cut-student-approval.png?v=${PORTRAIT_VER}`,
  academic_data: `/virtual-office/cut-academic-data.png?v=${PORTRAIT_VER}`,
  website_management: `/virtual-office/cut-website-management.png?v=${PORTRAIT_VER}`,
  student_notification: `/virtual-office/cut-student-notification.png?v=${PORTRAIT_VER}`,
};

export function IllustratedOfficer({
  id,
  phase,
  sip,
  bubble,
  bubbleTone = "status",
  statusHint,
  onSelect,
  onMic,
  selected,
  listening,
  speaking,
}: {
  id: VoOfficerId;
  phase: OfficerWorkPhase;
  sip?: boolean;
  bubble?: string | null;
  bubbleTone?: "status" | "success" | "error";
  statusHint?: string | null;
  onSelect: () => void;
  onMic: (e: MouseEvent) => void;
  selected: boolean;
  listening?: boolean;
  speaking?: boolean;
}) {
  const meta = OFFICER_DESK_META[id];
  const effectivePhase: OfficerWorkPhase = listening
    ? "listening"
    : speaking
      ? "speaking"
      : phase;

  const deskClass = cn(
    "vo-desk",
    effectivePhase === "idle" && "vo-desk--idle",
    effectivePhase === "focused" && "vo-desk--focused",
    effectivePhase === "listening" && "vo-desk--listening",
    effectivePhase === "working" && "vo-desk--working",
    effectivePhase === "speaking" && "vo-desk--speaking",
    effectivePhase === "success" && "vo-desk--success",
    effectivePhase === "error" && "vo-desk--error",
    selected && !listening && effectivePhase !== "working" && "vo-desk--focused",
    sip && effectivePhase === "idle" && "vo-desk--sip",
  );

  return (
    <div className={deskClass}>
      {bubble ? (
        <div
          className={cn(
            "vo-bubble",
            bubbleTone === "success" && "vo-bubble--success",
            bubbleTone === "error" && "vo-bubble--error",
            bubbleTone === "status" && "vo-bubble--status",
            speaking && "vo-bubble--speaking",
          )}
          role="status"
        >
          {bubble}
        </div>
      ) : null}

      <button
        type="button"
        className="vo-desk__hit"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={meta.name}
      >
        <div className="vo-portrait">
          <img
            className="vo-portrait__img"
            src={OFFICER_PORTRAIT[id]}
            alt=""
            width={640}
            height={640}
            draggable={false}
          />
          {listening ? <div className="vo-portrait__listen" aria-hidden /> : null}
          {speaking ? <div className="vo-portrait__speak" aria-hidden /> : null}
          {effectivePhase === "working" ? (
            <div className="vo-portrait__work" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          ) : null}
          {effectivePhase === "success" ? (
            <div className="vo-portrait__badge vo-portrait__badge--ok" aria-hidden>
              ✓
            </div>
          ) : null}
        </div>
      </button>

      <div className="vo-desk__label">{meta.name}</div>
      <div className="vo-desk__role">
        {listening
          ? "Listening…"
          : speaking
            ? "Speaking…"
            : (statusHint ?? meta.shortLabel)}
      </div>

      <div className="vo-desk__mic">
        <Button
          type="button"
          size="icon"
          variant={listening ? "default" : "outline"}
          className={cn(
            "h-9 w-9 rounded-full shadow-sm",
            listening ? "bg-brand text-white" : "border-border bg-white/95 text-navy",
          )}
          aria-label={listening ? `Stop listening to ${meta.name}` : `Speak to ${meta.name}`}
          aria-pressed={listening}
          onClick={(e) => {
            e.stopPropagation();
            onMic(e);
          }}
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
