/**
 * Microphone dictation / live talk for the assistant, built on the browser
 * SpeechRecognition API (Chrome, Edge, Android Chrome, iOS Safari 16+).
 * Nothing is uploaded by us — the browser handles transcription.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionAlternativeLike = { transcript: string };
type SpeechRecognitionResultLike = {
  readonly length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: {
    readonly length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
};
type SpeechRecognitionErrorEventLike = { error: string };

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Microphone blocked. Allow mic access in your browser settings.",
  "service-not-allowed": "Microphone blocked. Allow mic access in your browser settings.",
  "no-speech": "Kuch sunai nahi diya. Please try again.",
  "audio-capture": "No microphone found on this device.",
  network: "Voice service unavailable. Check your connection.",
};

/** Silence window after the last recognised words before dictation auto-stops. */
const DEFAULT_SILENCE_TIMEOUT_MS = 2500;
/** Faster turn-taking for live conversation. */
const LIVE_SILENCE_TIMEOUT_MS = 1500;

export type VoiceInputOptions = {
  /** BCP-47 tag, e.g. en-IN for Hinglish, ur-PK, hi-IN. */
  lang: string;
  /** Receives the final transcript for the current dictation. */
  onTranscript: (text: string) => void;
  /**
   * Live talk: shorter silence window and soft “no speech” handling so the
   * host can keep the conversation loop running.
   */
  live?: boolean;
  /** Called whenever a recognition session ends (with or without text). */
  onSessionEnd?: (hadTranscript: boolean) => void;
};

export function useVoiceInput({ lang, onTranscript, live = false, onSessionEnd }: VoiceInputOptions) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef("");
  const silenceRef = useRef<number | null>(null);
  const liveRef = useRef(live);
  liveRef.current = live;
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;
  const onSessionEndRef = useRef(onSessionEnd);
  onSessionEndRef.current = onSessionEnd;

  useEffect(() => {
    setSupported(Boolean(getRecognitionCtor()));
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceRef.current !== null) {
      window.clearTimeout(silenceRef.current);
      silenceRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearSilenceTimer();
    recognitionRef.current?.stop();
  }, [clearSilenceTimer]);

  const abort = useCallback(() => {
    clearSilenceTimer();
    recognitionRef.current?.abort();
    setListening(false);
    setInterimText("");
    finalRef.current = "";
  }, [clearSilenceTimer]);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    recognitionRef.current?.abort();
    setError(null);
    setInterimText("");
    finalRef.current = "";

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    const silenceMs = liveRef.current ? LIVE_SILENCE_TIMEOUT_MS : DEFAULT_SILENCE_TIMEOUT_MS;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result?.[0]?.transcript ?? "";
        if (result?.isFinal) finalRef.current = `${finalRef.current} ${transcript}`.trim();
        else interim = `${interim} ${transcript}`.trim();
      }
      setInterimText(interim);

      clearSilenceTimer();
      silenceRef.current = window.setTimeout(() => recognition.stop(), silenceMs);
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") return;
      /* Live mode: keep the loop quiet on empty turns; host restarts listening. */
      if (liveRef.current && event.error === "no-speech") return;
      setError(ERROR_MESSAGES[event.error] ?? "Voice input failed. Please type instead.");
    };

    recognition.onend = () => {
      clearSilenceTimer();
      setListening(false);
      setInterimText("");
      const text = finalRef.current.trim();
      finalRef.current = "";
      if (text) onTranscriptRef.current(text);
      onSessionEndRef.current?.(Boolean(text));
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setError("Voice input could not start. Please try again.");
      setListening(false);
    }
  }, [clearSilenceTimer, lang]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  useEffect(
    () => () => {
      clearSilenceTimer();
      recognitionRef.current?.abort();
    },
    [clearSilenceTimer],
  );

  return { supported, listening, interimText, error, start, stop, abort, toggle };
}
