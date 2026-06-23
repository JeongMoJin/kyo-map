import { createAiRecommendation } from "@/lib/ai-recommendation";
import { getHouseRecordById } from "@/lib/house-service";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const RATE_LIMIT = 12;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const rateLimit = checkRateLimit({
    key: getClientKey(request),
    limit: RATE_LIMIT,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    return Response.json(
      {
        ok: false,
        error: {
          code: "RATE_LIMITED",
          message: "GPT 분석 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
        },
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimit),
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        error: {
          code: "INVALID_JSON",
          message: "요청 본문을 JSON으로 읽을 수 없습니다.",
        },
      },
      { status: 400, headers: getRateLimitHeaders(rateLimit) },
    );
  }

  const houseId =
    typeof body === "object" &&
    body !== null &&
    "houseId" in body &&
    typeof body.houseId === "string"
      ? body.houseId.trim()
      : "";

  if (!houseId) {
    return Response.json(
      {
        ok: false,
        error: {
          code: "HOUSE_ID_REQUIRED",
          message: "houseId가 필요합니다.",
        },
      },
      { status: 400, headers: getRateLimitHeaders(rateLimit) },
    );
  }

  const record = getHouseRecordById(houseId);

  if (!record) {
    return Response.json(
      {
        ok: false,
        error: {
          code: "HOUSE_NOT_FOUND",
          message: "해당 공가 후보 데이터를 찾을 수 없습니다.",
        },
      },
      { status: 404, headers: getRateLimitHeaders(rateLimit) },
    );
  }

  const recommendation = await createAiRecommendation(record);

  return Response.json(
    {
      ok: true,
      recommendation,
    },
    { headers: getRateLimitHeaders(rateLimit) },
  );
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  return `ai-recommendation:${ip}`;
}

function getRateLimitHeaders(rateLimit: ReturnType<typeof checkRateLimit>) {
  const headers = new Headers();
  headers.set("X-RateLimit-Limit", String(rateLimit.limit));
  headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  headers.set("X-RateLimit-Reset", String(Math.ceil(rateLimit.resetAt / 1000)));

  if (!rateLimit.allowed) {
    headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
  }

  return headers;
}
