"use client";

import { useMemo, useState } from "react";

import { SubmitButton } from "@/components/ui/submit-button";
import { updateProjectStageModesAction } from "@/features/project/actions";
import {
  applyDevMode,
  DEV_LINKED_STAGES,
  DEV_MODE_OPTIONS,
  devModeFieldName,
  inferDevMode,
  type DevMode,
} from "@/lib/workflow/devModeConfig";
import { displayStageName } from "@/lib/labels/stageNames";
import { ja } from "@/lib/labels/ja";
import {
  EXECUTION_MODE_DESCRIPTIONS,
  EXECUTION_MODE_LABELS,
  PRODUCTION_STAGES,
  stageModeFieldName,
  STAGE_ALLOWED_MODES,
} from "@/lib/workflow/stageModeConfig";
import type { StageExecutionMode } from "@/types/domain";
import type { ProductionStageName } from "@/ai/workflow/productionWorkflowTemplate";

const DEV_MODE_LABELS: Record<Exclude<DevMode, "custom" | "none">, string> = {
  internal_ai: ja.project.devModeInternal,
  external_handoff: ja.project.devModeExternal,
};

const NON_DEV_STAGE_NAMES = new Set<ProductionStageName>([
  "Sales",
  "Contract",
  "Requirement",
  "Design",
  "QA",
  "Legal",
  "Release",
]);

export interface ProjectStageModeItem {
  id: string;
  name: ProductionStageName;
  order: number;
  executionMode: StageExecutionMode;
  editable: boolean;
}

interface ProjectStageModeSettingsProps {
  projectId: string;
  stages: ProjectStageModeItem[];
}

function buildStageModeMap(
  stages: ProjectStageModeItem[],
): Record<ProductionStageName, StageExecutionMode> {
  return Object.fromEntries(
    stages.map((s) => [s.name, s.executionMode]),
  ) as Record<ProductionStageName, StageExecutionMode>;
}

export function ProjectStageModeSettings({
  projectId,
  stages,
}: ProjectStageModeSettingsProps) {
  const initialModes = useMemo(() => buildStageModeMap(stages), [stages]);
  const initialDevMode = useMemo(() => inferDevMode(initialModes), [initialModes]);

  const [devMode, setDevMode] = useState<Exclude<DevMode, "custom">>(
    initialDevMode === "custom" ? "internal_ai" : initialDevMode,
  );
  const [linkedModes, setLinkedModes] = useState(() => {
    if (initialDevMode === "custom") return initialModes;
    return applyDevMode(initialModes, initialDevMode) as Record<
      ProductionStageName,
      StageExecutionMode
    >;
  });

  const devStages = stages.filter((s) => DEV_LINKED_STAGES.includes(s.name));
  const otherStages = stages.filter((s) => NON_DEV_STAGE_NAMES.has(s.name));
  const devEditable = devStages.every((s) => s.editable);
  const isCustom = initialDevMode === "custom";

  function handleDevModeChange(next: Exclude<DevMode, "custom">) {
    setDevMode(next);
    setLinkedModes((prev) => applyDevMode(prev, next) as typeof prev);
  }

  return (
    <form action={updateProjectStageModesAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />

      <div className="rounded-md border p-3">
        <p className="text-sm font-medium">{ja.project.devModeLabel}</p>
        {isCustom ? (
          <p className="mt-1 text-xs text-amber-700">
            {ja.project.devModeCustomWarning}
          </p>
        ) : null}
        <select
          name={devModeFieldName()}
          value={devMode}
          disabled={!devEditable}
          onChange={(e) =>
            handleDevModeChange(
              e.target.value as Exclude<DevMode, "custom">,
            )
          }
          className="mt-2 w-full rounded-md border border-input px-3 py-2 text-sm disabled:bg-muted"
        >
          {DEV_MODE_OPTIONS.map((mode) => (
            <option key={mode} value={mode}>
              {mode === "none"
                ? ja.project.devModeNone
                : mode === "internal_ai"
                  ? DEV_MODE_LABELS.internal_ai
                  : DEV_MODE_LABELS.external_handoff}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          {ja.project.devModeHint}
        </p>
        <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
          {DEV_LINKED_STAGES.map((stageName) => (
            <li key={stageName}>
              {displayStageName(stageName)}:{" "}
              {EXECUTION_MODE_LABELS[linkedModes[stageName]]}
            </li>
          ))}
        </ul>
        {!devEditable ? (
          <span className="mt-2 block text-xs text-amber-700">
            {ja.project.stageModeLocked}
          </span>
        ) : null}
      </div>

      {DEV_LINKED_STAGES.map((stageName) => {
        const stage = PRODUCTION_STAGES.find((s) => s.name === stageName);
        if (!stage) return null;
        return (
          <input
            key={stageName}
            type="hidden"
            name={stageModeFieldName(stage.order)}
            value={linkedModes[stageName]}
          />
        );
      })}

      {otherStages.map((stage) => {
        const allowed = STAGE_ALLOWED_MODES[stage.name];
        const isLocked = !stage.editable || allowed.length === 1;

        return (
          <div key={stage.id} className="rounded-md border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">
                {String(stage.order + 1).padStart(2, "0")}{" "}
                {displayStageName(stage.name)}
              </p>
              {!stage.editable ? (
                <span className="text-xs text-amber-700">
                  {ja.project.stageModeLocked}
                </span>
              ) : null}
            </div>

            <select
              name={stageModeFieldName(stage.order)}
              defaultValue={stage.executionMode}
              disabled={isLocked}
              className="mt-2 w-full rounded-md border border-input px-3 py-2 text-sm disabled:bg-muted"
            >
              {allowed.map((mode) => (
                <option key={mode} value={mode}>
                  {EXECUTION_MODE_LABELS[mode]}
                </option>
              ))}
            </select>

            <p className="mt-1 text-xs text-muted-foreground">
              {EXECUTION_MODE_DESCRIPTIONS[stage.executionMode]}
            </p>
          </div>
        );
      })}

      <SubmitButton label={ja.project.stageModeSave} />
    </form>
  );
}
