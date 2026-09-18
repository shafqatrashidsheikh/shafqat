import type { VoOfficerId, VoParsedCommand } from "@/lib/virtual-office/types";

const DEPT_ALIASES: Array<{ query: string; keys: string[] }> = [
  { query: "computer engineering", keys: ["computer engineering", "computer", "cse", "ce"] },
  {
    query: "electronics & communication engineering",
    keys: ["electronics", "ece", "electronics & communication", "electronics and communication"],
  },
  { query: "textile technology", keys: ["textile"] },
  { query: "medical lab technology", keys: ["medical lab", "mlt", "medical laboratory"] },
  {
    query: "office management & computer applications",
    keys: ["office management", "omca", "om & ca"],
  },
  { query: "food technology", keys: ["food technology", "food tech", "food"] },
  { query: "garment technology", keys: ["garment"] },
  { query: "travel & tourism", keys: ["travel", "tourism", "travel & tourism"] },
];

function extractSemester(text: string): number | undefined {
  const m =
    text.match(/\bsem(?:ester)?\s*(?:[-.]?\s*)?([1-6])\b/i) ||
    text.match(/\bsemester\s*([1-6])\b/i) ||
    text.match(/\b([1-6])\s*(?:st|nd|rd|th)?\s*sem(?:ester)?\b/i);
  if (!m) return undefined;
  const n = Number(m[1]);
  return n >= 1 && n <= 6 ? n : undefined;
}

function extractDepartment(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const entry of DEPT_ALIASES) {
    for (const key of entry.keys) {
      if (lower.includes(key)) return entry.query;
    }
  }
  return undefined;
}

function extractSubject(text: string): string | undefined {
  const patterns = [
    /(?:subject|sub)\s+([a-z0-9][a-z0-9 &\-/]{1,60}?)(?:\s+(?:ki|ke|ka|ki\s+attendance|ke\s+marks|attendance|marks|upload)|\s*[:：]|$)/i,
    /(?:subject|sub)\s+([a-z][a-z0-9 &\-/]{1,40})\s+(?:ki|ke|ka)\b/i,
    /(?:data structures|dbms|os|operating systems?|networks?|mathematics|physics|chemistry|english)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const raw = (m[1] ?? m[0]).trim();
      if (raw.length >= 2) return raw.replace(/\s+/g, " ");
    }
  }
  return undefined;
}

function extractDataBlock(text: string): string | undefined {
  const m =
    text.match(/(?:ye\s+hai|ye\s+hain|data\s*:|marks\s*:|attendance\s*:)\s*([\s\S]+)$/i) ||
    text.match(/:\s*([\s\S]{3,})$/);
  if (!m?.[1]) return undefined;
  const block = m[1].trim();
  return block.length >= 3 ? block : undefined;
}

function extractQuotedOrAfterUpdate(text: string): string | undefined {
  const q = text.match(/["“]([^"”]+)["”]/);
  if (q?.[1]) return q[1].trim();
  const m = text.match(
    /(?:update\s+karo|change\s+karo|set\s+karo|likho|to)\s*[:：]?\s*(.+)$/i,
  );
  if (!m?.[1]) return undefined;
  return m[1].trim();
}

function hasAny(text: string, patterns: RegExp[]) {
  return patterns.some((p) => p.test(text));
}

/**
 * Deterministic Hinglish/English router for Virtual College Office commands.
 * Ambiguous cases return clarify — never invents department/semester/subject.
 */
export function parseVirtualOfficeCommand(raw: string): VoParsedCommand {
  const text = raw.trim().replace(/\s+/g, " ");
  if (!text) {
    return {
      officer: null,
      intent: "unknown",
      confidence: "low",
      summary: "Empty command",
      clarification: "Please type or speak a command.",
    };
  }

  const lower = text.toLowerCase();
  const semester = extractSemester(lower);
  const departmentQuery = extractDepartment(lower);
  const subjectQuery = extractSubject(text);
  const rawDataBlock = extractDataBlock(text);

  // --- Student Approval ---
  if (
    hasAny(lower, [
      /pending\s+student/,
      /student\s+application/,
      /approval\s+queue/,
      /pending\s+approvals?/,
      /applications?\s+dikhao/,
      /approve\s+list/,
      /student\s+approval/,
    ])
  ) {
    let statusFilter: VoParsedCommand["statusFilter"] = "pending";
    if (/rejected/.test(lower) || /reject/.test(lower) && /list|dikhao|show/.test(lower)) {
      statusFilter = "rejected";
    } else if (/approved/.test(lower) && /list|dikhao|show|queue/.test(lower)) {
      statusFilter = "approved";
    }
    return {
      officer: "student_approval",
      intent: "list_approvals_by_status",
      confidence: "high",
      statusFilter,
      summary: `Show ${statusFilter} student applications`,
    };
  }

  if (/approve/.test(lower) && /student|application|roll/.test(lower)) {
    return {
      officer: "student_approval",
      intent: "approve_student",
      confidence: "medium",
      summary: "Approve a student application (open queue to select)",
      clarification: "Open Student Approval Officer and select the student to approve.",
    };
  }

  if (/reject/.test(lower) && /student|application/.test(lower)) {
    return {
      officer: "student_approval",
      intent: "reject_student",
      confidence: "medium",
      summary: "Reject a student application (open queue to select)",
      clarification: "Open Student Approval Officer and select the student with a reason.",
    };
  }

  // --- Academic Data ---
  const wantsAttendance = /attendance|hazri|haazri/.test(lower);
  const wantsMarks = /\bmarks\b|\bresult\b|internal|external|score/.test(lower);
  const wantsUpload = /upload|daal|dal\s*do|save|submit|update\s+karo|bharo/.test(lower);
  const wantsSummary =
    /summary|dikhao|show|list|percentage|%|below\s*75|detention|top\s*perform/.test(lower);

  if (wantsAttendance && wantsUpload) {
    if (!departmentQuery || !semester) {
      return {
        officer: "academic_data",
        intent: "clarify",
        confidence: "low",
        departmentQuery,
        semester,
        subjectQuery,
        rawDataBlock,
        summary: "Attendance upload needs department and semester",
        clarification:
          "Please specify department and semester, e.g. “Computer Engineering semester 2 ki attendance upload karo. Subject Data Structures: roll1 present, roll2 absent”.",
      };
    }
    if (!subjectQuery && !rawDataBlock) {
      return {
        officer: "academic_data",
        intent: "clarify",
        confidence: "medium",
        departmentQuery,
        semester,
        summary: "Need subject and attendance data",
        clarification:
          "Specify the subject and attendance lines (roll number + present/absent or P/A).",
      };
    }
    return {
      officer: "academic_data",
      intent: "upload_attendance",
      confidence: subjectQuery && rawDataBlock ? "high" : "medium",
      departmentQuery,
      semester,
      subjectQuery,
      rawDataBlock,
      summary: `Upload attendance for ${departmentQuery} semester ${semester}${subjectQuery ? ` / ${subjectQuery}` : ""}`,
      clarification:
        !subjectQuery || !rawDataBlock
          ? "Confirm subject name and paste attendance rows (roll + present/absent)."
          : undefined,
    };
  }

  if (wantsMarks && wantsUpload && !/email|notify|bhejo|send/.test(lower)) {
    const examType = /external/.test(lower)
      ? "external"
      : /practical/.test(lower)
        ? "practical"
        : /assignment/.test(lower)
          ? "assignment"
          : "internal";
    if (!departmentQuery || !semester) {
      return {
        officer: "academic_data",
        intent: "clarify",
        confidence: "low",
        departmentQuery,
        semester,
        subjectQuery,
        rawDataBlock,
        examType,
        summary: "Marks upload needs department and semester",
        clarification:
          "Please specify department and semester, e.g. “Semester 3 Computer Engineering ke internal marks upload karo. Subject OS: 21CSE01 42, 21CSE02 38”.",
      };
    }
    return {
      officer: "academic_data",
      intent: "upload_marks",
      confidence: subjectQuery && rawDataBlock ? "high" : "medium",
      departmentQuery,
      semester,
      subjectQuery,
      examType,
      rawDataBlock,
      summary: `Upload ${examType} marks for ${departmentQuery} semester ${semester}`,
      clarification:
        !subjectQuery || !rawDataBlock
          ? "Confirm subject and paste marks (roll number + marks)."
          : undefined,
    };
  }

  if (wantsAttendance && wantsSummary) {
    return {
      officer: "academic_data",
      intent: "show_attendance_summary",
      confidence: departmentQuery && semester ? "high" : "medium",
      departmentQuery,
      semester,
      subjectQuery,
      summary: "Show attendance summary",
      clarification:
        !departmentQuery || !semester
          ? "Specify department and semester for the attendance summary."
          : undefined,
    };
  }

  if (wantsMarks && wantsSummary && !/email|notify|bhejo|send/.test(lower)) {
    return {
      officer: "academic_data",
      intent: "show_marks_summary",
      confidence: departmentQuery && semester ? "high" : "medium",
      departmentQuery,
      semester,
      subjectQuery,
      summary: "Show marks summary",
      clarification:
        !departmentQuery || !semester
          ? "Specify department and semester for the marks summary."
          : undefined,
    };
  }

  // --- Notifications ---
  if (
    hasAny(lower, [
      /email\s+bhejo/,
      /notify/,
      /notification/,
      /mail\s+bhejo/,
      /send\s+(?:an?\s+)?email/,
      /students?\s+ko\s+.*(?:bhejo|inform)/,
      /result\s+publish/,
    ]) &&
    (/student|semester|department|result|notice|deadline|exam/.test(lower) || departmentQuery)
  ) {
    if (!departmentQuery && !/all\s+students|saare\s+students|entire\s+college/.test(lower)) {
      return {
        officer: "student_notification",
        intent: "clarify",
        confidence: "low",
        semester,
        summary: "Notification needs audience",
        clarification:
          "Specify department (and semester if needed), e.g. “Food Technology semester 3 ke students ko result published ka email bhejo.”",
      };
    }
    return {
      officer: "student_notification",
      intent: "notify_students",
      confidence: "high",
      departmentQuery,
      semester,
      newText: extractQuotedOrAfterUpdate(text) ?? text,
      summary: `Prepare notification for ${departmentQuery ?? "students"}${semester ? ` semester ${semester}` : ""}`,
    };
  }

  // --- Website Management ---
  if (
    hasAny(lower, [
      /homepage/,
      /website/,
      /notice/,
      /announcement/,
      /admission/,
      /section/,
      /heading/,
      /academics\s+page/,
      /publish/,
      /remove\s+kar/,
    ]) &&
    hasAny(lower, [/update|change|publish|remove|add|show|likho|karo|delete/])
  ) {
    let intent: VoParsedCommand["intent"] = "website_update_section";
    let officer: VoOfficerId = "website_management";

    if (/remove|delete|hata/.test(lower) && /notice|announcement/.test(lower)) {
      intent = "website_remove_notice";
    } else if (/publish|homepage\s+par/.test(lower) && /notice|announcement/.test(lower)) {
      intent = "website_publish_notice";
    } else if (/heading/.test(lower)) {
      intent = "website_update_heading";
    }

    const pageHint = /homepage|home\s+page/.test(lower)
      ? "home"
      : /admission/.test(lower)
        ? "admissions"
        : /academic/.test(lower)
          ? "academics"
          : undefined;

    const sectionHint = /admission/.test(lower)
      ? "admissions"
      : /notice/.test(lower)
        ? "notices"
        : /announcement/.test(lower)
          ? "announcements"
          : undefined;

    return {
      officer,
      intent,
      confidence: "medium",
      pageHint,
      sectionHint,
      noticeTitle: extractQuotedOrAfterUpdate(text),
      newText: extractQuotedOrAfterUpdate(text),
      summary: `Website change: ${intent.replace(/_/g, " ")}`,
      clarification:
        "A preview will be prepared. Confirm before applying any live website change.",
    };
  }

  return {
    officer: null,
    intent: "unknown",
    confidence: "low",
    departmentQuery,
    semester,
    subjectQuery,
    summary: "Could not route command",
    clarification:
      "Try examples like: “Pending student applications dikhao”, “Computer Engineering semester 2 ki attendance upload karo”, “Homepage ka admission notice update karo”, or “Food Technology semester 3 ke students ko result published ka email bhejo.”",
  };
}
