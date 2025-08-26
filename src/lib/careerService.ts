// lib/careerService.ts
// import UserProfile from "@/models/UserProfile";

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

class CareerService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  // Get personalized career tips based on user profile
  async getPersonalizedTips(
    userId: string,
    limit: number = 20
  ): Promise<CareerTip[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/career/tips?userId=${userId}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch career tips");
      }
      const data = await response.json();
      return data.tips || this.getMockTips();
    } catch (error) {
      console.error("Error fetching career tips:", error);
      return this.getMockTips();
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

  // Get job recommendations with AI-powered matching
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
      const queryParams = new URLSearchParams({
        userId,
        limit: limit.toString(),
        ...(filters && Object.fromEntries(
          Object.entries(filters)
            .filter(([ value]) => value !== undefined)
            .map(([key, value]) => [key, value.toString()])
        )),
      });

      const response = await fetch(
        `${this.baseUrl}/api/career/jobs?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job recommendations");
      }
      const data = await response.json();
      return data.jobs || this.getMockJobs();
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      return this.getMockJobs();
    }
  }

  // Get freelance opportunities
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
      const response = await fetch(
        `${this.baseUrl}/api/career/freelance?userId=${userId}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch freelance opportunities");
      }
      const data = await response.json();
      return data.opportunities || this.getMockFreelanceOps();
    } catch (error) {
      console.error("Error fetching freelance opportunities:", error);
      return this.getMockFreelanceOps();
    }
  }

  // Get small businesses directory
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
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        ...(filters && Object.fromEntries(
          Object.entries(filters)
            .filter(([ value]) => value !== undefined)
            .map(([key, value]) => [key, value.toString()])
        )),
      });

      const response = await fetch(
        `${this.baseUrl}/api/career/businesses?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch small businesses");
      }
      const data = await response.json();
      return data.businesses || this.getMockBusinesses();
    } catch (error) {
      console.error("Error fetching small businesses:", error);
      return this.getMockBusinesses();
    }
  }

  // Generate AI career insights
  async generateAICareerInsights(
    userId: string,
    forceRegenerate: boolean = false
  ): Promise<AICareerInsight> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ forceRegenerate }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI insights");
      }
      const data = await response.json();
      return data || this.getMockAIInsights(userId);
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
    applicationData: Record<string, any>
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
