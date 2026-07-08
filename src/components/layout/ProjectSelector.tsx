"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  clearActiveProjectAction,
  selectProjectAction,
} from "@/features/project/actions";
import { ja } from "@/lib/labels/ja";
import type {
  ActiveProjectSummary,
  ProjectOption,
} from "@/services/projectPipelineService";
import { cn } from "@/lib/utils";

interface ProjectSelectorProps {
  activeProject: ActiveProjectSummary | null;
  projectOptions: ProjectOption[];
}

export function ProjectSelector({
  activeProject,
  projectOptions,
}: ProjectSelectorProps) {
  const [open, setOpen] = useState(false);
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const label = activeProject?.name ?? ja.project.noActiveProject;

  useEffect(() => {
    setOpen(false);
    setPendingProjectId(null);
  }, [pathname]);

  function handleSelectProject(projectId: string) {
    setPendingProjectId(projectId);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("projectId", projectId);
      await selectProjectAction(formData);
    });
  }

  function handleClearActiveProject() {
    startTransition(async () => {
      await clearActiveProjectAction();
    });
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="max-w-xs justify-between gap-2 border-neutral-300 bg-white text-neutral-900"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={isPending}
      >
        <span className="truncate">
          {isPending && pendingProjectId
            ? ja.common.loading
            : isPending && !pendingProjectId
              ? ja.common.loading
              : label}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label={ja.common.cancel}
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 z-50 mt-2 w-80 rounded-lg border border-neutral-200 bg-white py-2 shadow-lg">
            <button
              type="button"
              disabled={isPending}
              className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
              onClick={handleClearActiveProject}
            >
              {isPending && !pendingProjectId
                ? ja.common.loading
                : ja.dashboard.title}
            </button>
            <div className="my-2 border-t border-neutral-100" />
            <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {ja.project.switchProject}
            </p>
            {projectOptions.length === 0 ? (
              <p className="px-4 py-2 text-sm text-neutral-500">
                {ja.project.noProjects}
              </p>
            ) : (
              projectOptions.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  disabled={isPending}
                  className={cn(
                    "flex w-full flex-col items-start px-4 py-2 text-left text-sm hover:bg-neutral-50 disabled:opacity-60",
                    activeProject?.id === project.id && "bg-amber-50",
                  )}
                  onClick={() => handleSelectProject(project.id)}
                >
                  <span className="font-medium text-neutral-900">
                    {pendingProjectId === project.id && isPending
                      ? ja.common.loading
                      : project.name}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {project.progressPercent}%
                    {project.currentStageLabel
                      ? ` · ${project.currentStageLabel}`
                      : ""}
                  </span>
                </button>
              ))
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
