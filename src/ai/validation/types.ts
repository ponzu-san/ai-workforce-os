export type ValidationStatus = "pass" | "fail" | "warn" | "skip";

export interface ValidationCheckResult {
  id: string;
  name: string;
  status: ValidationStatus;
  message: string;
  durationMs: number;
}

export interface ValidationReport {
  runAt: string;
  executeMode: boolean;
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
    overall: "pass" | "fail";
  };
  checks: ValidationCheckResult[];
  qaReport: string;
}

export interface ValidationOptions {
  /** Workflow 実行テスト（DB を更新）を含める */
  execute?: boolean;
}
