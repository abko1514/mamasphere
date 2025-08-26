// app/dashboard/page.tsx - Simplified without email functionality
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTasks } from "@/lib/hooks/useTasks";
import TodoList from "@/components/task/TodoList";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { redirect } from "next/navigation";

interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  reminder?: string | null;
  priority?: number;
  category?: string;
  completed: boolean;
  recurring?: boolean;
  aiSuggested?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface TaskData {
  title: string;
  description?: string;
  reminder?: string | null;
  dueDate?: string | null;
  priority?: number | null;
  category?: string;
  recurring?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getUpcomingReminders,
    getOverdueTasks,
    getTodayTasks,
  } = useTasks();

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [notifications, setNotifications] = useState<string[]>([]);

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);

      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Browser notifications for immediate reminders
  useEffect(() => {
    if (notificationPermission !== "granted" || tasks.length === 0) {
      return;
    }

    const checkReminders = () => {
      const now = new Date();
      const upcomingTasks = tasks.filter((task) => {
        if (task.completed || !task.reminder) return false;

        const reminderTime = new Date(task.reminder);
        const timeDiff = reminderTime.getTime() - now.getTime();

        return timeDiff > 0 && timeDiff <= 60000; // Within 1 minute
      });

      upcomingTasks.forEach((task) => {
        try {
          new Notification(`Task Reminder: ${task.title}`, {
            body: task.description || "You have a task due soon!",
            icon: "/favicon.ico",
            tag: task._id,
          });
        } catch (notificationError) {
          console.error("Failed to show notification:", notificationError);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks, notificationPermission]);

  // Web-based notifications
  useEffect(() => {
    if (tasks.length === 0) return;

    const newNotifications: string[] = [];
    const upcomingReminders = getUpcomingReminders();
    const overdueTasks = getOverdueTasks();
    const todayTasks = getTodayTasks();

    if (upcomingReminders.length > 0) {
      newNotifications.push(
        `🔔 ${upcomingReminders.length} task${
          upcomingReminders.length > 1 ? "s" : ""
        } have upcoming reminders`
      );
    }

    if (overdueTasks.length > 0) {
      newNotifications.push(
        `⚠️ ${overdueTasks.length} task${
          overdueTasks.length > 1 ? "s are" : " is"
        } overdue`
      );
    }

    if (todayTasks.length > 0) {
      newNotifications.push(
        `📅 ${todayTasks.length} task${
          todayTasks.length > 1 ? "s are" : " is"
        } due today`
      );
    }

    setNotifications(newNotifications);
  }, [tasks, getUpcomingReminders, getOverdueTasks, getTodayTasks]);

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  const handleAddTask = async (taskData: TaskData): Promise<void> => {
    try {
      console.log("Dashboard: Adding task", taskData);

      const newTask = await addTask(taskData);

      // Show success notification
      if (notificationPermission === "granted") {
        try {
          new Notification("Task Added! 🎉", {
            body: `"${taskData.title}" has been added to your list`,
            icon: "/favicon.ico",
          });
        } catch (notificationError) {
          console.error("Failed to show notification:", notificationError);
        }
      }

      console.log("Dashboard: Task added successfully", newTask);
    } catch (error) {
      console.error("Dashboard: Failed to add task:", error);
    }
  };

  const handleUpdateTask = async (task: Task): Promise<void> => {
    try {
      // Extract only the updatable fields
      const updates = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        reminder: task.reminder,
        recurring: task.recurring,
      };

      await updateTask(task._id, updates);
      console.log("Dashboard: Task updated successfully", task);
    } catch (error) {
      console.error("Dashboard: Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    const taskToDelete = tasks.find((t) => t._id === taskId);

    if (
      window.confirm(
        `Are you sure you want to delete "${taskToDelete?.title}"?`
      )
    ) {
      try {
        await deleteTask(taskId);

        if (notificationPermission === "granted") {
          try {
            new Notification("Task Deleted", {
              body: "Task has been removed from your list",
              icon: "/favicon.ico",
            });
          } catch (notificationError) {
            console.error("Failed to show notification:", notificationError);
          }
        }

        console.log("Dashboard: Task deleted successfully");
      } catch (error) {
        console.error("Dashboard: Failed to delete task:", error);
      }
    }
  };

  const handleToggleComplete = async (
    taskId: string,
    completed: boolean
  ): Promise<void> => {
    try {
      await toggleComplete(taskId, completed);

      if (completed && notificationPermission === "granted") {
        const completedTask = tasks.find((t) => t._id === taskId);
        try {
          new Notification("Task Completed! 🎉", {
            body: `Great job completing "${completedTask?.title}"!`,
            icon: "/favicon.ico",
          });
        } catch (notificationError) {
          console.error("Failed to show notification:", notificationError);
        }
      }

      console.log("Dashboard: Task completion toggled");
    } catch (error) {
      console.error("Dashboard: Failed to toggle task:", error);
    }
  };

  const dismissNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  if (!session?.user) {
    return null;
  }

  const upcomingReminders = getUpcomingReminders();
  const overdueTasks = getOverdueTasks();
  const todayTasks = getTodayTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">
            Welcome back, {session.user.name || "User"}! 👋
          </h1>
          <p className="text-pink-100">Ready to tackle your tasks today?</p>
        </div>
      </div>

      {/* Web Notifications */}
      {notifications.length > 0 && (
        <div className="max-w-4xl mx-auto p-4 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-blue-700">
                <Bell size={16} />
                <span className="text-sm">{notification}</span>
              </div>
              <button
                onClick={() => dismissNotification(index)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Task Summary Cards */}
      <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle size={20} />
              <h3 className="font-semibold">Overdue Tasks</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {overdueTasks.length}
            </p>
            <p className="text-red-600 text-sm">Need immediate attention</p>
          </div>
        )}

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-700 mb-2">
              <Clock size={20} />
              <h3 className="font-semibold">Due Today</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {todayTasks.length}
            </p>
            <p className="text-yellow-600 text-sm">Tasks due today</p>
          </div>
        )}

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Bell size={20} />
              <h3 className="font-semibold">Upcoming Reminders</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {upcomingReminders.length}
            </p>
            <p className="text-blue-600 text-sm">Reminders within 1 hour</p>
          </div>
        )}
      </div>

      {/* Browser Notification Permission */}
      {notificationPermission === "default" && (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={24} />
                <div>
                  <h3 className="font-semibold">
                    🔔 Enable Browser Notifications
                  </h3>
                  <p className="text-sm opacity-90">
                    Get instant alerts for task reminders and updates
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if ("Notification" in window) {
                    Notification.requestPermission().then((permission) => {
                      setNotificationPermission(permission);
                    });
                  }
                }}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Enable Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Status */}
      {notificationPermission === "granted" && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle2 size={16} />
            <span>
              🔔 Browser notifications are enabled! You&apos;ll receive alerts
              for reminders.
            </span>
          </div>
        </div>
      )}

      {notificationPermission === "denied" && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2 text-orange-700 text-sm">
            <AlertCircle size={16} />
            <span>
              ⚠️ Browser notifications are disabled. Enable them in your browser
              settings to receive alerts.
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle size={16} />
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      <TodoList
        tasks={tasks.map((task) => ({
          ...task,
          createdAt: task.createdAt ?? new Date().toISOString(),
          dueDate: task.dueDate ?? undefined,
          reminder: task.reminder ?? undefined,
          category: [
            "household",
            "kids",
            "health",
            "work",
            "personal",
            "general",
          ].includes(task.category ?? "")
            ? (task.category as
                | "household"
                | "kids"
                | "health"
                | "work"
                | "personal"
                | "general")
            : undefined,
        }))}
        loading={loading}
        error={error ?? undefined}
        onAddTask={handleAddTask}
        onToggleComplete={handleToggleComplete}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
