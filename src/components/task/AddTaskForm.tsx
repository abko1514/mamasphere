import { useState } from "react";
import {
  Calendar,
  Clock,
  Tag,
  Zap,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import { AIService } from "@/lib/utils/aiService"; // Make sure this import path is correct

interface TaskData {
  title: string;
  description?: string;
  priority?: number | null;
  category?: string;
  dueDate?: string | null;
  reminder?: string | null;
  recurring?: boolean;
}

interface AddTaskFormProps {
  onAddTask: (taskData: TaskData) => Promise<void>;
  loading?: boolean;
}

export default function AddTaskForm({
  onAddTask,
  loading = false,
}: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<TaskData>({
    title: "",
    description: "",
    priority: null,
    category: "",
    dueDate: "",
    reminder: "",
    recurring: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "household", label: "🏠 Household", color: "text-blue-600" },
    { value: "kids", label: "👶 Kids", color: "text-pink-600" },
    { value: "health", label: "🏥 Health", color: "text-green-600" },
    { value: "work", label: "💼 Work", color: "text-purple-600" },
    { value: "personal", label: "✨ Personal", color: "text-indigo-600" },
    { value: "general", label: "📌 General", color: "text-gray-600" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    setIsSubmitting(true);
    try {
      // Prepare the data
      let finalPriority = formData.priority;
      let finalCategory = formData.category;

      // If priority is null (AI suggestion selected), get AI prioritization
      if (finalPriority === null) {
        console.log("Getting AI prioritization...");
        finalPriority = await AIService.prioritizeTask(
          formData.title,
          formData.description || "",
          formData.dueDate
        );
        console.log("AI suggested priority:", finalPriority);
      }

      // If category is empty (auto-categorize selected), get AI categorization
      if (!finalCategory) {
        console.log("Getting AI categorization...");
        finalCategory = AIService.categorizeTask(
          formData.title,
          formData.description || ""
        );
        console.log("AI suggested category:", finalCategory);
      }

      // Clean the data before sending
      const cleanData: TaskData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        priority: finalPriority,
        category: finalCategory || undefined,
        dueDate: formData.dueDate || null,
        reminder: formData.reminder || null,
        recurring: formData.recurring || false,
      };

      console.log("AddTaskForm: Submitting task data:", cleanData);

      await onAddTask(cleanData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: null,
        category: "",
        dueDate: "",
        reminder: "",
        recurring: false,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("AddTaskForm: Failed to add task:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = <K extends keyof TaskData>(
    field: K,
    value: TaskData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: null,
      category: "",
      dueDate: "",
      reminder: "",
      recurring: false,
    });
  };

  if (!isOpen) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsOpen(true)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-500 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Plus size={20} />
          )}
          Add New Task
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Zap className="text-pink-500" size={20} />
          Create New Task
          <Sparkles className="text-purple-400 ml-auto" size={16} />
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Let our AI help prioritize and organize your task!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            required
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Add more details... (helps AI understand better)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Priority and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-pink-400" />
              Priority
            </label>
            <select
              value={formData.priority?.toString() || ""}
              onChange={(e) =>
                handleChange(
                  "priority",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              disabled={isSubmitting}
            >
              <option value="">🤖 Let AI Suggest Priority</option>
              <option value="1">1 - 📋 Low Priority</option>
              <option value="2">2 - 📝 Medium-Low</option>
              <option value="3">3 - ⚡ Medium</option>
              <option value="4">4 - 🔥 High Priority</option>
              <option value="5">5 - 🚨 Urgent</option>
            </select>
            {!formData.priority && (
              <p className="text-xs text-pink-600 mt-1 flex items-center gap-1">
                <Sparkles size={12} />
                AI will analyze your task and suggest the best priority
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag size={16} />
              Category
            </label>
            <select
              value={formData.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              disabled={isSubmitting}
            >
              <option value="">🤖 Auto-categorize</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {!formData.category && (
              <p className="text-xs text-blue-600 mt-1">
                AI will categorize based on your task description
              </p>
            )}
          </div>
        </div>

        {/* Due Date and Reminder Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Due Date
            </label>
            <input
              type="datetime-local"
              value={formData.dueDate || ""}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              disabled={isSubmitting}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Reminder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={16} />
              Reminder
            </label>
            <input
              type="datetime-local"
              value={formData.reminder || ""}
              onChange={(e) => handleChange("reminder", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              disabled={isSubmitting}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        {/* Recurring Task Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="recurring"
            checked={formData.recurring || false}
            onChange={(e) => handleChange("recurring", e.target.checked)}
            className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
            disabled={isSubmitting}
          />
          <label
            htmlFor="recurring"
            className="text-sm font-medium text-gray-700 flex items-center gap-2"
          >
            <span className="text-blue-500">🔄</span>
            Make this a recurring task
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={!formData.title?.trim() || isSubmitting}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating with AI...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Task
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
            disabled={isSubmitting}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
