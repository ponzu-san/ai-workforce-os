"use client";

import { useMemo, useState } from "react";

import { SubmitButton } from "@/components/ui/submit-button";
import {
  DEFAULT_PROJECT_TEMPLATE,
  PROJECT_TEMPLATE_DESCRIPTIONS,
  PROJECT_TEMPLATE_LABELS,
  resolveStageModes,
} from "@/ai/workflow/productionTemplates";
import { createProjectAction } from "@/features/project/actions";
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
import type { ProjectTemplate, StageExecutionMode } from "@/types/domain";
import type { ProductionStageName } from "@/ai/workflow/productionWorkflowTemplate";

const TEMPLATE_OPTIONS: ProjectTemplate[] = [
  "lp_static",
  "corporate",
  "design_only",
  "custom_blank",
];

const ADVANCED_STAGE_NAMES = new Set<ProductionStageName>([
  "Sales",
  "Contract",
  "Requirement",
  "Design",
  "QA",
  "Release",
]);

const DEV_MODE_LABELS: Record<Exclude<DevMode, "custom" | "none">, string> = {
  internal_ai: ja.project.devModeInternal,
  external_handoff: ja.project.devModeExternal,
};

interface ClientOption {
  id: string;
  label: string;
}

interface ProjectCreateFormProps {
  clients: ClientOption[];
  defaultClientId?: string;
  hiddenClientId?: string;
  defaultName?: string;
}

function buildModesForTemplate(
  template: ProjectTemplate,
): Record<ProductionStageName, StageExecutionMode> {
  return resolveStageModes(template);
}

export function ProjectCreateForm({
  clients,
  defaultClientId,
  hiddenClientId,
  defaultName,
}: ProjectCreateFormProps) {
  const [template, setTemplate] = useState<ProjectTemplate>(
    DEFAULT_PROJECT_TEMPLATE,
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [stageModes, setStageModes] = useState(() =>
    buildModesForTemplate(DEFAULT_PROJECT_TEMPLATE),
  );
  const [devMode, setDevMode] = useState<Exclude<DevMode, "custom">>(() => {
    const inferred = inferDevMode(buildModesForTemplate(DEFAULT_PROJECT_TEMPLATE));
    return inferred === "custom" ? "external_handoff" : inferred;
  });

  const templatePresets = useMemo(
    () =>
      Object.fromEntries(
        TEMPLATE_OPTIONS.map((key) => [key, buildModesForTemplate(key)]),
      ) as Record<ProjectTemplate, Record<ProductionStageName, StageExecutionMode>>,
    [],
  );

  const showDevMode = template !== "design_only";

  function applyDevModeToState(
    nextDevMode: Exclude<DevMode, "custom">,
    base: Record<ProductionStageName, StageExecutionMode>,
  ) {
    return applyDevMode(base, nextDevMode) as Record<
      ProductionStageName,
      StageExecutionMode
    >;
  }

  function handleTemplateChange(next: ProjectTemplate) {
    setTemplate(next);
    const preset = { ...templatePresets[next] };
    const inferred = inferDevMode(preset);
    const nextDevMode =
      inferred === "custom"
        ? next === "corporate"
          ? "internal_ai"
          : next === "design_only"
            ? "none"
            : "external_handoff"
        : inferred;
    setDevMode(nextDevMode);
    setStageModes(applyDevModeToState(nextDevMode, preset));
  }

  function handleDevModeChange(next: Exclude<DevMode, "custom">) {
    setDevMode(next);
    setStageModes((prev) => applyDevModeToState(next, prev));
  }

  function handleModeChange(
    stageName: ProductionStageName,
    mode: StageExecutionMode,
  ) {
    setStageModes((prev) => ({ ...prev, [stageName]: mode }));
  }

  return (
    <form action={createProjectAction} className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground">
          {ja.project.templateLabel}
        </label>
        <select
          name="template"
          value={template}
          onChange={(e) =>
            handleTemplateChange(e.target.value as ProjectTemplate)
          }
          className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
        >
          {TEMPLATE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {PROJECT_TEMPLATE_LABELS[option]} —{" "}
              {PROJECT_TEMPLATE_DESCRIPTIONS[option]}
            </option>
          ))}
        </select>
      </div>

      {showDevMode ? (
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            {ja.project.devModeLabel}
          </label>
          <select
            name={devModeFieldName()}
            value={devMode}
            onChange={(e) =>
              handleDevModeChange(
                e.target.value as Exclude<DevMode, "custom">,
              )
            }
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
          >
            {DEV_MODE_OPTIONS.filter(
              (m): m is Exclude<DevMode, "custom" | "none"> => m !== "none",
            ).map((mode) => (
              <option key={mode} value={mode}>
                {DEV_MODE_LABELS[mode]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            {ja.project.devModeHint}
          </p>
          <div className="mt-2 rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">
              {ja.project.devModeLinkedPreview}
            </p>
            <ul className="mt-1 space-y-0.5">
              {DEV_LINKED_STAGES.map((stageName) => (
                <li key={stageName}>
                  {displayStageName(stageName)}:{" "}
                  {EXECUTION_MODE_LABELS[stageModes[stageName]]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <input type="hidden" name={devModeFieldName()} value="none" />
      )}

      {DEV_LINKED_STAGES.map((stageName) => {
        const stage = PRODUCTION_STAGES.find((s) => s.name === stageName);
        if (!stage) return null;
        return (
          <input
            key={stageName}
            type="hidden"
            name={stageModeFieldName(stage.order)}
            value={stageModes[stageName]}
          />
        );
      })}

      <input
        name="name"
        placeholder={ja.project.namePlaceholder}
        required
        defaultValue={defaultName}
        className="w-full rounded-md border border-input px-3 py-2 text-sm"
      />
      <textarea
        name="description"
        placeholder={ja.project.descPlaceholder}
        className="min-h-20 w-full rounded-md border border-input px-3 py-2 text-sm"
      />

      {hiddenClientId ? (
        <input type="hidden" name="client_id" value={hiddenClientId} />
      ) : clients.length > 0 ? (
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            {ja.nav.clients}（任意）
          </label>
          <select
            name="client_id"
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            defaultValue={defaultClientId ?? ""}
          >
            <option value="">—</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <details
        open={showAdvanced}
        onToggle={(e) => setShowAdvanced(e.currentTarget.open)}
        className="rounded-md border border-input"
      >
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
          {ja.project.stageModeAdvanced}
        </summary>
        <div className="space-y-3 border-t px-3 py-3">
          <p className="text-xs text-muted-foreground">
            {ja.project.stageModeAdvancedHint}
          </p>
          {PRODUCTION_STAGES.filter((stage) =>
            ADVANCED_STAGE_NAMES.has(stage.name),
          ).map((stage) => {
            const allowed = STAGE_ALLOWED_MODES[stage.name];
            const current = stageModes[stage.name];
            const isLocked = allowed.length === 1;

            return (
              <div
                key={stage.name}
                className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:items-center"
              >
                <label className="text-xs font-medium">
                  {displayStageName(stage.name)}
                </label>
                <select
                  name={stageModeFieldName(stage.order)}
                  value={current}
                  disabled={isLocked}
                  onChange={(e) =>
                    handleModeChange(
                      stage.name,
                      e.target.value as StageExecutionMode,
                    )
                  }
                  className="w-full rounded-md border border-input px-2 py-1.5 text-sm disabled:bg-muted"
                >
                  {allowed.map((mode) => (
                    <option key={mode} value={mode}>
                      {EXECUTION_MODE_LABELS[mode]}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  {EXECUTION_MODE_DESCRIPTIONS[current]}
                </p>
              </div>
            );
          })}
        </div>
      </details>

      <SubmitButton label={ja.common.create} />
    </form>
  );
}
