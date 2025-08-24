// hooks/useTasks.ts 
import { useState, useEffect, useCallback } from "react";

interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  reminder?: string | null;
  priority: number;
  category: string;
  completed: boolean;
  recurring?: boolean;
  aiSuggested?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string | null;
  reminder?: string | null;
  priority?: number | null;
  category?: string;
  recurring?: boolean;
}

interface TasksResponse {
  tasks: Task[];
  message?: string;
}

interface CreateTaskResponse {
  task: Task;
  message: string;
  aiSuggestions?: {
    priority: number;
    category: string;
    aiProcessed: boolean;
  };
  emailScheduled?: boolean;
}

interface NotificationPreferences {
  email: string;
  name?: string;
  dailyDigest?: boolean;
  overdueReminders?: boolean;
  taskReminders?: boolean;
}

export function useTasks(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching tasks for user:", userId);

      const response = await fetch(
        `/api/tasks?userId=${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data: TasksResponse = await response.json();
      console.log("Fetched tasks:", data.tasks?.length || 0);

      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(errorMessage);
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addTask = async (taskData: CreateTaskData): Promise<Task> => {
    try {
      console.log("Adding task with email scheduling:", taskData);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...taskData, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data: CreateTaskResponse = await response.json();
      console.log("Task created with email scheduling:", data.task);

      // Show notification about email scheduling
      if (data.emailScheduled) {
        console.log("📧 Email reminder scheduled for this task!");
      }

      setTasks((prev) => [data.task, ...prev]);
      setError(null);

      return data.task;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create task";
      setError(errorMessage);
      console.error("Error creating task:", err);
      throw err;
    }
  };

  const updateTask = async (
    taskId: string,
    updates: Partial<Task>
  ): Promise<void> => {
    try {
      console.log("Updating task:", taskId, updates);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      // If updating reminder, schedule new email reminder via API
      if (updates.reminder) {
        try {
          const reminderResponse = await fetch("/api/reminders/schedule", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              taskId,
              userId,
              reminderTime: updates.reminder,
            }),
          });

          if (reminderResponse.ok) {
            console.log("📧 Updated email reminder scheduled");
          } else {
            console.error("Failed to reschedule email reminder");
          }
        } catch (reminderError) {
          console.error("Failed to reschedule email reminder:", reminderError);
        }
      }

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        )
      );
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update task";
      setError(errorMessage);
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      console.log("Deleting task:", taskId);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete task";
      setError(errorMessage);
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const toggleComplete = async (
    taskId: string,
    completed: boolean
  ): Promise<void> => {
    await updateTask(taskId, { completed });
  };

  // Setup email notifications
  const setupEmailNotifications = async (
    preferences: NotificationPreferences
  ): Promise<boolean> => {
    try {
      console.log("Setting up email notifications:", preferences);

      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...preferences, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Email setup error:", errorData);
        throw new Error(errorData.error || "Failed to setup email notifications");
      }

      const result = await response.json();
      console.log("Email notifications setup result:", result);

      setEmailNotificationsEnabled(true);
      console.log("📧 Email notifications setup successfully");
      return true;
    } catch (error) {
      console.error("Failed to setup email notifications:", error);
      return false;
    }
  };

  // Send test email
  const sendTestEmail = async (
    email: string,
    name?: string
  ): Promise<boolean> => {
    try {
      console.log("Sending test email to:", email);

      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Test email error:", errorData);
        return false;
      }

      const result = await response.json();
      console.log("Test email result:", result);
      return true;
    } catch (error) {
      console.error("Failed to send test email:", error);
      return false;
    }
  };

  // Check email setup status
  useEffect(() => {
    const checkEmailSetup = () => {
      const hasEmailSetup = localStorage.getItem(`email-setup-${userId}`);
      setEmailNotificationsEnabled(!!hasEmailSetup);
    };

    checkEmailSetup();
  }, [userId]);

  // Fetch tasks when userId changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    refreshTasks: fetchTasks,
    setupEmailNotifications,
    sendTestEmail,
    emailNotificationsEnabled,
  };
}