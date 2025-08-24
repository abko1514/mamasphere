// app/api/reminders/process/route.ts
import { NextResponse } from "next/server";
import { ReminderService } from "@/lib/services/reminderService";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Optional: Add API key authentication for security
    const authHeader = request.headers.get("authorization");
    const expectedKey = process.env.CRON_SECRET || "your-secret-key";

    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ReminderService.processPendingReminders();

    return NextResponse.json({
      message: "Reminders processed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing reminders:", error);
    return NextResponse.json(
      {
        error: "Failed to process reminders",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
