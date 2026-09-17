import { aiEnv } from "@/lib/assistant/ai-env";
import {
  chatRequestSchema,
  type ChatImage,
  type ChatMessage,
} from "@/lib/assistant/chat-schemas";
import { consumeRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import {
  crossOriginBlockedResponse,
  getClientKey,
  isSameOriginRequest,
  rateLimitedResponse,
} from "@/lib/security/request-guards";
import { buildSyllabusDirectReply, detectSyllabusIntent } from "@/lib/assistant/syllabus-intent";
import {
  buildComputerEngineeringFacultyReply,
  buildFacultySystemHint,
  detectFacultyIntent,
  isComputerEngineeringFacultyAsk,
} from "@/lib/assistant/faculty-intent";
import {
  buildTranslatedAnswerHint,
  resolveAssistantLanguage,
} from "@/lib/assistant/language-intent";
import {
  buildResultDirectReply,
  buildResultSystemHint,
  detectResultIntent,
} from "@/lib/assistant/result-intent";
import {
  buildHostelDeniedReply,
  buildHostelRosterReply,
  buildHostelRulesReply,
  buildHostelSystemHint,
  detectHostelIntent,
} from "@/lib/assistant/hostel-intent";
import {
  buildCampusImageReply,
  detectImageCreateIntent,
  matchCampusAssistantImage,
} from "@/lib/assistant/image-intent";
import { buildAssistantSystemPrompt } from "@/lib/assistant/system-prompt";
import { serializeKnowledgeForPrompt } from "@/data/gpwKnowledge";
import { getAssistantKnowledgeJson } from "@/server/assistant/build-knowledge";
import { createAssistantClient } from "@/server/assistant/client";
import { loadHostelAssistantAccess } from "@/server/assistant/hostel-context";
import { loadAssistantLiveContext } from "@/server/assistant/live-context";
import type OpenAI from "openai";

const FALLBACK_MESSAGE =
  "Sorry, I'm having trouble responding right now. Please try again or use the Contact section for official assistance.";

type ChatCompletionContent =
  | string
  | Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    >;

function toHistoryMessages(
  messages: ChatMessage[],
  image?: ChatImage,
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return messages.map((m, index) => {
    const isLastUser = m.role === "user" && index === messages.length - 1 && image;
    if (!isLastUser) {
      return { role: m.role, content: m.content };
    }

    const content: ChatCompletionContent = [
      {
        type: "text",
        text:
          m.content.trim() ||
          "Please look at this image and explain what you see in the context of Government Polytechnic for Women, Srinagar.",
      },
      {
        type: "image_url",
        image_url: { url: `data:${image.mimeType};base64,${image.dataBase64}` },
      },
    ];
    return { role: "user", content };
  });
}

async function tryOpenAiImageGenerate(
  client: OpenAI,
  prompt: string,
): Promise<{ url: string; alt: string } | null> {
  if (!aiEnv.supportsImageGeneration) return null;
  try {
    const result = await client.images.generate({
      model: "dall-e-3",
      prompt: `Educational institutional illustration for Government Polytechnic for Women, Srinagar. ${prompt}. Clean, respectful, no logos invented.`,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    const url = result.data?.[0]?.url;
    if (!url) return null;
    return { url, alt: "Generated illustration for GPW Srinagar assistant" };
  } catch (error) {
    console.warn("[GPWS Assistant] Image generation unavailable:", error);
    return null;
  }
}

export async function handleChatPost(request: Request): Promise<Response> {
  if (!isSameOriginRequest(request)) {
    return crossOriginBlockedResponse();
  }

  const rate = consumeRateLimit(getClientKey(request), RATE_LIMITS.chat);
  if (!rate.allowed) {
    return rateLimitedResponse(rate.retryAfterMs);
  }

  if (!aiEnv.isConfigured) {
    console.error("[GPWS Assistant] API key is not configured.");
    return Response.json({ error: "not_configured", message: FALLBACK_MESSAGE }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_json", message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path?.join(".") ?? "";
    console.warn("[GPWS Assistant] Chat validation failed:", parsed.error.flatten());
    if (path.includes("image") || path.includes("dataBase64")) {
      return Response.json(
        {
          error: "validation",
          message:
            "Photo attach fail — chhoti / clear JPG ya PNG try karein (compress karke bheji jati hai).",
        },
        { status: 400 },
      );
    }
    return Response.json(
      {
        error: "validation",
        message: "Could not send that message. Clear the chat and try again.",
      },
      { status: 400 },
    );
  }

  const messages = parsed.data.messages.slice(-aiEnv.maxHistoryMessages);
  const accessToken = parsed.data.accessToken;
  const image = parsed.data.image;
  /* Vision turns: keep history tiny so image + prompt fit Groq free ITPM (~7k). */
  const historyForModel = image ? messages.slice(-4) : messages;
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const language = resolveAssistantLanguage(messages);
  const englishReply = language === "english";
  const syllabusIntent = detectSyllabusIntent(lastUserMessage);
  const cseFacultyAsk = isComputerEngineeringFacultyAsk(lastUserMessage);
  const resultIntent = detectResultIntent(lastUserMessage);
  const hostelIntent = detectHostelIntent(lastUserMessage);
  const wantsImage = detectImageCreateIntent(lastUserMessage);

  if (image && !aiEnv.supportsVision) {
    return Response.json({
      content: englishReply
        ? "I can see you attached an image, but image understanding is not enabled on this server’s AI key. Ask for an official campus photo (for example “library photo dikhao”), or set AI_VISION_MODEL / an OpenAI key for vision."
        : "Image attach ho gayi hai, lekin is AI key pe vision (photo samajhna) available nahi hai. Official campus photo ke liye “library photo dikhao” likhein, ya OpenAI / AI_VISION_MODEL set karein.",
    });
  }

  /* Official campus photos for “show / create image of campus …” requests. */
  if (!image && wantsImage) {
    const campusPhoto = matchCampusAssistantImage(lastUserMessage);
    if (campusPhoto) {
      const content = englishReply
        ? `Here is an official campus photograph: ${campusPhoto.alt}. More photos are on the [Campus](/campus) page.`
        : buildCampusImageReply(campusPhoto);
      return Response.json({
        content,
        imageUrl: campusPhoto.url,
        imageAlt: campusPhoto.alt,
      });
    }

    if (aiEnv.supportsImageGeneration) {
      const client = createAssistantClient();
      const generated = await tryOpenAiImageGenerate(client, lastUserMessage);
      if (generated) {
        return Response.json({
          content: englishReply
            ? "I created an illustration for your request. For real campus photos, open [Campus](/campus)."
            : "Maine aapke sawal ke liye ek illustration banaya hai. Asli campus photos [Campus](/campus) par hain.",
          imageUrl: generated.url,
          imageAlt: generated.alt,
        });
      }
    }

    return Response.json({
      content: englishReply
        ? "I can show official GPW Srinagar campus photos (library, labs, admissions desk, campus building). Tell me which place — or attach an image and ask about it. Fancy AI art generation needs an OpenAI key."
        : "Main official GPW Srinagar campus photos dikha sakta hoon (library, labs, admissions, campus). Bataiye kaunsi jagah — ya image attach karke poochhiye. Alag AI art ke liye OpenAI key chahiye.",
    });
  }

  /* Result / datesheet — verified JKBOTE notices with clickable markdown chips. */
  let liveForResult: Awaited<ReturnType<typeof loadAssistantLiveContext>> | null = null;
  if (!image && resultIntent) {
    liveForResult = await loadAssistantLiveContext().catch((error) => {
      console.warn("[GPWS Assistant] Live JKBOTE context unavailable:", error);
      return null;
    });
    if (liveForResult) {
      return Response.json({
        content: buildResultDirectReply(resultIntent, liveForResult.allNoticesForMatching, {
          fetchedAt: liveForResult.fetchedAt,
          english: englishReply,
        }),
      });
    }
  }

  if (!image && englishReply && syllabusIntent) {
    return Response.json({ content: buildSyllabusDirectReply(syllabusIntent) });
  }
  if (!image && englishReply && cseFacultyAsk) {
    return Response.json({ content: buildComputerEngineeringFacultyReply() });
  }

  let hostelHint: string | null = null;
  if (!image && hostelIntent) {
    const hostelAccess = await loadHostelAssistantAccess(accessToken);
    if (hostelIntent === "rules" && hostelAccess.access !== "allowed") {
      const rules = buildHostelRulesReply();
      if (englishReply) return Response.json({ content: rules });
      hostelHint = buildTranslatedAnswerHint(rules);
    } else if (hostelAccess.access === "allowed" && hostelIntent === "roster") {
      const roster = buildHostelRosterReply(hostelAccess.rooms);
      if (englishReply) return Response.json({ content: roster });
      hostelHint = buildTranslatedAnswerHint(roster);
    } else if (hostelAccess.access === "allowed") {
      hostelHint = buildHostelSystemHint(hostelAccess.rooms, "allowed");
      if (hostelIntent === "rules" && englishReply) {
        return Response.json({ content: buildHostelRulesReply() });
      }
    } else if (hostelIntent === "roster" || hostelIntent === "general") {
      const denied =
        hostelAccess.access === "rejected"
          ? buildHostelDeniedReply("rejected")
          : hostelAccess.access === "pending"
            ? buildHostelDeniedReply("pending")
            : buildHostelDeniedReply("anonymous");
      if (englishReply) return Response.json({ content: denied });
      hostelHint = buildTranslatedAnswerHint(denied);
    } else {
      hostelHint = buildHostelSystemHint(null, hostelAccess.access);
    }
  }

  const directAnswerHint = image
    ? "The student attached an image. Describe only what is visible, relate it to GPW Srinagar when relevant, and do not invent unpublished institute facts from the photo."
    : resultIntent && liveForResult
      ? buildResultSystemHint(
          resultIntent,
          liveForResult.allNoticesForMatching,
          liveForResult.fetchedAt,
        )
      : syllabusIntent
        ? buildTranslatedAnswerHint(buildSyllabusDirectReply(syllabusIntent))
        : cseFacultyAsk
          ? buildTranslatedAnswerHint(buildComputerEngineeringFacultyReply())
          : hostelHint
            ? hostelHint
            : detectFacultyIntent(lastUserMessage)
              ? buildFacultySystemHint(lastUserMessage)
              : null;

  const client = createAssistantClient();

  let knowledgeJson: string | null = null;
  let live: Awaited<ReturnType<typeof loadAssistantLiveContext>> | null = null;

  if (!image) {
    [knowledgeJson, live] = await Promise.all([
      getAssistantKnowledgeJson().catch((error) => {
        console.warn("[GPWS Assistant] Live website knowledge unavailable:", error);
        return null;
      }),
      liveForResult
        ? Promise.resolve(liveForResult)
        : loadAssistantLiveContext().catch((error) => {
            console.warn("[GPWS Assistant] Live JKBOTE context unavailable:", error);
            return null;
          }),
    ]);
  }

  try {
    const completion = await client.chat.completions.create({
      model: image ? aiEnv.visionModel : aiEnv.model,
      stream: false,
      max_tokens: image ? Math.min(aiEnv.maxOutputTokens, 500) : aiEnv.maxOutputTokens,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: buildAssistantSystemPrompt({
            knowledgeJson: knowledgeJson ?? serializeKnowledgeForPrompt(),
            live,
            extraHint: directAnswerHint,
            language,
            visionMode: Boolean(image),
          }),
        },
        ...toHistoryMessages(historyForModel, image),
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!content) {
      console.error("[GPWS Assistant] Model returned an empty response.");
      return Response.json({ error: "empty_response", message: FALLBACK_MESSAGE }, { status: 502 });
    }

    return Response.json({ content });
  } catch (error) {
    console.error("[GPWS Assistant] Upstream API error:", error);
    const detail = error instanceof Error ? error.message : String(error);
    if (/413|too large|ITPM|reduce your message/i.test(detail)) {
      return Response.json(
        {
          error: "request_too_large",
          message: englishReply
            ? "That photo is a bit large for the free AI limit. Try a smaller or clearer close-up photo, then ask again."
            : "Photo free AI limit se bari hai. Chhoti / clear photo attach karke dobara poochhein.",
        },
        { status: 413 },
      );
    }
    return Response.json({ error: "openai_error", message: FALLBACK_MESSAGE }, { status: 502 });
  }
}
