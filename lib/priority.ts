import type { House } from "@/lib/types";

const ANALYSIS_YEAR = 2026;

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function avg(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export interface PriorityProfile {
  priorityScore: number;
  safetyRisk: number;
  regenerationFit: number;
  fieldCheckNeed: number;
  department: string;
  actionLabel: string;
  urgencyLabel: string;
  evidence: string[];
}

export function getPriorityProfile(house: House): PriorityProfile {
  const age = ANALYSIS_YEAR - house.buildYear;
  const recentPower = avg(house.powerUsage.slice(6));
  const previousPower = avg(house.powerUsage.slice(0, 6));
  const powerDrop = previousPower > 0 ? (previousPower - recentPower) / previousPower : 0;
  const accessScore = clampScore(100 - (house.nearestIC + house.nearestStation) * 7);
  const confidenceScore = house.aiConfidence * 100;

  const safetyRisk = clampScore(
    (house.isDisasterZone ? 42 : 0) +
      (house.recommendedUse === "철거" ? 24 : 0) +
      age * 0.9 +
      (recentPower <= 2 ? 12 : 0) +
      Math.max(0, powerDrop) * 18,
  );

  const regenerationFit = clampScore(
    (house.recommendedUse === "귀촌" ? 62 : house.recommendedUse === "창업" ? 68 : 36) +
      accessScore * 0.18 +
      confidenceScore * 0.16 +
      (house.ownerType === "지자체" ? 8 : 0) +
      (house.area >= 80 ? 4 : 0),
  );

  const fieldCheckNeed = clampScore(
    safetyRisk * 0.5 +
      confidenceScore * 0.26 +
      (recentPower <= 2 ? 15 : 4) +
      (house.isDisasterZone ? 8 : 0),
  );

  const priorityScore = clampScore(
    safetyRisk * 0.42 +
      fieldCheckNeed * 0.3 +
      confidenceScore * 0.18 +
      (house.recommendedUse === "철거" ? 10 : 0),
  );

  const department = house.isDisasterZone
    ? "재난안전과"
    : house.recommendedUse === "귀촌"
      ? "귀농귀촌지원팀"
      : house.recommendedUse === "창업"
        ? "지역경제과"
        : "건축정비과";

  const actionLabel = house.isDisasterZone
    ? "긴급 현장점검 검토"
    : house.recommendedUse === "철거"
      ? "정비계획 검토"
      : house.recommendedUse === "창업"
        ? "상권·용도지역 검토"
        : "소유자 확인 및 활용 검토";

  const urgencyLabel =
    priorityScore >= 82 ? "긴급 검토" : priorityScore >= 70 ? "우선 확인" : "일반 검토";

  return {
    priorityScore,
    safetyRisk,
    regenerationFit,
    fieldCheckNeed,
    department,
    actionLabel,
    urgencyLabel,
    evidence: [
      `AI 추정 점수 ${confidenceScore.toFixed(0)}점`,
      `최근 6개월 평균 전력 ${recentPower.toFixed(1)}kWh`,
      `준공 ${age}년차`,
      house.isDisasterZone ? "안심구역 중첩" : `교통 접근성 점수 ${accessScore}점`,
    ],
  };
}

export function toCsvValue(value: string | number) {
  const text = String(value).replaceAll('"', '""');
  return `"${text}"`;
}
