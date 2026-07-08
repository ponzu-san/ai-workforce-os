import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApprovalActions } from "@/features/approval/components/ApprovalActions";
import { ja } from "@/lib/labels/ja";
import { approvalService } from "@/services/approvalService";

export default async function ApprovalsPage() {
  const [pending, history] = await Promise.all([
    approvalService.listPending(),
    approvalService.listHistory(),
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{ja.approval.title}</h1>
        <p className="text-muted-foreground">{ja.approval.subtitle}</p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">{ja.approval.pending}</h2>
        {pending.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              {ja.approval.noPending}
            </CardContent>
          </Card>
        ) : (
          pending.map((approval) => (
            <Card key={approval.id} className="mb-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{approval.task.title}</CardTitle>
                <StatusBadge value={approval.status} />
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {ja.common.project}: {approval.task.stage.workflow.project.name}
                </p>
                <ApprovalActions approvalId={approval.id} />
              </CardContent>
            </Card>
          ))
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">{ja.approval.history}</h2>
        <div className="space-y-2">
          {history
            .filter((a) => a.status !== "pending")
            .map((approval) => (
              <Card key={approval.id}>
                <CardContent className="flex items-center justify-between p-4 text-sm">
                  <div>
                    <p className="font-medium">{approval.task.title}</p>
                    <p className="text-muted-foreground">
                      {approval.task.stage.workflow.project.name}
                      {approval.comment ? ` · ${approval.comment}` : ""}
                    </p>
                  </div>
                  <StatusBadge value={approval.status} />
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
}
