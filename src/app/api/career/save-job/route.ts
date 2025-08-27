// app/api/career/save-job/route.ts
import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/lib/careerService";

export async function POST(request: NextRequest) {
  try {
    const { userId, jobId, applicationData } = await request.json();

    if (!userId || !jobId) {
      return NextResponse.json(
        { message: "User ID and Job ID are required" },
        { status: 400 }
      );
    }

    await careerService.saveJobApplication(
      jobId,
      userId
    );

    // Track job application
    await careerService.trackUserActivity(userId, "job_application", {
      jobId,
      hasApplicationData: !!applicationData,
    });

    return NextResponse.json(
      { message: "Job application saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving job application:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add other methods if needed, or return 405 for non-POST requests
export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}
