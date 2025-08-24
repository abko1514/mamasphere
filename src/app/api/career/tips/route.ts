//api/career/tips/route.ts;
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
    const { userId, limit = "20" } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "User ID is required" });
    }

    const tips = await careerService.getPersonalizedTips(
      userId,
      parseInt(limit as string)
    );

    // Track tips viewed
    await careerService.trackUserActivity(userId, "tips_viewed", {
      tipsCount: tips.length,
    });

    return res.status(200).json(tips);
  } catch (error) {
    console.error("Error fetching career tips:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
