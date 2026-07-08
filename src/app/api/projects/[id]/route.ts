import { NextRequest } from "next/server";

import {
  apiError,
  apiSuccess,
  handleApiError,
} from "@/lib/api/response";
import { projectService } from "@/services/projectService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const project = await projectService.getById(id);
    if (!project) {
      return apiError({ code: "NOT_FOUND", message: "Project not found" }, 404);
    }
    return apiSuccess(project);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
