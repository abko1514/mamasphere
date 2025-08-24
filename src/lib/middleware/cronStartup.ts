// lib/middleware/cronStartup.ts
import { ReminderCron } from "@/lib/cron/reminderCron";

let cronStarted = false;

export function initializeCron(): void {
  if (!cronStarted && process.env.NODE_ENV === "production") {
    ReminderCron.start();
    cronStarted = true;
    console.log("Background reminder cron initialized");
  }
}

// For development, you can manually trigger cron
export function startDevCron(): void {
  if (!cronStarted) {
    ReminderCron.start();
    cronStarted = true;
    console.log("Development reminder cron started");
  }
}
