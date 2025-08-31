// app/api/career/tips/route.ts - Updated version
import { NextRequest, NextResponse } from "next/server";
import { realTimeCareerService } from "@/lib/services/realTimeCareerService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const forceRegenerate = searchParams.get("forceRegenerate") === "true";
    const cached = searchParams.get("cached") === "true";

    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let tips = [];

    // Return cached tips if requested
    if (cached && !forceRegenerate) {
      const cachedTips = await db.collection("cachedTips").findOne({
        userId,
        createdAt: { $gte: new Date(Date.now() - 4 * 60 * 60 * 1000) }, // 4 hours cache
      });

      if (cachedTips?.tips) {
        return NextResponse.json({ tips: cachedTips.tips.slice(0, limit) });
      }
      return NextResponse.json({ tips: [] });
    }

    // Check for existing tips in cache
    if (!forceRegenerate) {
      const cachedTips = await db.collection("cachedTips").findOne({
        userId,
        createdAt: { $gte: new Date(Date.now() - 4 * 60 * 60 * 1000) }, // 4 hours cache
      });

      if (cachedTips?.tips) {
        tips = cachedTips.tips;
      }
    }

    // Generate new tips using Hugging Face AI if none cached
    if (tips.length === 0 || forceRegenerate) {
      try {
        tips = await realTimeCareerService.generatePersonalizedTips(user);
      } catch (aiError) {
        console.error("AI tips generation failed, using fallback:", aiError);
        tips = await getFallbackTips(user);
      }

      // Cache the tips
      await db
        .collection("cachedTips")
        .replaceOne(
          { userId },
          { userId, tips, createdAt: new Date() },
          { upsert: true }
        );
    }

    // Track activity
    await db.collection("userActivities").insertOne({
      userId,
      action: "tips_viewed",
      count: tips.length,
      aiGenerated: tips.some((tip: any) => tip.aiGenerated),
      timestamp: new Date(),
    });

    return NextResponse.json({ tips: tips.slice(0, limit) });
  } catch (error) {
    console.error("Error fetching career tips:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST method for caching tips
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, tips } = await request.json();

    if (!userId || !tips) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await dbConnect();

    // Cache the tips
    await db
      .collection("cachedTips")
      .replaceOne(
        { userId },
        { userId, tips, createdAt: new Date() },
        { upsert: true }
      );

    return NextResponse.json({ message: "Tips cached successfully" });
  } catch (error) {
    console.error("Error caching tips:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fallback tips function
async function getFallbackTips(user: any) {
  return [
    {
      _id: `fallback_tip_1_${Date.now()}`,
      title: "Optimize Your Professional Profile",
      content:
        "Update your LinkedIn profile with recent achievements, skills, and a professional photo. This increases your visibility to recruiters by up to 40%.",
      category: "career-growth",
      difficulty: "beginner",
      timeToImplement: "30 minutes",
      tags: ["linkedin", "profile", "visibility"],
      isPersonalized: true,
      relevanceScore: 85,
      createdAt: new Date(),
      updatedAt: new Date(),
      targetAudience: "professionals",
      aiGenerated: false,
    },
    {
      _id: `fallback_tip_2_${Date.now()}`,
      title: "Network Within Your Current Circle",
      content:
        "Start networking conversations with people you already know - former colleagues, classmates, and industry contacts. They're more likely to help and provide honest career advice.",
      category: "networking",
      difficulty: "beginner",
      timeToImplement: "15 minutes per contact",
      tags: ["networking", "relationships", "career-advice"],
      isPersonalized: true,
      relevanceScore: 88,
      createdAt: new Date(),
      updatedAt: new Date(),
      targetAudience: "professionals",
      aiGenerated: false,
    },
    {
      _id: `fallback_tip_3_${Date.now()}`,
      title: "Develop In-Demand Skills",
      content: `Based on your ${
        user.industry || "field"
      }, focus on developing skills that are currently in high demand. Consider taking online courses or certifications to stay competitive.`,
      category: "skills",
      difficulty: "intermediate",
      timeToImplement: "2-4 hours per week",
      tags: ["skills", "education", "competitiveness"],
      isPersonalized: true,
      relevanceScore: 90,
      createdAt: new Date(),
      updatedAt: new Date(),
      targetAudience: "professionals",
      aiGenerated: false,
    },
  ];
}
