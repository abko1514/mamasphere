// src/app/api/career/analytics/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/lib/careerService";

// GET - Fetch user analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const analytics = await careerService.getUserAnalytics(userId);
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Method not allowed
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

// PUT - Method not allowed
export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

// DELETE - Method not allowed
export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

// PATCH - Method not allowed
export async function PATCH() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

// HEAD - Method not allowed
export async function HEAD() {
  return new NextResponse(null, { status: 405 });
}

// OPTIONS - Method not allowed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 405,
    headers: {
      Allow: "GET",
    },
  });
}
