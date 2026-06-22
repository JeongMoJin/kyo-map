import { getHouseRecordById } from "@/lib/house-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const record = getHouseRecordById(id);

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

  return Response.json({
    ok: true,
    item: record,
    source: "sample-local",
    generatedAt: new Date().toISOString(),
  });
}
