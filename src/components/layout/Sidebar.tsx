"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { StageNav } from "@/components/layout/StageNav";
import { ja } from "@/lib/labels/ja";
import type { PipelineStep } from "@/types/domain";
import { cn } from "@/lib/utils";

const globalNavigationItems = [
  { href: "/clients", label: ja.nav.clients },
  { href: "/analytics", label: ja.nav.analytics },
  { href: "/validation", label: ja.nav.validation },
  { href: "/settings", label: ja.nav.settings },
] as const;

interface SidebarProps {
  activeProjectId?: string | null;
  activeProjectName?: string | null;
  activeProjectSteps?: PipelineStep[];
}

export function Sidebar({
  activeProjectId = null,
  activeProjectName = null,
  activeProjectSteps = [],
}: SidebarProps) {
  const pathname = usePathname();
  const isDashboardActive = pathname === "/";
  const showStageNav =
    activeProjectId && activeProjectName && activeProjectSteps.length > 0;

  return (
    <aside className="flex h-full w-60 flex-col border-r border-neutral-200 bg-white text-neutral-900">
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        <Link
          href="/"
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isDashboardActive
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          )}
        >
          {ja.nav.dashboard}
        </Link>

        {showStageNav ? (
          <StageNav
            projectId={activeProjectId}
            projectName={activeProjectName}
            steps={activeProjectSteps}
          />
        ) : null}

        <div
          className={cn(
            "flex flex-col gap-1",
            showStageNav ? "mt-4 border-t border-neutral-200 pt-4" : "mt-2",
          )}
        >
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {ja.project.globalSection}
          </p>
          {globalNavigationItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="border-t border-neutral-200 p-4">
        <p className="text-xs text-neutral-500">v1.0.0</p>
      </div>
    </aside>
  );
}
