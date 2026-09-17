export type DbProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "editor" | "principal" | "hod" | "staff" | "student";
  department_id: string | null;
  roll_number: string | null;
  phone: string | null;
  approval_status: "n/a" | "pending_profile" | "pending_review" | "approved" | "rejected";
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbDepartment = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  head_name: string | null;
  overview?: string;
  category_label?: string;
  duration?: string;
  eligibility?: string;
  program_type?: string;
  stream?: string;
  icon?: string;
  has_departmental_labs?: boolean;
  career_areas?: string[];
  image_asset_key?: string | null;
  image_alt?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbNavLink = {
  id: string;
  link_group: string;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
};

export type DbHeaderNavGroup = {
  id: string;
  label: string;
  to_path: string;
  sort_order: number;
  is_active: boolean;
};

export type DbHeaderNavItem = {
  id: string;
  group_id: string;
  label: string;
  to_path: string;
  is_primary: boolean;
  coming_soon: boolean;
  sort_order: number;
  is_active: boolean;
};

export type DbAboutBlock = {
  block_key: string;
  title: string;
  body: string;
  image_asset_key: string | null;
  sort_order: number;
  is_active: boolean;
};

export type DbPrincipalProfile = {
  id: string;
  name: string;
  role: string;
  institute: string;
  portrait_asset_key: string | null;
  portrait_alt: string;
  preview: string;
  message_paragraphs: string[];
  is_published: boolean;
};

export type DbCampusGalleryItem = {
  id: string;
  image_asset_key: string;
  alt: string;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_active: boolean;
};

export type DbCampusFacilityItem = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

export type InstituteSettings = {
  name: string;
  shortName: string;
  brandMark: string;
  established: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  mapLink: string;
};

export type DbProgram = {
  id: string;
  department_id: string | null;
  name: string;
  dept_label: string;
  duration: string;
  eligibility: string;
  seats: string;
  stream: string;
  overview: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbNotice = {
  id: string;
  title: string;
  category: string;
  tag: string;
  published_at: string;
  priority: "Urgent" | "Important" | "General" | "New";
  file_label: string | null;
  file_url: string | null;
  is_pinned: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DbEvent = {
  id: string;
  title: string;
  event_date: string;
  venue: string;
  description: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DbStat = {
  id: string;
  value: number;
  label: string;
  prefix: string;
  suffix: string;
  sort_order: number;
  is_active: boolean;
};

export type DbSpotlight = {
  id: string;
  title: string;
  subtitle: string;
  link_path: string;
  sort_order: number;
  is_active: boolean;
};

export type DbAcademicUnit = {
  id: string;
  title: string;
  subtitle: string;
  link_path: string;
  sort_order: number;
  is_active: boolean;
};

export type DbHomeFaq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

export type DbPageSection = {
  section_key: string;
  eyebrow: string | null;
  title: string;
  body: string;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at?: string;
};

export type DbExploreCard = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image_key: string;
  image_alt: string;
  image_position: "left" | "right";
  sort_order: number;
  is_active: boolean;
  is_priority: boolean;
};

export type DbMediaAsset = {
  id: string;
  asset_key: string | null;
  storage_bucket: string;
  storage_path: string;
  public_url: string;
  original_filename: string;
  mime_type: string;
  media_kind: "image" | "video" | "pdf" | "other";
  folder: string;
  title: string;
  alt_text: string;
  byte_size: number | null;
  tags: string[];
  uploaded_by: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PageSectionsMap = Record<string, DbPageSection>;

export type DbAdmissionCycle = {
  id: string;
  year: number;
  title: string;
  intro: string;
  strip_text: string;
  apply_url: string;
  apply_label: string;
  fee_amount: string;
  fee_note: string;
  notice_url: string;
  notice_label: string;
  eligibility_intro: string;
  eligibility_note: string;
  documents_note: string;
  programmes_note: string;
  assistant_title: string;
  assistant_body: string;
  assistant_label: string;
  is_active: boolean;
};

export type DbAdmissionStep = {
  id: string;
  cycle_id: string;
  step_number: number;
  title: string;
  description: string;
  sort_order: number;
};

export type DbAdmissionDocument = {
  id: string;
  cycle_id: string;
  label: string;
  detail: string;
  sort_order: number;
};

export type DbAdmissionDate = {
  id: string;
  cycle_id: string;
  label: string;
  date_value: string;
  sort_order: number;
};

export type DbAdmissionFaq = {
  id: string;
  cycle_id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type DbAdmissionProgramme = {
  id: string;
  cycle_id: string;
  name: string;
  credential: string;
  duration: string;
  seats: number;
  category: string;
  slug: string;
  badge: string;
  badge_note: string;
  sort_order: number;
  is_active: boolean;
};

export type DbAdmissionEligibilityGroup = {
  id: string;
  cycle_id: string;
  heading: string;
  body: string;
  sort_order: number;
};

export type HomepageData = {
  announcements: { tag: string; date: string; title: string; id?: string }[];
  events: { title: string; date: string; place: string; id?: string }[];
  stats: { value: number; label: string; prefix?: string; suffix?: string; id?: string }[];
  spotlights: { title: string; subtitle: string; to: string; id?: string }[];
  academicUnits: { title: string; subtitle: string; to: string; id?: string }[];
  faqs: { q: string; a: string; id?: string }[];
  programs: {
    name: string;
    dept: string;
    duration: string;
    eligibility: string;
    seats: string;
    stream: string;
    overview: string;
    id?: string;
  }[];
  sections: PageSectionsMap;
  exploreCards: {
    id: string;
    category: string;
    title: string;
    description: string;
    cta: string;
    href: string;
    image: string;
    imageAlt: string;
    imagePosition: "left" | "right";
    imageObjectClass?: string | undefined;
    priority?: boolean | undefined;
  }[];
  source: "supabase" | "static";
};

export type AdmissionsData = {
  cycle: DbAdmissionCycle | null;
  steps: DbAdmissionStep[];
  documents: DbAdmissionDocument[];
  dates: DbAdmissionDate[];
  faqs: DbAdmissionFaq[];
  programmes: DbAdmissionProgramme[];
  eligibilityGroups: DbAdmissionEligibilityGroup[];
  source: "supabase" | "static";
};
