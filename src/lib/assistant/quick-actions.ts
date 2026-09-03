export type QuickAction = {
  id: string;
  label: string;
  message: string;
};

export const WELCOME_QUICK_ACTIONS: QuickAction[] = [
  { id: "admissions", label: "Admissions", message: "How do I apply for admission at GPW Srinagar?" },
  { id: "programs", label: "Courses & Programs", message: "What diploma courses and programs are available?" },
  { id: "eligibility", label: "Eligibility", message: "What is the eligibility for diploma admissions?" },
  { id: "campus", label: "Campus & Facilities", message: "What campus facilities are available at the college?" },
  { id: "exams", label: "Examinations", message: "Where can I find examination schedules and information?" },
  { id: "results", label: "Results", message: "Where are examination results published?" },
  { id: "contact", label: "Contact & Location", message: "Where is the college located and how can I contact GPW Srinagar?" },
  { id: "placements", label: "Placements", message: "What placement and career support does the institute provide?" },
];

export function getContextualQuickActions(userMessage: string): QuickAction[] {
  const m = userMessage.toLowerCase();

  if (/(admission|apply|application|eligibility|fee|document)/.test(m)) {
    return [
      { id: "eligibility", label: "Eligibility", message: "What is the eligibility for diploma admissions?" },
      { id: "process", label: "Application Process", message: "What is the admission application process?" },
      { id: "dates", label: "Important Dates", message: "Where can I find important admission dates?" },
      { id: "admissions-page", label: "Open Admissions", message: "What information is on the Admissions page?" },
    ];
  }

  if (/(campus|facilit|laborator|hostel|library|sport|workshop)/.test(m)) {
    return [
      { id: "facilities", label: "Facilities", message: "What campus facilities are listed on the website?" },
      { id: "labs", label: "Laboratories", message: "What laboratories are available at GPW Srinagar?" },
      { id: "hostel", label: "Hostel", message: "Does GPW Srinagar have hostel facilities?" },
      { id: "library", label: "Library", message: "Tell me about the library at GPW Srinagar." },
    ];
  }

  if (/(program|course|department|academic|diploma|syllabus|curriculum)/.test(m)) {
    return [
      { id: "programs", label: "Programs", message: "List the diploma programs offered at GPW Srinagar." },
      { id: "departments", label: "Departments", message: "What departments exist at GPW Srinagar?" },
      { id: "exams", label: "Examinations", message: "Where can I find examination information?" },
      { id: "results", label: "Results", message: "Where are results published?" },
    ];
  }

  if (/(contact|location|address|phone|email|map|bemina)/.test(m)) {
    return [
      { id: "location", label: "Location", message: "Where is GPW Srinagar located?" },
      { id: "contact-page", label: "Contact College", message: "How can I contact GPW Srinagar?" },
    ];
  }

  return [];
}
