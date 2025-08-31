// lib/careerService.ts
// Updated lib/careerService.ts integration
import { hybridCareerService } from './services/hybridCareerService';
import { dataQualityManager } from './services/dataQualityManager';
import { cacheManager } from './services/cacheManager';
import { JobRecommendation as ModelJobRecommendation } from '../models/Career';
// Define an interface for the application data
interface JobApplicationData {
  resume?: string; // File path or base64 encoded resume
  coverLetter?: string;
  answers?: Record<string, string>; // For job-specific questions
  // Add other relevant fields as needed
  [key: string]: unknown; // For any additional dynamic fields
}

// Define interfaces for user profile data
export interface UserProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location: string;
    timeZone: string;
    profilePicture?: string;
  };
  professionalInfo: {
    title: string;
    summary: string;
    skills: string[];
    experience: WorkExperience[];
    education: Education[];
    certifications: Certification[];
    resume?: string;
    portfolio?: string;
  };
  careerPreferences: {
    desiredRoles: string[];
    industries: string[];
    workArrangements: ("remote" | "hybrid" | "onsite" | "flexible")[];
    locationPreferences: string[];
    salaryExpectations: {
      min: number;
      max: number;
      currency: string;
    };
    willingnessToRelocate: boolean;
    willingnessToTravel: string; // "none", "some", "extensive"
  };
  workLifeBalance: {
    hoursAvailability: string; // "full-time", "part-time", "flexible"
    childcareSupportNeeded: boolean;
    preferredSchedule: {
      startTime: string;
      endTime: string;
      timeZone: string;
    };
    timeOffRequirements: string[];
  };
  jobSearchStatus: {
    activelyLooking: boolean;
    startDate: string; // "immediately", "1-2 weeks", "1-3 months", "flexible"
    opennessToOpportunities: boolean;
    visibility: "active" | "passive" | "not-looking";
  };
  networkingPreferences: {
    interestedInMentoring: boolean;
    seekingMentorship: boolean;
    collaborationInterest: boolean;
    networkingFrequency: "regularly" | "occasionally" | "rarely";
  };
  privacySettings: {
    profileVisibility: "public" | "connections-only" | "private";
    resumeVisibility: "public" | "connections-only" | "private";
    contactInfoVisibility: "public" | "connections-only" | "private";
  };
  achievements: Achievement[];
  createdAt: Date;
  updatedAt: Date;
  completenessScore: number;
  lastActive: Date;
}

export interface WorkExperience {
  _id: string;
  company: string;
  title: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  skills: string[];
  achievements: string[];
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface Certification {
  _id: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialID?: string;
  credentialURL?: string;
}

export interface Achievement {
  _id: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  link?: string;
}

export interface CareerTip {
  _id: string;
  title: string;
  content: string;
  category:
    | "skill-development"
    | "networking"
    | "work-life-balance"
    | "career-growth"
    | "interview-prep";
  difficulty: "beginner" | "intermediate" | "advanced";
  timeToImplement: string;
  tags: string[];
  isPersonalized: boolean;
  relevanceScore: number;
  createdAt: Date;
  updatedAt: Date;
  targetAudience: string;
  aiGenerated: boolean;
}

export interface JobRecommendation {
  _id: string;
  title: string;
  company: string;
  location: string;
  workArrangement: "remote" | "hybrid" | "onsite" | "flexible";
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  matchScore: number;
  isMaternityFriendly: boolean;
  flexibleHours: boolean;
  benefitsHighlights: string[];
  applicationDeadline?: Date;
  applicationUrl?: string;
  reasonsForMatch?: string[];
  postedDate: Date;
  jobType: "full-time" | "part-time" | "contract" | "freelance";
  experienceLevel: "entry" | "mid" | "senior" | "executive";
  companySize: "startup" | "small" | "medium" | "large" | "enterprise";
  companyStage:
    | "seed"
    | "series-a"
    | "series-b"
    | "growth"
    | "public"
    | "established";
  diversityCommitment: boolean;
  parentingSupport: string[];
}

export interface FreelanceOpportunity {
  _id: string;
  title: string;
  client: string;
  projectType: "short-term" | "long-term" | "ongoing";
  budgetRange: {
    min: number;
    max: number;
    currency: string;
    paymentType: "hourly" | "project" | "monthly";
  };
  duration: string;
  skillsRequired: string[];
  description: string;
  matchScore: number;
  isRemote: boolean;
  timeZoneRequirement?: string;
  applicationDeadline?: Date;
  postedDate: Date;
  difficultyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  clientRating: number;
  paymentVerified: boolean;
  experienceLevel: "beginner" | "intermediate" | "advanced" | "expert";
  budget: {
    min: number;
    max: number;
    currency: string;
    type: "hourly" | "project" | "monthly";
  };
  clientName: string;
}

export interface SmallBusiness {
  _id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  website?: string;
  contact: {
    email: string;
    phone?: string;
    social?: {
      linkedin?: string;
      instagram?: string;
      facebook?: string;
    };
  };
  ownerInfo: {
    name: string;
    isMother: boolean;
    story?: string;
    yearsInBusiness: number;
  };
  services: string[];
  specializations: string[];
  supportingMoms: boolean;
  lookingForCollaborators: boolean;
  hiringStatus: "not-hiring" | "open-to-opportunities" | "actively-hiring";
  workArrangements: ("remote" | "onsite" | "hybrid" | "flexible")[];
  tags: string[];
  verified: boolean;
  createdAt: Date;
  businessName: string;
  ownerName: string;
  ownerId: string;
  category: string;
  images: string[];
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  isMomOwned: boolean;
}

export interface AICareerInsight {
  _id: string;
  userId: string;
  insights: {
    strengthsAnalysis: string[];
    careerPathSuggestions: string[];
    skillGapAnalysis: string[];
    marketTrends: string[];
    salaryInsights: {
      currentMarketRate: string;
      growthPotential: string;
      recommendations: string[];
    };
    workLifeBalanceRecommendations: string[];
    networkingOpportunities: string[];
    personalizedAdvice: string[];
    nextUpdateDue: string | Date;
    improvementAreas: string[];
  };
  confidenceScore: number;
  personalizedTips: string[];
  generatedAt: Date;
  lastUpdated: Date;
}

export interface UserAnalytics {
  userId: string;
  profileCompleteness: number;
  jobApplications: {
    total: number;
    pending: number;
    interviews: number;
    offers: number;
    rejected: number;
  };
  skillAssessments: {
    completed: number;
    averageScore: number;
    topSkills: { skill: string; score: number }[];
  };
  networking: {
    connections: number;
    messagesSent: number;
    meetingsScheduled: number;
  };
  learningProgress: {
    coursesCompleted: number;
    hoursSpent: number;
    certificatesEarned: number;
  };
  engagement: {
    logins: number;
    timeSpent: number; // in minutes
    lastActive: Date;
  };
  recommendations: {
    jobsApplied: number;
    jobsSaved: number;
    businessesContacted: number;
  };
  timeline: AnalyticsEvent[];
  weeklySummary: WeeklySummary[];
}

export interface AnalyticsEvent {
  type:
    | "job_application"
    | "skill_assessment"
    | "networking"
    | "learning"
    | "profile_update";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface WeeklySummary {
  week: string; // ISO week format
  applications: number;
  learningHours: number;
  networkingActivities: number;
  skillImprovements: number;
}

class CareerService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      return data.profile || null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }

      const data = await response.json();
      return data.profile || null;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
  }

  // Get user analytics
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/analytics/users/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user analytics");
      }

      const data = await response.json();
      return data.analytics || this.getMockAnalytics(userId);
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      return this.getMockAnalytics(userId);
    }
  }

  // Get personalized career tips based on user profile
  async getPersonalizedTips(
    userId: string,
    limit: number = 20
  ): Promise<CareerTip[]> {
    try {
      const user = await this.getUserProfile(userId);
      if (!user) {
        return this.getMockTips();
      }

      // Check cache first
      const cachedTips = await this.getCachedTips(userId);
      if (cachedTips && cachedTips.length > 0) {
        return cachedTips.slice(0, limit);
      }

      // Generate new tips using AI
      const tips = await aiService.generatePersonalizedTips(user);

      // Convert AI-generated tips to CareerTip format
      const formattedTips = tips.map((tipContent, index) => ({
        _id: `ai_tip_${Date.now()}_${index}`,
        title: this.generateTipTitle(tipContent),
        content: tipContent,
        category: this.categorizeTip(tipContent) as CareerTip["category"],
        difficulty: "intermediate" as const,
        timeToImplement: "15-30 minutes",
        tags: this.extractTipTags(tipContent, user),
        isPersonalized: true,
        relevanceScore: 85 + Math.random() * 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        targetAudience: this.getTargetAudience(user),
        aiGenerated: true,
      }));

      // Cache the tips
      await this.cacheTips(userId, formattedTips);

      return formattedTips.slice(0, limit);
    } catch (error) {
      console.error("Error fetching personalized tips:", error);
      return this.getMockTips().slice(0, limit);
    }
  }

  async saveJobApplication(jobId: string, userId: string): Promise<void> {
    try {
      const response = await fetch("/api/career/save-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save job application");
      }
    } catch (error) {
      console.error("Error saving job application:", error);
      throw error;
    }
  }

  // Updated job recommendations with real-time data
  async getJobRecommendations(
    userId: string,
    filters?: {
      type?: string;
      workArrangement?: string;
      location?: string;
      salaryMin?: number;
      experienceLevel?: string;
    },
    limit: number = 20
  ): Promise<JobRecommendation[]> {
    try {
      const user = await this.getUserProfile(userId);
      if (!user) {
        return this.getMockJobs().slice(0, limit);
      }

      // Use real-time career service
      const jobs =
        await realTimeCareerService.getPersonalizedJobRecommendations(
          user,
          filters
        );
      return jobs.slice(0, limit);
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      return this.getMockJobs().slice(0, limit);
    }
  }

  // Updated freelance opportunities with real data
  async getFreelanceOpportunities(
    userId: string,
    filters?: {
      projectType?: string;
      budgetMin?: number;
      duration?: string;
      skillsRequired?: string[];
    },
    limit: number = 15
  ): Promise<FreelanceOpportunity[]> {
    try {
      const user = await this.getUserProfile(userId);
      if (!user) {
        return this.getMockFreelanceOps().slice(0, limit);
      }

      const opportunities =
        await realTimeCareerService.getFreelanceOpportunities(user);
      return opportunities.slice(0, limit);
    } catch (error) {
      console.error("Error fetching freelance opportunities:", error);
      return this.getMockFreelanceOps().slice(0, limit);
    }
  }

  // Updated small businesses with real data
  async getSmallBusinesses(
    filters?: {
      category?: string;
      location?: string;
      momOwned?: boolean;
      searchQuery?: string;
      hiringStatus?: string;
    },
    limit: number = 25
  ): Promise<SmallBusiness[]> {
    try {
      const businesses = await realTimeCareerService.getSmallBusinesses(
        filters
      );
      return businesses.slice(0, limit);
    } catch (error) {
      console.error("Error fetching small businesses:", error);
      return this.getMockBusinesses().slice(0, limit);
    }
  }

  // Helper methods for caching
  private async getCachedInsights(
    userId: string
  ): Promise<AICareerInsight | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/career/insights?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        // Check if insights are recent (within 7 days)
        const generatedAt = new Date(data.generatedAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        if (generatedAt > weekAgo) {
          return data;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private async getCachedTips(userId: string): Promise<CareerTip[] | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/career/tips?userId=${userId}&cached=true`
      );
      if (response.ok) {
        const data = await response.json();
        return data.tips || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private async cacheInsights(
    userId: string,
    insights: AICareerInsight
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/career/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, ...insights }),
      });
    } catch (error) {
      console.error("Error caching insights:", error);
    }
  }

  private async cacheTips(userId: string, tips: CareerTip[]): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/career/tips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, tips }),
      });
    } catch (error) {
      console.error("Error caching tips:", error);
    }
  }

  // Utility methods for AI tip processing
  private generateTipTitle(content: string): string {
    const firstSentence = content.split(".")[0];
    return firstSentence.length > 60
      ? firstSentence.substring(0, 57) + "..."
      : firstSentence;
  }

  private categorizeTip(content: string): string {
    const text = content.toLowerCase();

    if (text.includes("network") || text.includes("connect"))
      return "networking";
    if (
      text.includes("skill") ||
      text.includes("learn") ||
      text.includes("course")
    )
      return "skills";
    if (text.includes("interview") || text.includes("resume"))
      return "interview";
    if (text.includes("balance") || text.includes("family"))
      return "work-life-balance";
    if (text.includes("salary") || text.includes("negotiate")) return "salary";

    return "career-change";
  }

  private extractTipTags(content: string, user: UserProfile): string[] {
    const tags = [];
    const text = content.toLowerCase();

    if (text.includes("remote")) tags.push("remote-work");
    if (text.includes("network")) tags.push("networking");
    if (text.includes("skill")) tags.push("professional-development");
    if (text.includes("family") || text.includes("parent"))
      tags.push("work-life-balance");
    if (user.industry)
      tags.push(user.industry.toLowerCase().replace(/\s+/g, "-"));

    return tags.slice(0, 4); // Limit to 4 tags
  }

  private getTargetAudience(user: UserProfile): string {
    const audiences = [];

    if (user.personalInfo?.hasChildren) {
      audiences.push("working-parents");
    }

    if (user.jobSearchStatus?.activelyLooking) {
      audiences.push("job-seekers");
    }

    if (user.careerPreferences?.workArrangements?.includes("remote")) {
      audiences.push("remote-workers");
    }

    return audiences.join(", ") || "professionals";
  }

  // Generate AI career insights
  async generateAICareerInsights(
    userId: string,
    forceRegenerate: boolean = false
  ): Promise<AICareerInsight> {
    try {
      // Get user profile first
      const user = await this.getUserProfile(userId);
      if (!user) {
        throw new Error("User profile not found");
      }

      // Check cache first (unless force regenerate)
      if (!forceRegenerate) {
        const cachedInsights = await this.getCachedInsights(userId);
        if (cachedInsights) {
          return cachedInsights;
        }
      }

      // Generate new insights using Hugging Face
      const insights = await aiService.generateCareerInsights(user);

      // Cache the results
      await this.cacheInsights(userId, insights);

      return insights;
    } catch (error) {
      console.error("Error generating AI insights:", error);
      return this.getMockAIInsights(userId);
    }
  }

  // Save job for later
  async saveJob(userId: string, jobId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/career/jobs/${jobId}/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Error saving job:", error);
      return false;
    }
  }

  // Apply to job
  async applyToJob(
    userId: string,
    jobId: string,
    applicationData: JobApplicationData
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/career/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, ...applicationData }),
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Error applying to job:", error);
      return false;
    }
  }

  // Contact business owner
  async contactBusiness(
    userId: string,
    businessId: string,
    message: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/career/businesses/${businessId}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, message }),
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Error contacting business:", error);
      return false;
    }
  }

  // Track user activity
  async trackUserActivity(
    userId: string,
    activityType: string,
    metadata?: Record<string, unknown>
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          activityType,
          metadata,
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Error tracking user activity:", error);
      return false;
    }
  }

  // Mock analytics data for development/fallback
  private getMockAnalytics(userId: string): UserAnalytics {
    const now = new Date();
    // const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      userId,
      profileCompleteness: 85,
      jobApplications: {
        total: 24,
        pending: 8,
        interviews: 6,
        offers: 2,
        rejected: 8,
      },
      skillAssessments: {
        completed: 12,
        averageScore: 82,
        topSkills: [
          { skill: "Digital Marketing", score: 92 },
          { skill: "Content Strategy", score: 88 },
          { skill: "Analytics", score: 85 },
          { skill: "Team Leadership", score: 90 },
          { skill: "Project Management", score: 87 },
        ],
      },
      networking: {
        connections: 45,
        messagesSent: 28,
        meetingsScheduled: 6,
      },
      learningProgress: {
        coursesCompleted: 3,
        hoursSpent: 24,
        certificatesEarned: 2,
      },
      engagement: {
        logins: 42,
        timeSpent: 380,
        lastActive: now,
      },
      recommendations: {
        jobsApplied: 8,
        jobsSaved: 16,
        businessesContacted: 3,
      },
      timeline: [
        {
          type: "job_application",
          title: "Applied to Senior Marketing Manager",
          description: "Applied to remote position at TechForGood Inc.",
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          metadata: { company: "TechForGood Inc.", status: "pending" },
        },
        {
          type: "skill_assessment",
          title: "Completed Digital Marketing Assessment",
          description: "Scored 92% on advanced digital marketing skills",
          timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          metadata: { score: 92, category: "Digital Marketing" },
        },
        {
          type: "networking",
          title: "Connected with Industry Professional",
          description:
            "Had coffee chat with marketing director at Sustainable Solutions",
          timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          metadata: {
            connection: "Jessica Rodriguez",
            company: "Sustainable Solutions",
          },
        },
        {
          type: "learning",
          title: "Completed Marketing Automation Course",
          description: "Finished 8-hour course on HubSpot automation",
          timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          metadata: {
            course: "HubSpot Automation Mastery",
            duration: "8 hours",
          },
        },
        {
          type: "profile_update",
          title: "Updated Professional Summary",
          description: "Enhanced profile with recent achievements and skills",
          timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
          metadata: { sectionsUpdated: ["summary", "skills"] },
        },
      ],
      weeklySummary: [
        {
          week: "2024-W03",
          applications: 6,
          learningHours: 8,
          networkingActivities: 3,
          skillImprovements: 2,
        },
        {
          week: "2024-W02",
          applications: 5,
          learningHours: 6,
          networkingActivities: 2,
          skillImprovements: 1,
        },
        {
          week: "2024-W01",
          applications: 4,
          learningHours: 5,
          networkingActivities: 1,
          skillImprovements: 1,
        },
        {
          week: "2023-W52",
          applications: 3,
          learningHours: 5,
          networkingActivities: 0,
          skillImprovements: 0,
        },
      ],
    };
  }

  // Mock data methods for development/fallback
  private getMockTips(): CareerTip[] {
    return [
      {
        _id: "tip_1",
        title: "Leverage Your Unique Perspective as a Working Mother",
        content:
          "Your experience as a working mother gives you exceptional skills in time management, multitasking, and problem-solving under pressure. Highlight these transferable skills in interviews and on your resume. Employers increasingly value the diverse perspectives and proven resilience that working mothers bring to the workplace.",
        category: "career-growth",
        difficulty: "beginner",
        timeToImplement: "30 minutes",
        tags: ["resume", "interviewing", "strengths", "working-mothers"],
        isPersonalized: true,
        relevanceScore: 95,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        targetAudience: "working mothers",
        aiGenerated: false,
      },
      {
        _id: "tip_2",
        title: "Network Strategically During School Events",
        content:
          "Transform school pickup, parent-teacher conferences, and extracurricular activities into networking opportunities. Many other parents are professionals who could become valuable connections. Bring business cards to school events and don't be afraid to mention what you do professionally in casual conversations.",
        category: "networking",
        difficulty: "intermediate",
        timeToImplement: "15 minutes per event",
        tags: ["networking", "parents", "school-events", "connections"],
        isPersonalized: true,
        relevanceScore: 88,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
        targetAudience: "working mothers",
        aiGenerated: false,
      },
      {
        _id: "tip_3",
        title: "Master the Art of the 15-Minute Coffee Chat",
        content:
          "As a busy parent, time is precious. Perfect the 15-minute virtual coffee chat for networking and informational interviews. Prepare 3-4 targeted questions, have your elevator pitch ready, and always follow up within 24 hours. This efficient approach shows respect for time while building meaningful professional relationships.",
        category: "networking",
        difficulty: "intermediate",
        timeToImplement: "15 minutes",
        tags: [
          "networking",
          "time-management",
          "virtual-meetings",
          "efficiency",
        ],
        isPersonalized: true,
        relevanceScore: 92,
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-08"),
        targetAudience: "working mothers",
        aiGenerated: false,
      },
      {
        _id: "tip_4",
        title: "Negotiate for Family-Friendly Benefits",
        content:
          "When evaluating job offers, look beyond salary. Negotiate for flexible work arrangements, childcare stipends, family health coverage, and generous parental leave policies. Many companies are willing to offer these benefits to attract top talent, especially experienced working mothers.",
        category: "career-growth",
        difficulty: "advanced",
        timeToImplement: "1-2 hours prep time",
        tags: [
          "negotiation",
          "benefits",
          "work-life-balance",
          "family-friendly",
        ],
        isPersonalized: true,
        relevanceScore: 90,
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
        targetAudience: "working mothers",
        aiGenerated: false,
      },
      {
        _id: "tip_5",
        title: "Build Your Personal Brand During Naptime",
        content:
          "Use small pockets of time (naptime, early mornings, commute) to build your professional presence. Share industry insights on LinkedIn, contribute to relevant online discussions, or write brief articles about your expertise. Consistency over time creates a strong personal brand.",
        category: "skill-development",
        difficulty: "beginner",
        timeToImplement: "20-30 minutes daily",
        tags: [
          "personal-brand",
          "linkedin",
          "content-creation",
          "time-management",
        ],
        isPersonalized: true,
        relevanceScore: 85,
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
        targetAudience: "working mothers",
        aiGenerated: false,
      },
    ];
  }

  private getMockJobs(): JobRecommendation[] {
    return [
      {
        _id: "job_1",
        title: "Senior Marketing Manager - Remote",
        company: "TechForGood Inc.",
        location: "Remote (US)",
        workArrangement: "remote",
        salaryRange: {
          min: 120000,
          max: 150000,
          currency: "USD",
        },
        requiredSkills: [
          "Digital Marketing",
          "Campaign Management",
          "Analytics",
          "Team Leadership",
        ],
        preferredSkills: [
          "Marketing Automation",
          "A/B Testing",
          "Content Strategy",
        ],
        description:
          "Lead our digital marketing initiatives for a mission-driven tech company focused on social impact. Perfect for an experienced marketer who wants to make a difference while maintaining work-life balance.",
        matchScore: 94,
        isMaternityFriendly: true,
        flexibleHours: true,
        benefitsHighlights: [
          "12 weeks paid parental leave",
          "Flexible hours",
          "$2000 annual childcare stipend",
          "Home office setup allowance",
        ],
        postedDate: new Date("2024-01-20"),
        jobType: "full-time",
        experienceLevel: "senior",
        companySize: "medium",
        companyStage: "series-b",
        diversityCommitment: true,
        parentingSupport: [
          "On-site childcare",
          "Lactation rooms",
          "Family emergency time off",
        ],
      },
      {
        _id: "job_2",
        title: "Director of Product Marketing - Hybrid",
        company: "Sustainable Solutions Co.",
        location: "San Francisco, CA",
        workArrangement: "hybrid",
        salaryRange: {
          min: 160000,
          max: 190000,
          currency: "USD",
        },
        requiredSkills: [
          "Product Marketing",
          "Go-to-Market Strategy",
          "Cross-functional Leadership",
        ],
        preferredSkills: [
          "SaaS Experience",
          "Customer Research",
          "Competitive Analysis",
        ],
        description:
          "Shape the marketing strategy for innovative sustainability products. Join a values-driven company that prioritizes both environmental impact and employee well-being.",
        matchScore: 91,
        isMaternityFriendly: true,
        flexibleHours: true,
        benefitsHighlights: [
          "Unlimited PTO",
          "Equity package",
          "Professional development budget",
          "4-day work week option",
        ],
        postedDate: new Date("2024-01-18"),
        jobType: "full-time",
        experienceLevel: "senior",
        companySize: "small",
        companyStage: "growth",
        diversityCommitment: true,
        parentingSupport: [
          "Flexible scheduling",
          "Work-from-home stipend",
          "Mental health support",
        ],
      },
      {
        _id: "job_3",
        title: "Marketing Consultant - Project Based",
        company: "Various Clients",
        location: "Remote Global",
        workArrangement: "remote",
        salaryRange: {
          min: 75,
          max: 125,
          currency: "USD",
        },
        requiredSkills: [
          "Marketing Strategy",
          "Campaign Development",
          "Client Management",
        ],
        preferredSkills: [
          "Multiple Industry Experience",
          "Presentation Skills",
          "Analytics",
        ],
        description:
          "Work with diverse clients on exciting marketing projects. Set your own schedule and choose projects that align with your values and interests.",
        matchScore: 87,
        isMaternityFriendly: true,
        flexibleHours: true,
        benefitsHighlights: [
          "Flexible schedule",
          "Choose your projects",
          "No meetings before 9am or after 4pm",
        ],
        postedDate: new Date("2024-01-16"),
        jobType: "contract",
        experienceLevel: "senior",
        companySize: "small",
        companyStage: "established",
        diversityCommitment: true,
        parentingSupport: ["Project-based work", "Time zone flexibility"],
      },
    ];
  }

  private getMockFreelanceOps(): FreelanceOpportunity[] {
    return [
      {
        _id: "freelance_1",
        title: "Content Marketing Strategy for EdTech Startup",
        client: "LearnSmart Academy",
        projectType: "short-term",
        budgetRange: {
          min: 5000,
          max: 8000,
          currency: "USD",
          paymentType: "project",
        },
        duration: "6-8 weeks",
        skillsRequired: [
          "Content Strategy",
          "Educational Content",
          "SEO",
          "Analytics",
        ],
        description:
          "Develop a comprehensive content marketing strategy for an innovative EdTech platform targeting working parents who want to upskill.",
        matchScore: 92,
        isRemote: true,
        applicationDeadline: new Date("2024-02-15"),
        postedDate: new Date("2024-01-22"),
        difficultyLevel: "intermediate",
        clientRating: 4.8,
        paymentVerified: true,
        experienceLevel: "intermediate",
        budget: {
          min: 5000,
          max: 8000,
          currency: "USD",
          type: "project",
        },
        clientName: "LearnSmart Academy",
      },
      {
        _id: "freelance_2",
        title: "Marketing Automation Setup - HubSpot",
        client: "GreenTech Solutions",
        projectType: "long-term",
        budgetRange: {
          min: 85,
          max: 120,
          currency: "USD",
          paymentType: "hourly",
        },
        duration: "3-4 months",
        skillsRequired: [
          "HubSpot",
          "Marketing Automation",
          "Email Marketing",
          "Lead Nurturing",
        ],
        description:
          "Set up and optimize marketing automation workflows for a sustainable technology company. Ongoing support and optimization included.",
        matchScore: 89,
        isRemote: true,
        timeZoneRequirement: "EST +/- 3 hours",
        applicationDeadline: undefined,
        postedDate: new Date("2024-01-20"),
        difficultyLevel: "advanced",
        clientRating: 4.9,
        paymentVerified: true,
        experienceLevel: "advanced",
        budget: {
          min: 85,
          max: 120,
          currency: "USD",
          type: "hourly",
        },
        clientName: "GreenTech Solutions",
      },
      {
        _id: "freelance_3",
        title: "Social Media Content Creation - Parenting Brand",
        client: "Modern Family Co.",
        projectType: "ongoing",
        budgetRange: {
          min: 2500,
          max: 3500,
          currency: "USD",
          paymentType: "monthly",
        },
        duration: "Ongoing",
        skillsRequired: [
          "Social Media Marketing",
          "Content Creation",
          "Brand Voice",
          "Scheduling Tools",
        ],
        description:
          "Create engaging social media content for a brand focused on modern parenting solutions. Perfect for someone who understands the target audience firsthand.",
        matchScore: 85,
        isRemote: true,
        postedDate: new Date("2024-01-19"),
        difficultyLevel: "intermediate",
        clientRating: 4.7,
        paymentVerified: true,
        experienceLevel: "intermediate",
        budget: {
          min: 2500,
          max: 3500,
          currency: "USD",
          type: "monthly",
        },
        clientName: "Modern Family Co.",
      },
    ];
  }

  private getMockBusinesses(): SmallBusiness[] {
    return [
      {
        _id: "business_1",
        name: "MomTech Consulting",
        description:
          "Technology consulting firm specializing in helping businesses implement family-friendly tech solutions and remote work infrastructure.",
        industry: "Technology Consulting",
        location: "Austin, TX",
        website: "https://momtechconsulting.com",
        contact: {
          email: "hello@momtechconsulting.com",
          phone: "+1 (512) 555-0123",
          social: {
            linkedin: "https://linkedin.com/company/momtech-consulting",
            instagram: "@momtechconsulting",
          },
        },
        ownerInfo: {
          name: "Sarah Chen",
          isMother: true,
          story:
            "After struggling to balance tech leadership roles with motherhood, Sarah founded MomTech to help other companies create truly flexible work environments.",
          yearsInBusiness: 3,
        },
        services: [
          "Remote Work Setup",
          "Team Collaboration Tools",
          "Digital Transformation",
          "Tech Training",
        ],
        specializations: [
          "Slack Administration",
          "Project Management Tools",
          "Cloud Migration",
        ],
        supportingMoms: true,
        lookingForCollaborators: true,
        hiringStatus: "open-to-opportunities",
        workArrangements: ["remote", "flexible"],
        tags: ["technology", "consulting", "remote-work", "family-friendly"],
        verified: true,
        createdAt: new Date("2023-06-15"),
        businessName: "MomTech Consulting",
        ownerName: "Sarah Chen",
        ownerId: "owner_1",
        category: "Technology Consulting",
        images: ["https://momtechconsulting.com/image1.jpg"],
        isVerified: true,
        rating: 4.9,
        reviewCount: 23,
        isMomOwned: true,
      },
      {
        _id: "business_2",
        name: "Balanced Marketing Agency",
        description:
          "Full-service marketing agency run by working mothers, specializing in authentic brand storytelling for family-oriented businesses.",
        industry: "Marketing & Advertising",
        location: "Denver, CO",
        website: "https://balancedmarketing.co",
        contact: {
          email: "team@balancedmarketing.co",
          social: {
            linkedin: "https://linkedin.com/company/balanced-marketing",
            instagram: "@balancedmarketing",
            facebook: "https://facebook.com/balancedmarketingco",
          },
        },
        ownerInfo: {
          name: "Jessica Rodriguez & Maria Thompson",
          isMother: true,
          story:
            "Two marketing executives who left corporate to create an agency that proves you can deliver exceptional work while prioritizing family.",
          yearsInBusiness: 2,
        },
        services: [
          "Content Marketing",
          "Social Media Management",
          "Brand Strategy",
          "Email Marketing",
        ],
        specializations: [
          "Family Brand Messaging",
          "Parent Audience Targeting",
          "Authentic Storytelling",
        ],
        supportingMoms: true,
        lookingForCollaborators: true,
        hiringStatus: "actively-hiring",
        workArrangements: ["remote", "hybrid", "flexible"],
        tags: ["marketing", "branding", "content", "family-focused"],
        verified: true,
        createdAt: new Date("2023-03-20"),
        businessName: "Balanced Marketing Agency",
        ownerName: "Jessica Rodriguez & Maria Thompson",
        ownerId: "owner_2",
        category: "Marketing & Advertising",
        images: ["https://balancedmarketing.co/image1.jpg"],
        isVerified: true,
        rating: 4.8,
        reviewCount: 17,
        isMomOwned: true,
      },
      {
        _id: "business_3",
        name: "FlexCareers Coaching",
        description:
          "Career coaching and resume services specifically for working mothers returning to work or changing careers.",
        industry: "Professional Services",
        location: "Remote (based in Portland, OR)",
        website: "https://flexcareerscoaching.com",
        contact: {
          email: "coach@flexcareerscoaching.com",
          social: {
            linkedin: "https://linkedin.com/company/flexcareers-coaching",
          },
        },
        ownerInfo: {
          name: "Amanda Foster",
          isMother: true,
          story:
            "Former HR executive turned career coach, helping hundreds of mothers successfully navigate career transitions and return to work.",
          yearsInBusiness: 4,
        },
        services: [
          "Career Coaching",
          "Resume Writing",
          "Interview Prep",
          "LinkedIn Optimization",
        ],
        specializations: [
          "Return-to-Work Planning",
          "Career Change Strategies",
          "Work-Life Integration",
        ],
        supportingMoms: true,
        lookingForCollaborators: false,
        hiringStatus: "open-to-opportunities",
        workArrangements: ["remote", "flexible"],
        tags: [
          "career-coaching",
          "professional-development",
          "working-mothers",
        ],
        verified: true,
        createdAt: new Date("2022-09-10"),
        businessName: "FlexCareers Coaching",
        ownerName: "Amanda Foster",
        ownerId: "owner_3",
        category: "Professional Services",
        images: ["https://flexcareerscoaching.com/image1.jpg"],
        isVerified: true,
        rating: 4.7,
        reviewCount: 12,
        isMomOwned: true,
      },
    ];
  }

  private getMockAIInsights(userId: string): AICareerInsight {
    return {
      _id: "ai_insight_1",
      userId: userId,
      insights: {
        strengthsAnalysis: [
          "Exceptional time management and multitasking abilities developed through parenting experience",
          "Strong leadership skills with proven ability to manage teams and drive results",
          "Advanced education combined with practical industry experience",
          "Diverse skill set spanning multiple areas of expertise",
          "Commitment to continuous learning evidenced by professional certifications",
        ],
        careerPathSuggestions: [
          "VP of Marketing at mission-driven tech company with family-friendly culture",
          "Director of Digital Strategy at established B2B SaaS organization",
          "Independent marketing consultant specializing in working parent demographics",
          "Chief Marketing Officer at early-stage startup focused on work-life balance",
          "Marketing Strategy Lead for Fortune 500 company with strong diversity initiatives",
        ],
        skillGapAnalysis: [
          "Advanced data science and AI applications in marketing for competitive advantage",
          "Marketing automation platform expertise (Marketo, Pardot) for enterprise-level roles",
          "International marketing and global expansion strategies for senior positions",
          "Executive presentation and board-level communication skills",
          "Change management and organizational development capabilities",
        ],
        marketTrends: [
          "Remote and flexible work arrangements now standard expectation, not perk",
          "Companies actively seeking working mothers for leadership diversity initiatives",
          "Marketing roles increasingly requiring technical and analytical skill sets",
          "B-corp and mission-driven companies experiencing 25% growth in job postings",
          "Demand for fractional executives and consultants up 40% among experienced professionals",
          "Work-life integration support becoming key differentiator in competitive talent market",
        ],
        salaryInsights: {
          currentMarketRate:
            "$135,000 - $170,000 for Senior Marketing Manager in SF Bay Area with your experience",
          growthPotential:
            "25-40% salary increase potential with director-level promotion within 18 months",
          recommendations: [
            "Your experience level commands top 25% of market rates in current role",
            "Remote work flexibility could add $10-15k premium to total compensation",
            "Consider equity compensation packages for high-growth companies",
            "Additional marketing automation certifications could increase value by $8-12k annually",
          ],
        },
        workLifeBalanceRecommendations: [
          "Target companies with established parental leave policies (12+ weeks paid)",
          "Look for organizations with other working mothers in senior leadership positions",
          "Consider B-corp certified companies that prioritize work-life balance metrics",
          "Explore roles with outcome-based performance metrics rather than time-based requirements",
          "Research companies offering childcare support, stipends, or on-site facilities",
          "Prioritize organizations with employee resource groups for working parents",
        ],
        networkingOpportunities: [
          "Women in Marketing Leadership SF Bay Area Chapter",
          "Tech Moms Professional Network quarterly events",
          "Stanford Alumni Marketing Professionals Group",
          "B2B Marketing Leaders Breakfast Series",
          "Working Parents in Tech Slack Community (15k+ members)",
          "Chief Marketing Officer Council for mission-driven companies",
        ],
        personalizedAdvice: [
          "Leverage your unique perspective as a working mother - it's a competitive advantage, not a limitation",
          "Consider fractional CMO roles with multiple startups for accelerated experience and network growth",
          "Your combination of analytical skills and empathy makes you ideal for customer-centric marketing roles",
          "Build thought leadership by sharing insights about marketing to working parent demographics",
          "Explore mentoring opportunities - your experience is valuable to other working mothers in marketing",
        ],
        nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        improvementAreas: [
          "Expand your technical marketing skills by learning basic data analytics.",
          "Practice executive-level presentations to boost boardroom confidence.",
          "Seek mentorship from senior leaders in your target industry.",
        ],
      },
      personalizedTips: [
        "Schedule regular networking sessions with other working mothers in your field.",
        "Update your LinkedIn profile to highlight your unique strengths as a parent.",
        "Consider taking a short online course in marketing automation.",
      ],
      confidenceScore: 87,
      generatedAt: new Date(),
      lastUpdated: new Date(),
    };
  }
}

export const careerService = new CareerService();

// Add these methods to your existing CareerService class
class EnhancedCareerService extends CareerService {
  async getPersonalizedJobRecommendations(
    userProfile: UserProfile,
    filters?: Record<string, any>
  ): Promise<JobRecommendation[]> {
    const cacheKey = cacheManager.generateKey('jobs', { 
      userId: userProfile._id, 
      ...filters 
    });
    
    // Check cache first
    const cachedJobs = cacheManager.get<JobRecommendation[]>(cacheKey);
    if (cachedJobs) {
      console.log('Returning cached job recommendations');
      return cachedJobs;
    }
    
    try {
      // Get jobs from hybrid service (real + fallback)
      const rawJobs = await hybridCareerService.getPersonalizedJobRecommendations(userProfile, filters);
      
      // Clean and validate data
      const cleanJobs = dataQualityManager.cleanAndValidateJobs(rawJobs);
      
      // Convert model JobRecommendations to service JobRecommendations
      const convertedJobs: JobRecommendation[] = cleanJobs.map((job: ModelJobRecommendation) => ({
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        workArrangement: job.workArrangement,
        salaryRange: job.salaryRange,
        requiredSkills: job.requiredSkills || [],
        preferredSkills: job.preferredSkills || [],
        description: job.description,
        matchScore: job.matchScore,
        isMaternityFriendly: job.isMaternityFriendly || false,
        flexibleHours: job.flexibleHours || false,
        benefitsHighlights: job.benefitsHighlights || [],
        applicationDeadline: job.applicationDeadline,
        applicationUrl: job.applicationUrl,
        reasonsForMatch: job.reasonsForMatch,
        postedDate: job.postedDate,
        jobType: job.jobType || 'full-time',
        experienceLevel: job.experienceLevel || 'mid',
        companySize: job.companySize || 'medium',
        companyStage: job.companyStage || 'established',
        diversityCommitment: job.diversityCommitment || false,
        parentingSupport: job.parentingSupport || [],
      }));
      
      // Cache for 30 minutes
      cacheManager.set(cacheKey, convertedJobs, 30);
      
      return convertedJobs;
    } catch (error) {
      console.error('Error in enhanced job recommendations:', error);
      // Return empty array rather than failing
      return [];
    }
  }
  
  async getPersonalizedTips(
    userId: string,
    limit: number = 20
  ): Promise<CareerTip[]> {
    const cacheKey = cacheManager.generateKey('tips', { userId });
    
    const cachedTips = cacheManager.get<CareerTip[]>(cacheKey);
    if (cachedTips) {
      return cachedTips;
    }
    
    try {
      // Get user profile first
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        console.warn(`User profile not found for userId: ${userId}`);
        return super.getPersonalizedTips(userId, limit);
      }
      
      const rawTips = await hybridCareerService.getPersonalizedTips(userProfile);
      const cleanTips = dataQualityManager.cleanAndValidateTips(rawTips);
      
      // Apply limit if specified
      const limitedTips = limit > 0 ? cleanTips.slice(0, limit) : cleanTips;
      
      // Cache for 4 hours
      cacheManager.set(cacheKey, limitedTips, 240);
      
      return limitedTips;
    } catch (error) {
      console.error('Error in enhanced tips generation:', error);
      // Fallback to parent class implementation
      return super.getPersonalizedTips(userId, limit);
    }
  }
  
  async generateComprehensiveInsights(userProfile: UserProfile): Promise<AICareerInsight> {
    const cacheKey = cacheManager.generateKey('insights', { userId: userProfile._id });
    
    const cachedInsights = cacheManager.get<AICareerInsight>(cacheKey);
    if (cachedInsights) {
      return cachedInsights;
    }
    
    try {
      const insights = await hybridCareerService.generateAICareerInsights(userProfile);
      
      // Cache for 24 hours
      cacheManager.set(cacheKey, insights, 1440);
      
      return insights;
    } catch (error) {
      console.error('Error generating comprehensive insights:', error);
      throw error;
    }
  }
}

export const enhancedCareerService = new EnhancedCareerService();
