import { redirect } from "next/navigation";

import { navigationRedirectService } from "@/services/navigationRedirectService";

export default async function ApprovalsPage() {
  redirect(await navigationRedirectService.resolveApprovalEntryPath());
}
