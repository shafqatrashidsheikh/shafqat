import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Mail, Phone } from "lucide-react";
import { AmpersandText, NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { departmentDetailPath } from "@/lib/departments-data";
import {
  FACULTY_DEPARTMENT_UNITS,
  FACULTY_DIRECTORY_NOTE,
  FACULTY_LEADERSHIP,
  FACULTY_ROLE_GROUPS,
  FACULTY_VERIFIED,
} from "@/lib/faculty-data";
import { INSTITUTE } from "@/lib/site-data";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty & Staff — GPW Srinagar" },
      {
        name: "description",
        content: `Faculty leadership and verified staff contacts for ${INSTITUTE.name}, Bemina.`,
      },
      { property: "og:title", content: "Faculty & Staff — GPW Srinagar" },
      { property: "og:url", content: "/faculty" },
    ],
    links: [{ rel: "canonical", href: "/faculty" }],
  }),
  component: FacultyPage,
});

function FacultyPage() {
  return (
    <>
      <PageHeader
        compact
        crumb="Faculty & Staff"
        title={<AmpersandText>Faculty & Staff</AmpersandText>}
        titleClassName="max-w-none"
        introClassName="mt-3 w-full min-w-0 max-w-none text-base leading-relaxed text-muted-foreground md:mt-3.5"
        intro={
          <NaturalWrap
            phrases={[
              "Leadership, verified teaching contacts and department faculty support",
              "for diploma programmes at GPW Srinagar.",
            ]}
          />
        }
      />

      <section className="bg-background">
        <div className="container-page space-y-8 pt-2 pb-5 md:space-y-10 md:pt-2.5 md:pb-7">
          <p className="w-full text-sm leading-relaxed text-muted-foreground" data-motion-from="up">
            {INSTITUTE.name} is staffed by teaching faculty, technical staff and administrative
            officers who support eight JKBOTE diploma programmes. This page lists only verified
            public contacts — not unverified social-media profiles.
          </p>

          {/* Leadership */}
          <section aria-labelledby="faculty-leadership" data-motion-from="up">
            <h2
              id="faculty-leadership"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Institute leadership
            </h2>
            <article className="card-premium mt-5 overflow-hidden sm:flex sm:items-stretch">
              <div className="sm:w-[200px] sm:shrink-0">
                <img
                  src={FACULTY_LEADERSHIP.portrait}
                  alt={FACULTY_LEADERSHIP.portraitAlt}
                  width={400}
                  height={480}
                  className="aspect-[5/6] h-full w-full object-cover object-top sm:aspect-auto sm:min-h-[240px]"
                  loading="lazy"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                  Principal
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-navy">
                  {FACULTY_LEADERSHIP.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{FACULTY_LEADERSHIP.institute}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {FACULTY_LEADERSHIP.note}
                </p>
                <Link to="/principal-message" className="link-cta mt-5 w-fit">
                  Read Principal&apos;s message
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          </section>

          {/* Verified contacts */}
          <section aria-labelledby="faculty-verified" data-motion-from="up">
            <h2
              id="faculty-verified"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Verified faculty contacts
            </h2>
            <p className="mt-2 w-full text-sm text-muted-foreground">
              Published on the official JKBOTE admission intake list for Govt. Women Polytechnic,
              Bemina Srinagar.
            </p>
            <ul className="mt-5 grid gap-4">
              {FACULTY_VERIFIED.map((person) => (
                <li key={person.name} className="card-premium p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                        {person.department}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-bold text-navy">{person.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{person.designation}</p>
                      {person.phone ? (
                        <a
                          href={`tel:${person.phone.replace(/\s/g, "")}`}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-navy"
                        >
                          <Phone className="size-4" aria-hidden="true" />
                          {person.phone}
                        </a>
                      ) : null}
                      <p className="mt-3 text-xs text-muted-foreground">
                        Source: {person.source}
                        {person.sourceUrl ? (
                          <>
                            {" · "}
                            <a
                              href={person.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-brand hover:text-navy"
                            >
                              View JKBOTE list
                              <ExternalLink className="size-3" aria-hidden="true" />
                            </a>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <Link
                      to={departmentDetailPath(
                        FACULTY_DEPARTMENT_UNITS.find((u) => u.name === person.department)?.slug ??
                          "computer-engineering",
                      )}
                      className="btn-secondary inline-flex w-full shrink-0 sm:w-auto"
                    >
                      Programme page
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Role groups */}
          <section aria-labelledby="faculty-roles" data-motion-from="up">
            <h2
              id="faculty-roles"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              How the institute is staffed
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {FACULTY_ROLE_GROUPS.map((group) => (
                <li key={group.title} className="card-premium p-5">
                  <h3 className="font-display text-base font-bold text-navy">{group.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.body}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Departments */}
          <section aria-labelledby="faculty-departments" data-motion-from="up">
            <h2
              id="faculty-departments"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Faculty by diploma programme
            </h2>
            <p className="mt-2 w-full text-sm text-muted-foreground">{FACULTY_DIRECTORY_NOTE}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {FACULTY_DEPARTMENT_UNITS.map((unit) => (
                <li key={unit.slug} className="card-premium flex flex-col p-5">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                    {unit.stream}
                  </p>
                  <h3 className="mt-1 font-display text-base font-bold text-navy">{unit.name}</h3>
                  {unit.verifiedPeople.length > 0 ? (
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {unit.verifiedPeople.map((p) => (
                        <li key={p.name}>
                          <span className="font-medium text-navy">{p.name}</span>
                          <span> — {p.designation}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Named faculty listing for this programme will appear after official institute
                      confirmation.
                    </p>
                  )}
                  <Link to={departmentDetailPath(unit.slug)} className="link-cta mt-4 w-fit">
                    View programme
                    <ArrowRight className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Office */}
          <section aria-labelledby="faculty-office" className="card-premium p-5 sm:p-6" data-motion-from="up">
            <h2 id="faculty-office" className="font-display text-base font-bold text-navy">
              Institute office
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              For department queries, faculty correspondence or confirmation of staff details,
              contact the institute office.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-navy">
                <Phone className="size-4 shrink-0 text-brand" aria-hidden="true" />
                <a href={`tel:${INSTITUTE.phone.replace(/-/g, "")}`} className="hover:text-brand">
                  {INSTITUTE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-navy">
                <Mail className="size-4 shrink-0 text-brand" aria-hidden="true" />
                <a href={`mailto:${INSTITUTE.email}`} className="hover:text-brand">
                  {INSTITUTE.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary w-full sm:w-auto">
                Contact office
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/academics" className="btn-secondary w-full sm:w-auto">
                Diploma programmes
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
