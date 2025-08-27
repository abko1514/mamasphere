// app/api/career/ai-assistance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Collection } from "mongodb";
import { ObjectId } from "mongodb";

interface DatabaseConnection {
  collection: (name: string) => Collection;
}

interface UserProfile {
  _id?: ObjectId | string;
  skillsAndExperience?: string[];
  yearsOfExperience?: number;
  educationLevel?: string;
  availabilityStatus?: string;
  industry?: string;
  [key: string]: string | number | boolean | undefined | string[] | Date | ObjectId;
}

interface AICareerInsight {
  _id?: ObjectId | string;
  userId: ObjectId | string;
  insights: {
    strengthsAnalysis: string[];
    improvementAreas: string[];
    careerPathSuggestions: string[];
    skillGapAnalysis: string[];
    marketTrends: string[];
    salaryInsights: {
      currentMarketRate: string;
      growthPotential: string;
      recommendations: string[];
    };
    workLifeBalanceRecommendations: string[];
    networkingOpportunities: string[];
    personalizedAdvice: string[];
    nextUpdateDue: Date;
    personalizedTips: PersonalizedTip[];
  };
  generatedAt: Date;
  nextUpdateDue: Date;
}

interface AIInsights {
  strengthsAnalysis: string[];
  improvementAreas: string[];
  careerPathSuggestions: string[];
  skillGapAnalysis: string[];
  marketTrends: string[];
  salaryInsights: {
    currentMarketRate: string;
    growthPotential: string;
    recommendations: string[];
  };
  workLifeBalanceRecommendations: string[];
  networkingOpportunities: string[];
  personalizedAdvice: string[];
}

interface PersonalizedTip {
  _id: string;
  title: string;
  content: string;
  category:
    | "maternity_leave"
    | "returning_to_work"
    | "career_growth"
    | "work_life_balance"
    | "networking"
    | "skills_development";
  targetAudience: string[];
  isPersonalized: boolean;
  createdAt: Date;
  tags: string[];
  aiGenerated: boolean;
  relevanceScore: number;
}

interface CareerTipDocument {
  _id?: ObjectId | string;
  title?: string;
  content?: string;
  category?: PersonalizedTip["category"];
  targetAudience?: string[];
  isPersonalized?: boolean;
  createdAt?: Date | string;
  tags?: string[];
  aiGenerated?: boolean;
  relevanceScore?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const db = (await dbConnect()) as unknown as DatabaseConnection;
    if (!db) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const userObjectId =
      typeof userId === "string" ? new ObjectId(userId) : userId;
    const user = (await db
      .collection("users")
      .findOne({ _id: userObjectId })) as UserProfile | null;

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const insights = await generateAIInsights(user);

    const aiInsight = {
      _id: new ObjectId(),
      userId,
      insights: {
        ...insights,
        nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        personalizedTips: await generatePersonalizedTips(user),
      },
      generatedAt: new Date(),
      nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    await db.collection("aiCareerInsights").insertOne(aiInsight);

    return NextResponse.json(aiInsight);
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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const db = (await dbConnect()) as unknown as DatabaseConnection;
    if (!db) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const userObjectId =
      typeof userId === "string" ? new ObjectId(userId) : userId;
    const user = (await db
      .collection("users")
      .findOne({ _id: userObjectId })) as UserProfile | null;

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const aiInsights = (await db
      .collection("aiCareerInsights")
      .findOne(
        { userId },
        { sort: { generatedAt: -1 } }
      )) as AICareerInsight | null;

    let tips: PersonalizedTip[] = [];
    if (
      aiInsights &&
      aiInsights.insights &&
      Array.isArray(aiInsights.insights.personalizedTips)
    ) {
      tips = (aiInsights.insights.personalizedTips as PersonalizedTip[]).map(
        (tip) => ({
          ...tip,
          relevanceScore:
            typeof tip.relevanceScore === "number" ? tip.relevanceScore : 0,
        })
      );
    }

    const generalTipsRaw = await db
      .collection("careerTips")
      .find({
        $or: [
          { targetAudience: { $in: [user.availabilityStatus, user.industry] } },
          { targetAudience: "all" },
        ],
      })
      .sort({ relevanceScore: -1 })
      .limit(5)
      .toArray();

    const generalTips: PersonalizedTip[] = (
      generalTipsRaw as CareerTipDocument[]
    ).map((tip) => ({
      _id: tip._id ? tip._id.toString() : "",
      title: tip.title ?? "",
      content: tip.content ?? "",
      category: tip.category ?? "career_growth",
      targetAudience: Array.isArray(tip.targetAudience)
        ? tip.targetAudience
        : [],
      isPersonalized: tip.isPersonalized ?? false,
      createdAt: tip.createdAt ? new Date(tip.createdAt) : new Date(),
      tags: Array.isArray(tip.tags) ? tip.tags : [],
      aiGenerated: tip.aiGenerated ?? false,
      relevanceScore:
        typeof tip.relevanceScore === "number" ? tip.relevanceScore : 0,
    }));

    const allTips = [...tips, ...generalTips];

    return NextResponse.json(allTips);
  } catch (error) {
    console.error("Error fetching tips:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateAIInsights(user: UserProfile): Promise<AIInsights> {
  const insights: AIInsights = {
    strengthsAnalysis: [],
    improvementAreas: [],
    careerPathSuggestions: [],
    skillGapAnalysis: [],
    marketTrends: [],
    salaryInsights: {
      currentMarketRate: "",
      growthPotential: "",
      recommendations: [],
    },
    workLifeBalanceRecommendations: [],
    networkingOpportunities: [],
    personalizedAdvice: [],
  };

  // Strengths analysis based on profile
  if (
    Array.isArray(user.skillsAndExperience) &&
    user.skillsAndExperience.length > 5
  ) {
    insights.strengthsAnalysis.push(
      "Diverse skill set with broad experience across multiple domains"
    );
  }
  if (user.yearsOfExperience && user.yearsOfExperience > 5) {
    insights.strengthsAnalysis.push(
      "Extensive professional experience providing strong foundation"
    );
  }
  if (user.educationLevel === "Masters" || user.educationLevel === "PhD") {
    insights.strengthsAnalysis.push(
      "Advanced education demonstrating commitment to learning and expertise"
    );
  }

  // Career path suggestions based on current situation
  if (user.availabilityStatus === "maternity_leave") {
    insights.careerPathSuggestions.push(
      "Consider remote-first opportunities that offer flexibility during transition back to work"
    );
    insights.careerPathSuggestions.push(
      "Explore consulting or freelance work to maintain skills while managing new schedule"
    );
  }
  if (user.availabilityStatus === "returning_to_work") {
    insights.careerPathSuggestions.push(
      "Look for companies with strong parental leave policies and flexible work arrangements"
    );
    insights.careerPathSuggestions.push(
      "Consider part-time or contract roles initially to ease back into professional routine"
    );
  }

  // Skill gap analysis
  insights.skillGapAnalysis.push(
    "Consider upskilling in emerging technologies relevant to your industry"
  );
  if (user.industry === "Technology") {
    insights.skillGapAnalysis.push(
      "Cloud computing and cybersecurity skills are increasingly in demand"
    );
  }

  // Market trends
  insights.marketTrends.push(
    "Remote work continues to be a significant trend, offering opportunities for working mothers"
  );
  insights.marketTrends.push(
    "Companies are increasingly prioritizing diversity and inclusion, creating more opportunities"
  );
  insights.marketTrends.push(
    "Gig economy and freelance opportunities are expanding across all industries"
  );

  return insights;
}

async function generatePersonalizedTips(
  user: UserProfile
): Promise<PersonalizedTip[]> {
  const tips: PersonalizedTip[] = [];

  if (user.availabilityStatus === "maternity_leave") {
    tips.push({
      _id: `tip_${Date.now()}_1`,
      title: "Staying Connected During Maternity Leave",
      content:
        "Maintain professional relationships by occasionally checking in with colleagues and staying updated on industry news. Consider scheduling monthly coffee chats or video calls with key contacts.",
      category: "maternity_leave",
      targetAudience: ["new_mothers", "maternity_leave"],
      isPersonalized: true,
      createdAt: new Date(),
      tags: ["networking"],
      aiGenerated: true,
      relevanceScore: 0.9,
    });
  }

  if (user.availabilityStatus === "returning_to_work") {
    tips.push({
      _id: `tip_${Date.now()}_2`,
      title: "Successful Return-to-Work Strategy",
      content:
        "Start with a gradual return if possible. Consider negotiating flexible hours or remote work arrangements. Communicate openly with your manager about your needs and expectations.",
      category: "returning_to_work",
      targetAudience: ["returning_mothers"],
      isPersonalized: true,
      createdAt: new Date(),
      tags: ["work_life_balance"],
      aiGenerated: true,
      relevanceScore: 0.95,
    });
  }

  return tips;
}
