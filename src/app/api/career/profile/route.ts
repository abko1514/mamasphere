// app/api/career/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/lib/careerService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body._id || new Date().getTime().toString();
    const profileData = { ...body, _id: userId };

    const newProfile = await careerService.updateUserProfile(
      userId,
      profileData
    );

    if (!newProfile) {
      return NextResponse.json(
        { message: "Failed to create profile" },
        { status: 500 }
      );
    }

    // Track profile creation
    await careerService.trackUserActivity(userId, "profile_created");

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add handlers for other methods to return 405
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
