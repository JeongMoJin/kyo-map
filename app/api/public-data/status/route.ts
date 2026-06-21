import { PUBLIC_DATA_SOURCES } from "@/lib/public-data/catalog";
import { getRuntimeIntegrationStatus } from "@/lib/public-data/yeongju";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    {
      service: "공가지도",
      mode: "molit-production-poc",
      generatedAt: new Date().toISOString(),
      sources: PUBLIC_DATA_SOURCES,
      integrations: getRuntimeIntegrationStatus(),
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}
