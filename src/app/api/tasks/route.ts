import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Add this interface for better type checking
interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string | null;
  priority?: number | null;
  category?: string;
  reminder?: string | null;
  recurring?: boolean;
}

// Task Schema - Make sure this matches your existing schema
const taskSchema = new mongoose.Schema({
  userId: {
    type: String, // Changed from ObjectId to String to match email-based user system
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date, default: null },
  reminder: { type: Date, default: null },
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
    console.log("=== GET /api/tasks START ===");

    // Get authenticated user
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.email) {
      console.log("No session or email found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected");

    const { searchParams } = new URL(request.url);
    const completed = searchParams.get("completed");

    console.log("Fetching tasks for user:", session.user.email);

    const filter: Record<string, unknown> = { userId: session.user.email };
    if (completed !== null) {
      filter.completed = completed === "true";
    }

    console.log("Filter:", filter);

    const tasks = await Task.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    console.log(`Found ${tasks.length} tasks`);

    const transformedTasks = tasks.map((task) => ({
      ...task,
      _id: (task._id as mongoose.Types.ObjectId).toString(),
    }));

    console.log("=== GET /api/tasks END ===");

    return NextResponse.json({
      tasks: transformedTasks,
      message: `Found ${transformedTasks.length} tasks`,
    });
  } catch (error) {
    console.error("=== ERROR in GET /api/tasks ===");
    console.error("Error details:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );

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
    console.log("=== POST /api/tasks START ===");

    // Get authenticated user
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.email) {
      console.log("No session or email found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected");

    let taskData: CreateTaskRequest;
    try {
      taskData = await request.json();
      console.log("Received task data:", taskData);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!taskData.title?.trim()) {
      console.log("Missing or empty title");
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const finalPriority = taskData.priority || 3;
    const finalCategory = taskData.category || "general";
    const aiProcessed = false;

    // Skip AI services for now to isolate the issue
    console.log(
      "Using provided/default values - Priority:",
      finalPriority,
      "Category:",
      finalCategory
    );

    // Build new task data
    const newTaskData = {
      userId: session.user.email,
      title: taskData.title.trim(),
      description: (taskData.description || "").trim(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      reminder: taskData.reminder ? new Date(taskData.reminder) : null,
      priority: finalPriority,
      aiSuggested: aiProcessed,
      category: finalCategory,
      completed: false,
      recurring: taskData.recurring || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Final task data to save:", newTaskData);

    // Validate dates
    if (newTaskData.dueDate && isNaN(newTaskData.dueDate.getTime())) {
      console.error("Invalid dueDate:", taskData.dueDate);
      return NextResponse.json(
        { error: "Invalid due date format" },
        { status: 400 }
      );
    }

    if (newTaskData.reminder && isNaN(newTaskData.reminder.getTime())) {
      console.error("Invalid reminder:", taskData.reminder);
      return NextResponse.json(
        { error: "Invalid reminder date format" },
        { status: 400 }
      );
    }

    console.log("Creating new task...");
    const newTask = new Task(newTaskData);

    console.log("Saving task...");
    const savedTask = await newTask.save();
    console.log("Task saved with ID:", savedTask._id);

    const responseTask = {
      ...savedTask.toObject(),
      _id: savedTask._id.toString(),
    };

    console.log("=== POST /api/tasks SUCCESS ===");

    return NextResponse.json(
      {
        task: responseTask,
        message: "Task created successfully",
        aiSuggestions: {
          priority: finalPriority,
          category: finalCategory,
          aiProcessed,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== ERROR in POST /api/tasks ===");
    console.error("Error details:", error);
    console.error(
      "Error name:",
      error instanceof Error ? error.name : "Unknown"
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );

    // Check for specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes("validation failed")) {
        console.error("Validation error - check required fields");
      }
      if (error.message.includes("duplicate key")) {
        console.error("Duplicate key error");
      }
      if (error.message.includes("Cast to")) {
        console.error("Type casting error - check data types");
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create task",
        details: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.name : "Unknown",
      },
      { status: 500 }
    );
  }
}
