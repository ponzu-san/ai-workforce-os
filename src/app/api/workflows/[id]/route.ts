import { NextRequest } from "next/server";

import { apiSuccess, handleApiError } from "@/lib/api/response";
import { workflowExecutionService } from "@/services/workflowExecutionService";
import { workflowService } from "@/services/workflowService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const workflow = await workflowService.getById(id);
    return apiSuccess(workflow);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const { action } = body as { action: "start" | "execute" };

    if (action === "start") {
      await workflowExecutionService.assignAgents(id);
      const workflow = await workflowExecutionService.start(id);
      return apiSuccess(workflow);
    }

    const result = await workflowExecutionService.executeNext(id);
    return apiSuccess(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
