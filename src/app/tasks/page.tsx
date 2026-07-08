import { redirect } from "next/navigation";

import { navigationRedirectService } from "@/services/navigationRedirectService";

export default async function TasksPage() {
  redirect(await navigationRedirectService.resolveActiveProjectStagePath());
}
