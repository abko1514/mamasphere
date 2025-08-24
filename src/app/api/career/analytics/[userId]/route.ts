// pages/api/career/analytics/[userId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { careerService } from "@/lib/careerService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const analytics = await careerService.getUserAnalytics(userId);
    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
