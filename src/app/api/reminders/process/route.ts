// 8. app/api/notifications/subscribe/route.ts - API endpoint for email subscription
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";
import { ReminderService } from "@/lib/services/reminderService";

interface NotificationPreferences {
  email: string;
  name?: string;
  dailyDigest?: boolean;
  overdueReminders?: boolean;
  taskReminders?: boolean;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const preferences: NotificationPreferences = await request.json();

    if (!preferences.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Update user's email preferences
    const Users = mongoose.models.Users;
    if (!Users) {
      return NextResponse.json(
        { error: "User model not found" },
        { status: 500 }
      );
    }

    await Users.findOneAndUpdate(
      { email: session.user.email },
      {
        email: preferences.email,
        name: preferences.name || session.user.name,
        notifications: {
          taskReminders: preferences.taskReminders ?? true,
          overdueReminders: preferences.overdueReminders ?? true,
          dailyDigest: preferences.dailyDigest ?? true,
        },
      },
      { upsert: true }
    );

    // Schedule initial daily digest and overdue check
    if (preferences.dailyDigest) {
      await ReminderService.scheduleDailyDigest(session.user.email);
    }

    if (preferences.overdueReminders) {
      await ReminderService.scheduleOverdueCheck(session.user.email);
    }

    console.log("📧 Email notifications setup for user:", session.user.email);

    return NextResponse.json({
      message: "Email notifications setup successfully",
      preferences: {
        email: preferences.email,
        taskReminders: preferences.taskReminders ?? true,
        overdueReminders: preferences.overdueReminders ?? true,
        dailyDigest: preferences.dailyDigest ?? true,
      },
    });
  } catch (error) {
    console.error("Error setting up email notifications:", error);
    return NextResponse.json(
      {
        error: "Failed to setup email notifications",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
