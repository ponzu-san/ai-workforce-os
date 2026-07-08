import { NextRequest } from "next/server";

import { apiSuccess, handleApiError } from "@/lib/api/response";
import { notificationService } from "@/services/notificationService";

export async function GET() {
  try {
    const [notifications, unreadCount] = await Promise.all([
      notificationService.listRecent(),
      notificationService.getUnreadCount(),
    ]);
    return apiSuccess({ notifications, unreadCount });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { id, markAll } = body as { id?: string; markAll?: boolean };

    if (markAll) {
      await notificationService.markAllAsRead();
    } else if (id) {
      await notificationService.markAsRead(id);
    }

    return apiSuccess({ ok: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
