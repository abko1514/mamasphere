// api/career/profile/[userId]/route.ts
import type { NextApiRequest, NextApiResponse } from "next";

export async function updateCareerProfileHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db(); // Use your DB name if needed: client.db("yourDbName")
    const { userId } = req.query;
    const profileData = req.body;
    const { ObjectId } = await import("mongodb");
    const userObjectId = typeof userId === "string" ? new ObjectId(userId) : undefined;

    const result = await db
      .collection("users")
      .updateOne({ _id: userObjectId }, { $set: profileData }, { upsert: true });

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await db.collection("users").findOne({ _id: userObjectId });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating career profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
