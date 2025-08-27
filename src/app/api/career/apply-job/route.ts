import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/lib/careerService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, jobId, applicationData } = body;

    if (!userId || !jobId || !applicationData) {
      return NextResponse.json(
        { message: "User ID, Job ID, and application data are required" },
        { status: 400 }
      );
    }

    const success = await careerService.applyToJob(
      userId,
      jobId,
      applicationData
    );

    if (!success) {
      return NextResponse.json(
        { message: "Failed to submit job application" },
        { status: 500 }
      );
    }

    // Track job application
    await careerService.trackUserActivity(userId, "job_applied", {
      jobId,
      applicationSubmitted: true,
    });

    return NextResponse.json(
      { message: "Job application submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error applying to job:", error);
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
