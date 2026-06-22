import { HOUSES } from "@/lib/houses";

export async function GET() {
  return Response.json({
    ok: true,
    service: "gonggajido",
    dataSource: "sample-local",
    candidateCount: HOUSES.length,
    generatedAt: new Date().toISOString(),
  });
}
