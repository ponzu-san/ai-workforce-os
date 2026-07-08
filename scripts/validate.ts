#!/usr/bin/env tsx
/**
 * AI Workforce OS — 自動検証 CLI
 *
 * Usage:
 *   npm run validate              # 読み取り専用チェック + QA レポート
 *   npm run validate -- --execute # Workflow 実行テストを含む（DB 更新あり）
 */

import { validationService } from "../src/services/validationService";

const execute = process.argv.includes("--execute");

async function main() {
  console.log("🔍 AI Workforce OS — Validation");
  console.log(`Mode: ${execute ? "execute (DB 更新あり)" : "read-only"}\n`);

  const report = await validationService.run({ execute });

  for (const check of report.checks) {
    const icon =
      check.status === "pass"
        ? "✅"
        : check.status === "fail"
          ? "❌"
          : check.status === "warn"
            ? "⚠️"
            : "⏭️";
    console.log(`${icon} [${check.status}] ${check.name}`);
    console.log(`   ${check.message} (${check.durationMs}ms)\n`);
  }

  console.log("─".repeat(60));
  console.log(
    `Summary: ${report.summary.passed} passed, ${report.summary.failed} failed, ${report.summary.warnings} warnings, ${report.summary.skipped} skipped`,
  );
  console.log(`Overall: ${report.summary.overall.toUpperCase()}\n`);

  console.log("─".repeat(60));
  console.log("QA Agent Report:\n");
  console.log(report.qaReport);

  if (report.summary.overall === "fail") {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error("Validation failed:", error);
  process.exit(1);
});
