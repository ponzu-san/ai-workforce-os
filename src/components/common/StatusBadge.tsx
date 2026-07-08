import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  archived: "bg-muted text-muted-foreground",
  todo: "bg-muted text-muted-foreground",
  running: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  review: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  done: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  blocked: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  pending: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-muted text-muted-foreground",
  pass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  fail: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  warn: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  skip: "bg-muted text-muted-foreground",
  waiting_approval:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  planning: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  lead: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  inactive: "bg-muted text-muted-foreground",
  email: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  meeting: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  phone: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  business: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  development: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

interface StatusBadgeProps {
  value: string;
  className?: string;
}

export function StatusBadge({ value, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        variants[value] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {value}
    </span>
  );
}
