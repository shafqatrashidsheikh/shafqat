export type QuickAction = {
  id: string;
  label: string;
  message: string;
};

export const WELCOME_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "admissions",
    label: "Admissions",
    message: "How do I apply for admission at GPW Srinagar?",
  },
  {
    id: "programs",
    label: "Courses & Programs",
    message: "What diploma courses and programs are available?",
  },
  {
    id: "eligibility",
    label: "Eligibility",
    message: "What is the eligibility for diploma admissions?",
  },
  {
    id: "notices",
    label: "Latest Notices",
    message: "What are the latest official JKBOTE notices for GPW Srinagar?",
  },
  {
    id: "syllabus",
    label: "Syllabus",
    message: "Give me the 1st semester Computer Engineering syllabus PDF",
  },
  {
    id: "campus",
    label: "Campus & Facilities",
    message: "What campus facilities are available at the college?",
  },
  {
    id: "exams",
    label: "Examinations",
    message: "Where can I find examination schedules and information?",
  },
  {
    id: "results",
    label: "Results",
    message: "6th semester result aya kya? Official JKBOTE notice batao.",
  },
  {
    id: "contact",
    label: "Contact & Location",
    message: "Where is the college located and how can I contact GPW Srinagar?",
  },
];

export function getContextualQuickActions(userMessage: string): QuickAction[] {
  const m = userMessage.toLowerCase();

  if (/(admission|apply|application|eligibility|fee|document|portal|date)/.test(m)) {
    return [
      {
        id: "eligibility",
        label: "Eligibility",
        message: "What is the eligibility for diploma admissions?",
      },
      {
        id: "process",
        label: "Application Process",
        message: "What is the admission application process?",
      },
      {
        id: "dates",
        label: "Important Dates",
        message: "What are the latest important admission dates from JKBOTE?",
      },
      {
        id: "portal",
        label: "Portal Status",
        message: "Is the JKBOTE online admission portal open right now?",
      },
    ];
  }

  if (/(result|gazette|re-?eval|marksheet|marks?\s*card|datesheet|date\s*sheet)/.test(m)) {
    return [
      {
        id: "sem6-result",
        label: "6th sem result",
        message: "6th semester result aya kya? Official JKBOTE notice batao.",
      },
      {
        id: "sem4-result",
        label: "4th sem result",
        message: "4th semester result aya? Date aur official notice link do.",
      },
      {
        id: "datesheet",
        label: "Date sheet",
        message: "Latest diploma datesheet JKBOTE pe aayi hai kya?",
      },
      {
        id: "exam-page",
        label: "Exam page",
        message: "Where can I find examination schedules and results?",
      },
    ];
  }

  if (/(notice|circular|news|jkbote|update)/.test(m)) {
    return [
      {
        id: "notices",
        label: "Latest Notices",
        message: "Summarise the latest official JKBOTE notices.",
      },
      {
        id: "exams",
        label: "Exam Notices",
        message: "Are there any recent examination or result notices?",
      },
      {
        id: "admissions-notices",
        label: "Admission Notices",
        message: "Are there recent admission-related JKBOTE notices?",
      },
    ];
  }

  if (/(campus|facilit|laborator|hostel|library|sport|workshop|roommate|vacant\s*bed)/.test(m)) {
    return [
      {
        id: "facilities",
        label: "Facilities",
        message: "What campus facilities are listed on the website?",
      },
      {
        id: "labs",
        label: "Laboratories",
        message: "What laboratories are available at GPW Srinagar?",
      },
      { id: "hostel", label: "Hostel", message: "Does GPW Srinagar have hostel facilities?" },
      {
        id: "hostel-rooms",
        label: "Hostel rooms",
        message: "Which hostel rooms and beds are vacant, and who are the roommates?",
      },
      {
        id: "hostel-rules",
        label: "Hostel rules",
        message: "What are the hostel rules at GPW Srinagar?",
      },
      { id: "library", label: "Library", message: "Tell me about the library at GPW Srinagar." },
    ];
  }

  if (/(program|course|department|academic|diploma|syllabus|curriculum|download)/.test(m)) {
    return [
      {
        id: "programs",
        label: "Programs",
        message: "List the diploma programs offered at GPW Srinagar.",
      },
      {
        id: "departments",
        label: "Departments",
        message: "What departments exist at GPW Srinagar?",
      },
      {
        id: "syllabus",
        label: "Syllabus PDF",
        message: "Give me the 1st semester Computer Engineering syllabus PDF",
      },
      {
        id: "downloads",
        label: "All semesters",
        message: "Give me all semester syllabus PDF links for diploma programmes",
      },
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
