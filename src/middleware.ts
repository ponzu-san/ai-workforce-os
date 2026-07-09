import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ACTIVE_PROJECT_COOKIE,
  ACTIVE_PROJECT_MAX_AGE,
} from "@/lib/project/constants";

function extractProjectId(pathname: string): string | null {
  const projectPathMatch = pathname.match(/^\/p\/([^/]+)(?:\/|$)/);
  if (projectPathMatch) return projectPathMatch[1];

  const settingsPathMatch = pathname.match(/^\/projects\/([^/]+)(?:\/|$)/);
  if (settingsPathMatch) return settingsPathMatch[1];

  return null;
}

export function middleware(request: NextRequest) {
  const projectId = extractProjectId(request.nextUrl.pathname);
  if (!projectId) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const current = request.cookies.get(ACTIVE_PROJECT_COOKIE)?.value;

  if (current !== projectId) {
    response.cookies.set(ACTIVE_PROJECT_COOKIE, projectId, {
      path: "/",
      maxAge: ACTIVE_PROJECT_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/p/:projectId/:path*", "/projects/:id"],
};
