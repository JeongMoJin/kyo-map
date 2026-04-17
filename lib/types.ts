// AI 도구: ViT(위성영상 분류), LSTM(전력사용 학습), GPT-4o(용도 추천) — 개념적 파이프라인
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
