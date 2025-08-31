// app/api/career/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import { MongoClient } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    // const db = await dbConnect();
    await dbConnect();
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db("mamasphere");

    // Aggregate user analytics
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const activities = await db
      .collection("userActivities")
      .find({
        userId,
        timestamp: { $gte: thirtyDaysAgo },
      })
      .sort({ timestamp: -1 })
      .toArray();

    const analytics = {
      userId,
      profileCompleteness: await calculateProfileCompleteness(userId, db),
      jobApplications: await getJobApplicationStats(userId, db),
      engagement: {
        totalActivities: activities.length,
        uniqueDays: new Set(activities.map((a) => a.timestamp.toDateString()))
          .size,
        lastActive: activities[0]?.timestamp || new Date(),
      },
      topActivities: aggregateActivities(activities),
      timeline: activities.slice(0, 10), // Last 10 activities
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function calculateProfileCompleteness(
  userId: string,
  db: any
): Promise<number> {
  const user = await db.collection("users").findOne({ _id: userId });
  if (!user) return 0;

  const fields = [
    "name",
    "email",
    "currentRole",
    "industry",
    "yearsOfExperience",
    "skillsAndExperience",
    "workPreference",
    "location",
    "bio",
  ];

  const completedFields = fields.filter((field) => {
    const value = user[field];
    return (
      value &&
      (Array.isArray(value)
        ? value.length > 0
        : value.toString().trim().length > 0)
    );
  });

  return Math.round((completedFields.length / fields.length) * 100);
}

async function getJobApplicationStats(userId: string, db: any) {
  const applications = await db
    .collection("jobApplications")
    .find({ userId })
    .toArray();

interface JobApplication {
    _id: string;
    userId: string;
    status: "applied" | "interview" | "offer" | "rejected";
    [key: string]: any;
}

interface JobApplicationStats {
    total: number;
    pending: number;
    interviews: number;
    offers: number;
    rejected: number;
}

const typedApplications = applications as JobApplication[];

const stats: JobApplicationStats = {
    total: typedApplications.length,
    pending: typedApplications.filter((app) => app.status === "applied").length,
    interviews: typedApplications.filter((app) => app.status === "interview").length,
    offers: typedApplications.filter((app) => app.status === "offer").length,
    rejected: typedApplications.filter((app) => app.status === "rejected").length,
};

return stats;
}

function aggregateActivities(activities: any[]) {
  const activityCounts: Record<string, number> = {};

  activities.forEach((activity) => {
    activityCounts[activity.action] =
      (activityCounts[activity.action] || 0) + 1;
  });

  return Object.entries(activityCounts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count);
}
