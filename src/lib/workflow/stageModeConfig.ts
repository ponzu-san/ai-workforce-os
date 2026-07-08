import {
  PRODUCTION_WORKFLOW,
  type ProductionStageName,
} from "@/ai/workflow/productionWorkflowTemplate";
import {
  applyDevMode,
  parseDevModeFromForm,
} from "@/lib/workflow/devModeConfig";
import type { StageExecutionMode } from "@/types/domain";

export const EXECUTION_MODE_OPTIONS: StageExecutionMode[] = [
  "internal_ai",
  "external_handoff",
  "human_handoff",
  "skip",
];

/** 工程ごとに選択可能な実行モード */
export const STAGE_ALLOWED_MODES: Record<
  ProductionStageName,
  StageExecutionMode[]
> = {
  Sales: ["internal_ai", "external_handoff", "skip"],
  Contract: ["internal_ai", "external_handoff", "skip"],
  Requirement: ["internal_ai", "external_handoff", "skip"],
  Design: ["internal_ai", "external_handoff", "human_handoff"],
  Frontend: ["internal_ai", "external_handoff", "skip"],
  Backend: ["internal_ai", "external_handoff", "skip"],
  "External Dev": ["internal_ai", "external_handoff", "skip"],
  Infra: ["internal_ai", "external_handoff", "skip"],
  QA: ["internal_ai", "external_handoff"],
  Legal: ["internal_ai"],
  Release: ["internal_ai", "external_handoff", "skip"],
};

export const EXECUTION_MODE_LABELS: Record<StageExecutionMode, string> = {
  internal_ai: "AI内製",
  external_handoff: "外部ツール",
  human_handoff: "人間デザイナー",
  skip: "スキップ",
};

export const EXECUTION_MODE_DESCRIPTIONS: Record<StageExecutionMode, string> = {
  internal_ai: "このサービス内の LLM で成果物を生成",
  external_handoff:
    "Figma / v0 / Cursor / ChatGPT 等で作業し URL・ファイルを登録",
  human_handoff: "友人デザイナー向けの設計書を生成し成果物を登録",
  skip: "工程を自動スキップ（記録のみ）",
};

export const PRODUCTION_STAGES = PRODUCTION_WORKFLOW.stages;

export function isStageExecutionMode(value: string): value is StageExecutionMode {
  return EXECUTION_MODE_OPTIONS.includes(value as StageExecutionMode);
}

export function stageModeFieldName(order: number): string {
  return `stage_mode_${order}`;
}

export function parseStageModesFromForm(
  formData: FormData,
): Partial<Record<ProductionStageName, StageExecutionMode>> {
  const modes: Partial<Record<ProductionStageName, StageExecutionMode>> = {};

  for (const stage of PRODUCTION_STAGES) {
    const value = formData.get(stageModeFieldName(stage.order));
    if (typeof value === "string" && isStageExecutionMode(value)) {
      if (STAGE_ALLOWED_MODES[stage.name].includes(value)) {
        modes[stage.name] = value;
      }
    }
  }

  const devMode = parseDevModeFromForm(formData);
  if (devMode) {
    return applyDevMode(modes, devMode);
  }

  return modes;
}

export function isStageModeEditable(
  taskStatuses: string[],
): boolean {
  return (
    taskStatuses.length > 0 &&
    taskStatuses.every((status) => status === "todo")
  );
}
