import { useState } from "react";
import {
  Check,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  MoreVertical,
  Bell,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import type { Task } from "./TodoList";

const categoryIcons = {
  household: "🏠",
  kids: "👶",
  health: "🏥",
  work: "💼",
  personal: "✨",
  general: "📌",
} as const;


type TaskItemProps = {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const formatDate = (date: string | Date | undefined): string | null => {
    if (!date) return null;
    const now = new Date();
    const taskDate = new Date(date);
    const diffTime = taskDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;

    return taskDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        taskDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const isOverdue = (date?: string): boolean => {
    if (!date) return false;
    return new Date(date) < new Date() && !task.completed;
  };

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(task._id, !task.completed);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div
      className={`group bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
        task.completed
          ? "border-green-200 bg-green-50/30"
          : isOverdue(task.dueDate)
          ? "border-red-200 bg-red-50/20"
          : "border-pink-100 hover:border-pink-200 hover:bg-pink-50/50"
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={isCompleting}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-pink-300 hover:bg-pink-50/50"
            }`}
          >
            {isCompleting ? (
              <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : task.completed ? (
              <Check size={14} />
            ) : null}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Priority */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className={`font-semibold text-lg leading-tight ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {task.title}
                {task.aiSuggested && (
                  <Sparkles className="inline-block w-4 h-4 text-pink-400 ml-2" />
                )}
              </h3>

              <div className="flex items-center gap-2">
                <PriorityBadge priority={task.priority || 0} />

                {/* Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {showActions && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          onEdit(task);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(task._id);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p
                className={`text-sm mb-3 leading-relaxed ${
                  task.completed ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-3 text-xs">
              {/* Category */}
              {task.category && (
                <div className="flex items-center gap-1 text-gray-500">
                  <span>{categoryIcons[task.category] || "📌"}</span>
                  <span className="capitalize">{task.category}</span>
                </div>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <div
                  className={`flex items-center gap-1 ${
                    isOverdue(task.dueDate)
                      ? "text-red-600 font-medium"
                      : task.completed
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <Calendar size={12} />
                  <span>{formatDate(task.dueDate)}</span>
                  {isOverdue(task.dueDate) && (
                    <span className="text-red-500">⚠️</span>
                  )}
                </div>
              )}

              {/* Reminder */}
              {task.reminder && !task.completed && (
                <div className="flex items-center gap-1 text-amber-600">
                  <Bell size={12} />
                  <span>{formatDate(task.reminder)}</span>
                </div>
              )}

              {/* Recurring */}
              {task.recurring && (
                <div className="flex items-center gap-1 text-blue-500">
                  <RotateCcw size={12} />
                  <span>Recurring</span>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center gap-1 text-gray-400 ml-auto">
                <Clock size={12} />
                <span>
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar for Overdue Tasks */}
        {isOverdue(task.dueDate) && !task.completed && (
          <div className="mt-3 bg-red-100 rounded-full h-1">
            <div className="bg-red-400 h-1 rounded-full w-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Click outside to close actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}
