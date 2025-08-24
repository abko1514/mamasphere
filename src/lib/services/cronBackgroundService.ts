// 4. Fixed lib/services/cronBackgroundService.ts - Better initialization
import { ReminderCron } from "@/lib/cron/reminderCron";

let cronInitialized = false;

export class CronBackgroundService {
  static async ensureCronIsRunning(): Promise<void> {
    if (!cronInitialized && typeof window === "undefined") {
      try {
        console.log("🚀 Starting background cron service...");
        ReminderCron.start();
        cronInitialized = true;
        console.log("✅ Background cron service started successfully");
      } catch (error) {
        console.error("❌ Failed to start background cron service:", error);
        throw error;
      }
    }
  }

  static async stopCron(): Promise<void> {
    if (cronInitialized) {
      ReminderCron.stop();
      cronInitialized = false;
      console.log("⏹️ Background cron service stopped");
    }
  }

  static isCronRunning(): boolean {
    return cronInitialized;
  }

  // Force restart cron (useful for debugging)
  static async restartCron(): Promise<void> {
    await this.stopCron();
    await this.ensureCronIsRunning();
  }
}
