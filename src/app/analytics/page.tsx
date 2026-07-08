import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ja } from "@/lib/labels/ja";
import { analyticsService } from "@/services/analyticsService";
import { navigationRedirectService } from "@/services/navigationRedirectService";

export default async function AnalyticsPage() {
  const [data, artifactsPath] = await Promise.all([
    analyticsService.getBusinessDashboard(),
    navigationRedirectService.resolveArtifactsEntryPath(),
  ]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{ja.analytics.title}</h1>
        <p className="text-muted-foreground">{ja.analytics.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.analytics.aiCost}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${data.cost.totalCost.toFixed(4)}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.cost.recordCount} {ja.analytics.records}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.analytics.tokenUsage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.cost.totalTokens.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.analytics.taskCompletion}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.productivity.completionRate}%
            </p>
            <p className="text-xs text-muted-foreground">
              {data.productivity.tasksDone}/{data.productivity.tasksTotal}{" "}
              {ja.analytics.doneSuffix}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.analytics.artifacts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.productivity.artifacts}</p>
            <Link href={artifactsPath} className="text-xs text-primary underline">
              {ja.common.openList}
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.analytics.agentActivity}</CardTitle>
            <CardDescription>{ja.analytics.agentActivityDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.agentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {ja.analytics.noActivity}
              </p>
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
            <CardTitle className="text-base">{ja.analytics.recentCosts}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recentCosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {ja.analytics.noCosts}
              </p>
            ) : (
              data.recentCosts.map((r) => (
                <div key={r.id} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{r.agentName}</p>
                  <p className="text-muted-foreground">
                    {r.model} · ${r.cost.toFixed(6)} · {r.tokenUsage}{" "}
                    {ja.analytics.tokens}
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
