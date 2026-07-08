import { NextRequest } from "next/server";
import { z } from "zod";

import { apiSuccess, handleApiError } from "@/lib/api/response";
import { secretaryAgent } from "@/ai/agents/secretary";

const chatSchema = z.object({
  message: z.string().min(1),
  projectId: z.string().uuid().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const data = chatSchema.parse(body);
    const result = await secretaryAgent.chat(data);
    return apiSuccess(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
