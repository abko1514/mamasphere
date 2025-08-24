import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";

interface Params {
  id: string;
}

// Task Schema (should match the one in your main tasks route)
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

export async function PUT(
  request: Request,
  { params }: { params: Params }
): Promise<Response> {
  try {
    await dbConnect();

    const { id } = params;
    const updates = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // Prepare updates with timestamp
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    // Convert dueDate to Date object if it exists
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    const result = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Task updated successfully",
      task: {
        ...result.toObject(),
        _id: result._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      {
        error: "Failed to update task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Params }
): Promise<Response> {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const result = await Task.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      {
        error: "Failed to delete task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
