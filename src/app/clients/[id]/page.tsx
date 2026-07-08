import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/common/StatusBadge";
import { PageNotice } from "@/components/common/PageNotice";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  activateClientAction,
  addCommunicationAction,
} from "@/features/client/actions";
import { ProjectCreateForm } from "@/features/project/components/ProjectCreateForm";
import { ja, tStatus } from "@/lib/labels/ja";
import { clientService } from "@/services/clientService";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function ClientDetailPage({
  params,
  searchParams,
}: ClientDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const client = await clientService.getById(id);
  if (!client) notFound();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Link href="/clients" className="text-sm text-muted-foreground">
          ← {ja.nav.clients}
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">
              {client.company} {client.email && `· ${client.email}`}
            </p>
          </div>
          <StatusBadge value={client.status} />
        </div>
      </div>

      <PageNotice error={query.error} />

      {client.status === "lead" && (
        <form action={activateClientAction}>
          <input type="hidden" name="client_id" value={client.id} />
          <SubmitButton
            label={ja.client.activate}
            variant="outline"
          />
        </form>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.client.businessProject}</CardTitle>
          <CardDescription>{ja.client.businessProjectDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectCreateForm
            clients={[]}
            hiddenClientId={client.id}
            defaultName={`${client.company || client.name} 案件`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.client.communications}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={addCommunicationAction} className="space-y-3">
            <input type="hidden" name="client_id" value={client.id} />
            <select
              name="channel"
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              defaultValue="email"
            >
              <option value="email">{tStatus("email")}</option>
              <option value="meeting">{tStatus("meeting")}</option>
              <option value="phone">{tStatus("phone")}</option>
            </select>
            <input
              name="subject"
              placeholder={ja.client.subjectPlaceholder}
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <textarea
              name="content"
              placeholder={ja.client.contentPlaceholder}
              required
              className="min-h-20 w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <SubmitButton
              label={ja.client.addCommunication}
              variant="outline"
            />
          </form>

          <div className="space-y-2">
            {client.communications.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {ja.client.noCommunications}
              </p>
            ) : (
              client.communications.map((comm) => (
                <div key={comm.id} className="rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{comm.subject || comm.channel}</p>
                    <StatusBadge value={comm.channel} />
                  </div>
                  <p className="mt-1 text-muted-foreground">{comm.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {comm.occurred_at.toLocaleString("ja-JP")}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {client.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.client.relatedProjects}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {client.projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <Link
                    href={`/projects/${project.id}`}
                    className="font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {tStatus(project.type)} ·{" "}
                    {project.workflows[0]?.name ?? ja.common.workflow}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge value={project.status} />
                  {project.workflows[0] && (
                    <Button size="sm" asChild>
                      <Link href={`/p/${project.id}`}>
                        {ja.workflow.openWorkflow}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
