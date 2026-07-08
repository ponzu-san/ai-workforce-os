import { NextRequest } from "next/server";

import {
  apiSuccess,
  handleApiError,
} from "@/lib/api/response";
import { projectService } from "@/services/projectService";

export async function GET() {
  try {
    const projects = await projectService.list();
    return apiSuccess(projects);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const project = await projectService.create(
      body as Parameters<typeof projectService.create>[0],
    );
    return apiSuccess(project, 201);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
