// lib/careerService.ts
import {
  UserProfile,
  CareerTip,
  JobRecommendation,
  SmallBusiness,
  FreelanceOpportunity,
  AICareerInsight,
} from "@/models/Career";

class CareerService {
  private baseUrl = "/api/career";

  async generateAICareerInsights(userId: string): Promise<AICareerInsight> {
    const response = await fetch(`${this.baseUrl}/ai-insights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate AI career insights");
    }

    return response.json();
  }

  async getPersonalizedTips(userId: string): Promise<CareerTip[]> {
    const response = await fetch(`${this.baseUrl}/tips?userId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch personalized tips");
    }

    return response.json();
  }

  async getJobRecommendations(
    userId: string,
    filters?: {
      type?: string;
      workArrangement?: string;
      location?: string;
      salaryMin?: number;
    }
  ): Promise<JobRecommendation[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("userId", userId);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(
      `${this.baseUrl}/jobs?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch job recommendations");
    }

    return response.json();
  }

  async getSmallBusinesses(filters?: {
    category?: string;
    location?: string;
    momOwned?: boolean;
  }): Promise<SmallBusiness[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(
      `${this.baseUrl}/small-businesses?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch small businesses");
    }

    return response.json();
  }

  async getFreelanceOpportunities(
    userId: string,
    filters?: {
      projectType?: string;
      budgetMin?: number;
      experienceLevel?: string;
    }
  ): Promise<FreelanceOpportunity[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("userId", userId);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(
      `${this.baseUrl}/freelance?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch freelance opportunities");
    }

    return response.json();
  }

  async saveJobApplication(jobId: string, userId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId, userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to save job application");
    }
  }

  async registerSmallBusiness(
    businessData: Partial<SmallBusiness>
  ): Promise<SmallBusiness> {
    const response = await fetch(`${this.baseUrl}/small-businesses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(businessData),
    });

    if (!response.ok) {
      throw new Error("Failed to register small business");
    }

    return response.json();
  }

  async updateUserCareerProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}/profile/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update career profile");
    }

    return response.json();
  }
}

export const careerService = new CareerService();
