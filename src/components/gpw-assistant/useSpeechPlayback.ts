/**
 * Reads assistant replies aloud with the browser speech synthesiser.
 * Mic / live talk unlock synthesis during the user gesture so Chrome will
 * still speak after the async API reply arrives.
 *
 * Accent rule: English replies use an English voice; Hindi / Hinglish /
 * Roman Hindi / Kashmiri use a Hindi voice; Urdu / Roman Urdu use Urdu
 * (fallback Hindi). A saved voice is ignored when its language family
 * does not match the current reply language.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  speechLangFamily,
  type AssistantLanguage,
  type SpeechLangFamily,
} from "@/lib/assistant/language-intent";

const SPEAK_PREF_KEY = "gpw-assistant-speak-v1";
const VOICE_URI_KEY = "gpw-assistant-voice-uri-v1";

export type AssistantVoiceChoice = {
  uri: string;
  name: string;
  lang: string;
  family: SpeechLangFamily;
  localService: boolean;
};

/** Markdown, links and list markers are noise when spoken. */
function toSpeakableText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_`#>]/g, "")
    .replace(/^\s*[-•]\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readStoredVoiceUri(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(VOICE_URI_KEY);
  } catch {
    return null;
  }
}

function writeStoredVoiceUri(uri: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (!uri) localStorage.removeItem(VOICE_URI_KEY);
    else localStorage.setItem(VOICE_URI_KEY, uri);
  } catch {
    /* ignore */
  }
}

function familyFromVoiceLang(lang: string): SpeechLangFamily {
  const base = lang.replace("_", "-").split("-")[0]?.toLowerCase() ?? "en";
  if (base === "hi") return "hi";
  if (base === "ur") return "ur";
  return "en";
}

function scoreVoice(voice: SpeechSynthesisVoice, prefer: SpeechLangFamily): number {
  const hay = `${voice.name} ${voice.lang}`.toLowerCase();
  const family = familyFromVoiceLang(voice.lang);
  let score = 0;
  if (family === prefer) score += 20;
  else if (prefer === "ur" && family === "hi") score += 8; /* Urdu fallback */
  else if (prefer === "hi" && family === "ur") score += 4;
  if (/en-in|hi-in|ur-pk|india|pakistan/i.test(hay)) score += 6;
  if (/natural|neural|online|premium|enhanced/i.test(hay)) score += 4;
  if (voice.localService) score += 1;
  if (/microsoft|google|apple/i.test(hay)) score += 2;
  return score;
}

function cleanVoiceName(name: string): string {
  return name.replace(/^Microsoft\s+/i, "").replace(/\s+Online\s*\(.*\)$/i, "").trim();
}

/** Voices for the picker — filtered to the reply language family. */
export function listAssistantVoices(language: AssistantLanguage): AssistantVoiceChoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const prefer = speechLangFamily(language);
  const voices = window.speechSynthesis.getVoices();
  const ranked = [...voices].sort((a, b) => scoreVoice(b, prefer) - scoreVoice(a, prefer));

  const seen = new Set<string>();
  const choices: AssistantVoiceChoice[] = [];
  for (const voice of ranked) {
    const family = familyFromVoiceLang(voice.lang);
    const allowed =
      family === prefer || (prefer === "ur" && family === "hi") || (prefer === "hi" && family === "ur");
    if (!allowed) continue;
    const key = `${voice.name}|${voice.lang}`;
    if (seen.has(key)) continue;
    seen.add(key);
    choices.push({
      uri: voice.voiceURI,
      name: cleanVoiceName(voice.name),
      lang: voice.lang.replace("_", "-"),
      family,
      localService: voice.localService,
    });
    if (choices.length >= 10) break;
  }
  return choices;
}

function resolveVoice(
  language: AssistantLanguage,
  preferredUri: string | null,
): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  const prefer = speechLangFamily(language);

  if (preferredUri) {
    const match = voices.find((v) => v.voiceURI === preferredUri);
    if (match) {
      const family = familyFromVoiceLang(match.lang);
      if (family === prefer || (prefer === "ur" && family === "hi")) return match;
    }
  }

  const ranked = [...voices].sort((a, b) => scoreVoice(b, prefer) - scoreVoice(a, prefer));
  return ranked[0] ?? null;
}

function previewLine(language: AssistantLanguage): string {
  const family = speechLangFamily(language);
  if (family === "hi") {
    return "नमस्ते। मैं जी पी डब्ल्यू श्रीनगर असिस्टेंट हूँ। मैं आपकी कैसे मदद कर सकती हूँ?";
  }
  if (family === "ur") {
    return "السلام علیکم۔ میں جی پی ڈبلیو سری نگر اسسٹنٹ ہوں۔ میں آپ کی کیسے مدد کر سکتی ہوں؟";
  }
  return "Hello. I am the GPW Srinagar assistant. How can I help you today?";
}

function readStoredPreference(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SPEAK_PREF_KEY) === "1";
}

export type SpeakOptions = {
  onEnd?: () => void;
};

/**
 * Must run inside a click/tap handler. Chrome blocks later speechSynthesis
 * calls that are not tied to a user gesture unless the engine was primed.
 */
export function unlockSpeechSynthesis(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.resume();
    const priming = new SpeechSynthesisUtterance(" ");
    priming.volume = 0;
    priming.rate = 2;
    priming.lang = "en-IN";
    window.speechSynthesis.speak(priming);
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}

export function useSpeechPlayback(language: AssistantLanguage) {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<AssistantVoiceChoice[]>([]);
  const [voiceUri, setVoiceUriState] = useState<string | null>(null);
  const languageRef = useRef(language);
  languageRef.current = language;
  const voiceUriRef = useRef<string | null>(null);
  const endCallbackRef = useRef<(() => void) | null>(null);
  const keepAliveRef = useRef<number | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    setEnabled(readStoredPreference());
    const stored = readStoredVoiceUri();
    voiceUriRef.current = stored;
    setVoiceUriState(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const sync = () => {
      window.speechSynthesis.getVoices();
      const next = listAssistantVoices(languageRef.current);
      setVoices(next);
      /* Drop a stored voice that no longer matches this language family. */
      const stored = voiceUriRef.current;
      if (stored && next.length && !next.some((v) => v.uri === stored)) {
        const fallback = next[0]?.uri ?? null;
        voiceUriRef.current = fallback;
        setVoiceUriState(fallback);
        writeStoredVoiceUri(fallback);
      } else if (!stored && next[0]) {
        voiceUriRef.current = next[0].uri;
        setVoiceUriState(next[0].uri);
      }
    };
    sync();
    window.speechSynthesis.addEventListener("voiceschanged", sync);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", sync);
  }, [language]);

  const setVoiceUri = useCallback((uri: string | null) => {
    voiceUriRef.current = uri;
    setVoiceUriState(uri);
    writeStoredVoiceUri(uri);
  }, []);

  const clearKeepAlive = useCallback(() => {
    if (keepAliveRef.current !== null) {
      window.clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    endCallbackRef.current = null;
    clearKeepAlive();
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [clearKeepAlive]);

  const speak = useCallback(
    (markdown: string, options?: SpeakOptions) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        options?.onEnd?.();
        return;
      }
      const text = toSpeakableText(markdown);
      if (!text) {
        options?.onEnd?.();
        return;
      }

      window.speechSynthesis.cancel();
      clearKeepAlive();
      window.speechSynthesis.resume();
      endCallbackRef.current = options?.onEnd ?? null;

      const lang = languageRef.current;
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = resolveVoice(lang, voiceUriRef.current);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        const family = speechLangFamily(lang);
        utterance.lang = family === "ur" ? "ur-PK" : family === "hi" ? "hi-IN" : "en-IN";
      }
      utterance.rate = familyRate(lang);
      utterance.onend = () => {
        clearKeepAlive();
        setSpeaking(false);
        const cb = endCallbackRef.current;
        endCallbackRef.current = null;
        cb?.();
      };
      utterance.onerror = () => {
        clearKeepAlive();
        setSpeaking(false);
        const cb = endCallbackRef.current;
        endCallbackRef.current = null;
        cb?.();
      };
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);

      keepAliveRef.current = window.setInterval(() => {
        if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
      }, 4000);
    },
    [clearKeepAlive],
  );

  const previewVoice = useCallback(
    (uri: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      unlockSpeechSynthesis();
      window.speechSynthesis.cancel();
      const voicesList = window.speechSynthesis.getVoices();
      const match = voicesList.find((v) => v.voiceURI === uri);
      const lang = languageRef.current;
      const utterance = new SpeechSynthesisUtterance(previewLine(lang));
      if (match) {
        utterance.voice = match;
        utterance.lang = match.lang;
      } else {
        const family = speechLangFamily(lang);
        utterance.lang = family === "ur" ? "ur-PK" : family === "hi" ? "hi-IN" : "en-IN";
      }
      utterance.rate = familyRate(lang);
      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      sessionStorage.setItem(SPEAK_PREF_KEY, next ? "1" : "0");
      if (next) unlockSpeechSynthesis();
      if (!next) {
        endCallbackRef.current = null;
        clearKeepAlive();
        window.speechSynthesis.cancel();
        setSpeaking(false);
      }
      return next;
    });
  }, [clearKeepAlive]);

  const setEnabledValue = useCallback(
    (next: boolean) => {
      setEnabled(next);
      sessionStorage.setItem(SPEAK_PREF_KEY, next ? "1" : "0");
      if (next) unlockSpeechSynthesis();
      if (!next) {
        endCallbackRef.current = null;
        clearKeepAlive();
        window.speechSynthesis?.cancel();
        setSpeaking(false);
      }
    },
    [clearKeepAlive],
  );

  useEffect(
    () => () => {
      clearKeepAlive();
      window.speechSynthesis?.cancel();
    },
    [clearKeepAlive],
  );

  const selectedVoice = voices.find((v) => v.uri === voiceUri) ?? voices[0] ?? null;

  return {
    supported,
    enabled,
    speaking,
    voices,
    voiceUri,
    selectedVoice,
    setVoiceUri,
    previewVoice,
    speak,
    stop,
    toggleEnabled,
    setEnabled: setEnabledValue,
    unlock: unlockSpeechSynthesis,
  };
}

function familyRate(language: AssistantLanguage): number {
  const family = speechLangFamily(language);
  /* Slightly slower for Hindi/Urdu so campus names stay clear. */
  return family === "en" ? 0.96 : 0.92;
}
