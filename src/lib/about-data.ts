/**
 * About-page institutional profile — verified copy only.
 * Do not invent rankings, faculty counts, current placement %, or unverified awards.
 */

export const ABOUT_INTRO =
  "Established in 1986, Government Polytechnic for Women, Srinagar is a government technical institution dedicated to women’s technical education and skill development in Jammu & Kashmir.";

export type AboutTimelineItem = {
  label: string;
  title: string;
  body: string;
};

export const ABOUT_HISTORY_TIMELINE: AboutTimelineItem[] = [
  {
    label: "1986",
    title: "Foundation",
    body: "Government Polytechnic for Women, Srinagar established.",
  },
  {
    label: "Early years",
    title: "Women-focused technical education",
    body: "The institution began with women-focused technical and vocational programmes and developed as a dedicated technical institution.",
  },
  {
    label: "Institutional development",
    title: "Tech Edu-III",
    body: "Tech Edu-III, supported through a World Bank-assisted project, contributed to improvements in infrastructure, curriculum development, staff development, quality improvement and institutional networking.",
  },
  {
    label: "Today",
    title: "Eight diploma programmes",
    body: "The institute offers 8 three-year diploma programmes across engineering, technology, healthcare, food, textiles, garments, office applications and travel & tourism.",
  },
];

export type AboutAchievementItem = {
  /** Historical year or period label — show as “Historical record” where applicable */
  yearLabel: string;
  title: string;
  body: string;
  historical?: boolean;
};

export const ABOUT_ACHIEVEMENTS: AboutAchievementItem[] = [
  {
    yearLabel: "2005",
    title: "Best Polytechnic Award",
    body: "Best Polytechnic Award recorded in institutional profile material.",
    historical: true,
  },
  {
    yearLabel: "2011",
    title: "Best Polytechnic Award",
    body: "Best Polytechnic Award recorded in institutional profile material.",
    historical: true,
  },
  {
    yearLabel: "Historical record",
    title: "Outstanding polytechnic — North India",
    body: "Recognised in institutional profile material as having been adjudged an outstanding polytechnic in North India by NITTTR Chandigarh.",
    historical: true,
  },
  {
    yearLabel: "Historical record",
    title: "Institutional Student Management System (i-SMS)",
    body: "Launched as the first polytechnic in the Union Territory of J&K to establish this system.",
    historical: true,
  },
  {
    yearLabel: "Historical record",
    title: "Garment Technology incubation centre",
    body: "Established to support pass-out students and entrepreneurship.",
    historical: true,
  },
  {
    yearLabel: "2022",
    title: "Mega Placement Drive",
    body: "2,500 candidates registered, 932 shortlisted, around 50 on-the-spot offers, with 25 companies/industries participating in placement and counselling. These figures are from the 2022 drive and are not current placement statistics.",
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
    body: "Government Polytechnic for Women, Bemina hosted a three-day Mission YUVA technical training programme involving 230+ participants from across Kashmir Division.",
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
    body: "Focused on practical training, internships, mentorship and industry exposure for Travel & Tourism students.",
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
