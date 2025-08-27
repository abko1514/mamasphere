// app/api/small-businesses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    const db = client.db();
    const businesses = await db
      .collection("smallBusinesses")
      .find({})
      .toArray();

    await client.close();
    return NextResponse.json(businesses, { status: 200 });
  } catch (error) {
    console.error("Error fetching small businesses:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    const db = client.db();

    const businessData = await request.json();

    // Validate required fields
    if (
      !businessData.businessName ||
      !businessData.ownerName ||
      !businessData.ownerId ||
      !businessData.category
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const { ObjectId } = await import("mongodb");
    const newBusiness = {
      _id: new ObjectId(),
      ...businessData,
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
    };

    await db.collection("smallBusinesses").insertOne(newBusiness);
    await client.close();

    return NextResponse.json(newBusiness, { status: 201 });
  } catch (error) {
    console.error("Error creating small business:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add handlers for other methods to return 405
export async function PUT() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "GET, POST" } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "GET, POST" } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "GET, POST" } }
  );
}
