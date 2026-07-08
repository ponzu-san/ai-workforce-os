import { runAllChecks } from "@/ai/validation/checks";
import { generateQaReport } from "@/ai/validation/qaReporter";
import type {
  ValidationOptions,
  ValidationReport,
} from "@/ai/validation/types";

function buildSummary(checks: ValidationReport["checks"]) {
  const passed = checks.filter((c) => c.status === "pass").length;
  const failed = checks.filter((c) => c.status === "fail").length;
  const warnings = checks.filter((c) => c.status === "warn").length;
  const skipped = checks.filter((c) => c.status === "skip").length;

  return {
    total: checks.length,
    passed,
    failed,
    warnings,
    skipped,
    overall: failed === 0 ? ("pass" as const) : ("fail" as const),
  };
}

export const validationService = {
  async run(options: ValidationOptions = {}): Promise<ValidationReport> {
    const execute = options.execute ?? false;
    const checks = await runAllChecks(execute);
    const qaReport = await generateQaReport(checks);

    return {
      runAt: new Date().toISOString(),
      executeMode: execute,
      summary: buildSummary(checks),
      checks,
      qaReport,
    };
  },
};
