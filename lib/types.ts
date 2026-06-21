// 후보 DTO: 공개 공공데이터와 내부 조사 데이터를 화면/AI 분석에 전달하는 최소 필드
export type RecommendedUse = "귀촌" | "창업" | "철거";
export type UsageType = "주거" | "상업" | "농가주택";
export type OwnerType = "개인" | "지자체" | "기타";

export interface House {
  id: string;
  lat: number;
  lng: number;
  address: string;
  buildYear: number;
  area: number;
  usageType: UsageType;
  ownerType: OwnerType;
  aiConfidence: number;
  recommendedUse: RecommendedUse;
  reason: string;
  isDisasterZone: boolean;
  powerUsage: number[];
  nearestIC: number;
  nearestStation: number;
}

export const USE_COLORS: Record<RecommendedUse, string> = {
  귀촌: "#10b981",
  창업: "#2563eb",
  철거: "#ef4444",
};

export const USE_LABELS: Record<RecommendedUse, string> = {
  귀촌: "귀촌 / 주거",
  창업: "창업 / 상업",
  철거: "철거 / 정비",
};
