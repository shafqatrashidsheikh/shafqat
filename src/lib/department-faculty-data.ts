/**
 * Department Faculty & Staff Directory Data
 * 
 * Provides structured faculty, HOD, and staff information
 * specifically by department slug. Easy to maintain and update.
 */

export interface DepartmentHod {
  name: string;
  designation: string;
  contact: string;
  email?: string;
  message?: string;
}

export interface DepartmentFacultyMember {
  sNo: number | string;
  name: string;
  designation: string;
  qualification?: string;
  specialization?: string;
  experience: string;
}

export interface NonTeachingStaffMember {
  sNo: number | string;
  name: string;
  experience: string;
  designation: string;
}

export type TableSchemaType =
  | "cse"
  | "omca"
  | "textile"
  | "garment"
  | "tourism"
  | "food-tech";

export interface DepartmentFacultyStaff {
  departmentSlug: string;
  departmentName: string;
  tableSchema: TableSchemaType;
  hod: DepartmentHod;
  faculty: readonly DepartmentFacultyMember[];
  nonTeachingStaff?: readonly NonTeachingStaffMember[];
}

/** Official Computer Engineering Faculty & Staff Data */
export const COMPUTER_ENGINEERING_FACULTY_STAFF: DepartmentFacultyStaff = {
  departmentSlug: "computer-engineering",
  departmentName: "Computer Engineering",
  tableSchema: "cse",
  hod: {
    name: "Er. Roshan Ara",
    designation: "In Charge / Head of Department",
    contact: "9858411446",
    email: "roshaanara@gmail.com",
    message:
      "Welcome to the Department of Computer Engineering at Government Polytechnic for Women, Srinagar. We prepare confident women technical professionals through hands-on laboratory instruction, modern programming curricula, databases, and networking technologies.",
  },
  faculty: [
    {
      sNo: 1,
      name: "Er. Roshan Ara",
      experience: "7+ Years",
      designation: "Demonstrator",
      specialization:
        "Operating System, Python Programming, C Programming, C++, Java, Computer Networks, Computer Architecture, Digital Electronics, Software Project Management",
    },
    {
      sNo: 2,
      name: "Er. Shabnum Mohi Ud Din",
      experience: "7+ Years",
      designation: "Demonstrator",
      specialization:
        "Computer Networks, IMTC, Web Programming, IT Tools, C Programming, Multimedia, COA",
    },
    {
      sNo: 3,
      name: "Er. Mariya Qureshi",
      experience: "16+ Years",
      designation: "Lecturer",
      specialization: "Software Engineering, C Programming, ADBMS",
    },
    {
      sNo: 4,
      name: "Er. Suhail Ahmad Nehvi",
      experience: "16+ Years",
      designation: "Lecturer",
      specialization:
        "IT Tools, C Programming, Multimedia Applications, Computer Networks, IoT, DTP",
    },
    {
      sNo: 5,
      name: "Er. Uzma Yasin",
      experience: "13+ Years",
      designation: "Lecturer",
      specialization:
        "C Programming, Artificial Intelligence, C++, IOT, Data Structure",
    },
    {
      sNo: 6,
      name: "Er. Mudasir Nazir Mattoo",
      experience: "16+ Years",
      designation: "Lecturer",
      specialization:
        "Computer Networks, Web Programming, IT Tools, C Programming",
    },
    {
      sNo: 7,
      name: "Er. Mahina Majid",
      experience: "13+ Years",
      designation: "Lecturer",
      specialization: "Software Engineering, ADBMS, OS, Java, .NET",
    },
    {
      sNo: 8,
      name: "Er. Nowsheen Majid",
      experience: "13+ Years",
      designation: "Lecturer",
      specialization:
        "Data Communication, Visual Programming, IT Tools, C Programming",
    },
  ],
  nonTeachingStaff: [
    {
      sNo: "01",
      name: "Mohd Altaf Sofi",
      experience: "20+ Years",
      designation: "Lab Attendant",
    },
  ],
};

/** Official Office Management & Computer Applications (OMCA) Faculty Data */
export const OMCA_FACULTY_STAFF: DepartmentFacultyStaff = {
  departmentSlug: "office-management-computer-applications",
  departmentName: "Office Management & Computer Applications",
  tableSchema: "omca",
  hod: {
    name: "Shabina Nazir",
    designation: "Head of Department",
    contact: "+91 88250 60365",
    email: "shabinabasu@gmail.com",
    message:
      "Welcome to the Department of Office Management & Computer Applications (OMCA) at Government Polytechnic for Women, Srinagar. In an increasingly automated and digital professional landscape, our diploma programme prepares young women with a balanced mastery of modern office administration, secretarial practices, stenography, computerized accounting, and business communication tools. Supported by dedicated and experienced faculty, our students graduate as self-assured, industry-ready professionals equipped to excel across corporate, governmental, and executive office environments.",
  },
  faculty: [
    {
      sNo: 1,
      name: "Shabina Nazir Shah",
      designation: "HOD",
      qualification: "Diploma in Secretarial Practices, Graduation",
      specialization: "Stenography, Management",
      experience: "22+ Years",
    },
    {
      sNo: 2,
      name: "Ms. Raziya Majeed",
      designation: "Lecturer",
      qualification: "Diploma in Secretarial Practices, CIC, MA Economics",
      specialization: "Accounting, Secretarial Practice",
      experience: "26+ Years",
    },
    {
      sNo: 3,
      name: "Ms. Masrat Farooq",
      designation: "Lecturer II",
      qualification: "Diploma in Modern Office Practices, B.A",
      specialization: "Entrepreneurship, Business Organisation",
      experience: "19+ Years",
    },
    {
      sNo: 4,
      name: "Ms. Suriya Rizwi",
      designation: "Lecturer",
      qualification: "Diploma in OMCA",
      specialization: "Accounting, Stenography",
      experience: "12+ Years",
    },
    {
      sNo: 5,
      name: "Ms. Suriya Sidiq",
      designation: "Lecturer",
      qualification: "Diploma in OMCA, M.A",
      specialization: "Office Management, P.O.M, Secretarial Practice",
      experience: "12+ Years",
    },
  ],
};

/** Official Textile Technology Faculty Data */
export const TEXTILE_FACULTY_STAFF: DepartmentFacultyStaff = {
  departmentSlug: "textile-technology",
  departmentName: "Textile Technology",
  tableSchema: "textile",
  hod: {
    name: "Harish Chander",
    designation: "Head of Department",
    contact: "+91 7006446534",
    email: "harishch@outlook.com",
    message:
      "Welcome to the Department of Textile Technology at Government Polytechnic for Women, Srinagar. Textile engineering blends scientific principles with artistic craftsmanship. Our curriculum provides rigorous training in yarn manufacturing, weaving mechanisms, fabric structure, testing, and modern textile processing. We are dedicated to grooming skilled women technocrats ready for dynamic careers in composite mills, testing laboratories, design studios, and industrial leadership.",
  },
  faculty: [
    {
      sNo: 1,
      name: "Tahmeena Shafi",
      experience: "17+ Years",
      designation: "Lecturer",
      specialization: "Weaving Technology, Fabric Structure, Fibre Science",
    },
    {
      sNo: 2,
      name: "Arjumand Amin",
      experience: "16+ Years",
      designation: "Lecturer",
      specialization: "Weaving Technology, Textile Processing, Fibre Science",
    },
    {
      sNo: 3,
      name: "Saiyama Farooq",
      experience: "14+ Years",
      designation: "Guest Faculty",
      specialization: "Weaving Technology, Spinning Technology, Fibre Science",
    },
  ],
};

/** Official Garment Technology Faculty Data */
export const GARMENT_FACULTY_STAFF: DepartmentFacultyStaff = {
  departmentSlug: "garment-technology",
  departmentName: "Garment Technology",
  tableSchema: "garment",
  hod: {
    name: "Fozia Yusuf Mir",
    designation: "Head of Department",
    contact: "+91 96979 71503",
    email: "foziyayusufmir974@gmail.com",
    message:
      "Welcome to the Department of Garment Technology at Government Polytechnic for Women, Srinagar. In the fast-evolving apparel and fashion industry, our department emphasizes technical precision, basic pattern making, fashion illustration, computer-aided design (CAD), and garment production technology. We nurture creative flair alongside practical engineering skills so our graduates emerge as confident designers, production managers, and successful entrepreneurs.",
  },
  faculty: [
    {
      sNo: 1,
      name: "Fozia Yousuf Mir",
      qualification: "Diploma in GT, PG Sociology",
      designation: "HOD",
      specialization: "Fashion Illustration and Basic Design",
      experience: "20+ Years",
    },
    {
      sNo: 2,
      name: "Neha Kumari",
      qualification: "MSc Textile and Apparel Science",
      designation: "Lecturer II",
      specialization: "Textile and Apparel Science",
      experience: "1+ Years",
    },
    {
      sNo: 3,
      name: "Sameer Ayoub Parry",
      qualification: "B.Tech in Handloom and Textile Technology",
      designation: "Lecturer II",
      specialization: "Handloom and Textile Technology",
      experience: "1+ Years",
    },
    {
      sNo: 4,
      name: "Sabeena Masoodi",
      qualification: "Diploma in GT, BA",
      designation: "Lecturer",
      specialization: "Basic Pattern Making",
      experience: "21+ Years",
    },
    {
      sNo: 5,
      name: "Ameera",
      qualification: "Diploma in Garment Technology, PG Sociology",
      designation: "Lecturer",
      specialization: "Handloom and Textile Technology, Basic Pattern Making, CAD",
      experience: "16+ Years",
    },
  ],
};

/** Official Travel and Tourism Faculty Data */
export const TRAVEL_TOURISM_FACULTY_STAFF: DepartmentFacultyStaff = {
  departmentSlug: "travel-tourism",
  departmentName: "Travel & Tourism",
  tableSchema: "tourism",
  hod: {
    name: "Ms. Ruksana Bashir",
    designation: "Head of Department",
    contact: "+91 9419201594",
    email: "", // Not available in reference information; left blank as instructed
    message:
      "Welcome to the Department of Travel & Tourism at Government Polytechnic for Women, Srinagar. Kashmir is world-renowned for its heritage and hospitality, making tourism a cornerstone of regional and global opportunity. Our programme trains students in airline ticketing, tour operations, travel geography, niche tourism, and hospitality management. We empower young women to become dynamic professionals and leaders across the global travel sector.",
  },
  faculty: [
    {
      sNo: 1,
      name: "Mr. Sanjay Narain Bamotra",
      designation: "Lecturer",
      qualification: "Bachelors in Tourism Studies",
      specialization: "Airline Ticketing, Travel Agency and Tour Operators",
      experience: "1+ Years",
    },
    {
      sNo: 2,
      name: "Ms. Maheen",
      designation: "Lecturer",
      qualification: "Masters in Travel and Tourism Management",
      specialization: "History, Human Resource Management, Niche Tourism",
      experience: "1+ Years",
    },
    {
      sNo: 3,
      name: "Ms. Ifra Nazir",
      designation: "Lecturer",
      qualification:
        "Bachelors in Arts Travel and Tourism Management, Masters in Convergent Journalism",
      specialization: "Hospitality and Catering, Travel Journalism, Travel Geography",
      experience: "1+ Years",
    },
  ],
};

/** Official Food Technology Faculty Data */
export const FOOD_TECH_FACULTY_STAFF: DepartmentFacultyStaff = {
  departmentSlug: "food-technology",
  departmentName: "Food Technology",
  tableSchema: "food-tech",
  hod: {
    name: "Dr. Anjum Riyaz",
    designation: "Head of Department",
    contact: "+91 6005734357",
    email: "syedanjum.0599@gmail.com",
    message:
      "Welcome to the Department of Food Technology at Government Polytechnic for Women, Srinagar. Food science and processing technology play a pivotal role in public health, nutrition, and modern agricultural industry. Our comprehensive diploma programme provides rigorous instruction in food preservation, quality assurance, laboratory testing, and modern food processing methods, preparing students for impactful careers in the food industry, research, and regulatory agencies.",
  },
  faculty: [
    {
      sNo: 1,
      name: "Dr. Anjum Riyaz",
      designation: "Lecturer II",
      qualification: "Ph.D",
      experience: "2+ Years",
    },
    {
      sNo: 2,
      name: "Dr. Shaziya Manzoor",
      designation: "Lecturer II",
      qualification: "Ph.D",
      experience: "2+ Years",
    },
    {
      sNo: 3,
      name: "Tasleema Qadir",
      designation: "Lecturer",
      qualification: "3 Years Diploma in Food Technology, M.Sc",
      experience: "18+ Years",
    },
    {
      sNo: 4,
      name: "Syed Suhila Nazir",
      designation: "Lecturer",
      qualification: "M.Tech",
      experience: "11+ Years",
    },
    {
      sNo: 5,
      name: "Benish Yasin",
      designation: "Lecturer",
      qualification: "3 Years Diploma in Food Technology, MA",
      experience: "18+ Years",
    },
  ],
};

const DEPARTMENT_FACULTY_REGISTRY: Record<string, DepartmentFacultyStaff> = {
  "computer-engineering": COMPUTER_ENGINEERING_FACULTY_STAFF,
  "office-management-computer-applications": OMCA_FACULTY_STAFF,
  "omca": OMCA_FACULTY_STAFF,
  "textile-technology": TEXTILE_FACULTY_STAFF,
  "garment-technology": GARMENT_FACULTY_STAFF,
  "travel-tourism": TRAVEL_TOURISM_FACULTY_STAFF,
  "travel-and-tourism": TRAVEL_TOURISM_FACULTY_STAFF,
  "food-technology": FOOD_TECH_FACULTY_STAFF,
};

/**
 * Returns faculty & staff information for a specific department slug.
 * Returns null if no department-specific faculty listing exists.
 */
export function getDepartmentFacultyStaff(slug: string): DepartmentFacultyStaff | null {
  const key = slug.toLowerCase().trim();
  return DEPARTMENT_FACULTY_REGISTRY[key] ?? null;
}
