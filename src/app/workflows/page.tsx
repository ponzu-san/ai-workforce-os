import { redirect } from "next/navigation";

import { navigationRedirectService } from "@/services/navigationRedirectService";

export default async function WorkflowsPage() {
  redirect(await navigationRedirectService.resolveActiveProjectStagePath());
}
