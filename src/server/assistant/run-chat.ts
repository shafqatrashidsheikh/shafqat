import { aiEnv } from "@/lib/assistant/ai-env";
import type { ChatMessage } from "@/lib/assistant/chat-schemas";
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
import {
  buildTranslatedAnswerHint,
  resolveAssistantLanguage,
} from "@/lib/assistant/language-intent";
import { buildAssistantSystemPrompt } from "@/lib/assistant/system-prompt";
import { getAssistantKnowledgeJson } from "@/server/assistant/build-knowledge";
import { createAssistantClient } from "@/server/assistant/client";
import { loadAssistantLiveContext } from "@/server/assistant/live-context";

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

  if (englishReply && syllabusIntent) {
    return buildSyllabusDirectReply(syllabusIntent);
  }
  if (englishReply && cseFacultyAsk) {
    return buildComputerEngineeringFacultyReply();
  }

  /* Non-English turns route the same verified answer through the model so it
     can be delivered in the student's language. */
  const directAnswerHint = syllabusIntent
    ? buildTranslatedAnswerHint(buildSyllabusDirectReply(syllabusIntent))
    : cseFacultyAsk
      ? buildTranslatedAnswerHint(buildComputerEngineeringFacultyReply())
      : resultIntent && liveEarly
        ? buildResultSystemHint(
            resultIntent,
            liveEarly.allNoticesForMatching,
            liveEarly.fetchedAt,
          )
        : detectFacultyIntent(lastUserMessage)
          ? buildFacultySystemHint(lastUserMessage)
          : null;

  const client = createAssistantClient();

  const [knowledgeJson, live] = await Promise.all([
    getAssistantKnowledgeJson().catch((error) => {
      console.warn("[GPWS Assistant] Live website knowledge unavailable:", error);
      return null;
    }),
    liveEarly
      ? Promise.resolve(liveEarly)
      : loadAssistantLiveContext().catch((error) => {
          console.warn("[GPWS Assistant] Live JKBOTE context unavailable:", error);
          return null;
        }),
  ]);

  const { serializeKnowledgeForPrompt } = await import("@/data/gpwKnowledge");

  try {
    const completion = await client.chat.completions.create({
      model: aiEnv.model,
      stream: false,
      max_tokens: aiEnv.maxOutputTokens,
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
