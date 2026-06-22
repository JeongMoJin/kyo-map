import { HOUSES, getHouseById } from "@/lib/houses";
import { getPriorityProfile, type PriorityProfile } from "@/lib/priority";
import type { House, RecommendedUse } from "@/lib/types";

export type HouseSortKey =
  | "priority"
  | "confidence"
  | "safety"
  | "power-low"
  | "age"
  | "address";

export interface HouseQuery {
  search?: string;
  sido?: string;
  uses?: RecommendedUse[];
  minConfidence?: number;
  disasterOnly?: boolean;
  sort?: HouseSortKey;
  limit?: number;
  offset?: number;
}

export interface HouseMetrics {
  age: number;
  recentPowerAverage: number;
  previousPowerAverage: number;
  powerDropRate: number;
  sido: string;
}

export interface HouseRecord {
  house: House;
  priority: PriorityProfile;
  metrics: HouseMetrics;
}

export interface HouseSummary {
  total: number;
  byUse: Record<RecommendedUse, number>;
  bySido: Array<{ name: string; value: number }>;
  disasterCount: number;
  fieldCheckCount: number;
  highPriorityCount: number;
  avgConfidence: number;
}

const ANALYSIS_YEAR = 2026;
const ALL_USES: RecommendedUse[] = ["귀촌", "창업", "철거"];

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function getSido(address: string) {
  return address.split(" ")[0] ?? "";
}

export function getHouseMetrics(house: House): HouseMetrics {
  const previousPowerAverage = average(house.powerUsage.slice(0, 6));
  const recentPowerAverage = average(house.powerUsage.slice(6));
  const powerDropRate =
    previousPowerAverage > 0
      ? Math.max(0, (previousPowerAverage - recentPowerAverage) / previousPowerAverage)
      : 0;

  return {
    age: ANALYSIS_YEAR - house.buildYear,
    recentPowerAverage,
    previousPowerAverage,
    powerDropRate,
    sido: getSido(house.address),
  };
}

export function toHouseRecord(house: House): HouseRecord {
  return {
    house,
    priority: getPriorityProfile(house),
    metrics: getHouseMetrics(house),
  };
}

export function getHouseRecordById(id: string): HouseRecord | undefined {
  const house = getHouseById(id);
  return house ? toHouseRecord(house) : undefined;
}

export function parseHouseQuery(searchParams: URLSearchParams): HouseQuery {
  const rawUses = searchParams.get("uses");
  const uses = rawUses
    ? rawUses
        .split(",")
        .map((value) => value.trim())
        .filter((value): value is RecommendedUse =>
          (ALL_USES as string[]).includes(value),
        )
    : undefined;

  const minConfidence = Number(searchParams.get("minConfidence"));
  const limit = Number(searchParams.get("limit"));
  const offset = Number(searchParams.get("offset"));
  const rawSort = searchParams.get("sort");

  return {
    search: searchParams.get("search") ?? undefined,
    sido: searchParams.get("sido") ?? undefined,
    uses,
    minConfidence: Number.isFinite(minConfidence) ? minConfidence : undefined,
    disasterOnly: searchParams.get("disasterOnly") === "true",
    sort: isHouseSortKey(rawSort) ? rawSort : undefined,
    limit: Number.isFinite(limit) && limit > 0 ? limit : undefined,
    offset: Number.isFinite(offset) && offset > 0 ? offset : undefined,
  };
}

export function queryHouses(query: HouseQuery = {}) {
  const normalizedSearch = normalizeSearch(query.search ?? "");
  const selectedUses = query.uses ? new Set(query.uses) : undefined;
  const minConfidence = query.minConfidence ?? 0;
  const sort = query.sort ?? "priority";

  const filtered = HOUSES.filter((house) => {
    if (selectedUses && !selectedUses.has(house.recommendedUse)) return false;
    if (query.sido && !house.address.startsWith(query.sido)) return false;
    if (house.aiConfidence < minConfidence) return false;
    if (query.disasterOnly && !house.isDisasterZone) return false;
    if (normalizedSearch) {
      const haystack = [
        house.id,
        house.address,
        house.reason,
        house.usageType,
        house.ownerType,
        house.recommendedUse,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalizedSearch)) return false;
    }
    return true;
  });

  const records = filtered.map(toHouseRecord).sort((a, b) => {
    if (sort === "confidence") return b.house.aiConfidence - a.house.aiConfidence;
    if (sort === "safety") return b.priority.safetyRisk - a.priority.safetyRisk;
    if (sort === "power-low") {
      return a.metrics.recentPowerAverage - b.metrics.recentPowerAverage;
    }
    if (sort === "age") return b.metrics.age - a.metrics.age;
    if (sort === "address") return a.house.address.localeCompare(b.house.address, "ko");
    return b.priority.priorityScore - a.priority.priorityScore;
  });

  const offset = query.offset ?? 0;
  const limit = query.limit ?? records.length;
  const items = records.slice(offset, offset + limit);

  return {
    items,
    total: records.length,
    summary: summarizeRecords(records),
    query: { ...query, sort },
    source: "sample-local" as const,
    generatedAt: new Date().toISOString(),
  };
}

export function summarizeRecords(records: HouseRecord[]): HouseSummary {
  const byUse: Record<RecommendedUse, number> = { 귀촌: 0, 창업: 0, 철거: 0 };
  const bySido = new Map<string, number>();
  let disasterCount = 0;
  let fieldCheckCount = 0;
  let highPriorityCount = 0;
  let confidenceTotal = 0;

  for (const record of records) {
    byUse[record.house.recommendedUse] += 1;
    bySido.set(record.metrics.sido, (bySido.get(record.metrics.sido) ?? 0) + 1);
    if (record.house.isDisasterZone) disasterCount += 1;
    if (record.priority.fieldCheckNeed >= 80) fieldCheckCount += 1;
    if (record.priority.priorityScore >= 82) highPriorityCount += 1;
    confidenceTotal += record.house.aiConfidence;
  }

  return {
    total: records.length,
    byUse,
    bySido: Array.from(bySido.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
    disasterCount,
    fieldCheckCount,
    highPriorityCount,
    avgConfidence: records.length ? confidenceTotal / records.length : 0,
  };
}

function isHouseSortKey(value: string | null): value is HouseSortKey {
  return (
    value === "priority" ||
    value === "confidence" ||
    value === "safety" ||
    value === "power-low" ||
    value === "age" ||
    value === "address"
  );
}
