import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { jobId, userId } = body;

    if (!jobId || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    const application = {
      _id: new ObjectId(),
      jobId,
      userId,
      appliedAt: new Date(),
      status: "applied",
    };

    await db.collection("jobApplications").insertOne(application);
    await client.close();

    return NextResponse.json(
      { message: "Application saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving application:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add other HTTP methods if needed
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
