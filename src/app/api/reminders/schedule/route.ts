// api/reminders/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ReminderService } from "@/lib/services/reminderService";

export async function POST(request: NextRequest) {
  try {
    const { taskId, userId, reminderTime } = await request.json();

    if (!taskId || !userId || !reminderTime) {
      return NextResponse.json(
        { error: "Missing required fields: taskId, userId, reminderTime" },
        { status: 400 }
      );
    }

    await ReminderService.scheduleTaskReminder(
      taskId,
      userId,
      new Date(reminderTime)
    );

    return NextResponse.json({
      success: true,
      message: "Reminder scheduled successfully",
    });
  } catch (error) {
    console.error("Failed to schedule reminder:", error);
    return NextResponse.json(
      { error: "Failed to schedule reminder" },
      { status: 500 }
    );
  }
}
