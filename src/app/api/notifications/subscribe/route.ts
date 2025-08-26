import { NextResponse } from "next/server";
import { ReminderService } from "@/lib/services/reminderService";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { MongoClient } from "mongodb";

interface SubscribeRequest {
  userId: string;
  email: string;
  name?: string;
  dailyDigest?: boolean;
  overdueReminders?: boolean;
  taskReminders?: boolean;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const {
      userId,
      email,
      name,
      dailyDigest = true,
      overdueReminders = true,
      taskReminders = true,
    }: SubscribeRequest = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "userId and email are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db("mamasphere");

    // Create ObjectId from userId string
    let userObjectId: ObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch {
      // If userId is not a valid ObjectId, use it as a string
      userObjectId = new ObjectId();
    }
    console.log("User ObjectId:", userObjectId);
    // Update or create user notification preferences
    await db.collection("users").updateOne(
      { userId: userId },
      {
        $set: {
          email,
          name: name || "Super Mom",
          notifications: {
            dailyDigest,
            overdueReminders,
            taskReminders,
          },
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: userId,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Schedule daily digest if enabled
    if (dailyDigest) {
      await ReminderService.scheduleDailyDigest(userId);
    }

    // Schedule overdue checks if enabled
    if (overdueReminders) {
      await ReminderService.scheduleOverdueCheck(userId);
    }

    return NextResponse.json({
      message: "Notification preferences updated successfully",
      settings: { dailyDigest, overdueReminders, taskReminders },
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      {
        error: "Failed to update preferences",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
