import {
  PRODUCTION_STAGE_NAMES,
  type ProductionStageName,
} from "@/ai/workflow/productionWorkflowTemplate";
import type { StageExecutionMode } from "@/types/domain";

export type DevMode = "internal_ai" | "external_handoff" | "none" | "custom";

export const DEV_MODE_FIELD = "dev_mode";

export const DEV_LINKED_STAGES: ProductionStageName[] = [
  PRODUCTION_STAGE_NAMES.FRONTEND,
  PRODUCTION_STAGE_NAMES.BACKEND,
  PRODUCTION_STAGE_NAMES.EXTERNAL_DEV,
  PRODUCTION_STAGE_NAMES.INFRA,
];

export const DEV_MODE_OPTIONS: DevMode[] = [
  "internal_ai",
  "external_handoff",
  "none",
];

export function devModeFieldName(): string {
  return DEV_MODE_FIELD;
}

export type SelectableDevMode = Exclude<DevMode, "custom">;

export function isDevMode(value: string): value is SelectableDevMode {
  return DEV_MODE_OPTIONS.includes(value as SelectableDevMode);
}

export function applyDevMode(
  modes: Partial<Record<ProductionStageName, StageExecutionMode>>,
  devMode: Exclude<DevMode, "custom">,
): Partial<Record<ProductionStageName, StageExecutionMode>> {
  const next = { ...modes };

  if (devMode === "internal_ai") {
    next[PRODUCTION_STAGE_NAMES.FRONTEND] = "internal_ai";
    next[PRODUCTION_STAGE_NAMES.BACKEND] = "internal_ai";
    next[PRODUCTION_STAGE_NAMES.EXTERNAL_DEV] = "skip";
    next[PRODUCTION_STAGE_NAMES.INFRA] = "internal_ai";
    return next;
  }

  if (devMode === "external_handoff") {
    next[PRODUCTION_STAGE_NAMES.FRONTEND] = "skip";
    next[PRODUCTION_STAGE_NAMES.BACKEND] = "skip";
    next[PRODUCTION_STAGE_NAMES.EXTERNAL_DEV] = "external_handoff";
    next[PRODUCTION_STAGE_NAMES.INFRA] = "skip";
    return next;
  }

  next[PRODUCTION_STAGE_NAMES.FRONTEND] = "skip";
  next[PRODUCTION_STAGE_NAMES.BACKEND] = "skip";
  next[PRODUCTION_STAGE_NAMES.EXTERNAL_DEV] = "skip";
  next[PRODUCTION_STAGE_NAMES.INFRA] = "skip";
  return next;
}

export function inferDevMode(
  modes: Partial<Record<ProductionStageName, StageExecutionMode>>,
): DevMode {
  const fe = modes[PRODUCTION_STAGE_NAMES.FRONTEND];
  const be = modes[PRODUCTION_STAGE_NAMES.BACKEND];
  const ext = modes[PRODUCTION_STAGE_NAMES.EXTERNAL_DEV];
  const infra = modes[PRODUCTION_STAGE_NAMES.INFRA];

  if (
    fe === "internal_ai" &&
    be === "internal_ai" &&
    ext === "skip" &&
    infra === "internal_ai"
  ) {
    return "internal_ai";
  }

  if (
    fe === "skip" &&
    be === "skip" &&
    ext === "external_handoff" &&
    infra === "skip"
  ) {
    return "external_handoff";
  }

  if (fe === "skip" && be === "skip" && ext === "skip" && infra === "skip") {
    return "none";
  }

  return "custom";
}

export function parseDevModeFromForm(
  formData: FormData,
): SelectableDevMode | null {
  const value = formData.get(DEV_MODE_FIELD);
  if (typeof value !== "string" || !isDevMode(value)) {
    return null;
  }
  return value;
}
