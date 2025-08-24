// 9. app/api/cron/start/route.ts - Manual cron start endpoint (for development/production)
import { NextResponse } from "next/server";
import { ReminderCron } from "@/lib/cron/reminderCron";

export async function POST(): Promise<Response> {
  try {
    console.log("🚀 Starting reminder cron via API...");

    ReminderCron.start();

    const status = ReminderCron.getStatus();

    return NextResponse.json({
      message: "Reminder cron started successfully",
      status,
    });
  } catch (error) {
    console.error("Error starting reminder cron:", error);
    return NextResponse.json(
      {
        error: "Failed to start reminder cron",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  try {
    const status = ReminderCron.getStatus();

    return NextResponse.json({
      message: "Reminder cron status",
      status,
    });
  } catch (error) {
    console.error("Error getting cron status:", error);
    return NextResponse.json(
      {
        error: "Failed to get cron status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
