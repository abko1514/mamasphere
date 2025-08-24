// pages/api/career/save-job.ts
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

    if (!userId || !jobId) {
      return res
        .status(400)
        .json({ message: "User ID and Job ID are required" });
    }

    const success = await careerService.saveJobApplication(
      userId,
      jobId,
      applicationData
    );

    if (!success) {
      return res
        .status(500)
        .json({ message: "Failed to save job application" });
    }

    // Track job application
    await careerService.trackUserActivity(userId, "job_application", {
      jobId,
      hasApplicationData: !!applicationData,
    });

    return res
      .status(201)
      .json({ message: "Job application saved successfully" });
  } catch (error) {
    console.error("Error saving job application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
