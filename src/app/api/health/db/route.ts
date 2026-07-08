import { NextResponse } from "next/server";

import { workspaceRepository } from "@/database/repositories/workspaceRepository";
import { logger } from "@/lib/logger";
import type { ApiResponse, DatabaseHealthResponse } from "@/types";

export async function GET() {
  try {
    const workspaceCount = await workspaceRepository.count();

    const response: ApiResponse<DatabaseHealthResponse> = {
      success: true,
      data: {
        status: "ok",
        database: "connected",
        workspaceCount,
      },
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    logger.error("Database health check failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    const response: ApiResponse<DatabaseHealthResponse> = {
      success: false,
      data: {
        status: "error",
        database: "disconnected",
      },
      error: {
        code: "DATABASE_CONNECTION_ERROR",
        message: "データベースへの接続に失敗しました。",
      },
    };

    return NextResponse.json(response, { status: 503 });
  }
}
