// models/userdetails.ts
export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  resumeUrl: string;
  avatar?: string;

  // Personal Information
  phone?: string;
  dateOfBirth?: Date;
  location: string;
  bio?: string;

  // Pregnancy & Family Status
  isPregnant: boolean;
  dueDate?: Date;
  pregnancyWeek?: number;
  childrenAges: number[];
  partnerName?: string;
  familyStatus: "single" | "partnered" | "married" | "divorced" | "widowed";

  // Career Information
  currentRole?: string;
  company?: string;
  industry: string;
  workExperience: WorkExperience[];
  skillsAndExperience: string[];
  educationLevel:
    | "high_school"
    | "associates"
    | "bachelors"
    | "masters"
    | "phd"
    | "other";
  educationDetails?: Education[];

  // Career Goals & Preferences
  careerGoals?: string;
  workPreference: "remote" | "hybrid" | "onsite" | "flexible";
  availabilityStatus:
    | "maternity_leave"
    | "returning_to_work"
    | "actively_working"
    | "seeking_opportunities"
    | "career_break";
  desiredSalaryRange?: {
    min: number;
    max: number;
    currency: string;
  };

  // Professional Development
  certifications?: Certification[];
  languages?: Language[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;

  // Preferences & Settings
  jobAlerts: boolean;
  newsletter: boolean;
  communityUpdates: boolean;
  mentorshipInterested: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;

  // Career Support Specific
  yearsOfExperience: number;
  careerBreakDuration?: number; // in months
  returnToWorkDate?: Date;
  flexibilityNeeds: string[];

  // Community & Social
  interests?: string[];
  supportGroups?: string[];
  mentorStatus?: "seeking" | "offering" | "both" | "none";

  // Privacy Settings
  profileVisibility: "public" | "community" | "private";
  showContactInfo: boolean;
  allowMessages: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  achievements?: string[];
  skills?: string[];
  location?: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  achievements?: string[];
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialUrl?: string;
  skills?: string[];
}

export interface Language {
  language: string;
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
}