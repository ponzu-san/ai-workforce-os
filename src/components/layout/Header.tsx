import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { ProjectSelector } from "@/components/layout/ProjectSelector";
import { SecretaryConsultButton } from "@/components/layout/SecretaryAssistant";
import { Button } from "@/components/ui/button";
import { ja } from "@/lib/labels/ja";
import type {
  ActiveProjectSummary,
  ProjectOption,
} from "@/services/projectPipelineService";

interface HeaderProps {
  workspaceName: string;
  unreadNotifications?: number;
  activeProject?: ActiveProjectSummary | null;
  projectOptions?: ProjectOption[];
}

export function Header({
  workspaceName,
  unreadNotifications = 0,
  activeProject = null,
  projectOptions = [],
}: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6 text-neutral-900">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-sm font-bold text-white">
            AW
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-neutral-900">
              AI Workforce OS
            </p>
            <p className="text-xs text-neutral-500">{workspaceName}</p>
          </div>
        </div>
        <ProjectSelector
          activeProject={activeProject}
          projectOptions={projectOptions}
        />
      </div>

      <div className="flex items-center gap-2">
        <SecretaryConsultButton />
        <Button variant="ghost" size="icon" aria-label={ja.a11y.search}>
          <Search aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={ja.a11y.notifications}
          className="relative"
          asChild
        >
          <Link href="/">
            <Bell aria-hidden="true" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </Link>
        </Button>
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-700">
          U
        </div>
      </div>
    </header>
  );
}
