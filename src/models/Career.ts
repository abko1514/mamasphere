// models/career.ts
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  currentRole?: string;
  industry?: string;
  skillsAndExperience?: string[];
  careerGoals?: string;
  workPreference?: "remote" | "hybrid" | "onsite" | "flexible";
  availabilityStatus?:
    | "maternity_leave"
    | "returning_to_work"
    | "actively_working"
    | "seeking_opportunities";
  location?: string;
  educationLevel?: string;
  yearsOfExperience?: number;
  isPregnant?: boolean;
  childrenAges?: number[];
  desiredSalaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface CareerTip {
  _id: string;
  title: string;
  content: string;
  category:
    | "maternity_leave"
    | "returning_to_work"
    | "career_growth"
    | "work_life_balance"
    | "networking"
    | "skills_development";
  targetAudience: string[];
  isPersonalized: boolean;
  createdAt: Date;
  tags: string[];
  aiGenerated: boolean;
  relevanceScore?: number;
}

export interface JobRecommendation {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "freelance" | "internship";
  workArrangement: "remote" | "hybrid" | "onsite";
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  isMaternityFriendly: boolean;
  flexibleHours: boolean;
  applicationUrl: string;
  postedDate: Date;
  matchScore: number;
  reasonsForMatch: string[];
}

export interface SmallBusiness {
  _id: string;
  businessName: string;
  ownerName: string;
  ownerId: string;
  category: string;
  description: string;
  services: string[];
  location: string;
  contactInfo: {
    email: string;
    phone?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
    };
  };
  images: string[];
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  isMomOwned: boolean;
  createdAt: Date;
  tags: string[];
}

export interface FreelanceOpportunity {
  _id: string;
  title: string;
  clientName: string;
  projectType: string;
  budget: {
    min: number;
    max: number;
    currency: string;
    type: "hourly" | "fixed";
  };
  duration: string;
  skillsRequired: string[];
  description: string;
  isRemote: boolean;
  applicationDeadline: Date;
  postedDate: Date;
  experienceLevel: "beginner" | "intermediate" | "expert";
  matchScore: number;
}

export interface AICareerInsight {
  _id: string;
  userId: string;
  insights: {
    strengthsAnalysis: string[];
    improvementAreas: string[];
    careerPathSuggestions: string[];
    skillGapAnalysis: string[];
    marketTrends: string[];
  };
  personalizedTips: CareerTip[];
  generatedAt: Date;
  nextUpdateDue: Date;
}
