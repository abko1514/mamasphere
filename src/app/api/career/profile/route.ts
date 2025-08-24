//api/career/profile/index.ts;
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
    const userId = req.body._id || new Date().getTime().toString();
    const profileData = { ...req.body, _id: userId };

    const newProfile = await careerService.updateUserProfile(
      userId,
      profileData
    );
    if (!newProfile) {
      return res.status(500).json({ message: "Failed to create profile" });
    }

    // Track profile creation
    await careerService.trackUserActivity(userId, "profile_created");

    return res.status(201).json(newProfile);
  } catch (error) {
    console.error("Error creating user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
