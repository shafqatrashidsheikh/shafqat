import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { ApplyOnlineButton } from "@/components/site/ApplyOnlineButton";
import { PageHeader } from "@/components/site/PageHeader";
import { openGPWAssistant } from "@/components/gpw-assistant/events";
import {
  ADMISSIONS_APPLY_LABEL,
  ADMISSIONS_ASSISTANT_BODY,
  ADMISSIONS_ASSISTANT_LABEL,
  ADMISSIONS_ASSISTANT_TITLE,
  ADMISSIONS_DOCUMENTS_NOTE,
  ADMISSIONS_ELIGIBILITY_INTRO,
  ADMISSIONS_ELIGIBILITY_NOTE,
  ADMISSIONS_FEE_AMOUNT,
  ADMISSIONS_FEE_NOTE,
  ADMISSIONS_FINAL_CTA_BODY,
  ADMISSIONS_FINAL_CTA_TITLE,
  ADMISSIONS_INTRO,
  ADMISSIONS_NOTICE_HREF,
  ADMISSIONS_NOTICE_LABEL,
  ADMISSIONS_PROGRAMMES_NOTE,
  ADMISSIONS_STRIP,
  ADMISSIONS_TITLE,
  filledAdmissionText,
  programmeDurationLabel,
  resolveAdmissionDocuments,
  resolveAdmissionEligibility,
  resolveAdmissionProgrammes,
  resolveAdmissionSteps,
} from "@/lib/admissions-data";
import {
  emptyAdmissionDateRows,
  formatAdmissionSourceUpdated,
  JKBOTE_ADMISSION_PORTAL_URL,
  type JkboteAdmissionDatesPayload,
} from "@/lib/jkbote-admission-dates";
import type { JkboteAdmissionStatusPayload } from "@/lib/jkbote-admission-status";
import { loadAdmissionsData } from "@/lib/loaders/homepage";
import { safeHref, safeHrefOr } from "@/lib/security/safe-url";
import { getStaticAdmissionCycle } from "@/lib/supabase/fallback";

function statusFromLiveDates(
  liveDates: JkboteAdmissionDatesPayload | null | undefined,
): JkboteAdmissionStatusPayload | null {
  if (!liveDates) return null;
  return {
    fetchedAt: liveDates.fetchedAt,
    checkedAt: liveDates.fetchedAt,
    ok: liveDates.ok,
    refreshed: liveDates.ok,
    status: liveDates.portalStatus,
    portalUrl: liveDates.portalUrl || JKBOTE_ADMISSION_PORTAL_URL,
    officialSource: "JKBOTE",
    ...(liveDates.error ? { error: liveDates.error } : {}),
  };
}

export const Route = createFileRoute("/admissions")({
  loader: () => loadAdmissionsData(),
  head: () => ({
    meta: [
      { title: "Admissions 2026 — GPW Srinagar" },
      {
        name: "description",
        content:
          "Explore diploma programmes, eligibility, application steps, required documents and important admission updates at Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Admissions 2026 — GPW Srinagar" },
      {
        property: "og:description",
        content: "JKBOTE diploma admissions for Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:url", content: "/admissions" },
    ],
    links: [{ rel: "canonical", href: "/admissions" }],
  }),
  component: Admissions,
});

function QuietLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className: string;
}) {
  const safe = safeHref(href);
  if (!safe) return null;

  const isExternal = /^https?:\/\//i.test(safe);
  return (
    <a
      href={safe}
      className={className}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}

function Admissions() {
  const data = Route.useLoaderData();

  if (data.admissionsEnabled === false) {
    return (
      <div className="bg-background">
        <PageHeader
          compact
          crumb="Admissions"
          title="Admissions Notice"
          intro="Information regarding admission sessions and academic enrollment."
          titleClassName="max-w-none"
        />
        <div className="container-page py-16 sm:py-20 text-center">
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface-white p-8 sm:p-10 shadow-soft">
            <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
              Admissions Inactive
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-navy sm:text-3xl">
              Admissions Are Currently Closed
            </h2>
            <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              The admission cycle is not actively accepting applications at this time. Please check the official institute notices for forthcoming admission schedules or explore our academic programmes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-deep"
              >
                Institute Home
              </Link>
              <Link
                to="/academics"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-light-blue"
              >
                Explore Programmes
              </Link>
              <Link
                to="/updates/notices"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-light-blue"
              >
                View Notices
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const defaults = getStaticAdmissionCycle();
  const cycle = data.cycle ?? defaults;

  const title = filledAdmissionText(cycle.title, ADMISSIONS_TITLE);
  const intro = filledAdmissionText(cycle.intro, ADMISSIONS_INTRO);
  const stripText = filledAdmissionText(cycle.strip_text, ADMISSIONS_STRIP);
  const applyLabel = filledAdmissionText(cycle.apply_label, ADMISSIONS_APPLY_LABEL);
  const feeAmount = filledAdmissionText(cycle.fee_amount, ADMISSIONS_FEE_AMOUNT);
  const feeNote = filledAdmissionText(cycle.fee_note, ADMISSIONS_FEE_NOTE);
  const noticeUrl = filledAdmissionText(cycle.notice_url, ADMISSIONS_NOTICE_HREF);
  const noticeLabel = filledAdmissionText(cycle.notice_label, ADMISSIONS_NOTICE_LABEL);
  const eligibilityIntro = filledAdmissionText(cycle.eligibility_intro, ADMISSIONS_ELIGIBILITY_INTRO);
  const eligibilityNote = filledAdmissionText(cycle.eligibility_note, ADMISSIONS_ELIGIBILITY_NOTE);
  const documentsNote = filledAdmissionText(cycle.documents_note, ADMISSIONS_DOCUMENTS_NOTE);
  const programmesIntro = filledAdmissionText(cycle.programmes_note, ADMISSIONS_PROGRAMMES_NOTE);
  const assistantTitle = filledAdmissionText(cycle.assistant_title, ADMISSIONS_ASSISTANT_TITLE);
  const assistantBody = filledAdmissionText(cycle.assistant_body, ADMISSIONS_ASSISTANT_BODY);
  const assistantLabel = filledAdmissionText(cycle.assistant_label, ADMISSIONS_ASSISTANT_LABEL);

  const steps = resolveAdmissionSteps(data.steps);
  const documents = resolveAdmissionDocuments(data.documents);
  const programmes = resolveAdmissionProgrammes(data.programmes);
  const eligibilityGroups = resolveAdmissionEligibility(data.eligibilityGroups);
  const liveDates = data.liveDates;
  const initialApplyStatus = statusFromLiveDates(liveDates);
  const dates =
    liveDates?.rows?.length === 4 ? liveDates.rows : emptyAdmissionDateRows();
  const sourceHref =
    liveDates?.latestNotice?.url?.trim() ||
    liveDates?.portalUrl ||
    JKBOTE_ADMISSION_PORTAL_URL;
  const sourceTitle = liveDates?.latestNotice?.title?.trim() || "Official JKBOTE admission updates";
  const lastUpdatedLabel = formatAdmissionSourceUpdated(liveDates?.fetchedAt);

  const applyButtonClass =
    "inline-flex min-h-11 w-auto shrink-0 self-start items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep";
  const strongApplyClass =
    "inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-brand-deep";
  const quietButtonClass =
    "inline-flex min-h-11 shrink-0 self-start items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep";
  const sectionLeadClass = "mt-2 w-full min-w-0 text-sm leading-relaxed text-muted-foreground";

  return (
    <div className="leading-[1.5]">
      <PageHeader crumb="Admissions" title={title} intro={intro} compact />

      <div id="apply" className="scroll-mt-28 bg-background">
        <div className="container-page pb-6 pt-1 md:pb-7">
          <div className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-surface-white px-4 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-5">
            <ApplyOnlineButton
              label={applyLabel}
              className={applyButtonClass}
              initialStatus={initialApplyStatus}
            />
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-right">
              {stripText}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-background pb-10 pt-2 md:pb-12 md:pt-3">
        <div className="container-page space-y-10 md:space-y-12">
          <section id="admission-overview" className="scroll-mt-28">
            <h2 className="font-display text-[1.375rem] font-extrabold text-navy md:text-2xl">
              Choose Your Diploma Programme
            </h2>
            <p className={sectionLeadClass}>{programmesIntro}</p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {programmes.map((programme, index) => {
                return (
                  <li key={`${programme.slug || programme.name}-${index}`}>
                    <article className="flex h-full min-h-[13.5rem] flex-col rounded-2xl border border-border bg-card p-4 shadow-soft">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-display text-xs font-bold tracking-wide text-brand">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {programme.category ? (
                          <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold tracking-wide text-navy uppercase">
                            {programme.category}
                          </span>
                        ) : null}
                      </div>
                      {programme.badge ? (
                        <span className="mt-3 w-fit rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand">
                          {programme.badge}
                        </span>
                      ) : null}
                      <h3 className="mt-3 font-display text-sm font-bold text-navy">{programme.name}</h3>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {programmeDurationLabel(programme.duration, programme.credential)}
                      </p>
                      <p className="text-xs text-muted-foreground">{programme.seats} Seats</p>
                      {programme.badge_note ? (
                        <p className="mt-2 text-xs font-medium text-navy">{programme.badge_note}</p>
                      ) : null}
                      {programme.slug ? (
                        <Link
                          to="/academics/departments/$slug"
                          params={{ slug: programme.slug }}
                          className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-brand hover:text-navy"
                        >
                          View programme
                          <ChevronRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      ) : (
                        <span className="mt-auto pt-4" />
                      )}
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>

          <section id="eligibility" className="scroll-mt-28">
            <h2 className="font-display text-[1.375rem] font-extrabold text-navy md:text-2xl">
              Check Your Eligibility
            </h2>
            <p className={sectionLeadClass}>{eligibilityIntro}</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {eligibilityGroups.map((group) => (
                <article
                  key={group.heading}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft sm:max-lg:last:col-span-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-sm font-bold text-navy">{group.heading}</h3>
                    {group.badge ? (
                      <span className="shrink-0 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold tracking-wide text-navy">
                        {group.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 font-display text-base font-bold leading-snug text-navy">{group.highlight}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.body}</p>
                  {group.routes && group.routes.length > 0 ? (
                    <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                      {group.routes.map((route) => (
                        <li key={route.label}>
                          <span className="font-semibold text-navy">
                            {route.label === "ITI" ? "2-Year ITI" : "10+2"}.
                          </span>{" "}
                          {route.detail}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {group.footnote ? (
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{group.footnote}</p>
                  ) : null}
                </article>
              ))}
            </div>
            <p className="mt-3 w-full text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-navy">Before You Apply. </span>
              {eligibilityNote}
            </p>
          </section>

          <section id="application-process" className="scroll-mt-28">
            <h2 className="font-display text-[1.375rem] font-extrabold text-navy md:text-2xl">How to Apply</h2>
            <ol className="admissions-timeline mt-6">
              {steps.map((step, index) => (
                <li key={step.t} className="admissions-timeline__item">
                  <span className="admissions-timeline__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm font-bold text-navy">{step.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <ApplyOnlineButton
                label={applyLabel}
                className={strongApplyClass}
                initialStatus={initialApplyStatus}
              />
            </div>
          </section>

          <section id="important-dates" className="scroll-mt-28">
            <h2 className="font-display text-[1.375rem] font-extrabold text-navy md:text-2xl">
              Important Admission Dates
            </h2>
            <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
              <dl className="divide-y divide-border">
                {dates.map((date) => (
                  <div
                    key={date.label}
                    className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <dt className="text-sm text-muted-foreground">{date.label}</dt>
                    <dd className="min-w-0 text-sm font-semibold text-navy sm:text-right">
                      {safeHref(date.href) ? (
                        <a
                          href={safeHref(date.href)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline-offset-2 hover:text-brand hover:underline"
                        >
                          {date.date_value}
                        </a>
                      ) : (
                        date.date_value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Source:{" "}
                  <a
                    href={safeHrefOr(sourceHref, JKBOTE_ADMISSION_PORTAL_URL)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand underline-offset-2 hover:underline"
                  >
                    JKBOTE
                  </a>
                  {" · "}
                  Last updated: {lastUpdatedLabel}
                </p>
                {liveDates?.latestNotice && safeHref(liveDates.latestNotice.url) ? (
                  <p className="mt-1.5 min-w-0 text-[11px] leading-snug text-muted-foreground">
                    Latest notice:{" "}
                    <a
                      href={safeHref(liveDates.latestNotice.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-navy underline-offset-2 hover:text-brand hover:underline"
                    >
                      {sourceTitle}
                    </a>
                  </p>
                ) : null}
                {liveDates?.portalStatus === "closed" ? (
                  <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                    Official admission portal status: closed.{" "}
                    <a
                      href={JKBOTE_ADMISSION_PORTAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brand underline-offset-2 hover:underline"
                    >
                      Check admission.jkbote.ac.in
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <div className="space-y-6 md:space-y-7">
            <section id="required-documents" className="scroll-mt-28">
              <h2 className="font-display text-[1.375rem] font-extrabold text-navy md:text-2xl">
                Documents You May Need
              </h2>
              <ul className="mt-4 overflow-hidden rounded-lg border border-border bg-surface-white">
                {documents.map((document) => (
                  <li
                    key={document.label}
                    className="flex items-start gap-3 border-b border-border px-3.5 py-2.5 text-sm text-navy transition-colors last:border-b-0 hover:bg-light-blue/40"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-brand"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 leading-snug">
                      <span className="font-medium">{document.label}</span>
                      {document.detail ? (
                        <span className="mt-0.5 block text-xs text-muted-foreground">{document.detail}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 w-full min-w-0 text-xs leading-relaxed text-muted-foreground">
                {documentsNote}
              </p>
            </section>

            <section id="fee-information" className="scroll-mt-28">
              <h2 className="font-display text-[1.375rem] font-extrabold text-navy md:text-2xl">
                Fee Information
              </h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-border bg-surface-white">
                <dl className="divide-y divide-border">
                  <div className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <dt className="text-sm text-muted-foreground">Annual fee</dt>
                    <dd className="min-w-0 text-sm font-semibold text-navy sm:text-right">{feeAmount}</dd>
                  </div>
                  <div className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <dt className="text-sm text-muted-foreground">Note</dt>
                    <dd className="min-w-0 text-sm leading-snug text-navy sm:max-w-[70%] sm:text-right">
                      {feeNote}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-3">
                <QuietLink href={noticeUrl} label={noticeLabel} className={quietButtonClass} />
              </div>
            </section>
          </div>

          <section className="scroll-mt-28 rounded-2xl border border-border bg-light-blue/30 p-5 sm:p-6">
            <h2 className="font-display text-[1.375rem] font-extrabold text-navy md:text-2xl">{assistantTitle}</h2>
            <p className={sectionLeadClass}>{assistantBody}</p>
            <button type="button" className={`${applyButtonClass} mt-5`} onClick={() => openGPWAssistant()}>
              {assistantLabel}
            </button>
          </section>
        </div>
      </div>

      <section className="border-t border-border bg-light-blue/40">
        <div className="container-page flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-extrabold text-navy">{ADMISSIONS_FINAL_CTA_TITLE}</h2>
            <p className="mt-1.5 w-full text-sm leading-relaxed text-muted-foreground">{ADMISSIONS_FINAL_CTA_BODY}</p>
          </div>
          <ApplyOnlineButton
            label={applyLabel}
            className={strongApplyClass}
            initialStatus={initialApplyStatus}
          />
        </div>
      </section>
    </div>
  );
}
