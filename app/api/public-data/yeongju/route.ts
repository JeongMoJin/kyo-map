import { getYeongjuVacancyDataset } from "@/lib/public-data/yeongju";

export const runtime = "nodejs";
export const revalidate = 43200;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(limitParam) ? Math.max(0, limitParam) : 50;
  const dataset = await getYeongjuVacancyDataset({ limit });

  return Response.json(dataset, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
