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

    // Validate date format
    const reminderDate = new Date(reminderTime);
    if (isNaN(reminderDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid reminderTime format" },
        { status: 400 }
      );
    }

    await ReminderService.scheduleTaskReminder(
      taskId,
      session.user.email,
      reminderDate
    );

    return NextResponse.json({
      message: "Reminder scheduled successfully",
      taskId,
      reminderTime: reminderDate.toISOString(),
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

export async function GET(): Promise<Response> {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Reminder scheduling endpoint is active",
    });
  } catch (error) {
    console.error("Error in reminder schedule endpoint:", error);
    return NextResponse.json(
      {
        error: "Server error",
      },
      { status: 500 }
    );
  }
}
