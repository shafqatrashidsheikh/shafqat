import { canManageWebsiteContent } from "@/lib/auth/roles";
import { invalidateAssistantKnowledgeCache } from "@/server/assistant/knowledge-cache";
import type { VoContext } from "@/server/virtual-office/auth";
import { writeVoAudit } from "@/server/virtual-office/auth";

function assertWebsiteAccess(ctx: VoContext) {
  if (!canManageWebsiteContent(ctx.profile.role)) {
    throw new Error("Website Management Officer requires admin, principal, or editor role");
  }
}

export async function createWebsiteDraft(ctx: VoContext, input: {
  instruction: string;
  intent: string;
  pageHint?: string;
  sectionHint?: string;
  newText?: string;
  noticeTitle?: string;
}) {
  assertWebsiteAccess(ctx);

  const lower = input.instruction.toLowerCase();
  let target_table = "page_sections";
  let operation: "update" | "create" | "delete" | "publish" = "update";
  let target_id: string | null = null;
  let before_data: Record<string, unknown> | null = null;
  let after_data: Record<string, unknown> = {};
  let preview_summary = "";

  if (input.intent === "website_publish_notice" || (/notice|announcement/.test(lower) && /publish|homepage/.test(lower))) {
    target_table = "notices";
    operation = "create";
    const title = input.noticeTitle || input.newText || "Important notice";
    after_data = {
      title,
      category: "Notices",
      tag: "Notice",
      published_at: new Date().toISOString().slice(0, 10),
      priority: "Important",
      is_pinned: /homepage|home/.test(lower),
      is_published: true,
      sort_order: 0,
    };
    preview_summary = `Create and publish notice: “${title}”${after_data["is_pinned"] ? " (pinned for homepage)" : ""}`;
  } else if (input.intent === "website_remove_notice" || (/notice/.test(lower) && /remove|delete|hata/.test(lower))) {
    target_table = "notices";
    operation = "delete";
    const needle = (input.noticeTitle || input.newText || "").trim();
    let q = ctx.admin.from("notices").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(20);
    const { data: notices } = await q;
    const match = needle
      ? notices?.find((n) => n.title.toLowerCase().includes(needle.toLowerCase()))
      : notices?.[0];
    if (!match) {
      return {
        ok: false as const,
        needsClarification: true,
        message: needle
          ? `No published notice matched “${needle}”.`
          : "Specify which notice to remove (title fragment).",
      };
    }
    target_id = match.id;
    before_data = match;
    after_data = { deleted: true };
    preview_summary = `Delete notice: “${match.title}”`;
  } else {
    // Page section update — resolve by page/section hints
    const sectionKeysPreferred: string[] = [];
    if (input.pageHint === "admissions" || input.sectionHint === "admissions" || /admission/.test(lower)) {
      sectionKeysPreferred.push("admissions", "admissions-hero", "admissions-intro", "admissions-desk");
    }
    if (input.pageHint === "academics" || /academic/.test(lower)) {
      sectionKeysPreferred.push("academics", "academics-hero", "academics-intro");
    }
    if (input.pageHint === "home" || /homepage|home/.test(lower)) {
      sectionKeysPreferred.push("home-hero", "home-intro", "home");
    }

    const { data: sections } = await ctx.admin
      .from("page_sections")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    let section =
      sections?.find((s) => sectionKeysPreferred.includes(s.section_key)) ||
      sections?.find((s) =>
        sectionKeysPreferred.some(
          (k) => s.section_key.includes(k) || (s.title && s.title.toLowerCase().includes(k)),
        ),
      );

    if (!section && /heading|title/.test(lower)) {
      section = sections?.[0];
    }

    if (!section) {
      return {
        ok: false as const,
        needsClarification: true,
        message:
          "Could not identify the page section. Name the page (Admissions / Academics / Homepage) and the heading or body text to change.",
        availableSections: (sections ?? []).slice(0, 12).map((s) => ({
          key: s.section_key,
          title: s.title,
        })),
      };
    }

    target_table = "page_sections";
    target_id = section.id;
    before_data = section;
    const newText = (input.newText || "").trim();

    if (input.intent === "website_update_heading" || /heading|title/.test(lower)) {
      if (!newText) {
        return {
          ok: false as const,
          needsClarification: true,
          message: `Found section “${section.title}” (${section.section_key}). Provide the new heading text.`,
        };
      }
      after_data = { title: newText };
      preview_summary = `Change heading on ${section.section_key}: “${section.title}” → “${newText}”`;
    } else {
      if (!newText) {
        return {
          ok: false as const,
          needsClarification: true,
          message: `Found section “${section.title}” (${section.section_key}). Provide the new body text.`,
        };
      }
      after_data = { body: newText };
      preview_summary = `Update body on ${section.section_key} (“${section.title}”)`;
    }
    operation = "update";
  }

  const { data: draft, error } = await ctx.admin
    .from("vo_content_drafts")
    .insert({
      status: "pending_confirm",
      target_table,
      target_id,
      operation,
      before_data,
      after_data,
      instruction: input.instruction,
      preview_summary,
      created_by: ctx.userId,
    })
    .select()
    .single();
  if (error) throw error;

  await writeVoAudit(ctx.admin, {
    officer: "website_management",
    action: "draft_created",
    actorId: ctx.userId,
    entityType: "vo_content_draft",
    entityId: draft.id,
    summary: preview_summary,
    payload: { target_table, operation },
  });

  return { ok: true as const, draft };
}

export async function confirmWebsiteDraft(ctx: VoContext, draftId: string) {
  assertWebsiteAccess(ctx);

  const { data: draft, error } = await ctx.admin
    .from("vo_content_drafts")
    .select("*")
    .eq("id", draftId)
    .single();
  if (error || !draft) throw new Error("Draft not found");
  if (draft.status !== "pending_confirm") throw new Error("Draft is not awaiting confirmation");

  const now = new Date().toISOString();

  if (draft.target_table === "notices" && draft.operation === "create") {
    const { data: row, error: insErr } = await ctx.admin
      .from("notices")
      .insert(draft.after_data)
      .select()
      .single();
    if (insErr) throw insErr;
    await ctx.admin
      .from("vo_content_drafts")
      .update({
        status: "applied",
        target_id: row.id,
        confirmed_by: ctx.userId,
        confirmed_at: now,
        applied_at: now,
      })
      .eq("id", draftId);
  } else if (draft.target_table === "notices" && draft.operation === "delete" && draft.target_id) {
    const { error: delErr } = await ctx.admin.from("notices").delete().eq("id", draft.target_id);
    if (delErr) throw delErr;
    await ctx.admin
      .from("vo_content_drafts")
      .update({
        status: "applied",
        confirmed_by: ctx.userId,
        confirmed_at: now,
        applied_at: now,
      })
      .eq("id", draftId);
  } else if (draft.target_table === "page_sections" && draft.target_id) {
    const { error: updErr } = await ctx.admin
      .from("page_sections")
      .update(draft.after_data)
      .eq("id", draft.target_id);
    if (updErr) throw updErr;
    await ctx.admin
      .from("vo_content_drafts")
      .update({
        status: "applied",
        confirmed_by: ctx.userId,
        confirmed_at: now,
        applied_at: now,
      })
      .eq("id", draftId);
  } else {
    throw new Error("Unsupported draft target");
  }

  invalidateAssistantKnowledgeCache();

  await writeVoAudit(ctx.admin, {
    officer: "website_management",
    action: "draft_applied",
    actorId: ctx.userId,
    entityType: "vo_content_draft",
    entityId: draftId,
    summary: `Applied: ${draft.preview_summary}`,
    payload: { target_table: draft.target_table, operation: draft.operation },
  });

  const { data: updated } = await ctx.admin.from("vo_content_drafts").select("*").eq("id", draftId).single();
  return updated;
}

export async function revertWebsiteDraft(ctx: VoContext, draftId: string) {
  assertWebsiteAccess(ctx);

  const { data: draft, error } = await ctx.admin
    .from("vo_content_drafts")
    .select("*")
    .eq("id", draftId)
    .single();
  if (error || !draft) throw new Error("Draft not found");
  if (draft.status !== "applied") throw new Error("Only applied changes can be reverted");

  const now = new Date().toISOString();

  if (draft.target_table === "page_sections" && draft.target_id && draft.before_data) {
    const before = draft.before_data as Record<string, unknown>;
    const restore: Record<string, unknown> = {};
    for (const key of Object.keys(draft.after_data as object)) {
      if (key in before) restore[key] = before[key];
    }
    const { error: updErr } = await ctx.admin
      .from("page_sections")
      .update(restore)
      .eq("id", draft.target_id);
    if (updErr) throw updErr;
  } else if (draft.target_table === "notices" && draft.operation === "create" && draft.target_id) {
    await ctx.admin.from("notices").delete().eq("id", draft.target_id);
  } else if (draft.target_table === "notices" && draft.operation === "delete" && draft.before_data) {
    const before = { ...(draft.before_data as Record<string, unknown>) };
    delete before["id"];
    await ctx.admin.from("notices").insert(before);
  } else {
    throw new Error("This change cannot be automatically reverted");
  }

  await ctx.admin
    .from("vo_content_drafts")
    .update({ status: "reverted", reverted_at: now })
    .eq("id", draftId);

  invalidateAssistantKnowledgeCache();

  await writeVoAudit(ctx.admin, {
    officer: "website_management",
    action: "draft_reverted",
    actorId: ctx.userId,
    entityType: "vo_content_draft",
    entityId: draftId,
    summary: `Reverted: ${draft.preview_summary}`,
  });

  return { ok: true };
}

export async function listWebsiteDrafts(ctx: VoContext, limit = 20) {
  assertWebsiteAccess(ctx);
  const { data, error } = await ctx.admin
    .from("vo_content_drafts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function cancelWebsiteDraft(ctx: VoContext, draftId: string) {
  assertWebsiteAccess(ctx);
  const { data, error } = await ctx.admin
    .from("vo_content_drafts")
    .update({ status: "cancelled" })
    .eq("id", draftId)
    .eq("status", "pending_confirm")
    .select()
    .single();
  if (error) throw error;
  return data;
}
