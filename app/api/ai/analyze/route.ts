import { analyzeVacancyCandidate } from "@/lib/ai/vacancy-analysis";
import type { House } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

function isHouseLike(value: unknown): value is House {
  const candidate = value as Partial<House>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.address === "string" &&
    typeof candidate.buildYear === "number" &&
    typeof candidate.area === "number" &&
    typeof candidate.aiConfidence === "number" &&
    Array.isArray(candidate.powerUsage)
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 100_000) {
    return Response.json(
      { error: "Request body is too large" },
      { status: 413 },
    );
  }

  try {
    const body = (await request.json()) as { house?: unknown };
    if (!isHouseLike(body.house)) {
      return Response.json(
        { error: "house payload is required" },
        { status: 400 },
      );
    }

    const result = await analyzeVacancyCandidate(body.house);
    return Response.json(result, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { error: "Invalid JSON request body" },
      { status: 400 },
    );
  }
}
