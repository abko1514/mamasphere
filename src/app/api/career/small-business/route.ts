// /api/career/small-businesses.ts
import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import { SmallBusiness } from "@/models/Career";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getSmallBusinesses(req, res);
    case "POST":
      return createSmallBusiness(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function createSmallBusiness(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db: any = await dbConnect();
    if (db == null) {
      throw new Error("Database connection failed");
    }
    const businessData = req.body;

    // Validate required fields
    if (
      !businessData.businessName ||
      !businessData.ownerName ||
      !businessData.ownerId ||
      !businessData.category
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBusiness: SmallBusiness = {
      _id: new Date().getTime().toString(),
      ...businessData,
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
    };

    await db.collection("smallBusinesses").insertOne(newBusiness);

    res.status(201).json(newBusiness);
  } catch (error) {
    console.error("Error creating small business:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getSmallBusinesses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db: any = await dbConnect();
    if (db == null) {
      throw new Error("Database connection failed");
    }
    const businesses = await db.collection("smallBusinesses").find({}).toArray();
    res.status(200).json(businesses);
  } catch (error) {
    console.error("Error fetching small businesses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

