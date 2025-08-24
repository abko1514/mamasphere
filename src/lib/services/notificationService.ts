// lib/services/notificationService.ts - Web-based notification service
interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  reminder?: string | null;
  priority: number;
  category: string;
  completed: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private notificationQueue: Set<string> = new Set();

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request notification permission
  static async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Show a browser notification
  static showNotification(
    title: string,
    options: NotificationOptions = {}
  ): boolean {
    if (Notification.permission !== "granted") {
      console.warn("Notification permission not granted");
      return false;
    }

    try {
      new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });
      return true;
    } catch (error) {
      console.error("Failed to show notification:", error);
      return false;
    }
  }

  // Show task reminder notification
  static showTaskReminder(task: Task): boolean {
    return this.showNotification(`Task Reminder: ${task.title}`, {
      body: task.description || "You have a task reminder!",
      tag: `task-reminder-${task._id}`,
      requireInteraction: true,
    });
  }

  // Show overdue task notification
  static showOverdueNotification(tasks: Task[]): boolean {
    const title = `${tasks.length} Task${tasks.length > 1 ? "s" : ""} Overdue`;
    const body = tasks.length === 1 
      ? `"${tasks[0].title}" is overdue`
      : `You have ${tasks.length} overdue tasks that need attention`;

    return this.showNotification(title, {
      body,
      tag: "overdue-tasks",
      requireInteraction: true,
    });
  }
  static showTaskAddedNotification(task: Task): boolean {
    return this.showNotification("Task Added! ✅", {
      body: `"${task.title}" has been added to your list`,
      tag: `task-added-${task._id}`,
    });
  }

  // Show daily digest notification
  static showDailyDigest(todayTasks: Task[], upcomingTasks: Task[]): boolean {
    let body = "";
    if (todayTasks.length > 0) {
      body += `${todayTasks.length} task${todayTasks.length > 1 ? "s" : ""} due today. `;
    }
    if (upcomingTasks.length > 0) {
      body += `${upcomingTasks.length} upcoming reminder${upcomingTasks.length > 1 ? "s" : ""}.`;
    }

    if (!body) {
      body = "No urgent tasks today. Great job staying organized!";
    }

    return this.showNotification("Daily Task Summary 📅", {
      body: body.trim(),
      tag: "daily-digest",
      requireInteraction: true,
    });
  }

  // Check for upcoming reminders (call this periodically)
  static checkUpcomingReminders(tasks: Task[]): void {
    const now = new Date();
    const inFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000);
    const inOneMinute = new Date(now.getTime() + 60 * 1000);

    tasks.forEach((task) => {
      if (task.completed || !task.reminder) return;

      const reminderTime = new Date(task.reminder);
      const taskKey = `${task._id}-${reminderTime.getTime()}`;

      // Don't spam notifications for the same task
      if (this.getInstance().notificationQueue.has(taskKey)) return;

      // Show notification 5 minutes before
      if (reminderTime <= inFiveMinutes && reminderTime > inOneMinute) {
        this.showNotification(`Upcoming Reminder: ${task.title}`, {
          body: `Task reminder in ${Math.ceil((reminderTime.getTime() - now.getTime()) / (60 * 1000))} minutes`,
          tag: `upcoming-${task._id}`,
        });
        this.getInstance().notificationQueue.add(taskKey);
      }

      // Show main reminder
      if (reminderTime <= now) {
        this.showTaskReminder(task);
        this.getInstance().notificationQueue.add(taskKey);
      }
    });
  }

  // Check for overdue tasks (call this daily)
  static checkOverdueTasks(tasks: Task[]): void {
    const now = new Date();
    const overdueTasks = tasks.filter((task) => {
      if (task.completed || !task.dueDate) return false;
      return new Date(task.dueDate) < now;
    });

    if (overdueTasks.length > 0) {
      this.showOverdueNotification(overdueTasks);
    }
  }

  // Clear notification queue (call when tasks are updated)
  static clearNotificationQueue(): void {
    this.getInstance().notificationQueue.clear();
  }

  // Get browser notification support status
  static getNotificationSupport(): {
    supported: boolean;
    permission: NotificationPermission;
  } {
    return {
      supported: "Notification" in window,
      permission: "Notification" in window ? Notification.permission : "denied",
    };
  }
}