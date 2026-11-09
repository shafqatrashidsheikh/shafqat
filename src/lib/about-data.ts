/**
 * About-page institutional profile — verified copy only.
 * Do not invent rankings, faculty counts, current placement %, or unverified awards.
 */

export const ABOUT_INTRO =
  "Established in 1986, Government Polytechnic for Women, Srinagar is a government technical institution dedicated to women’s technical education and skill development in Jammu & Kashmir.";

export const ABOUT_HISTORY_INTRO =
  "Established in 1986, Government Polytechnic for Women, Srinagar stands as a pioneering institution in Jammu & Kashmir, dedicated to advancing women’s technical education, practical competence, and socioeconomic empowerment.";

export type AboutTimelineItem = {
  label: string;
  title: string;
  body: string;
};

export const ABOUT_HISTORY_TIMELINE: AboutTimelineItem[] = [
  {
    label: "1986",
    title: "Foundation & Pioneer Establishment",
    body: "Government Polytechnic for Women, Srinagar was established in 1986 at Bemina, Srinagar, as the first dedicated government technical institute in Jammu & Kashmir exclusively for women, aimed at fostering technical competence and self-reliance.",
  },
  {
    label: "Early years",
    title: "Women-Focused Technical Education",
    body: "The institution commenced with specialized diploma and technician programmes designed to introduce women to emerging engineering and applied vocational fields, supported by dedicated laboratories and workshops.",
  },
  {
    label: "Institutional growth",
    title: "World Bank Assisted Tech Edu-III Project",
    body: "Under the World Bank-assisted Technical Education Project (Tech Edu-III), the polytechnic underwent major institutional strengthening, modernizing laboratories, updating curricula, enhancing staff development, and upgrading institutional networking.",
  },
  {
    label: "Milestones & recognition",
    title: "Regional Recognition & Modernization",
    body: "The institute was twice honoured with the prestigious Best Polytechnic Award by NITTTR Chandigarh (in 2005 and 2013) for excellence in North India, and became the first polytechnic in the Union Territory of J&K to establish the Institutional Student Management System (i-SMS).",
  },
  {
    label: "Today",
    title: "Eight Diploma Programmes & Innovation",
    body: "Today, GPW Srinagar offers 8 three-year AICTE-approved diploma programmes across engineering, healthcare, applied sciences, design, and management, complemented by an active incubation centre and strategic industry partnerships.",
  },
];

export const ABOUT_MISSION_INTRO =
  "To provide high-quality, need-based technical education, practical skills, and holistic professional development that prepare women for leadership, career excellence, and lifelong learning.";

export const ABOUT_MISSION_ITEMS: AboutTimelineItem[] = [
  {
    label: "Quality education",
    title: "Need-Based Technical Education",
    body: "Delivering flexible, industry-relevant technician and diploma education rooted in academic rigor, modern curricula, and continuous educational quality improvement.",
  },
  {
    label: "Practical mastery",
    title: "Hands-On Practical & Laboratory Skills",
    body: "Emphasizing intensive practical training, workshop practice, and laboratory workflows across modern facilities to ensure students acquire real-world technical competence.",
  },
  {
    label: "Industry readiness",
    title: "Industry-Institute Linkages & Exposure",
    body: "Fostering active collaborations with industrial, technical, and healthcare partners through internships, industrial visits, expert lectures, and guided mentoring.",
  },
  {
    label: "Holistic growth",
    title: "Professional Ethics & Career Development",
    body: "Nurturing discipline, professional ethics, communication skills, and self-confidence, preparing women graduates for successful careers, entrepreneurship, and higher education.",
  },
];

export const ABOUT_VISION_INTRO =
  "To empower women through transformative technical education, innovation, and career opportunities, nurturing confident professionals who contribute meaningfully to industry, society, and the nation.";

export const ABOUT_VISION_ITEMS: AboutTimelineItem[] = [
  {
    label: "Women empowerment",
    title: "Empowering Women Through Technology",
    body: "Nurturing empowered, self-reliant women professionals by expanding access to high-caliber technical education and breaking gender barriers in engineering and technology.",
  },
  {
    label: "Innovation & inquiry",
    title: "Fostering Innovation & Creative Thinking",
    body: "Cultivating an inspiring academic environment that encourages creativity, critical inquiry, digital literacy, and practical problem-solving to meet modern technological challenges.",
  },
  {
    label: "Career pathways",
    title: "Pathways to Professional Leadership",
    body: "Opening robust pathways for sustainable employment, technical entrepreneurship, and lifelong career growth, enabling women to lead and excel in diverse technological fields.",
  },
];

export type AboutAchievementItem = {
  /** Year when verified; empty when only “Historical record” is known */
  yearLabel: string;
  title: string;
  body: string;
  historical?: boolean;
};

export const ABOUT_ACHIEVEMENTS: AboutAchievementItem[] = [
  {
    yearLabel: "2005",
    title: "Best Polytechnic Award",
    body: "Recorded in institutional profile material as Best Polytechnic Award.",
    historical: true,
  },
  {
    yearLabel: "2011",
    title: "Best Polytechnic Award",
    body: "Recorded in institutional profile material as Best Polytechnic Award.",
    historical: true,
  },
  {
    yearLabel: "",
    title: "Outstanding polytechnic, North India",
    body: "Institutional profile material records recognition by NITTTR\u00A0Chandigarh as an outstanding polytechnic in North\u00A0India.",
    historical: true,
  },
  {
    yearLabel: "",
    title: "Institutional Student Management System (i-SMS)",
    body: "Launched as the first polytechnic in the Union Territory of J&K to establish the Institutional Student Management System (i-SMS).",
    historical: true,
  },
  {
    yearLabel: "",
    title: "Garment Technology incubation centre",
    body: "Garment Technology incubation centre established to support pass-out students and entrepreneurship.",
    historical: true,
  },
  {
    yearLabel: "2022",
    title: "Mega Placement Drive",
    body: "In the 2022 Mega Placement Drive, 2,500 candidates registered, 932 were shortlisted, and around 50 on-the-spot offers were made, with 25 companies and industries in placement and counselling. These are 2022 figures, not current placement statistics.",
    historical: true,
  },
];

export type AboutEngagementItem = {
  yearLabel: string;
  title: string;
  body: string;
};

export const ABOUT_ENGAGEMENT: AboutEngagementItem[] = [
  {
    yearLabel: "2025",
    title: "Mission YUVA technical training",
    body: "Government Polytechnic for Women, Bemina hosted a three-day Mission\u00A0YUVA technical training programme involving 230+ participants from across Kashmir\u00A0Division.",
  },
  {
    yearLabel: "2026",
    title: "Industry MoUs — travel & hospitality partners",
    body: "MoUs with Travel Agents Association of India, Radisson Hotels and Ecotourism Association of Kashmir to strengthen internships, industrial training, field visits, mentoring and experiential learning.",
  },
  {
    yearLabel: "2026",
    title: "MoU with Sagg Eco Village Kashmir",
    body: "Focused on eco-tourism, hospitality, sustainable tourism skills and rural entrepreneurship.",
  },
  {
    yearLabel: "2026",
    title: "MoU with J&K Hoteliers Club",
    body: "Focused on practical training, internships, mentorship and industry exposure for Travel\u00A0&\u00A0Tourism students.",
  },
];

/** Snapshot figures aligned with existing site STATS / admissions intake. */
export const ABOUT_GLANCE_STATS = [
  { value: 1986, label: "Established", prefix: "", suffix: "" },
  { value: 8, label: "Diploma Programmes", prefix: "", suffix: "" },
  { value: 240, label: "Current Intake", prefix: "", suffix: " seats" },
  { value: 3, label: "Programme Duration", prefix: "", suffix: " years" },
  { value: "Government", label: "Institution Type", prefix: "", suffix: "" },
  { value: "Bemina, Srinagar, J&K", label: "Location", prefix: "", suffix: "" },
] as const;

export const ABOUT_PURPOSE =
  "Need-based and employment-oriented technical education, women’s empowerment through technical skills, entrepreneurship, industry interaction, continuing education and practical skill development.";
