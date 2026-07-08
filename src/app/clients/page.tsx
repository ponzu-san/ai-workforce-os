import Link from "next/link";

import { StatusBadge } from "@/components/common/StatusBadge";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClientAction } from "@/features/client/actions";
import { ja } from "@/lib/labels/ja";
import { clientService } from "@/services/clientService";

export default async function ClientsPage() {
  const clients = await clientService.list();
  const leads = clients.filter((c) => c.status === "lead");
  const active = clients.filter((c) => c.status === "active");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{ja.client.title}</h1>
        <p className="text-muted-foreground">{ja.client.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.client.leads}</CardTitle>
            <CardDescription>
              {leads.length} {ja.analytics.records}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ja.client.activeClients}</CardTitle>
            <CardDescription>
              {active.length} {ja.analytics.records}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{ja.client.add}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createClientAction} className="space-y-3">
            <input
              name="name"
              placeholder={ja.client.namePlaceholder}
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <input
              name="company"
              placeholder={ja.client.companyPlaceholder}
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <input
              name="email"
              placeholder={ja.client.emailPlaceholder}
              type="email"
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
            />
            <SubmitButton label={ja.client.addAsLead} />
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              {ja.client.noClients}
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
                      {client._count.communications} {ja.common.comms} ·{" "}
                      {client._count.projects} {ja.common.projects}
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
