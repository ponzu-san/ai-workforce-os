import Link from "next/link";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClientAction } from "@/features/client/actions";
import { clientService } from "@/services/clientService";

export default async function ClientsPage() {
  const clients = await clientService.list();
  const leads = clients.filter((c) => c.status === "lead");
  const active = clients.filter((c) => c.status === "active");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="text-muted-foreground">
          Phase 4 — リード・クライアント管理と連絡履歴
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads</CardTitle>
            <CardDescription>{leads.length} 件</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Clients</CardTitle>
            <CardDescription>{active.length} 件</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">クライアント追加</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createClientAction} className="space-y-3">
            <input
              name="name"
              placeholder="名前 *"
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <input
              name="company"
              placeholder="会社名"
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <input
              name="email"
              placeholder="メール"
              type="email"
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              リードとして追加
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              クライアントがありません
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.company || client.email || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {client._count.communications} comms ·{" "}
                      {client._count.projects} projects
                    </span>
                    <StatusBadge value={client.status} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
