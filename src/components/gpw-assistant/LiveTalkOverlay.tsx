"use client";

import { ChevronLeft, ChevronRight, Mic, MicOff, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AssistantVoiceChoice } from "./useSpeechPlayback";

export type LiveTalkPhase = "picker" | "session";
export type LiveTalkPulseState = "idle" | "listening" | "thinking" | "speaking";

type LiveTalkOverlayProps = {
  phase: LiveTalkPhase;
  pulseState: LiveTalkPulseState;
  statusText: string;
  /** Only the user's live/interim speech — never the assistant answer. */
  liveTranscript?: string | null;
  muted: boolean;
  speaking?: boolean;
  /** Model is generating — mic button interrupts / cancels. */
  thinking?: boolean;
  voices: AssistantVoiceChoice[];
  selectedUri: string | null;
  onSelectVoice: (uri: string) => void;
  onPreviewVoice: (uri: string) => void;
  onStart: () => void;
  onToggleMute: () => void;
  /** Stop TTS immediately and listen again. */
  onInterrupt?: () => void;
  onClose: () => void;
  interruptLabel?: string;
};

const VOICE_BLURBS = [
  "Clear campus English",
  "Warm and steady",
  "Natural Hindi accent",
  "Calm and precise",
  "Friendly campus guide",
  "Soft and natural",
] as const;

function voiceBlurb(index: number): string {
  return VOICE_BLURBS[index % VOICE_BLURBS.length] ?? "Natural speaking voice";
}

function PulseBars({ state }: { state: LiveTalkPulseState }) {
  return (
    <span className="gpw-live-pulse" data-state={state} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/**
 * ChatGPT-style voice UI (2025+): stay in the chat, show transcript text,
 * and use a small animated pulse — not a full-screen ball.
 */
export function LiveTalkOverlay({
  phase,
  pulseState,
  statusText,
  liveTranscript,
  muted,
  speaking = false,
  thinking = false,
  voices,
  selectedUri,
  onSelectVoice,
  onPreviewVoice,
  onStart,
  onToggleMute,
  onInterrupt,
  onClose,
  interruptLabel = "Interrupt",
}: LiveTalkOverlayProps) {
  const canInterrupt = speaking || thinking;
  const initialIndex = useMemo(() => {
    if (!voices.length) return 0;
    const found = voices.findIndex((v) => v.uri === selectedUri);
    return found >= 0 ? found : 0;
  }, [voices, selectedUri]);

  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  const active = voices[index] ?? null;

  function go(delta: number) {
    if (!voices.length) return;
    const next = (index + delta + voices.length) % voices.length;
    setIndex(next);
    const voice = voices[next];
    if (voice) {
      onSelectVoice(voice.uri);
      onPreviewVoice(voice.uri);
    }
  }

  if (phase === "picker") {
    return (
      <div className="gpw-live-picker-sheet" role="dialog" aria-modal="true" aria-label="Choose a voice">
        <button type="button" className="gpw-live-close-float" onClick={onClose} aria-label="Close">
          <X className="size-4" />
        </button>

        <div className="gpw-live-picker-card">
          <PulseBars state="idle" />
          <p className="gpw-live-picker-kicker">Voice mode</p>

          <div className="gpw-live-picker-stage">
            <button
              type="button"
              className="gpw-live-nav"
              onClick={() => go(-1)}
              disabled={voices.length < 2}
              aria-label="Previous voice"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="gpw-live-picker-main">
              <p className="gpw-live-voice-name">{active?.name ?? "Default voice"}</p>
              <p className="gpw-live-voice-blurb">{voiceBlurb(index)}</p>
              <p className="gpw-live-voice-meta">{active?.lang ?? "Loading voices…"}</p>
            </div>

            <button
              type="button"
              className="gpw-live-nav"
              onClick={() => go(1)}
              disabled={voices.length < 2}
              aria-label="Next voice"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {voices.length > 1 ? (
            <div className="gpw-live-dots" aria-hidden="true">
              {voices.map((voice, i) => (
                <button
                  key={voice.uri}
                  type="button"
                  className="gpw-live-dot"
                  data-active={i === index ? "true" : "false"}
                  onClick={() => {
                    setIndex(i);
                    onSelectVoice(voice.uri);
                    onPreviewVoice(voice.uri);
                  }}
                  aria-label={`Select ${voice.name}`}
                />
              ))}
            </div>
          ) : null}

          <button
            type="button"
            className="gpw-live-start"
            onClick={() => {
              if (active) onSelectVoice(active.uri);
              onStart();
            }}
            disabled={!active && voices.length === 0}
          >
            Start voice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gpw-live-dock" role="region" aria-label="Voice conversation controls">
      {liveTranscript ? (
        <div className="gpw-assistant-msg gpw-assistant-msg--user">
          <p className="gpw-assistant-bubble gpw-assistant-bubble--user gpw-live-user-interim" role="status">
            {liveTranscript}
          </p>
        </div>
      ) : null}

      <div className="gpw-live-dock-bar">
        <div className="gpw-live-dock-meta">
          <PulseBars state={pulseState} />
          <div className="min-w-0">
            <p className="gpw-live-dock-label">Live</p>
            <p className="gpw-live-dock-status">{statusText}</p>
          </div>
        </div>

        <div className="gpw-live-bar-actions">
          <button
            type="button"
            className="gpw-live-bar-btn"
            data-interrupt={canInterrupt ? "true" : "false"}
            onClick={() => {
              if (canInterrupt && onInterrupt) {
                onInterrupt();
                return;
              }
              onToggleMute();
            }}
            aria-pressed={canInterrupt ? undefined : muted}
            aria-label={
              canInterrupt
                ? interruptLabel
                : muted
                  ? "Unmute microphone"
                  : "Mute microphone"
            }
            title={canInterrupt ? interruptLabel : muted ? "Unmute" : "Mute"}
          >
            {canInterrupt ? (
              <Mic className="size-4" strokeWidth={2.25} />
            ) : muted ? (
              <MicOff className="size-4" strokeWidth={2.25} />
            ) : (
              <Mic className="size-4" strokeWidth={2.25} />
            )}
          </button>
          <button
            type="button"
            className="gpw-live-bar-btn gpw-live-bar-btn--close"
            onClick={onClose}
            aria-label="End voice"
            title="End voice"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
