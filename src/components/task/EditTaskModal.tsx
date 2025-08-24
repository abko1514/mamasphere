// ===== 8. Fix components/task/EditTaskModal.tsx =====
import { useState, useEffect } from "react";
import { X, Calendar, Bell, RotateCcw, Sparkles } from "lucide-react";
import type { Task } from "./TodoList";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, updatedTask: Partial<Task>) => Promise<void>;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: number;
  category: string;
  dueDate: string;
  reminder: string;
  recurring: boolean;
}

export default function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: 3,
    category: "general",
    dueDate: "",
    reminder: "",
    recurring: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || 3,
        category: task.category || "general",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        reminder: task.reminder
          ? new Date(task.reminder).toISOString().slice(0, 16)
          : "",
        recurring: task.recurring || false,
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSaving(true);
    try {
      const updatedTask: Partial<Task> = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        category: formData.category as Task["category"],
        dueDate: formData.dueDate || undefined,
        reminder: formData.reminder || undefined,
        recurring: formData.recurring,
      };

      await onSave(task._id, updatedTask);
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
      // Show user-friendly error message
      alert(
        "Failed to save changes. Please check your connection and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    {
      value: "household",
      label: "🏠 Household",
      color: "bg-orange-100 text-orange-700",
    },
    { value: "kids", label: "👶 Kids", color: "bg-yellow-100 text-yellow-700" },
    {
      value: "health",
      label: "🏥 Health",
      color: "bg-green-100 text-green-700",
    },
    { value: "work", label: "💼 Work", color: "bg-blue-100 text-blue-700" },
    {
      value: "personal",
      label: "✨ Personal",
      color: "bg-pink-100 text-pink-700",
    },
    {
      value: "general",
      label: "📌 General",
      color: "bg-gray-100 text-gray-700",
    },
  ];

  const priorityOptions = [
    { value: 5, label: "🚨 Urgent", color: "text-red-600" },
    { value: 4, label: "🔥 High", color: "text-orange-600" },
    { value: 3, label: "⚡ Medium", color: "text-yellow-600" },
    { value: 2, label: "📝 Medium-Low", color: "text-blue-600" },
    { value: 1, label: "📋 Low", color: "text-gray-600" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-800">Edit Task</h2>
              {task.aiSuggested && (
                <Sparkles className="w-5 h-5 text-pink-400" />
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="What needs to be done?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
              placeholder="Add more details..."
            />
          </div>

          {/* Priority and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Reminder */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Bell className="w-4 h-4" />
                Reminder
              </label>
              <input
                type="datetime-local"
                value={formData.reminder}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reminder: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recurring */}
          <div>
            <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.recurring}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    recurring: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
              />
              <RotateCcw className="w-4 h-4" />
              This is a recurring task
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || isSaving}
              className="flex-1 px-4 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
