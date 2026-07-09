import { PRODUCTION_STAGE_NAMES } from "@/ai/workflow/productionWorkflowTemplate";
import { displayStageName } from "@/lib/labels/stageNames";
import type { StageExecutionMode } from "@/types/domain";

export interface StageExecutionBrief {
  agentLabel: string;
  deliverableLabel: string;
  humanAction: string;
  referenceLabel: string;
}

const STAGE_BRIEFS: Record<string, StageExecutionBrief> = {
  [PRODUCTION_STAGE_NAMES.SALES]: {
    agentLabel: "営業AI",
    deliverableLabel: "提案書・見積もり",
    humanAction: "内容を確認し、必要なら共有プレビューで相手に見せてから承認してください。",
    referenceLabel: "案件指示・クライアント情報",
  },
  [PRODUCTION_STAGE_NAMES.CONTRACT]: {
    agentLabel: "PM AI",
    deliverableLabel: "契約チェックリスト・契約書ドラフト",
    humanAction: "チェック項目を選択し、契約書ドラフトを確認してから承認してください。",
    referenceLabel: "営業成果物・案件指示",
  },
  [PRODUCTION_STAGE_NAMES.REQUIREMENT]: {
    agentLabel: "PM AI",
    deliverableLabel: "要件定義書",
    humanAction: "要件の抜け漏れがないか確認し、承認してください。",
    referenceLabel: "営業・契約成果物・案件指示",
  },
  [PRODUCTION_STAGE_NAMES.DESIGN]: {
    agentLabel: "デザインAI",
    deliverableLabel: "デザイン仕様・ハンドオフ",
    humanAction: "デザイン方針と成果物を確認し、承認してください。",
    referenceLabel: "要件・契約成果物",
  },
  [PRODUCTION_STAGE_NAMES.FRONTEND]: {
    agentLabel: "フロントエンドAI",
    deliverableLabel: "UI実装計画・コード",
    humanAction: "実装方針を確認し、承認してください。",
    referenceLabel: "要件・デザイン成果物",
  },
  [PRODUCTION_STAGE_NAMES.BACKEND]: {
    agentLabel: "バックエンドAI",
    deliverableLabel: "API・データ設計",
    humanAction: "API設計を確認し、承認してください。",
    referenceLabel: "要件・フロントエンド成果物",
  },
  [PRODUCTION_STAGE_NAMES.EXTERNAL_DEV]: {
    agentLabel: "フロントエンドAI",
    deliverableLabel: "外部開発ハンドオフ",
    humanAction: "ハンドオフ文書を確認し、外部ツールで作業後に成果物を登録してください。",
    referenceLabel: "要件・デザイン成果物",
  },
  [PRODUCTION_STAGE_NAMES.INFRA]: {
    agentLabel: "リリースAI",
    deliverableLabel: "インフラ・デプロイ準備",
    humanAction: "デプロイ準備内容を確認し、承認してください。",
    referenceLabel: "要件・バックエンド成果物",
  },
  [PRODUCTION_STAGE_NAMES.QA]: {
    agentLabel: "QA AI",
    deliverableLabel: "QAチェックリスト",
    humanAction: "指摘事項を確認し、問題なければ承認してください。",
    referenceLabel: "参照可能な成果物（スキップ工程は除外）",
  },
  [PRODUCTION_STAGE_NAMES.LEGAL]: {
    agentLabel: "法務AI",
    deliverableLabel: "コンプライアンス確認",
    humanAction: "法務リスクと対応事項を確認し、承認してください。",
    referenceLabel: "要件・契約成果物",
  },
  [PRODUCTION_STAGE_NAMES.RELEASE]: {
    agentLabel: "リリースAI",
    deliverableLabel: "納品パッケージ・サインオフ",
    humanAction: "全成果物を確認し、案件完了へ進んでください。",
    referenceLabel: "主要成果物一覧",
  },
};

export function getStageExecutionBrief(stageName: string): StageExecutionBrief {
  return (
    STAGE_BRIEFS[stageName] ?? {
      agentLabel: "AIエージェント",
      deliverableLabel: "成果物",
      humanAction: "内容を確認して承認してください。",
      referenceLabel: "前工程の成果物",
    }
  );
}

export function getStageCompletionSummary(
  stageName: string,
  taskTitle: string,
): string {
  const brief = getStageExecutionBrief(stageName);
  return `${displayStageName(stageName)}の「${taskTitle}」が完了しました。${brief.deliverableLabel}が作成されています。${brief.humanAction}`;
}

export function getSkipStageDescription(stageName: string): string {
  return `${displayStageName(stageName)}はテンプレート設定によりスキップされています。開発工程を省略した案件では、この工程の成果物は自動記録のみです。`;
}

export function describeExecutionMode(mode: StageExecutionMode): string {
  if (mode === "skip") return "スキップ";
  if (mode === "external_handoff") return "外部ツール連携";
  if (mode === "human_handoff") return "人間への引き渡し";
  return "AI内製";
}
