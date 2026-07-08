import { redirect } from "next/navigation";

import { navigationRedirectService } from "@/services/navigationRedirectService";

export default async function ArtifactsPage() {
  redirect(await navigationRedirectService.resolveArtifactsEntryPath());
}
