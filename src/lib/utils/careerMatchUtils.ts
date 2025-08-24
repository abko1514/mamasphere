// lib/utils/careerMatchingUtils.ts
import { UserProfile, JobRecommendation } from "@/models/Career";

export class CareerMatchingEngine {
  static calculateJobMatchScore(job: any, user: UserProfile): number {
    let score = 0;
    const weights = {
      skills: 0.3,
      workArrangement: 0.25,
      location: 0.15,
      salary: 0.15,
      maternityFriendly: 0.1,
      flexibility: 0.05,
    };

    // Skills matching
    if (user.skillsAndExperience && job.requirements) {
      const userSkills = user.skillsAndExperience.map((skill) =>
        skill.toLowerCase()
      );
      const jobRequirements = job.requirements.map((req: string) =>
        req.toLowerCase()
      );

    const matchingSkills: string[] = userSkills.filter((skill: string) =>
      jobRequirements.some(
        (req: string) => req.includes(skill) || skill.includes(req)
      )
    );

      const skillsScore =
        (matchingSkills.length / Math.max(jobRequirements.length, 1)) * 100;
      score += skillsScore * weights.skills;
    }

    // Work arrangement preference
    if (user.workPreference === job.workArrangement) {
      score += 100 * weights.workArrangement;
    } else if (
      job.workArrangement === "hybrid" &&
      user.workPreference !== "onsite"
    ) {
      score += 60 * weights.workArrangement;
    }

    // Location matching
    if (user.location && job.location) {
      if (job.workArrangement === "remote") {
        score += 100 * weights.location;
      } else if (
        job.location.toLowerCase().includes(user.location.toLowerCase())
      ) {
        score += 100 * weights.location;
      } else {
        // Partial location match (same state/country)
        const userLocationParts = user.location.split(",");
        const jobLocationParts = job.location.split(",");
        const commonParts: string[] = userLocationParts.filter((part: string) =>
          jobLocationParts.some(
            (jobPart: string) =>
              jobPart.trim().toLowerCase() === part.trim().toLowerCase()
          )
        );
        score +=
          (commonParts.length / Math.max(userLocationParts.length, 1)) *
          50 *
          weights.location;
      }
    }

    // Salary range matching
    if (user.desiredSalaryRange && job.salaryRange) {
      const userMin = user.desiredSalaryRange.min;
      const userMax = user.desiredSalaryRange.max;
      const jobMin = job.salaryRange.min;
      const jobMax = job.salaryRange.max;

      if (jobMin >= userMin && jobMax <= userMax * 1.2) {
        score += 100 * weights.salary;
      } else if (jobMax >= userMin && jobMin <= userMax) {
        // Partial overlap
        const overlap = Math.min(jobMax, userMax) - Math.max(jobMin, userMin);
        const userRange = userMax - userMin;
        score += (overlap / userRange) * 100 * weights.salary;
      }
    }

    // Maternity-friendly bonus
    if (
      (user.isPregnant ||
        (user.childrenAges && user.childrenAges.length > 0)) &&
      job.isMaternityFriendly
    ) {
      score += 100 * weights.maternityFriendly;
    }

    // Flexible hours bonus
    if (
      job.flexibleHours &&
      (user.isPregnant || (user.childrenAges && user.childrenAges.length > 0))
    ) {
      score += 100 * weights.flexibility;
    }

    return Math.min(Math.round(score), 100);
  }

  static generateMatchReasons(job: any, user: UserProfile): string[] {
    const reasons: string[] = [];

    // Skills match
    if (user.skillsAndExperience && job.requirements) {
      const matchingSkills = user.skillsAndExperience.filter((skill) =>
        job.requirements.some((req: string) =>
          req.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (matchingSkills.length > 0) {
        reasons.push(
          `Your skills match ${
            matchingSkills.length
          } requirements: ${matchingSkills.slice(0, 3).join(", ")}`
        );
      }
    }

    // Work arrangement
    if (user.workPreference === job.workArrangement) {
      reasons.push(
        `Perfect match for your ${job.workArrangement} work preference`
      );
    }

    // Family-friendly features
    if (
      job.isMaternityFriendly &&
      (user.isPregnant || (user.childrenAges && user.childrenAges.length > 0))
    ) {
      reasons.push("Family-friendly workplace with maternity support");
    }

    if (job.flexibleHours) {
      reasons.push("Offers flexible working hours for work-life balance");
    }

    // Industry match
    if (
      user.industry &&
      job.title.toLowerCase().includes(user.industry.toLowerCase())
    ) {
      reasons.push(`Matches your ${user.industry} industry experience`);
    }

    // Experience level
    if (user.yearsOfExperience) {
      if (job.type === "senior" && user.yearsOfExperience >= 5) {
        reasons.push("Your senior-level experience aligns with this role");
      } else if (job.type !== "senior" && user.yearsOfExperience >= 2) {
        reasons.push("Your experience level matches this position");
      }
    }

    return reasons.slice(0, 4); // Limit to 4 reasons
  }

  static calculateFreelanceMatchScore(
    opportunity: any,
    user: UserProfile
  ): number {
    let score = 0;

    // Skills matching (40% weight)
    if (user.skillsAndExperience && opportunity.skillsRequired) {
      const matchingSkills = user.skillsAndExperience.filter((skill) =>
        opportunity.skillsRequired.some(
          (req: string) =>
            req.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(req.toLowerCase())
        )
      );
      score += (matchingSkills.length / opportunity.skillsRequired.length) * 40;
    }

    // Experience level matching (20% weight)
    if (user.yearsOfExperience) {
      let experienceMatch = 0;
      if (
        opportunity.experienceLevel === "beginner" &&
        user.yearsOfExperience <= 2
      ) {
        experienceMatch = 20;
      } else if (
        opportunity.experienceLevel === "intermediate" &&
        user.yearsOfExperience >= 2 &&
        user.yearsOfExperience <= 5
      ) {
        experienceMatch = 20;
      } else if (
        opportunity.experienceLevel === "expert" &&
        user.yearsOfExperience > 5
      ) {
        experienceMatch = 20;
      } else {
        experienceMatch = 10; // Partial match
      }
      score += experienceMatch;
    }

    // Budget matching (25% weight)
    if (user.desiredSalaryRange && opportunity.budget) {
      const hourlyEquivalent =
        opportunity.budget.type === "hourly"
          ? opportunity.budget.min
          : opportunity.budget.min / 40; // Rough conversion for fixed projects

      const expectedHourly = user.desiredSalaryRange.min / 160; // Monthly to hourly rough conversion

      if (hourlyEquivalent >= expectedHourly) {
        score += 25;
      } else {
        score += (hourlyEquivalent / expectedHourly) * 25;
      }
    }

    // Remote work preference (15% weight)
    if (opportunity.isRemote) {
      if (
        user.workPreference === "remote" ||
        user.isPregnant ||
        (user.childrenAges && user.childrenAges.length > 0)
      ) {
        score += 15;
      }
    }

    return Math.min(Math.round(score), 100);
  }
}
