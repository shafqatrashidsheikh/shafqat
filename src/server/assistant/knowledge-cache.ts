/** Tiny cache module — kept separate to avoid circular imports with CMA auth. */

type KnowledgeCache = {
  at: number;
  json: string;
};

let knowledgeCache: KnowledgeCache | null = null;

export const ASSISTANT_KNOWLEDGE_TTL_MS = 60_000;

export function getAssistantKnowledgeCache(): KnowledgeCache | null {
  return knowledgeCache;
}

export function setAssistantKnowledgeCache(json: string): void {
  knowledgeCache = { at: Date.now(), json };
}

/** Clear cached website knowledge so the next assistant reply rebuilds from live CMS. */
export function invalidateAssistantKnowledgeCache(): void {
  knowledgeCache = null;
}
