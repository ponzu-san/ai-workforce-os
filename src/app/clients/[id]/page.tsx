import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/common/StatusBadge";
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
  createBusinessProjectAction,
} from "@/features/client/actions";
import { clientService } from "@/services/clientService";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { id } = await params;
  const client = await clientService.getById(id);
  if (!client) notFound();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Link href="/clients" className="text-sm text-muted-foreground">
          ← Clients
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

      {client.status === "lead" && (
        <form action={activateClientAction}>
          <input type="hidden" name="client_id" value={client.id} />
          <button
            type="submit"
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            クライアントを Active にする
          </button>
        </form>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Project 作成</CardTitle>
          <CardDescription>
            Sales → Contract → Delivery の Business Workflow を開始
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createBusinessProjectAction} className="space-y-3">
            <input type="hidden" name="client_id" value={client.id} />
            <input
              name="name"
              placeholder="案件名 *"
              required
              defaultValue={`${client.company || client.name} 案件`}
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <textarea
              name="description"
              placeholder="案件概要"
              className="min-h-16 w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Business Project を作成
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">連絡履歴</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={addCommunicationAction} className="space-y-3">
            <input type="hidden" name="client_id" value={client.id} />
            <select
              name="channel"
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              defaultValue="email"
            >
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="phone">Phone</option>
            </select>
            <input
              name="subject"
              placeholder="件名"
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <textarea
              name="content"
              placeholder="内容 *"
              required
              className="min-h-20 w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              履歴を追加
            </button>
          </form>

          <div className="space-y-2">
            {client.communications.length === 0 ? (
              <p className="text-sm text-muted-foreground">履歴なし</p>
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
            <CardTitle className="text-base">関連 Project</CardTitle>
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
                    {project.type} · {project.workflows[0]?.name ?? "Workflow"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge value={project.status} />
                  {project.workflows[0] && (
                    <Link
                      href={`/workflows/${project.workflows[0].id}`}
                      className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                    >
                      Workflow を開く
                    </Link>
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
