/** Server-only AI environment configuration */

function read(name: string): string | undefined {
  if (typeof process !== "undefined") {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

function isPlaceholder(value: string): boolean {
  return value.startsWith("your-") || value === "sk-..." || value === "sk-your-key-here";
}

export const aiEnv = {
  get openaiApiKey(): string | undefined {
    const key = read("OPENAI_API_KEY");
    if (!key || isPlaceholder(key)) return undefined;
    return key;
  },
  get model(): string {
    return read("AI_MODEL") ?? "gpt-4o-mini";
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

/** Dev/server startup hint — never logs the API key. */
export function logAssistantEnvStatus(): void {
  if (envStatusLogged) return;
  envStatusLogged = true;

  if (aiEnv.isConfigured) {
    console.info(`[GPWS Assistant] OpenAI configured (model: ${aiEnv.model})`);
    return;
  }

  console.warn(
    "[GPWS Assistant] OPENAI_API_KEY is missing or invalid. Add it to .env — chat responses will not work until configured.",
  );
}
