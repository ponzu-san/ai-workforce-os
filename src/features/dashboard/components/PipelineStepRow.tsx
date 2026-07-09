"use client";

import { useEffect, useRef } from "react";

import { ja } from "@/lib/labels/ja";
import { getStepColorClass } from "@/lib/workflow/pipelineView";
import type { PipelineStep } from "@/types/domain";
import { cn } from "@/lib/utils";

interface PipelineStepRowProps {
  steps: PipelineStep[];
}

function stepBadgeLabel(status: PipelineStep["status"]): string {
  if (status === "done") return ja.dashboard.stepDone;
  if (status === "run") return ja.dashboard.stepRun;
  return ja.dashboard.stepWait;
}

export function PipelineStepRow({ steps }: PipelineStepRowProps) {
  const activeRef = useRef<HTMLDivElement>(null);
  const runOrder = steps.find((step) => step.status === "run")?.order ?? null;

  useEffect(() => {
    if (runOrder === null) return;
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [runOrder]);

  return (
    <div className="flex min-w-max gap-3">
      {steps.map((step) => (
        <div
          key={step.order}
          ref={step.status === "run" ? activeRef : undefined}
          className={cn(
            "relative flex w-28 shrink-0 flex-col rounded-2xl border-2 border-black p-3 text-neutral-900 shadow-[3px_3px_0_0_#000]",
            getStepColorClass(step.order),
            step.status === "run" && "z-10 ring-2 ring-pink-500",
            step.status === "wait" && "opacity-50 grayscale",
            step.status === "done" && "opacity-90",
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-1">
            <span className="text-lg font-black text-neutral-900">
              {step.stepNumber}
            </span>
            <span className="rounded-full border border-black bg-white px-2 py-0.5 text-[10px] font-bold text-neutral-900">
              {stepBadgeLabel(step.status)}
            </span>
          </div>
          <p className="text-sm font-bold leading-tight text-neutral-900">
            {step.name}
          </p>
        </div>
      ))}
    </div>
  );
}
