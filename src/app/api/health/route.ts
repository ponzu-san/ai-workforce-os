import { NextResponse } from "next/server";

import type { ApiResponse, HealthResponse } from "@/types";

export async function GET() {
  const response: ApiResponse<HealthResponse> = {
    success: true,
    data: {
      status: "ok",
      version: "0.3.0",
    },
  };

  return NextResponse.json(response);
}
