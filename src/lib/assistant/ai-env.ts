/** Server-only AI environment configuration (OpenAI or Groq-compatible). */

function read(name: string): string | undefined {
  if (typeof process !== "undefined") {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

function isPlaceholder(value: string): boolean {
  return (
    value.startsWith("your-") ||
    value === "sk-..." ||
    value === "sk-your-key-here" ||
    value === "gsk_your-key-here"
  );
}

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_DEFAULT_MODEL = "qwen/qwen3.8-27b";
/** Groq multimodal models that accept image_url content parts. */
const GROQ_VISION_CAPABLE = new Set(["qwen/qwen3.8-27b", "qwen/qwen3.6-27b"]);
const GROQ_VISION_MODEL = "qwen/qwen3.8-27b";
const OPENAI_DEFAULT_MODEL = "gpt-4o-mini";
const OPENAI_VISION_MODEL = "gpt-4o-mini";

function detectProvider(apiKey: string): "groq" | "openai" {
  if (apiKey.startsWith("gsk_")) return "groq";
  const explicit = read("AI_PROVIDER")?.toLowerCase();
  if (explicit === "groq") return "groq";
  if (explicit === "openai") return "openai";
  const base = read("AI_BASE_URL") ?? read("OPENAI_BASE_URL");
  if (base?.includes("groq.com")) return "groq";
  return "openai";
}

export const aiEnv = {
  get openaiApiKey(): string | undefined {
    const key = read("OPENAI_API_KEY") ?? read("GROQ_API_KEY");
    if (!key || isPlaceholder(key)) return undefined;
    return key;
  },
  get provider(): "groq" | "openai" {
    const key = aiEnv.openaiApiKey;
    if (!key) return "openai";
    return detectProvider(key);
  },
  get baseURL(): string | undefined {
    const explicit = read("AI_BASE_URL") ?? read("OPENAI_BASE_URL");
    if (explicit) return explicit.replace(/\/$/, "");
    return aiEnv.provider === "groq" ? GROQ_BASE_URL : undefined;
  },
  get model(): string {
    const configured = read("AI_MODEL");
    if (configured) {
      if (
        aiEnv.provider === "groq" &&
        (/^gpt-4o/i.test(configured) ||
          /^llama-3\.3-70b-versatile$/i.test(configured) ||
          /llama-4-scout/i.test(configured))
      ) {
        return GROQ_DEFAULT_MODEL;
      }
      return configured;
    }
    return aiEnv.provider === "groq" ? GROQ_DEFAULT_MODEL : OPENAI_DEFAULT_MODEL;
  },
  get visionModel(): string {
    const explicit = read("AI_VISION_MODEL");
    if (explicit) {
      if (aiEnv.provider === "groq" && /llama-4-scout/i.test(explicit)) {
        return GROQ_VISION_MODEL;
      }
      return explicit;
    }
    /* Reuse the chat model when it already understands images. */
    if (aiEnv.provider === "groq" && GROQ_VISION_CAPABLE.has(aiEnv.model)) {
      return aiEnv.model;
    }
    return aiEnv.provider === "groq" ? GROQ_VISION_MODEL : OPENAI_VISION_MODEL;
  },
  /** True when image understanding can be attempted. */
  get supportsVision(): boolean {
    if (!aiEnv.isConfigured) return false;
    if (aiEnv.provider === "openai") return true;
    if (read("AI_VISION_MODEL")) return true;
    return GROQ_VISION_CAPABLE.has(aiEnv.visionModel);
  },
  get supportsImageGeneration(): boolean {
    return aiEnv.provider === "openai";
  },
  get maxOutputTokens(): number {
    const raw = read("AI_MAX_OUTPUT_TOKENS");
    const n = raw ? Number.parseInt(raw, 10) : 700;
    return Number.isFinite(n) ? Math.min(Math.max(n, 200), 1200) : 700;
  },
  get maxHistoryMessages(): number {
    return 12;
  },
  get isConfigured(): boolean {
    return Boolean(aiEnv.openaiApiKey);
  },
};

let envStatusLogged = false;

/** Dev/server startup hint — never logs the API key. Browser bundle must stay silent. */
export function logAssistantEnvStatus(): void {
  if (typeof window !== "undefined") return;
  if (envStatusLogged) return;
  envStatusLogged = true;

  if (aiEnv.isConfigured) {
    const vision = aiEnv.supportsVision ? `, vision: ${aiEnv.visionModel}` : ", vision: off";
    console.info(
      `[GPWS Assistant] ${aiEnv.provider === "groq" ? "Groq" : "OpenAI"} configured (model: ${aiEnv.model}${vision})`,
    );
    return;
  }

  console.warn(
    "[GPWS Assistant] OPENAI_API_KEY / GROQ_API_KEY is missing or invalid. Add it to .env — chat responses will not work until configured.",
  );
}
