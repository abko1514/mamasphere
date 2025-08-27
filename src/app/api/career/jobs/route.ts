// app/api/career/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/lib/careerService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit") || "20";
    const type = searchParams.get("type");
    const workArrangement = searchParams.get("workArrangement");
    const location = searchParams.get("location");
    const salaryMin = searchParams.get("salaryMin");
    const experienceLevel = searchParams.get("experienceLevel");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const filters = {
      type: type as string,
      workArrangement: workArrangement as string,
      location: location as string,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      experienceLevel: experienceLevel as string,
    };

    // Remove undefined values
    Object.keys(filters).forEach(
      (key) =>
        filters[key as keyof typeof filters] === undefined &&
        delete filters[key as keyof typeof filters]
    );

    const jobs = await careerService.getJobRecommendations(
      userId,
      Object.keys(filters).length > 0 ? filters : undefined,
      parseInt(limit)
    );

    // Track job recommendations viewed
    await careerService.trackUserActivity(userId, "jobs_viewed", {
      jobsCount: jobs.length,
      filters,
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add other HTTP methods if needed
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
