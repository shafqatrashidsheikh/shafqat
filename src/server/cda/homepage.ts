import { createServerFn } from "@tanstack/react-start";
import { resolveEligibility } from "@/lib/departments-data";
import { isSupabaseConfigured } from "@/lib/env";
import { mapExploreCard, rowsToPageSectionsMap } from "@/lib/site-content";
import { formatDate, getStaticHomepageData } from "@/lib/supabase/fallback";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { HomepageData } from "@/lib/supabase/types";
import { buildMediaUrlMap } from "@/server/cda/content";

function hasHomepageContent(data: Omit<HomepageData, "source">): boolean {
  return (
    data.announcements.length > 0 ||
    data.events.length > 0 ||
    data.stats.length > 0 ||
    data.spotlights.length > 0 ||
    data.academicUnits.length > 0 ||
    data.faqs.length > 0 ||
    data.programs.length > 0 ||
    Object.keys(data.sections).length > 0 ||
    data.exploreCards.length > 0
  );
}

/** CDA — Client Data Access: read homepage content from Supabase */
export const fetchHomepageData = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomepageData> => {
    if (!isSupabaseConfigured()) return getStaticHomepageData();

    try {
      const supabase = getSupabaseServer();

      const [notices, events, stats, spotlights, units, faqs, programs, sections, exploreCards, mediaAssets] =
        await Promise.all([
        supabase.from("notices").select("*").eq("is_published", true).order("sort_order").order("published_at", { ascending: false }),
        supabase.from("events").select("*").eq("is_published", true).order("sort_order"),
        supabase.from("institute_stats").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("institute_spotlights").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("academic_units").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("home_faqs").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("programs").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("page_sections").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("explore_cards").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("media_assets").select("asset_key, public_url, is_active").eq("is_active", true),
      ]);

      const queryErrors = [
        notices.error,
        events.error,
        stats.error,
        spotlights.error,
        units.error,
        faqs.error,
        programs.error,
        sections.error,
        exploreCards.error,
        mediaAssets.error,
      ].filter(Boolean);

      if (queryErrors.length > 0) {
        console.error("[CDA] fetchHomepageData partial query failures:", queryErrors);
      }

      const data = {
        announcements: notices.error
          ? []
          : (notices.data ?? []).map((n) => ({
              id: n.id,
              tag: n.tag,
              date: formatDate(n.published_at),
              title: n.title,
            })),
        events: events.error
          ? []
          : (events.data ?? []).map((e) => ({
              id: e.id,
              title: e.title,
              date: e.event_date,
              place: e.venue,
            })),
        stats: stats.error
          ? []
          : (stats.data ?? []).map((s) => ({
              id: s.id,
              value: Number(s.value),
              label: s.label,
              prefix: s.prefix || undefined,
              suffix: s.suffix || undefined,
            })),
        spotlights: spotlights.error
          ? []
          : (spotlights.data ?? []).map((s) => ({
              id: s.id,
              title: s.title,
              subtitle: s.subtitle,
              to: s.link_path,
            })),
        academicUnits: units.error
          ? []
          : (units.data ?? []).map((u) => ({
              id: u.id,
              title: u.title,
              subtitle: u.subtitle,
              to: u.link_path,
            })),
        faqs: faqs.error
          ? []
          : (faqs.data ?? []).map((f) => ({
              id: f.id,
              q: f.question,
              a: f.answer,
            })),
        programs: programs.error
          ? []
          : (programs.data ?? []).map((p) => ({
              id: p.id,
              name: p.name,
              dept: p.dept_label,
              duration: p.duration,
              eligibility: resolveEligibility(p.name, p.eligibility),
              seats: p.seats,
              stream: p.stream,
              overview: p.overview,
            })),
        sections: sections.error ? getStaticHomepageData().sections : rowsToPageSectionsMap(sections.data ?? []),
        exploreCards: exploreCards.error
          ? getStaticHomepageData().exploreCards
          : (() => {
              const mediaUrlByKey = mediaAssets.error
                ? {}
                : buildMediaUrlMap(mediaAssets.data ?? []);
              return (exploreCards.data ?? []).map((row) => {
                const card = mapExploreCard(row, mediaUrlByKey);
                return {
                  id: card.id,
                  category: card.category,
                  title: card.title,
                  description: card.description,
                  cta: card.cta,
                  href: card.href,
                  image: card.image,
                  imageAlt: card.imageAlt,
                  imagePosition: card.imagePosition,
                  priority: card.priority,
                };
              });
            })(),
      };

      if (!hasHomepageContent(data)) {
        console.error("[CDA] fetchHomepageData returned no CMS rows, using static fallback");
        return getStaticHomepageData();
      }

      return { ...data, source: "supabase" };
    } catch (error) {
      console.error("[CDA] fetchHomepageData failed, using static fallback:", error);
      return getStaticHomepageData();
    }
  },
);
