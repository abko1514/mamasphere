// pages/api/career/jobs.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { careerService } from "@/lib/careerService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      userId,
      limit = "20",
      type,
      workArrangement,
      location,
      salaryMin,
      experienceLevel,
    } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "User ID is required" });
    }

    const filters = {
      type: type as string,
      workArrangement: workArrangement as string,
      location: location as string,
      salaryMin: salaryMin ? parseInt(salaryMin as string) : undefined,
      experienceLevel: experienceLevel as string,
    };

    // Remove undefined values
    Object.keys(filters).forEach(
      (key) =>
        filters[key as keyof typeof filters] === undefined &&
        delete filters[key as keyof typeof filters]
    );

    const jobs = await careerService.getJobRecommendations(
      userId,
      Object.keys(filters).length > 0 ? filters : undefined,
      parseInt(limit as string)
    );

    // Track job recommendations viewed
    await careerService.trackUserActivity(userId, "jobs_viewed", {
      jobsCount: jobs.length,
      filters,
    });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
