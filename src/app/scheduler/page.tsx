// ===== 6. Fix dashboard/page.tsx =====
"use client";

import { useState, useEffect } from "react";
import { useTasks } from "@/lib/hooks/useTasks";
import TodoList from "@/components/task/TodoList";
import EmailSetup from "@/components/notifications/EmailSetup";
import { Mail, CheckCircle2 } from "lucide-react";

const DEMO_USER_ID = "demo-user-123";

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

interface NotificationPreferences {
  email: string;
  name?: string;
  dailyDigest?: boolean;
  overdueReminders?: boolean;
  taskReminders?: boolean;
}

export default function DashboardPage() {
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    setupEmailNotifications,
    sendTestEmail,
  } = useTasks(DEMO_USER_ID);

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailSetupComplete, setEmailSetupComplete] = useState(false);

  // Check if user has already setup email notifications
  useEffect(() => {
    const hasEmailSetup = localStorage.getItem(`email-setup-${DEMO_USER_ID}`);
    setEmailSetupComplete(!!hasEmailSetup);
  }, []);

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

  // Browser notifications for immediate reminders (keep existing functionality)
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

        return timeDiff > 0 && timeDiff <= 60000;
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

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [tasks, notificationPermission]);

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
            body: `Great job completing "${completedTask?.title}"! You&apos;re crushing it, mama!`,
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

  const handleEmailSetup = async (
    preferences: NotificationPreferences
  ): Promise<boolean> => {
    try {
      const success = await setupEmailNotifications(preferences);

      if (success) {
        localStorage.setItem(`email-setup-${DEMO_USER_ID}`, "true");
        setEmailSetupComplete(true);
        setShowEmailSetup(false);
      }

      return success;
    } catch (error) {
      console.error("Failed to setup email notifications:", error);
      return false;
    }
  };

  const handleTestEmail = async (
    email: string,
    name?: string
  ): Promise<boolean> => {
    try {
      return await sendTestEmail(email, name);
    } catch (error) {
      console.error("Failed to send test email:", error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Email Setup Notification Banner */}
      {!emailSetupComplete && !showEmailSetup && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail size={24} />
              <div>
                <h3 className="font-semibold">📧 Get Email Reminders!</h3>
                <p className="text-sm opacity-90">
                  Never miss a task again with email notifications
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailSetup(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Setup Now
              </button>
              <button
                onClick={() => setEmailSetupComplete(true)}
                className="text-blue-100 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Setup Component */}
      {showEmailSetup && (
        <div className="max-w-4xl mx-auto p-4">
          <EmailSetup
            onSetupComplete={handleEmailSetup}
            onSendTest={handleTestEmail}
          />
        </div>
      )}

      {/* Email Status Indicator */}
      {emailSetupComplete && (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle2 size={16} />
            <span>
              📧 Email notifications are active! You&apos;ll receive reminders
              via email.
            </span>
            <button
              onClick={() => {
                setShowEmailSetup(true);
                setEmailSetupComplete(false);
              }}
              className="ml-auto text-green-600 hover:text-green-800 underline"
            >
              Update Settings
            </button>
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