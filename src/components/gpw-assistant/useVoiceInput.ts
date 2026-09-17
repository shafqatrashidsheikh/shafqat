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
/** Live talk: short silence = snappy turn-taking. */
const LIVE_SILENCE_TIMEOUT_MS = 850;
/** Compose/dictate (Cursor-style): stay open until the user presses Stop. */
const DICTATE_SILENCE_TIMEOUT_MS = 120_000;

/** Words that mean “stop talking” even as a single token (barge-in). */
const BARGE_IN_STOP =
  /^(ruk|rukho|stop|bas|band|wait|chup|quiet|enough|cancel|cancel\s*karo)$/i;

export type VoiceInputOptions = {
  /** BCP-47 tag, e.g. en-IN for Hinglish, ur-PK, hi-IN. */
  lang: string;
  /**
   * Final transcript for the session.
   * Live mode: auto-sends. Dictate mode: usually ignored (text already in the box).
   */
  onTranscript: (text: string) => void;
  /**
   * Live partial text (final + interim) — used to fill the composer while speaking
   * like Cursor’s voice input.
   */
  onPartial?: (text: string) => void;
  /**
   * Live talk: shorter silence window and soft “no speech” handling so the
   * host can keep the conversation loop running.
   */
  live?: boolean;
  /**
   * Cursor-style compose dictate: keep listening until Stop; stream text via onPartial;
   * do not auto-fire onTranscript on end (user sends manually).
   */
  dictate?: boolean;
  /** Called whenever a recognition session ends (with or without text). */
  onSessionEnd?: (hadTranscript: boolean) => void;
  /**
   * Fired as soon as meaningful speech is heard (interim or final).
   * Used to stop TTS immediately during live barge-in.
   */
  onSpeechActivity?: (text: string) => void;
};

export function useVoiceInput({
  lang,
  onTranscript,
  onPartial,
  live = false,
  dictate = false,
  onSessionEnd,
  onSpeechActivity,
}: VoiceInputOptions) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef("");
  const silenceRef = useRef<number | null>(null);
  const liveRef = useRef(live);
  liveRef.current = live;
  const dictateRef = useRef(dictate);
  dictateRef.current = dictate;
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;
  const onPartialRef = useRef(onPartial);
  onPartialRef.current = onPartial;
  const onSessionEndRef = useRef(onSessionEnd);
  onSessionEndRef.current = onSessionEnd;
  const onSpeechActivityRef = useRef(onSpeechActivity);
  onSpeechActivityRef.current = onSpeechActivity;
  const bargeFiredRef = useRef(false);
  /** Prefix already in the composer when dictate started. */
  const composePrefixRef = useRef("");

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

  const start = useCallback(
    (options?: { prefix?: string; dictate?: boolean; live?: boolean }) => {
      const Ctor = getRecognitionCtor();
      if (!Ctor) {
        setError("Voice input is not supported in this browser. Try Chrome or Edge.");
        return;
      }

      recognitionRef.current?.abort();
      setError(null);
      setInterimText("");
      finalRef.current = "";
      bargeFiredRef.current = false;
      composePrefixRef.current = options?.prefix?.trim() ? `${options.prefix.trim()} ` : "";

      const sessionDictate = options?.dictate ?? dictateRef.current;
      const sessionLive = options?.live ?? liveRef.current;
      dictateRef.current = sessionDictate;
      liveRef.current = sessionLive;

      const recognition = new Ctor();
      recognition.lang = lang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const silenceMs = sessionDictate
        ? DICTATE_SILENCE_TIMEOUT_MS
        : sessionLive
          ? LIVE_SILENCE_TIMEOUT_MS
          : DEFAULT_SILENCE_TIMEOUT_MS;

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

        const spoken = `${finalRef.current} ${interim}`.trim();
        const combined = `${composePrefixRef.current}${spoken}`.trim();
        if (sessionDictate && combined) onPartialRef.current?.(combined);

        /* Barge-in: notify host as soon as real speech is heard (don’t wait for silence). */
        if (sessionLive && spoken && !bargeFiredRef.current) {
          const words = spoken.split(/\s+/).filter(Boolean);
          const first = words[0] ?? "";
          const meaningful =
            BARGE_IN_STOP.test(spoken.trim()) ||
            BARGE_IN_STOP.test(first) ||
            words.length >= 2 ||
            (words.length === 1 && first.length >= 4);
          if (meaningful) {
            bargeFiredRef.current = true;
            onSpeechActivityRef.current?.(spoken);
          }
        }

        clearSilenceTimer();
        silenceRef.current = window.setTimeout(() => recognition.stop(), silenceMs);
      };

      recognition.onerror = (event) => {
        if (event.error === "aborted") return;
        if ((sessionLive || sessionDictate) && event.error === "no-speech") return;
        setError(ERROR_MESSAGES[event.error] ?? "Voice input failed. Please type instead.");
      };

      recognition.onend = () => {
        clearSilenceTimer();
        setListening(false);
        setInterimText("");
        const spoken = finalRef.current.trim();
        finalRef.current = "";
        const combined = `${composePrefixRef.current}${spoken}`.trim();
        composePrefixRef.current = "";

        if (sessionDictate) {
          if (combined) onPartialRef.current?.(combined);
          onSessionEndRef.current?.(Boolean(spoken));
          return;
        }

        if (spoken) onTranscriptRef.current(spoken);
        onSessionEndRef.current?.(Boolean(spoken));
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch {
        setError("Voice input could not start. Please try again.");
        setListening(false);
      }
    },
    [clearSilenceTimer, lang],
  );

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
