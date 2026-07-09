"use client";

import { Check, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ja } from "@/lib/labels/ja";
import type { PipelineStep } from "@/types/domain";
import { cn } from "@/lib/utils";

interface StageNavProps {
  projectId: string;
  projectName: string;
  steps: PipelineStep[];
  currentStageOrder?: number | null;
}

function stepStatusLabel(status: PipelineStep["status"]): string {
  if (status === "done") return ja.dashboard.stepDone;
  if (status === "run") return ja.dashboard.stepRun;
  if (status === "skip") return ja.dashboard.stepSkip;
  return ja.dashboard.stepWait;
}

export function StageNav({
  projectId,
  projectName,
  steps,
  currentStageOrder = null,
}: StageNavProps) {
  const pathname = usePathname();
  const runStep = steps.find((step) => step.status === "run");
  const workspaceOrder =
    currentStageOrder ?? runStep?.order ?? steps[0]?.order ?? 0;
  const workspaceHref = `/p/${projectId}/stages/${workspaceOrder}`;
  const settingsHref = `/projects/${projectId}`;
  const isWorkspaceActive =
    pathname.startsWith(`/p/${projectId}/stages/`) &&
    !pathname.startsWith(settingsHref);
  const isSettingsActive = pathname === settingsHref;

  return (
    <div className="mt-4 border-t border-neutral-200 pt-4">
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {ja.project.thisProject}
      </p>
      <p className="truncate px-3 pb-2 text-sm font-medium text-neutral-900">
        {projectName}
      </p>
      <div className="mb-2 flex flex-col gap-0.5">
        <Link
          href={workspaceHref}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isWorkspaceActive
              ? "bg-amber-50 text-neutral-900 ring-1 ring-amber-200"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          )}
        >
          {ja.project.openWorkspace}
        </Link>
        <Link
          href={settingsHref}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isSettingsActive
              ? "bg-amber-50 text-neutral-900 ring-1 ring-amber-200"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          )}
        >
          {ja.project.openSettings}
        </Link>
      </div>
      <div className="flex flex-col gap-0.5">
        {steps.map((step) => {
          const href = `/p/${projectId}/stages/${step.order}`;
          const isActive = pathname === href;

          return (
            <Link
              key={step.order}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-amber-50 font-medium text-neutral-900 ring-1 ring-amber-200"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                step.status === "wait" && !isActive && "text-neutral-500",
                step.status === "skip" && !isActive && "text-neutral-500",
              )}
            >
              <span className="w-7 shrink-0 font-mono text-xs tabular-nums">
                {step.stepNumber}
              </span>
              <span className="min-w-0 flex-1 truncate">{step.name}</span>
              {step.status === "done" ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
              ) : null}
              {step.status === "run" ? (
                <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                  {stepStatusLabel(step.status)}
                </span>
              ) : null}
              {step.status === "wait" ? (
                <Lock className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
              ) : null}
              {step.status === "skip" ? (
                <span className="shrink-0 rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-bold text-neutral-600">
                  {stepStatusLabel(step.status)}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
