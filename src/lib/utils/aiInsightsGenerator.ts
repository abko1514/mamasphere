// lib/utils/aiInsightsGenerator.ts
// Add this import or type definition for UserProfile
import { UserProfile } from '../../models/UserDetails';

export class AIInsightsGenerator {
  static async generateCareerInsights(user: UserProfile) {
    const insights = {
      strengthsAnalysis: this.analyzeStrengths(user),
      improvementAreas: this.identifyImprovementAreas(user),
      careerPathSuggestions: this.suggestCareerPaths(user),
      skillGapAnalysis: this.analyzeSkillGaps(user),
      marketTrends: this.getMarketTrends(user.industry),
    };

    return insights;
  }

  private static analyzeStrengths(user: UserProfile): string[] {
    const strengths: string[] = [];

    if (user.skillsAndExperience && user.skillsAndExperience.length >= 5) {
      strengths.push(
        "Diverse skill portfolio demonstrates adaptability and continuous learning"
      );
    }

    if (user.yearsOfExperience && user.yearsOfExperience >= 5) {
      strengths.push(
        "Extensive professional experience provides strong foundation for leadership roles"
      );
    }

    if (user.educationLevel === "masters" || user.educationLevel === "phd") {
      strengths.push(
        "Advanced education showcases analytical thinking and subject matter expertise"
      );
    }

    if (user.childrenAges && user.childrenAges.length > 0) {
      strengths.push(
        "Parenting experience has developed exceptional multitasking and time management skills"
      );
    }

    if (user.workPreference === "remote" || user.workPreference === "hybrid") {
      strengths.push(
        "Flexibility in work arrangements shows adaptability to modern work environments"
      );
    }

    return strengths.length > 0
      ? strengths
      : ["Your professional profile shows commitment to continuous growth"];
  }

  private static identifyImprovementAreas(user: UserProfile): string[] {
    const areas: string[] = [];

    if (user.availabilityStatus === "maternity_leave") {
      areas.push(
        "Consider staying current with industry trends and technologies during your leave"
      );
      areas.push(
        "Maintain professional networking connections to ease your return to work"
      );
    }

    if (!user.skillsAndExperience || user.skillsAndExperience.length < 3) {
      areas.push(
        "Expanding your skill set could open up more career opportunities"
      );
    }

    if (!user.careerGoals) {
      areas.push(
        "Setting clear career goals will help guide your professional development"
      );
    }

    // const currentYear = new Date().getFullYear();
    const digitalSkills = [
      "AI",
      "Data Analysis",
      "Digital Marketing",
      "Cloud Computing",
    ];
    const hasDigitalSkills = user.skillsAndExperience?.some((skill) =>
      digitalSkills.some((ds) => skill.toLowerCase().includes(ds.toLowerCase()))
    );

    if (!hasDigitalSkills) {
      areas.push(
        "Consider developing digital skills to stay competitive in the modern job market"
      );
    }

    return areas.length > 0
      ? areas
      : ["Continue building on your existing strengths"];
  }

  private static suggestCareerPaths(user: UserProfile): string[] {
    const suggestions: string[] = [];

    if (user.availabilityStatus === "maternity_leave") {
      suggestions.push(
        "Explore remote consulting opportunities that leverage your expertise"
      );
      suggestions.push(
        "Consider part-time roles with growth potential for a gradual return"
      );
    }

    if (user.availabilityStatus === "returning_to_work") {
      suggestions.push(
        "Look for companies with strong family support policies and flexible arrangements"
      );
      suggestions.push(
        "Consider project-based or contract work to build confidence and update skills"
      );
    }

    if (user.yearsOfExperience && user.yearsOfExperience >= 7) {
      suggestions.push(
        "Your experience positions you well for leadership or mentoring roles"
      );
      suggestions.push(
        "Consider entrepreneurship or starting a consulting practice in your field"
      );
    }

    if (user.industry === "Technology") {
      suggestions.push(
        "Tech companies often offer excellent remote work and family benefits"
      );
      suggestions.push(
        "Consider specializing in emerging tech areas like AI, cybersecurity, or data science"
      );
    }

    return suggestions.length > 0
      ? suggestions
      : ["Focus on roles that align with your work-life balance priorities"];
  }

  private static analyzeSkillGaps(user: UserProfile): string[] {
    const gaps: string[] = [];

    // Industry-specific skill gaps
    if (user.industry === "Technology") {
      gaps.push(
        "Cloud computing skills (AWS, Azure) are increasingly valuable"
      );
      gaps.push("Data analysis and visualization skills are in high demand");
    } else if (user.industry === "Marketing") {
      gaps.push(
        "Digital marketing automation and analytics skills are essential"
      );
      gaps.push(
        "Social media strategy and content creation expertise is valuable"
      );
    } else if (user.industry === "Healthcare") {
      gaps.push(
        "Telemedicine and digital health platforms knowledge is growing"
      );
      gaps.push(
        "Healthcare data analysis and population health management skills"
      );
    }

    // General modern workplace skills
    gaps.push(
      "Project management certification (PMP, Agile) enhances leadership prospects"
    );
    gaps.push("Communication and virtual collaboration tools proficiency");

    return gaps;
  }

  private static getMarketTrends(industry?: string): string[] {
    const trends = [
      "Remote and hybrid work models continue to dominate the job market",
      "Companies are prioritizing diversity, equity, and inclusion initiatives",
      "Skills-based hiring is becoming more common than degree requirements",
      "Mental health and wellness benefits are increasingly important to employees",
    ];

    if (industry === "Technology") {
      trends.push(
        "AI and machine learning roles are experiencing explosive growth"
      );
      trends.push("Cybersecurity professionals are in extremely high demand");
    } else if (industry === "Healthcare") {
      trends.push("Telehealth and digital health solutions continue expanding");
      trends.push("Healthcare technology integration is accelerating");
    }

    return trends;
  }
}
