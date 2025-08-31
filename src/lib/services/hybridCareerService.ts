// lib/services/hybridCareerService.ts
import { realTimeCareerService } from "./realTimeCareerService";
import { careerService } from "../careerService";
import { APIKeyManager } from "./apiKeyManager";
import {
  UserProfile,
  JobRecommendation,
  CareerTip,
  FreelanceOpportunity,
  SmallBusiness,
  AICareerInsight,
} from "@/models/Career";

function convertCareerTipCategory(category: string): string {
  switch (category) {
    case "skill-development":
      return "skills_development";
    case "work-life-balance":
      return "work_life_balance";
    case "career-growth":
      return "career_growth";
    // Add other mappings as needed
    default:
      return category;
  }
}

class HybridCareerService {
  private apiManager = APIKeyManager.getInstance();

  async getPersonalizedJobRecommendations(
    userProfile: UserProfile,
    filters?: Record<string, any>
  ): Promise<JobRecommendation[]> {
    const config = this.apiManager.getFailsafeConfig();

    try {
      if (config.availableServices.jobs && config.useRealData) {
        console.log("Fetching real job data...");
        const realJobs =
          await realTimeCareerService.getPersonalizedJobRecommendations(
            userProfile,
            filters
          );

        if (realJobs.length > 0) {
          return realJobs;
        }
      }

      console.log("Using fallback job data...");
      const fallbackJobs = await careerService.getJobRecommendations(
        userProfile._id,
        filters
      );
      return fallbackJobs
        .filter(job => job.workArrangement === "remote" || job.workArrangement === "hybrid" || job.workArrangement === "onsite" || job.workArrangement === "flexible")
        .map(job => ({
          ...job,
          type: job.jobType ?? "unknown",
          requirements: job.requiredSkills ?? [],
          benefits: job.benefitsHighlights ?? [],
          applicationUrl: job.applicationUrl ?? "",
          workArrangement: job.workArrangement === "flexible" ? "hybrid" : job.workArrangement,
        }));
    } catch (error) {
      console.error(
        "Error in job recommendations, falling back to mock data:",
        error
      );
      const fallbackJobs = await careerService.getJobRecommendations(
        userProfile._id,
        filters
      );
      return fallbackJobs
        .filter(job => job.workArrangement === "remote" || job.workArrangement === "hybrid" || job.workArrangement === "onsite" || job.workArrangement === "flexible")
        .map(job => ({
          ...job,
          type: job.jobType ?? "unknown",
          requirements: job.requiredSkills ?? [],
          benefits: job.benefitsHighlights ?? [],
          applicationUrl: job.applicationUrl ?? "",
          workArrangement: job.workArrangement === "flexible" ? "hybrid" : job.workArrangement,
        }));
    }
  }

  async getPersonalizedTips(userProfile: UserProfile): Promise<CareerTip[]> {
    const config = this.apiManager.getFailsafeConfig();

    try {
      if (config.availableServices.ai && config.useRealData) {
        console.log("Generating AI-powered tips...");
        const aiTips = await realTimeCareerService.generatePersonalizedTips(
          userProfile
        );

        if (aiTips.length > 0) {
          return aiTips;
        }
      }

      console.log("Using fallback tips...");
      const tips = await careerService.getPersonalizedTips(userProfile._id);
      return tips.map(tip => ({
        ...tip,
        category: convertCareerTipCategory(tip.category)
      }));
    } catch (error) {
      console.error(
        "Error generating AI tips, falling back to curated tips:",
        error
      );
      const tips = await careerService.getPersonalizedTips(userProfile._id);
      return tips.map(tip => ({
        ...tip,
        category: convertCareerTipCategory(tip.category)
      }));
    }
  }

  async getFreelanceOpportunities(
    userProfile: UserProfile
  ): Promise<FreelanceOpportunity[]> {
    const config = this.apiManager.getFailsafeConfig();

    try {
      if (config.availableServices.freelance && config.useRealData) {
        console.log("Fetching real freelance opportunities...");
        const realOpportunities =
          await realTimeCareerService.getFreelanceOpportunities(userProfile);

        if (realOpportunities.length > 0) {
          return realOpportunities;
        }
      }

      console.log("Using fallback freelance data...");
      const fallbackOpportunities = await careerService.getFreelanceOpportunities(userProfile._id);
      return fallbackOpportunities.map(opportunity => ({
        ...opportunity,
        budget: {
          ...opportunity.budget,
          type: opportunity.budget.type === "project" || opportunity.budget.type === "monthly" ? "fixed" : opportunity.budget.type
        }
      }));
    } catch (error) {
      console.error(
        "Error fetching freelance data, falling back to mock data:",
        error
      );
      const fallbackOpportunities = await careerService.getFreelanceOpportunities(userProfile._id);
      return fallbackOpportunities.map(opportunity => ({
        ...opportunity,
        budget: {
          ...opportunity.budget,
          type: opportunity.budget.type === "project" || opportunity.budget.type === "monthly" ? "fixed" : opportunity.budget.type
        }
      }));
    }
  }

  async getSmallBusinesses(
    filters?: Record<string, any>
  ): Promise<SmallBusiness[]> {
    const config = this.apiManager.getFailsafeConfig();

    try {
      if (config.availableServices.businesses && config.useRealData) {
        console.log("Fetching real business data...");
        const realBusinesses = await realTimeCareerService.getSmallBusinesses(
          filters
        );

        if (realBusinesses.length > 0) {
          return realBusinesses;
        }
      }

      console.log("Using fallback business data...");
      const fallbackBusinesses = await careerService.getSmallBusinesses(filters);
      return fallbackBusinesses.map(business => ({
        ...business,
        contactInfo: (business).contact ?? {
          email: "",
          phone: "",
          website: ""
        }
      }));
    } catch (error) {
      console.error(
        "Error fetching business data, falling back to mock data:",
        error
      );
      return await careerService.getSmallBusinesses(filters);
    }
  }

  async generateAICareerInsights(
    userProfile: UserProfile
  ): Promise<AICareerInsight> {
    const config = this.apiManager.getFailsafeConfig();

    try {
      if (config.availableServices.ai && config.useRealData) {
        console.log("Generating real AI insights...");
        const realInsights =
          await realTimeCareerService.generateAICareerInsights(userProfile);

        if (realInsights) {
          return realInsights;
        }
      }

      console.log("Using fallback insights...");
      const fallbackInsights = await careerService.generateAICareerInsights(userProfile._id);
      return {
        ...fallbackInsights,
        nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      };
    } catch (error) {
      console.error(
        "Error generating AI insights, falling back to templated insights:",
        error
      );
      const fallbackInsights = await careerService.generateAICareerInsights(userProfile._id);
      return {
        ...fallbackInsights,
        nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      };
    }
  }
}

export const hybridCareerService = new HybridCareerService();
