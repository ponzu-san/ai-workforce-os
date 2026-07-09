"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { getStepColorClass } from "@/lib/workflow/pipelineView";
import type { PipelineStep } from "@/types/domain";

interface StageMiniPipelineProps {
  steps: PipelineStep[];
  currentOrder: number;
}

export function StageMiniPipeline({
  steps,
  currentOrder,
}: StageMiniPipelineProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentOrder]);

  return (
    <div className="flex min-w-0 scroll-px-4 items-center gap-1 overflow-x-auto scroll-smooth px-2 py-1">
      {steps.map((step, index) => (
        <div key={step.order} className="flex shrink-0 items-center">
          <div
            ref={step.order === currentOrder ? activeRef : undefined}
            className={cn(
              "flex min-w-[4.5rem] flex-col rounded-lg border px-2 py-1.5 text-center",
              step.order === currentOrder
                ? "border-amber-400 bg-amber-50 ring-1 ring-amber-200"
                : "border-neutral-200 bg-white",
              step.status === "wait" &&
                step.order !== currentOrder &&
                "opacity-60",
            )}
          >
            <span
              className={cn(
                "mx-auto mb-1 inline-block h-2 w-2 rounded-full",
                getStepColorClass(step.order),
              )}
            />
            <span className="font-mono text-[10px] text-neutral-500">
              {step.stepNumber}
            </span>
            <span className="truncate text-xs font-medium text-neutral-800">
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 ? (
            <div className="mx-1 h-px w-3 shrink-0 bg-neutral-200" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
