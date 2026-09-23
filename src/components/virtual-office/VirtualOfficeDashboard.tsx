import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useVoiceInput } from "@/components/gpw-assistant/useVoiceInput";
import { IllustratedOfficer } from "@/components/virtual-office/IllustratedOfficer";
import { OfficerCommandDock } from "@/components/virtual-office/OfficerCommandDock";
import { OfficerResultSheet } from "@/components/virtual-office/OfficerResultSheet";
import {
  OFFICER_DESK_META,
  OFFICER_ORDER,
  type OfficerWorkPhase,
} from "@/components/virtual-office/officer-meta";
import { useOfficerSpeech } from "@/components/virtual-office/useOfficerSpeech";
import type { UserProfile } from "@/lib/auth/roles";
import type { VoOfficerId } from "@/lib/virtual-office/types";
import { voGetOverview, voRunCommand } from "@/server/virtual-office/mutations";
import "@/components/virtual-office/virtual-office-room.css";

type Overview = Awaited<ReturnType<typeof voGetOverview>>;

type OfficerRuntime = {
  phase: OfficerWorkPhase;
  bubble: string | null;
  bubbleTone: "status" | "success" | "error";
  statusHint: string | null;
};

const IDLE: OfficerRuntime = {
  phase: "idle",
  bubble: null,
  bubbleTone: "status",
  statusHint: null,
};

function isActionSuccess(res: {
  message: string;
  result: unknown;
  parsed: { intent: string; clarification?: string };
}) {
  if (res.parsed.intent === "clarify" || res.parsed.intent === "unknown") return false;
  if (res.result == null && res.parsed.clarification) return false;
  if (res.result && typeof res.result === "object") {
    const r = res.result as { ok?: boolean; needsClarification?: boolean };
    if (r.ok === false || r.needsClarification === true) return false;
  }
  const msg = (res.message || "").toLowerCase();
  if (
    msg.includes("not found") ||
    msg.includes("could not") ||
    msg.includes("failed") ||
    msg.includes("requires") ||
    msg.includes("blocked")
  ) {
    return false;
  }
  return true;
}

export function VirtualOfficeDashboard({
  accessToken,
  profile,
  onSignOut,
}: {
  accessToken: string;
  profile: UserProfile;
  onSignOut: () => void;
}) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [selected, setSelected] = useState<VoOfficerId | null>(null);
  const [command, setCommand] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [runtimes, setRuntimes] = useState<Record<VoOfficerId, OfficerRuntime>>(() =>
    Object.fromEntries(OFFICER_ORDER.map((id) => [id, { ...IDLE }])) as Record<VoOfficerId, OfficerRuntime>,
  );
  const [sipOfficer, setSipOfficer] = useState<VoOfficerId>("website_management");
  const [lastResult, setLastResult] = useState<{
    officerId: VoOfficerId;
    summary: string;
    result: unknown;
  } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [listeningId, setListeningId] = useState<VoOfficerId | null>(null);
  const [speakingId, setSpeakingId] = useState<VoOfficerId | null>(null);
  const progressTimer = useRef<number | null>(null);
  const voiceTarget = useRef<VoOfficerId | null>(null);
  const runInstructionRef = useRef<(officerId: VoOfficerId, text?: string) => Promise<void>>(
    async () => undefined,
  );
  const stopVoiceRef = useRef<() => void>(() => undefined);
  const voiceListeningRef = useRef(false);

  const speech = useOfficerSpeech();

  const refresh = useCallback(async () => {
    try {
      const data = await voGetOverview({ data: { accessToken } });
      setOverview(data);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load office");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSipOfficer(OFFICER_ORDER[Math.floor(Math.random() * OFFICER_ORDER.length)]!);
    }, 11000);
    return () => window.clearInterval(id);
  }, []);

  const patchRuntime = useCallback((id: VoOfficerId, patch: Partial<OfficerRuntime>) => {
    setRuntimes((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  const clearProgress = () => {
    if (progressTimer.current != null) {
      window.clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };

  const speakAsOfficer = useCallback(
    (officerId: VoOfficerId, line: string, nextPhase: OfficerWorkPhase) => {
      setSpeakingId(officerId);
      patchRuntime(officerId, {
        phase: "speaking",
        bubble: line,
        bubbleTone: nextPhase === "error" ? "error" : nextPhase === "success" ? "success" : "status",
        statusHint: "Speaking…",
      });
      speech.speak(line, {
        onEnd: () => {
          setSpeakingId(null);
          patchRuntime(officerId, {
            phase: nextPhase,
            bubble: line,
            bubbleTone: nextPhase === "error" ? "error" : nextPhase === "success" ? "success" : "status",
            statusHint:
              nextPhase === "success" ? "Completed" : nextPhase === "error" ? "Needs attention" : null,
          });
        },
      });
    },
    [patchRuntime, speech],
  );

  const runInstruction = useCallback(
    async (officerId: VoOfficerId, text?: string) => {
      const cmd = (text ?? command).trim();
      if (!cmd || busy) return;

      speech.unlock();
      speech.stop();
      setSpeakingId(null);
      setListeningId(null);
      if (voiceListeningRef.current) stopVoiceRef.current();

      setBusy(true);
      setLastResult(null);
      setShowResult(false);
      setSelected(officerId);

      setRuntimes((prev) => {
        const next = { ...prev };
        for (const id of OFFICER_ORDER) {
          next[id] =
            id === officerId
              ? {
                  phase: "working",
                  bubble: cmd.length > 72 ? `${cmd.slice(0, 72)}…` : cmd,
                  bubbleTone: "status",
                  statusHint: "Working…",
                }
              : { ...IDLE, phase: "idle" };
        }
        return next;
      });

      const steps = OFFICER_DESK_META[officerId].progressSteps;
      let stepIdx = 0;
      clearProgress();
      progressTimer.current = window.setInterval(() => {
        stepIdx = Math.min(stepIdx + 1, steps.length - 1);
        patchRuntime(officerId, { statusHint: steps[stepIdx] ?? "Working…" });
      }, 900);

      try {
        const res = await voRunCommand({ data: { accessToken, command: cmd } });
        clearProgress();

        const actingId =
          res.parsed.officer && OFFICER_ORDER.includes(res.parsed.officer)
            ? res.parsed.officer
            : officerId;

        if (actingId !== officerId) {
          setSelected(actingId);
          setRuntimes((prev) => ({ ...prev, [officerId]: { ...IDLE } }));
        }

        const ok = isActionSuccess(res);
        if (ok) {
          const line = `Done. ${res.message || "You can check now."}`;
          setLastResult({ officerId: actingId, summary: res.message, result: res.result });
          speakAsOfficer(actingId, line.length > 160 ? "Done. You can check now." : line, "success");
        } else {
          const reason = res.message || res.parsed.clarification || "Something needs your attention.";
          setLastResult({ officerId: actingId, summary: reason, result: res.result });
          const speakLine =
            reason.length > 140
              ? "Something needs your attention. Please check the details."
              : `Something needs your attention. ${reason}`;
          speakAsOfficer(actingId, speakLine, "error");
        }
        await refresh();
      } catch (err) {
        clearProgress();
        const reason = err instanceof Error ? err.message : "Something needs your attention.";
        setLastResult({ officerId, summary: reason, result: null });
        speakAsOfficer(
          officerId,
          reason.length > 140
            ? "Something needs your attention. Please check the details."
            : `Something needs your attention. ${reason}`,
          "error",
        );
      } finally {
        setBusy(false);
      }
    },
    [accessToken, busy, command, patchRuntime, refresh, speakAsOfficer, speech],
  );

  runInstructionRef.current = runInstruction;

  const voice = useVoiceInput({
    lang: "en-IN",
    onPartial: (text) => {
      setCommand(text);
      const target = voiceTarget.current;
      if (target && text.trim()) {
        patchRuntime(target, {
          phase: "listening",
          bubble: text.length > 64 ? `${text.slice(0, 64)}…` : text,
          bubbleTone: "status",
          statusHint: "Listening…",
        });
      }
    },
    onTranscript: (text) => {
      const cleaned = text.trim();
      setCommand(cleaned);
      setListeningId(null);
      const target = voiceTarget.current ?? selected;
      if (target && cleaned) {
        void runInstructionRef.current(target, cleaned);
      }
    },
    onSessionEnd: () => {
      setListeningId(null);
    },
  });

  stopVoiceRef.current = voice.stop;
  voiceListeningRef.current = voice.listening;

  const selectOfficer = (id: VoOfficerId) => {
    speech.unlock();
    setSelected(id);
    if (!listeningId) setCommand("");
    setRuntimes((prev) => {
      const cur = prev[id];
      if (cur.phase === "working" || cur.phase === "speaking" || listeningId === id) return prev;
      return {
        ...prev,
        [id]: {
          ...cur,
          phase: cur.phase === "success" || cur.phase === "error" ? cur.phase : "focused",
          statusHint: cur.statusHint ?? OFFICER_DESK_META[id].shortLabel,
        },
      };
    });
  };

  const startDeskMic = (id: VoOfficerId) => {
    speech.unlock();
    speech.stop();
    setSpeakingId(null);
    selectOfficer(id);
    voiceTarget.current = id;

    if (voice.listening && listeningId === id) {
      voice.stop();
      setListeningId(null);
      return;
    }

    if (voice.listening) voice.stop();
    setListeningId(id);
    patchRuntime(id, {
      phase: "listening",
      bubble: "Listening… boliye / speak now",
      bubbleTone: "status",
      statusHint: "Listening…",
    });
    // Short silence auto-submit after user pauses (not endless dictate)
    voice.start({ live: false, dictate: false });
  };

  const toggleDockVoice = () => {
    if (!selected) return;
    speech.unlock();
    voiceTarget.current = selected;
    if (voice.listening) {
      voice.stop();
      setListeningId(null);
      return;
    }
    setListeningId(selected);
    patchRuntime(selected, {
      phase: "listening",
      bubble: "Listening… boliye / speak now",
      bubbleTone: "status",
      statusHint: "Listening…",
    });
    voice.start({ live: false, dictate: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface-white">
        <div className="container-page py-3 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">GPW Srinagar</p>
              <h1 className="font-display text-xl font-extrabold text-navy sm:text-2xl">Virtual College Office</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Mic pe bolo — officer sunega, kaam karega, aur jawab bolega.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-light-blue px-3 py-1 text-xs font-medium text-navy">
                {profile.full_name || profile.email} · {profile.role.toUpperCase()}
              </span>
              <Button asChild variant="outline" size="sm">
                <Link to={profile.role === "admin" || profile.role === "editor" ? "/admin" : "/portal"}>
                  {profile.role === "admin" || profile.role === "editor" ? "CMS" : "Portal"}
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={onSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-page py-4 sm:py-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading officers…</p>
        ) : (
          <>
            {loadError ? (
              <p className="mb-3 rounded-lg border border-red/30 bg-red/5 p-3 text-sm text-red">{loadError}</p>
            ) : null}

            {!voice.supported ? (
              <p className="mb-3 rounded-lg border border-amber-300/50 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                Voice listen needs Chrome or Edge with microphone permission. You can still type instructions.
              </p>
            ) : null}

            {!speech.supported ? (
              <p className="mb-3 rounded-lg border border-amber-300/50 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                Officer speak (TTS) is not available in this browser.
              </p>
            ) : null}

            <div className="vo-room" aria-label="Virtual college office">
              <div className="vo-room__grid">
                {OFFICER_ORDER.map((id) => {
                  const rt = runtimes[id];
                  const card = overview?.officers.find((o) => o.id === id);
                  const isOpen = selected === id;
                  return (
                    <div
                      key={id}
                      className={`vo-station${isOpen ? " vo-station--open" : ""}`}
                    >
                      <IllustratedOfficer
                        id={id}
                        phase={rt.phase}
                        sip={sipOfficer === id && rt.phase === "idle"}
                        bubble={rt.bubble}
                        bubbleTone={rt.bubbleTone}
                        statusHint={rt.statusHint ?? card?.statusLabel ?? null}
                        selected={isOpen}
                        listening={listeningId === id && voice.listening}
                        speaking={speakingId === id && speech.speaking}
                        onSelect={() => selectOfficer(id)}
                        onMic={() => startDeskMic(id)}
                      />
                      {isOpen ? (
                        <OfficerCommandDock
                          officerId={id}
                          command={command}
                          onCommandChange={setCommand}
                          onSubmit={() => {
                            speech.unlock();
                            void runInstruction(id);
                          }}
                          onClose={() => {
                            setSelected(null);
                            voiceTarget.current = null;
                            setListeningId(null);
                            if (voice.listening) voice.stop();
                          }}
                          busy={busy}
                          listening={voice.listening && listeningId === id}
                          voiceSupported={voice.supported}
                          onToggleVoice={toggleDockVoice}
                          voiceError={voice.error}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {lastResult && runtimes[lastResult.officerId]?.phase === "success" ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-white px-4 py-3">
                <p className="text-sm text-navy">
                  <span className="font-semibold">{OFFICER_DESK_META[lastResult.officerId].name}:</span>{" "}
                  {lastResult.summary}
                </p>
                <Button type="button" size="sm" onClick={() => setShowResult(true)}>
                  View Result
                </Button>
              </div>
            ) : null}

            {lastResult &&
            (runtimes[lastResult.officerId]?.phase === "error" ||
              runtimes[lastResult.officerId]?.phase === "speaking") &&
            lastResult.summary &&
            runtimes[lastResult.officerId]?.bubbleTone === "error" ? (
              <div className="mt-4 rounded-xl border border-red/25 bg-red/5 px-4 py-3 text-sm text-red">
                <p className="font-semibold">Something needs your attention.</p>
                <p className="mt-1 text-navy/90">{lastResult.summary}</p>
                <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => setShowResult(true)}>
                  Review details
                </Button>
              </div>
            ) : null}

            {!selected && !busy ? (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Mic dabao → boliye → officer sunega. Kaam ke baad officer jawab bolega.
              </p>
            ) : null}
          </>
        )}
      </main>

      {showResult && lastResult ? (
        <OfficerResultSheet
          officerId={lastResult.officerId}
          accessToken={accessToken}
          summary={lastResult.summary}
          result={lastResult.result}
          onClose={() => setShowResult(false)}
          onChanged={refresh}
        />
      ) : null}
    </div>
  );
}
