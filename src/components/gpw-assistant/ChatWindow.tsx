"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  AudioLines,
  Mic,
  Minus,
  RotateCcw,
  Square,
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
import { ComposerWaveform } from "./ComposerWaveform";
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
    cancelInFlight,
  } = chat;

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [livePhase, setLivePhase] = useState<LiveTalkPhase | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [dictatedTurn, setDictatedTurn] = useState(false);
  const liveModeRef = useRef(false);
  const micMutedRef = useRef(false);
  const isStreamingRef = useRef(isStreaming);
  isStreamingRef.current = isStreaming;
  const spokenIdRef = useRef<string | null>(null);
  const resumeListenTimerRef = useRef<number | null>(null);
  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;
  const setInputRef = useRef(setInput);
  setInputRef.current = setInput;

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

  const cancelInFlightRef = useRef(cancelInFlight);
  cancelInFlightRef.current = cancelInFlight;

  const voice = useVoiceInput({
    lang: speechRecognitionLang(language),
    live: liveMode,
    dictate: !liveMode,
    onPartial: (text) => {
      if (liveModeRef.current) return;
      setInputRef.current(text);
    },
    onSpeechActivity: () => {
      /* Instant barge-in: cut TTS / cancel think as soon as speech is heard. */
      if (!liveModeRef.current) return;
      if (speakingRef.current) stopPlayback();
      if (isStreamingRef.current) cancelInFlightRef.current();
    },
    onTranscript: (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (speakingRef.current) stopPlayback();
      if (isStreamingRef.current) cancelInFlightRef.current();
      /* Ignore lone stop-words used only to interrupt. */
      if (/^(ruk|rukho|stop|bas|band|wait|chup|quiet|enough)$/i.test(trimmed)) return;
      void sendMessageRef.current(trimmed, {
        speakReply: true,
        live: liveModeRef.current,
      });
    },
    onSessionEnd: (hadTranscript) => {
      if (!liveModeRef.current) return;
      if (!hadTranscript) {
        if (micMutedRef.current) return;
        if (isStreamingRef.current) return;
        if (speakingRef.current) return;
        if (panelState !== "open") return;
        clearResumeTimer();
        resumeListenTimerRef.current = window.setTimeout(() => {
          if (
            liveModeRef.current &&
            !micMutedRef.current &&
            !isStreamingRef.current &&
            !speakingRef.current
          ) {
            voiceStartRef.current?.({ dictate: false, live: true });
          }
        }, 220);
      }
    },
  });

  const voiceStartRef = useRef(voice.start);
  voiceStartRef.current = voice.start;
  const { stop: stopListening, abort: abortListening } = voice;

  const resumeListening = useCallback(() => {
    if (!liveModeRef.current || panelState !== "open") return;
    if (micMutedRef.current) return;
    if (isStreamingRef.current) return;
    clearResumeTimer();
    resumeListenTimerRef.current = window.setTimeout(() => {
      if (liveModeRef.current && !micMutedRef.current && !isStreamingRef.current) {
        voiceStartRef.current?.({ dictate: false, live: true });
      }
    }, 180);
  }, [clearResumeTimer, panelState]);

  const interruptSpeech = useCallback(() => {
    stopPlayback();
    if (isStreamingRef.current) cancelInFlightRef.current();
    if (!liveModeRef.current || micMutedRef.current) return;
    clearResumeTimer();
    voiceStartRef.current?.({ dictate: false, live: true });
  }, [clearResumeTimer, stopPlayback]);

  useEffect(() => {
    if (isStreaming) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (spokenIdRef.current === last.id) return;

    const fromVoice = consumeSpeakFor(last.id);
    const shouldSpeak = fromVoice || liveModeRef.current || playback.enabled;
    if (!shouldSpeak) return;

    spokenIdRef.current = last.id;
    /* Keep mic available for barge-in — do not abort listening before TTS. */
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
    resumeListening,
    consumeSpeakFor,
  ]);

  /* Only pause the mic while the model is thinking — not while TTS is playing. */
  useEffect(() => {
    if (!liveMode) return;
    if (isStreaming) abortListening();
  }, [liveMode, isStreaming, abortListening]);

  /* Barge-in listen: reopen the mic almost immediately after TTS starts. */
  useEffect(() => {
    if (!liveMode || !speaking || micMuted) return;
    const timer = window.setTimeout(() => {
      if (
        liveModeRef.current &&
        speakingRef.current &&
        !micMutedRef.current &&
        !isStreamingRef.current
      ) {
        voiceStartRef.current?.({ dictate: false, live: true });
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [liveMode, speaking, micMuted]);

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
    const text = input.trim();
    if (!text) return;
    if (voice.listening && !liveMode) voice.stop();
    stopListening();
    stopPlayback();
    const speak = dictatedTurn || liveModeRef.current;
    setDictatedTurn(false);
    void sendMessage(text, speak ? { speakReply: true } : undefined);
  }

  function startComposeDictate() {
    if (isStreaming) return;
    if (speakingRef.current) interruptSpeech();
    unlockSpeech();
    setDictatedTurn(true);
    voice.start({ prefix: input, dictate: true, live: false });
  }

  function stopComposeDictate() {
    voice.stop();
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
    voiceStartRef.current?.({ dictate: false, live: true });
  }

  function toggleMute() {
    if (speakingRef.current || isStreamingRef.current) {
      interruptSpeech();
      return;
    }
    const next = !micMutedRef.current;
    micMutedRef.current = next;
    setMicMuted(next);
    if (next) {
      clearResumeTimer();
      abortListening();
      return;
    }
    if (!isStreamingRef.current) {
      voiceStartRef.current?.({ dictate: false, live: true });
    }
  }

  function toggleMic() {
    if (liveMode) {
      if (speakingRef.current || isStreamingRef.current) {
        interruptSpeech();
        return;
      }
      endLiveTalk();
      return;
    }
    if (speakingRef.current) {
      interruptSpeech();
      return;
    }
    if (voice.listening) {
      stopComposeDictate();
      return;
    }
    startComposeDictate();
  }

  const pulseState: LiveTalkPulseState = speaking
    ? "speaking"
    : isStreaming
      ? "thinking"
      : voice.listening && !micMuted
        ? "listening"
        : "idle";

  const liveStatus = (() => {
    if (micMuted) return language === "english" ? "Mic muted" : "Mic band";
    if (speaking) return chrome.speakingAnswer;
    if (isStreaming) return chrome.liveThinking;
    if (voice.listening) return chrome.liveSpeakNow;
    if (voice.error) return voice.error;
    return chrome.liveReady;
  })();

  /* Only the student's interim speech — never dump the assistant answer into the dock. */
  const liveTranscript = (() => {
    if (!liveMode || isStreaming) return null;
    if (voice.listening && voice.interimText.trim()) return voice.interimText.trim();
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
      data-live={livePhase === "session" ? "true" : "false"}
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
                    <div className="gpw-assistant-msg gpw-assistant-msg--user">
                      <div className="gpw-assistant-bubble gpw-assistant-bubble--user opacity-80">
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
                  {livePhase === "session" ? <div className="h-2 shrink-0" aria-hidden="true" /> : null}
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
                  speaking={speaking}
                  thinking={isStreaming}
                  voices={playback.voices}
                  selectedUri={playback.voiceUri}
                  onSelectVoice={playback.setVoiceUri}
                  onPreviewVoice={playback.previewVoice}
                  onStart={startLiveTalk}
                  onToggleMute={toggleMute}
                  onInterrupt={interruptSpeech}
                  interruptLabel={chrome.micInterruptTitle}
                  onClose={endLiveTalk}
                />
              ) : (
                <form className="gpw-assistant-composer" onSubmit={handleSubmit}>
                  <div
                    className="gpw-assistant-composer-shell"
                    data-listening={voice.listening && !liveMode ? "true" : "false"}
                  >
                    <Textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => {
                        setDictatedTurn(false);
                        setInput(e.target.value);
                      }}
                      placeholder={
                        voice.listening && !liveMode
                          ? language === "english"
                            ? "Listening… speak now"
                            : "Sun rahe hain… boliye"
                          : chrome.placeholderDefault
                      }
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
                      {voice.supported && voice.listening && !liveMode ? (
                        <>
                          <ComposerWaveform active />
                          <button
                            type="button"
                            onClick={stopComposeDictate}
                            className="gpw-assistant-stop-btn"
                            aria-label="Stop listening"
                            title="Stop"
                          >
                            <Square className="size-3.5" fill="currentColor" />
                          </button>
                        </>
                      ) : null}

                      {voice.supported && !(voice.listening && !liveMode) ? (
                        <>
                          <button
                            type="button"
                            onClick={toggleMic}
                            disabled={isStreaming}
                            aria-label="Dictate with microphone"
                            title={chrome.micSpeakTitle}
                            className="gpw-assistant-tool gpw-assistant-tool--mic"
                          >
                            <Mic className="size-4" strokeWidth={2.25} />
                          </button>
                          <button
                            type="button"
                            onClick={openVoicePicker}
                            disabled={isStreaming}
                            aria-label="Start live voice chat"
                            title={chrome.liveStartTitle}
                            className="gpw-assistant-tool gpw-assistant-tool--live"
                          >
                            <AudioLines className="size-4" strokeWidth={2.25} />
                          </button>
                        </>
                      ) : null}

                      <button
                        type="submit"
                        disabled={isStreaming || !hasDraft}
                        className="gpw-assistant-voice-btn gpw-assistant-voice-btn--send"
                        aria-label="Send message"
                        title="Send"
                      >
                        <ArrowUp className="size-4" strokeWidth={2.5} />
                      </button>
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
