import { aiEnv } from "@/lib/assistant/ai-env";
import type { ChatMessage } from "@/lib/assistant/chat-schemas";
import {
  buildWeatherDirectReply,
  detectWeatherIntent,
  fetchCampusWeather,
} from "@/lib/campus-weather";
import {
  capabilityNeedsLive,
  detectCapabilityIntent,
  needsLiveOfficialContext,
  resolveCapabilityReply,
} from "@/lib/assistant/capability-intent";
import {
  buildSyllabusDirectReply,
  detectSyllabusIntent,
} from "@/lib/assistant/syllabus-intent";
import {
  buildComputerEngineeringFacultyReply,
  buildFacultySystemHint,
  detectFacultyIntent,
  isComputerEngineeringFacultyAsk,
} from "@/lib/assistant/faculty-intent";
import {
  buildResultDirectReply,
  buildResultSystemHint,
  detectResultIntent,
} from "@/lib/assistant/result-intent";
import { resolveAssistantLanguage } from "@/lib/assistant/language-intent";
import { buildAssistantSystemPrompt } from "@/lib/assistant/system-prompt";
import { getAssistantKnowledgeJson } from "@/server/assistant/build-knowledge";
import { createAssistantClient } from "@/server/assistant/client";
import { loadAssistantLiveContext, loadAssistantNoticesQuick } from "@/server/assistant/live-context";

export class AssistantNotConfiguredError extends Error {
  constructor() {
    super("ASSISTANT_NOT_CONFIGURED");
    this.name = "AssistantNotConfiguredError";
  }
}

export class AssistantUpstreamError extends Error {
  constructor(cause?: unknown) {
    super("ASSISTANT_UPSTREAM_ERROR");
    this.name = "AssistantUpstreamError";
    this.cause = cause;
  }
}

export async function runAssistantChat(messages: ChatMessage[]): Promise<string> {
  if (!aiEnv.isConfigured || !aiEnv.openaiApiKey) {
    console.error("[GPWS Assistant] API key is not configured.");
    throw new AssistantNotConfiguredError();
  }

  const history = messages.slice(-aiEnv.maxHistoryMessages);
  const lastUserMessage =
    [...history].reverse().find((m) => m.role === "user")?.content ?? "";
  const language = resolveAssistantLanguage(history);
  const englishReply = language === "english";
  const syllabusIntent = detectSyllabusIntent(lastUserMessage);
  const cseFacultyAsk = isComputerEngineeringFacultyAsk(lastUserMessage);
  const resultIntent = detectResultIntent(lastUserMessage);

  if (syllabusIntent) {
    return buildSyllabusDirectReply(syllabusIntent);
  }
  if (cseFacultyAsk) {
    return buildComputerEngineeringFacultyReply();
  }

  if (detectWeatherIntent(lastUserMessage)) {
    const weather = await fetchCampusWeather().catch((error) => {
      console.warn("[GPWS Assistant] Campus weather unavailable:", error);
      return null;
    });
    if (weather) {
      return buildWeatherDirectReply(weather, englishReply ? "english" : "local");
    }
  }

  const capability = detectCapabilityIntent(lastUserMessage);
  if (capability) {
    if (capabilityNeedsLive(capability)) {
      const liveForCap =
        capability === "notices"
          ? await loadAssistantNoticesQuick().catch((error) => {
              console.warn("[GPWS Assistant] Live JKBOTE context unavailable:", error);
              return null;
            })
          : await loadAssistantLiveContext().catch((error) => {
              console.warn("[GPWS Assistant] Live JKBOTE context unavailable:", error);
              return null;
            });
      return resolveCapabilityReply(capability, language, liveForCap as any);
    }
    return resolveCapabilityReply(capability, language);
  }

  const liveEarly =
    resultIntent != null
      ? await loadAssistantLiveContext().catch((error) => {
          console.warn("[GPWS Assistant] Live JKBOTE context unavailable:", error);
          return null;
        })
      : null;

  if (resultIntent && liveEarly) {
    return buildResultDirectReply(resultIntent, liveEarly.allNoticesForMatching, {
      fetchedAt: liveEarly.fetchedAt,
      english: englishReply,
    });
  }

  const directAnswerHint = detectFacultyIntent(lastUserMessage)
    ? buildFacultySystemHint(lastUserMessage)
    : resultIntent && liveEarly
      ? buildResultSystemHint(
          resultIntent,
          liveEarly.allNoticesForMatching,
          liveEarly.fetchedAt,
        )
      : null;

  const client = createAssistantClient();
  const wantLive = Boolean(liveEarly) || needsLiveOfficialContext(lastUserMessage);

  const [knowledgeJson, live] = await Promise.all([
    getAssistantKnowledgeJson().catch((error) => {
      console.warn("[GPWS Assistant] Live website knowledge unavailable:", error);
      return null;
    }),
    liveEarly
      ? Promise.resolve(liveEarly)
      : wantLive
        ? loadAssistantLiveContext().catch((error) => {
            console.warn("[GPWS Assistant] Live JKBOTE context unavailable:", error);
            return null;
          })
        : Promise.resolve(null),
  ]);

  const { serializeKnowledgeForPrompt } = await import("@/data/gpwKnowledge");

  try {
    const completion = await client.chat.completions.create({
      model: aiEnv.model,
      stream: false,
      max_tokens: Math.min(aiEnv.maxOutputTokens, 520),
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content: buildAssistantSystemPrompt({
            knowledgeJson: knowledgeJson ?? serializeKnowledgeForPrompt(),
            live,
            extraHint: directAnswerHint,
            language,
          }),
        },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new AssistantUpstreamError(new Error("Empty model response"));
    }

    return content;
  } catch (error) {
    if (error instanceof AssistantNotConfiguredError) throw error;
    console.error("[GPWS Assistant] Upstream API error:", error);
    throw new AssistantUpstreamError(error);
  }
}
