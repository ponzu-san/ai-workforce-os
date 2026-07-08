import { apiSuccess, handleApiError } from "@/lib/api/response";
import { artifactService } from "@/services/artifactService";

export async function GET() {
  try {
    const artifacts = await artifactService.list();
    return apiSuccess(artifacts);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
