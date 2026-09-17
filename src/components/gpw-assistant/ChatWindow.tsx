"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  AudioLines,
  Mic,
  MicOff,
  Minus,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { ASSISTANT_NAME } from "@/lib/assistant/constants";
import {
  assistantChromeCopy,
  speechRecognitionLang,
} from "@/lib/assistant/language-intent";
import { INSTITUTE } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, ErrorMessage, WelcomeMessage } from "./ChatMessage";
import { LiveTalkOverlay, type LiveTalkPhase, type LiveTalkPulseState } from "./LiveTalkOverlay";
import { QuickActions } from "./QuickActions";
import { TypingIndicator } from "./TypingIndicator";
import type { useAssistantChat } from "./useAssistantChat";
import { useSpeechPlayback } from "./useSpeechPlayback";
import { useVoiceInput } from "./useVoiceInput";
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
    language,
    showWelcome,
    consumeSpeakFor,
  } = chat;

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [livePhase, setLivePhase] = useState<LiveTalkPhase | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const liveModeRef = useRef(false);
  const micMutedRef = useRef(false);
  const isStreamingRef = useRef(isStreaming);
  isStreamingRef.current = isStreaming;
  const spokenIdRef = useRef<string | null>(null);
  const resumeListenTimerRef = useRef<number | null>(null);
  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  const playback = useSpeechPlayback(language);
  const { speak: speakReply, stop: stopPlayback, speaking, unlock: unlockSpeech } = playback;
  const speakingRef = useRef(speaking);
  speakingRef.current = speaking;

  const chrome = assistantChromeCopy(language);
  const hasDraft = Boolean(input.trim());

  const clearResumeTimer = useCallback(() => {
    if (resumeListenTimerRef.current !== null) {
      window.clearTimeout(resumeListenTimerRef.current);
      resumeListenTimerRef.current = null;
    }
  }, []);

  const voice = useVoiceInput({
    lang: speechRecognitionLang(language),
    live: liveMode,
    onTranscript: (text) => {
      void sendMessageRef.current(text, { speakReply: true });
    },
    onSessionEnd: (hadTranscript) => {
      if (!liveModeRef.current || hadTranscript) return;
      if (micMutedRef.current) return;
      if (isStreamingRef.current || speakingRef.current) return;
      if (panelState !== "open") return;
      clearResumeTimer();
      resumeListenTimerRef.current = window.setTimeout(() => {
        if (
          liveModeRef.current &&
          !micMutedRef.current &&
          !isStreamingRef.current &&
          !speakingRef.current
        ) {
          voiceStartRef.current?.();
        }
      }, 400);
    },
  });

  const voiceStartRef = useRef(voice.start);
  voiceStartRef.current = voice.start;
  const { stop: stopListening, abort: abortListening } = voice;

  const resumeListening = useCallback(() => {
    if (!liveModeRef.current || panelState !== "open") return;
    if (micMutedRef.current) return;
    if (isStreamingRef.current || speakingRef.current) return;
    clearResumeTimer();
    resumeListenTimerRef.current = window.setTimeout(() => {
      if (
        liveModeRef.current &&
        !micMutedRef.current &&
        !isStreamingRef.current &&
        !speakingRef.current
      ) {
        voiceStartRef.current?.();
      }
    }, 350);
  }, [clearResumeTimer, panelState]);

  useEffect(() => {
    if (isStreaming) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (spokenIdRef.current === last.id) return;

    const fromVoice = consumeSpeakFor(last.id);
    const shouldSpeak = fromVoice || liveModeRef.current || playback.enabled;
    if (!shouldSpeak) return;

    spokenIdRef.current = last.id;
    abortListening();
    window.speechSynthesis?.resume();
    speakReply(last.content, {
      onEnd: () => {
        if (liveModeRef.current) resumeListening();
      },
    });
  }, [
    messages,
    isStreaming,
    playback.enabled,
    speakReply,
    abortListening,
    resumeListening,
    consumeSpeakFor,
  ]);

  useEffect(() => {
    if (!liveMode) return;
    if (isStreaming || speaking) abortListening();
  }, [liveMode, isStreaming, speaking, abortListening]);

  useEffect(() => {
    if (!liveMode || !error || isStreaming || speaking) return;
    resumeListening();
  }, [liveMode, error, isStreaming, speaking, resumeListening]);

  useEffect(() => {
    if (panelState === "open") return;
    liveModeRef.current = false;
    setLiveMode(false);
    setLivePhase(null);
    setMicMuted(false);
    micMutedRef.current = false;
    clearResumeTimer();
    abortListening();
    stopPlayback();
  }, [panelState, abortListening, stopPlayback, clearResumeTimer]);

  useEffect(() => {
    if (panelState !== "open") return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming, panelState, liveMode, voice.interimText]);

  useEffect(() => {
    if (panelState !== "open" || livePhase) return;
    inputRef.current?.focus();
  }, [panelState, livePhase]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "1.5rem";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [input]);

  const endLiveTalk = useCallback(() => {
    liveModeRef.current = false;
    setLiveMode(false);
    setLivePhase(null);
    setMicMuted(false);
    micMutedRef.current = false;
    clearResumeTimer();
    abortListening();
    stopPlayback();
  }, [abortListening, clearResumeTimer, stopPlayback]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (livePhase) {
        endLiveTalk();
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [livePhase, endLiveTalk, onClose]);

  useEffect(
    () => () => {
      clearResumeTimer();
    },
    [clearResumeTimer],
  );

  if (panelState === "closed") return null;

  const minimized = panelState === "minimized";

  function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    if (!input.trim()) return;
    stopListening();
    stopPlayback();
    void sendMessage(input);
  }

  function openVoicePicker() {
    unlockSpeech();
    stopPlayback();
    abortListening();
    setMicMuted(false);
    micMutedRef.current = false;
    setLivePhase("picker");
  }

  function startLiveTalk() {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant") spokenIdRef.current = last.id;
    unlockSpeech();
    playback.setEnabled(true);
    stopPlayback();
    abortListening();
    liveModeRef.current = true;
    setLiveMode(true);
    setLivePhase("session");
    setMicMuted(false);
    micMutedRef.current = false;
    voiceStartRef.current?.();
  }

  function toggleMute() {
    const next = !micMutedRef.current;
    micMutedRef.current = next;
    setMicMuted(next);
    if (next) {
      clearResumeTimer();
      abortListening();
      return;
    }
    if (!speakingRef.current && !isStreamingRef.current) {
      voiceStartRef.current?.();
    }
  }

  function toggleMic() {
    if (liveMode) {
      endLiveTalk();
      return;
    }
    if (!voice.listening) {
      unlockSpeech();
      playback.setEnabled(true);
      const last = messages[messages.length - 1];
      if (last?.role === "assistant") spokenIdRef.current = last.id;
    }
    voice.toggle();
  }

  const pulseState: LiveTalkPulseState = speaking
    ? "speaking"
    : isStreaming
      ? "thinking"
      : voice.listening && !micMuted
        ? "listening"
        : "idle";

  const liveStatus = (() => {
    if (micMuted) return language === "english" ? "Microphone muted" : "Mic band hai";
    if (speaking) return chrome.speakingAnswer;
    if (isStreaming) return chrome.liveThinking;
    if (voice.listening) return chrome.liveSpeakNow;
    if (voice.error) return voice.error;
    return chrome.liveReady;
  })();

  const liveTranscript = (() => {
    if (!liveMode) return null;
    if (voice.listening && voice.interimText.trim()) return voice.interimText.trim();
    if (speaking || isStreaming) {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant" && last.content.trim()) return last.content.trim();
    }
    return null;
  })();

  const voiceStatus = (() => {
    if (livePhase) return null;
    if (voice.error) return { error: true, text: voice.error };
    if (speaking) return { error: false, text: chrome.speakingAnswer };
    if (voice.listening) {
      return {
        error: false,
        text: voice.interimText ? voice.interimText : chrome.listeningWillSpeak,
      };
    }
    return null;
  })();

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
            <h2 className="font-display text-base font-bold leading-tight text-on-dark">
              {ASSISTANT_NAME}
            </h2>
            <p className="mt-0.5 text-[11px] leading-snug text-on-dark-muted">
              {liveMode ? chrome.liveSubtitle : INSTITUTE.name}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {playback.supported ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-on-dark-muted hover:bg-on-dark/10 hover:text-on-dark"
              onClick={playback.toggleEnabled}
              aria-pressed={playback.enabled}
              aria-label={playback.enabled ? "Turn off spoken replies" : "Read replies aloud"}
              title={playback.enabled ? "Spoken replies on" : "Read replies aloud"}
            >
              {playback.enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-on-dark-muted hover:bg-on-dark/10 hover:text-on-dark"
            onClick={() => {
              endLiveTalk();
              clearChat();
            }}
            aria-label="Clear conversation"
            title="New chat"
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
          {livePhase !== "picker" ? (
            <>
              <div ref={scrollRef} className="gpw-assistant-scroll">
                <div className="gpw-assistant-messages">
                  {showWelcome ? <WelcomeMessage /> : null}
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {liveMode && voice.listening && voice.interimText.trim() ? (
                    <div className="flex justify-end">
                      <div className="gpw-assistant-bubble gpw-assistant-bubble--user max-w-[88%] opacity-80">
                        {voice.interimText.trim()}
                      </div>
                    </div>
                  ) : null}
                  {isStreaming ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TypingIndicator />
                      <span>{ASSISTANT_NAME} is typing…</span>
                    </div>
                  ) : null}
                  {error ? <ErrorMessage onContact={goToContact} message={error} /> : null}
                </div>

                {!liveMode ? (
                  <div className="gpw-assistant-quick">
                    <QuickActions
                      actions={contextualActions}
                      onSelect={(message) => void sendMessage(message)}
                      disabled={isStreaming}
                    />
                  </div>
                ) : null}
              </div>

              {voiceStatus ? (
                <p className="gpw-assistant-voice-status" role="status">
                  {voiceStatus.error ? (
                    <span className="text-destructive">{voiceStatus.text}</span>
                  ) : (
                    <>
                      <span className="gpw-assistant-voice-dot" aria-hidden="true" />
                      {voiceStatus.text}
                    </>
                  )}
                </p>
              ) : null}

              {livePhase === "session" ? (
                <LiveTalkOverlay
                  phase="session"
                  pulseState={pulseState}
                  statusText={liveStatus}
                  liveTranscript={liveTranscript}
                  muted={micMuted}
                  voices={playback.voices}
                  selectedUri={playback.voiceUri}
                  onSelectVoice={playback.setVoiceUri}
                  onPreviewVoice={playback.previewVoice}
                  onStart={startLiveTalk}
                  onToggleMute={toggleMute}
                  onClose={endLiveTalk}
                />
              ) : (
                <form className="gpw-assistant-composer" onSubmit={handleSubmit}>
                  <div className="gpw-assistant-composer-shell">
                    <Textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={chrome.placeholderDefault}
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

                    <div className="gpw-assistant-composer-actions">
                      {voice.supported ? (
                        <button
                          type="button"
                          onClick={toggleMic}
                          disabled={isStreaming}
                          aria-pressed={voice.listening}
                          aria-label={voice.listening ? "Stop listening" : "Dictate with microphone"}
                          title={voice.listening ? "Stop" : chrome.micSpeakTitle}
                          className="gpw-assistant-tool"
                          data-active={voice.listening ? "true" : "false"}
                        >
                          {voice.listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                        </button>
                      ) : null}

                      {hasDraft ? (
                        <button
                          type="submit"
                          disabled={isStreaming || !hasDraft}
                          className="gpw-assistant-voice-btn gpw-assistant-voice-btn--send"
                          aria-label="Send message"
                          title="Send"
                        >
                          <ArrowUp className="size-4" strokeWidth={2.5} />
                        </button>
                      ) : voice.supported ? (
                        <button
                          type="button"
                          onClick={openVoicePicker}
                          disabled={isStreaming}
                          aria-label="Start voice mode"
                          title={chrome.liveStartTitle}
                          className="gpw-assistant-voice-btn"
                        >
                          <AudioLines className="size-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isStreaming || !hasDraft}
                          className="gpw-assistant-voice-btn gpw-assistant-voice-btn--send"
                          aria-label="Send message"
                          title="Send"
                        >
                          <ArrowUp className="size-4" strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </>
          ) : null}

          {livePhase === "picker" ? (
            <LiveTalkOverlay
              phase="picker"
              pulseState="idle"
              statusText=""
              muted={false}
              voices={playback.voices}
              selectedUri={playback.voiceUri}
              onSelectVoice={playback.setVoiceUri}
              onPreviewVoice={playback.previewVoice}
              onStart={startLiveTalk}
              onToggleMute={toggleMute}
              onClose={endLiveTalk}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
