//api/career/profile/[userId].ts;
import type { NextApiRequest, NextApiResponse } from "next";
import { careerService } from "@/lib/careerService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    switch (req.method) {
      case "GET":
        const profile = await careerService.getUserProfile(userId);
        if (!profile) {
          return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(200).json(profile);

      case "PUT":
        const updatedProfile = await careerService.updateUserProfile(
          userId,
          req.body
        );
        if (!updatedProfile) {
          return res.status(500).json({ message: "Failed to update profile" });
        }

        // Track profile update activity
        await careerService.trackUserActivity(userId, "profile_updated", {
          fieldsUpdated: Object.keys(req.body),
        });

        return res.status(200).json(updatedProfile);

      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in user profile handler:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}