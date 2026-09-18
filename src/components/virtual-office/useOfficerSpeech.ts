/**
 * Lightweight officer speech (TTS) for Virtual College Office.
 * Unlock must run inside a user gesture (mic / instruct click) so Chrome allows later speak.
 */

import { useCallback, useEffect, useRef, useState } from "react";

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const prefer = [/en-IN/i, /hi-IN/i, /en-GB/i, /en-US/i, /hi/i];
  for (const re of prefer) {
    const hit = voices.find((v) => re.test(v.lang) || re.test(v.name));
    if (hit) return hit;
  }
  return voices[0] ?? null;
}

export function useOfficerSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const unlockedRef = useRef(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const warm = () => void window.speechSynthesis.getVoices();
    warm();
    window.speechSynthesis.addEventListener("voiceschanged", warm);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", warm);
      window.speechSynthesis.cancel();
    };
  }, []);

  /** Call from click handlers before async work so later TTS is allowed. */
  const unlock = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    unlockedRef.current = true;
    try {
      window.speechSynthesis.cancel();
      const warm = new SpeechSynthesisUtterance(" ");
      warm.volume = 0;
      warm.rate = 2;
      window.speechSynthesis.speak(warm);
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    utterRef.current = null;
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, opts?: { onEnd?: () => void }) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        opts?.onEnd?.();
        return;
      }
      const clean = text.replace(/\s+/g, " ").trim();
      if (!clean) {
        opts?.onEnd?.();
        return;
      }

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(clean);
      const voice = pickVoice();
      if (voice) utter.voice = voice;
      utter.lang = voice?.lang || "en-IN";
      utter.rate = 1.02;
      utter.pitch = 1;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => {
        setSpeaking(false);
        utterRef.current = null;
        opts?.onEnd?.();
      };
      utter.onerror = () => {
        setSpeaking(false);
        utterRef.current = null;
        opts?.onEnd?.();
      };
      utterRef.current = utter;
      if (!unlockedRef.current) unlock();
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utter);
    },
    [unlock],
  );

  return { speak, stop, unlock, speaking, supported };
}
