import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, GraduationCap, Users } from "lucide-react";
import {
  COMPUTER_ENGINEERING_FACULTY_STAFF,
  FOOD_TECH_FACULTY_STAFF,
  GARMENT_FACULTY_STAFF,
  OMCA_FACULTY_STAFF,
  TEXTILE_FACULTY_STAFF,
  TRAVEL_TOURISM_FACULTY_STAFF,
} from "@/lib/department-faculty-data";
import { departmentDetailPath } from "@/lib/departments-data";

interface FacultyPreviewItem {
  name: string;
  designation: string;
  department: string;
  departmentSlug: string;
  experience?: string;
  specialization?: string;
  profileImage?: string;
}

const FEATURED_FACULTY: readonly FacultyPreviewItem[] = [
  {
    name: COMPUTER_ENGINEERING_FACULTY_STAFF.hod.name,
    designation: COMPUTER_ENGINEERING_FACULTY_STAFF.hod.designation,
    department: COMPUTER_ENGINEERING_FACULTY_STAFF.departmentName,
    departmentSlug: COMPUTER_ENGINEERING_FACULTY_STAFF.departmentSlug,
    experience: "7+ Years",
    specialization: "Operating Systems, Python, Networking & Software",
    profileImage: COMPUTER_ENGINEERING_FACULTY_STAFF.hod.profileImage,
  },
  {
    name: OMCA_FACULTY_STAFF.hod.name,
    designation: OMCA_FACULTY_STAFF.hod.designation,
    department: OMCA_FACULTY_STAFF.departmentName,
    departmentSlug: OMCA_FACULTY_STAFF.departmentSlug,
    experience: "22+ Years",
    specialization: "Stenography, Management & Modern Office Practices",
    profileImage: OMCA_FACULTY_STAFF.hod.profileImage,
  },
  {
    name: FOOD_TECH_FACULTY_STAFF.hod.name,
    designation: FOOD_TECH_FACULTY_STAFF.hod.designation,
    department: FOOD_TECH_FACULTY_STAFF.departmentName,
    departmentSlug: FOOD_TECH_FACULTY_STAFF.departmentSlug,
    experience: "Ph.D · 2+ Years",
    specialization: "Food Preservation, Quality Assurance & Processing",
    profileImage: FOOD_TECH_FACULTY_STAFF.hod.profileImage,
  },
  {
    name: GARMENT_FACULTY_STAFF.hod.name,
    designation: GARMENT_FACULTY_STAFF.hod.designation,
    department: GARMENT_FACULTY_STAFF.departmentName,
    departmentSlug: GARMENT_FACULTY_STAFF.departmentSlug,
    experience: "20+ Years",
    specialization: "Fashion Illustration, Pattern Making & Design",
    profileImage: GARMENT_FACULTY_STAFF.hod.profileImage,
  },
  {
    name: TEXTILE_FACULTY_STAFF.hod.name,
    designation: TEXTILE_FACULTY_STAFF.hod.designation,
    department: TEXTILE_FACULTY_STAFF.departmentName,
    departmentSlug: TEXTILE_FACULTY_STAFF.departmentSlug,
    experience: "Senior Faculty",
    specialization: "Weaving Mechanisms, Fabric Structure & Fibre Science",
    profileImage: TEXTILE_FACULTY_STAFF.hod.profileImage,
  },
  {
    name: TRAVEL_TOURISM_FACULTY_STAFF.hod.name,
    designation: TRAVEL_TOURISM_FACULTY_STAFF.hod.designation,
    department: TRAVEL_TOURISM_FACULTY_STAFF.departmentName,
    departmentSlug: TRAVEL_TOURISM_FACULTY_STAFF.departmentSlug,
    experience: "Senior Faculty",
    specialization: "Tour Operations, Travel Geography & Hospitality",
    profileImage: TRAVEL_TOURISM_FACULTY_STAFF.hod.profileImage,
  },
];

function getInitials(name: string): string {
  return (
    name
      .replace(/^(Er\.|Ms\.|Mr\.|Dr\.)\s*/i, "")
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "FC"
  );
}

export function HomeFacultyPreview() {
  return (
    <section className="section-misty section-y !pt-0">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-motion-from="up">
          <div className="max-w-2xl">
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              Academic Mentorship & Leadership
            </p>
            <h2 className="heading-section mt-3 font-display font-extrabold text-balance text-navy">
              Department Faculty & Staff
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Dedicated educators, demonstrators and industry practitioners guiding students across
              our JKBOTE diploma engineering and technical programmes.
            </p>
          </div>

          <Link
            to="/faculty"
            className="link-cta group shrink-0 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <span>View More</span>
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Faculty Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_FACULTY.map((member) => {
            const initials = getInitials(member.name);
            return (
              <article
                key={member.departmentSlug}
                className="card-premium group flex flex-col justify-between p-5 transition-[border-color,box-shadow] duration-300 hover:border-brand/35 hover:shadow-raised sm:p-6"
                data-motion-from="up"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center rounded-md bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand uppercase tracking-wider">
                      {member.department}
                    </span>
                    {member.experience ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        <Award className="size-3 text-brand" aria-hidden="true" />
                        {member.experience}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center gap-3.5">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.name}
                        width={44}
                        height={44}
                        className="size-11 shrink-0 rounded-xl object-cover border border-border"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-light-blue font-display text-sm font-extrabold text-brand"
                        aria-hidden="true"
                      >
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold text-navy truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-brand/90 truncate">
                        {member.designation}
                      </p>
                    </div>
                  </div>

                  {member.specialization ? (
                    <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      <span className="font-semibold text-navy/80">Specialisation: </span>
                      {member.specialization}
                    </p>
                  ) : null}
                </div>

                <div className="mt-5 pt-3 border-t border-border/70 flex items-center justify-between text-xs">
                  <Link
                    to={departmentDetailPath(member.departmentSlug)}
                    className="font-medium text-muted-foreground hover:text-brand transition-colors"
                  >
                    View Department
                  </Link>
                  <Link
                    to="/faculty"
                    className="inline-flex items-center gap-1 font-semibold text-brand hover:text-brand-deep transition-colors"
                  >
                    Full Profile
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Centered Explore More Action */}
        <div className="mt-8 flex justify-center" data-motion-from="up">
          <Link
            to="/faculty"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold shadow-xs"
          >
            <span>Explore More</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-soft" data-motion-from="up">
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Users className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-navy sm:text-base">
                Looking for the full faculty and staff roster?
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Browse all teaching lecturers, demonstrators, technical staff and HOD contact numbers by department.
              </p>
            </div>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2.5 shrink-0">
            <Link to="/faculty" className="btn-secondary w-full sm:w-auto text-xs sm:text-sm">
              <span>View More</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
