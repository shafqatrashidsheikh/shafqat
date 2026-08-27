export const INSTITUTE = {
  name: "Government Polytechnic for Women, Srinagar",
  shortName: "GPW Srinagar",
  established: "1986",
  tagline:
    "Empowering women through quality technical education, practical learning and career-focused skills.",
  address: "Government Polytechnic for Women, Srinagar, Jammu & Kashmir — [ADD OFFICIAL ADDRESS]",
  phone: "[ADD OFFICIAL PHONE]",
  email: "[ADD OFFICIAL EMAIL]",
};

export type NavItem = { label: string; to: string; children?: { label: string; to: string }[] };

export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    to: "/about",
    children: [
      { label: "About the Institute", to: "/about" },
      { label: "Vision & Mission", to: "/about" },
      { label: "Principal's Message", to: "/about" },
      { label: "Administration", to: "/about" },
    ],
  },
  {
    label: "Academics",
    to: "/academics",
    children: [
      { label: "Programs / Courses", to: "/academics" },
      { label: "Departments", to: "/academics" },
      { label: "Laboratories", to: "/campus" },
      { label: "Examination", to: "/notices" },
    ],
  },
  {
    label: "Admissions",
    to: "/admissions",
    children: [
      { label: "Admission Overview", to: "/admissions" },
      { label: "Eligibility", to: "/admissions" },
      { label: "Fee Structure", to: "/admissions" },
      { label: "Admission Notices", to: "/notices" },
    ],
  },
  { label: "Placements", to: "/placements" },
  { label: "Campus", to: "/campus" },
  { label: "Notices", to: "/notices" },
  { label: "Contact", to: "/contact" },
];

export const UTILITY_LINKS = [
  { label: "Admissions", to: "/admissions" },
  { label: "Notices", to: "/notices" },
  { label: "Examination", to: "/notices" },
  { label: "Results", to: "/notices" },
  { label: "Contact", to: "/contact" },
];

/** Quick access links — homepage announcements & footer */
export const UTILITY_STRIP = [
  { label: "Notices", to: "/notices" },
  { label: "Examination", to: "/notices" },
  { label: "Results", to: "/notices" },
  { label: "Tenders", to: "/notices" },
  { label: "Contact", to: "/contact" },
];

/** Hero discovery panels — inspired by IITD Research / News / Startups spotlights */
export const INSTITUTE_SPOTLIGHTS = [
  {
    title: "Admissions",
    subtitle: "Pathways to join GPW Srinagar",
    to: "/admissions",
  },
  {
    title: "Academics",
    subtitle: "Diploma programs & departments",
    to: "/academics",
  },
  {
    title: "Campus",
    subtitle: "Labs, workshops & student life",
    to: "/campus",
  },
  {
    title: "Updates",
    subtitle: "Notices, exams & announcements",
    to: "/notices",
  },
] as const;

/** Academic unit tiles — IITD Academic Units pattern */
export const ACADEMIC_UNITS = [
  { title: "Departments", subtitle: "Specialized teaching units", to: "/academics" },
  { title: "Programs", subtitle: "Three-year diploma courses", to: "/academics" },
  { title: "Laboratories", subtitle: "Hands-on technical practice", to: "/campus" },
  { title: "Facilities", subtitle: "Library, workshop & campus", to: "/campus" },
] as const;

export const CAMPUS_EVENTS = [
  {
    title: "Orientation for new diploma entrants",
    date: "August 2026",
    place: "Main Auditorium",
  },
  {
    title: "Technical workshop series — Electronics & Computing",
    date: "September 2026",
    place: "Department Labs",
  },
  {
    title: "Industry interaction & career guidance session",
    date: "October 2026",
    place: "Seminar Hall",
  },
] as const;

export const HOME_FAQS = [
  {
    q: "Who can apply for diploma programs?",
    a: "Women candidates who meet the eligibility published in the official admission notification for each program.",
  },
  {
    q: "What is the duration of diploma courses?",
    a: "Most diploma programs are three-year full-time courses combining classroom instruction with laboratory practice.",
  },
  {
    q: "Where can I find examination and result notices?",
    a: "All examination schedules, results and circulars are published on the Notices page as they are released by the institute.",
  },
  {
    q: "How do I contact the institute for admissions queries?",
    a: "Use the Contact page for official phone and email channels, or visit the Admissions page for process details.",
  },
] as const;

export type HeaderCtaPill = {
  label: string;
  /** Parent landing page — click navigates here */
  to: string;
  items: { label: string; to: string; primary?: boolean }[];
};

/** Pill CTA buttons in the header — each opens a dropdown of action links */
export const HEADER_CTA_PILLS: HeaderCtaPill[] = [
  {
    label: "Admissions",
    to: "/admissions",
    items: [
      { label: "Admission Information", to: "/admissions", primary: true },
      { label: "Eligibility", to: "/admissions" },
      { label: "Application Process", to: "/admissions" },
      { label: "Important Dates", to: "/admissions" },
      { label: "Documents", to: "/admissions" },
      { label: "Fees", to: "/admissions" },
    ],
  },
  {
    label: "Academics",
    to: "/academics",
    items: [
      { label: "Programs / Courses", to: "/academics", primary: true },
      { label: "Departments", to: "/academics" },
      { label: "Examination", to: "/notices" },
      { label: "Results", to: "/notices" },
    ],
  },
  {
    label: "Campus",
    to: "/campus",
    items: [
      { label: "360° Campus", to: "/campus", primary: true },
      { label: "Facilities", to: "/campus" },
      { label: "Laboratories", to: "/campus" },
      { label: "Workshops", to: "/campus" },
      { label: "Library", to: "/campus" },
      { label: "Student Life", to: "/campus" },
    ],
  },
  {
    label: "Updates",
    to: "/notices",
    items: [
      { label: "Notices", to: "/notices", primary: true },
      { label: "Announcements", to: "/notices" },
      { label: "Events", to: "/notices" },
      { label: "Examination Updates", to: "/notices" },
    ],
  },
];

export const ANNOUNCEMENTS = [
  { tag: "Admission", date: "12 Aug 2026", title: "Diploma admissions 2026 — counselling schedule published" },
  { tag: "Examination", date: "05 Aug 2026", title: "Odd semester practical examination date sheet" },
  { tag: "Tender", date: "29 Jul 2026", title: "Tender notice for laboratory equipment procurement" },
  { tag: "Circular", date: "21 Jul 2026", title: "Anti-ragging committee constitution and helpline" },
];

export const STATS = [
  { value: 1986, label: "Established", prefix: "", suffix: "" },
  { value: 6, label: "Diploma Programs", suffix: "+" },
  { value: 6, label: "Departments", suffix: "" },
  { value: 20, label: "Laboratories", suffix: "+" },
];

export const PROGRAMS = [
  {
    name: "Computer Engineering",
    dept: "Computer Engineering",
    duration: "3 Years",
    eligibility: "10th pass with Science & Mathematics",
    seats: "[ADD INTAKE]",
    stream: "Technology",
    overview:
      "Programming, data structures, web technologies, networking and modern software practice with strong laboratory work.",
  },
  {
    name: "Electronics & Communication",
    dept: "Electronics Engineering",
    duration: "3 Years",
    eligibility: "10th pass with Science & Mathematics",
    seats: "[ADD INTAKE]",
    stream: "Engineering",
    overview:
      "Analog and digital electronics, embedded systems, communication systems and instrumentation practice.",
  },
  {
    name: "Electrical Engineering",
    dept: "Electrical Engineering",
    duration: "3 Years",
    eligibility: "10th pass with Science & Mathematics",
    seats: "[ADD INTAKE]",
    stream: "Engineering",
    overview:
      "Machines, power systems, control, electrical workshop practice and industrial safety fundamentals.",
  },
  {
    name: "Civil Engineering",
    dept: "Civil Engineering",
    duration: "3 Years",
    eligibility: "10th pass with Science & Mathematics",
    seats: "[ADD INTAKE]",
    stream: "Engineering",
    overview:
      "Surveying, structures, construction materials, estimation and computer-aided civil drafting.",
  },
  {
    name: "Architecture Assistantship",
    dept: "Architecture",
    duration: "3 Years",
    eligibility: "10th pass",
    seats: "[ADD INTAKE]",
    stream: "Technology",
    overview:
      "Architectural drawing, design studio, building services and digital documentation workflows.",
  },
  {
    name: "Applied Sciences & Humanities",
    dept: "Applied Sciences",
    duration: "Supporting Department",
    eligibility: "—",
    seats: "—",
    stream: "Applied Sciences",
    overview:
      "Foundation courses in physics, chemistry, mathematics and communication skills across all programs.",
  },
];

export const WHY_US = [
  { title: "Women-Centered Technical Education", body: "A campus designed entirely around the learning, safety and ambition of women in engineering." },
  { title: "Practical Laboratory Learning", body: "Hands-on workshop and laboratory hours built into every semester of every diploma program." },
  { title: "Experienced Faculty", body: "Departmental faculty and instructors supporting students through structured academic mentoring." },
  { title: "Career & Placement Support", body: "Training & Placement Cell coordinating skill sessions, internships and recruitment drives." },
  { title: "Innovation & Entrepreneurship", body: "Student projects, technical clubs and idea-to-prototype support through the innovation cell." },
  { title: "Safe & Inclusive Campus", body: "Anti-ragging cell, internal complaints committee and grievance redressal with clear escalation." },
];

export const QUICK_LINKS = [
  "Admissions", "Notices", "Examination", "Results", "Academic Calendar",
  "Downloads", "Student Portal", "Faculty Portal", "Grievance",
  "Anti-Ragging", "Scholarship", "Contact",
];

export const AUDIENCES = [
  { who: "Prospective Student", items: ["Courses", "Eligibility", "Admission", "Fee", "Hostel", "Placement"] },
  { who: "Current Student", items: ["Notices", "Examination", "Results", "Timetable", "Downloads", "Grievance"] },
  { who: "Parent", items: ["About", "Safety & Support", "Fee Structure", "Placement", "Contact", "Campus"] },
  { who: "Faculty / Alumni", items: ["Staff Login", "Circulars", "Departments", "Events", "Alumni Network", "Contact"] },
];
