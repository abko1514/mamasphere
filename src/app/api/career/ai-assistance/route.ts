// pages/api/career/ai-insights.ts
import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import { AICareerInsight, UserProfile } from "@/models/Career";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db: any = await dbConnect();
    if (!db) {
      return res.status(500).json({ message: "Database connection failed" });
    }
    const { userId } = req.body;

    // Fetch user profile
    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate AI insights based on user profile
    const insights = await generateAIInsights(user);

    // Save insights to database
    const aiInsight: AICareerInsight = {
      _id: new Date().getTime().toString(),
      userId,
      insights,
      personalizedTips: await generatePersonalizedTips(user, insights),
      generatedAt: new Date(),
      nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };

    await db.collection("aiCareerInsights").insertOne(aiInsight);

    res.status(200).json(aiInsight);
  } catch (error) {
    console.error("Error generating AI insights:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function generateAIInsights(user: UserProfile) {
  // This would integrate with an AI service like OpenAI, but for now we'll use rule-based logic
  const insights: {
    strengthsAnalysis: string[];
    improvementAreas: string[];
    careerPathSuggestions: string[];
    skillGapAnalysis: string[];
    marketTrends: string[];
  } = {
    strengthsAnalysis: [],
    improvementAreas: [],
    careerPathSuggestions: [],
    skillGapAnalysis: [],
    marketTrends: [],
  };

  // Strengths analysis based on profile
  if (Array.isArray(user.skillsAndExperience) && user.skillsAndExperience.length > 5) {
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
  const currentYear = new Date().getFullYear();
  const trendingSkills = [
    "AI/ML",
    "Data Analysis",
    "Digital Marketing",
    "Project Management",
    "UX/UI Design",
  ];

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

async function generatePersonalizedTips(user: UserProfile, insights: any) {
  const tips = [];

  if (user.availabilityStatus === "maternity_leave") {
    tips.push({
      _id: `tip_${Date.now()}_1`,
      title: "Staying Connected During Maternity Leave",
      content:
        "Maintain professional relationships by occasionally checking in with colleagues and staying updated on industry news. Consider scheduling monthly coffee chats or video calls with key contacts.",
      category: "maternity_leave" as "maternity_leave",
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
      category: "returning_to_work" as "returning_to_work",
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

// pages/api/career/tips.ts
export async function getTipsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db: any = await dbConnect();
    const { userId } = req.query;

    // Get user profile to personalize tips
    if (db == null) {
      return res.status(500).json({ message: "Database connection failed" });
    }
    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch personalized tips from AI insights
    const aiInsights = await db
      .collection("aiCareerInsights")
      .findOne({ userId }, { sort: { generatedAt: -1 } });

    let tips = [];
    if (aiInsights) {
      tips = aiInsights.personalizedTips;
    }

    // Also fetch general tips that match user's profile
    const generalTips = await db
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

    tips = [...tips, ...generalTips];

    res.status(200).json(tips);
  } catch (error) {
    console.error("Error fetching tips:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
