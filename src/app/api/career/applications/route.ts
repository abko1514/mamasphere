import { dbConnect } from '@/lib/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function saveApplicationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const { jobId, userId } = req.body;

    if (!jobId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { ObjectId } = await import('mongodb');
    const application = {
      _id: new ObjectId(),
      jobId,
      userId,
      appliedAt: new Date(),
      status: "applied",
    };

    await db.collection("jobApplications").insertOne(application);

    res.status(201).json({ message: "Application saved successfully" });
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
