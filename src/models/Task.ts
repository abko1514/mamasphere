import { Db, ObjectId } from "mongodb";

interface Task {
    _id?: ObjectId;
    title: string;
    description?: string;
    priority?: number;
    category?: string;
    dueDate?: Date | string | null;
    reminder?: Date | string | null;
    completed?: boolean;
    recurring?: boolean;
    recurringPattern?: string | null;
    aiSuggested?: boolean;
    userId: ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const TaskModel = {
  // Create indexes for better performance
  async createIndexes(db: Db): Promise<void> {
    await db.collection("tasks").createIndex({ userId: 1 });
    await db.collection("tasks").createIndex({ dueDate: 1 });
    await db.collection("tasks").createIndex({ priority: -1 });
  },

  validate(task: Task): string[] {
    const errors: string[] = [];

    if (!task.title || task.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (!task.userId) {
      errors.push("User ID is required");
    }

    if (task.priority && (task.priority < 1 || task.priority > 5)) {
      errors.push("Priority must be between 1 and 5");
    }

    return errors;
  },

  // Create task object
  create(
    taskData: Omit<Task, "_id" | "createdAt" | "updatedAt" | "completed">
  ): Task {
    const now = new Date();
    return {
      _id: new ObjectId(),
      title: taskData.title.trim(),
      description: taskData.description?.trim() || "",
      priority: taskData.priority || 3,
      category: taskData.category || "general",
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      reminder: taskData.reminder ? new Date(taskData.reminder) : null,
      completed: false,
      recurring: taskData.recurring || false,
      recurringPattern: taskData.recurringPattern || null,
      aiSuggested: taskData.aiSuggested || false,
      userId: taskData.userId,
      createdAt: now,
      updatedAt: now,
    };
  },
};
