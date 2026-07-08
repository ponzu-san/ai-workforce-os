import { NextResponse } from "next/server";

import type { ApiError, ApiResponse } from "@/types";

export function apiSuccess<T>(data: T, status = 200) {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function apiError(error: ApiError, status = 400) {
  const body: ApiResponse<never> = { success: false, error };
  return NextResponse.json(body, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    return apiError(
      { code: "INTERNAL_ERROR", message: error.message },
      500,
    );
  }
  return apiError(
    { code: "INTERNAL_ERROR", message: "予期しないエラーが発生しました。" },
    500,
  );
}
