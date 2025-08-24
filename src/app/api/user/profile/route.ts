import { dbConnect } from "@/lib/dbConnect";
import UserProfile from "@/models/UserProfile";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path to your NextAuth config
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get user session using getServerSession for App Router
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user profile by email
    const userProfile = await UserProfile.findOne({
      email: session.user.email,
    });

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new user profile
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Check if profile already exists
    const existingProfile = await UserProfile.findOne({
      email: session.user.email,
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      );
    }

    // Create new profile
    const profileData = {
      ...body,
      email: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newProfile = await UserProfile.create(profileData);

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error: any) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      {
        error: "Failed to create profile",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing user profile
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Update profile
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { email: session.user.email },
      {
        ...body,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true, // Create if doesn't exist
        runValidators: true,
      }
    );

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete user profile
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await UserProfile.findOneAndDelete({ email: session.user.email });

    return NextResponse.json(
      { message: "Profile deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
