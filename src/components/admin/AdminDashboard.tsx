import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { AdminAboutPanel } from "@/components/admin/AdminAboutPanel";
import { AdminContactPanel } from "@/components/admin/AdminContactPanel";
import { AdminOverviewPanel } from "@/components/admin/AdminOverviewPanel";
import { AdminPageSectionsPanel } from "@/components/admin/AdminPageSectionsPanel";
import { AdminMediaPanel } from "@/components/admin/AdminMediaPanel";
import { AdminPrincipalPanel } from "@/components/admin/AdminPrincipalPanel";
import { AdminResourcePanel, AdminTabsShell, TabsContent } from "@/components/admin/AdminResourcePanel";
import { AdminUsersPanel } from "@/components/admin/AdminUsersPanel";
import { ContextualBack } from "@/components/site/ContextualBack";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent as SubTabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAdmissionsAdmin, fetchDepartments, fetchEvents, fetchExploreCards, fetchHomepageBlocks, fetchMediaAssets, fetchNotices, fetchPageSections, fetchPrograms } from "@/server/cda/content";
import { fetchAdminHealth, fetchAdminOverview, type AdminOverviewCounts } from "@/server/cda/overview";
import { fetchSiteExtendedAdmin } from "@/server/cda/site-extended";
import { cmaBootstrapCms } from "@/server/cma/bootstrap";
import {
  cmaCreateExploreCard,
  cmaCreateAcademicUnit,
  cmaCreateAdmissionDate,
  cmaCreateAdmissionDocument,
  cmaCreateAdmissionEligibilityGroup,
  cmaCreateAdmissionProgramme,
  cmaCreateAdmissionStep,
  cmaCreateDepartment,
  cmaCreateEvent,
  cmaCreateHomeFaq,
  cmaCreateNotice,
  cmaCreateProgram,
  cmaCreateSpotlight,
  cmaCreateStat,
  cmaDeleteExploreCard,
  cmaDeleteAcademicUnit,
  cmaDeleteAdmissionDate,
  cmaDeleteAdmissionDocument,
  cmaDeleteAdmissionEligibilityGroup,
  cmaDeleteAdmissionProgramme,
  cmaDeleteAdmissionStep,
  cmaDeleteDepartment,
  cmaDeleteEvent,
  cmaDeleteHomeFaq,
  cmaDeleteNotice,
  cmaDeleteProgram,
  cmaDeleteSpotlight,
  cmaDeleteStat,
  cmaUpdateExploreCard,
  cmaUpdateAcademicUnit,
  cmaUpdatePageSection,
  cmaUpdateAdmissionCycle,
  cmaUpdateAdmissionDate,
  cmaUpdateAdmissionDocument,
  cmaUpdateAdmissionEligibilityGroup,
  cmaUpdateAdmissionProgramme,
  cmaUpdateAdmissionStep,
  cmaUpdateDepartment,
  cmaUpdateEvent,
  cmaUpdateHomeFaq,
  cmaUpdateNotice,
  cmaUpdateProgram,
  cmaUpdateSpotlight,
  cmaUpdateStat,
} from "@/server/cma/mutations";
import {
  cmaCreateCampusFacility,
  cmaCreateCampusGalleryItem,
  cmaCreateHeaderNavGroup,
  cmaCreateHeaderNavItem,
  cmaCreateNavLink,
  cmaDeleteCampusFacility,
  cmaDeleteCampusGalleryItem,
  cmaDeleteHeaderNavGroup,
  cmaDeleteHeaderNavItem,
  cmaDeleteNavLink,
  cmaUpdateAboutBlock,
  cmaUpdateCampusFacility,
  cmaUpdateCampusGalleryItem,
  cmaUpdateHeaderNavGroup,
  cmaUpdateHeaderNavItem,
  cmaUpdateInstituteSettings,
  cmaUpdateNavLink,
  cmaUpdatePrincipal,
} from "@/server/cma/site-extended";
import type {
  DbExploreCard,
  DbPageSection,
  DbAboutBlock,
  DbCampusFacilityItem,
  DbCampusGalleryItem,
  DbHeaderNavGroup,
  DbHeaderNavItem,
  DbNavLink,
  DbPrincipalProfile,
  InstituteSettings,
  DbAcademicUnit,
  DbAdmissionCycle,
  DbAdmissionDate,
  DbAdmissionDocument,
  DbAdmissionEligibilityGroup,
  DbAdmissionProgramme,
  DbAdmissionStep,
  DbDepartment,
  DbEvent,
  DbHomeFaq,
  DbMediaAsset,
  DbNotice,
  DbProgram,
  DbSpotlight,
  DbStat,
} from "@/lib/supabase/types";

type AdminDashboardProps = {
  accessToken: string;
  onSignOut: () => Promise<void>;
};

export function AdminDashboard({ accessToken, onSignOut }: AdminDashboardProps) {
  const token = { accessToken };

  const [notices, setNotices] = useState<DbNotice[]>([]);
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [departments, setDepartments] = useState<DbDepartment[]>([]);
  const [programs, setPrograms] = useState<DbProgram[]>([]);
  const [stats, setStats] = useState<DbStat[]>([]);
  const [spotlights, setSpotlights] = useState<DbSpotlight[]>([]);
  const [units, setUnits] = useState<DbAcademicUnit[]>([]);
  const [faqs, setFaqs] = useState<DbHomeFaq[]>([]);
  const [pageSections, setPageSections] = useState<DbPageSection[]>([]);
  const [exploreCards, setExploreCards] = useState<DbExploreCard[]>([]);
  const [mediaAssets, setMediaAssets] = useState<DbMediaAsset[]>([]);
  const [admissions, setAdmissions] = useState<Awaited<ReturnType<typeof fetchAdmissionsAdmin>> | null>(null);
  const [overview, setOverview] = useState<AdminOverviewCounts | null>(null);
  const [siteExtended, setSiteExtended] = useState<Awaited<ReturnType<typeof fetchSiteExtendedAdmin>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bootstrapMessage, setBootstrapMessage] = useState<string | null>(null);
  const [bootstrapBusy, setBootstrapBusy] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [n, e, d, p, blocks, adm, sections, cards, media, counts, extended, health] = await Promise.all([
        fetchNotices({ data: token }),
        fetchEvents({ data: token }),
        fetchDepartments({ data: token }),
        fetchPrograms({ data: token }),
        fetchHomepageBlocks({ data: token }),
        fetchAdmissionsAdmin({ data: token }),
        fetchPageSections({ data: token }),
        fetchExploreCards({ data: token }),
        fetchMediaAssets({ data: token }),
        fetchAdminOverview({ data: token }),
        fetchSiteExtendedAdmin({ data: token }).catch(() => null),
        fetchAdminHealth({ data: token }),
      ]);
      setNotices(n as DbNotice[]);
      setEvents(e as DbEvent[]);
      setDepartments(d as DbDepartment[]);
      setPrograms(p as DbProgram[]);
      if (blocks) {
        setStats(blocks.stats as DbStat[]);
        setSpotlights(blocks.spotlights as DbSpotlight[]);
        setUnits(blocks.academicUnits as DbAcademicUnit[]);
        setFaqs(blocks.faqs as DbHomeFaq[]);
      }
      setAdmissions(adm);
      setPageSections(sections as DbPageSection[]);
      setExploreCards(cards as DbExploreCard[]);
      setMediaAssets(media as DbMediaAsset[]);
      setOverview(counts);
      setSiteExtended(extended);
      if (!health.ok && health.error) {
        setLoadError(health.error);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load CMS data");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const runBootstrap = async () => {
    setBootstrapBusy(true);
    setBootstrapMessage(null);
    try {
      const result = await cmaBootstrapCms({ data: token });
      setBootstrapMessage(result.message);
      await loadAll();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBootstrapBusy(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const cycle = admissions?.cycle ?? null;
  const steps = (admissions?.steps ?? []) as DbAdmissionStep[];
  const documents = (admissions?.documents ?? []) as DbAdmissionDocument[];
  const dates = (admissions?.dates ?? []) as DbAdmissionDate[];
  const admissionProgrammes = (admissions?.programmes ?? []) as DbAdmissionProgramme[];
  const eligibilityGroups = (admissions?.eligibilityGroups ?? []) as DbAdmissionEligibilityGroup[];

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="border-b border-border bg-surface-white">
        <div className="container-page py-4">
          <ContextualBack className="mb-3" />
          <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">CMA Admin</p>
            <h1 className="font-display text-2xl font-extrabold text-navy">Content Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage homepage, media library, site pages, notices, events, departments, programs and admissions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/">View site</Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => void onSignOut().then(() => window.location.assign("/admin/login"))}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        {loading && (
          <p className="mb-4 text-sm text-muted-foreground">Loading CMS data…</p>
        )}
        <AdminTabsShell defaultTab="overview">
          <TabsContent value="overview">
            <AdminOverviewPanel
              counts={overview}
              loading={loading}
              healthError={loadError}
              bootstrapMessage={bootstrapMessage}
              bootstrapBusy={bootstrapBusy}
              onBootstrap={() => void runBootstrap()}
              onRefresh={() => void loadAll()}
            />
          </TabsContent>

          <TabsContent value="homepage">
            <Tabs defaultValue="stats" className="space-y-6">
              <TabsList className="flex h-auto flex-wrap gap-1">
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="spotlights">Spotlights</TabsTrigger>
                <TabsTrigger value="units">Academic Units</TabsTrigger>
                <TabsTrigger value="faqs">Home FAQs</TabsTrigger>
              </TabsList>

              <SubTabsContent value="stats">
                <AdminResourcePanel
                  title="Institute statistics"
                  rows={stats}
                  fields={[
                    { key: "value", label: "Value", type: "number", defaultValue: 0 },
                    { key: "label", label: "Label" },
                    { key: "prefix", label: "Prefix" },
                    { key: "suffix", label: "Suffix" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "value", label: "Value" },
                    { key: "label", label: "Label" },
                    { key: "sort_order", label: "Order" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) => cmaCreateStat({ data: { ...token, payload: payload as never } })}
                  onUpdate={(id, payload) => cmaUpdateStat({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteStat({ data: { ...token, id } })}
                />
              </SubTabsContent>

              <SubTabsContent value="spotlights">
                <AdminResourcePanel
                  title="Institute spotlights"
                  rows={spotlights}
                  fields={[
                    { key: "title", label: "Title" },
                    { key: "subtitle", label: "Subtitle", type: "textarea" },
                    { key: "link_path", label: "Link path", defaultValue: "/" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "title", label: "Title" },
                    { key: "link_path", label: "Link" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) => cmaCreateSpotlight({ data: { ...token, payload: payload as never } })}
                  onUpdate={(id, payload) => cmaUpdateSpotlight({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteSpotlight({ data: { ...token, id } })}
                />
              </SubTabsContent>

              <SubTabsContent value="units">
                <AdminResourcePanel
                  title="Academic units"
                  rows={units}
                  fields={[
                    { key: "title", label: "Title" },
                    { key: "subtitle", label: "Subtitle", type: "textarea" },
                    { key: "link_path", label: "Link path", defaultValue: "/academics" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "title", label: "Title" },
                    { key: "link_path", label: "Link" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) => cmaCreateAcademicUnit({ data: { ...token, payload: payload as never } })}
                  onUpdate={(id, payload) => cmaUpdateAcademicUnit({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteAcademicUnit({ data: { ...token, id } })}
                />
              </SubTabsContent>

              <SubTabsContent value="faqs">
                <AdminResourcePanel
                  title="Homepage FAQs"
                  rows={faqs}
                  fields={[
                    { key: "question", label: "Question", type: "textarea" },
                    { key: "answer", label: "Answer", type: "textarea" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "question", label: "Question" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) => cmaCreateHomeFaq({ data: { ...token, payload: payload as never } })}
                  onUpdate={(id, payload) => cmaUpdateHomeFaq({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteHomeFaq({ data: { ...token, id } })}
                />
              </SubTabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="site">
            <Tabs defaultValue="sections" className="space-y-6">
              <TabsList className="flex h-auto flex-wrap gap-1">
                <TabsTrigger value="sections">Page sections</TabsTrigger>
                <TabsTrigger value="explore">Explore carousel</TabsTrigger>
              </TabsList>

              <SubTabsContent value="sections">
                <AdminPageSectionsPanel
                  sections={pageSections}
                  onRefresh={loadAll}
                  onSave={(sectionKey, payload) =>
                    cmaUpdatePageSection({ data: { ...token, sectionKey, payload: payload as never } })
                  }
                />
              </SubTabsContent>

              <SubTabsContent value="explore">
                <AdminResourcePanel
                  title="Explore GPW Srinagar cards"
                  rows={exploreCards}
                  fields={[
                    { key: "slug", label: "Slug" },
                    { key: "category", label: "Category" },
                    { key: "title", label: "Title" },
                    { key: "description", label: "Description", type: "textarea" },
                    { key: "cta", label: "Button label" },
                    { key: "href", label: "Link", defaultValue: "/" },
                    {
                      key: "image_key",
                      label: "Image asset key (must match Media library asset key, e.g. campus-main)",
                      defaultValue: "campus-main",
                    },
                    { key: "image_alt", label: "Image alt text", type: "textarea" },
                    { key: "image_position", label: "Image position (left/right)", defaultValue: "left" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
                    { key: "is_priority", label: "Priority preload", type: "boolean", defaultValue: false },
                  ]}
                  columns={[
                    { key: "category", label: "Category" },
                    { key: "title", label: "Title" },
                    { key: "href", label: "Link" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) => cmaCreateExploreCard({ data: { ...token, payload: payload as never } })}
                  onUpdate={(id, payload) => cmaUpdateExploreCard({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteExploreCard({ data: { ...token, id } })}
                />
              </SubTabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="media">
            <AdminMediaPanel accessToken={accessToken} assets={mediaAssets} onRefresh={loadAll} />
          </TabsContent>

          <TabsContent value="notices">
            <AdminResourcePanel
              title="Notices & announcements"
              rows={notices}
              mediaAssets={mediaAssets}
              fields={[
                { key: "title", label: "Title", type: "textarea" },
                { key: "category", label: "Category", defaultValue: "Notices" },
                { key: "tag", label: "Tag", defaultValue: "Notice" },
                { key: "published_at", label: "Published date", type: "date" },
                { key: "priority", label: "Priority (Urgent/Important/General)", defaultValue: "General" },
                { key: "file_label", label: "File label (e.g. PDF · 240 KB)" },
                { key: "file_url", label: "Download file", type: "media_url", mediaKinds: ["pdf", "other"] },
                { key: "is_pinned", label: "Pinned", type: "boolean", defaultValue: false },
                { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
                { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
              ]}
              columns={[
                { key: "tag", label: "Tag" },
                { key: "title", label: "Title" },
                { key: "published_at", label: "Date" },
              ]}
              onRefresh={loadAll}
              onCreate={(payload) => cmaCreateNotice({ data: { ...token, payload: payload as never } })}
              onUpdate={(id, payload) => cmaUpdateNotice({ data: { ...token, id, payload: payload as never } })}
              onDelete={(id) => cmaDeleteNotice({ data: { ...token, id } })}
            />
          </TabsContent>

          <TabsContent value="events">
            <AdminResourcePanel
              title="Campus events"
              rows={events}
              fields={[
                { key: "title", label: "Title" },
                { key: "event_date", label: "Event date", defaultValue: "August 2026" },
                { key: "venue", label: "Venue" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
                { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
              ]}
              columns={[
                { key: "title", label: "Title" },
                { key: "event_date", label: "Date" },
                { key: "venue", label: "Venue" },
              ]}
              onRefresh={loadAll}
              onCreate={(payload) => cmaCreateEvent({ data: { ...token, payload: payload as never } })}
              onUpdate={(id, payload) => cmaUpdateEvent({ data: { ...token, id, payload: payload as never } })}
              onDelete={(id) => cmaDeleteEvent({ data: { ...token, id } })}
            />
          </TabsContent>

          <TabsContent value="departments">
            <AdminResourcePanel
              title="Departments"
              rows={departments}
              fields={[
                { key: "slug", label: "Slug" },
                { key: "name", label: "Name" },
                { key: "summary", label: "Summary", type: "textarea" },
                { key: "overview", label: "Full overview", type: "textarea" },
                { key: "category_label", label: "Category label" },
                { key: "duration", label: "Duration", defaultValue: "3 Years" },
                { key: "eligibility", label: "Eligibility" },
                { key: "program_type", label: "Program type", defaultValue: "Diploma Programme" },
                { key: "stream", label: "Stream" },
                { key: "icon", label: "Icon key (monitor, flask, etc.)" },
                { key: "has_departmental_labs", label: "Has labs", type: "boolean", defaultValue: true },
                {
                  key: "career_areas",
                  label: "Career areas (one per line)",
                  type: "textarea",
                  defaultValue: "",
                },
                { key: "image_asset_key", label: "Cover image asset key" },
                { key: "image_alt", label: "Cover image alt text" },
                { key: "head_name", label: "Head name" },
                { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                { key: "is_active", label: "Published", type: "boolean", defaultValue: true },
              ]}
              columns={[
                { key: "name", label: "Name" },
                { key: "slug", label: "Slug" },
              ]}
              onRefresh={loadAll}
              onCreate={(payload) => cmaCreateDepartment({ data: { ...token, payload: payload as never } })}
              onUpdate={(id, payload) => cmaUpdateDepartment({ data: { ...token, id, payload: payload as never } })}
              onDelete={(id) => cmaDeleteDepartment({ data: { ...token, id } })}
            />
          </TabsContent>

          <TabsContent value="programs">
            <AdminResourcePanel
              title="Academic programs"
              rows={programs}
              fields={[
                { key: "name", label: "Program name" },
                { key: "dept_label", label: "Department label" },
                { key: "duration", label: "Duration", defaultValue: "3 Years" },
                { key: "eligibility", label: "Eligibility", type: "textarea" },
                { key: "seats", label: "Seats" },
                { key: "stream", label: "Stream", defaultValue: "Engineering" },
                { key: "overview", label: "Overview", type: "textarea" },
                { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
              ]}
              columns={[
                { key: "name", label: "Program" },
                { key: "dept_label", label: "Department" },
                { key: "duration", label: "Duration" },
              ]}
              onRefresh={loadAll}
              onCreate={(payload) => cmaCreateProgram({ data: { ...token, payload: payload as never } })}
              onUpdate={(id, payload) => cmaUpdateProgram({ data: { ...token, id, payload: payload as never } })}
              onDelete={(id) => cmaDeleteProgram({ data: { ...token, id } })}
            />
          </TabsContent>

          <TabsContent value="admissions">
            {cycle && (
              <AdminResourcePanel
                title={`Admission cycle — ${cycle.title}`}
                rows={[cycle as DbAdmissionCycle & { id: string }]}
                fields={[
                  { key: "year", label: "Admission year", type: "number", defaultValue: cycle.year },
                  { key: "title", label: "Page title" },
                  { key: "intro", label: "Hero description", type: "textarea" },
                  { key: "strip_text", label: "Apply strip text", type: "textarea" },
                  { key: "apply_url", label: "Apply Online URL" },
                  { key: "apply_label", label: "Apply Online button label" },
                  { key: "fee_amount", label: "Fee amount" },
                  { key: "fee_note", label: "Fee note", type: "textarea" },
                  { key: "notice_url", label: "Admission notice URL" },
                  { key: "notice_label", label: "Admission notice button label" },
                  { key: "eligibility_intro", label: "Eligibility intro", type: "textarea" },
                  { key: "eligibility_note", label: "Eligibility note", type: "textarea" },
                  { key: "documents_note", label: "Documents note", type: "textarea" },
                  { key: "programmes_note", label: "Programmes intro", type: "textarea" },
                  { key: "assistant_title", label: "Assistant CTA title" },
                  { key: "assistant_body", label: "Assistant CTA text", type: "textarea" },
                  { key: "assistant_label", label: "Assistant CTA button" },
                  { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
                ]}
                columns={[
                  { key: "year", label: "Year" },
                  { key: "title", label: "Title" },
                ]}
                onRefresh={loadAll}
                onCreate={async () => {}}
                onUpdate={(id, payload) =>
                  cmaUpdateAdmissionCycle({ data: { ...token, id, payload: payload as never } })
                }
                onDelete={async () => {}}
              />
            )}

            {cycle && (
              <>
                <AdminResourcePanel
                  title="Programmes offered — change sort order to reorder the public page"
                  rows={admissionProgrammes}
                  fields={[
                    { key: "cycle_id", label: "Cycle ID", defaultValue: cycle.id },
                    { key: "name", label: "Programme name" },
                    { key: "category", label: "Category label", defaultValue: "TECHNICAL" },
                    { key: "slug", label: "Department page slug" },
                    { key: "credential", label: "Credential", defaultValue: "Diploma" },
                    { key: "duration", label: "Duration", defaultValue: "3 Years" },
                    { key: "seats", label: "Seat intake", type: "number", defaultValue: 30 },
                    { key: "badge", label: "Special badge (optional)" },
                    { key: "badge_note", label: "Special note (optional)" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "sort_order", label: "#" },
                    { key: "name", label: "Programme" },
                    { key: "category", label: "Category" },
                    { key: "seats", label: "Seats" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) =>
                    cmaCreateAdmissionProgramme({
                      data: { ...token, payload: { ...payload, cycle_id: cycle.id } as never },
                    })
                  }
                  onUpdate={(id, payload) =>
                    cmaUpdateAdmissionProgramme({ data: { ...token, id, payload: payload as never } })
                  }
                  onDelete={(id) => cmaDeleteAdmissionProgramme({ data: { ...token, id } })}
                />

                <AdminResourcePanel
                  title="Admission steps"
                  rows={steps}
                  fields={[
                    { key: "cycle_id", label: "Cycle ID", defaultValue: cycle.id },
                    { key: "step_number", label: "Step #", type: "number", defaultValue: 1 },
                    { key: "title", label: "Title" },
                    { key: "description", label: "Description", type: "textarea" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                  ]}
                  columns={[
                    { key: "step_number", label: "#" },
                    { key: "title", label: "Title" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) =>
                    cmaCreateAdmissionStep({ data: { ...token, payload: { ...payload, cycle_id: cycle.id } as never } })
                  }
                  onUpdate={(id, payload) => cmaUpdateAdmissionStep({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteAdmissionStep({ data: { ...token, id } })}
                />

                <AdminResourcePanel
                  title="Eligibility groups"
                  rows={eligibilityGroups}
                  fields={[
                    { key: "cycle_id", label: "Cycle ID", defaultValue: cycle.id },
                    { key: "heading", label: "Heading" },
                    { key: "body", label: "Body", type: "textarea" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                  ]}
                  columns={[{ key: "heading", label: "Group" }]}
                  onRefresh={loadAll}
                  onCreate={(payload) =>
                    cmaCreateAdmissionEligibilityGroup({
                      data: { ...token, payload: { ...payload, cycle_id: cycle.id } as never },
                    })
                  }
                  onUpdate={(id, payload) =>
                    cmaUpdateAdmissionEligibilityGroup({ data: { ...token, id, payload: payload as never } })
                  }
                  onDelete={(id) => cmaDeleteAdmissionEligibilityGroup({ data: { ...token, id } })}
                />

                <AdminResourcePanel
                  title="Required documents"
                  rows={documents}
                  fields={[
                    { key: "cycle_id", label: "Cycle ID", defaultValue: cycle.id },
                    { key: "label", label: "Document label" },
                    { key: "detail", label: "Detail (optional)" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                  ]}
                  columns={[{ key: "label", label: "Document" }]}
                  onRefresh={loadAll}
                  onCreate={(payload) =>
                    cmaCreateAdmissionDocument({
                      data: { ...token, payload: { ...payload, cycle_id: cycle.id } as never },
                    })
                  }
                  onUpdate={(id, payload) =>
                    cmaUpdateAdmissionDocument({ data: { ...token, id, payload: payload as never } })
                  }
                  onDelete={(id) => cmaDeleteAdmissionDocument({ data: { ...token, id } })}
                />

                <AdminResourcePanel
                  title="Important dates"
                  rows={dates}
                  fields={[
                    { key: "cycle_id", label: "Cycle ID", defaultValue: cycle.id },
                    { key: "label", label: "Label" },
                    { key: "date_value", label: "Date value", defaultValue: "To be announced" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                  ]}
                  columns={[
                    { key: "label", label: "Label" },
                    { key: "date_value", label: "Date" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) =>
                    cmaCreateAdmissionDate({ data: { ...token, payload: { ...payload, cycle_id: cycle.id } as never } })
                  }
                  onUpdate={(id, payload) => cmaUpdateAdmissionDate({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteAdmissionDate({ data: { ...token, id } })}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="about">
            <AdminAboutPanel
              blocks={(siteExtended?.aboutBlocks ?? []) as DbAboutBlock[]}
              onSave={async (blockKey, payload) => {
                await cmaUpdateAboutBlock({ data: { ...token, blockKey, payload } });
                await loadAll();
              }}
            />
          </TabsContent>

          <TabsContent value="principal">
            <AdminPrincipalPanel
              principal={(siteExtended?.principal ?? null) as DbPrincipalProfile | null}
              onSave={async (payload) => {
                await cmaUpdatePrincipal({ data: { ...token, payload } });
                await loadAll();
              }}
            />
          </TabsContent>

          <TabsContent value="contact">
            <AdminContactPanel
              settings={(siteExtended?.institute ?? {}) as InstituteSettings}
              onSave={async (payload) => {
                await cmaUpdateInstituteSettings({ data: { ...token, payload } });
                await loadAll();
              }}
            />
          </TabsContent>

          <TabsContent value="campus">
            <Tabs defaultValue="gallery" className="space-y-6">
              <TabsList className="flex h-auto flex-wrap gap-1">
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
              </TabsList>
              <SubTabsContent value="gallery">
                <AdminResourcePanel
                  title="Campus gallery"
                  rows={(siteExtended?.gallery ?? []) as DbCampusGalleryItem[]}
                  fields={[
                    { key: "image_asset_key", label: "Image asset key" },
                    { key: "alt", label: "Alt text", type: "textarea" },
                    { key: "width", label: "Width", type: "number" },
                    { key: "height", label: "Height", type: "number" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Published", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "image_asset_key", label: "Asset" },
                    { key: "alt", label: "Alt" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) => cmaCreateCampusGalleryItem({ data: { ...token, payload: payload as never } })}
                  onUpdate={(id, payload) =>
                    cmaUpdateCampusGalleryItem({ data: { ...token, id, payload: payload as never } })
                  }
                  onDelete={(id) => cmaDeleteCampusGalleryItem({ data: { ...token, id } })}
                />
              </SubTabsContent>
              <SubTabsContent value="facilities">
                <AdminResourcePanel
                  title="Campus facilities"
                  rows={(siteExtended?.facilities ?? []) as DbCampusFacilityItem[]}
                  fields={[
                    { key: "name", label: "Name" },
                    { key: "description", label: "Description", type: "textarea" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Published", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "name", label: "Facility" },
                    { key: "sort_order", label: "Order" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) => cmaCreateCampusFacility({ data: { ...token, payload: payload as never } })}
                  onUpdate={(id, payload) =>
                    cmaUpdateCampusFacility({ data: { ...token, id, payload: payload as never } })
                  }
                  onDelete={(id) => cmaDeleteCampusFacility({ data: { ...token, id } })}
                />
              </SubTabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="navigation">
            <Tabs defaultValue="header" className="space-y-6">
              <TabsList className="flex h-auto flex-wrap gap-1">
                <TabsTrigger value="header">Header pills</TabsTrigger>
                <TabsTrigger value="header-items">Dropdown items</TabsTrigger>
                <TabsTrigger value="utility">Utility strip</TabsTrigger>
                <TabsTrigger value="footer">Footer links</TabsTrigger>
              </TabsList>
              <SubTabsContent value="header">
                <AdminResourcePanel
                  title="Header navigation groups"
                  rows={(siteExtended?.headerGroups ?? []) as DbHeaderNavGroup[]}
                  fields={[
                    { key: "label", label: "Label" },
                    { key: "to_path", label: "Landing path", defaultValue: "/" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Visible", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "label", label: "Label" },
                    { key: "to_path", label: "Path" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) => cmaCreateHeaderNavGroup({ data: { ...token, payload: payload as never } })}
                  onUpdate={(id, payload) =>
                    cmaUpdateHeaderNavGroup({ data: { ...token, id, payload: payload as never } })
                  }
                  onDelete={(id) => cmaDeleteHeaderNavGroup({ data: { ...token, id } })}
                />
              </SubTabsContent>
              <SubTabsContent value="header-items">
                <AdminResourcePanel
                  title="Header dropdown items"
                  rows={(siteExtended?.headerItems ?? []) as DbHeaderNavItem[]}
                  fields={[
                    { key: "group_id", label: "Group ID (UUID)" },
                    { key: "label", label: "Label" },
                    { key: "to_path", label: "Link path", defaultValue: "/" },
                    { key: "is_primary", label: "Primary action", type: "boolean", defaultValue: false },
                    { key: "coming_soon", label: "Coming soon", type: "boolean", defaultValue: false },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Visible", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "label", label: "Label" },
                    { key: "to_path", label: "Path" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) => cmaCreateHeaderNavItem({ data: { ...token, payload: payload as never } })}
                  onUpdate={(id, payload) =>
                    cmaUpdateHeaderNavItem({ data: { ...token, id, payload: payload as never } })
                  }
                  onDelete={(id) => cmaDeleteHeaderNavItem({ data: { ...token, id } })}
                />
              </SubTabsContent>
              <SubTabsContent value="utility">
                <AdminResourcePanel
                  title="Utility strip links"
                  rows={((siteExtended?.navLinks ?? []) as DbNavLink[]).filter((l) => l.link_group === "utility_strip")}
                  fields={[
                    { key: "link_group", label: "Group", defaultValue: "utility_strip" },
                    { key: "label", label: "Label" },
                    { key: "href", label: "Link", defaultValue: "/" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Visible", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "label", label: "Label" },
                    { key: "href", label: "Link" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) =>
                    cmaCreateNavLink({
                      data: { ...token, payload: { ...payload, link_group: "utility_strip" } as never },
                    })
                  }
                  onUpdate={(id, payload) => cmaUpdateNavLink({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteNavLink({ data: { ...token, id } })}
                />
              </SubTabsContent>
              <SubTabsContent value="footer">
                <AdminResourcePanel
                  title="Footer quick links"
                  rows={((siteExtended?.navLinks ?? []) as DbNavLink[]).filter((l) => l.link_group === "footer_quick")}
                  fields={[
                    { key: "link_group", label: "Group", defaultValue: "footer_quick" },
                    { key: "label", label: "Label" },
                    { key: "href", label: "Link", defaultValue: "/" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Visible", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "label", label: "Label" },
                    { key: "href", label: "Link" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) =>
                    cmaCreateNavLink({
                      data: { ...token, payload: { ...payload, link_group: "footer_quick" } as never },
                    })
                  }
                  onUpdate={(id, payload) => cmaUpdateNavLink({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteNavLink({ data: { ...token, id } })}
                />
                <AdminResourcePanel
                  title="Footer academic links"
                  rows={((siteExtended?.navLinks ?? []) as DbNavLink[]).filter((l) => l.link_group === "footer_academic")}
                  fields={[
                    { key: "link_group", label: "Group", defaultValue: "footer_academic" },
                    { key: "label", label: "Label" },
                    { key: "href", label: "Link", defaultValue: "/" },
                    { key: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
                    { key: "is_active", label: "Visible", type: "boolean", defaultValue: true },
                  ]}
                  columns={[
                    { key: "label", label: "Label" },
                    { key: "href", label: "Link" },
                  ]}
                  onRefresh={loadAll}
                  onCreate={(payload) =>
                    cmaCreateNavLink({
                      data: { ...token, payload: { ...payload, link_group: "footer_academic" } as never },
                    })
                  }
                  onUpdate={(id, payload) => cmaUpdateNavLink({ data: { ...token, id, payload: payload as never } })}
                  onDelete={(id) => cmaDeleteNavLink({ data: { ...token, id } })}
                />
              </SubTabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersPanel accessToken={accessToken} />
          </TabsContent>
        </AdminTabsShell>
      </div>
    </div>
  );
}
