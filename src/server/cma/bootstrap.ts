import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GPW_DEPARTMENTS } from "@/lib/departments-data";
import { CAMPUS_FACILITIES, CAMPUS_GALLERY } from "@/lib/campus-data";
import { EXPLORE_CARDS } from "@/lib/explore-data";
import { NOTICES } from "@/lib/notices-data";
import {
  ACADEMIC_UNITS,
  CAMPUS_EVENTS,
  FOOTER_ACADEMIC_LINKS,
  FOOTER_MANDATORY_LINKS,
  FOOTER_QUICK_LINKS,
  HEADER_CTA_PILLS,
  HOME_FAQS,
  INSTITUTE,
  INSTITUTE_SPOTLIGHTS,
  PROGRAMS,
  STATS,
  UTILITY_STRIP,
} from "@/lib/site-data";
import { getStaticPageSections } from "@/lib/site-content";
import {
  ADMISSIONS_APPLY_LABEL,
  ADMISSIONS_ASSISTANT_BODY,
  ADMISSIONS_ASSISTANT_LABEL,
  ADMISSIONS_ASSISTANT_TITLE,
  ADMISSIONS_DATES,
  ADMISSIONS_DOCUMENTS,
  ADMISSIONS_DOCUMENTS_NOTE,
  ADMISSIONS_ELIGIBILITY_GROUPS,
  ADMISSIONS_ELIGIBILITY_INTRO,
  ADMISSIONS_ELIGIBILITY_NOTE,
  ADMISSIONS_FAQS,
  ADMISSIONS_FEE_AMOUNT,
  ADMISSIONS_FEE_NOTE,
  ADMISSIONS_INTRO,
  ADMISSIONS_NOTICE_HREF,
  ADMISSIONS_NOTICE_LABEL,
  ADMISSIONS_PROGRAMMES,
  ADMISSIONS_PROGRAMMES_NOTE,
  ADMISSIONS_STEPS,
  ADMISSIONS_STRIP,
  ADMISSIONS_TITLE,
  ADMISSIONS_YEAR,
  JKBOTE_APPLY_URL,
  admissionProgrammeInsert,
  serializeEligibilityGroup,
} from "@/lib/admissions-data";
import { PRINCIPAL } from "@/lib/principal-data";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireAdminWrite } from "@/server/cma/auth";


const ANNOUNCEMENT_TAGS: Record<string, string> = {
  Admissions: "Admission",
  Examination: "Examination",
  Tenders: "Tender",
  Circulars: "Circular",
  Notices: "Notice",
  Academics: "Academic",
};

const EXPLORE_IMAGE_KEYS: Record<string, string> = {
  about: "campus-winter-gate",
  academics: "computer-lab",
  facilities: "microscope-lab",
  admissions: "admissions-desk",
  placement: "placement-career-guidance",
};

const GALLERY_ASSET_KEYS = [
  "electronics-lab-students",
  "computer-lab-students",
  "campus-building-lawn",
  "campus-building-walkway",
] as const;



async function countRows(supabase: ReturnType<typeof getSupabaseAdmin>, table: string) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

async function seedAdmissionChildren(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  cycleId: string,
) {
  let stepOrder = 1;
  for (const step of ADMISSIONS_STEPS) {
    const { error } = await supabase.from("admission_steps").insert({
      cycle_id: cycleId,
      step_number: stepOrder,
      title: step.t,
      description: step.d,
      sort_order: stepOrder++,
    });
    if (error) throw error;
  }

  let docOrder = 1;
  for (const doc of ADMISSIONS_DOCUMENTS) {
    const { error } = await supabase.from("admission_documents").insert({
      cycle_id: cycleId,
      label: doc.label,
      detail: doc.detail,
      sort_order: docOrder++,
    });
    if (error) throw error;
  }

  let dateOrder = 1;
  for (const date of ADMISSIONS_DATES) {
    const { error } = await supabase.from("admission_dates").insert({
      cycle_id: cycleId,
      label: date.label,
      date_value: date.date_value,
      sort_order: dateOrder++,
    });
    if (error) throw error;
  }

  let faqOrder = 1;
  for (const faq of ADMISSIONS_FAQS) {
    const { error } = await supabase.from("admission_faqs").insert({
      cycle_id: cycleId,
      question: faq.q,
      answer: faq.a,
      sort_order: faqOrder++,
    });
    if (error) throw error;
  }

  try {
    let programmeOrder = 1;
    for (const programme of ADMISSIONS_PROGRAMMES) {
      const { error } = await supabase
        .from("admission_programmes")
        .insert(admissionProgrammeInsert(cycleId, programme, programmeOrder++));
      if (error) throw error;
    }

    let groupOrder = 1;
    for (const group of ADMISSIONS_ELIGIBILITY_GROUPS) {
      const { error } = await supabase.from("admission_eligibility_groups").insert({
        cycle_id: cycleId,
        heading: group.heading,
        body: serializeEligibilityGroup(group),
        sort_order: groupOrder++,
      });
      if (error) throw error;
    }
  } catch (error) {
    console.warn("[bootstrap] admission programmes/eligibility tables are not available yet:", error);
  }
}

/** Idempotent CMS bootstrap from actual GPW website static content */
export const cmaBootstrapCms = createServerFn({ method: "POST" })
  .validator(z.object({ accessToken: z.string() }))
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured. Add credentials to .env first.");
    }

    await requireAdminWrite(data.accessToken);
    const supabase = getSupabaseAdmin();
    const seeded: string[] = [];

    if ((await countRows(supabase, "departments")) === 0) {
      for (const dept of GPW_DEPARTMENTS) {
        const imageAssetKey =
          dept.slug === "electronics-communication-engineering" ? "electrical-lab" : null;
        const { error } = await supabase.from("departments").insert({
          slug: dept.slug,
          name: dept.name,
          summary: dept.summary,
          overview: dept.overview,
          category_label: dept.categoryLabel,
          duration: dept.duration,
          eligibility: dept.eligibility,
          program_type: dept.programType,
          stream: dept.stream,
          icon: dept.icon,
          has_departmental_labs: dept.hasDepartmentalLabs,
          career_areas: [...dept.careerAreas],
          image_asset_key: imageAssetKey,
          image_alt: dept.image?.alt ?? "",
          sort_order: dept.sortOrder,
          is_active: true,
        });
        if (error) throw error;
      }
      seeded.push("departments");

      const { data: deptRows } = await supabase.from("departments").select("id, slug");
      const deptBySlug = Object.fromEntries((deptRows ?? []).map((d) => [d.slug, d.id]));

      for (const prog of PROGRAMS) {
        const { error } = await supabase.from("programs").insert({
          department_id: deptBySlug[prog.slug] ?? null,
          name: prog.name,
          dept_label: prog.categoryLabel,
          duration: prog.duration,
          eligibility: prog.eligibility,
          seats: ("seats" in prog ? String((prog as { seats?: unknown }).seats ?? "") : ""),
          stream: prog.stream,
          overview: prog.overview,
          sort_order: GPW_DEPARTMENTS.find((d) => d.slug === prog.slug)?.sortOrder ?? 0,
          is_active: true,
        });
        if (error) throw error;
      }
      seeded.push("programs");
    }

    if ((await countRows(supabase, "notices")) === 0) {
      let order = 1;
      for (const notice of NOTICES) {
        const { error } = await supabase.from("notices").insert({
          title: notice.title,
          category: notice.cat,
          tag: ANNOUNCEMENT_TAGS[notice.cat] ?? notice.cat,
          published_at: notice.publishedAt,
          priority: notice.priority,
          file_label: notice.file,
          file_url: notice.fileUrl,
          is_pinned: order <= 3,
          is_published: true,
          sort_order: order++,
        });
        if (error) throw error;
      }
      seeded.push("notices");
    }

    if ((await countRows(supabase, "events")) === 0) {
      let order = 1;
      for (const event of CAMPUS_EVENTS) {
        const { error } = await supabase.from("events").insert({
          title: event.title,
          event_date: event.date,
          venue: event.place,
          description: event.summary,
          is_published: true,
          sort_order: order++,
        });
        if (error) throw error;
      }
      seeded.push("events");
    }

    if ((await countRows(supabase, "institute_stats")) === 0) {
      let order = 1;
      for (const stat of STATS) {
        const { error } = await supabase.from("institute_stats").insert({
          value: stat.value,
          label: stat.label,
          prefix: stat.prefix ?? "",
          suffix: stat.suffix ?? "",
          sort_order: order++,
          is_active: true,
        });
        if (error) throw error;
      }
      seeded.push("institute_stats");
    }

    if ((await countRows(supabase, "institute_spotlights")) === 0) {
      let order = 1;
      for (const spot of INSTITUTE_SPOTLIGHTS) {
        const { error } = await supabase.from("institute_spotlights").insert({
          title: spot.title,
          subtitle: spot.subtitle,
          link_path: spot.to,
          sort_order: order++,
          is_active: true,
        });
        if (error) throw error;
      }
      seeded.push("institute_spotlights");
    }

    if ((await countRows(supabase, "academic_units")) === 0) {
      let order = 1;
      for (const unit of ACADEMIC_UNITS) {
        const { error } = await supabase.from("academic_units").insert({
          title: unit.title,
          subtitle: unit.subtitle,
          link_path: unit.to,
          sort_order: order++,
          is_active: true,
        });
        if (error) throw error;
      }
      seeded.push("academic_units");
    }

    if ((await countRows(supabase, "home_faqs")) === 0) {
      let order = 1;
      for (const faq of HOME_FAQS) {
        const { error } = await supabase.from("home_faqs").insert({
          question: faq.q,
          answer: faq.a,
          sort_order: order++,
          is_active: true,
        });
        if (error) throw error;
      }
      seeded.push("home_faqs");
    }

    if ((await countRows(supabase, "page_sections")) === 0) {
      const sections = getStaticPageSections();
      for (const section of Object.values(sections)) {
        const { error } = await supabase.from("page_sections").insert(section);
        if (error) throw error;
      }
      seeded.push("page_sections");
    }

    if ((await countRows(supabase, "explore_cards")) === 0) {
      let order = 1;
      for (const card of EXPLORE_CARDS) {
        const { error } = await supabase.from("explore_cards").insert({
          slug: card.id,
          category: card.category,
          title: card.title,
          description: card.description,
          cta: card.cta,
          href: card.href,
          image_key: EXPLORE_IMAGE_KEYS[card.id] ?? "campus-main",
          image_alt: card.imageAlt,
          image_position: card.imagePosition,
          sort_order: order++,
          is_active: true,
          is_priority: Boolean(card.priority),
        });
        if (error) throw error;
      }
      seeded.push("explore_cards");
    }

    if ((await countRows(supabase, "admission_cycles")) === 0) {
      const { data: cycle, error: cycleError } = await supabase
        .from("admission_cycles")
        .insert({
          year: ADMISSIONS_YEAR,
          title: ADMISSIONS_TITLE,
          intro: ADMISSIONS_INTRO,
          strip_text: ADMISSIONS_STRIP,
          apply_url: JKBOTE_APPLY_URL,
          apply_label: ADMISSIONS_APPLY_LABEL,
          fee_amount: ADMISSIONS_FEE_AMOUNT,
          fee_note: ADMISSIONS_FEE_NOTE,
          notice_url: ADMISSIONS_NOTICE_HREF,
          notice_label: ADMISSIONS_NOTICE_LABEL,
          eligibility_intro: ADMISSIONS_ELIGIBILITY_INTRO,
          eligibility_note: ADMISSIONS_ELIGIBILITY_NOTE,
          documents_note: ADMISSIONS_DOCUMENTS_NOTE,
          programmes_note: ADMISSIONS_PROGRAMMES_NOTE,
          assistant_title: ADMISSIONS_ASSISTANT_TITLE,
          assistant_body: ADMISSIONS_ASSISTANT_BODY,
          assistant_label: ADMISSIONS_ASSISTANT_LABEL,
          is_active: true,
        })
        .select()
        .single();
      if (cycleError) throw cycleError;

      await seedAdmissionChildren(supabase, cycle.id);
      seeded.push("admissions");
    } else {
      const { data: existingCycle } = await supabase
        .from("admission_cycles")
        .select("id")
        .eq("is_active", true)
        .order("year", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingCycle) {
        try {
          if ((await countRows(supabase, "admission_programmes")) === 0) {
            let programmeOrder = 1;
            for (const programme of ADMISSIONS_PROGRAMMES) {
              const { error } = await supabase
                .from("admission_programmes")
                .insert(admissionProgrammeInsert(existingCycle.id, programme, programmeOrder++));
              if (error) throw error;
            }
            seeded.push("admission_programmes");
          }
          if ((await countRows(supabase, "admission_eligibility_groups")) === 0) {
            let groupOrder = 1;
            for (const group of ADMISSIONS_ELIGIBILITY_GROUPS) {
              const { error } = await supabase.from("admission_eligibility_groups").insert({
                cycle_id: existingCycle.id,
                heading: group.heading,
                body: serializeEligibilityGroup(group),
                sort_order: groupOrder++,
              });
              if (error) throw error;
            }
            seeded.push("admission_eligibility_groups");
          }
        } catch (error) {
          console.warn("[bootstrap] could not seed extended admissions tables:", error);
        }
      }
    }

    try {
      await supabase.from("site_settings").upsert({
        setting_key: "institute",
        value: INSTITUTE,
      });

      await supabase.from("principal_profile").upsert({
        id: "default",
        name: PRINCIPAL.name,
        role: PRINCIPAL.role,
        institute: PRINCIPAL.institute,
        portrait_asset_key: "principal-imtiyaz-shaw",
        portrait_alt: PRINCIPAL.portraitAlt,
        preview: PRINCIPAL.preview,
        message_paragraphs: [...PRINCIPAL.message],
        is_published: true,
      });

      if ((await countRows(supabase, "about_blocks")) === 0) {
        await supabase.from("about_blocks").insert([
          {
            block_key: "about_intro",
            title: "About intro",
            body: `Established in ${INSTITUTE.established}, the institute delivers three-year diploma education in engineering and technology exclusively for women in the Kashmir valley.`,
            image_asset_key: "campus-skill-signage",
            sort_order: 0,
          },
          {
            block_key: "history",
            title: "History",
            body: `The institute was established in ${INSTITUTE.established} to widen access to technical education for women in the region.`,
            sort_order: 1,
          },
          {
            block_key: "vision",
            title: "Vision",
            body: "To be a leading centre of technical education for women in the region.",
            sort_order: 2,
          },
          {
            block_key: "mission",
            title: "Mission",
            body: "Quality instruction, practical skill and industry readiness for every student.",
            sort_order: 3,
          },
          {
            block_key: "values",
            title: "Core Values",
            body: "Integrity, inclusion, curiosity and service to the community.",
            sort_order: 4,
          },
        ]);
        seeded.push("about_blocks");
      }

      if ((await countRows(supabase, "nav_links")) === 0) {
        let order = 1;
        for (const link of UTILITY_STRIP) {
          await supabase.from("nav_links").insert({
            link_group: "utility_strip",
            label: link.label,
            href: link.to,
            sort_order: order++,
          });
        }
        order = 1;
        for (const link of FOOTER_QUICK_LINKS) {
          await supabase.from("nav_links").insert({
            link_group: "footer_quick",
            label: link.label,
            href: link.to,
            sort_order: order++,
          });
        }
        order = 1;
        for (const link of FOOTER_ACADEMIC_LINKS) {
          await supabase.from("nav_links").insert({
            link_group: "footer_academic",
            label: link.label,
            href: link.to,
            sort_order: order++,
          });
        }
        order = 1;
        for (const link of FOOTER_MANDATORY_LINKS) {
          await supabase.from("nav_links").insert({
            link_group: "footer_mandatory",
            label: link.label,
            href: link.to,
            sort_order: order++,
          });
        }
        seeded.push("nav_links");
      }

      if ((await countRows(supabase, "header_nav_groups")) === 0) {
        let groupOrder = 1;
        for (const pill of HEADER_CTA_PILLS) {
          const { data: group, error } = await supabase
            .from("header_nav_groups")
            .insert({
              label: pill.label,
              to_path: pill.to,
              sort_order: groupOrder++,
              is_active: true,
            })
            .select()
            .single();
          if (error) throw error;

          let itemOrder = 1;
          for (const item of pill.items) {
            const { error: itemError } = await supabase.from("header_nav_items").insert({
              group_id: group.id,
              label: item.label,
              to_path: item.to ?? pill.to,
              is_primary: Boolean(item.primary),
              coming_soon: Boolean(item.comingSoon),
              sort_order: itemOrder++,
              is_active: true,
            });
            if (itemError) throw itemError;
          }
        }
        seeded.push("header_nav");
      }

      if ((await countRows(supabase, "campus_gallery_items")) === 0) {
        let order = 1;
        for (let i = 0; i < CAMPUS_GALLERY.length; i++) {
          const photo = CAMPUS_GALLERY[i];
          await supabase.from("campus_gallery_items").insert({
            image_asset_key: GALLERY_ASSET_KEYS[i] ?? "campus-main",
            alt: photo.alt,
            width: photo.width ?? null,
            height: photo.height ?? null,
            sort_order: order++,
            is_active: true,
          });
        }
        seeded.push("campus_gallery");
      }

      if ((await countRows(supabase, "campus_facility_items")) === 0) {
        let order = 1;
        for (const facility of CAMPUS_FACILITIES) {
          await supabase.from("campus_facility_items").insert({
            name: facility.name,
            description: facility.description,
            sort_order: order++,
            is_active: true,
          });
        }
        seeded.push("campus_facilities");
      }

      seeded.push("site_settings");
    } catch (extendedError) {
      console.warn("[bootstrap] Extended CMS tables not available yet:", extendedError);
    }

    const counts = {
      departments: await countRows(supabase, "departments"),
      programs: await countRows(supabase, "programs"),
      notices: await countRows(supabase, "notices"),
      events: await countRows(supabase, "events"),
      media: await countRows(supabase, "media_assets"),
    };

    return {
      ok: true,
      seeded,
      message:
        seeded.length > 0
          ? `Imported website content: ${seeded.join(", ")}`
          : "All core tables already contain data. No import was needed.",
      counts,
    };
  });
