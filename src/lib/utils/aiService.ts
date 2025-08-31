// lib/services/aiService.ts
import { UserProfile } from "@/models/Career";

export class AIService {
  private huggingFaceToken: string;
  private baseUrl = "https://api-inference.huggingface.co/models";

  constructor() {
    this.huggingFaceToken = process.env.HUGGINGFACE_API_KEY || "";
  }

  // Generate career tips using Hugging Face's free text generation
  async generatePersonalizedTips(user: UserProfile): Promise<string[]> {
    try {
      const prompt = this.buildTipsPrompt(user);

      const response = await fetch(`${this.baseUrl}/microsoft/DialoGPT-large`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.huggingFaceToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.7,
            num_return_sequences: 5,
          },
        }),
      });

      if (!response.ok) {
        console.warn("Hugging Face API failed, using fallback");
        return this.getFallbackTips(user);
      }

      const result = await response.json();
      return this.parseTipsFromResponse(result);
    } catch (error) {
      console.error("Error generating AI tips:", error);
      return this.getFallbackTips(user);
    }
  }

  // Generate career insights
  async generateCareerInsights(user: UserProfile): Promise<any> {
    try {
      const prompt = this.buildInsightsPrompt(user);

      // Using a smaller, faster model for insights
      const response = await fetch(`${this.baseUrl}/google/flan-t5-base`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.huggingFaceToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 800,
            temperature: 0.6,
          },
        }),
      });

      if (!response.ok) {
        return this.getFallbackInsights(user);
      }

      const result = await response.json();
      return this.parseInsightsFromResponse(result, user);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      return this.getFallbackInsights(user);
    }
  }

  private buildTipsPrompt(user: UserProfile): string {
    return `Generate 5 personalized career tips for a professional with this profile:
- Role: ${user.currentRole || "Professional"}
- Industry: ${user.industry || "General"}
- Experience: ${user.yearsOfExperience || 0} years
- Skills: ${user.skillsAndExperience?.join(", ") || "Various skills"}
- Work Preference: ${user.workPreference || "Flexible"}
- Goals: ${user.careerGoals || "Career advancement"}

Focus on actionable, specific advice that considers work-life balance and professional growth.`;
  }

  private buildInsightsPrompt(user: UserProfile): string {
    return `Analyze this professional profile and provide career insights:
- Current Role: ${user.currentRole}
- Industry: ${user.industry}
- Years of Experience: ${user.yearsOfExperience}
- Skills: ${user.skillsAndExperience?.join(", ")}
- Location: ${user.location}
- Work Preference: ${user.workPreference}

Provide insights on:
1. Strengths analysis
2. Skill gaps
3. Career path suggestions
4. Market trends
5. Salary insights`;
  }

  private parseTipsFromResponse(response: any): string[] {
    try {
      if (Array.isArray(response)) {
        return response
          .map((item) =>
            typeof item === "string" ? item : item.generated_text || ""
          )
          .filter((tip) => tip.length > 10)
          .slice(0, 5);
      }

      if (response.generated_text) {
        // Split by common delimiters and clean up
        return response.generated_text
          .split(/\d+\.|•|\n/)
          .map((tip: string) => tip.trim())
          .filter((tip: string) => tip.length > 20)
          .slice(0, 5);
      }

      return [];
    } catch (error) {
      console.error("Error parsing tips response:", error);
      return [];
    }
  }

  private parseInsightsFromResponse(response: any, user: UserProfile): any {
    try {
      const text = response.generated_text || response[0]?.generated_text || "";

      return {
        _id: `ai_insight_${Date.now()}`,
        userId: user._id,
        insights: {
          strengthsAnalysis:
            this.extractSection(text, "strengths") ||
            this.getDefaultStrengths(user),
          improvementAreas:
            this.extractSection(text, "gaps") ||
            this.getDefaultImprovements(user),
          careerPathSuggestions:
            this.extractSection(text, "career") ||
            this.getDefaultCareerPaths(user),
          skillGapAnalysis:
            this.extractSection(text, "skills") ||
            this.getDefaultSkillGaps(user),
          marketTrends:
            this.extractSection(text, "trends") ||
            this.getDefaultMarketTrends(user),
          salaryInsights: {
            currentMarketRate: this.extractSalaryInfo(text, user),
            growthPotential: "15-25% growth potential with skill development",
            recommendations: [
              "Consider additional certifications",
              "Build leadership experience",
            ],
          },
          workLifeBalanceRecommendations: this.getWorkLifeRecommendations(user),
          networkingOpportunities: this.getNetworkingOpportunities(user),
          personalizedAdvice: this.getPersonalizedAdvice(user),
          nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        confidenceScore: 75,
        personalizedTips: [],
        generatedAt: new Date(),
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error("Error parsing insights:", error);
      return this.getFallbackInsights(user);
    }
  }

  private extractSection(text: string, keyword: string): string[] | null {
    const lines = text.split("\n");
    const relevantLines = lines.filter(
      (line) =>
        line.toLowerCase().includes(keyword) ||
        line.includes("•") ||
        line.match(/\d+\./)
    );

    if (relevantLines.length > 0) {
      return relevantLines
        .map((line) => line.replace(/^\d+\.|\•/, "").trim())
        .filter((line) => line.length > 10)
        .slice(0, 3);
    }

    return null;
  }

  private extractSalaryInfo(text: string, user: UserProfile): string {
    const experience = user.yearsOfExperience || 0;
    const industry = user.industry || "General";

    // Basic salary estimation logic
    const baseRanges: { [key: string]: [number, number] } = {
      Technology: [80000, 150000],
      Healthcare: [60000, 120000],
      Marketing: [50000, 100000],
      Education: [40000, 80000],
      Finance: [70000, 140000],
    };

    const range = baseRanges[industry] || [45000, 90000];
    const experienceMultiplier = 1 + experience * 0.05;

    const min = Math.round(range[0] * experienceMultiplier);
    const max = Math.round(range[1] * experienceMultiplier);

    return `$${min.toLocaleString()} - $${max.toLocaleString()} based on your experience and industry`;
  }

  private getFallbackTips(user: UserProfile): string[] {
    const tips = [
      "Update your LinkedIn profile with recent achievements and skills",
      "Network with professionals in your industry through virtual events",
      "Consider taking online courses to fill skill gaps in your field",
      "Set up informational interviews with people in roles you're interested in",
      "Create a portfolio showcasing your best work and projects",
    ];

    // Personalize based on user profile
    if (user.workPreference === "remote") {
      tips.push(
        "Highlight your remote work skills and self-management abilities"
      );
    }

    if (user.availabilityStatus === "returning_to_work") {
      tips.push(
        "Consider contract or part-time roles to ease back into the workforce"
      );
    }

    return tips.slice(0, 5);
  }

  private getFallbackInsights(user: UserProfile): any {
    return {
      _id: `ai_insight_${Date.now()}`,
      userId: user._id,
      insights: {
        strengthsAnalysis: this.getDefaultStrengths(user),
        improvementAreas: this.getDefaultImprovements(user),
        careerPathSuggestions: this.getDefaultCareerPaths(user),
        skillGapAnalysis: this.getDefaultSkillGaps(user),
        marketTrends: this.getDefaultMarketTrends(user),
        salaryInsights: {
          currentMarketRate: this.extractSalaryInfo("", user),
          growthPotential: "Strong growth potential in your field",
          recommendations: [
            "Continue developing technical skills",
            "Expand your professional network",
          ],
        },
        workLifeBalanceRecommendations: this.getWorkLifeRecommendations(user),
        networkingOpportunities: this.getNetworkingOpportunities(user),
        personalizedAdvice: this.getPersonalizedAdvice(user),
        nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      confidenceScore: 65,
      personalizedTips: [],
      generatedAt: new Date(),
      lastUpdated: new Date(),
    };
  }

  private getDefaultStrengths(user: UserProfile): string[] {
    const strengths = [];

    if (user.yearsOfExperience && user.yearsOfExperience >= 5) {
      strengths.push(
        "Extensive professional experience provides strong foundation"
      );
    }

    if (user.skillsAndExperience && user.skillsAndExperience.length >= 3) {
      strengths.push(
        "Diverse skill set demonstrates adaptability and continuous learning"
      );
    }

    if (user.workPreference === "remote" || user.workPreference === "hybrid") {
      strengths.push(
        "Flexibility with work arrangements shows modern workplace adaptability"
      );
    }

    strengths.push("Professional commitment to career development and growth");

    return strengths;
  }

  private getDefaultImprovements(user: UserProfile): string[] {
    return [
      "Consider expanding digital skills relevant to your industry",
      "Strengthen your professional network through industry events",
      "Develop leadership and communication skills for career advancement",
    ];
  }

  private getDefaultCareerPaths(user: UserProfile): string[] {
    const paths = [];
    const experience = user.yearsOfExperience || 0;

    if (experience >= 7) {
      paths.push("Senior leadership roles in your current field");
      paths.push("Consulting or advisory positions leveraging your expertise");
    } else if (experience >= 3) {
      paths.push("Team lead or management positions");
      paths.push("Specialist roles in your area of expertise");
    } else {
      paths.push("Skill development and specialization opportunities");
      paths.push("Cross-functional roles to broaden experience");
    }

    if (user.workPreference === "remote") {
      paths.push("Remote-first companies and distributed teams");
    }

    return paths;
  }

  private getDefaultSkillGaps(user: UserProfile): string[] {
    return [
      "Digital literacy and emerging technology familiarity",
      "Data analysis and interpretation capabilities",
      "Project management and organizational skills",
      "Communication and collaboration tools proficiency",
    ];
  }

  private getDefaultMarketTrends(user: UserProfile): string[] {
    return [
      "Remote and hybrid work models continue to expand",
      "Skills-based hiring becoming more prevalent than degree requirements",
      "Companies prioritizing diversity and inclusion initiatives",
      "Increasing focus on work-life balance and employee wellbeing",
    ];
  }

  private getWorkLifeRecommendations(user: UserProfile): string[] {
    return [
      "Look for companies with strong family support policies",
      "Consider flexible work arrangements that fit your lifestyle",
      "Prioritize roles with outcome-based rather than time-based metrics",
      "Research company culture and employee satisfaction ratings",
    ];
  }

  private getNetworkingOpportunities(user: UserProfile): string[] {
    const industry = user.industry || "Professional";
    return [
      `${industry} professional associations and local chapters`,
      "LinkedIn industry groups and professional networks",
      "Virtual conferences and webinars in your field",
      "Alumni networks from your educational background",
    ];
  }

  private getPersonalizedAdvice(user: UserProfile): string[] {
    const advice = [
      "Focus on roles that align with your values and career goals",
      "Leverage your unique experience and perspective as differentiators",
    ];

    if (user.availabilityStatus === "returning_to_work") {
      advice.push(
        "Consider gradual re-entry through part-time or project work"
      );
    }

    if (user.childrenAges && user.childrenAges.length > 0) {
      advice.push(
        "Your parenting experience has developed valuable professional skills"
      );
    }

    return advice;
  }
}

export const aiService = new AIService();