// lib/hooks/useTasks.ts - Simplified without email functionality
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
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching tasks for authenticated user");

      const response = await fetch("/api/tasks");

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
  }, []);

  const addTask = async (taskData: CreateTaskData): Promise<Task> => {
    try {
      console.log("Adding task:", taskData);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data: CreateTaskResponse = await response.json();
      console.log("Task created:", data.task);

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

  // Get upcoming tasks with reminders for web notifications
  const getUpcomingReminders = useCallback((): Task[] => {
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

    return tasks.filter((task) => {
      if (task.completed || !task.reminder) return false;

      const reminderTime = new Date(task.reminder);
      return reminderTime > now && reminderTime <= inOneHour;
    });
  }, [tasks]);

  // Get overdue tasks
  const getOverdueTasks = useCallback((): Task[] => {
    const now = new Date();
    return tasks.filter((task) => {
      if (task.completed || !task.dueDate) return false;
      return new Date(task.dueDate) < now;
    });
  }, [tasks]);

  // Get tasks due today
  const getTodayTasks = useCallback((): Task[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter((task) => {
      if (task.completed || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });
  }, [tasks]);

  // Fetch tasks on component mount
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
    // Utility functions for web notifications
    getUpcomingReminders,
    getOverdueTasks,
    getTodayTasks,
  };
}
