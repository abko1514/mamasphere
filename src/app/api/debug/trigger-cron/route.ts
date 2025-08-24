// 7. Manual trigger endpoint - app/api/debug/trigger-cron/route.ts
import { NextResponse } from "next/server";
import { ReminderService } from "@/lib/services/reminderService";
import { CronBackgroundService } from "@/lib/services/cronBackgroundService";

export async function POST() {
  try {
    // Ensure cron is running
    await CronBackgroundService.ensureCronIsRunning();

    // Manually trigger reminder processing
    await ReminderService.processPendingReminders();

    return NextResponse.json({
      message: "Cron triggered successfully",
      timestamp: new Date().toISOString(),
      cronRunning: CronBackgroundService.isCronRunning(),
    });
  } catch (error) {
    console.error("Manual cron trigger error:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : String(error);

    return NextResponse.json(
      { error: "Failed to trigger cron", details: errorMessage },
      { status: 500 }
    );
  }
}
