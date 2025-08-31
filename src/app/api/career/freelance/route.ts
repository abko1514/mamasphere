// app/api/career/freelance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { realTimeCareerService } from "@/lib/services/realTimeCareerService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";

// Define UserProfile type
type UserProfile = {
  name: string;
  email: string;
  // Add other properties as needed, e.g. skills?: string[], location?: string, etc.
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "15");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    if (db==null) {
      throw new Error("Database connection failed");
    }
    // Ensure db is typed correctly (e.g., MongoClient or Db)
    // If dbConnect returns MongoClient, get the database first
    const database = (db as import("mongodb").MongoClient).db();
    const { ObjectId } = require("mongodb");
    const user = await database.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Map MongoDB user document to UserProfile type
    const userProfile: UserProfile & { _id: string } = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      // Add other required UserProfile properties here if needed
      // e.g. skills: user.skills, location: user.location, etc.
    };

    // Get freelance opportunities
    const opportunities = await realTimeCareerService.getFreelanceOpportunities(
      userProfile
    );

    // Track activity
    await database.collection("userActivities").insertOne({
      userId,
      action: "freelance_search",
      resultsCount: opportunities.length,
      timestamp: new Date(),
    });

    return NextResponse.json({
      opportunities: opportunities.slice(0, limit),
      count: opportunities.length,
    });
  } catch (error) {
    console.error("Error fetching freelance opportunities:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
