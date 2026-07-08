import { apiSuccess, handleApiError } from "@/lib/api/response";
import { dashboardService } from "@/services/dashboardService";

export async function GET() {
  try {
    const summary = await dashboardService.getSummary();
    return apiSuccess(summary);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
