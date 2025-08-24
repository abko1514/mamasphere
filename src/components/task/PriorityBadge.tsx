type PriorityConfig = {
  label: string;
  color: string;
  icon: string;
};

const priorityConfig: Record<number, PriorityConfig> = {
  1: {
    label: "Low",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "📋",
  },
  2: {
    label: "Medium-Low",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "📝",
  },
  3: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "⚡",
  },
  4: {
    label: "High",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "🔥",
  },
  5: {
    label: "Urgent",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "🚨",
  },
};

interface PriorityBadgeProps {
  priority: number;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export default function PriorityBadge({
  priority,
  showIcon = true,
  size = "sm",
}: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig[3];
  const sizeClasses =
    size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.color} ${sizeClasses}`}
    >
      {showIcon && <span className="text-xs">{config.icon}</span>}
      {config.label}
    </span>
  );
}
