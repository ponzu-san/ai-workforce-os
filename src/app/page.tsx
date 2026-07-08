import Link from "next/link";

import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ja } from "@/lib/labels/ja";
import { dashboardService } from "@/services/dashboardService";

export default async function DashboardPage() {
  const summary = await dashboardService.getSummary();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{ja.dashboard.title}</h1>
        <p className="mt-1 text-muted-foreground">{ja.dashboard.subtitle}</p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <p className="text-sm text-muted-foreground">
            {ja.dashboard.analyticsBanner}
          </p>
          <Button size="sm" asChild>
            <Link href="/analytics">{ja.dashboard.openAnalytics}</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.dashboard.projects}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.stats.projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.dashboard.tasks}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.stats.taskCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.dashboard.approvals}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {summary.stats.pendingApprovalCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.dashboard.clients}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.stats.clientCount}</p>
            <Link href="/clients" className="text-xs text-primary underline">
              {ja.common.openList}
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.dashboard.leads}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.stats.leadCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{ja.task.today}</CardTitle>
            <CardDescription>{ja.task.priority}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {ja.dashboard.noTodayTasks}
              </p>
            ) : (
              summary.todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.projectName}
                      {task.agentName ? ` · ${task.agentName}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <StatusBadge value={task.priority} />
                    <StatusBadge value={task.status} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{ja.approval.title}</CardTitle>
            <CardDescription>{ja.approval.pending}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.pendingApprovals.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {ja.dashboard.noApprovals}
              </p>
            ) : (
              summary.pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="rounded-md border p-3 text-sm"
                >
                  <p className="font-medium">{approval.taskTitle}</p>
                  <p className="text-muted-foreground">{approval.projectName}</p>
                </div>
              ))
            )}
            <Link href="/approvals" className="text-sm text-primary underline">
              {ja.approval.goToList}
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{ja.dashboard.activeProjects}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.activeProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between rounded-md border p-3 hover:bg-accent"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.taskCount} {ja.common.tasks}
                  </p>
                </div>
                <StatusBadge value={project.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{ja.dashboard.aiActivity}</CardTitle>
            <CardDescription>{ja.dashboard.aiActivityDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.recentExecutions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {ja.dashboard.noExecutions}
              </p>
            ) : (
              summary.recentExecutions.map((log) => (
                <div key={log.id} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{log.agentName}</p>
                  <p className="text-muted-foreground">
                    {log.model} · {log.status}
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
