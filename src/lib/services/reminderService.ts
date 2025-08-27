import { EmailService } from "./emailService";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";

// Reminder Schema
const reminderSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  static async scheduleTaskReminder(
    taskId: string,
    userEmail: string,
    reminderTime: Date
  ): Promise<void> {
    try {
      await dbConnect();

      const User = mongoose.models.User;
      if (!User) {
        throw new Error("User model not found");
      }

      // Find user by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw new Error("User not found");
      }

      // Remove any existing reminders for this task
      await Reminder.deleteMany({ taskId, type: "task-reminder" });

      // Create new reminder
      const reminder = new Reminder({
        taskId,
        userId: user._id,
        reminderTime,
        type: "task-reminder",
        sent: false,
      });

      await reminder.save();
      console.log(
        `📅 Task reminder scheduled for: ${reminderTime.toLocaleString()}`
      );
    } catch (error) {
      console.error("Failed to schedule task reminder:", error);
      throw error;
    }
  }

  static async processReminders(): Promise<void> {
    try {
      await dbConnect();

      const now = new Date();
      const reminders = await Reminder.find({
        sent: false,
        reminderTime: { $lte: now },
      }).populate("userId");

      console.log(`⏰ Processing ${reminders.length} reminders...`);

      for (const reminder of reminders) {
        try {
          switch (reminder.type) {
            case "task-reminder":
              await this.processTaskReminder(reminder);
              break;
            case "overdue-check":
              await this.processOverdueCheck(reminder);
              break;
            case "daily-digest":
              await this.processDailyDigest(reminder);
              break;
          }

          // Mark as sent
          reminder.sent = true;
          reminder.sentAt = new Date();
          await reminder.save();
        } catch (error) {
          console.error(`Error processing reminder ${reminder._id}:`, error);
        }
      }
    } catch (error) {
      console.error("Error in reminder processing:", error);
    }
  }

  private static async processTaskReminder(
    reminder: ScheduledReminder
  ): Promise<void> {
    try {
      await dbConnect();

      const Task = mongoose.models.Task;
      const User = mongoose.models.User;

      if (!Task || !User) {
        console.error("Task or User model not found");
        return;
      }

      // Get task details
      const task = await Task.findById(reminder.taskId);
      if (!task) {
        console.log("Task not found for reminder:", reminder.taskId);
        return;
      }

      // Get user data
      const user = await User.findById(reminder.userId);
      if (!user || !user.email) {
        console.log("User not found for reminder:", reminder.userId);
        return;
      }

      const taskForEmail: TaskForEmail = {
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
      };

      // Send reminder email
      const success = await EmailService.sendTaskReminder(
        taskForEmail,
        userData
      );

      if (success) {
        console.log("✅ Task reminder sent for:", task.title);
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

      const Task = mongoose.models.Task;
      const User = mongoose.models.User;

      if (!Task || !User) {
        console.error("Task or User model not found");
        return;
      }

      // Get user data
      const user = await User.findById(reminder.userId);

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
      const User = mongoose.models.User;

      if (!Task || !User) {
        console.error("Task or User model not found");
        return;
      }

      // Get user data
      const user = await User.findById(reminder.userId);

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

  static async initializeUserReminders(userId: string): Promise<void> {
    try {
      await this.scheduleDailyDigest(userId);
      await this.scheduleOverdueCheck(userId);
      console.log("✅ Initialized reminders for user:", userId);
    } catch (error) {
      console.error("Failed to initialize user reminders:", error);
    }
  }
}
