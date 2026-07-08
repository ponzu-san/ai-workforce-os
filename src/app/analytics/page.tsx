import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { analyticsService } from "@/services/analyticsService";

export default async function AnalyticsPage() {
  const data = await analyticsService.getBusinessDashboard();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Phase 5 — Business Dashboard（Cost / Productivity / AI Activity）
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${data.cost.totalCost.toFixed(4)}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.cost.recordCount} records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Token Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.cost.totalTokens.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.productivity.completionRate}%
            </p>
            <p className="text-xs text-muted-foreground">
              {data.productivity.tasksDone}/{data.productivity.tasksTotal} done
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Artifacts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.productivity.artifacts}</p>
            <Link href="/artifacts" className="text-xs text-primary underline">
              一覧へ
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agent Activity</CardTitle>
            <CardDescription>実行回数 by Agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.agentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">実行履歴なし</p>
            ) : (
              data.agentActivity.map((item) => (
                <div
                  key={item.agentName}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <span>{item.agentName}</span>
                  <span className="font-medium">{item.executionCount}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recentCosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                LLM API 利用時に Cost が記録されます
              </p>
            ) : (
              data.recentCosts.map((r) => (
                <div key={r.id} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{r.agentName}</p>
                  <p className="text-muted-foreground">
                    {r.model} · ${r.cost.toFixed(6)} · {r.tokenUsage} tokens
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
