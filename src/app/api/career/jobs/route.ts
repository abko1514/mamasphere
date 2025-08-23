// pages/api/career/jobs.ts
import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import { JobRecommendation } from "@/models/Career";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const dbConnection = await dbConnect();
    const db = (dbConnection as any)?.db ? (dbConnection as any).db() : dbConnection;
    // If dbConnect returns void, throw an error
    if (!db) {
      throw new Error("Database connection failed");
    }
    const { userId, type, workArrangement, location, salaryMin } = req.query;

    // Get user profile for personalized recommendations
    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build query based on filters and user profile
    const query: any = {};

    if (type) query.type = type;
    if (workArrangement) query.workArrangement = workArrangement;
    if (location) query.location = { $regex: location, $options: "i" };
    if (salaryMin)
      query["salaryRange.min"] = { $gte: parseInt(salaryMin as string) };

    // Prioritize maternity-friendly jobs if user has children or is pregnant
    if (user.isPregnant || user.childrenAges?.length > 0) {
      query.isMaternityFriendly = true;
    }

    // Fetch job recommendations
    let jobs = await db
      .collection("jobRecommendations")
      .find(query)
      .sort({ postedDate: -1 })
      .limit(20)
      .toArray();

    // Calculate match scores for each job
    interface User {
        _id: string;
        skillsAndExperience?: string[];
        workPreference?: string;
        location?: string;
        desiredSalaryRange?: {
            min: number;
            max: number;
        };
        isPregnant?: boolean;
        childrenAges?: number[];
        yearsOfExperience?: number;
    }

    interface JobRecommendationType {
        _id: string;
        type?: string;
        workArrangement?: string;
        location?: string;
        salaryRange?: {
            min: number;
            max: number;
        };
        isMaternityFriendly?: boolean;
        postedDate?: Date;
        requirements?: string[];
        flexibleHours?: boolean;
        matchScore?: number;
        reasonsForMatch?: string[];
    }

    jobs = jobs.map((job: JobRecommendationType) => ({
        ...job,
        matchScore: calculateMatchScore(job, user as User),
        reasonsForMatch: generateMatchReasons(job, user as User),
    }));

    // Sort by match score
    jobs.sort((a: JobRecommendationType, b: JobRecommendationType) => b.matchScore! - a.matchScore!);

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

function calculateMatchScore(job: any, user: any): number {
  let score = 0;

  // Skills match
  if (user.skillsAndExperience && job.requirements) {
    const skillMatches = user.skillsAndExperience.filter((skill: string) =>
      job.requirements.some((req: string) =>
        req.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;
    score += (skillMatches / Math.max(user.skillsAndExperience.length, 1)) * 30;
  }

  // Work arrangement preference
  if (user.workPreference === job.workArrangement) {
    score += 25;
  }

  // Location match
  if (user.location && job.location.includes(user.location)) {
    score += 20;
  }

  // Salary range match
  if (user.desiredSalaryRange && job.salaryRange) {
    if (
      job.salaryRange.min >= user.desiredSalaryRange.min &&
      job.salaryRange.max <= user.desiredSalaryRange.max * 1.2
    ) {
      score += 15;
    }
  }

  // Maternity-friendly bonus
  if (
    (user.isPregnant || user.childrenAges?.length > 0) &&
    job.isMaternityFriendly
  ) {
    score += 10;
  }

  return Math.min(score, 100);
}

function generateMatchReasons(job: any, user: any): string[] {
  const reasons = [];

  if (user.workPreference === job.workArrangement) {
    reasons.push(
      `Matches your preferred work arrangement: ${job.workArrangement}`
    );
  }

  if (
    job.isMaternityFriendly &&
    (user.isPregnant || user.childrenAges?.length > 0)
  ) {
    reasons.push("Maternity-friendly workplace with supportive policies");
  }

  if (job.flexibleHours) {
    reasons.push("Offers flexible working hours");
  }

  if (user.skillsAndExperience) {
    const matchingSkills = user.skillsAndExperience.filter((skill: string) =>
      job.requirements?.some((req: string) =>
        req.toLowerCase().includes(skill.toLowerCase())
      )
    );
    if (matchingSkills.length > 0) {
      reasons.push(
        `Your skills match: ${matchingSkills.slice(0, 3).join(", ")}`
      );
    }
  }

  return reasons;
}

// pages/api/career/freelance.ts
export async function getFreelanceHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const dbConnection = await dbConnect();
    const db = (dbConnection as any)?.db ? (dbConnection as any).db() : dbConnection;
    const { userId, projectType, budgetMin, experienceLevel } = req.query;

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const query: any = {};

    if (projectType) query.projectType = projectType;
    if (budgetMin)
      query["budget.min"] = { $gte: parseInt(budgetMin as string) };
    if (experienceLevel) query.experienceLevel = experienceLevel;

    // Only show active opportunities
    query.applicationDeadline = { $gte: new Date() };

    let opportunities = await db
      .collection("freelanceOpportunities")
      .find(query)
      .sort({ postedDate: -1 })
      .limit(15)
      .toArray();

    // Calculate match scores
    interface FreelanceOpportunity {
      _id: string;
      projectType?: string;
      budget?: {
        min: number;
        max: number;
        type: "hourly" | "fixed";
      };
      experienceLevel?: "beginner" | "intermediate" | "expert";
      skillsRequired?: string[];
      postedDate?: Date;
      applicationDeadline?: Date;
      isRemote?: boolean;
      matchScore?: number;
    }

    interface User {
      _id: string;
      skillsAndExperience?: string[];
      workPreference?: string;
      location?: string;
      desiredSalaryRange?: {
        min: number;
        max: number;
      };
      isPregnant?: boolean;
      childrenAges?: number[];
      yearsOfExperience?: number;
    }

    opportunities = opportunities.map((opp: FreelanceOpportunity) => ({
      ...opp,
      matchScore: calculateFreelanceMatchScore(opp, user as User),
    }));

    opportunities.sort(
      (a: FreelanceOpportunity & { matchScore: number }, b: FreelanceOpportunity & { matchScore: number }) =>
        b.matchScore - a.matchScore
    );

    res.status(200).json(opportunities);
  } catch (error) {
    console.error("Error fetching freelance opportunities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

function calculateFreelanceMatchScore(opportunity: any, user: any): number {
  let score = 0;

  // Skills match
  if (user.skillsAndExperience && opportunity.skillsRequired) {
    const skillMatches = user.skillsAndExperience.filter((skill: string) =>
      opportunity.skillsRequired.some((req: string) =>
        req.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;
    score +=
      (skillMatches / Math.max(opportunity.skillsRequired.length, 1)) * 40;
  }

  // Experience level match
  if (user.yearsOfExperience) {
    if (
      opportunity.experienceLevel === "beginner" &&
      user.yearsOfExperience <= 2
    )
      score += 20;
    if (
      opportunity.experienceLevel === "intermediate" &&
      user.yearsOfExperience >= 2 &&
      user.yearsOfExperience <= 5
    )
      score += 20;
    if (opportunity.experienceLevel === "expert" && user.yearsOfExperience > 5)
      score += 20;
  }

  // Budget preference
  if (user.desiredSalaryRange && opportunity.budget) {
    const hourlyEquivalent =
      opportunity.budget.type === "hourly"
        ? opportunity.budget.min
        : opportunity.budget.min / 40; // Assuming 40 hours for fixed projects

    if (hourlyEquivalent >= user.desiredSalaryRange.min / 2000) {
      // Rough monthly to hourly conversion
      score += 25;
    }
  }

  // Remote work bonus for mothers
  if (
    opportunity.isRemote &&
    (user.isPregnant || user.childrenAges?.length > 0)
  ) {
    score += 15;
  }

  return Math.min(score, 100);
}
