//api/career/ai-insights.ts;
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
    const { userId, forceRegenerate = false } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const insights = await careerService.generateAIInsights(
      userId,
      forceRegenerate
    );
    if (!insights) {
      return res.status(500).json({ message: "Failed to generate insights" });
    }

    // Track insights generation
    await careerService.trackUserActivity(userId, "insights_generated", {
      confidenceScore: insights.confidenceScore,
      forceRegenerate,
    });

    return res.status(200).json(insights);
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
