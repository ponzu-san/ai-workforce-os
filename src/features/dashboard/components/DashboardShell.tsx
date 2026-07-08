import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="dashboard-popline rounded-3xl bg-neutral-50 p-4 text-neutral-900 [color-scheme:light]">
      {children}
    </div>
  );
}
