import { EmailService } from "./emailService";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";

// Reminder Schema
const reminderSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  userId: { type: String, required: true },
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

// User Schema (for reference - you might have this elsewhere)
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  timezone: String,
  notifications: {
    taskReminders: { type: Boolean, default: true },
    overdueReminders: { type: Boolean, default: true },
    dailyDigest: { type: Boolean, default: true },
  },
});

// Task Schema (for reference - you might have this elsewhere)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  userId: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: Number,
  category: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Models
const Reminder =
  mongoose.models.Reminder || mongoose.model("Reminder", reminderSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

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

// Task interface used for email operations
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

export class ReminderService {
  static async scheduleTaskReminder(
    taskId: string,
    userId: string,
    reminderTime: Date
  ): Promise<void> {
    try {
      await dbConnect();

      // Remove any existing unsent reminders for this task
      await Reminder.deleteMany({
        taskId,
        sent: false,
        type: "task-reminder",
      });

      const reminder = new Reminder({
        taskId,
        userId,
        reminderTime,
        type: "task-reminder",
        sent: false,
      });

      await reminder.save();
      console.log(
        "📅 Reminder scheduled for task:",
        taskId,
        "at",
        reminderTime
      );
    } catch (error) {
      console.error("Failed to schedule reminder:", error);
    }
  }

  static async processPendingReminders(): Promise<void> {
    try {
      await dbConnect();

      const now = new Date();
      const pendingReminders = await Reminder.find({
        sent: false,
        reminderTime: { $lte: now },
      });

      console.log(`🔔 Processing ${pendingReminders.length} pending reminders`);

      for (const reminder of pendingReminders) {
        try {
          if (reminder.type === "task-reminder") {
            await this.processTaskReminder(reminder);
          } else if (reminder.type === "overdue-check") {
            await this.processOverdueCheck(reminder);
          } else if (reminder.type === "daily-digest") {
            await this.processDailyDigest(reminder);
          }

          // Mark as sent
          await Reminder.findByIdAndUpdate(reminder._id, {
            sent: true,
            sentAt: new Date(),
          });
        } catch (error) {
          console.error("Failed to process reminder:", reminder._id, error);
        }
      }
    } catch (error) {
      console.error("Failed to process pending reminders:", error);
    }
  }

  private static async processTaskReminder(
    reminder: ScheduledReminder
  ): Promise<void> {
    try {
      await dbConnect();

      // Get the task
      const task = await Task.findById(reminder.taskId);

      if (!task || task.completed) {
        console.log("Task not found or already completed:", reminder.taskId);
        return;
      }

      // Get user data
      const user = await User.findOne({ userId: reminder.userId });

      if (!user || !user.email) {
        console.log("User not found or no email for userId:", reminder.userId);
        return;
      }

      // Check if user has task reminders enabled
      if (user.notifications && user.notifications.taskReminders === false) {
        console.log("Task reminders disabled for user:", reminder.userId);
        return;
      }

      // Prepare task data for email
      const taskData: TaskForEmail = {
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        userId: task.userId,
        dueDate: task.dueDate,
        priority: task.priority,
        category: task.category,
        completed: task.completed,
      };

      const userData: UserData = {
        email: user.email,
        name: user.name,
        timezone: user.timezone,
      };

      // Send reminder email
      const success = await EmailService.sendTaskReminder(taskData, userData);

      if (success) {
        console.log("✅ Task reminder sent successfully for:", task.title);
      } else {
        console.error("❌ Failed to send task reminder for:", task.title);
      }
    } catch (error) {
      console.error("Error processing task reminder:", error);
    }
  }

  private static async processOverdueCheck(
    reminder: ScheduledReminder
  ): Promise<void> {
    try {
      await dbConnect();

      // Get user data
      const user = await User.findOne({ userId: reminder.userId });

      if (!user || !user.email) {
        console.log("User not found or no email for userId:", reminder.userId);
        return;
      }

      // Check if user has overdue reminders enabled
      if (user.notifications && user.notifications.overdueReminders === false) {
        console.log("Overdue reminders disabled for user:", reminder.userId);
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

      // Prepare tasks for email
      const tasksForEmail: TaskForEmail[] = overdueTasks.map((task) => ({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        userId: task.userId,
        dueDate: task.dueDate,
        priority: task.priority,
        category: task.category,
        completed: task.completed,
      }));

      const userData: UserData = {
        email: user.email,
        name: user.name,
        timezone: user.timezone,
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

      // Get user data
      const user = await User.findOne({ userId: reminder.userId });

      if (!user || !user.email) {
        console.log("User not found or no email for userId:", reminder.userId);
        return;
      }

      // Check if user has daily digest enabled
      if (user.notifications && user.notifications.dailyDigest === false) {
        console.log("Daily digest disabled for user:", reminder.userId);
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

      // Prepare tasks for email
      const tasksForEmail: TaskForEmail[] = relevantTasks.map((task) => ({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        userId: task.userId,
        dueDate: task.dueDate,
        priority: task.priority,
        category: task.category,
        completed: task.completed,
      }));

      const userData: UserData = {
        email: user.email,
        name: user.name,
        timezone: user.timezone,
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
        taskId: "", // Not specific to a task
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
        taskId: "", // Not specific to a task
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
