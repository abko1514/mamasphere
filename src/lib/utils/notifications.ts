interface NotificationAction {
  action: string;
  title: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string | Date;
  reminder?: string | Date;
}

interface CustomNotificationOptions extends NotificationOptions {
  actions?: NotificationAction[];
  tag?: string;
  requireInteraction?: boolean;
  badge?: string;
  vibrate?: number[];
}

export class NotificationService {
  static async requestPermission() {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      console.log("Notification permission denied");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  static showNotification(
    title: string,
    options: CustomNotificationOptions = {}
  ): Notification | null {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return null;
    }

    const defaultOptions: CustomNotificationOptions = {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    };

    const mergedOptions: CustomNotificationOptions = {
      ...defaultOptions,
      ...options,
    };

    try {
      return new Notification(title, mergedOptions);
    } catch (e) {
      console.error("Failed to show notification:", e);
      return null;
    }
  }

  static showTaskReminder(task: Task): Notification | null {
    const title: string = `⏰ Task Reminder: ${task.title}`;
    const options: CustomNotificationOptions = {
      body: task.description || "Don't forget about this task!",
      icon: "/favicon.ico",
      tag: `reminder-${task._id}`,
      requireInteraction: true,
    };

    return this.showNotification(title, options);
  }

  static showTaskCompleted(task: Task): Notification | null {
    const messages = [
      "🎉 Amazing! You're on fire!",
      "💪 Way to go, supermom!",
      "✨ Another one bites the dust!",
      "🌟 You're crushing it today!",
      "👑 Queen of productivity!",
    ];

    const randomMessage: string =
      messages[Math.floor(Math.random() * messages.length)];

    const options: CustomNotificationOptions = {
      body: randomMessage,
      icon: "/favicon.ico",
      tag: `completed-${task._id}`,
    };

    return this.showNotification("Task Completed!", options);
  }

  static showEmailNotificationSetup(): Notification | null {
    const options: CustomNotificationOptions = {
      body: "Setup email notifications to never miss a task reminder!",
      icon: "/favicon.ico",
      tag: "email-setup-prompt",
      requireInteraction: true,
    };

    return this.showNotification("📧 Enable Email Reminders?", options);
  }

  // 🎯 NEW: Show notification when email reminder is scheduled
  static showEmailReminderScheduled(task: Task): Notification | null {
    const options: CustomNotificationOptions = {
      body: `You'll receive an email reminder for "${task.title}"`,
      icon: "/favicon.ico",
      tag: `email-scheduled-${task._id}`,
    };

    return this.showNotification("📧 Email Reminder Scheduled", options);
  }
}
