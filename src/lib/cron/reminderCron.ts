// 5. Enhanced lib/cron/reminderCron.ts - More frequent checks
import { ReminderService } from "../services/reminderService";

export class ReminderCron {
  private static interval: NodeJS.Timeout | null = null;
  private static isRunning = false;

  static start(): void {
    if (this.interval) {
      console.log("⏳ Reminder cron already running");
      return;
    }

    console.log("🚀 Starting reminder cron job...");
    this.isRunning = true;

    // Check for pending reminders every 30 seconds for better responsiveness
    this.interval = setInterval(async () => {
      try {
        const startTime = new Date();
        await ReminderService.processPendingReminders();
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        console.log(`⚡ Reminder check completed in ${duration}ms`);
      } catch (error) {
        console.error("❌ Reminder cron error:", error);
      }
    }, 30000); // Every 30 seconds

    // Also run immediately on startup
    ReminderService.processPendingReminders()
      .then(() => console.log("✅ Initial reminder check completed"))
      .catch((error) =>
        console.error("❌ Initial reminder check failed:", error)
      );
  }

  static stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isRunning = false;
      console.log("⏹️ Reminder cron stopped");
    }
  }

  static isActive(): boolean {
    return this.isRunning;
  }
}
