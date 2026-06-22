import { parseHouseQuery, queryHouses } from "@/lib/house-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = parseHouseQuery(searchParams);
  const result = queryHouses(query);

  return Response.json({
    ok: true,
    ...result,
  });
}
