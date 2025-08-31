// app/api/career/insights/route.ts - Updated version
import { NextRequest, NextResponse } from "next/server";
import { realTimeCareerService } from "@/lib/services/realTimeCareerService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import { MongoClient } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, forceRegenerate = false } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

     await dbConnect();
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db("mamasphere");
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check for existing insights (unless force regenerate)
    let insights = null;
    if (!forceRegenerate) {
      insights = await db.collection("aiCareerInsights").findOne({
        userId,
        generatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // 7 days cache
      });
    }

    // Generate new insights using Hugging Face if none cached
    if (!insights || forceRegenerate) {
      try {
        const userProfile = {
          ...user,
          _id: user._id.toString(),
          name: user.name || '',
          email: user.email || ''
        };
        insights = await realTimeCareerService.generateAICareerInsights(userProfile);
        insights.userId = userId;
        insights.generatedAt = new Date();

        // Save to database
        await db
          .collection("aiCareerInsights")
          .replaceOne({ userId }, insights, { upsert: true });
      } catch (aiError) {
        console.error(
          "AI insights generation failed, using fallback:",
          aiError
        );
        insights = getFallbackInsights(userId, user);

        // Still save fallback insights
        await db
          .collection("aiCareerInsights")
          .replaceOne({ userId }, insights, { upsert: true });
      }
    }

    // Track activity
    await db.collection("userActivities").insertOne({
      userId,
      action: "insights_generated",
      forceRegenerate,
      aiGenerated: insights.confidenceScore > 50,
      timestamp: new Date(),
    });

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

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

     await dbConnect();
     const client = new MongoClient(process.env.MONGODB_URI!);
     await client.connect();
     const db = client.db("mamasphere");

    // Get latest insights
    const insights = await db
      .collection("aiCareerInsights")
      .findOne({ userId }, { sort: { generatedAt: -1 } });

    if (!insights) {
      return NextResponse.json(
        { message: "No insights found. Generate insights first." },
        { status: 404 }
      );
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fallback insights function
function getFallbackInsights(userId: string, user: any) {
  return {
    _id: `fallback_insight_${Date.now()}`,
    userId: userId,
    insights: {
      strengthsAnalysis: [
        "Your professional background shows commitment to career development",
        "Your experience in " +
          (user.industry || "your field") +
          " provides valuable expertise",
        "Your adaptability and learning mindset are valuable assets",
      ],
      improvementAreas: [
        "Consider expanding your digital skills to stay competitive",
        "Strengthen your professional network through industry connections",
        "Develop leadership skills for future career advancement",
      ],
      careerPathSuggestions: [
        "Explore senior roles that leverage your existing experience",
        "Consider opportunities in emerging areas of " +
          (user.industry || "your industry"),
        "Look into consulting or advisory positions in your expertise area",
      ],
      skillGapAnalysis: [
        "Digital literacy skills for modern workplace efficiency",
        "Data analysis capabilities for evidence-based decision making",
        "Leadership and communication skills for career advancement",
      ],
      marketTrends: [
        "Remote and hybrid work arrangements continue to expand",
        "Skills-based hiring becoming more common than degree requirements",
        "Companies increasingly value diverse perspectives and experiences",
      ],
      salaryInsights: {
        currentMarketRate: `Competitive rates available for ${
          user.yearsOfExperience || 0
        }+ years experience in ${user.industry || "your field"}`,
        growthPotential:
          "Strong potential for salary growth with continued skill development",
        recommendations: [
          "Research current market rates for your role and location",
          "Consider additional certifications to increase your market value",
        ],
      },
      workLifeBalanceRecommendations: [
        "Look for companies with established family-friendly policies",
        "Consider remote or hybrid opportunities for better work-life integration",
        "Prioritize roles with clear boundaries and supportive management",
      ],
      networkingOpportunities: [
        (user.industry || "Professional") +
          " industry associations and meetups",
        "LinkedIn groups related to your field of expertise",
        "Local business networking events and chambers of commerce",
        "Virtual conferences and webinars in your industry",
      ],
      personalizedAdvice: [
        "Focus on opportunities that align with your personal values and goals",
        "Leverage your unique perspective and experience as competitive advantages",
        "Continue investing in your professional development and skill growth",
      ],
      nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    confidenceScore: 65, // Lower score for fallback
    personalizedTips: [],
    generatedAt: new Date(),
    lastUpdated: new Date(),
  };
}
