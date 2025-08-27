// app/api/career/tips/route.ts
import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/lib/careerService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit") || "20";

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const tips = await careerService.getPersonalizedTips(
      userId,
      parseInt(limit)
    );

    // Track tips viewed
    await careerService.trackUserActivity(userId, "tips_viewed", {
      tipsCount: tips.length,
    });

    return NextResponse.json(tips, { status: 200 });
  } catch (error) {
    console.error("Error fetching career tips:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add handlers for other methods to return 405
export async function POST() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } }
  );
}
