"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ja } from "@/lib/labels/ja";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: ja.nav.dashboard },
  { href: "/analytics", label: ja.nav.analytics },
  { href: "/projects", label: ja.nav.projects },
  { href: "/clients", label: ja.nav.clients },
  { href: "/tasks", label: ja.nav.tasks },
  { href: "/workflows", label: ja.nav.workflows },
  { href: "/artifacts", label: ja.nav.artifacts },
  { href: "/agents", label: ja.nav.agents },
  { href: "/approvals", label: ja.nav.approvals },
  { href: "/validation", label: ja.nav.validation },
  { href: "/settings", label: ja.nav.settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-card">
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ease-out",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-0.5 active:scale-[0.98]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">v1.0.0 完成版</p>
      </div>
    </aside>
  );
}
