export const INSTITUTE = {
  name: "Government Polytechnic for Women, Srinagar",
  shortName: "GPW Srinagar",
  established: "1986",
  tagline: "Empowering Women Through Technical Education",
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
