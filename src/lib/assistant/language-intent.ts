/**
 * Language matching for the assistant.
 * Supported reply languages (fixed order for capability answers):
 * 1. English  2. Urdu  3. Hinglish  4. Roman Urdu  5. Roman Hindi  6. Kashmiri (local)
 */

import type { ChatMessage } from "@/lib/assistant/chat-schemas";

export type AssistantLanguage =
  | "english"
  | "urdu-script"
  | "hinglish"
  | "roman-urdu"
  | "roman-hindi"
  | "devanagari"
  | "kashmiri";

/** Public list — keep this order when the student asks which languages you speak. */
export const ASSISTANT_LANGUAGE_LIST = [
  "English",
  "Urdu",
  "Hinglish",
  "Roman Urdu",
  "Roman Hindi",
  "Kashmiri",
] as const;

/** Explicit user requests to switch language — most recent one wins. */
const EXPLICIT_REQUESTS: { re: RegExp; language: AssistantLanguage }[] = [
  { re: /\b(roman\s*urdu|urdu\s*(?:in\s*)?roman)\b/i, language: "roman-urdu" },
  { re: /\b(roman\s*hindi|hindi\s*(?:in\s*)?roman)\b/i, language: "roman-hindi" },
  { re: /\b(hinglish|hindlish|hinglidh|urdish)\b/i, language: "hinglish" },
  { re: /\b(kashmiri|koshur|کٲشُر|کشمیری)\b/i, language: "kashmiri" },
  { re: /\b(?:in|speak|talk|reply|answer|baat)\b[^.?!]{0,24}\burdu\b/i, language: "urdu-script" },
  { re: /\burdu\s*(?:mein?|me|mai)\s*(?:baat|bol|batao|likho|reply)/i, language: "urdu-script" },
  /* Spoken / written Hindi → Devanagari so TTS uses a proper Hindi accent. */
  { re: /\b(?:in|speak|talk|reply|answer|baat)\b[^.?!]{0,24}\bhindi\b/i, language: "devanagari" },
  { re: /\bhindi\s*(?:mein?|me|mai)\s*(?:baat|bol|batao|likho|reply|karo|karein|karien)/i, language: "devanagari" },
  { re: /\b(?:हिंदी|हिन्दी)\b/, language: "devanagari" },
  { re: /\b(?:in|speak|talk|reply|answer)\b[^.?!]{0,24}\benglish\b/i, language: "english" },
  { re: /\benglish\s*(?:mein?|me)\s*(?:baat|bol|batao|likho|reply)/i, language: "english" },
];

/** Voice / recognition family for matching accent to language. */
export type SpeechLangFamily = "en" | "hi" | "ur";

export function speechLangFamily(language: AssistantLanguage): SpeechLangFamily {
  if (language === "english") return "en";
  if (language === "urdu-script" || language === "roman-urdu") return "ur";
  return "hi";
}

const URDU_SCRIPT_RE = /[\u0600-\u06FF\u0750-\u077F]/;
const DEVANAGARI_RE = /[\u0900-\u097F]/;

/**
 * Words that only appear in Roman Urdu / Hindi typing — deliberately excludes
 * tokens that collide with English ("main", "par", "is", "to", "ho").
 */
const ROMAN_SOUTH_ASIAN_WORDS = [
  "kya",
  "kyaa",
  "kyun",
  "kyu",
  "kyon",
  "kaise",
  "kaisay",
  "kaisi",
  "kaisa",
  "kahan",
  "kahaan",
  "kab",
  "kitna",
  "kitni",
  "kitne",
  "kaun",
  "kon",
  "konsa",
  "hai",
  "hain",
  "hoga",
  "hogi",
  "hota",
  "hoti",
  "tha",
  "thi",
  "nahi",
  "nahin",
  "nahe",
  "mujhe",
  "mujhay",
  "mera",
  "meri",
  "mere",
  "aap",
  "aapka",
  "aapki",
  "aapko",
  "tumhe",
  "tumhara",
  "hum",
  "humein",
  "batao",
  "bataye",
  "bataiye",
  "bata",
  "chahiye",
  "chahiyay",
  "karo",
  "karna",
  "karne",
  "karta",
  "karti",
  "kardo",
  "krdo",
  "krna",
  "sakta",
  "sakti",
  "sakte",
  "milega",
  "milegi",
  "hoke",
  "kyunki",
  "lekin",
  "magar",
  "phir",
  "abhi",
  "acha",
  "accha",
  "theek",
  "thik",
  "bohot",
  "bahut",
  "zyada",
  "thoda",
  "jaldi",
  "dekho",
  "suno",
  "chalo",
  "bhai",
  "bhi",
  "sirf",
  "wala",
  "wali",
  "jayega",
  "jaega",
  "hogaya",
];

/** Urdu-leaning spellings; used only to pick Roman Urdu over Roman Hindi. */
const URDU_LEANING_WORDS = [
  "shukriya",
  "meherbani",
  "zaroori",
  "zarurat",
  "maloomat",
  "maloom",
  "taleem",
  "dakhla",
  "kitab",
  "waqt",
  "sawal",
  "jawab",
  "mazeed",
  "behtar",
  "mumkin",
  "iltija",
];

const HINDI_LEANING_WORDS = [
  "namaste",
  "dhanyavad",
  "kripya",
  "jankari",
  "jaankari",
  "praveshit",
  "pravesh",
  "shiksha",
  "samay",
  "prashn",
  "uttar",
  "avashyak",
  "sambhav",
];

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z]+/g) ?? [];
}

function countMatches(tokens: string[], words: string[]): number {
  const set = new Set(words);
  return tokens.filter((t) => set.has(t)).length;
}

/** Detects the language of a single message without history context. */
export function detectMessageLanguage(text: string): AssistantLanguage | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  for (const { re, language } of EXPLICIT_REQUESTS) {
    if (re.test(trimmed)) return language;
  }

  if (URDU_SCRIPT_RE.test(trimmed)) return "urdu-script";
  if (DEVANAGARI_RE.test(trimmed)) return "devanagari";

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return null;

  const urduHits = countMatches(tokens, URDU_LEANING_WORDS);
  const hindiHits = countMatches(tokens, HINDI_LEANING_WORDS);
  const romanHits = countMatches(tokens, ROMAN_SOUTH_ASIAN_WORDS) + urduHits + hindiHits;
  if (romanHits === 0) return null;

  if (urduHits > hindiHits) return "roman-urdu";
  if (hindiHits > urduHits) return "roman-hindi";

  /* Mixed English + South Asian words in one sentence reads as Hinglish. */
  return romanHits / tokens.length < 0.4 ? "hinglish" : "roman-urdu";
}

/**
 * Resolves the language for the next reply from the latest user message.
 * Explicit “talk in Hindi/English/…” on this turn wins; otherwise detect from
 * the text. Older sticky requests are not kept forever (that caused opposite-
 * language replies).
 */
export function resolveAssistantLanguage(messages: ChatMessage[]): AssistantLanguage {
  const userMessages = messages.filter((m) => m.role === "user");
  const latest = userMessages[userMessages.length - 1]?.content ?? "";

  for (const { re, language } of EXPLICIT_REQUESTS) {
    if (re.test(latest)) return language;
  }

  return detectMessageLanguage(latest) ?? "english";
}

const LANGUAGE_INSTRUCTIONS: Record<AssistantLanguage, string> = {
  english:
    "Reply in clear, simple English only. Do not mix Hindi or Urdu words unless they are official names.",
  "urdu-script":
    "Reply in Urdu using Urdu (Nastaliq) script only. Keep official names, phones and links in Latin script.",
  hinglish:
    "Reply in natural Hinglish — everyday Hindi/Urdu in Latin letters mixed with common English words, exactly the way the student is writing.",
  "roman-urdu":
    "Reply in Roman Urdu only (Urdu written in Latin letters, e.g. \"Admission ke liye aapko JKBOTE portal par apply karna hoga\"). Do not use Urdu Nastaliq script. Do not switch to English paragraphs.",
  "roman-hindi":
    "Reply in Roman Hindi only (Hindi written in Latin letters). Do not use Devanagari. Do not switch to full English.",
  devanagari:
    "Reply in proper Hindi using Devanagari script (हिन्दी) because the student asked for Hindi. Keep official names, phones and links in Latin script.",
  kashmiri:
    "Reply in Kashmiri (Koshur) using Latin letters that students type/speak locally (e.g. \"Tohi chhuva admissions-as mutalik sawal\"), with simple wording. Keep official names, phones and links in English/Latin. If a precise Kashmiri word is unclear, add a short Roman Urdu/English clarification in parentheses.",
};

/**
 * Dictation locale — must match how the student is speaking so the transcript
 * is not English when they are speaking Hindi/Urdu.
 */
export function speechRecognitionLang(language: AssistantLanguage): string {
  const family = speechLangFamily(language);
  if (family === "ur") return "ur-PK";
  if (family === "hi") return "hi-IN";
  return "en-IN";
}

/** Playback locale — accent must match the reply language family. */
export function speechSynthesisLang(language: AssistantLanguage): string {
  const family = speechLangFamily(language);
  if (family === "ur") return "ur-PK";
  if (family === "hi") return "hi-IN";
  return "en-IN";
}

/**
 * UI chrome (status, placeholders, titles) follows the student's language.
 * English questions → English chrome; otherwise keep natural Hinglish labels.
 */
export function assistantChromeCopy(language: AssistantLanguage) {
  if (language === "english") {
    return {
      speakingAnswer: "Speaking…",
      interruptHint: "Tap mic to interrupt",
      liveThinking: "Thinking…",
      liveSpeakNow: "Listening…",
      listeningWillSpeak: "Listening…",
      liveReady: "Ready",
      liveSubtitle: "Live voice · tap mic to interrupt",
      liveStartTitle: "Live voice chat",
      liveStopTitle: "Stop live voice chat",
      micSpeakTitle: "Mic — dictate into the box",
      micInterruptTitle: "Interrupt and speak",
      placeholderLive: "Live talk on — speak into the mic",
      placeholderImage: "Ask about the attached image…",
      placeholderDefault: "Ask anything",
      attachFailed: "Could not prepare that photo. Try a smaller JPG or PNG.",
    } as const;
  }

  return {
    speakingAnswer: "Bol rahe hain…",
    interruptHint: "Interrupt ke liye mic dabayein",
    liveThinking: "Soch rahe hain…",
    liveSpeakNow: "Sun rahe hain…",
    listeningWillSpeak: "Listening…",
    liveReady: "Ready",
    liveSubtitle: "Live voice · bol kar interrupt",
    liveStartTitle: "Live voice chat",
    liveStopTitle: "Live voice band karein",
    micSpeakTitle: "Mic — box mein bolein",
    micInterruptTitle: "Rok kar boliye",
    placeholderLive: "Live baat on — mic pe boliye",
    placeholderImage: "Image ke baare mein poochhiye…",
    placeholderDefault: "Ask anything",
    attachFailed: "Photo compress nahi hui. Chhoti JPG/PNG try karein.",
  } as const;
}

/**
 * Wraps a ready-made English answer so the model can deliver it in the
 * student's language without losing links or official wording.
 */
export function buildTranslatedAnswerHint(englishAnswer: string): string {
  return `Answer this turn using exactly the facts below, written in the reply language set under LANGUAGE. Keep every link, name and phone number unchanged. Do not add facts.

${englishAnswer}`;
}

/** Language block appended to the system prompt for every request. */
export function buildLanguageSystemHint(language: AssistantLanguage): string {
  const list = ASSISTANT_LANGUAGE_LIST.map((name, i) => `${i + 1}. ${name}`).join("\n");
  return `LANGUAGE (mandatory for this turn — language code: ${language}):
- ${LANGUAGE_INSTRUCTIONS[language]}
- Answer the student's actual question. Do not give the opposite meaning, refuse a correct fact, or invent a conflicting answer.
- Supported languages (use this exact order if the student asks which languages you understand):
${list}
- Kashmiri is the local / internal community language for Srinagar students — support it when they ask or write in Kashmiri.
- You also read voice-dictated text with spelling mistakes. Read past typos instead of asking the student to rewrite.
- Keep official names, programme titles, department names, email addresses, phone numbers and links exactly as published (English/Latin) even inside Urdu, Hinglish, Roman Urdu, Roman Hindi or Kashmiri replies.
- Keep the same language for follow-up replies until the student switches or asks for another language.
- Facts, links and official sources stay the same in every language — never soften, invert, or invent details while translating.
- For live voice conversation: prefer short spoken sentences (2–5 short lines). Put links and phone numbers clearly so they can be read aloud.
- Do not invent extra languages beyond the six listed above when answering “which languages”.`;
}
