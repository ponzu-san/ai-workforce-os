import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ACTIVE_PROJECT_COOKIE,
  ACTIVE_PROJECT_MAX_AGE,
} from "@/lib/project/constants";

export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/p\/([^/]+)(?:\/|$)/);
  if (!match) {
    return NextResponse.next();
  }

  const projectId = match[1];
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
  matcher: ["/p/:projectId/:path*"],
};
