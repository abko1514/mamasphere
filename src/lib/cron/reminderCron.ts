// 2. lib/cron/reminderCron.ts - Enhanced with better error handling and logging
// import { ReminderService } from '../services/reminderService';

export class ReminderCron {
  private static interval: NodeJS.Timeout | null = null;
  private static isRunning = false;
  private static readonly CHECK_INTERVAL = 30000; // 30 seconds

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
        // await ReminderService.processPendingReminders();
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        console.log(
          `⚡ Reminder check completed in ${duration}ms at ${endTime.toLocaleString()}`
        );
      } catch (error) {
        console.error("❌ Reminder cron error:", error);
      }
    }, this.CHECK_INTERVAL);

    // Also run immediately on startup
    // ReminderService.processPendingReminders()
    //   .then(() => console.log("✅ Initial reminder check completed"))
    //   .catch((error) =>
    //     console.error("❌ Initial reminder check failed:", error)
    //   );

    // Handle process termination
    process.on("SIGTERM", () => {
      console.log("📨 SIGTERM received, stopping reminder cron...");
      this.stop();
    });

    process.on("SIGINT", () => {
      console.log("📨 SIGINT received, stopping reminder cron...");
      this.stop();
    });
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

  static getStatus(): { isRunning: boolean; checkInterval: number } {
    return {
      isRunning: this.isRunning,
      checkInterval: this.CHECK_INTERVAL,
    };
  }
}
