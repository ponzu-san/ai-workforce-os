import { cookies } from "next/headers";

import {
  ACTIVE_PROJECT_COOKIE,
  ACTIVE_PROJECT_MAX_AGE,
} from "@/lib/project/constants";

export async function getActiveProjectId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_PROJECT_COOKIE)?.value ?? null;
}

export async function setActiveProjectId(projectId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PROJECT_COOKIE, projectId, {
    path: "/",
    maxAge: ACTIVE_PROJECT_MAX_AGE,
    sameSite: "lax",
  });
}

export async function clearActiveProjectId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_PROJECT_COOKIE);
}
