// // // lib/services/realTimeCareerService.ts
// // import { UserProfile } from "@/models/Career";
// // import {
// //   CareerTip,
// //   JobRecommendation,
// //   FreelanceOpportunity,
// //   SmallBusiness,
// //   AICareerInsight,
// // } from "@/models/Career";

// // interface JobSearchAPI {
// //   results: Array<{
// //     id: string;
// //     title: string;
// //     company: { display_name: string };
// //     location: { display_name: string };
// //     description: string;
// //     salary_min?: number;
// //     salary_max?: number;
// //     contract_type?: string;
// //     created: string;
// //     redirect_url: string;
// //     category: { label: string };
// //   }>;
// // }

// // interface LinkedInJobsAPI {
// //   jobs: Array<{
// //     id: string;
// //     title: string;
// //     company: string;
// //     location: string;
// //     description: string;
// //     posted_at: string;
// //     job_url: string;
// //     salary?: {
// //       min: number;
// //       max: number;
// //       currency: string;
// //     };
// //     employment_type: string;
// //     seniority_level: string;
// //   }>;
// // }

// // interface UpworkAPI {
// //   jobs: Array<{
// //     id: string;
// //     title: string;
// //     snippet: string;
// //     budget?: number;
// //     hourly_range?: {
// //       min: number;
// //       max: number;
// //     };
// //     job_type: string;
// //     skills: string[];
// //     client: {
// //       name: string;
// //       rating: number;
// //     };
// //     date_created: string;
// //     url: string;
// //   }>;
// // }

// // class RealTimeCareerService {
// //   private readonly API_KEYS = {
// //     ADZUNA: process.env.ADZUNA_API_KEY,
// //     RAPID_API: process.env.RAPIDAPI_KEY,
// //     OPENAI: process.env.OPENAI_API_KEY,
// //     ANTHROPIC: process.env.ANTHROPIC_API_KEY,
// //   };

// //   // Get real job data from multiple sources
// //   async getPersonalizedJobRecommendations(
// //     userProfile: UserProfile,
// //     filters?: Record<string, any>
// //   ): Promise<JobRecommendation[]> {
// //     const jobs: JobRecommendation[] = [];

// //     try {
// //       // Parallel API calls to multiple job boards
// //       const [adzunaJobs, linkedinJobs, remoteOkJobs] = await Promise.allSettled(
// //         [
// //           this.fetchAdzunaJobs(userProfile, filters),
// //           this.fetchLinkedInJobs(userProfile, filters),
// //           this.fetchRemoteOKJobs(userProfile, filters),
// //         ]
// //       );

// //       // Process Adzuna jobs
// //       if (adzunaJobs.status === "fulfilled") {
// //         jobs.push(...adzunaJobs.value);
// //       }

// //       // Process LinkedIn jobs
// //       if (linkedinJobs.status === "fulfilled") {
// //         jobs.push(...linkedinJobs.value);
// //       }

// //       // Process Remote OK jobs
// //       if (remoteOkJobs.status === "fulfilled") {
// //         jobs.push(...remoteOkJobs.value);
// //       }

// //       // Sort by match score and apply AI ranking
// //       return this.applyAIJobRanking(jobs, userProfile);
// //     } catch (error) {
// //       console.error("Error fetching job recommendations:", error);
// //       return [];
// //     }
// //   }

// //   private async fetchAdzunaJobs(
// //     userProfile: UserProfile,
// //     filters?: Record<string, any>
// //   ): Promise<JobRecommendation[]> {
// //     const baseUrl = "https://api.adzuna.com/v1/api/jobs/us/search/1";
// //     const params = new URLSearchParams({
// //       app_id: process.env.ADZUNA_APP_ID!,
// //       app_key: this.API_KEYS.ADZUNA!,
// //       what:
// //         userProfile.skillsAndExperience?.join(" ") ||
// //         userProfile.currentRole ||
// //         "",
// //       where: userProfile.location || "remote",
// //       results_per_page: "50",
// //       sort_by: "relevance",
// //     });

// //     if (filters?.salaryMin) {
// //       params.append("salary_min", filters.salaryMin.toString());
// //     }

// //     try {
// //       const response = await fetch(`${baseUrl}?${params}`);
// //       if (!response.ok) throw new Error("Adzuna API error");

// //       const data: JobSearchAPI = await response.json();

// //       return data.results.map((job) => ({
// //         _id: `adzuna_${job.id}`,
// //         title: job.title,
// //         company: job.company.display_name,
// //         location: job.location.display_name,
// //         type: this.normalizeJobType(job.contract_type || "full-time"),
// //         workArrangement: this.determineWorkArrangement(
// //           job.location.display_name,
// //           job.description
// //         ),
// //         salaryRange:
// //           job.salary_min && job.salary_max
// //             ? {
// //                 min: job.salary_min,
// //                 max: job.salary_max,
// //                 currency: "USD",
// //               }
// //             : undefined,
// //         description: job.description.slice(0, 500) + "...",
// //         requirements: this.extractRequirements(job.description),
// //         benefits: this.extractBenefits(job.description),
// //         isMaternityFriendly: this.detectMaternityFriendly(job.description),
// //         flexibleHours: this.detectFlexibleHours(job.description),
// //         applicationUrl: job.redirect_url,
// //         postedDate: new Date(job.created),
// //         matchScore: this.calculateMatchScore(job, userProfile),
// //         reasonsForMatch: this.generateMatchReasons(job, userProfile),
// //         jobType: this.normalizeJobType(job.contract_type || "full-time"),
// //         experienceLevel: this.determineExperienceLevel(
// //           job.title,
// //           job.description
// //         ),
// //         companySize: "unknown",
// //         companyStage: "established",
// //         diversityCommitment: this.detectDiversityCommitment(job.description),
// //         parentingSupport: this.extractParentingSupport(job.description),
// //       }));
// //     } catch (error) {
// //       console.error("Adzuna API error:", error);
// //       return [];
// //     }
// //   }

// //   private async fetchLinkedInJobs(
// //     userProfile: UserProfile,
// //     filters?: Record<string, any>
// //   ): Promise<JobRecommendation[]> {
// //     // Using RapidAPI's LinkedIn Jobs API
// //     const url = "https://linkedin-jobs-search.p.rapidapi.com/";
// //     const options = {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         "X-RapidAPI-Key": this.API_KEYS.RAPID_API!,
// //         "X-RapidAPI-Host": "linkedin-jobs-search.p.rapidapi.com",
// //       },
// //       body: JSON.stringify({
// //         query:
// //           userProfile.skillsAndExperience?.join(" ") ||
// //           userProfile.currentRole ||
// //           "",
// //         location: userProfile.location || "United States",
// //         dateSincePosted: "week",
// //         jobType: filters?.type || "all",
// //         remoteFilter:
// //           userProfile.workPreference === "remote" ? "remote" : "all",
// //         limit: 50,
// //       }),
// //     };

// //     try {
// //       const response = await fetch(url, options);
// //       if (!response.ok) throw new Error("LinkedIn API error");

// //       const data: LinkedInJobsAPI = await response.json();

// //       return data.jobs.map((job) => ({
// //         _id: `linkedin_${job.id}`,
// //         title: job.title,
// //         company: job.company,
// //         location: job.location,
// //         type: this.normalizeJobType(job.employment_type),
// //         workArrangement: this.determineWorkArrangement(
// //           job.location,
// //           job.description
// //         ),
// //         salaryRange: job.salary,
// //         description: job.description.slice(0, 500) + "...",
// //         requirements: this.extractRequirements(job.description),
// //         benefits: this.extractBenefits(job.description),
// //         isMaternityFriendly: this.detectMaternityFriendly(job.description),
// //         flexibleHours: this.detectFlexibleHours(job.description),
// //         applicationUrl: job.job_url,
// //         postedDate: new Date(job.posted_at),
// //         matchScore: this.calculateLinkedInMatchScore(job, userProfile),
// //         reasonsForMatch: this.generateLinkedInMatchReasons(job, userProfile),
// //         jobType: this.normalizeJobType(job.employment_type),
// //         experienceLevel: (job.seniority_level as any) || "mid",
// //         companySize: "unknown",
// //         companyStage: "established",
// //         diversityCommitment: this.detectDiversityCommitment(job.description),
// //         parentingSupport: this.extractParentingSupport(job.description),
// //       }));
// //     } catch (error) {
// //       console.error("LinkedIn API error:", error);
// //       return [];
// //     }
// //   }

// //   private async fetchRemoteOKJobs(
// //     userProfile: UserProfile,
// //     filters?: Record<string, any>
// //   ): Promise<JobRecommendation[]> {
// //     try {
// //       const response = await fetch("https://remoteok.io/api");
// //       if (!response.ok) throw new Error("RemoteOK API error");

// //       const data = await response.json();

// //       return data.slice(1, 51).map((job: any) => ({
// //         _id: `remoteok_${job.id}`,
// //         title: job.position,
// //         company: job.company,
// //         location: "Remote",
// //         type: "full-time" as const,
// //         workArrangement: "remote" as const,
// //         salaryRange:
// //           job.salary_min && job.salary_max
// //             ? {
// //                 min: job.salary_min,
// //                 max: job.salary_max,
// //                 currency: "USD",
// //               }
// //             : undefined,
// //         description: job.description?.slice(0, 500) + "..." || "",
// //         requirements: job.tags || [],
// //         benefits: ["Remote work", "Flexible schedule"],
// //         isMaternityFriendly: true,
// //         flexibleHours: true,
// //         applicationUrl: job.url || `https://remoteok.io/remote-jobs/${job.id}`,
// //         postedDate: new Date(job.date),
// //         matchScore: this.calculateRemoteOKMatchScore(job, userProfile),
// //         reasonsForMatch: [
// //           `Matches ${userProfile.workPreference} preference`,
// //           "Remote-first company",
// //         ],
// //         jobType: "full-time" as const,
// //         experienceLevel: "mid" as const,
// //         companySize: "unknown" as const,
// //         companyStage: "established" as const,
// //         diversityCommitment: true,
// //         parentingSupport: ["Remote work flexibility", "Async communication"],
// //       }));
// //     } catch (error) {
// //       console.error("RemoteOK API error:", error);
// //       return [];
// //     }
// //   }

// //   // Get real freelance opportunities
// //   async getFreelanceOpportunities(
// //     userProfile: UserProfile
// //   ): Promise<FreelanceOpportunity[]> {
// //     try {
// //       const [upworkJobs, freelancerJobs] = await Promise.allSettled([
// //         this.fetchUpworkJobs(userProfile),
// //         this.fetchFreelancerJobs(userProfile),
// //       ]);

// //       const opportunities: FreelanceOpportunity[] = [];

// //       if (upworkJobs.status === "fulfilled") {
// //         opportunities.push(...upworkJobs.value);
// //       }

// //       if (freelancerJobs.status === "fulfilled") {
// //         opportunities.push(...freelancerJobs.value);
// //       }

// //       return opportunities.sort((a, b) => b.matchScore - a.matchScore);
// //     } catch (error) {
// //       console.error("Error fetching freelance opportunities:", error);
// //       return [];
// //     }
// //   }

// //   private async fetchUpworkJobs(
// //     userProfile: UserProfile
// //   ): Promise<FreelanceOpportunity[]> {
// //     // Using RapidAPI's Upwork Jobs API
// //     const url = "https://upwork-jobs-search.p.rapidapi.com/api/jobs";
// //     const options = {
// //       method: "GET",
// //       headers: {
// //         "X-RapidAPI-Key": this.API_KEYS.RAPID_API!,
// //         "X-RapidAPI-Host": "upwork-jobs-search.p.rapidapi.com",
// //       },
// //     };

// //     try {
// //       const response = await fetch(
// //         `${url}?query=${encodeURIComponent(
// //           userProfile.skillsAndExperience?.join(" ") || ""
// //         )}`,
// //         options
// //       );
// //       if (!response.ok) throw new Error("Upwork API error");

// //       const data: UpworkAPI = await response.json();

// //       return data.jobs.map((job) => ({
// //         _id: `upwork_${job.id}`,
// //         title: job.title,
// //         clientName: job.client.name,
// //         projectType: this.determineProjectType(job.job_type),
// //         budget: {
// //           min: job.hourly_range?.min || job.budget || 0,
// //           max: job.hourly_range?.max || job.budget || 0,
// //           currency: "USD",
// //           type: job.hourly_range ? "hourly" : "fixed",
// //         },
// //         duration: this.estimateDuration(job.snippet),
// //         skillsRequired: job.skills,
// //         description: job.snippet,
// //         isRemote: true,
// //         applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
// //         postedDate: new Date(job.date_created),
// //         experienceLevel: this.determineFreelanceExperienceLevel(job.snippet),
// //         matchScore: this.calculateFreelanceMatchScore(job, userProfile),
// //       }));
// //     } catch (error) {
// //       console.error("Upwork API error:", error);
// //       return [];
// //     }
// //   }

// //   // Generate AI-powered personalized tips
// //   async generatePersonalizedTips(
// //     userProfile: UserProfile
// //   ): Promise<CareerTip[]> {
// //     try {
// //       const prompt = this.buildTipsPrompt(userProfile);
// //       const response = await this.callOpenAI(prompt);

// //       return this.parseTipsResponse(response);
// //     } catch (error) {
// //       console.error("Error generating personalized tips:", error);
// //       return this.getFallbackTips(userProfile);
// //     }
// //   }

// //   private buildTipsPrompt(userProfile: UserProfile): string {
// //     return `Generate 5 personalized career tips for a working mother with the following profile:

// // Profile:
// // - Name: ${userProfile.name}
// // - Current Role: ${userProfile.currentRole || "Not specified"}
// // - Industry: ${userProfile.industry || "Not specified"}
// // - Years of Experience: ${userProfile.yearsOfExperience || "Not specified"}
// // - Skills: ${userProfile.skillsAndExperience?.join(", ") || "Not specified"}
// // - Work Preference: ${userProfile.workPreference || "Not specified"}
// // - Current Status: ${userProfile.availabilityStatus || "Not specified"}
// // - Location: ${userProfile.location || "Not specified"}
// // - Children Ages: ${userProfile.childrenAges?.join(", ") || "Not specified"}
// // - Is Pregnant: ${userProfile.isPregnant ? "Yes" : "No"}

// // Please provide practical, actionable tips that are specifically relevant to her situation. Focus on:
// // 1. Career advancement opportunities
// // 2. Work-life balance strategies
// // 3. Skill development recommendations
// // 4. Networking opportunities
// // 5. Industry-specific advice

// // Format each tip with a title and detailed content (2-3 sentences).`;
// //   }

// //   private async callOpenAI(prompt: string): Promise<string> {
// //     const response = await fetch("https://api.openai.com/v1/chat/completions", {
// //       method: "POST",
// //       headers: {
// //         Authorization: `Bearer ${this.API_KEYS.OPENAI}`,
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         model: "gpt-3.5-turbo",
// //         messages: [
// //           {
// //             role: "system",
// //             content:
// //               "You are a career advisor specializing in helping working mothers advance their careers while maintaining work-life balance.",
// //           },
// //           {
// //             role: "user",
// //             content: prompt,
// //           },
// //         ],
// //         max_tokens: 1500,
// //         temperature: 0.7,
// //       }),
// //     });

// //     if (!response.ok) {
// //       throw new Error("OpenAI API error");
// //     }

// //     const data = await response.json();
// //     return data.choices[0].message.content;
// //   }

// //   // Generate comprehensive AI career insights
// //   async generateAICareerInsights(
// //     userProfile: UserProfile
// //   ): Promise<AICareerInsight> {
// //     try {
// //       const [
// //         strengthsAnalysis,
// //         careerPathSuggestions,
// //         skillGapAnalysis,
// //         marketTrends,
// //         salaryInsights,
// //         workLifeBalanceRecommendations,
// //       ] = await Promise.all([
// //         this.analyzeStrengths(userProfile),
// //         this.suggestCareerPaths(userProfile),
// //         this.analyzeSkillGaps(userProfile),
// //         this.getMarketTrends(userProfile),
// //         this.getSalaryInsights(userProfile),
// //         this.getWorkLifeBalanceRecommendations(userProfile),
// //       ]);

// //       const personalizedTips = await this.generatePersonalizedTips(userProfile);

// //       return {
// //         _id: `ai_insight_${Date.now()}`,
// //         userId: userProfile._id,
// //         insights: {
// //           strengthsAnalysis,
// //           improvementAreas: await this.identifyImprovementAreas(userProfile),
// //           careerPathSuggestions,
// //           skillGapAnalysis,
// //           marketTrends,
// //           salaryInsights,
// //           workLifeBalanceRecommendations,
// //           networkingOpportunities: await this.getNetworkingOpportunities(
// //             userProfile
// //           ),
// //           personalizedAdvice: await this.getPersonalizedAdvice(userProfile),
// //           nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
// //         },
// //         personalizedTips,
// //         generatedAt: new Date(),
// //         nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
// //       };
// //     } catch (error) {
// //       console.error("Error generating AI insights:", error);
// //       throw error;
// //     }
// //   }

// //   // Get real business directory data
// //   async getSmallBusinesses(
// //     filters?: Record<string, any>
// //   ): Promise<SmallBusiness[]> {
// //     try {
// //       // Use multiple data sources for business listings
// //       const [yelpBusinesses, googleBusinesses] = await Promise.allSettled([
// //         this.fetchYelpBusinesses(filters),
// //         this.fetchGoogleBusinesses(filters),
// //       ]);

// //       const businesses: SmallBusiness[] = [];

// //       if (yelpBusinesses.status === "fulfilled") {
// //         businesses.push(...yelpBusinesses.value);
// //       }

// //       if (googleBusinesses.status === "fulfilled") {
// //         businesses.push(...googleBusinesses.value);
// //       }

// //       return businesses.filter(
// //         (business) => business.isMomOwned || Math.random() > 0.7
// //       ); // Simulate mom-owned filtering
// //     } catch (error) {
// //       console.error("Error fetching businesses:", error);
// //       return [];
// //     }
// //   }

// //   // Helper methods for data processing and matching
// //   private calculateMatchScore(job: any, userProfile: UserProfile): number {
// //     let score = 0;
// //     const weights = {
// //       skills: 0.3,
// //       location: 0.2,
// //       workArrangement: 0.25,
// //       experience: 0.15,
// //       industry: 0.1,
// //     };

// //     // Skills matching
// //     if (userProfile.skillsAndExperience) {
// //       const jobSkills = this.extractSkills(job.description || job.title);
// //       const matchingSkills = userProfile.skillsAndExperience.filter((skill) =>
// //         jobSkills.some(
// //           (jobSkill) =>
// //             jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
// //             skill.toLowerCase().includes(jobSkill.toLowerCase())
// //         )
// //       );
// //       score +=
// //         (matchingSkills.length /
// //           Math.max(userProfile.skillsAndExperience.length, 1)) *
// //         weights.skills *
// //         100;
// //     }

// //     // Location matching
// //     const jobLocation = job.location?.display_name || job.location || "";
// //     if (
// //       userProfile.workPreference === "remote" &&
// //       jobLocation.toLowerCase().includes("remote")
// //     ) {
// //       score += weights.location * 100;
// //     } else if (
// //       userProfile.location &&
// //       jobLocation.toLowerCase().includes(userProfile.location.toLowerCase())
// //     ) {
// //       score += weights.location * 100;
// //     }

// //     // Experience matching
// //     const experienceLevel = this.determineExperienceLevel(
// //       job.title,
// //       job.description
// //     );
// //     if (userProfile.yearsOfExperience) {
// //       if (experienceLevel === "entry" && userProfile.yearsOfExperience <= 2)
// //         score += weights.experience * 100;
// //       else if (
// //         experienceLevel === "mid" &&
// //         userProfile.yearsOfExperience >= 2 &&
// //         userProfile.yearsOfExperience <= 7
// //       )
// //         score += weights.experience * 100;
// //       else if (
// //         experienceLevel === "senior" &&
// //         userProfile.yearsOfExperience > 7
// //       )
// //         score += weights.experience * 100;
// //     }

// //     return Math.min(Math.round(score), 100);
// //   }

// //   private determineWorkArrangement(
// //     location: string,
// //     description?: string
// //   ): "remote" | "hybrid" | "onsite" {
// //     const text = `${location} ${description || ""}`.toLowerCase();

// //     if (
// //       text.includes("remote") ||
// //       text.includes("work from home") ||
// //       text.includes("distributed")
// //     ) {
// //       return "remote";
// //     } else if (text.includes("hybrid") || text.includes("flexible")) {
// //       return "hybrid";
// //     }
// //     return "onsite";
// //   }

// //   private detectMaternityFriendly(description: string): boolean {
// //     const keywords = [
// //       "maternity",
// //       "parental leave",
// //       "family-friendly",
// //       "work-life balance",
// //       "flexible schedule",
// //       "childcare",
// //     ];
// //     return keywords.some((keyword) =>
// //       description.toLowerCase().includes(keyword)
// //     );
// //   }

// //   private detectFlexibleHours(description: string): boolean {
// //     const keywords = [
// //       "flexible hours",
// //       "flexible schedule",
// //       "work-life balance",
// //       "remote",
// //       "hybrid",
// //     ];
// //     return keywords.some((keyword) =>
// //       description.toLowerCase().includes(keyword)
// //     );
// //   }

// //   private extractRequirements(description: string): string[] {
// //     // Simple keyword extraction for requirements
// //     const skillKeywords = [
// //       "javascript",
// //       "python",
// //       "react",
// //       "node.js",
// //       "sql",
// //       "marketing",
// //       "sales",
// //       "management",
// //       "design",
// //       "analytics",
// //     ];
// //     return skillKeywords.filter((skill) =>
// //       description.toLowerCase().includes(skill.toLowerCase())
// //     );
// //   }

// //   private extractBenefits(description: string): string[] {
// //     const benefitKeywords = [
// //       "health insurance",
// //       "401k",
// //       "flexible hours",
// //       "remote work",
// //       "pto",
// //       "vacation",
// //       "dental",
// //       "vision",
// //     ];
// //     return benefitKeywords.filter((benefit) =>
// //       description.toLowerCase().includes(benefit.toLowerCase())
// //     );
// //   }

// //   private normalizeJobType(
// //     type: string
// //   ): "full-time" | "part-time" | "contract" | "freelance" | "internship" {
// //     const normalized = type.toLowerCase();
// //     if (normalized.includes("full")) return "full-time";
// //     if (normalized.includes("part")) return "part-time";
// //     if (normalized.includes("contract") || normalized.includes("temporary"))
// //       return "contract";
// //     if (normalized.includes("freelance") || normalized.includes("gig"))
// //       return "freelance";
// //     if (normalized.includes("intern")) return "internship";
// //     return "full-time";
// //   }

// //   private determineExperienceLevel(
// //     title: string,
// //     description?: string
// //   ): "entry" | "mid" | "senior" | "executive" {
// //     const text = `${title} ${description || ""}`.toLowerCase();

// //     if (
// //       text.includes("senior") ||
// //       text.includes("lead") ||
// //       text.includes("principal")
// //     )
// //       return "senior";
// //     if (
// //       text.includes("director") ||
// //       text.includes("vp") ||
// //       text.includes("executive")
// //     )
// //       return "executive";
// //     if (
// //       text.includes("junior") ||
// //       text.includes("entry") ||
// //       text.includes("associate")
// //     )
// //       return "entry";
// //     return "mid";
// //   }

// //   // Placeholder methods for other API implementations
// //   private async fetchFreelancerJobs(
// //     userProfile: UserProfile
// //   ): Promise<FreelanceOpportunity[]> {
// //     // Implementation for Freelancer.com API
// //     return [];
// //   }

// //   private async fetchYelpBusinesses(
// //     filters?: Record<string, any>
// //   ): Promise<SmallBusiness[]> {
// //     // Implementation for Yelp Fusion API
// //     return [];
// //   }

// //   private async fetchGoogleBusinesses(
// //     filters?: Record<string, any>
// //   ): Promise<SmallBusiness[]> {
// //     // Implementation for Google My Business API
// //     return [];
// //   }

// //   // AI analysis methods
// //   private async analyzeStrengths(userProfile: UserProfile): Promise<string[]> {
// //     const prompt = `Analyze the career strengths of this working mother: ${JSON.stringify(
// //       userProfile
// //     )}. List 3-5 key strengths.`;
// //     const response = await this.callOpenAI(prompt);
// //     return this.parseListResponse(response);
// //   }

// //   private async suggestCareerPaths(
// //     userProfile: UserProfile
// //   ): Promise<string[]> {
// //     const prompt = `Suggest 3-5 career paths for this working mother: ${JSON.stringify(
// //       userProfile
// //     )}.`;
// //     const response = await this.callOpenAI(prompt);
// //     return this.parseListResponse(response);
// //   }

// //   private async analyzeSkillGaps(userProfile: UserProfile): Promise<string[]> {
// //     const prompt = `Identify skill gaps for this working mother to advance her career: ${JSON.stringify(
// //       userProfile
// //     )}.`;
// //     const response = await this.callOpenAI(prompt);
// //     return this.parseListResponse(response);
// //   }

// //   private async getMarketTrends(userProfile: UserProfile): Promise<string[]> {
// //     // This could integrate with industry reports APIs or news APIs
// //     return [
// //       "Remote work opportunities continue to expand post-pandemic",
// //       "Companies increasingly value diversity and inclusion",
// //       "Skills-based hiring is becoming more prevalent",
// //       "AI and automation are creating new job categories",
// //       "Work-life balance is a top priority for employers",
// //     ];
// //   }

// //   private async getSalaryInsights(userProfile: UserProfile): Promise<any> {
// //     // This could integrate with salary comparison APIs like Glassdoor
// //     return {
// //       currentMarketRate: `$${
// //         (userProfile.yearsOfExperience || 0) * 8000 + 45000
// //       }-${(userProfile.yearsOfExperience || 0) * 12000 + 70000}`,
// //       growthPotential: "15-25% increase potential with skill development",
// //       recommendations: [
// //         "Consider negotiating for remote work flexibility",
// //         "Pursue industry certifications to increase market value",
// //         "Build leadership experience through project management",
// //       ],
// //     };
// //   }

// //   private async getWorkLifeBalanceRecommendations(
// //     userProfile: UserProfile
// //   ): Promise<string[]> {
// //     return [
// //       "Look for companies with strong parental leave policies",
// //       "Consider flexible scheduling options",
// //       "Seek roles with outcome-based performance metrics",
// //       "Explore remote-first organizations",
// //       "Prioritize companies with employee resource groups for working parents",
// //     ];
// //   }

// //   private async identifyImprovementAreas(
// //     userProfile: UserProfile
// //   ): Promise<string[]> {
// //     const prompt = `Identify 3-4 areas where this working mother could improve for career advancement: ${JSON.stringify(
// //       userProfile
// //     )}.`;
// //     const response = await this.callOpenAI(prompt);
// //     return this.parseListResponse(response);
// //   }

// //   private async getNetworkingOpportunities(
// //     userProfile: UserProfile
// //   ): Promise<string[]> {
// //     return [
// //       "Join professional associations in your industry",
// //       "Attend virtual networking events for working mothers",
// //       "Connect with other parents at your children's school",
// //       "Participate in online communities and forums",
// //       "Seek mentorship opportunities through professional networks",
// //     ];
// //   }

// //   private async getPersonalizedAdvice(
// //     userProfile: UserProfile
// //   ): Promise<string[]> {
// //     const prompt = `Provide 3-4 pieces of personalized career advice for this working mother: ${JSON.stringify(
// //       userProfile
// //     )}.`;
// //     const response = await this.callOpenAI(prompt);
// //     return this.parseListResponse(response);
// //   }

// //   // Utility methods
// //   private parseListResponse(response: string): string[] {
// //     return response
// //       .split("\n")
// //       .filter((line) => line.trim().length > 0)
// //       .map((line) =>
// //         line
// //           .replace(/^\d+\.?\s*/, "")
// //           .replace(/^[-*]\s*/, "")
// //           .trim()
// //       )
// //       .filter((item) => item.length > 10);
// //   }

// //   private parseTipsResponse(response: string): CareerTip[] {
// //     const tips: CareerTip[] = [];
// //     const sections = response.split(/\d+\./);

// //     sections.slice(1).forEach((section, index) => {
// //       const lines = section.trim().split("\n");
// //       const title = lines[0]?.trim();
// //       const content = lines.slice(1).join(" ").trim();

// //       if (title && content) {
// //         tips.push({
// //           _id: `ai_tip_${Date.now()}_${index}`,
// //           title,
// //           content,
// //           category: "career_growth",
// //           targetAudience: ["working_mothers"],
// //           isPersonalized: true,
// //           createdAt: new Date(),
// //           updatedAt: new Date(),
// //           tags: ["ai_generated", "personalized"],
// //           aiGenerated: true,
// //           relevanceScore: 90 + Math.random() * 10,
// //         });
// //       }
// //     });

// //     return tips;
// //   }

// //   private getFallbackTips(userProfile: UserProfile): CareerTip[] {
// //     // Fallback tips in case AI generation fails
// //     return [
// //       {
// //         _id: "fallback_1",
// //         title: "Leverage Your Unique Perspective",
// //         content:
// //           "Your experience as a working mother provides valuable skills in time management, multitasking, and problem-solving under pressure. Highlight these strengths in interviews and on your resume.",
// //         category: "career_growth",
// //         targetAudience: ["working_mothers"],
// //         isPersonalized: true,
// //         createdAt: new Date(),
// //         updatedAt: new Date(),
// //         tags: ["strengths", "interview_tips"],
// //         aiGenerated: false,
// //         relevanceScore: 85,
// //       },
// //     ];
// //   }

// //   private extractSkills(text: string): string[] {
// //     // Simple skill extraction - could be enhanced with NLP
// //     const commonSkills = [
// //       "javascript",
// //       "python",
// //       "react",
// //       "node.js",
// //       "sql",
// //       "marketing",
// //       "sales",
// //       "management",
// //       "design",
// //       "analytics",
// //       "project management",
// //       "communication",
// //       "leadership",
// //       "strategic planning",
// //     ];

// //     return commonSkills.filter((skill) =>
// //       text.toLowerCase().includes(skill.toLowerCase())
// //     );
// //   }

// //   private calculateLinkedInMatchScore(
// //     job: any,
// //     userProfile: UserProfile
// //   ): number {
// //     return this.calculateMatchScore(job, userProfile);
// //   }

// //   private generateLinkedInMatchReasons(
// //     job: any,
// //     userProfile: UserProfile
// //   ): string[] {
// //     return this.generateMatchReasons(job, userProfile);
// //   }

// //   private generateMatchReasons(job: any, userProfile: UserProfile): string[] {
// //     const reasons: string[] = [];

// //     // Skills match
// //     if (userProfile.skillsAndExperience) {
// //       const jobSkills = this.extractSkills(job.description || job.title);
// //       const matchingSkills = userProfile.skillsAndExperience.filter((skill) =>
// //         jobSkills.some((jobSkill) =>
// //           jobSkill.toLowerCase().includes(skill.toLowerCase())
// //         )
// //       );
// //       if (matchingSkills.length > 0) {
// //         reasons.push(
// //           `Your skills match ${
// //             matchingSkills.length
// //           } requirements: ${matchingSkills.slice(0, 3).join(", ")}`
// //         );
// //       }
// //     }

// //     // Work arrangement match
// //     const workArrangement = this.determineWorkArrangement(
// //       job.location?.display_name || job.location,
// //       job.description
// //     );
// //     if (userProfile.workPreference === workArrangement) {
// //       reasons.push(`Perfect match for your ${workArrangement} work preference`);
// //     }

// //     // Family-friendly features
// //     if (this.detectMaternityFriendly(job.description)) {
// //       reasons.push("Company offers family-friendly benefits");
// //     }

// //     if (this.detectFlexibleHours(job.description)) {
// //       reasons.push("Flexible working hours available");
// //     }

// //     return reasons.slice(0, 4);
// //   }

// //   private calculateRemoteOKMatchScore(
// //     job: any,
// //     userProfile: UserProfile
// //   ): number {
// //     let score = 60; // Base score for remote jobs

// //     if (userProfile.workPreference === "remote") {
// //       score += 25;
// //     }

// //     if (userProfile.skillsAndExperience && job.tags) {
// //       const matchingSkills = userProfile.skillsAndExperience.filter((skill) =>
// //         job.tags.some(
// //           (tag: string) =>
// //             tag.toLowerCase().includes(skill.toLowerCase()) ||
// //             skill.toLowerCase().includes(tag.toLowerCase())
// //         )
// //       );
// //       score +=
// //         (matchingSkills.length /
// //           Math.max(userProfile.skillsAndExperience.length, 1)) *
// //         15;
// //     }

// //     return Math.min(Math.round(score), 100);
// //   }

// //   private calculateFreelanceMatchScore(
// //     job: any,
// //     userProfile: UserProfile
// //   ): number {
// //     let score = 0;

// //     if (userProfile.skillsAndExperience && job.skills) {
// //       const matchingSkills = userProfile.skillsAndExperience.filter((skill) =>
// //         job.skills.some(
// //           (jobSkill: string) =>
// //             jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
// //             skill.toLowerCase().includes(jobSkill.toLowerCase())
// //         )
// //       );
// //       score += (matchingSkills.length / Math.max(job.skills.length, 1)) * 50;
// //     }

// //     // Budget match
// //     if (userProfile.desiredSalaryRange && job.hourly_range) {
// //       const userHourlyMin = userProfile.desiredSalaryRange.min / 160; // Monthly to hourly
// //       if (job.hourly_range.min >= userHourlyMin) {
// //         score += 30;
// //       }
// //     }

// //     // Client rating bonus
// //     if (job.client && job.client.rating > 4.5) {
// //       score += 20;
// //     }

// //     return Math.min(Math.round(score), 100);
// //   }

// //   private determineProjectType(jobType: string): string {
// //     if (jobType.toLowerCase().includes("long")) return "long-term";
// //     if (jobType.toLowerCase().includes("short")) return "short-term";
// //     return "ongoing";
// //   }

// //   private estimateDuration(description: string): string {
// //     if (description.toLowerCase().includes("week")) return "1-2 weeks";
// //     if (description.toLowerCase().includes("month")) return "1-3 months";
// //     return "2-6 weeks";
// //   }

// //   private determineFreelanceExperienceLevel(
// //     description: string
// //   ): "beginner" | "intermediate" | "expert" {
// //     const text = description.toLowerCase();
// //     if (
// //       text.includes("expert") ||
// //       text.includes("senior") ||
// //       text.includes("advanced")
// //     )
// //       return "expert";
// //     if (text.includes("intermediate") || text.includes("experienced"))
// //       return "intermediate";
// //     return "beginner";
// //   }

// //   private detectDiversityCommitment(description: string): boolean {
// //     const keywords = [
// //       "diversity",
// //       "inclusion",
// //       "equal opportunity",
// //       "eeo",
// //       "diverse",
// //       "inclusive",
// //     ];
// //     return keywords.some((keyword) =>
// //       description.toLowerCase().includes(keyword)
// //     );
// //   }

// //   private extractParentingSupport(description: string): string[] {
// //     const support: string[] = [];
// //     const text = description.toLowerCase();

// //     if (text.includes("childcare")) support.push("Childcare support");
// //     if (text.includes("parental leave")) support.push("Parental leave");
// //     if (text.includes("flexible")) support.push("Flexible schedule");
// //     if (text.includes("remote")) support.push("Remote work options");
// //     if (text.includes("family")) support.push("Family-friendly culture");

// //     return support;
// //   }

// //   // Apply AI-powered job ranking based on user profile
// //   private async applyAIJobRanking(
// //     jobs: JobRecommendation[],
// //     userProfile: UserProfile
// //   ): Promise<JobRecommendation[]> {
// //     // Sort by match score first
// //     const sortedJobs = jobs.sort((a, b) => b.matchScore - a.matchScore);

// //     // Apply additional AI-based filtering and ranking
// //     const personalizedJobs = sortedJobs.filter((job) => {
// //       // Filter out jobs that don't meet basic criteria
// //       if (
// //         userProfile.workPreference === "remote" &&
// //         job.workArrangement === "onsite"
// //       ) {
// //         return false;
// //       }

// //       // Prioritize family-friendly jobs for mothers
// //       if (userProfile.childrenAges && userProfile.childrenAges.length > 0) {
// //         return (
// //           job.isMaternityFriendly ||
// //           job.flexibleHours ||
// //           job.workArrangement !== "onsite"
// //         );
// //       }

// //       return true;
// //     });

// //     // Apply final personalization boost
// //     return personalizedJobs
// //       .map((job) => ({
// //         ...job,
// //         matchScore: this.applyPersonalizationBoost(job, userProfile),
// //       }))
// //       .sort((a, b) => b.matchScore - a.matchScore);
// //   }

// //   private applyPersonalizationBoost(
// //     job: JobRecommendation,
// //     userProfile: UserProfile
// //   ): number {
// //     let boost = 0;

// //     // Boost for working mothers with specific needs
// //     if (userProfile.childrenAges && userProfile.childrenAges.length > 0) {
// //       if (job.isMaternityFriendly) boost += 10;
// //       if (job.flexibleHours) boost += 8;
// //       if (job.workArrangement === "remote") boost += 5;
// //     }

// //     // Boost for career stage alignment
// //     if (
// //       userProfile.yearsOfExperience &&
// //       userProfile.yearsOfExperience > 7 &&
// //       job.experienceLevel === "senior"
// //     ) {
// //       boost += 5;
// //     }

// //     // Boost for industry match
// //     if (
// //       userProfile.industry &&
// //       job.title.toLowerCase().includes(userProfile.industry.toLowerCase())
// //     ) {
// //       boost += 8;
// //     }

// //     return Math.min(job.matchScore + boost, 100);
// //   }
// // }

// // export const realTimeCareerService = new RealTimeCareerService();



// // lib/services/realTimeCareerService.ts - Complete Implementation
// import { aiService } from '@/lib/utils/aiService';
// import { UserProfile, JobRecommendation, FreelanceOpportunity, SmallBusiness, CareerTip } from '@/models/Career';

// interface JobFilters {
//   type?: string;
//   workArrangement?: string;
//   location?: string;
//   salaryMin?: number;
//   experienceLevel?: string;
// }

// interface BusinessFilters {
//   category?: string;
//   location?: string;
//   momOwned?: boolean;
//   searchQuery?: string;
//   hiringStatus?: string;
// }

// interface FreelanceFilters {
//   projectType?: string;
//   budgetMin?: number;
//   duration?: string;
//   skillsRequired?: string[];
// }

// class RealTimeCareerService {
//   private adzunaAppId: string;
//   private adzunaApiKey: string;
//   private rapidApiKey: string;
//   private yelpApiKey: string;
//   private googlePlacesKey: string;
//   private cache: Map<string, { data: any; expires: number }>;
//   private rateLimits: Map<string, { requests: number; resetTime: number }>;

//   constructor() {
//     this.adzunaAppId = process.env.ADZUNA_APP_ID || '';
//     this.adzunaApiKey = process.env.ADZUNA_API_KEY || '';
//     this.rapidApiKey = process.env.RAPIDAPI_KEY || '';
//     this.yelpApiKey = process.env.YELP_API_KEY || '';
//     this.googlePlacesKey = process.env.GOOGLE_PLACES_API_KEY || '';
//     this.cache = new Map();
//     this.rateLimits = new Map();
//   }

//   // Main method for getting personalized job recommendations
//   async getPersonalizedJobRecommendations(user: UserProfile, filters?: JobFilters): Promise<JobRecommendation[]> {
//     const cacheKey = `jobs_${user._id}_${JSON.stringify(filters)}`;
//     const cached = this.getFromCache(cacheKey, 30); // 30 minutes cache
//     if (cached) return cached;

//     const jobs: JobRecommendation[] = [];

//     try {
//       // Try Adzuna first (most reliable)
//       if (this.canMakeRequest('adzuna') && this.adzunaAppId && this.adzunaApiKey) {
//         console.log('Fetching jobs from Adzuna...');
//         const adzunaJobs = await this.fetchAdzunaJobs(user, filters);
//         jobs.push(...adzunaJobs);
//         this.recordRequest('adzuna');
//       }

//       // Try RapidAPI sources if we need more jobs
//       if (jobs.length < 10 && this.canMakeRequest('rapidapi') && this.rapidApiKey) {
//         console.log('Fetching jobs from RapidAPI sources...');
//         const rapidJobs = await this.fetchRapidApiJobs(user, filters);
//         jobs.push(...rapidJobs);
//         this.recordRequest('rapidapi');
//       }

//       // If still not enough jobs, use enhanced mock data
//       if (jobs.length === 0) {
//         console.log('Using enhanced mock job data...');
//         const mockJobs = this.getMockJobs();
//         const personalizedJobs = await this.personalizeJobsWithAI(mockJobs, user);
//         jobs.push(...personalizedJobs);
//       }

//       // Calculate match scores using AI and user profile
//       const jobsWithScores = await this.calculateMatchScores(jobs, user);
      
//       // Sort by match score and remove duplicates
//       const uniqueJobs = this.removeDuplicateJobs(jobsWithScores);
//       const sortedJobs = uniqueJobs
//         .sort((a, b) => b.matchScore - a.matchScore)
//         .slice(0, 20);

//       this.setCache(cacheKey, sortedJobs, 30);
//       return sortedJobs;

//     } catch (error) {
//       console.error('Error fetching job recommendations:', error);
//       // Return fallback mock data
//       const fallbackJobs = this.getMockJobs().slice(0, 5);
//       return await this.calculateMatchScores(fallbackJobs, user);
//     }
//   }

//   // Fetch jobs from Adzuna API
//   async fetchAdzunaJobs(user: UserProfile, filters?: JobFilters): Promise<JobRecommendation[]> {
//     try {
//       const location = this.normalizeLocation(filters?.location || user.location || 'US');
//       const query = this.buildJobQuery(user, filters);
//       const page = 1;
//       const resultsPerPage = 20;
      
//       const url = `https://api.adzuna.com/v1/api/jobs/us/search/${page}` +
//         `?app_id=${this.adzunaAppId}` +
//         `&app_key=${this.adzunaApiKey}` +
//         `&what=${encodeURIComponent(query)}` +
//         `&where=${encodeURIComponent(location)}` +
//         `&results_per_page=${resultsPerPage}` +
//         `&sort_by=relevance`;

//       console.log(`Adzuna API URL: ${url}`);

//       const response = await fetch(url, {
//         headers: {
//           'User-Agent': 'CareerPlatform/1.0'
//         }
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Adzuna API error ${response.status}:`, errorText);
//         throw new Error(`Adzuna API error: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(`Adzuna returned ${data.results?.length || 0} jobs`);
      
//       return (data.results || []).map((job: any) => this.transformAdzunaJob(job, location));

//     } catch (error) {
//       console.error('Error fetching Adzuna jobs:', error);
//       return [];
//     }
//   }

//   // Fetch jobs from RapidAPI sources
//   async fetchRapidApiJobs(user: UserProfile, filters?: JobFilters): Promise<JobRecommendation[]> {
//     const jobs: JobRecommendation[] = [];

//     try {
//       // Try LinkedIn Jobs API first
//       const linkedInJobs = await this.fetchLinkedInJobs(user, filters);
//       jobs.push(...linkedInJobs);

//       // Try Indeed Jobs API if we need more
//       if (jobs.length < 5) {
//         const indeedJobs = await this.fetchIndeedJobs(user, filters);
//         jobs.push(...indeedJobs);
//       }
      
//       return jobs;
//     } catch (error) {
//       console.error('Error fetching RapidAPI jobs:', error);
//       return [];
//     }
//   }

//   // Fetch LinkedIn jobs via RapidAPI
//   async fetchLinkedInJobs(user: UserProfile, filters?: JobFilters): Promise<JobRecommendation[]> {
//     try {
//       const query = this.buildJobQuery(user, filters);
//       const location = filters?.location || user.location || 'United States';

//       const response = await fetch('https://linkedin-jobs-search.p.rapidapi.com/jobs', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-RapidAPI-Key': this.rapidApiKey,
//           'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
//         },
//       {
//         _id: "mock_freelance_2",
//         title: "Marketing Automation Setup & Optimization",
//         clientName: "E-commerce Growth Agency",
//         client: "E-commerce Growth Agency",
//         projectType: "long-term",
//         budgetRange: { min: 75, max: 120, currency: "USD", paymentType: "hourly" },
//         budget: { min: 75, max: 120, currency: "USD", type: "hourly" },
//         duration: "3-6 months",
//         skillsRequired: ["HubSpot", "Marketing Automation", "Email Marketing", "Lead Nurturing"],
//         description: "Set up and optimize marketing automation workflows for growing e-commerce clients. Ongoing project with potential for extension. Flexible hours and remote work encouraged.",
//         matchScore: 0,
//         isRemote: true,
//         postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//         difficultyLevel: "advanced",
//         clientRating: 4.9,
//         paymentVerified: true,
//         experienceLevel: "advanced"
//       }
//     ];
//   }

//   private getMockBusinesses(): SmallBusiness[] {
//     return [
//       {
//         _id: "mock_business_1",
//         name: "Creative Consulting Collective",
//         businessName: "Creative Consulting Collective",
//         description: "Woman-owned consulting firm specializing in brand strategy and digital marketing for small businesses. We support other entrepreneurs in building sustainable, profitable businesses.",
//         industry: "Marketing & Consulting",
//         location: "Austin, TX (Remote services available)",
//         category: "Professional Services",
//         website: "https://creativeconsultingcollective.com",
//         contact: {
//           email: "hello@creativeconsultingcollective.com",
//           phone: "(512) 555-0199",
//           social: {
//             linkedin: "https://linkedin.com/company/creative-consulting-collective",
//             instagram: "@creativeconsultingco"
//           }
//         },
//         ownerInfo: {
//           name: "Sarah Martinez",
//           isMother: true,
//           story: "Former corporate marketing executive who started her own consultancy to have more flexibility while raising her two children. Now helps other women achieve similar work-life balance.",
//           yearsInBusiness: 4
//         },
//         ownerName: "Sarah Martinez",
//         ownerId: "owner_1",
//         services: ["Brand Strategy", "Digital Marketing", "Business Consulting", "Content Creation"],
//         specializations: ["Small Business Growth", "Women-Owned Business Support", "Remote Team Building"],
//         supportingMoms: true,
//         lookingForCollaborators: true,
//         hiringStatus: "open-to-opportunities",
//         workArrangements: ["remote", "hybrid", "flexible"],
//         tags: ["marketing", "consulting", "women-owned", "family-friendly"],
//         verified: true,
//         isVerified: true,
//         rating: 4.8,
//         reviewCount: 24,
//         isMomOwned: true,
//         images: ["https://example.com/business1.jpg"],
//         createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
//       },
//       {
//         _id: "mock_business_2",
//         name: "FlexWork Solutions",
//         businessName: "FlexWork Solutions",
//         description: "HR consulting firm focused on helping companies implement flexible work policies and support working parents. Founded by working mothers who understand the challenges firsthand.",
//         industry: "Human Resources",
//         location: "Remote (Portland, OR based)",
//         category: "Professional Services",
//         website: "https://flexworksolutions.co",
//         contact: {
//           email: "team@flexworksolutions.co",
//           phone: "(503) 555-0177",
//           social: {
//             linkedin: "https://linkedin.com/company/flexwork-solutions"
//           }
//         },
//         ownerInfo: {
//           name: "Jessica Chen & Maria Rodriguez",
//           isMother: true,
//           story: "Two HR professionals who left corporate to create a consulting firm that helps companies build truly inclusive, family-friendly workplaces.",
//           yearsInBusiness: 3
//         },
//         ownerName: "Jessica Chen & Maria Rodriguez",
//         ownerId: "owner_2",
//         services: ["HR Consulting", "Policy Development", "Training Programs", "Workplace Culture Assessment"],
//         specializations: ["Flexible Work Policies", "Parental Leave Planning", "Inclusive Hiring Practices"],
//         supportingMoms: true,
//         lookingForCollaborators: true,
//         hiringStatus: "actively-hiring",
//         workArrangements: ["remote", "flexible"],
//         tags: ["hr", "consulting", "flexible-work", "inclusive-workplace"],
//         verified: true,
//         isVerified: true,
//         rating: 4.9,
//         reviewCount: 18,
//         isMomOwned: true,
//         images: ["https://example.com/business2.jpg"],
//         createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
//       }
//     ];
//   }

//   // Cleanup method to prevent memory leaks
//   public cleanup(): void {
//     this.cache.clear();
//     this.rateLimits.clear();
//   }
// }

// // Export singleton instance
// export const realTimeCareerService = new RealTimeCareerService();

// // Export cleanup function for proper shutdown
// export const cleanupCareerService = () => {
//   realTimeCareerService.cleanup();
// };

// // Health check function
// export const checkCareerServiceHealth = async () => {
//   const health = {
//     status: 'healthy',
//     apis: {
//       adzuna: !!process.env.ADZUNA_API_KEY && !!process.env.ADZUNA_APP_ID,
//       rapidapi: !!process.env.RAPIDAPI_KEY,
//       huggingface: !!process.env.HUGGINGFACE_API_KEY,
//       yelp: !!process.env.YELP_API_KEY,
//       googlePlaces: !!process.env.GOOGLE_PLACES_API_KEY
//     },
//     cache: {
//       size: realTimeCareerService['cache'].size,
//       rateLimits: realTimeCareerService['rateLimits'].size
//     },
//     timestamp: new Date().toISOString()
//   };

//   const configuredApis = Object.values(health.apis).filter(Boolean).length;
//   if (configuredApis < 2) {
//     health.status = 'degraded';
//   }

//   return health;
// };
//         body: JSON.stringify({
//           query: query,
//           location: location,
//           datePosted: 'anyTime',
//           sort: 'mostRelevant',
//           start: 0
//         })
//       });

//       if (!response.ok) {
//         console.error(`LinkedIn API error: ${response.status}`);
//         return [];
//       }

//       const data = await response.json();
//       console.log(`LinkedIn API returned ${data.jobs?.length || 0} jobs`);
      
//       return (data.jobs || []).map((job: any) => this.transformLinkedInJob(job));

//     } catch (error) {
//       console.error('Error fetching LinkedIn jobs:', error);
//       return [];
//     }
//   }

//   // Fetch Indeed jobs via RapidAPI
//   async fetchIndeedJobs(user: UserProfile, filters?: JobFilters): Promise<JobRecommendation[]> {
//     try {
//       const query = this.buildJobQuery(user, filters);
//       const location = filters?.location || user.location || 'US';

//       const url = `https://indeed-jobs-api.p.rapidapi.com/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=1`;
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'X-RapidAPI-Key': this.rapidApiKey,
//           'X-RapidAPI-Host': 'indeed-jobs-api.p.rapidapi.com'
//         }
//       });

//       if (!response.ok) {
//         console.error(`Indeed API error: ${response.status}`);
//         return [];
//       }

//       const data = await response.json();
//       console.log(`Indeed API returned ${data.jobs?.length || 0} jobs`);
      
//       return (data.jobs || []).map((job: any) => this.transformIndeedJob(job));

//     } catch (error) {
//       console.error('Error fetching Indeed jobs:', error);
//       return [];
//     }
//   }

//   // Get freelance opportunities
//   async getFreelanceOpportunities(user: UserProfile, filters?: FreelanceFilters): Promise<FreelanceOpportunity[]> {
//     const cacheKey = `freelance_${user._id}_${JSON.stringify(filters)}`;
//     const cached = this.getFromCache(cacheKey, 60); // 1 hour cache
//     if (cached) return cached;

//     try {
//       let opportunities: FreelanceOpportunity[] = [];

//       // Try Upwork API via RapidAPI
//       if (this.canMakeRequest('upwork') && this.rapidApiKey) {
//         console.log('Fetching from Upwork API...');
//         opportunities = await this.fetchUpworkJobs(user, filters);
//         this.recordRequest('upwork');
//       }

//       // Fallback to enhanced mock data
//       if (opportunities.length === 0) {
//         console.log('Using enhanced mock freelance data...');
//         opportunities = await this.personalizeFreelanceOps(this.getMockFreelanceOps(), user);
//       }

//       // Calculate match scores
//       const opportunitiesWithScores = opportunities.map(opp => ({
//         ...opp,
//         matchScore: this.calculateFreelanceMatch(opp, user)
//       }));

//       const result = opportunitiesWithScores
//         .sort((a, b) => b.matchScore - a.matchScore)
//         .slice(0, 15);

//       this.setCache(cacheKey, result, 60);
//       return result;

//     } catch (error) {
//       console.error('Error fetching freelance opportunities:', error);
//       return this.getMockFreelanceOps();
//     }
//   }

//   // Fetch Upwork jobs
//   async fetchUpworkJobs(user: UserProfile, filters?: FreelanceFilters): Promise<FreelanceOpportunity[]> {
//     try {
//       const skills = user.skillsAndExperience?.slice(0, 3).join(',') || 'professional';
      
//       const response = await fetch('https://upwork-jobs.p.rapidapi.com/jobs', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-RapidAPI-Key': this.rapidApiKey,
//           'X-RapidAPI-Host': 'upwork-jobs.p.rapidapi.com'
//         },
//         body: JSON.stringify({
//           skills: skills,
//           sort: 'recency',
//           paging: '0;20'
//         })
//       });

//       if (!response.ok) {
//         console.error(`Upwork API error: ${response.status}`);
//         return [];
//       }

//       const data = await response.json();
//       console.log(`Upwork API returned ${data.jobs?.length || 0} jobs`);
      
//       return (data.jobs || []).map((job: any) => this.transformUpworkJob(job));

//     } catch (error) {
//       console.error('Error fetching Upwork jobs:', error);
//       return [];
//     }
//   }

//   // Get small businesses directory
//   async getSmallBusinesses(filters?: BusinessFilters): Promise<SmallBusiness[]> {
//     const cacheKey = `businesses_${JSON.stringify(filters)}`;
//     const cached = this.getFromCache(cacheKey, 120); // 2 hours cache
//     if (cached) return cached;

//     try {
//       let businesses: SmallBusiness[] = [];

//       // Try Yelp API first
//       if (this.canMakeRequest('yelp') && this.yelpApiKey) {
//         console.log('Fetching from Yelp API...');
//         businesses = await this.fetchYelpBusinesses(filters);
//         this.recordRequest('yelp');
//       }

//       // Try Google Places as backup
//       if (businesses.length < 5 && this.canMakeRequest('google') && this.googlePlacesKey) {
//         console.log('Fetching from Google Places API...');
//         const googleBusinesses = await this.fetchGooglePlaces(filters);
//         businesses.push(...googleBusinesses);
//         this.recordRequest('google');
//       }

//       // Fallback to mock data
//       if (businesses.length === 0) {
//         console.log('Using mock business data...');
//         businesses = this.getMockBusinesses();
//       }

//       // Filter and sort results
//       const filteredBusinesses = this.filterBusinesses(businesses, filters);
//       const result = filteredBusinesses.slice(0, 25);

//       this.setCache(cacheKey, result, 120);
//       return result;

//     } catch (error) {
//       console.error('Error fetching small businesses:', error);
//       return this.getMockBusinesses();
//     }
//   }

//   // Fetch businesses from Yelp
//   async fetchYelpBusinesses(filters?: BusinessFilters): Promise<SmallBusiness[]> {
//     try {
//       const location = filters?.location || 'US';
//       const category = this.mapBusinessCategory(filters?.category);
//       const limit = 25;

//       const url = `https://api.yelp.com/v3/businesses/search?location=${encodeURIComponent(location)}&categories=${category}&limit=${limit}&sort_by=rating`;

//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${this.yelpApiKey}`
//         }
//       });

//       if (!response.ok) {
//         console.error(`Yelp API error: ${response.status}`);
//         return [];
//       }

//       const data = await response.json();
//       console.log(`Yelp API returned ${data.businesses?.length || 0} businesses`);
      
//       return (data.businesses || []).map((business: any) => this.transformYelpBusiness(business));

//     } catch (error) {
//       console.error('Error fetching Yelp businesses:', error);
//       return [];
//     }
//   }

//   // Fetch from Google Places API
//   async fetchGooglePlaces(filters?: BusinessFilters): Promise<SmallBusiness[]> {
//     try {
//       const query = filters?.searchQuery || 'small business';
//       const location = filters?.location || 'US';

//       const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' in ' + location)}&key=${this.googlePlacesKey}&type=establishment`;

//       const response = await fetch(url);

//       if (!response.ok) {
//         console.error(`Google Places API error: ${response.status}`);
//         return [];
//       }

//       const data = await response.json();
//       console.log(`Google Places API returned ${data.results?.length || 0} businesses`);
      
//       return (data.results || []).map((place: any) => this.transformGooglePlace(place));

//     } catch (error) {
//       console.error('Error fetching Google Places:', error);
//       return [];
//     }
//   }

//   // Generate personalized tips using AI
//   async generatePersonalizedTips(user: UserProfile): Promise<CareerTip[]> {
//     const cacheKey = `tips_${user._id}`;
//     const cached = this.getFromCache(cacheKey, 240); // 4 hours cache
//     if (cached) return cached;

//     try {
//       // Use AI service to generate personalized tips
//       const aiTips = await aiService.generatePersonalizedTips(user);
      
//       const formattedTips = aiTips.map((tipContent, index) => ({
//         _id: `ai_tip_${Date.now()}_${index}`,
//         title: this.generateTipTitle(tipContent),
//         content: tipContent,
//         category: this.categorizeTip(tipContent, user),
//         difficulty: this.determineDifficulty(tipContent),
//         timeToImplement: this.estimateTimeToImplement(tipContent),
//         tags: this.extractTipTags(tipContent, user),
//         isPersonalized: true,
//         relevanceScore: 85 + Math.random() * 10,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         targetAudience: this.getTargetAudience(user),
//         aiGenerated: true
//       }));

//       this.setCache(cacheKey, formattedTips, 240);
//       return formattedTips;

//     } catch (error) {
//       console.error('Error generating personalized tips:', error);
//       return this.getMockTips();
//     }
//   }

//   // Generate AI career insights
//   async generateAICareerInsights(user: UserProfile): Promise<any> {
//     try {
//       return await aiService.generateCareerInsights(user);
//     } catch (error) {
//       console.error('Error generating AI insights:', error);
//       return this.getFallbackInsights(user);
//     }
//   }

//   // Data transformation methods
//   private transformAdzunaJob(job: any, location: string): JobRecommendation {
//     return {
//       _id: `adzuna_${job.id}`,
//       title: job.title,
//       company: job.company?.display_name || 'Company Not Listed',
//       location: job.location?.display_name || location,
//       workArrangement: this.detectWorkArrangement(job.description || ''),
//       salaryRange: {
//         min: job.salary_min || 0,
//         max: job.salary_max || 0,
//         currency: 'USD'
//       },
//       requiredSkills: this.extractSkills(job.description || ''),
//       preferredSkills: [],
//       description: this.cleanDescription(job.description || ''),
//       matchScore: 0,
//       isMaternityFriendly: this.detectMaternityFriendly(job.description || ''),
//       flexibleHours: this.detectFlexibleHours(job.description || ''),
//       benefitsHighlights: this.extractBenefits(job.description || ''),
//       applicationUrl: job.redirect_url,
//       postedDate: new Date(job.created),
//       jobType: this.detectJobType(job.description || ''),
//       experienceLevel: this.detectExperienceLevel(job.description || ''),
//       companySize: 'unknown',
//       companyStage: 'established',
//       diversityCommitment: this.detectDiversityCommitment(job.description || ''),
//       parentingSupport: this.extractParentingSupport(job.description || '')
//     };
//   }

//   private transformLinkedInJob(job: any): JobRecommendation {
//     return {
//       _id: `linkedin_${job.id || Date.now()}`,
//       title: job.title || 'Position Available',
//       company: job.company || 'Company Not Listed',
//       location: job.location || 'Location Not Specified',
//       workArrangement: this.detectWorkArrangement(job.description || ''),
//       salaryRange: this.parseSalary(job.salary),
//       requiredSkills: this.extractSkills(job.description || ''),
//       preferredSkills: [],
//       description: this.cleanDescription(job.description || ''),
//       matchScore: 0,
//       isMaternityFriendly: this.detectMaternityFriendly(job.description || ''),
//       flexibleHours: this.detectFlexibleHours(job.description || ''),
//       benefitsHighlights: this.extractBenefits(job.description || ''),
//       applicationUrl: job.url || job.link,
//       postedDate: new Date(job.postedAt || Date.now()),
//       jobType: this.detectJobType(job.description || ''),
//       experienceLevel: this.detectExperienceLevel(job.description || ''),
//       companySize: 'unknown',
//       companyStage: 'established',
//       diversityCommitment: this.detectDiversityCommitment(job.description || ''),
//       parentingSupport: this.extractParentingSupport(job.description || '')
//     };
//   }

//   private transformIndeedJob(job: any): JobRecommendation {
//     return {
//       _id: `indeed_${job.id || Date.now()}`,
//       title: job.title || 'Position Available',
//       company: job.company || 'Company Not Listed',
//       location: job.location || 'Location Not Specified',
//       workArrangement: this.detectWorkArrangement(job.summary || ''),
//       salaryRange: this.parseSalary(job.salary),
//       requiredSkills: this.extractSkills(job.summary || ''),
//       preferredSkills: [],
//       description: this.cleanDescription(job.summary || ''),
//       matchScore: 0,
//       isMaternityFriendly: this.detectMaternityFriendly(job.summary || ''),
//       flexibleHours: this.detectFlexibleHours(job.summary || ''),
//       benefitsHighlights: this.extractBenefits(job.summary || ''),
//       applicationUrl: job.url,
//       postedDate: new Date(job.date || Date.now()),
//       jobType: this.detectJobType(job.summary || ''),
//       experienceLevel: this.detectExperienceLevel(job.summary || ''),
//       companySize: 'unknown',
//       companyStage: 'established',
//       diversityCommitment: this.detectDiversityCommitment(job.summary || ''),
//       parentingSupport: this.extractParentingSupport(job.summary || '')
//     };
//   }

//   private transformUpworkJob(job: any): FreelanceOpportunity {
//     return {
//       _id: `upwork_${job.id || Date.now()}`,
//       title: job.title || 'Freelance Project',
//       clientName: job.client?.country || 'Client',
//       client: job.client?.country || 'Client',
//       projectType: this.mapProjectType(job.duration),
//       budgetRange: {
//         min: job.budget?.min || 0,
//         max: job.budget?.max || 0,
//         currency: 'USD',
//         paymentType: job.budget?.type || 'project'
//       },
//       budget: {
//         min: job.budget?.min || 0,
//         max: job.budget?.max || 0,
//         currency: 'USD',
//         type: job.budget?.type || 'project'
//       },
//       duration: job.duration || 'Not specified',
//       skillsRequired: Array.isArray(job.skills) ? job.skills : [],
//       description: this.cleanDescription(job.description || ''),
//       matchScore: 0,
//       isRemote: true,
//       applicationDeadline: job.deadline ? new Date(job.deadline) : undefined,
//       postedDate: new Date(job.posted || Date.now()),
//       difficultyLevel: this.mapExperienceLevel(job.tier),
//       clientRating: job.client?.rating || 0,
//       paymentVerified: job.client?.verified || false,
//       experienceLevel: this.mapExperienceLevel(job.tier)
//     };
//   }

//   private transformYelpBusiness(business: any): SmallBusiness {
//     return {
//       _id: `yelp_${business.id}`,
//       name: business.name,
//       businessName: business.name,
//       description: this.generateBusinessDescription(business),
//       industry: business.categories?.[0]?.title || 'General Business',
//       location: business.location?.display_address?.join(', ') || 'Location Not Specified',
//       category: business.categories?.[0]?.title || 'General',
//       website: business.url,
//       contact: {
//         email: '',
//         phone: business.phone || '',
//         social: {}
//       },
//       ownerInfo: {
//         name: 'Business Owner',
//         isMother: false,
//         story: '',
//         yearsInBusiness: 0
//       },
//       ownerName: 'Business Owner',
//       ownerId: business.id,
//       services: business.categories?.map((cat: any) => cat.title) || [],
//       specializations: [],
//       supportingMoms: false,
//       lookingForCollaborators: false,
//       hiringStatus: 'not-hiring',
//       workArrangements: ['onsite'],
//       tags: business.categories?.map((cat: any) => cat.alias) || [],
//       verified: false,
//       isVerified: false,
//       rating: business.rating || 0,
//       reviewCount: business.review_count || 0,
//       isMomOwned: false,
//       images: business.image_url ? [business.image_url] : [],
//       createdAt: new Date()
//     };
//   }

//   private transformGooglePlace(place: any): SmallBusiness {
//     return {
//       _id: `google_${place.place_id}`,
//       name: place.name,
//       businessName: place.name,
//       description: `${place.name} - ${place.types?.[0]?.replace(/_/g, ' ') || 'Business'}`,
//       industry: place.types?.[0]?.replace(/_/g, ' ') || 'General Business',
//       location: place.formatted_address || 'Location Not Specified',
//       category: place.types?.[0]?.replace(/_/g, ' ') || 'General',
//       website: '',
//       contact: {
//         email: '',
//         phone: '',
//         social: {}
//       },
//       ownerInfo: {
//         name: 'Business Owner',
//         isMother: false,
//         story: '',
//         yearsInBusiness: 0
//       },
//       ownerName: 'Business Owner',
//       ownerId: place.place_id,
//       services: place.types?.map((type: string) => type.replace(/_/g, ' ')) || [],
//       specializations: [],
//       supportingMoms: false,
//       lookingForCollaborators: false,
//       hiringStatus: 'not-hiring',
//       workArrangements: ['onsite'],
//       tags: place.types || [],
//       verified: false,
//       isVerified: false,
//       rating: place.rating || 0,
//       reviewCount: place.user_ratings_total || 0,
//       isMomOwned: false,
//       images: place.photos ? [place.photos[0]] : [],
//       createdAt: new Date()
//     };
//   }

//   // Utility methods for data processing
//   private buildJobQuery(user: UserProfile, filters?: JobFilters): string {
//     const parts = [];
    
//     if (filters?.type) {
//       parts.push(filters.type);
//     } else if (user.currentRole) {
//       parts.push(user.currentRole);
//     }
    
//     if (user.skillsAndExperience && user.skillsAndExperience.length > 0) {
//       parts.push(user.skillsAndExperience[0]);
//     }
    
//     if (filters?.workArrangement) {
//       parts.push(filters.workArrangement);
//     }
    
//     return parts.join(' ') || 'professional opportunities';
//   }

//   private normalizeLocation(location: string): string {
//     const locationMap: { [key: string]: string } = {
//       'US': 'United States',
//       'USA': 'United States',
//       'UK': 'United Kingdom',
//       'CA': 'Canada'
//     };
    
//     return locationMap[location.toUpperCase()] || location;
//   }

//   private async calculateMatchScores(jobs: JobRecommendation[], user: UserProfile): Promise<JobRecommendation[]> {
//     return jobs.map(job => ({
//       ...job,
//       matchScore: this.calculateJobMatch(job, user),
//       reasonsForMatch: this.generateMatchReasons(job, user)
//     }));
//   }

//   private calculateJobMatch(job: JobRecommendation, user: UserProfile): number {
//     let score = 50;

//     // Skill matching (30 points max)
//     if (user.skillsAndExperience) {
//       const matchingSkills = job.requiredSkills.filter(skill => 
//         user.skillsAndExperience!.some(userSkill => 
//           userSkill.toLowerCase().includes(skill.toLowerCase()) ||
//           skill.toLowerCase().includes(userSkill.toLowerCase())
//         )
//       );
//       score += Math.min(matchingSkills.length * 10, 30);
//     }

//     // Work arrangement preference (15 points)
//     if (user.workPreference === job.workArrangement) {
//       score += 15;
//     }

//     // Location matching (10 points)
//     if (user.location && job.location.toLowerCase().includes(user.location.toLowerCase())) {
//       score += 10;
//     }

//     // Experience level matching (10 points)
//     if (user.yearsOfExperience) {
//       const userLevel = this.getUserExperienceLevel(user.yearsOfExperience);
//       if (userLevel === job.experienceLevel) score += 10;
//     }

//     // Family-friendly bonus (20 points)
//     if (user.childrenAges && user.childrenAges.length > 0) {
//       if (job.isMaternityFriendly) score += 10;
//       if (job.flexibleHours) score += 10;
//     }

//     // Salary matching (15 points)
//     if (user.desiredSalaryRange && job.salaryRange.min > 0) {
//       const salaryMatch = this.calculateSalaryMatch(user.desiredSalaryRange, job.salaryRange);
//       score += salaryMatch * 15;
//     }

//     return Math.min(Math.max(score, 0), 100);
//   }

//   private calculateFreelanceMatch(opp: FreelanceOpportunity, user: UserProfile): number {
//     let score = 50;

//     // Skill matching
//     if (user.skillsAndExperience) {
//       const matchingSkills = opp.skillsRequired.filter(skill => 
//         user.skillsAndExperience!.some(userSkill => 
//           skill.toLowerCase().includes(userSkill.toLowerCase())
//         )
//       );
//       score += matchingSkills.length * 8;
//     }

//     // Budget matching
//     if (user.desiredSalaryRange && opp.budget.min > 0) {
//       const hourlyRate = opp.budget.type === 'hourly' ? opp.budget.min : opp.budget.min / 40; // Assume 40 hour project
//       const annualEquivalent = hourlyRate * 2000; // 2000 working hours per year
      
//       if (annualEquivalent >= user.desiredSalaryRange.min) {
//         score += 15;
//       }
//     }

//     // Remote work preference
//     if (user.workPreference === 'remote' && opp.isRemote) {
//       score += 10;
//     }

//     // Experience level matching
//     if (user.yearsOfExperience) {
//       const userLevel = this.getUserExperienceLevel(user.yearsOfExperience);
//       if (this.mapFreelanceExperienceLevel(userLevel) === opp.experienceLevel) {
//         score += 10;
//       }
//     }

//     return Math.min(Math.max(score, 0), 100);
//   }

//   private calculateSalaryMatch(userRange: any, jobRange: any): number {
//     const userMid = (userRange.min + userRange.max) / 2;
//     const jobMid = (jobRange.min + jobRange.max) / 2;
    
//     if (jobRange.min === 0 && jobRange.max === 0) return 0;
    
//     const difference = Math.abs(userMid - jobMid);
//     const maxDifference = Math.max(userMid, jobMid);
    
//     return Math.max(0, 1 - (difference / maxDifference));
//   }

//   private getUserExperienceLevel(years: number): 'entry' | 'mid' | 'senior' | 'executive' {
//     if (years < 2) return 'entry';
//     if (years < 7) return 'mid';
//     if (years < 15) return 'senior';
//     return 'executive';
//   }

//   private mapFreelanceExperienceLevel(level: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
//     const mapping: { [key: string]: 'beginner' | 'intermediate' | 'advanced' | 'expert' } = {
//       'entry': 'beginner',
//       'mid': 'intermediate',
//       'senior': 'advanced',
//       'executive': 'expert'
//     };
//     return mapping[level] || 'intermediate';
//   }

//   private generateMatchReasons(job: JobRecommendation, user: UserProfile): string[] {
//     const reasons = [];

//     if (user.workPreference === job.workArrangement) {
//       reasons.push(`Matches your ${job.workArrangement} work preference`);
//     }

//     if (job.isMaternityFriendly && user.childrenAges && user.childrenAges.length > 0) {
//       reasons.push('Company offers family-friendly policies');
//     }

//     if (user.skillsAndExperience) {
//       const matchingSkills = job.requiredSkills.filter(skill => 
//         user.skillsAndExperience!.some(userSkill => 
//           skill.toLowerCase().includes(userSkill.toLowerCase())
//         )
//       );
//       if (matchingSkills.length > 0) {
//         reasons.push(`Your skills match: ${matchingSkills.slice(0, 2).join(', ')}`);
//       }
//     }

//     if (user.location && job.location.toLowerCase().includes(user.location.toLowerCase())) {
//       reasons.push('Location matches your preferences');
//     }

//     if (job.flexibleHours) {
//       reasons.push('Offers flexible working hours');
//     }

//     return reasons.slice(0, 3); // Limit to 3 reasons
//   }

//   private removeDuplicateJobs(jobs: JobRecommendation[]): JobRecommendation[] {
//     const seen = new Set();
//     return jobs.filter(job => {
//       const key = `${job.title}_${job.company}`.toLowerCase().replace(/\s+/g, '');
//       if (seen.has(key)) {
//         return false;
//       }
//       seen.add(key);
//       return true;
//     });
//   }

//   private async personalizeJobsWithAI(jobs: JobRecommendation[], user: UserProfile): Promise<JobRecommendation[]> {
//     return jobs.map(job => ({
//       ...job,
//       matchScore: this.calculateJobMatch(job, user),
//       reasonsForMatch: this.generateMatchReasons(job, user)
//     }));
//   }

//   private async personalizeFreelanceOps(opportunities: FreelanceOpportunity[], user: UserProfile): Promise<FreelanceOpportunity[]> {
//     return opportunities.map(opp => ({
//       ...opp,
//       matchScore: this.calculateFreelanceMatch(opp, user)
//     }));
//   }

//   private filterBusinesses(businesses: SmallBusiness[], filters?: BusinessFilters): SmallBusiness[] {
//     if (!filters) return businesses;

//     return businesses.filter(business => {
//       if (filters.category && !business.category.toLowerCase().includes(filters.category.toLowerCase())) {
//         return false;
//       }
      
//       if (filters.location && !business.location.toLowerCase().includes(filters.location.toLowerCase())) {
//         return false;
//       }
      
//       if (filters.momOwned && !business.isMomOwned) {
//         return false;
//       }
      
//       if (filters.searchQuery) {
//         const query = filters.searchQuery.toLowerCase();
//         return business.name.toLowerCase().includes(query) || 
//                business.description.toLowerCase().includes(query) ||
//                business.services.some(service => service.toLowerCase().includes(query));
//       }
      
//       if (filters.hiringStatus && business.hiringStatus !== filters.hiringStatus) {
//         return false;
//       }
      
//       return true;
//     });
//   }

//   // Data extraction and detection utilities
//   private detectWorkArrangement(description: string): 'remote' | 'hybrid' | 'onsite' | 'flexible' {
//     const text = description.toLowerCase();
//     if (text.includes('100% remote') || text.includes('fully remote') || text.includes('work from home')) return 'remote';
//     if (text.includes('hybrid') || text.includes('partly remote')) return 'hybrid';
//     if (text.includes('flexible location') || text.includes('flexible work')) return 'flexible';
//     return 'onsite';
//   }

//   private detectMaternityFriendly(description: string): boolean {
//     const text = description.toLowerCase();
//     return text.includes('maternity') || text.includes('parental leave') || 
//            text.includes('family friendly') || text.includes('work life balance') ||
//            text.includes('family support') || text.includes('childcare');
//   }

//   private detectFlexibleHours(description: string): boolean {
//     const text = description.toLowerCase();
//     return text.includes('flexible hours') || text.includes('flexible schedule') ||
//            text.includes('work life balance') || text.includes('flexible timing') ||
//            text.includes('core hours') || text.includes('flexi time');
//   }

//   private extractSkills(description: string): string[] {
//     const commonSkills = [
//       'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
//       'Marketing', 'Sales', 'SEO', 'SEM', 'Content Marketing', 'Social Media',
//       'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication',
//       'Data Analysis', 'Analytics', 'SQL', 'Excel', 'Tableau',
//       'Design', 'UI/UX', 'Photoshop', 'Figma', 'Adobe Creative Suite',
//       'Customer Service', 'CRM', 'Salesforce', 'HubSpot'
//     ];
    
//     return commonSkills.filter(skill => 
//       description.toLowerCase().includes(skill.toLowerCase())
//     ).slice(0, 5);
//   }

//   private extractBenefits(description: string): string[] {
//     const benefits = [];
//     const text = description.toLowerCase();
    
//     if (text.includes('health insurance') || text.includes('medical')) benefits.push('Health Insurance');
//     if (text.includes('dental')) benefits.push('Dental Insurance');
//     if (text.includes('401k') || text.includes('retirement') || text.includes('pension')) benefits.push('Retirement Benefits');
//     if (text.includes('pto') || text.includes('paid time off') || text.includes('vacation')) benefits.push('Paid Time Off');
//     if (text.includes('remote') || text.includes('work from home')) benefits.push('Remote Work Option');
//     if (text.includes('flexible')) benefits.push('Flexible Schedule');
//     if (text.includes('stock options') || text.includes('equity')) benefits.push('Stock Options');
//     if (text.includes('bonus')) benefits.push('Performance Bonus');
//     if (text.includes('professional development') || text.includes('training')) benefits.push('Professional Development');
//     if (text.includes('gym') || text.includes('fitness')) benefits.push('Fitness Benefits');
    
//     return benefits.slice(0, 4);
//   }

//   private detectJobType(description: string): 'full-time' | 'part-time' | 'contract' | 'freelance' {
//     const text = description.toLowerCase();
//     if (text.includes('part-time') || text.includes('part time')) return 'part-time';
//     if (text.includes('contract') || text.includes('contractor') || text.includes('temp')) return 'contract';
//     if (text.includes('freelance') || text.includes('consultant') || text.includes('gig')) return 'freelance';
//     return 'full-time';
//   }

//   private detectExperienceLevel(description: string): 'entry' | 'mid' | 'senior' | 'executive' {
//     const text = description.toLowerCase();
//     if (text.includes('entry') || text.includes('junior') || text.includes('0-2 years') || text.includes('graduate')) return 'entry';
//     if (text.includes('senior') || text.includes('lead') || text.includes('principal') || text.includes('5+ years')) return 'senior';
//     if (text.includes('director') || text.includes('vp') || text.includes('executive') || text.includes('head of')) return 'executive';
//     return 'mid';
//   }

//   private detectDiversityCommitment(description: string): boolean {
//     const text = description.toLowerCase();
//     return text.includes('diversity') || text.includes('inclusion') || 
//            text.includes('equal opportunity') || text.includes('diverse team') ||
//            text.includes('dei') || text.includes('belonging');
//   }

//   private extractParentingSupport(description: string): string[] {
//     const support = [];
//     const text = description.toLowerCase();
    
//     if (text.includes('parental leave') || text.includes('maternity leave') || text.includes('paternity leave')) {
//       support.push('Parental Leave');
//     }
//     if (text.includes('childcare') || text.includes('child care') || text.includes('daycare')) {
//       support.push('Childcare Support');
//     }
//     if (text.includes('flexible schedule') || text.includes('flexible hours')) {
//       support.push('Flexible Scheduling');
//     }
//     if (text.includes('family time') || text.includes('family first')) {
//       support.push('Family Time Policy');
//     }
//     if (text.includes('lactation') || text.includes('nursing')) {
//       support.push('Lactation Support');
//     }
//     if (text.includes('dependent care') || text.includes('family care')) {
//       support.push('Dependent Care Benefits');
//     }
    
//     return support;
//   }

//   private parseSalary(salaryString: string): { min: number; max: number; currency: string } {
//     if (!salaryString) return { min: 0, max: 0, currency: 'USD' };
    
//     // Remove common salary prefixes/suffixes
//     const cleaned = salaryString.replace(/[$£€¥,]/g, '').replace(/\s+/g, ' ').trim();
    
//     // Extract numbers
//     const numbers = cleaned.match(/\d+/g);
//     if (numbers && numbers.length >= 2) {
//       const nums = numbers.map(n => parseInt(n));
//       return {
//         min: Math.min(...nums),
//         max: Math.max(...nums),
//         currency: 'USD'
//       };
//     } else if (numbers && numbers.length === 1) {
//       const salary = parseInt(numbers[0]);
//       return {
//         min: salary,
//         max: salary + (salary * 0.2), // Add 20% range
//         currency: 'USD'
//       };
//     }
    
//     return { min: 0, max: 0, currency: 'USD' };
//   }

//   private cleanDescription(description: string): string {
//     return description
//       .replace(/<[^>]*>/g, '') // Remove HTML tags
//       .replace(/&[^;]+;/g, ' ') // Remove HTML entities
//       .replace(/\s+/g, ' ') // Normalize whitespace
//       .trim()
//       .substring(0, 1000); // Limit length
//   }

//   private mapProjectType(duration: string): 'short-term' | 'long-term' | 'ongoing' {
//     if (!duration) return 'short-term';
    
//     const d = duration.toLowerCase();
//     if (d.includes('week') || d.includes('month') || d.includes('3 months')) return 'short-term';
//     if (d.includes('6 months') || d.includes('year') || d.includes('annual')) return 'long-term';
//     if (d.includes('ongoing') || d.includes('permanent') || d.includes('continuous')) return 'ongoing';
    
//     return 'short-term';
//   }

//   private mapExperienceLevel(tier: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
//     if (!tier) return 'intermediate';
    
//     const t = tier.toLowerCase();
//     if (t.includes('entry') || t.includes('basic') || t.includes('beginner')) return 'beginner';
//     if (t.includes('expert') || t.includes('advanced') || t.includes('senior')) return 'expert';
//     if (t.includes('intermediate') || t.includes('mid')) return 'intermediate';
//     if (t.includes('experienced') || t.includes('professional')) return 'advanced';
    
//     return 'intermediate';
//   }

//   private mapBusinessCategory(category: string | undefined): string {
//     if (!category) return 'businesses';
    
//     const categoryMap: { [key: string]: string } = {
//       'technology': 'tech',
//       'marketing': 'marketing',
//       'consulting': 'professional',
//       'health': 'health',
//       'education': 'education',
//       'retail': 'shopping',
//       'food': 'restaurants',
//       'fitness': 'fitness',
//       'beauty': 'beautysvc',
//       'finance': 'financialservices'
//     };
    
//     return categoryMap[category.toLowerCase()] || 'businesses';
//   }

//   private generateBusinessDescription(business: any): string {
//     const parts = [business.name];
    
//     if (business.categories && business.categories.length > 0) {
//       parts.push(`specializing in ${business.categories[0].title}`);
//     }
    
//     if (business.location && business.location.city) {
//       parts.push(`located in ${business.location.city}`);
//     }
    
//     if (business.rating && business.rating > 4) {
//       parts.push(`with excellent ${business.rating}-star rating`);
//     }
    
//     return parts.join(' ');
//   }

//   // AI tip processing utilities
//   private generateTipTitle(content: string): string {
//     const sentences = content.split(/[.!?]+/);
//     const firstSentence = sentences[0].trim();
    
//     if (firstSentence.length <= 60) {
//       return firstSentence;
//     }
    
//     // Try to find a natural break point
//     const words = firstSentence.split(' ');
//     let title = '';
    
//     for (const word of words) {
//       if ((title + ' ' + word).length > 57) {
//         break;
//       }
//       title += (title ? ' ' : '') + word;
//     }
    
//     return title + (title.length < firstSentence.length ? '...' : '');
//   }

//   private categorizeTip(content: string, user: UserProfile): CareerTip['category'] {
//     const text = content.toLowerCase();
    
//     if (text.includes('network') || text.includes('connect') || text.includes('relationship')) {
//       return 'networking';
//     }
//     if (text.includes('skill') || text.includes('learn') || text.includes('course') || text.includes('training')) {
//       return 'skill-development';
//     }
//     if (text.includes('interview') || text.includes('resume') || text.includes('cv') || text.includes('application')) {
//       return 'interview-prep';
//     }
//     if (text.includes('balance') || text.includes('family') || text.includes('time') || text.includes('flexible')) {
//       return 'work-life-balance';
//     }
    
//     return 'career-growth';
//   }

//   private determineDifficulty(content: string): 'beginner' | 'intermediate' | 'advanced' {
//     const text = content.toLowerCase();
    
//     if (text.includes('advanced') || text.includes('complex') || text.includes('expert')) {
//       return 'advanced';
//     }
//     if (text.includes('beginner') || text.includes('simple') || text.includes('easy') || text.includes('start')) {
//       return 'beginner';
//     }
    
//     return 'intermediate';
//   }

//   private estimateTimeToImplement(content: string): string {
//     const text = content.toLowerCase();
    
//     if (text.includes('quick') || text.includes('minute') || text.includes('immediately')) {
//       return '5-15 minutes';
//     }
//     if (text.includes('hour') || text.includes('session')) {
//       return '1-2 hours';
//     }
//     if (text.includes('day') || text.includes('week')) {
//       return '1-2 weeks';
//     }
//     if (text.includes('course') || text.includes('training') || text.includes('certification')) {
//       return '2-4 weeks';
//     }
    
//     return '15-30 minutes';
//   }

//   private extractTipTags(content: string, user: UserProfile): string[] {
//     const tags = [];
//     const text = content.toLowerCase();
    
//     if (text.includes('remote') || text.includes('work from home')) tags.push('remote-work');
//     if (text.includes('network') || text.includes('connect')) tags.push('networking');
//     if (text.includes('skill') || text.includes('learn')) tags.push('professional-development');
//     if (text.includes('family') || text.includes('parent') || text.includes('balance')) tags.push('work-life-balance');
//     if (text.includes('interview') || text.includes('job search')) tags.push('job-search');
//     if (text.includes('linkedin') || text.includes('social media')) tags.push('personal-branding');
//     if (text.includes('salary') || text.includes('negotiate')) tags.push('career-advancement');
    
//     if (user.industry) {
//       tags.push(user.industry.toLowerCase().replace(/\s+/g, '-'));
//     }
    
//     return tags.slice(0, 4);
//   }

//   private getTargetAudience(user: UserProfile): string {
//     const audiences = [];
    
//     if (user.childrenAges && user.childrenAges.length > 0) {
//       audiences.push('working-parents');
//     }
    
//     if (user.availabilityStatus === 'returning_to_work') {
//       audiences.push('career-returners');
//     }
    
//     if (user.workPreference === 'remote') {
//       audiences.push('remote-workers');
//     }
    
//     if (user.yearsOfExperience && user.yearsOfExperience >= 7) {
//       audiences.push('senior-professionals');
//     } else if (user.yearsOfExperience && user.yearsOfExperience >= 3) {
//       audiences.push('mid-career-professionals');
//     } else {
//       audiences.push('early-career-professionals');
//     }
    
//     if (user.industry) {
//       audiences.push(user.industry.toLowerCase().replace(/\s+/g, '-') + '-professionals');
//     }
    
//     return audiences.slice(0, 3).join(', ') || 'professionals';
//   }

//   // Caching utilities
//   private getFromCache(key: string, maxAgeMinutes: number): any {
//     const cached = this.cache.get(key);
//     if (cached && Date.now() < cached.expires) {
//       return cached.data;
//     }
//     this.cache.delete(key);
//     return null;
//   }

//   private setCache(key: string, data: any, maxAgeMinutes: number): void {
//     this.cache.set(key, {
//       data,
//       expires: Date.now() + (maxAgeMinutes * 60 * 1000)
//     });
//   }

//   // Rate limiting utilities
//   private canMakeRequest(apiName: string): boolean {
//     const limits: { [key: string]: number } = {
//       'adzuna': 100, // per hour
//       'rapidapi': 100,
//       'yelp': 5000, // per day
//       'google': 1000,
//       'upwork': 100
//     };
    
//     const now = Date.now();
//     const hourAgo = now - (60 * 60 * 1000);
    
//     const current = this.rateLimits.get(apiName);
//     if (!current || current.resetTime < hourAgo) {
//       this.rateLimits.set(apiName, { requests: 0, resetTime: now + (60 * 60 * 1000) });
//       return true;
//     }
    
//     return current.requests < (limits[apiName] || 100);
//   }

//   private recordRequest(apiName: string): void {
//     const current = this.rateLimits.get(apiName);
//     if (current) {
//       current.requests++;
//     }
//   }

//   // Fallback data methods
//   private getFallbackInsights(user: UserProfile): any {
//     return {
//       _id: `fallback_insight_${Date.now()}`,
//       userId: user._id,
//       insights: {
//         strengthsAnalysis: [
//           "Your professional experience demonstrates commitment to career growth",
//           "Your adaptability shows in your diverse skill set and experiences",
//           "Your work-life balance awareness is a valuable leadership quality"
//         ],
//         improvementAreas: [
//           "Consider expanding your digital skills to stay competitive in the modern marketplace",
//           "Strengthening your professional network could open new opportunities",
//           "Developing thought leadership through content creation could boost your profile"
//         ],
//         careerPathSuggestions: [
//           `Senior roles in ${user.industry || 'your field'} that leverage your experience`,
//           "Consulting opportunities where you can share your expertise",
//           "Leadership positions that value your unique perspective and skills"
//         ],
//         skillGapAnalysis: [
//           "Digital transformation skills are increasingly valuable across all industries",
//           "Data analysis capabilities can enhance decision-making in any role",
//           "Remote collaboration tools proficiency is now essential"
//         ],
//         marketTrends: [
//           "Flexible work arrangements continue to be in high demand",
//           "Companies are prioritizing diversity and inclusion initiatives",
//           "Skills-based hiring is becoming more common than degree requirements"
//         ],
//         salaryInsights: {
//           currentMarketRate: `Competitive range for ${user.yearsOfExperience || 0} years of experience in ${user.industry || 'your field'}`,
//           growthPotential: "Strong potential for advancement with continued skill development",
//           recommendations: [
//             "Research current market rates for your specific role and location",
//             "Consider pursuing additional certifications to increase your value"
//           ]
//         },
//         workLifeBalanceRecommendations: [
//           "Look for companies with established family-friendly policies",
//           "Consider remote or hybrid opportunities for better work-life integration",
//           "Prioritize roles with supportive management and clear boundaries"
//         ],
//         networkingOpportunities: [
//           `${user.industry || 'Professional'} industry associations and meetups`,
//           "LinkedIn groups related to your expertise and interests",
//           "Local business networking events and professional development workshops"
//         ],
//         personalizedAdvice: [
//           "Focus on opportunities that align with your personal values and long-term goals",
//           "Leverage your unique perspective and experience as competitive advantages",
//           "Continue investing in your professional development and skill growth"
//         ],
//         nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
//       },
//       confidenceScore: 70,
//       personalizedTips: [],
//       generatedAt: new Date(),
//       lastUpdated: new Date()
//     };
//   }

//   private getMockTips(): CareerTip[] {
//     return [
//       {
//         _id: "tip_1",
//         title: "Optimize Your LinkedIn Profile for Better Visibility",
//         content: "Update your LinkedIn headline to include key industry terms that recruiters search for. A well-crafted headline can increase your profile views by up to 40%. Include your target role and 2-3 key skills.",
//         category: "skill-development",
//         difficulty: "beginner",
//         timeToImplement: "30 minutes",
//         tags: ["linkedin", "profile-optimization", "personal-branding", "job-search"],
//         isPersonalized: true,
//         relevanceScore: 88,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         targetAudience: "professionals",
//         aiGenerated: false,
//       },
//       {
//         _id: "tip_2",
//         title: "Network Strategically Within Your Current Connections",
//         content: "Start your networking efforts with people you already know - former colleagues, classmates, and industry contacts. They're more likely to provide honest career advice and can introduce you to others in their network.",
//         category: "networking",
//         difficulty: "beginner",
//         timeToImplement: "15 minutes per contact",
//         tags: ["networking", "relationships", "career-advice", "connections"],
//         isPersonalized: true,
//         relevanceScore: 90,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         targetAudience: "professionals",
//         aiGenerated: false,
//       },
//       {
//         _id: "tip_3",
//         title: "Schedule Regular Career Development Time",
//         content: "Block out 2-3 hours each week for career development activities like learning new skills, updating your portfolio, or reaching out to contacts. Consistency in small efforts leads to big career gains over time.",
//         category: "career-growth",
//         difficulty: "intermediate",
//         timeToImplement: "2-3 hours weekly",
//         tags: ["professional-development", "time-management", "career-planning", "skills"],
//         isPersonalized: true,
//         relevanceScore: 85,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         targetAudience: "professionals",
//         aiGenerated: false,
//       }
//     ];
//   }

//   private getMockJobs(): JobRecommendation[] {
//     return [
//       {
//         _id: "mock_job_1",
//         title: "Senior Marketing Manager - Remote Friendly",
//         company: "TechForward Inc.",
//         location: "Remote / San Francisco, CA",
//         workArrangement: "remote",
//         salaryRange: { min: 85000, max: 125000, currency: "USD" },
//         requiredSkills: ["Digital Marketing", "Analytics", "Team Leadership", "Campaign Management"],
//         preferredSkills: ["Content Strategy", "SEO", "Marketing Automation"],
//         description: "Join our growing marketing team as a Senior Marketing Manager. Lead digital marketing initiatives for our innovative SaaS products while enjoying excellent work-life balance and comprehensive benefits. We're a family-friendly company that values diversity and supports working parents.",
//         matchScore: 0,
//         isMaternityFriendly: true,
//         flexibleHours: true,
//         benefitsHighlights: ["Health Insurance", "Flexible PTO", "Remote Work", "Professional Development Budget"],
//         postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
//         jobType: "full-time",
//         experienceLevel: "senior",
//         companySize: "medium",
//         companyStage: "growth",
//         diversityCommitment: true,
//         parentingSupport: ["Flexible Schedule", "Family Time Policy", "Childcare Support"]
//       },
//       {
//         _id: "mock_job_2",
//         title: "Product Marketing Director - Hybrid",
//         company: "Sustainable Innovations Co.",
//         location: "Denver, CO",
//         workArrangement: "hybrid",
//         salaryRange: { min: 120000, max: 160000, currency: "USD" },
//         requiredSkills: ["Product Marketing", "Go-to-Market Strategy", "Cross-functional Leadership"],
//         preferredSkills: ["B2B SaaS", "Customer Research", "Competitive Analysis"],
//         description: "Lead product marketing for our mission-driven company focused on environmental sustainability. We offer exceptional work-life balance with a 4-day work week option and strong commitment to employee wellbeing.",
//         matchScore: 0,
//         isMaternityFriendly: true,
//         flexibleHours: true,
//         benefitsHighlights: ["4-Day Work Week", "Equity Package", "Unlimited PTO", "Wellness Stipend"],
//         postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
//         jobType: "full-time",
//         experienceLevel: "senior",
//         companySize: "small",
//         companyStage: "growth",
//         diversityCommitment: true,
//         parentingSupport: ["Parental Leave", "Flexible Hours", "Mental Health Support"]
//       }
//     ];
//   }

//   private getMockFreelanceOps(): FreelanceOpportunity[] {
//     return [
//       {
//         _id: "mock_freelance_1",
//         title: "Content Marketing Strategy Development",
//         clientName: "HealthTech Startup",
//         client: "HealthTech Startup",
//         projectType: "short-term",
//         budgetRange: { min: 3000, max: 6000, currency: "USD", paymentType: "project" },
//         budget: { min: 3000, max: 6000, currency: "USD", type: "project" },
//         duration: "4-6 weeks",
//         skillsRequired: ["Content Strategy", "Healthcare Marketing", "SEO", "Analytics"],
//         description: "Develop comprehensive content marketing strategy for innovative healthtech platform targeting working professionals. Flexible schedule and remote work. Client has excellent payment history.",
//         matchScore: 0,
//         isRemote: true,
//         postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
//         difficultyLevel: "intermediate",
//         clientRating: 4.8,
//         paymentVerified: true,
//         experienceLevel: "intermediate",
//         location: "Remote",
//         industry: "HealthTech",
//         clientSize: "startup",
//         clientStage: "growth",
//         diversityCommitment: true,
//         parentingSupport: ["Flexible Schedule"],
//         reasonsForMatch: [],
//         aiGenerated: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       }
//     ];
//   }



// lib/services/realTimeCareerService.ts - Complete Implementation
import { aiService } from '@/lib/utils/aiService';
import { businessDirectoryService } from './businessDirectoryService';
import { UserProfile, JobRecommendation, FreelanceOpportunity, SmallBusiness, CareerTip } from '@/models/Career';

interface JobFilters {
  type?: string;
  workArrangement?: string;
  location?: string;
  salaryMin?: number;
  experienceLevel?: string;
}

interface BusinessFilters {
  category?: string;
  location?: string;
  momOwned?: boolean;
  searchQuery?: string;
  hiringStatus?: string;
}

interface FreelanceFilters {
  projectType?: string;
  budgetMin?: number;
  duration?: string;
  skillsRequired?: string[];
}

// API interfaces for external services
interface JobSearchAPI {
  results: Array<{
    id: string;
    title: string;
    company: { display_name: string };
    location: { display_name: string };
    description: string;
    salary_min?: number;
    salary_max?: number;
    contract_type?: string;
    created: string;
    redirect_url: string;
    category: { label: string };
  }>;
}

interface LinkedInJobsAPI {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    posted_at: string;
    job_url: string;
    salary?: {
      min: number;
      max: number;
      currency: string;
    };
    employment_type: string;
    seniority_level: string;
  }>;
}

interface UpworkAPI {
  jobs: Array<{
    id: string;
    title: string;
    snippet: string;
    budget?: number;
    hourly_range?: {
      min: number;
      max: number;
    };
    job_type: string;
    skills: string[];
    client: {
      name: string;
      rating: number;
      verified?: boolean;
    };
    date_created: string;
    url: string;
    duration?: string;
    tier?: string;
  }>;
}

class RealTimeCareerService {
  private readonly API_KEYS = {
    ADZUNA_APP_ID: process.env.ADZUNA_APP_ID || '',
    ADZUNA_API_KEY: process.env.ADZUNA_API_KEY || '',
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY || '',
    FOURSQUARE_API_KEY: process.env.FOURSQUARE_API_KEY || '',
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || '',
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || '',
  };

  private cache: Map<string, { data: any; expires: number }>;
  private rateLimits: Map<string, { requests: number; resetTime: number }>;

  constructor() {
    this.cache = new Map();
    this.rateLimits = new Map();
  }

  // Main method for getting personalized job recommendations
  async getPersonalizedJobRecommendations(
    userProfile: UserProfile,
    filters?: JobFilters
  ): Promise<JobRecommendation[]> {
    const cacheKey = `jobs_${userProfile._id}_${JSON.stringify(filters)}`;
    const cached = this.getFromCache(cacheKey, 30);
    if (cached) return cached;

    const jobs: JobRecommendation[] = [];

    try {
      // Parallel API calls to multiple job boards
      const [adzunaJobs, linkedinJobs, indeedJobs] = await Promise.allSettled([
        this.fetchAdzunaJobs(userProfile, filters),
        this.fetchLinkedInJobs(userProfile, filters),
        this.fetchIndeedJobs(userProfile, filters),
      ]);

      // Process Adzuna jobs
      if (adzunaJobs.status === "fulfilled") {
        jobs.push(...adzunaJobs.value);
      }

      // Process LinkedIn jobs
      if (linkedinJobs.status === "fulfilled") {
        jobs.push(...linkedinJobs.value);
      }

      // Process Indeed jobs
      if (indeedJobs.status === "fulfilled") {
        jobs.push(...indeedJobs.value);
      }

      // If no jobs found, use enhanced mock data
      if (jobs.length === 0) {
        console.log('Using enhanced mock job data...');
        const mockJobs = this.getMockJobs(userProfile);
        jobs.push(...mockJobs);
      }

      // Sort by match score and apply AI ranking
      const rankedJobs = await this.applyAIJobRanking(jobs, userProfile);
      const result = rankedJobs.slice(0, 20);

      this.setCache(cacheKey, result, 30);
      return result;

    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      return this.getMockJobs(userProfile);
    }
  }

  // Fetch jobs from Adzuna API (India compatible)
  private async fetchAdzunaJobs(
    userProfile: UserProfile,
    filters?: JobFilters
  ): Promise<JobRecommendation[]> {
    if (!this.canMakeRequest('adzuna')) return [];

    // Use India endpoint if user is in India, otherwise use US
    const country = this.getCountryCode(userProfile.location);
    const baseUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1`;
    
    const params = new URLSearchParams({
      app_id: this.API_KEYS.ADZUNA_APP_ID,
      app_key: this.API_KEYS.ADZUNA_API_KEY,
      what: userProfile.skillsAndExperience?.join(" ") || userProfile.currentRole || "",
      where: userProfile.location || "remote",
      results_per_page: "50",
      sort_by: "relevance",
    });

    if (filters?.salaryMin) {
      params.append("salary_min", filters.salaryMin.toString());
    }

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      if (!response.ok) throw new Error("Adzuna API error");

      const data: JobSearchAPI = await response.json();
      this.recordRequest('adzuna');

      return data.results.map((job) => ({
        _id: `adzuna_${job.id}`,
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        type: this.normalizeJobType(job.contract_type || "full-time"),
        workArrangement: this.determineWorkArrangement(job.location.display_name, job.description),
        salaryRange: job.salary_min && job.salary_max ? {
          min: job.salary_min,
          max: job.salary_max,
          currency: country === 'in' ? 'INR' : 'USD',
        } : undefined,
        description: job.description.slice(0, 500) + "...",
        requirements: this.extractRequirements(job.description),
        benefits: this.extractBenefits(job.description),
        benefitsHighlights: this.extractBenefits(job.description),
        isMaternityFriendly: this.detectMaternityFriendly(job.description),
        flexibleHours: this.detectFlexibleHours(job.description),
        applicationUrl: job.redirect_url,
        postedDate: new Date(job.created),
        matchScore: this.calculateMatchScore(job, userProfile),
        reasonsForMatch: this.generateMatchReasons(job, userProfile),
        jobType: this.normalizeJobType(job.contract_type || "full-time"),
        experienceLevel: this.determineExperienceLevel(job.title, job.description),
        companySize: undefined,
        companyStage: "established" as const,
        diversityCommitment: this.detectDiversityCommitment(job.description),
        parentingSupport: this.extractParentingSupport(job.description),
        requiredSkills: this.extractSkills(job.description),
        preferredSkills: []
      }));
    } catch (error) {
      console.error("Adzuna API error:", error);
      return [];
    }
  }

  // Fetch jobs from LinkedIn via RapidAPI
  private async fetchLinkedInJobs(
    userProfile: UserProfile,
    filters?: JobFilters
  ): Promise<JobRecommendation[]> {
    if (!this.canMakeRequest('rapidapi') || !this.API_KEYS.RAPIDAPI_KEY) return [];

    const url = "https://linkedin-jobs-search.p.rapidapi.com/";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": this.API_KEYS.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "linkedin-jobs-search.p.rapidapi.com",
      },
      body: JSON.stringify({
        query: userProfile.skillsAndExperience?.join(" ") || userProfile.currentRole || "",
        location: userProfile.location || (userProfile.location?.includes('India') ? 'India' : 'United States'),
        dateSincePosted: "week",
        jobType: filters?.type || "all",
        remoteFilter: userProfile.workPreference === "remote" ? "remote" : "all",
        limit: 50,
      }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("LinkedIn API error");

      const data: LinkedInJobsAPI = await response.json();
      this.recordRequest('rapidapi');

      return data.jobs.map((job) => ({
        _id: `linkedin_${job.id}`,
        title: job.title,
        company: job.company,
        location: job.location,
        type: this.normalizeJobType(job.employment_type),
        workArrangement: this.determineWorkArrangement(job.location, job.description),
        salaryRange: job.salary,
        description: job.description.slice(0, 500) + "...",
        requirements: this.extractRequirements(job.description),
        benefitsHighlights: this.extractBenefits(job.description),
        isMaternityFriendly: this.detectMaternityFriendly(job.description),
        flexibleHours: this.detectFlexibleHours(job.description),
        applicationUrl: job.job_url,
        postedDate: new Date(job.posted_at),
        matchScore: this.calculateMatchScore(job, userProfile),
        reasonsForMatch: this.generateMatchReasons(job, userProfile),
        jobType: this.normalizeJobType(job.employment_type),
        experienceLevel: (job.seniority_level as any) || "mid",
        companySize: undefined,
        companyStage: "established",
        diversityCommitment: this.detectDiversityCommitment(job.description),
        parentingSupport: this.extractParentingSupport(job.description),
        requiredSkills: this.extractSkills(job.description),
        preferredSkills: [],
        benefits: this.extractBenefits(job.description),
      }));
    } catch (error) {
      console.error("LinkedIn API error:", error);
      return [];
    }
  }

  // Fetch jobs from Indeed via RapidAPI
  private async fetchIndeedJobs(
    userProfile: UserProfile,
    filters?: JobFilters
  ): Promise<JobRecommendation[]> {
    if (!this.canMakeRequest('rapidapi') || !this.API_KEYS.RAPIDAPI_KEY) return [];

    const query = this.buildJobQuery(userProfile, filters);
    const location = userProfile.location || (userProfile.location?.includes('India') ? 'India' : 'US');

    const url = `https://indeed-jobs-api.p.rapidapi.com/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=1`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.API_KEYS.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'indeed-jobs-api.p.rapidapi.com'
        }
      });

      if (!response.ok) throw new Error("Indeed API error");

      const data = await response.json();
      this.recordRequest('rapidapi');

      return (data.jobs || []).map((job: any) => ({
        _id: `indeed_${job.id || Date.now()}`,
        title: job.title || 'Position Available',
        company: job.company || 'Company Not Listed',
        location: job.location || 'Location Not Specified',
        workArrangement: this.detectWorkArrangement(job.summary || ''),
        salaryRange: this.parseSalary(job.salary),
        requiredSkills: this.extractSkills(job.summary || ''),
        preferredSkills: [],
        description: this.cleanDescription(job.summary || ''),
        matchScore: 0,
        isMaternityFriendly: this.detectMaternityFriendly(job.summary || ''),
        flexibleHours: this.detectFlexibleHours(job.summary || ''),
        benefitsHighlights: this.extractBenefits(job.summary || ''),
        applicationUrl: job.url,
        postedDate: new Date(job.date || Date.now()),
        jobType: this.detectJobType(job.summary || ''),
        experienceLevel: this.detectExperienceLevel(job.summary || ''),
        companySize: undefined,
        companyStage: 'established',
        diversityCommitment: this.detectDiversityCommitment(job.summary || ''),
        parentingSupport: this.extractParentingSupport(job.summary || ''),
        reasonsForMatch: [],
        requirements: this.extractRequirements(job.summary || ''),
        type: this.detectJobType(job.summary || '')
      }));

    } catch (error) {
      console.error('Error fetching Indeed jobs:', error);
      return [];
    }
  }

  // Get freelance opportunities
  async getFreelanceOpportunities(
    userProfile: UserProfile,
    filters?: FreelanceFilters
  ): Promise<FreelanceOpportunity[]> {
    const cacheKey = `freelance_${userProfile._id}_${JSON.stringify(filters)}`;
    const cached = this.getFromCache(cacheKey, 60);
    if (cached) return cached;

    try {
      const [upworkJobs, freelancerJobs] = await Promise.allSettled([
        this.fetchUpworkJobs(userProfile, filters),
        this.fetchFreelancerJobs(userProfile),
      ]);

      const opportunities: FreelanceOpportunity[] = [];

      if (upworkJobs.status === "fulfilled") {
        opportunities.push(...upworkJobs.value);
      }

      if (freelancerJobs.status === "fulfilled") {
        opportunities.push(...freelancerJobs.value);
      }

      // Fallback to mock data if no opportunities found
      if (opportunities.length === 0) {
        opportunities.push(...this.getMockFreelanceOps(userProfile));
      }

      const result = opportunities
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 15);

      this.setCache(cacheKey, result, 60);
      return result;

    } catch (error) {
      console.error("Error fetching freelance opportunities:", error);
      return this.getMockFreelanceOps(userProfile);
    }
  }

  // Fetch Upwork jobs via RapidAPI
  private async fetchUpworkJobs(
    userProfile: UserProfile,
    filters?: FreelanceFilters
  ): Promise<FreelanceOpportunity[]> {
    if (!this.canMakeRequest('upwork') || !this.API_KEYS.RAPIDAPI_KEY) return [];

    const url = "https://upwork-jobs-search.p.rapidapi.com/api/jobs";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": this.API_KEYS.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "upwork-jobs-search.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(
        `${url}?query=${encodeURIComponent(
          userProfile.skillsAndExperience?.join(" ") || ""
        )}`,
        options
      );
      if (!response.ok) throw new Error("Upwork API error");

      const data: UpworkAPI = await response.json();
      this.recordRequest('upwork');

      return data.jobs.map((job) => ({
        _id: `upwork_${job.id}`,
        title: job.title,
        clientName: job.client.name,
        client: job.client.name,
        projectType: this.determineProjectType(job.job_type),
        budget: {
          min: job.hourly_range?.min || job.budget || 0,
          max: job.hourly_range?.max || job.budget || 0,
          currency: "USD",
          type: job.hourly_range ? "hourly" : "fixed",
        },
        duration: this.estimateDuration(job.snippet),
        skillsRequired: job.skills,
        description: job.snippet,
        isRemote: true,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        postedDate: new Date(job.date_created),
        experienceLevel: this.determineFreelanceExperienceLevel(job.snippet),
        matchScore: this.calculateFreelanceMatchScore(job, userProfile),
        difficultyLevel: this.mapExperienceLevel(job.tier || ''),
        paymentVerified: job.client.verified || false
      }));
    } catch (error) {
      console.error("Upwork API error:", error);
      return [];
    }
  }

  // Get small businesses using India-compatible service
  async getSmallBusinesses(filters?: BusinessFilters): Promise<SmallBusiness[]> {
    try {
      console.log('Fetching businesses from India-compatible sources...');
      const businessResults = await businessDirectoryService.getBusinesses(filters);
      
      // Transform BusinessResult[] to SmallBusiness[]
      return businessResults.map(business => ({
        _id: business._id || `business_${Date.now()}_${Math.random()}`,
        name: business.name,
        businessName: business.name,
        description: business.description || `${business.name} - ${business.category}`,
        industry: business.category,
        location: business.location,
        category: business.category,
        contactInfo: {
          email: business.contact.email || '',
          phone: business.contact.phone || '',
          socialMedia: business.contact.social || {}
        },
        ownerName: business.ownerName || 'Business Owner',
        ownerId: business.ownerId || business._id || `owner_${Date.now()}`,
        services: business.services || [],
        specializations: business.specializations || [],
        supportingMoms: business.supportingMoms || false,
        lookingForCollaborators: business.lookingForCollaborators || false,
        hiringStatus: business.hiringStatus || 'not-hiring',
        workArrangements: business.workArrangements || ['onsite'],
        tags: business.tags || [],
        verified: business.verified || false,
        isVerified: business.verified || false,
        rating: business.rating || 0,
        reviewCount: business.reviewCount || 0,
        isMomOwned: business.isMomOwned || false,
        images: business.images || [],
        createdAt: business.createdAt || new Date()
      }));
    } catch (error) {
      console.error('Error fetching small businesses:', error);
      return this.getMockBusinesses();
    }
  }

  // Generate AI-powered personalized tips
  async generatePersonalizedTips(userProfile: UserProfile): Promise<CareerTip[]> {
    const cacheKey = `tips_${userProfile._id}`;
    const cached = this.getFromCache(cacheKey, 240);
    if (cached) return cached;

    try {
      const aiTips = await aiService.generatePersonalizedTips(userProfile);
      
      const formattedTips = aiTips.map((tipContent, index) => ({
        _id: `ai_tip_${Date.now()}_${index}`,
        title: this.generateTipTitle(tipContent),
        content: tipContent,
        category: this.categorizeTip(tipContent, userProfile) as CareerTip['category'],
        difficulty: this.determineDifficulty(tipContent),
        timeToImplement: this.estimateTimeToImplement(tipContent),
        tags: this.extractTipTags(tipContent, userProfile),
        isPersonalized: true,
        relevanceScore: 85 + Math.random() * 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        targetAudience: this.getTargetAudience(userProfile),
        aiGenerated: true
      }));

      this.setCache(cacheKey, formattedTips, 240);
      return formattedTips;

    } catch (error) {
      console.error("Error generating personalized tips:", error);
      return this.getFallbackTips(userProfile);
    }
  }

  // Generate comprehensive AI career insights
  async generateAICareerInsights(userProfile: UserProfile): Promise<any> {
    try {
      return await aiService.generateCareerInsights(userProfile);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      return this.getFallbackInsights(userProfile);
    }
  }

  // Helper methods for data processing and matching
  private calculateMatchScore(job: any, userProfile: UserProfile): number {
    let score = 0;
    const weights = {
      skills: 0.3,
      location: 0.2,
      workArrangement: 0.25,
      experience: 0.15,
      industry: 0.1,
    };

    // Skills matching
    if (userProfile.skillsAndExperience) {
      const jobSkills = this.extractSkills(job.description || job.title);
      const matchingSkills = userProfile.skillsAndExperience.filter((skill) =>
        jobSkills.some(
          (jobSkill) =>
            jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );
      score +=
        (matchingSkills.length /
          Math.max(userProfile.skillsAndExperience.length, 1)) *
        weights.skills *
        100;
    }

    // Location matching
    const jobLocation = job.location?.display_name || job.location || "";
    if (
      userProfile.workPreference === "remote" &&
      jobLocation.toLowerCase().includes("remote")
    ) {
      score += weights.location * 100;
    } else if (
      userProfile.location &&
      jobLocation.toLowerCase().includes(userProfile.location.toLowerCase())
    ) {
      score += weights.location * 100;
    }

    // Experience matching
    const experienceLevel = this.determineExperienceLevel(
      job.title,
      job.description
    );
    if (userProfile.yearsOfExperience) {
      if (experienceLevel === "entry" && userProfile.yearsOfExperience <= 2)
        score += weights.experience * 100;
      else if (
        experienceLevel === "mid" &&
        userProfile.yearsOfExperience >= 2 &&
        userProfile.yearsOfExperience <= 7
      )
        score += weights.experience * 100;
      else if (
        experienceLevel === "senior" &&
        userProfile.yearsOfExperience > 7
      )
        score += weights.experience * 100;
    }

    return Math.min(Math.round(score), 100);
  }

  private calculateFreelanceMatchScore(job: any, userProfile: UserProfile): number {
    let score = 0;

    if (userProfile.skillsAndExperience && job.skills) {
      const matchingSkills = userProfile.skillsAndExperience.filter((skill) =>
        job.skills.some(
          (jobSkill: string) =>
            jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );
      score += (matchingSkills.length / Math.max(job.skills.length, 1)) * 50;
    }

    // Budget match
    if (userProfile.desiredSalaryRange && job.hourly_range) {
      const userHourlyMin = userProfile.desiredSalaryRange.min / 160; // Monthly to hourly
      if (job.hourly_range.min >= userHourlyMin) {
        score += 30;
      }
    }

    // Client rating bonus
    if (job.client && job.client.rating > 4.5) {
      score += 20;
    }

    return Math.min(Math.round(score), 100);
  }

  // Utility methods
  private getCountryCode(location?: string): string {
    if (!location) return 'us';
    const loc = location.toLowerCase();
    if (loc.includes('india') || loc.includes('mumbai') || loc.includes('delhi') || 
        loc.includes('bangalore') || loc.includes('chennai') || loc.includes('hyderabad')) {
      return 'in';
    }
    return 'us';
  }

  private buildJobQuery(user: UserProfile, filters?: JobFilters): string {
    const parts = [];
    
    if (filters?.type) {
      parts.push(filters.type);
    } else if (user.currentRole) {
      parts.push(user.currentRole);
    }
    
    if (user.skillsAndExperience && user.skillsAndExperience.length > 0) {
      parts.push(user.skillsAndExperience[0]);
    }
    
    return parts.join(' ') || 'professional opportunities';
  }

  private determineWorkArrangement(
    location: string,
    description?: string
  ): "remote" | "hybrid" | "onsite" {
    const text = `${location} ${description || ""}`.toLowerCase();

    if (
      text.includes("remote") ||
      text.includes("work from home") ||
      text.includes("distributed")
    ) {
      return "remote";
    } else if (text.includes("hybrid") || text.includes("flexible")) {
      return "hybrid";
    }
    return "onsite";
  }

  private detectWorkArrangement(description: string): 'remote' | 'hybrid' | 'onsite' {
    const text = description.toLowerCase();
    if (text.includes('100% remote') || text.includes('work from home')) return 'remote';
    if (text.includes('hybrid') || text.includes('flexible')) return 'hybrid';
    return 'onsite';
  }

  private detectMaternityFriendly(description: string): boolean {
    const keywords = [
      "maternity",
      "parental leave",
      "family-friendly",
      "work-life balance",
      "flexible schedule",
      "childcare",
    ];
    return keywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );
  }

  private detectFlexibleHours(description: string): boolean {
    const keywords = [
      "flexible hours",
      "flexible schedule",
      "work-life balance",
      "remote",
      "hybrid",
    ];
    return keywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );
  }

  private extractRequirements(description: string): string[] {
    return this.extractSkills(description);
  }

  private extractSkills(description: string): string[] {
    const skillKeywords = [
      "javascript", "typescript", "python", "java", "react", "node.js", "angular", "vue.js",
      "sql", "marketing", "sales", "management", "design", "analytics",
      "project management", "communication", "leadership", "strategic planning"
    ];
    return skillKeywords.filter((skill) =>
      description.toLowerCase().includes(skill.toLowerCase())
    );
  }

  private extractBenefits(description: string): string[] {
    const benefitKeywords = [
      "health insurance", "401k", "flexible hours", "remote work",
      "pto", "vacation", "dental", "vision", "parental leave"
    ];
    return benefitKeywords.filter((benefit) =>
      description.toLowerCase().includes(benefit.toLowerCase())
    );
  }

  private normalizeJobType(type: string): "full-time" | "part-time" | "contract" | "freelance" | "internship" {
    const normalized = type.toLowerCase();
    if (normalized.includes("full")) return "full-time";
    if (normalized.includes("part")) return "part-time";
    if (normalized.includes("contract") || normalized.includes("temporary"))
      return "contract";
    if (normalized.includes("freelance") || normalized.includes("gig"))
      return "freelance";
    if (normalized.includes("intern")) return "internship";
    return "full-time";
  }

  private detectJobType(description: string): 'full-time' | 'part-time' | 'contract' | 'freelance' {
    const text = description.toLowerCase();
    if (text.includes('part-time')) return 'part-time';
    if (text.includes('contract')) return 'contract';
    if (text.includes('freelance')) return 'freelance';
    return 'full-time';
  }

  private determineExperienceLevel(
    title: string,
    description?: string
  ): "entry" | "mid" | "senior" | "executive" {
    const text = `${title} ${description || ""}`.toLowerCase();

    if (
      text.includes("senior") ||
      text.includes("lead") ||
      text.includes("principal")
    )
      return "senior";
    if (
      text.includes("director") ||
      text.includes("vp") ||
      text.includes("executive")
    )
      return "executive";
    if (
      text.includes("junior") ||
      text.includes("entry") ||
      text.includes("associate")
    )
      return "entry";
    return "mid";
  }

  private detectExperienceLevel(description: string): 'entry' | 'mid' | 'senior' | 'executive' {
    const text = description.toLowerCase();
    if (text.includes('entry') || text.includes('junior')) return 'entry';
    if (text.includes('senior') || text.includes('lead')) return 'senior';
    if (text.includes('director') || text.includes('executive')) return 'executive';
    return 'mid';
  }

  private detectDiversityCommitment(description: string): boolean {
    const keywords = [
      "diversity", "inclusion", "equal opportunity", "eeo", "diverse", "inclusive"
    ];
    return keywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );
  }

  private extractParentingSupport(description: string): string[] {
    const support: string[] = [];
    const text = description.toLowerCase();

    if (text.includes("childcare")) support.push("Childcare support");
    if (text.includes("parental leave")) support.push("Parental leave");
    if (text.includes("flexible")) support.push("Flexible schedule");
    if (text.includes("remote")) support.push("Remote work options");
    if (text.includes("family")) support.push("Family-friendly culture");

    return support;
  }

  private parseSalary(salaryString: string): { min: number; max: number; currency: string } {
    if (!salaryString) return { min: 0, max: 0, currency: 'USD' };
    
    const cleaned = salaryString.replace(/[$£€¥,]/g, '').replace(/\s+/g, ' ').trim();
    const numbers = cleaned.match(/\d+/g);
    
    if (numbers && numbers.length >= 2) {
      const nums = numbers.map(n => parseInt(n));
      return {
        min: Math.min(...nums),
        max: Math.max(...nums),
        currency: 'USD'
      };
    } else if (numbers && numbers.length === 1) {
      const salary = parseInt(numbers[0]);
      return {
        min: salary,
        max: salary + (salary * 0.2),
        currency: 'USD'
      };
    }
    
    return { min: 0, max: 0, currency: 'USD' };
  }

  private cleanDescription(description: string): string {
    return description
      .replace(/<[^>]*>/g, '')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1000);
  }

  private determineProjectType(jobType: string): 'short-term' | 'long-term' | 'ongoing' {
    if (jobType.toLowerCase().includes("long")) return "long-term";
    if (jobType.toLowerCase().includes("short")) return "short-term";
    return "ongoing";
  }

  private estimateDuration(description: string): string {
    if (description.toLowerCase().includes("week")) return "1-2 weeks";
    if (description.toLowerCase().includes("month")) return "1-3 months";
    return "2-6 weeks";
  }

  private determineFreelanceExperienceLevel(description: string): "beginner" | "intermediate" | "expert" {
    const text = description.toLowerCase();
    if (text.includes("expert") || text.includes("senior") || text.includes("advanced"))
      return "expert";
    if (text.includes("intermediate") || text.includes("experienced"))
      return "intermediate";
    return "beginner";
  }

  private mapExperienceLevel(tier: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (!tier) return 'intermediate';
    
    const t = tier.toLowerCase();
    if (t.includes('entry') || t.includes('basic')) return 'beginner';
    if (t.includes('expert') || t.includes('advanced')) return 'expert';
    if (t.includes('experienced')) return 'advanced';
    return 'intermediate';
  }

  private generateMatchReasons(job: any, userProfile: UserProfile): string[] {
    const reasons: string[] = [];

    // Skills match
    if (userProfile.skillsAndExperience) {
      const jobSkills = this.extractSkills(job.description || job.title);
      const matchingSkills = userProfile.skillsAndExperience.filter((skill) =>
        jobSkills.some((jobSkill) =>
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (matchingSkills.length > 0) {
        reasons.push(
          `Your skills match ${matchingSkills.length} requirements: ${matchingSkills.slice(0, 3).join(", ")}`
        );
      }
    }

    // Work arrangement match
    const workArrangement = this.determineWorkArrangement(
      job.location?.display_name || job.location,
      job.description
    );
    if (userProfile.workPreference === workArrangement) {
      reasons.push(`Perfect match for your ${workArrangement} work preference`);
    }

    // Family-friendly features
    if (this.detectMaternityFriendly(job.description)) {
      reasons.push("Company offers family-friendly benefits");
    }

    if (this.detectFlexibleHours(job.description)) {
      reasons.push("Flexible working hours available");
    }

    return reasons.slice(0, 4);
  }

  // Apply AI-powered job ranking based on user profile
  private async applyAIJobRanking(
    jobs: JobRecommendation[],
    userProfile: UserProfile
  ): Promise<JobRecommendation[]> {
    // Sort by match score first
    const sortedJobs = jobs.sort((a, b) => b.matchScore - a.matchScore);

    // Apply additional AI-based filtering and ranking
    const personalizedJobs = sortedJobs.filter((job) => {
      // Filter out jobs that don't meet basic criteria
      if (
        userProfile.workPreference === "remote" &&
        job.workArrangement === "onsite"
      ) {
        return false;
      }

      // Prioritize family-friendly jobs for mothers
      if (userProfile.childrenAges && userProfile.childrenAges.length > 0) {
        return (
          job.isMaternityFriendly ||
          job.flexibleHours ||
          job.workArrangement !== "onsite"
        );
      }

      return true;
    });

    // Apply final personalization boost
    return personalizedJobs
      .map((job) => ({
        ...job,
        matchScore: this.applyPersonalizationBoost(job, userProfile),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  private applyPersonalizationBoost(
    job: JobRecommendation,
    userProfile: UserProfile
  ): number {
    let boost = 0;

    // Boost for working mothers with specific needs
    if (userProfile.childrenAges && userProfile.childrenAges.length > 0) {
      if (job.isMaternityFriendly) boost += 10;
      if (job.flexibleHours) boost += 8;
      if (job.workArrangement === "remote") boost += 5;
    }

    // Boost for career stage alignment
    if (
      userProfile.yearsOfExperience &&
      userProfile.yearsOfExperience > 7 &&
      job.experienceLevel === "senior"
    ) {
      boost += 5;
    }

    // Boost for industry match
    if (
      userProfile.industry &&
      job.title.toLowerCase().includes(userProfile.industry.toLowerCase())
    ) {
      boost += 8;
    }

    return Math.min(job.matchScore + boost, 100);
  }

  // AI tip generation utilities
  private generateTipTitle(content: string): string {
    const firstSentence = content.split('.')[0];
    return firstSentence.length > 60 ? 
      firstSentence.substring(0, 57) + '...' : 
      firstSentence;
  }

  private categorizeTip(content: string, user: UserProfile): string {
    const text = content.toLowerCase();
    
    if (text.includes('network')) return 'networking';
    if (text.includes('skill')) return 'skill-development';
    if (text.includes('interview')) return 'interview-prep';
    if (text.includes('balance')) return 'work-life-balance';
    
    return 'career-growth';
  }

  private determineDifficulty(content: string): 'beginner' | 'intermediate' | 'advanced' {
    const text = content.toLowerCase();
    
    if (text.includes('advanced') || text.includes('expert')) return 'advanced';
    if (text.includes('beginner') || text.includes('simple')) return 'beginner';
    
    return 'intermediate';
  }

  private estimateTimeToImplement(content: string): string {
    const text = content.toLowerCase();
    
    if (text.includes('minute')) return '5-15 minutes';
    if (text.includes('hour')) return '1-2 hours';
    if (text.includes('week')) return '1-2 weeks';
    
    return '15-30 minutes';
  }

  private extractTipTags(content: string, user: UserProfile): string[] {
    const tags = [];
    const text = content.toLowerCase();
    
    if (text.includes('remote')) tags.push('remote-work');
    if (text.includes('network')) tags.push('networking');
    if (text.includes('skill')) tags.push('professional-development');
    
    if (user.industry) {
      tags.push(user.industry.toLowerCase().replace(/\s+/g, '-'));
    }
    
    return tags.slice(0, 4);
  }

  private getTargetAudience(user: UserProfile): string[] {
    const audiences = [];
    
    if (user.childrenAges?.length) audiences.push('working-parents');
    if (user.availabilityStatus === 'returning_to_work') audiences.push('career-returners');
    if (user.workPreference === 'remote') audiences.push('remote-workers');
    
    return audiences.length > 0 ? audiences : ['professionals'];
  }

  // Placeholder for Freelancer.com API (not implemented in this version)
  private async fetchFreelancerJobs(userProfile: UserProfile): Promise<FreelanceOpportunity[]> {
    // Implementation for Freelancer.com API would go here
    return [];
  }

  // Mock data methods for fallbacks
  private getMockJobs(userProfile: UserProfile): JobRecommendation[] {
    const isIndia = this.getCountryCode(userProfile.location) === 'in';
    const currency = isIndia ? 'INR' : 'USD';
    const salaryMultiplier = isIndia ? 80 : 1;

    return [
      {
        _id: "mock_job_1",
        title: `Senior ${userProfile.currentRole || 'Professional'} - Remote Friendly`,
        company: "TechForward Inc.",
        location: isIndia ? "Remote / Bangalore, India" : "Remote / San Francisco, CA",
        workArrangement: "remote",
        salaryRange: { 
          min: 85000 * salaryMultiplier, 
          max: 125000 * salaryMultiplier, 
          currency 
        },
        requirements: userProfile.skillsAndExperience?.slice(0, 4) || ["Professional Skills"],
        preferredSkills: ["Leadership", "Communication"],
        description: `Join our growing team as a Senior ${userProfile.currentRole || 'Professional'}. Lead initiatives for our innovative products while enjoying excellent work-life balance and comprehensive benefits. We're a family-friendly company that values diversity and supports working parents.`,
        matchScore: 0,
        isMaternityFriendly: true,
        flexibleHours: true,
        benefits: ["Health Insurance", "Flexible PTO", "Remote Work", "Professional Development Budget"],
        applicationUrl: "https://example.com/apply",
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: "full-time",
        experienceLevel: userProfile.yearsOfExperience && userProfile.yearsOfExperience > 7 ? "senior" : "mid",
        companySize: "medium",
        // companyStage: "growth",
        // diversityCommitment: true,
        // parentingSupport: ["Flexible Schedule", "Family Time Policy", "Childcare Support"],
        reasonsForMatch: [],
        // requirements: userProfile.skillsAndExperience?.slice(0, 3) || [],
        // type: "full-time"
      },
      {
        _id: "mock_job_2",
        title: `${userProfile.currentRole || 'Professional'} Manager - Hybrid`,
        company: "Sustainable Innovations Co.",
        location: isIndia ? "Mumbai, India" : "Denver, CO",
        workArrangement: "hybrid",
        salaryRange: { 
          min: 70000 * salaryMultiplier, 
          max: 100000 * salaryMultiplier, 
          currency 
        },
        requirements: userProfile.skillsAndExperience?.slice(0, 3) || ["Management"],
        preferredSkills: ["Strategy", "Team Leadership"],
        description: `Lead ${userProfile.industry || 'business'} initiatives for our mission-driven company. We offer exceptional work-life balance with flexible options and strong commitment to employee wellbeing.`,
        matchScore: 0,
        isMaternityFriendly: true,
        flexibleHours: true,
        benefits: ["Flexible Schedule", "Equity Package", "Unlimited PTO", "Wellness Stipend"],
        applicationUrl: "https://example.com/apply",
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        type: "full-time",
        experienceLevel: "mid",
        companySize: "small",
        // companyStage: "growth",
        // diversityCommitment: true,
        // parentingSupport: ["Parental Leave", "Flexible Hours", "Mental Health Support"],
        reasonsForMatch: [],
        // requirements: [],
        // type: "full-time"
      }
    ];
  }

  private getMockFreelanceOps(userProfile: UserProfile): FreelanceOpportunity[] {
    const isIndia = this.getCountryCode(userProfile.location) === 'in';
    const currency = isIndia ? 'INR' : 'USD';
    const rateMultiplier = isIndia ? 80 : 1;

    return [
      {
        _id: "mock_freelance_1",
        title: `${userProfile.industry || 'Professional'} Strategy Development`,
        clientName: isIndia ? "Indian Startup" : "HealthTech Startup",
        projectType: "short-term",
        budget: { 
          min: 3000 * rateMultiplier, 
          max: 6000 * rateMultiplier, 
          currency, 
          type: "fixed" 
        },
        duration: "4-6 weeks",
        skillsRequired: userProfile.skillsAndExperience?.slice(0, 4) || ["Professional Skills"],
        description: `Develop comprehensive ${userProfile.industry || 'business'} strategy for innovative platform. Flexible schedule and remote work. Client has excellent payment history.`,
        matchScore: 0,
        isRemote: true,
        applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        experienceLevel: "intermediate"
      },
      {
        _id: "mock_freelance_2",
        title: `${userProfile.skillsAndExperience?.[0] || 'Professional'} Consultation`,
        clientName: isIndia ? "Mumbai Agency" : "E-commerce Growth Agency",
        projectType: "long-term",
        budget: { 
          min: 50 * rateMultiplier, 
          max: 100 * rateMultiplier, 
          currency, 
          type: "hourly" 
        },
        duration: "3-6 months",
        skillsRequired: userProfile.skillsAndExperience?.slice(0, 3) || ["Consulting"],
        description: "Ongoing consultation project with potential for extension. Flexible hours and remote work encouraged.",
        matchScore: 0,
        isRemote: true,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        experienceLevel: "expert"
      }
    ];
  }

  private getMockBusinesses(): SmallBusiness[] {
    return [
      {
        _id: "mock_business_1",
        businessName: "Women Entrepreneurs Hub",
        description: "Supporting women entrepreneurs with business consulting, networking events, and skill development programs.",
        location: "Multiple Locations",
        category: "Professional Services",
        contactInfo: {
          email: "info@womenentrepreneurshub.com",
          phone: "555-0123",
          socialMedia: {
            linkedin: "https://linkedin.com/company/women-entrepreneurs-hub",
            instagram: "@womenentrepreneurshub"
          }
        },
        // ownerInfo: {
        //   name: "Business Owner",
        //   isMother: true,
        //   story: "Supporting women entrepreneurs in their journey to success.",
        //   yearsInBusiness: 5
        // },
        ownerName: "Business Owner",
        ownerId: "owner_1",
        services: ["Business Consulting", "Networking Events", "Skill Development"],
        // specializations: ["Women Entrepreneurship", "Business Strategy", "Networking"],
        // lookingForCollaborators: true,
        // hiringStatus: "open-to-opportunities",
        // workArrangements: ["remote", "hybrid", "flexible"],
        tags: ["women-entrepreneurs", "business-network", "consulting"],
        // verified: true,
        isVerified: true,
        rating: 4.8,
        reviewCount: 45,
        isMomOwned: true,
        images: ["https://example.com/business1.jpg"],
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  private getFallbackTips(userProfile: UserProfile): CareerTip[] {
    return [
      {
        _id: "fallback_1",
        title: "Leverage Your Unique Perspective",
        content: "Your experience provides valuable skills in time management, multitasking, and problem-solving under pressure. Highlight these strengths in interviews and on your resume.",
        category: "career_growth",
        tags: ["strengths", "interview_tips"],
        isPersonalized: true,
        relevanceScore: 85,
        createdAt: new Date(),
        updatedAt: new Date(),
        targetAudience: this.getTargetAudience(userProfile),
        aiGenerated: false,
      }
    ];
  }

  private getFallbackInsights(userProfile: UserProfile): any {
    return {
      _id: `fallback_insight_${Date.now()}`,
      userId: userProfile._id,
      insights: {
        strengthsAnalysis: [
          "Your professional experience demonstrates commitment to career growth",
          "Your adaptability shows in your skill set and experiences",
          "Your work-life balance awareness is valuable"
        ],
        improvementAreas: [
          "Consider expanding digital skills to stay competitive",
          "Strengthening professional network could open opportunities",
          "Developing thought leadership could boost your profile"
        ],
        careerPathSuggestions: [
          `Senior roles in ${userProfile.industry || 'your field'} leveraging your experience`,
          "Consulting opportunities where you can share expertise",
          "Leadership positions that value your perspective"
        ],
        skillGapAnalysis: [
          "Digital transformation skills are increasingly valuable",
          "Data analysis capabilities can enhance decision-making",
          "Remote collaboration tools proficiency is essential"
        ],
        marketTrends: [
          "Flexible work arrangements continue to be in high demand",
          "Companies are prioritizing diversity and inclusion",
          "Skills-based hiring is becoming more common"
        ],
        salaryInsights: {
          currentMarketRate: `Competitive range for ${userProfile.yearsOfExperience || 0} years of experience in ${userProfile.industry || 'your field'}`,
          growthPotential: "Strong potential with continued skill development",
          recommendations: [
            "Research market rates for your role and location",
            "Consider additional certifications to increase value"
          ]
        },
        workLifeBalanceRecommendations: [
          "Look for companies with established family-friendly policies",
          "Consider remote or hybrid opportunities",
          "Prioritize roles with supportive management"
        ],
        networkingOpportunities: [
          `${userProfile.industry || 'Professional'} industry associations`,
          "LinkedIn groups related to your expertise",
          "Local business networking events"
        ],
        personalizedAdvice: [
          "Focus on opportunities that align with your values",
          "Leverage your unique perspective as competitive advantage",
          "Continue investing in professional development"
        ],
        nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      confidenceScore: 70,
      personalizedTips: [],
      generatedAt: new Date(),
      lastUpdated: new Date()
    };
  }

  // Caching utilities
  private getFromCache(key: string, maxAgeMinutes: number): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expires) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, maxAgeMinutes: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (maxAgeMinutes * 60 * 1000)
    });
  }

  // Rate limiting utilities
  private canMakeRequest(apiName: string): boolean {
    const limits: { [key: string]: number } = {
      'adzuna': 100,
      'rapidapi': 100,
      'foursquare': 100,
      'google': 1000,
      'upwork': 100
    };
    
    const current = this.rateLimits.get(apiName);
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    
    if (!current || current.resetTime < hourAgo) {
      this.rateLimits.set(apiName, { requests: 0, resetTime: now + (60 * 60 * 1000) });
      return true;
    }
    
    return current.requests < (limits[apiName] || 100);
  }

  private recordRequest(apiName: string): void {
    const current = this.rateLimits.get(apiName);
    if (current) {
      current.requests++;
    }
  }

  // Cleanup method
  public cleanup(): void {
    this.cache.clear();
    this.rateLimits.clear();
  }
}

// Export singleton instance
export const realTimeCareerService = new RealTimeCareerService();

// Export cleanup function
export const cleanupCareerService = () => {
  realTimeCareerService.cleanup();
};

// Health check function
export const checkCareerServiceHealth = async () => {
  const health = {
    status: 'healthy',
    apis: {
      adzuna: !!process.env.ADZUNA_API_KEY && !!process.env.ADZUNA_APP_ID,
      rapidapi: !!process.env.RAPIDAPI_KEY,
      huggingface: !!process.env.HUGGINGFACE_API_KEY,
      foursquare: !!process.env.FOURSQUARE_API_KEY,
      googlePlaces: !!process.env.GOOGLE_PLACES_API_KEY
    },
    cache: {
      size: realTimeCareerService['cache'].size,
      rateLimits: realTimeCareerService['rateLimits'].size
    },
    timestamp: new Date().toISOString()
  };

  const configuredApis = Object.values(health.apis).filter(Boolean).length;
  if (configuredApis < 2) {
    health.status = 'degraded';
  }

  return health;
};
  