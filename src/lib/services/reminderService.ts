// 1. lib/services/reminderService.ts - Fixed version
import { EmailService } from "./emailService";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";

// Reminder Schema
const reminderSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  reminderTime: { type: Date, required: true },
  type: {
    type: String,
    enum: ["task-reminder", "overdue-check", "daily-digest"],
    required: true,
  },
  sent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date },
});

// Models
const Reminder =
  mongoose.models.Reminder || mongoose.model("Reminder", reminderSchema);

interface ScheduledReminder {
  _id?: string;
  taskId: string;
  userId: string;
  reminderTime: Date;
  type: "task-reminder" | "overdue-check" | "daily-digest";
  sent: boolean;
  createdAt: Date;
  sentAt?: Date;
}

interface UserData {
  email: string;
  name?: string;
  timezone?: string;
}

interface TaskForEmail {
  _id: string;
  title: string;
  description?: string;
  userId: string;
  dueDate: Date;
  priority?: number;
  category?: string;
  completed: boolean;
}

// Define a proper interface for the Task document
interface TaskDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  userId: string;
  dueDate: Date;
  priority?: number;
  category?: string;
  completed: boolean;
}

export class ReminderService {
  // ... existing methods ...

  private static async processOverdueCheck(
    reminder: ScheduledReminder
  ): Promise<void> {
    try {
      await dbConnect();

      const Task = mongoose.models.Task;
      const Users = mongoose.models.Users;

      if (!Task || !Users) {
        console.error("Task or Users model not found");
        return;
      }

      // Get user data
      const user = await Users.findById(reminder.userId);

      if (!user || !user.email) {
        console.log("User not found or no email for userId:", reminder.userId);
        return;
      }

      // Get user's overdue tasks
      const overdueTasks = await Task.find({
        userId: reminder.userId,
        completed: false,
        dueDate: { $lt: new Date() },
      });

      if (overdueTasks.length === 0) {
        console.log("No overdue tasks for user:", reminder.userId);
        return;
      }

      // Prepare tasks for email with proper typing
      const tasksForEmail: TaskForEmail[] = overdueTasks.map(
        (task: TaskDocument) => ({
          _id: task._id.toString(),
          title: task.title,
          description: task.description,
          userId: task.userId,
          dueDate: task.dueDate,
          priority: task.priority,
          category: task.category,
          completed: task.completed,
        })
      );

      const userData: UserData = {
        email: user.email,
        name: user.name,
      };

      // Send overdue notification
      const success = await EmailService.sendOverdueNotification(
        tasksForEmail,
        userData
      );

      if (success) {
        console.log(
          "✅ Overdue notification sent for",
          overdueTasks.length,
          "tasks"
        );
      }

      // Schedule next overdue check for tomorrow
      await this.scheduleOverdueCheck(reminder.userId);
    } catch (error) {
      console.error("Error processing overdue check:", error);
    }
  }

  private static async processDailyDigest(
    reminder: ScheduledReminder
  ): Promise<void> {
    try {
      await dbConnect();

      const Task = mongoose.models.Task;
      const Users = mongoose.models.Users;

      if (!Task || !Users) {
        console.error("Task or Users model not found");
        return;
      }

      // Get user data
      const user = await Users.findById(reminder.userId);

      if (!user || !user.email) {
        console.log("User not found or no email for userId:", reminder.userId);
        return;
      }

      // Get user's tasks for today and tomorrow
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      const relevantTasks = await Task.find({
        userId: reminder.userId,
        completed: false,
        dueDate: {
          $gte: today,
          $lt: dayAfterTomorrow,
        },
      });

      // Only send if there are tasks
      if (relevantTasks.length === 0) {
        console.log("No tasks for daily digest for user:", reminder.userId);
        // Still schedule next digest
        await this.scheduleDailyDigest(reminder.userId);
        return;
      }

      // Prepare tasks for email with proper typing
      const tasksForEmail: TaskForEmail[] = relevantTasks.map(
        (task: TaskDocument) => ({
          _id: task._id.toString(),
          title: task.title,
          description: task.description,
          userId: task.userId,
          dueDate: task.dueDate,
          priority: task.priority,
          category: task.category,
          completed: task.completed,
        })
      );

      const userData: UserData = {
        email: user.email,
        name: user.name,
      };

      // Send daily digest
      const success = await EmailService.sendDailyDigest(
        tasksForEmail,
        userData
      );

      if (success) {
        console.log("✅ Daily digest sent to:", user.email);
      }

      // Schedule next daily digest for tomorrow
      await this.scheduleDailyDigest(reminder.userId);
    } catch (error) {
      console.error("Error processing daily digest:", error);
    }
  }

  static async scheduleDailyDigest(userId: string): Promise<void> {
    try {
      await dbConnect();

      // Remove any existing unsent daily digests for this user
      await Reminder.deleteMany({
        userId,
        type: "daily-digest",
        sent: false,
      });

      // Schedule daily digest for 8 AM tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0);

      const reminder = new Reminder({
        taskId: "daily-digest-" + userId, // Unique identifier
        userId,
        reminderTime: tomorrow,
        type: "daily-digest",
        sent: false,
      });

      await reminder.save();
      console.log("📅 Daily digest scheduled for:", tomorrow.toLocaleString());
    } catch (error) {
      console.error("Failed to schedule daily digest:", error);
    }
  }

  static async scheduleOverdueCheck(userId: string): Promise<void> {
    try {
      await dbConnect();

      // Remove any existing unsent overdue checks for this user
      await Reminder.deleteMany({
        userId,
        type: "overdue-check",
        sent: false,
      });

      // Check for overdue tasks every day at 6 PM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);

      const reminder = new Reminder({
        taskId: "overdue-check-" + userId, // Unique identifier
        userId,
        reminderTime: tomorrow,
        type: "overdue-check",
        sent: false,
      });

      await reminder.save();
      console.log("📅 Overdue check scheduled for:", tomorrow.toLocaleString());
    } catch (error) {
      console.error("Failed to schedule overdue check:", error);
    }
  }
}
