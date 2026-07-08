import type { StageExecutionMode, ProjectTemplate } from "@/types/domain";
import {
  PRODUCTION_STAGE_NAMES,
  type ProductionStageName,
} from "@/ai/workflow/productionWorkflowTemplate";

export type TemplateStageModes = Partial<
  Record<ProductionStageName, StageExecutionMode>
>;

const ALL_INTERNAL: TemplateStageModes = {
  [PRODUCTION_STAGE_NAMES.SALES]: "internal_ai",
  [PRODUCTION_STAGE_NAMES.CONTRACT]: "internal_ai",
  [PRODUCTION_STAGE_NAMES.REQUIREMENT]: "internal_ai",
  [PRODUCTION_STAGE_NAMES.DESIGN]: "external_handoff",
  [PRODUCTION_STAGE_NAMES.FRONTEND]: "internal_ai",
  [PRODUCTION_STAGE_NAMES.BACKEND]: "internal_ai",
  [PRODUCTION_STAGE_NAMES.EXTERNAL_DEV]: "skip",
  [PRODUCTION_STAGE_NAMES.INFRA]: "internal_ai",
  [PRODUCTION_STAGE_NAMES.QA]: "internal_ai",
  [PRODUCTION_STAGE_NAMES.LEGAL]: "internal_ai",
  [PRODUCTION_STAGE_NAMES.RELEASE]: "internal_ai",
};

export const PROJECT_TEMPLATE_LABELS: Record<ProjectTemplate, string> = {
  lp_static: "LP（静的）",
  lp_form: "LP（問い合わせフォームあり）",
  corporate: "コーポレート / サービスサイト",
  design_only: "デザインのみ",
  custom_blank: "空白（手動設定）",
};

export const PROJECT_TEMPLATE_DESCRIPTIONS: Record<ProjectTemplate, string> = {
  lp_static:
    "静的LP。開発=外部コーディング（Cursor 等 → 外部開発で登録）。",
  lp_form: "（非推奨）",
  corporate: "本格サイト。開発=AI内製（FE/BE を順に実行）。",
  design_only: "デザインまで。開発工程はスキップ。",
  custom_blank: "全工程を手動設定。開発モードも変更可能。",
};

export const TEMPLATE_STAGE_MODES: Record<ProjectTemplate, TemplateStageModes> =
  {
    lp_static: {
      ...ALL_INTERNAL,
      [PRODUCTION_STAGE_NAMES.DESIGN]: "external_handoff",
      [PRODUCTION_STAGE_NAMES.FRONTEND]: "skip",
      [PRODUCTION_STAGE_NAMES.BACKEND]: "skip",
      [PRODUCTION_STAGE_NAMES.EXTERNAL_DEV]: "external_handoff",
      [PRODUCTION_STAGE_NAMES.INFRA]: "skip",
    },
    lp_form: {
      ...ALL_INTERNAL,
      [PRODUCTION_STAGE_NAMES.DESIGN]: "external_handoff",
      [PRODUCTION_STAGE_NAMES.FRONTEND]: "skip",
      [PRODUCTION_STAGE_NAMES.BACKEND]: "skip",
      [PRODUCTION_STAGE_NAMES.EXTERNAL_DEV]: "external_handoff",
      [PRODUCTION_STAGE_NAMES.INFRA]: "skip",
    },
    corporate: {
      ...ALL_INTERNAL,
      [PRODUCTION_STAGE_NAMES.DESIGN]: "external_handoff",
      [PRODUCTION_STAGE_NAMES.EXTERNAL_DEV]: "skip",
    },
    design_only: {
      ...ALL_INTERNAL,
      [PRODUCTION_STAGE_NAMES.DESIGN]: "external_handoff",
      [PRODUCTION_STAGE_NAMES.FRONTEND]: "skip",
      [PRODUCTION_STAGE_NAMES.BACKEND]: "skip",
      [PRODUCTION_STAGE_NAMES.EXTERNAL_DEV]: "skip",
      [PRODUCTION_STAGE_NAMES.INFRA]: "skip",
    },
    custom_blank: {
      ...ALL_INTERNAL,
      [PRODUCTION_STAGE_NAMES.EXTERNAL_DEV]: "skip",
    },
  };

export function resolveStageModes(
  template: ProjectTemplate,
  overrides?: TemplateStageModes,
): Record<ProductionStageName, StageExecutionMode> {
  const base = TEMPLATE_STAGE_MODES[template];
  const resolved = { ...ALL_INTERNAL, ...base, ...overrides } as Record<
    ProductionStageName,
    StageExecutionMode
  >;

  // 法務は全テンプレート必須
  resolved[PRODUCTION_STAGE_NAMES.LEGAL] = "internal_ai";

  return resolved;
}

export const DEFAULT_PROJECT_TEMPLATE: ProjectTemplate = "lp_static";
