import { NextRequest } from "next/server";

import {
  apiError,
  apiSuccess,
  handleApiError,
} from "@/lib/api/response";
import { taskService } from "@/services/taskService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const task = await taskService.getById(id);
    if (!task) {
      return apiError({ code: "NOT_FOUND", message: "Task not found" }, 404);
    }
    return apiSuccess(task);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const task = await taskService.updateStatus(
      id,
      body as Parameters<typeof taskService.updateStatus>[1],
    );
    return apiSuccess(task);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
