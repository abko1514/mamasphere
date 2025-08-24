// ===== 1. Fix api/cron/initialize/route.ts =====
import { NextResponse } from "next/server";
import { CronBackgroundService } from "@/lib/services/cronBackgroundService";

export async function POST() {
  try {
    // Only allow cron initialization on the server
    if (typeof window !== "undefined") {
      return NextResponse.json(
        { error: "Cron jobs can only be initialized on the server" },
        { status: 400 }
      );
    }

    await CronBackgroundService.ensureCronIsRunning();

    return NextResponse.json({
      success: true,
      message: "Cron jobs initialized successfully",
      status: CronBackgroundService.isCronRunning(),
    });
  } catch (error) {
    console.error("Failed to initialize cron jobs:", error);
    return NextResponse.json(
      {
        error: "Failed to initialize cron jobs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
