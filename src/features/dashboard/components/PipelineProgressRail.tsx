import { getStepColorClass } from "@/lib/workflow/pipelineView";
import type { PipelineStep } from "@/types/domain";
import { cn } from "@/lib/utils";

interface PipelineProgressRailProps {
  steps: PipelineStep[];
  progressPercent: number;
}

export function PipelineProgressRail({
  steps,
  progressPercent,
}: PipelineProgressRailProps) {
  return (
    <div className="space-y-2 text-neutral-900">
      <div className="h-4 overflow-hidden rounded-full border-2 border-black bg-white">
        <div className="flex h-full w-full">
          {steps.map((step) => (
            <div
              key={step.order}
              className={cn(
                "h-full flex-1 border-r border-black/20 last:border-r-0",
                getStepColorClass(step.order),
                step.status === "wait" && "opacity-30",
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between text-xs font-bold text-neutral-600">
        <span>0%</span>
        <span>{progressPercent}%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
