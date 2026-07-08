import { NextRequest } from "next/server";

import {
  apiSuccess,
  handleApiError,
} from "@/lib/api/response";
import { approvalService } from "@/services/approvalService";

export async function GET() {
  try {
    const approvals = await approvalService.listPending();
    return apiSuccess(approvals);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { id, action, comment } = body as {
      id: string;
      action: "approve" | "reject";
      comment?: string;
    };

    const result =
      action === "approve"
        ? await approvalService.approve(id, { comment })
        : await approvalService.reject(id, { comment });

    return apiSuccess(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
