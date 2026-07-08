import { tStatus } from "@/lib/labels/ja";
import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  draft: "bg-neutral-200 text-neutral-900 ring-1 ring-neutral-300",
  active: "bg-emerald-100 text-emerald-950 ring-1 ring-emerald-300",
  completed: "bg-blue-100 text-blue-950 ring-1 ring-blue-300",
  archived: "bg-neutral-200 text-neutral-800 ring-1 ring-neutral-300",
  todo: "bg-neutral-100 text-neutral-900 ring-1 ring-neutral-200",
  running: "bg-amber-100 text-amber-950 ring-1 ring-amber-300",
  review: "bg-orange-100 text-orange-950 ring-1 ring-orange-300",
  done: "bg-emerald-100 text-emerald-950 ring-1 ring-emerald-300",
  blocked: "bg-red-100 text-red-950 ring-1 ring-red-300",
  pending: "bg-amber-100 text-amber-950 ring-1 ring-amber-300",
  approved: "bg-emerald-100 text-emerald-950 ring-1 ring-emerald-300",
  rejected: "bg-red-100 text-red-950 ring-1 ring-red-300",
  critical: "bg-red-100 text-red-950 ring-1 ring-red-300",
  high: "bg-orange-100 text-orange-950 ring-1 ring-orange-300",
  medium: "bg-amber-100 text-amber-950 ring-1 ring-amber-300",
  low: "bg-neutral-100 text-neutral-800 ring-1 ring-neutral-200",
  pass: "bg-emerald-100 text-emerald-950 ring-1 ring-emerald-300",
  fail: "bg-red-100 text-red-950 ring-1 ring-red-300",
  warn: "bg-amber-100 text-amber-950 ring-1 ring-amber-300",
  skip: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200",
  waiting_external:
    "bg-violet-100 text-violet-950 ring-1 ring-violet-300",
  waiting_approval:
    "bg-orange-100 text-orange-950 ring-1 ring-orange-300",
  production: "bg-indigo-100 text-indigo-950 ring-1 ring-indigo-300",
  internal_ai: "bg-sky-100 text-sky-950 ring-1 ring-sky-300",
  external_handoff: "bg-violet-100 text-violet-950 ring-1 ring-violet-300",
  human_handoff: "bg-pink-100 text-pink-950 ring-1 ring-pink-300",
  planning: "bg-violet-100 text-violet-950 ring-1 ring-violet-300",
  lead: "bg-purple-100 text-purple-950 ring-1 ring-purple-300",
  inactive: "bg-neutral-200 text-neutral-800 ring-1 ring-neutral-300",
  email: "bg-sky-100 text-sky-950 ring-1 ring-sky-300",
  meeting: "bg-indigo-100 text-indigo-950 ring-1 ring-indigo-300",
  phone: "bg-cyan-100 text-cyan-950 ring-1 ring-cyan-300",
  business: "bg-orange-100 text-orange-950 ring-1 ring-orange-300",
  development: "bg-blue-100 text-blue-950 ring-1 ring-blue-300",
  cancelled: "bg-neutral-200 text-neutral-800 ring-1 ring-neutral-300",
  failed: "bg-red-100 text-red-950 ring-1 ring-red-300",
};

interface StatusBadgeProps {
  value: string;
  className?: string;
}

export function StatusBadge({ value, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[value] ?? "bg-neutral-200 text-neutral-900 ring-1 ring-neutral-300",
        className,
      )}
    >
      {tStatus(value)}
    </span>
  );
}
