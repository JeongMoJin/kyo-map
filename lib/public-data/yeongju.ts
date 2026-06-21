import "server-only";

import {
  INTEGRATION_ENV_KEYS,
  PUBLIC_DATA_SOURCES,
  YEONGJU_VACANT_HOUSE_API_URL,
  YEONGJU_VACANT_HOUSE_FILE_URL,
} from "@/lib/public-data/catalog";

const FALLBACK_CSV = `구분,읍면동,리,건축면적(제곱미터),주택유형,등급판정결과,관리기관명,관리기관 전화번호,데이터 기준일
읍면,풍기읍,교촌리,,그 외,3등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,교촌리,,그 외,1등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,교촌리,39,단독,1등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,금계리,26.78,단독,3등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,금계리,,그 외,2등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,금계리,,그 외,3등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,금계리,57.33,단독,2등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,금계리,,그 외,3등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,금계리,,그 외,2등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,금계리,93.22,단독,3등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,금계리,,그 외,2등급,경상북도 영주시청,054-639-6944,2025-07-10
읍면,풍기읍,금계리,,단독,3등급,경상북도 영주시청,054-639-6944,2025-07-10`;

export type YeongjuFetchMode =
  | "data_go_kr_odcloud_api"
  | "data_go_kr_file_download"
  | "bundled_public_sample";

export interface YeongjuVacantHouseRecord {
  rowId: string;
  category: string;
  town: string;
  village: string;
  areaM2: number | null;
  housingType: string;
  gradeText: string;
  gradeNumber: number | null;
  agency: string;
  agencyPhone: string;
  basisDate: string;
}

export interface YeongjuVacancyCluster {
  id: string;
  areaName: string;
  town: string;
  village: string;
  total: number;
  gradeCounts: Record<string, number>;
  avgAreaM2: number | null;
  riskScore: number;
  actionLabel: string;
  evidence: string[];
}

export interface PublicIntegrationStatus {
  key: string;
  label: string;
  purpose: string;
  configured: boolean;
  requiredForProduction: boolean;
}

export interface YeongjuVacancySummary {
  totalRows: number;
  basisDate: string | null;
  gradeCounts: Record<string, number>;
  townCounts: Record<string, number>;
  knownAreaRows: number;
  missingAreaRows: number;
  avgKnownAreaM2: number | null;
}

export interface YeongjuVacancyDataset {
  ok: boolean;
  fetchedAt: string;
  fetchMode: YeongjuFetchMode;
  source: (typeof PUBLIC_DATA_SOURCES)[number];
  integrations: PublicIntegrationStatus[];
  records: YeongjuVacantHouseRecord[];
  clusters: YeongjuVacancyCluster[];
  summary: YeongjuVacancySummary;
  warnings: string[];
}

interface RawCsvRow {
  [key: string]: string | undefined;
  __cells?: string;
}

function getEnv(key: string) {
  const value = process.env[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function getRuntimeIntegrationStatus(): PublicIntegrationStatus[] {
  return INTEGRATION_ENV_KEYS.map((item) => ({
    key: item.key,
    label: item.label,
    purpose: item.purpose,
    configured: Boolean(getEnv(item.key)),
    requiredForProduction: item.requiredForProduction,
  }));
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(text: string): RawCsvRow[] {
  const normalized = text.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");
  const lines = normalized
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row: RawCsvRow = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? "";
    });
    row.__cells = JSON.stringify(cells);
    return row;
  });
}

function decodeCsvBytes(bytes: ArrayBuffer) {
  const utf8 = new TextDecoder("utf-8").decode(bytes);
  const eucKr = new TextDecoder("euc-kr").decode(bytes);

  const score = (text: string) => {
    let bad = 0;
    if (!text.includes("읍면동")) bad += 20;
    bad += (text.match(/\uFFFD/g) ?? []).length;
    bad += (text.match(/ï¿½/g) ?? []).length * 2;
    return bad;
  };

  return score(eucKr) < score(utf8) ? eucKr : utf8;
}

function cell(row: RawCsvRow, columnName: string, columnIndex: number) {
  const byName = row[columnName]?.trim();
  if (byName) return byName;

  const rawCells = row.__cells;
  if (!rawCells) return "";

  try {
    const cells = JSON.parse(rawCells) as string[];
    return cells[columnIndex]?.trim() ?? "";
  } catch {
    return "";
  }
}

function toNumber(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value.replaceAll(",", ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function gradeNumber(value: string | undefined) {
  const match = value?.match(/\d+/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeRecord(row: RawCsvRow, index: number): YeongjuVacantHouseRecord {
  const gradeText = cell(row, "등급판정결과", 5) || "미판정";
  return {
    rowId: `YJ-${String(index + 1).padStart(4, "0")}`,
    category: cell(row, "구분", 0) || "미상",
    town: cell(row, "읍면동", 1) || "미상",
    village: cell(row, "리", 2) || "미상",
    areaM2: toNumber(cell(row, "건축면적(제곱미터)", 3)),
    housingType: cell(row, "주택유형", 4) || "미상",
    gradeText,
    gradeNumber: gradeNumber(gradeText),
    agency: cell(row, "관리기관명", 6) || "경상북도 영주시청",
    agencyPhone: cell(row, "관리기관 전화번호", 7),
    basisDate: cell(row, "데이터 기준일", 8),
  };
}

function gradeWeight(grade: number | null) {
  if (grade === 4) return 100;
  if (grade === 3) return 78;
  if (grade === 2) return 48;
  if (grade === 1) return 22;
  return 35;
}

function actionLabel(cluster: {
  total: number;
  gradeCounts: Record<string, number>;
  riskScore: number;
}) {
  if ((cluster.gradeCounts["4등급"] ?? 0) > 0 || cluster.riskScore >= 86) {
    return "긴급 현장점검";
  }
  if ((cluster.gradeCounts["3등급"] ?? 0) + (cluster.gradeCounts["4등급"] ?? 0) >= 3) {
    return "우선 조사구역";
  }
  if (cluster.total >= 8) return "집중 실태조사";
  return "정기 모니터링";
}

function buildSummary(records: YeongjuVacantHouseRecord[]): YeongjuVacancySummary {
  const gradeCounts: Record<string, number> = {};
  const townCounts: Record<string, number> = {};
  let areaSum = 0;
  let knownAreaRows = 0;

  for (const record of records) {
    gradeCounts[record.gradeText] = (gradeCounts[record.gradeText] ?? 0) + 1;
    townCounts[record.town] = (townCounts[record.town] ?? 0) + 1;
    if (record.areaM2 != null) {
      areaSum += record.areaM2;
      knownAreaRows += 1;
    }
  }

  const basisDate =
    records.find((record) => record.basisDate.trim().length > 0)?.basisDate ??
    null;

  return {
    totalRows: records.length,
    basisDate,
    gradeCounts,
    townCounts,
    knownAreaRows,
    missingAreaRows: records.length - knownAreaRows,
    avgKnownAreaM2:
      knownAreaRows > 0 ? Math.round((areaSum / knownAreaRows) * 10) / 10 : null,
  };
}

function buildClusters(records: YeongjuVacantHouseRecord[]) {
  const map = new Map<
    string,
    {
      town: string;
      village: string;
      rows: YeongjuVacantHouseRecord[];
      gradeCounts: Record<string, number>;
      areaSum: number;
      areaRows: number;
    }
  >();

  for (const record of records) {
    const key = `${record.town}__${record.village}`;
    const existing =
      map.get(key) ??
      {
        town: record.town,
        village: record.village,
        rows: [],
        gradeCounts: {},
        areaSum: 0,
        areaRows: 0,
      };

    existing.rows.push(record);
    existing.gradeCounts[record.gradeText] =
      (existing.gradeCounts[record.gradeText] ?? 0) + 1;
    if (record.areaM2 != null) {
      existing.areaSum += record.areaM2;
      existing.areaRows += 1;
    }
    map.set(key, existing);
  }

  return Array.from(map.entries())
    .map(([key, item]) => {
      const weighted =
        item.rows.reduce((sum, row) => sum + gradeWeight(row.gradeNumber), 0) /
        item.rows.length;
      const densityBoost = Math.min(10, Math.max(0, item.rows.length - 3));
      const riskScore = Math.max(0, Math.min(100, Math.round(weighted + densityBoost)));
      const cluster = {
        id: key.replaceAll("__", "-"),
        areaName: `${item.town} ${item.village}`,
        town: item.town,
        village: item.village,
        total: item.rows.length,
        gradeCounts: item.gradeCounts,
        avgAreaM2:
          item.areaRows > 0
            ? Math.round((item.areaSum / item.areaRows) * 10) / 10
            : null,
        riskScore,
        actionLabel: "",
        evidence: [
          `공개 빈집 ${item.rows.length.toLocaleString("ko-KR")}건`,
          `3-4등급 ${
            (item.gradeCounts["3등급"] ?? 0) + (item.gradeCounts["4등급"] ?? 0)
          }건`,
          item.areaRows > 0
            ? `면적 확인 ${item.areaRows}건`
            : "건축면적 비공개",
        ],
      };
      return {
        ...cluster,
        actionLabel: actionLabel(cluster),
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore || b.total - a.total);
}

async function fetchFromOdcloudApi(serviceKey: string) {
  const url = new URL(YEONGJU_VACANT_HOUSE_API_URL);
  url.searchParams.set("page", "1");
  url.searchParams.set("perPage", "1000");
  url.searchParams.set("returnType", "JSON");
  url.searchParams.set("serviceKey", serviceKey);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`ODCloud API failed with HTTP ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: RawCsvRow[];
    currentCount?: number;
    totalCount?: number;
  };

  return (payload.data ?? []).map(normalizeRecord);
}

async function fetchFromPublicCsvFile() {
  const response = await fetch(YEONGJU_VACANT_HOUSE_FILE_URL, {
    headers: {
      Accept: "text/csv,application/octet-stream,*/*",
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`data.go.kr file download failed with HTTP ${response.status}`);
  }

  const text = decodeCsvBytes(await response.arrayBuffer());
  return parseCsv(text).map(normalizeRecord);
}

function fallbackRecords() {
  return parseCsv(FALLBACK_CSV).map(normalizeRecord);
}

export async function getYeongjuVacancyDataset({
  limit = 50,
}: {
  limit?: number;
} = {}): Promise<YeongjuVacancyDataset> {
  const source = PUBLIC_DATA_SOURCES.find(
    (item) => item.key === "yeongju-vacant-house",
  );
  if (!source) throw new Error("Yeongju source catalog is missing");

  const warnings: string[] = [];
  let records: YeongjuVacantHouseRecord[] = [];
  let fetchMode: YeongjuFetchMode = "data_go_kr_file_download";

  const serviceKey = getEnv("DATA_GO_KR_SERVICE_KEY");

  try {
    if (serviceKey) {
      records = await fetchFromOdcloudApi(serviceKey);
      fetchMode = "data_go_kr_odcloud_api";
    } else {
      records = await fetchFromPublicCsvFile();
      fetchMode = "data_go_kr_file_download";
      warnings.push(
        "DATA_GO_KR_SERVICE_KEY가 없어 JSON API 대신 공개 파일 다운로드 URL을 사용했습니다.",
      );
    }
  } catch (apiError) {
    if (serviceKey) {
      try {
        records = await fetchFromPublicCsvFile();
        fetchMode = "data_go_kr_file_download";
        warnings.push(
          "ODCloud API 호출이 실패해 공개 CSV 파일 다운로드 경로로 전환했습니다.",
        );
      } catch {
        records = fallbackRecords();
        fetchMode = "bundled_public_sample";
        warnings.push(
          "공공데이터 원본 접근이 실패해 코드에 포함된 공개 데이터 샘플로 전환했습니다.",
        );
      }
    } else {
      records = fallbackRecords();
      fetchMode = "bundled_public_sample";
      warnings.push(
        "공공데이터 파일 접근이 실패해 코드에 포함된 공개 데이터 샘플로 전환했습니다.",
      );
    }

    if (apiError instanceof Error) {
      warnings.push(apiError.message);
    }
  }

  const clusters = buildClusters(records);
  const recordsForResponse = limit <= 0 ? [] : records.slice(0, limit);

  return {
    ok: records.length > 0,
    fetchedAt: new Date().toISOString(),
    fetchMode,
    source,
    integrations: getRuntimeIntegrationStatus(),
    records: recordsForResponse,
    clusters: clusters.slice(0, 12),
    summary: buildSummary(records),
    warnings,
  };
}
