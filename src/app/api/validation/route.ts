import { NextResponse } from "next/server";

import { validationService } from "@/services/validationService";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/types";
import type { ValidationReport } from "@/ai/validation/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      execute?: boolean;
    };
    const report = await validationService.run({
      execute: body.execute ?? false,
    });

    const response: ApiResponse<ValidationReport> = {
      success: report.summary.overall === "pass",
      data: report,
    };

    return NextResponse.json(response, {
      status: report.summary.overall === "pass" ? 200 : 422,
    });
  } catch (error: unknown) {
    logger.error("Validation run failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    const response: ApiResponse<ValidationReport> = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "自動検証の実行に失敗しました。",
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  try {
    const report = await validationService.run({ execute: false });

    const response: ApiResponse<ValidationReport> = {
      success: report.summary.overall === "pass",
      data: report,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    logger.error("Validation GET failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "自動検証の実行に失敗しました。",
        },
      },
      { status: 500 },
    );
  }
}
