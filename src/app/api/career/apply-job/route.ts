// pages/api/career/apply-job.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { careerService } from "@/lib/careerService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, jobId, applicationData } = req.body;

    if (!userId || !jobId || !applicationData) {
      return res.status(400).json({
        message: "User ID, Job ID, and application data are required",
      });
    }

    const success = await careerService.applyToJob(
      userId,
      jobId,
      applicationData
    );

    if (!success) {
      return res
        .status(500)
        .json({ message: "Failed to submit job application" });
    }

    // Track job application
    await careerService.trackUserActivity(userId, "job_applied", {
      jobId,
      applicationSubmitted: true,
    });

    return res
      .status(201)
      .json({ message: "Job application submitted successfully" });
  } catch (error) {
    console.error("Error applying to job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
