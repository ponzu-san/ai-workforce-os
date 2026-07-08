import { apiSuccess, handleApiError } from "@/lib/api/response";
import { agentService } from "@/services/dashboardService";

export async function GET() {
  try {
    const agents = await agentService.listAgents();
    return apiSuccess(agents);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
