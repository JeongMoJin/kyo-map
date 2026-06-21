import "server-only";

import { getPriorityProfile } from "@/lib/priority";
import type { House } from "@/lib/types";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export interface VacancyAiAnalysis {
  mode: "openai_responses" | "local_policy_scoring";
  configured: boolean;
  model: string;
  generatedAt: string;
  vacancyLikelihood: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendedAction: string;
  policyUse: string;
  fieldInspectionChecklist: string[];
  evidenceSummary: string[];
  dataLimitations: string[];
  confidenceRationale: string;
  warning?: string;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function localRiskLevel(score: number): VacancyAiAnalysis["riskLevel"] {
  if (score >= 86) return "critical";
  if (score >= 72) return "high";
  if (score >= 52) return "medium";
  return "low";
}

function safeHouseInput(house: House) {
  const previousPowerAvg = average(house.powerUsage.slice(0, 6));
  const recentPowerAvg = average(house.powerUsage.slice(6));
  return {
    id: house.id,
    address: house.address,
    buildYear: house.buildYear,
    areaM2: house.area,
    usageType: house.usageType,
    ownerType: house.ownerType,
    localVacancyConfidence: house.aiConfidence,
    isDisasterZone: house.isDisasterZone,
    previousPowerAvg,
    recentPowerAvg,
    nearestICkm: house.nearestIC,
    nearestStationKm: house.nearestStation,
    currentRecommendation: house.recommendedUse,
    currentReason: house.reason,
  };
}

function createLocalAnalysis(
  house: House,
  warning?: string,
): VacancyAiAnalysis {
  const priority = getPriorityProfile(house);
  const recentPowerAvg = average(house.powerUsage.slice(6));
  const likelihood = clamp(
    house.aiConfidence * 72 +
      (recentPowerAvg <= 2 ? 14 : 4) +
      (house.isDisasterZone ? 8 : 0) +
      Math.min(6, Math.max(0, 2026 - house.buildYear - 25) / 5),
  );

  return {
    mode: "local_policy_scoring",
    configured: Boolean(process.env.OPENAI_API_KEY),
    model: "local-priority-v1",
    generatedAt: new Date().toISOString(),
    vacancyLikelihood: likelihood,
    riskLevel: localRiskLevel(priority.priorityScore),
    recommendedAction: `${priority.department} 배정 후 ${priority.actionLabel}`,
    policyUse:
      "OpenAI 키가 없거나 호출이 실패한 경우에도 현장조사 우선순위, 안전 위험, 전력 저사용 신호를 기반으로 행정 검토 초안을 제공합니다.",
    fieldInspectionChecklist: [
      "공개 데이터 기준 주소/행정구역과 현장 위치 일치 여부 확인",
      "전기 사용량 저하가 장기 미거주 때문인지, 계량기 단절/철거 때문인지 확인",
      "붕괴위험, 도로 점유, 위생 민원 등 안전 이슈 확인",
      "소유자 확인 및 정비/활용 동의 가능성 확인",
    ],
    evidenceSummary: priority.evidence,
    dataLimitations: [
      "현재 화면의 상세 후보는 시연용 좌표 데이터이며 실제 행정 운영에서는 지번 비공개 원칙을 적용해야 합니다.",
      "공개 빈집 현황 파일은 정확 지번과 소유자 정보를 제외하므로 현장조사 전 확정 빈집으로 단정할 수 없습니다.",
      "전력 사용량은 가명 또는 집계 단위 계약 없이는 개별 세대 판단 근거로 사용할 수 없습니다.",
    ],
    confidenceRationale:
      "로컬 정책 산식은 빈집 확률, 최근 전력사용량, 건축연도, 안심구역 여부를 결합해 우선순위를 산정합니다.",
    warning,
  };
}

function jsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      vacancyLikelihood: {
        type: "number",
        minimum: 0,
        maximum: 100,
      },
      riskLevel: {
        type: "string",
        enum: ["low", "medium", "high", "critical"],
      },
      recommendedAction: {
        type: "string",
      },
      policyUse: {
        type: "string",
      },
      fieldInspectionChecklist: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        items: { type: "string" },
      },
      evidenceSummary: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        items: { type: "string" },
      },
      dataLimitations: {
        type: "array",
        minItems: 2,
        maxItems: 5,
        items: { type: "string" },
      },
      confidenceRationale: {
        type: "string",
      },
    },
    required: [
      "vacancyLikelihood",
      "riskLevel",
      "recommendedAction",
      "policyUse",
      "fieldInspectionChecklist",
      "evidenceSummary",
      "dataLimitations",
      "confidenceRationale",
    ],
  };
}

function extractOutputText(responseBody: unknown) {
  if (
    typeof responseBody === "object" &&
    responseBody !== null &&
    "output_text" in responseBody &&
    typeof responseBody.output_text === "string"
  ) {
    return responseBody.output_text;
  }

  const output = (responseBody as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";

  const chunks: string[] = [];
  for (const item of output) {
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      const maybeText = part as { text?: unknown; type?: unknown };
      if (typeof maybeText.text === "string") {
        chunks.push(maybeText.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

function validateParsedAnalysis(value: unknown) {
  const candidate = value as Partial<VacancyAiAnalysis>;
  if (
    typeof candidate.vacancyLikelihood !== "number" ||
    typeof candidate.riskLevel !== "string" ||
    typeof candidate.recommendedAction !== "string" ||
    typeof candidate.policyUse !== "string" ||
    !Array.isArray(candidate.fieldInspectionChecklist) ||
    !Array.isArray(candidate.evidenceSummary) ||
    !Array.isArray(candidate.dataLimitations) ||
    typeof candidate.confidenceRationale !== "string"
  ) {
    throw new Error("OpenAI response did not match the required schema");
  }

  return candidate as Omit<
    VacancyAiAnalysis,
    "mode" | "configured" | "model" | "generatedAt"
  >;
}

export async function analyzeVacancyCandidate(
  house: House,
): Promise<VacancyAiAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-5.5";

  if (!apiKey) {
    return createLocalAnalysis(
      house,
      "OPENAI_API_KEY가 없어 OpenAI Responses API 대신 로컬 정책 산식을 사용했습니다.",
    );
  }

  const priority = getPriorityProfile(house);
  const input = {
    candidate: safeHouseInput(house),
    localPriorityProfile: priority,
    policyContext: {
      client: "국토교통부 실서비스 PoC",
      goal: "미등록 또는 행정 확인 전 빈집 후보의 조사 우선순위와 정책 조치안 산정",
      privacyRule:
        "정확 지번, 소유자, 개인 연락처를 추정하거나 생성하지 말고 공개 데이터와 제공된 후보 속성만 사용",
    },
  };

  const body = {
    model,
    instructions:
      "당신은 국토교통부 빈집 후보 탐지 서비스의 정책 분석 엔진입니다. 제공된 공공데이터와 후보 속성만 근거로 한국어 JSON을 생성하세요. 확정 빈집이라고 단정하지 말고 현장조사 후보/우선순위 관점으로 표현하세요.",
    input: JSON.stringify(input),
    reasoning: { effort: "low" },
    text: {
      format: {
        type: "json_schema",
        name: "vacant_house_policy_analysis",
        strict: true,
        schema: jsonSchema(),
      },
    },
    max_output_tokens: 1200,
  };

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return createLocalAnalysis(
        house,
        `OpenAI Responses API 호출 실패: HTTP ${response.status}`,
      );
    }

    const responseBody = await response.json();
    const outputText = extractOutputText(responseBody);
    const parsed = validateParsedAnalysis(JSON.parse(outputText));

    return {
      ...parsed,
      vacancyLikelihood: clamp(parsed.vacancyLikelihood),
      mode: "openai_responses",
      configured: true,
      model,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return createLocalAnalysis(
      house,
      `OpenAI 분석 파싱 또는 네트워크 오류로 로컬 정책 산식을 사용했습니다: ${message}`,
    );
  }
}
