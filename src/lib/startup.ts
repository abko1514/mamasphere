// 10. lib/startup.ts - Initialize cron on application startup
import { ReminderCron } from "./cron/reminderCron";

export function initializeApp(): void {
  console.log("🚀 Initializing application...");

  // Start reminder cron job
  try {
    ReminderCron.start();
    console.log("✅ Reminder cron initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize reminder cron:", error);
  }

  console.log("✅ Application initialization complete");
}

// Call this in your main application entry point
if (typeof window === "undefined") {
  // Only run on server-side
  initializeApp();
}
