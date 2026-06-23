import { createAiRecommendation } from "@/lib/ai-recommendation";
import { getHouseRecordById } from "@/lib/house-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
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
      { status: 400 },
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
      { status: 400 },
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
      { status: 404 },
    );
  }

  const recommendation = await createAiRecommendation(record);

  return Response.json({
    ok: true,
    recommendation,
  });
}
