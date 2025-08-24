// lib/hooks/useNotifications.ts - Hook for managing web notifications
import { useState, useEffect, useCallback } from "react";
import { NotificationService } from "@/lib/services/notificationService";

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

interface NotificationState {
  permission: NotificationPermission;
  supported: boolean;
}

export function useNotifications(tasks: Task[] = []) {
  const [notificationState, setNotificationState] = useState<NotificationState>(
    {
      permission: "default",
      supported: false,
    }
  );

  // Update notification state
  useEffect(() => {
    const { supported, permission } =
      NotificationService.getNotificationSupport();
    setNotificationState({ supported, permission });
  }, []);

  // Request notification permission
  const requestPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      const permission = await NotificationService.requestPermission();
      setNotificationState((prev) => ({ ...prev, permission }));
      return permission;
    }, []);

  // Show task-related notifications
  const showTaskReminder = useCallback((task: Task): boolean => {
    return NotificationService.showTaskReminder(task);
  }, []);

  const showTaskCompleted = useCallback((task: Task): boolean => {
    return NotificationService.showTaskAddedNotification(task);
  }, []);

  const showTaskAdded = useCallback((task: Task): boolean => {
    return NotificationService.showTaskAddedNotification(task);
  }, []);

  const showOverdueNotification = useCallback(
    (overdueTasks: Task[]): boolean => {
      return NotificationService.showOverdueNotification(overdueTasks);
    },
    []
  );

  const showDailyDigest = useCallback(
    (todayTasks: Task[], upcomingTasks: Task[]): boolean => {
      return NotificationService.showDailyDigest(todayTasks, upcomingTasks);
    },
    []
  );

  // Automatic reminder checking
  useEffect(() => {
    if (notificationState.permission !== "granted" || tasks.length === 0) {
      return;
    }

    // Check for upcoming reminders every minute
    const reminderInterval = setInterval(() => {
      NotificationService.checkUpcomingReminders(tasks);
    }, 60000); // 1 minute

    // Check for overdue tasks every hour
    const overdueInterval = setInterval(() => {
      NotificationService.checkOverdueTasks(tasks);
    }, 3600000); // 1 hour

    return () => {
      clearInterval(reminderInterval);
      clearInterval(overdueInterval);
    };
  }, [tasks, notificationState.permission]);

  // Clear notification queue when tasks change significantly
  useEffect(() => {
    NotificationService.clearNotificationQueue();
  }, [tasks.length]);

  // Get task statistics for notifications
  const getTaskStats = useCallback(() => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = {
      overdue: tasks.filter((task) => {
        if (task.completed || !task.dueDate) return false;
        return new Date(task.dueDate) < now;
      }),
      dueToday: tasks.filter((task) => {
        if (task.completed || !task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate < tomorrow;
      }),
      upcomingReminders: tasks.filter((task) => {
        if (task.completed || !task.reminder) return false;
        const reminderTime = new Date(task.reminder);
        const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
        return reminderTime > now && reminderTime <= inOneHour;
      }),
      highPriority: tasks.filter(
        (task) => !task.completed && task.priority >= 4
      ),
    };

    return stats;
  }, [tasks]);

  // Show daily digest (call this once per day)
  const triggerDailyDigest = useCallback(() => {
    const stats = getTaskStats();
    return showDailyDigest(stats.dueToday, stats.upcomingReminders);
  }, [getTaskStats, showDailyDigest]);

  return {
    // State
    permission: notificationState.permission,
    supported: notificationState.supported,
    enabled: notificationState.permission === "granted",

    // Actions
    requestPermission,
    showTaskReminder,
    showTaskCompleted,
    showTaskAdded,
    showOverdueNotification,
    showDailyDigest,
    triggerDailyDigest,

    // Utils
    getTaskStats,
  };
}
