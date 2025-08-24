// ===== 9. Fix components/task/TodoList.tsx =====
import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  Calendar,
  TrendingUp,
  Loader2,
} from "lucide-react";
import TaskItem from "./TaskItem";
import AddTaskForm from "./AddTaskForm";
import EditTaskModal from "./EditTaskModal";

export type Task = {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: number;
  dueDate?: string;
  createdAt: string;
  category?: "household" | "kids" | "health" | "work" | "personal" | "general";
  reminder?: string;
  recurring?: boolean;
  aiSuggested?: boolean;
};

interface TaskData {
  title: string;
  description?: string;
  priority?: number | null;
  category?: string;
  dueDate?: string | null;
  reminder?: string | null;
  recurring?: boolean;
}

type TodoListProps = {
  tasks: Task[];
  loading: boolean;
  error?: string;
  onAddTask: (task: TaskData) => Promise<void>;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
};

export default function TodoList({
  tasks,
  loading,
  error,
  onAddTask,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
}: TodoListProps) {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({
    status: "all", // all, pending, completed
    priority: "all", // all, 1, 2, 3, 4, 5
    category: "all", // all, household, kids, etc.
    search: "",
  });
  const [sortBy, setSortBy] = useState("priority"); // priority, dueDate, createdAt
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter and sort tasks
  useEffect(() => {
    let filtered = [...tasks];

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((task) =>
        filters.status === "completed" ? task.completed : !task.completed
      );
    }

    // Apply priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter(
        (task) => task.priority === parseInt(filters.priority)
      );
    }

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((task) => task.category === filters.category);
    }

    // Apply search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; // Completed tasks go to bottom
          }
          const aPriority = a.priority ?? 0;
          const bPriority = b.priority ?? 0;
          return bPriority - aPriority; // Higher priority first

        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, filters, sortBy]);

  const handleUpdateTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      // Call the parent's update function with just the updates
      await onUpdateTask({
        _id: taskId,
        ...updatedTask,
      } as Task);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to save task:", error);
      // Show user-friendly error message
      alert("Failed to save changes. Please try again.");
    }
  };

  // Get task statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length,
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "household", label: "🏠 Household" },
    { value: "kids", label: "👶 Kids" },
    { value: "health", label: "🏥 Health" },
    { value: "work", label: "💼 Work" },
    { value: "personal", label: "✨ Personal" },
    { value: "general", label: "📌 General" },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Oops! Something went wrong
        </div>
        <div className="text-red-500 text-sm">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 My Tasks</h1>
        <p className="text-gray-600">
          Stay organized and get things done, mama! 💪
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Circle className="text-gray-400" size={16} />
            <span className="text-sm text-gray-500 font-medium">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="text-green-500" size={16} />
            <span className="text-sm text-gray-500 font-medium">Done</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {stats.completed}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-blue-500" size={16} />
            <span className="text-sm text-gray-500 font-medium">Pending</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.pending}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="text-red-500" size={16} />
            <span className="text-sm text-gray-500 font-medium">Overdue</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        </div>
      </div>

      {/* Add Task Form */}
      <AddTaskForm onAddTask={onAddTask} loading={loading} />

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="5">🚨 Urgent</option>
              <option value="4">🔥 High</option>
              <option value="3">⚡ Medium</option>
              <option value="2">📝 Medium-Low</option>
              <option value="1">📋 Low</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            >
              <option value="priority">Sort by Priority</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="createdAt">Sort by Created Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-pink-500" size={32} />
          <span className="ml-3 text-gray-600">Loading your tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          {tasks.length === 0 ? (
            <div className="bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100 rounded-xl p-8 border border-pink-100">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Ready to conquer the day?
              </h3>
              <p className="text-gray-600 mb-4">
                Add your first task and let our AI help prioritize your busy mom
                life!
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No tasks match your filters
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={async (id, completed) => {
                await Promise.resolve(onToggleComplete(id, completed));
              }}
              onEdit={handleUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {filteredTasks.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      )}
      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
