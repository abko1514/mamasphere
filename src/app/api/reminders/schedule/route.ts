// 7. app/api/reminders/schedule/route.ts - API endpoint for scheduling reminders
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ReminderService } from "@/lib/services/reminderService";

interface ScheduleReminderRequest {
  taskId: string;
  reminderTime: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, reminderTime }: ScheduleReminderRequest =
      await request.json();

    if (!taskId || !reminderTime) {
      return NextResponse.json(
        { error: "taskId and reminderTime are required" },
        { status: 400 }
      );
    }

    await ReminderService.scheduleTaskReminder(
      taskId,
      session.user.email,
      new Date(reminderTime)
    );

    return NextResponse.json({
      message: "Reminder scheduled successfully",
      taskId,
      reminderTime,
    });
  } catch (error) {
    console.error("Error scheduling reminder:", error);
    return NextResponse.json(
      {
        error: "Failed to schedule reminder",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
