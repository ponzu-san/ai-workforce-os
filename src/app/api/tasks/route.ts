import { NextRequest } from "next/server";

import {
  apiSuccess,
  handleApiError,
} from "@/lib/api/response";
import { taskService } from "@/services/taskService";

export async function GET() {
  try {
    const tasks = await taskService.list();
    return apiSuccess(tasks);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const task = await taskService.create(
      body as Parameters<typeof taskService.create>[0],
    );
    return apiSuccess(task, 201);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
