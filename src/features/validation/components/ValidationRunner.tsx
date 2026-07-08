"use client";

import { useState } from "react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ValidationReport } from "@/ai/validation/types";

export function ValidationRunner() {
  const [loading, setLoading] = useState(false);
  const [includeExecute, setIncludeExecute] = useState(false);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runValidation() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ execute: includeExecute }),
      });

      const json = (await response.json()) as {
        success: boolean;
        data?: ValidationReport;
        error?: { message: string };
      };

      if (!json.data) {
        setError(json.error?.message ?? "検証に失敗しました");
        return;
      }

      setReport(json.data);
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">自動検証を実行</CardTitle>
          <CardDescription>
            QA AI がチェック結果を分析し、レポートを生成します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeExecute}
              onChange={(e) => setIncludeExecute(e.target.checked)}
              className="rounded border-input"
            />
            Workflow 実行テストを含める（Demo Project で Execute Next Task
            を実行・DB 更新あり）
          </label>
          <Button onClick={runValidation} disabled={loading}>
            {loading ? "検証中..." : "自動検証を実行"}
          </Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {report && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">チェック結果</CardTitle>
              <StatusBadge value={report.summary.overall} />
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {report.runAt} ·{" "}
                {report.executeMode ? "実行モード" : "読み取り専用"}
              </p>
              <p className="text-sm">
                {report.summary.passed} passed / {report.summary.failed} failed
                / {report.summary.warnings} warnings / {report.summary.skipped}{" "}
                skipped
              </p>
              <div className="space-y-2">
                {report.checks.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-start justify-between rounded-md border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{check.name}</p>
                      <p className="text-muted-foreground">{check.message}</p>
                    </div>
                    <StatusBadge value={check.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">QA Agent レポート</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 text-xs whitespace-pre-wrap">
                {report.qaReport}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
