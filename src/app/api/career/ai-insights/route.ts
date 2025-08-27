// app/api/career/ai-insights/route.ts
import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/lib/careerService";

export async function POST(request: NextRequest) {
  try {
    const { userId, forceRegenerate = false } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const insights = await careerService.generateAICareerInsights(
      userId,
      forceRegenerate
    );

    if (!insights) {
      return NextResponse.json(
        { message: "Failed to generate insights" },
        { status: 500 }
      );
    }

    // Track insights generation
    await careerService.trackUserActivity(userId, "insights_generated", {
      confidenceScore: insights.confidenceScore,
      forceRegenerate,
    });

    return NextResponse.json(insights, { status: 200 });
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add other HTTP methods if needed, or return 405 for unsupported methods
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
