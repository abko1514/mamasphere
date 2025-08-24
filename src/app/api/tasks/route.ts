import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";
import { AIService } from "@/lib/utils/aiService";
import { ReminderService } from "@/lib/services/reminderService";

interface CreateTaskRequest {
  userId: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  priority?: number | null;
  category?: string;
  reminder?: string | null;
  recurring?: boolean;
}

interface FilterQuery {
  userId: string;
  completed?: boolean;
}

// Task Schema (if you don't have it elsewhere)
const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date, default: null },
  reminder: { type: String, default: null },
  priority: { type: Number, default: 3 },
  aiSuggested: { type: Boolean, default: false },
  category: { type: String, default: "general" },
  completed: { type: Boolean, default: false },
  recurring: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export async function GET(request: Request): Promise<Response> {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const completed = searchParams.get("completed");

    console.log("Fetching tasks for user:", userId);

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const filter: FilterQuery = { userId };
    if (completed !== null) {
      filter.completed = completed === "true";
    }

    const tasks = await Task.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    const transformedTasks = tasks.map((task) => ({
      ...task,
      _id: (task._id as mongoose.Types.ObjectId).toString(),
    }));

    console.log(`Found ${transformedTasks.length} tasks`);

    return NextResponse.json({
      tasks: transformedTasks,
      message: `Found ${transformedTasks.length} tasks`,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch tasks",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    await dbConnect();

    const taskData: CreateTaskRequest = await request.json();

    console.log("Creating new task with email scheduling:", taskData);

    if (!taskData.userId || !taskData.title?.trim()) {
      return NextResponse.json(
        { error: "userId and title are required" },
        { status: 400 }
      );
    }

    let finalPriority = taskData.priority;
    let finalCategory = taskData.category;
    let aiProcessed = false;

    // AI prioritization logic
    if (!finalPriority || finalPriority === null) {
      try {
        console.log("Using AI to determine priority...");
        finalPriority = await AIService.prioritizeTask(
          taskData.title,
          taskData.description || "",
          taskData.dueDate
        );
        aiProcessed = true;
        console.log("AI suggested priority:", finalPriority);
      } catch (aiError) {
        console.log("AI prioritization failed, using default:", aiError);
        finalPriority = 3;
      }
    }

    // Auto-categorize if not provided
    if (!finalCategory || finalCategory === "general") {
      try {
        finalCategory = AIService.categorizeTask(
          taskData.title,
          taskData.description || ""
        );
        console.log("AI suggested category:", finalCategory);
      } catch (aiError) {
        console.log("AI categorization failed, using default:", aiError);
        finalCategory = "general";
      }
    }

    const newTaskData = {
      userId: taskData.userId,
      title: taskData.title.trim(),
      description: (taskData.description || "").trim(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      reminder: taskData.reminder || null,
      priority: finalPriority,
      aiSuggested: aiProcessed,
      category: finalCategory,
      completed: false,
      recurring: taskData.recurring || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Final task data:", newTaskData);

    const newTask = new Task(newTaskData);
    const savedTask = await newTask.save();

    const responseTask = {
      ...savedTask.toObject(),
      _id: savedTask._id.toString(),
    };

    let emailScheduled = false;

    // Schedule email reminder if reminder time is set
    if (taskData.reminder) {
      try {
        await ReminderService.scheduleTaskReminder(
          savedTask._id.toString(),
          taskData.userId,
          new Date(taskData.reminder)
        );
        console.log("📧 Email reminder scheduled for:", taskData.reminder);
        emailScheduled = true;
      } catch (reminderError) {
        console.error("Failed to schedule email reminder:", reminderError);
      }
    }

    // Auto-schedule overdue check for tasks with due dates
    if (taskData.dueDate) {
      try {
        await ReminderService.scheduleOverdueCheck(taskData.userId);
        console.log("✅ Overdue check scheduled");
      } catch (overdueError) {
        console.error("Failed to schedule overdue check:", overdueError);
      }
    }

    console.log(
      "Task created successfully with email scheduling:",
      savedTask._id
    );

    return NextResponse.json(
      {
        task: responseTask,
        message: "Task created successfully",
        aiSuggestions: {
          priority: finalPriority,
          category: finalCategory,
          aiProcessed,
        },
        emailScheduled,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      {
        error: "Failed to create task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
