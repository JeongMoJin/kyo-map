import type { HouseRecord } from "@/lib/house-service";
import { USE_LABELS } from "@/lib/types";

type RecommendationSource = "openai" | "local-fallback";

export interface AiRecommendation {
  source: RecommendationSource;
  model: string;
  summary: string;
  recommendedAction: string;
  checklist: string[];
  caveats: string[];
  generatedAt: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  warning?: string;
}

interface OpenAiResponseData {
  status?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
}

interface RecommendationPayload {
  summary?: unknown;
  recommendedAction?: unknown;
  checklist?: unknown;
  caveats?: unknown;
}

const DEFAULT_MODEL = "gpt-5-nano";
const DEFAULT_MAX_OUTPUT_TOKENS = 500;

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "recommendedAction", "checklist", "caveats"],
  properties: {
    summary: {
      type: "string",
      description: "공가 후보의 핵심 판단을 한국어 1~2문장으로 요약합니다.",
    },
    recommendedAction: {
      type: "string",
      description: "담당자가 바로 실행할 다음 행정 조치 1개를 제안합니다.",
    },
    checklist: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      items: { type: "string" },
      description: "현장 확인 또는 행정 검토 체크리스트입니다.",
    },
    caveats: {
      type: "array",
      minItems: 2,
      maxItems: 3,
      items: { type: "string" },
      description: "오판 방지와 데이터 한계를 적습니다.",
    },
  },
};

export async function createAiRecommendation(
  record: HouseRecord,
): Promise<AiRecommendation> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = getOpenAiModel();
  const generatedAt = new Date().toISOString();

  if (!apiKey) {
    return createLocalFallback(record, model, generatedAt, "OPENAI_API_KEY 미설정");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "developer",
            content: [
              {
                type: "input_text",
                text:
                  "당신은 지자체 빈집 후보 사전 스크리닝 보조 AI입니다. 빈집 확정, 법률 판단, 감정평가처럼 단정적인 표현을 피하고 현장 확인 전 참고 의견으로만 답하세요. 한국어로 간결하게 작성하세요.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify(buildRecommendationInput(record)),
              },
            ],
          },
        ],
        max_output_tokens: getMaxOutputTokens(),
        reasoning: { effort: "minimal" },
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "kyo_map_house_recommendation",
            strict: true,
            schema: responseSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      return createLocalFallback(
        record,
        model,
        generatedAt,
        `OpenAI 응답 실패 (${response.status})`,
      );
    }

    const data = (await response.json()) as OpenAiResponseData;
    const outputText = extractOutputText(data);
    const parsed = parseRecommendationPayload(outputText);

    if (!parsed) {
      return createLocalFallback(record, model, generatedAt, "OpenAI 응답 파싱 실패");
    }

    return {
      source: "openai",
      model,
      generatedAt,
      summary: sanitizeText(parsed.summary),
      recommendedAction: sanitizeText(parsed.recommendedAction),
      checklist: sanitizeList(parsed.checklist, [
        "건축물대장과 실제 이용 현황을 대조합니다.",
        "소유자 연락 가능 여부와 행정 협의 필요성을 확인합니다.",
        "전기 사용량 저하 원인을 현장에서 재확인합니다.",
      ]),
      caveats: sanitizeList(parsed.caveats, [
        "현재 결과는 현장조사 전 참고 의견입니다.",
        "샘플·가명 데이터 기반이므로 행정 확정 판단에 단독 사용하지 않습니다.",
      ]),
      usage: {
        inputTokens: data.usage?.input_tokens,
        outputTokens: data.usage?.output_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    };
  } catch {
    return createLocalFallback(record, model, generatedAt, "OpenAI 호출 예외");
  }
}

function getOpenAiModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

function getMaxOutputTokens() {
  const raw = Number(process.env.OPENAI_MAX_COMPLETION_TOKENS);
  if (!Number.isFinite(raw)) return DEFAULT_MAX_OUTPUT_TOKENS;
  return Math.max(200, Math.min(1200, Math.round(raw)));
}

function buildRecommendationInput(record: HouseRecord) {
  const { house, metrics, priority } = record;

  return {
    serviceContext:
      "공가지도 MVP의 빈집 후보 상세 화면. 현장조사 전 우선검토와 업무 배정을 돕는 참고 분석.",
    house: {
      id: house.id,
      address: house.address,
      buildYear: house.buildYear,
      age: metrics.age,
      areaSquareMeters: house.area,
      usageType: house.usageType,
      ownerType: house.ownerType,
      recommendedUse: USE_LABELS[house.recommendedUse],
      originalReason: house.reason,
      aiConfidencePercent: Math.round(house.aiConfidence * 100),
      isDisasterZone: house.isDisasterZone,
      nearestICKm: house.nearestIC,
      nearestStationKm: house.nearestStation,
    },
    power: {
      previousSixMonthAverageKwh: Number(metrics.previousPowerAverage.toFixed(1)),
      recentSixMonthAverageKwh: Number(metrics.recentPowerAverage.toFixed(1)),
      dropRatePercent: Math.round(metrics.powerDropRate * 100),
    },
    priority: {
      score: priority.priorityScore,
      safetyRisk: priority.safetyRisk,
      regenerationFit: priority.regenerationFit,
      fieldCheckNeed: priority.fieldCheckNeed,
      department: priority.department,
      action: priority.actionLabel,
      urgency: priority.urgencyLabel,
      evidence: priority.evidence,
    },
    outputContract:
      "JSON only. summary, recommendedAction, checklist, caveats 키를 반드시 포함.",
  };
}

function extractOutputText(data: OpenAiResponseData) {
  const textParts: string[] = [];

  for (const item of data.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        textParts.push(content.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

function parseRecommendationPayload(text: string): RecommendationPayload | null {
  if (!text) return null;

  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as RecommendationPayload;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]) as RecommendationPayload;
    } catch {
      return null;
    }
  }
}

function sanitizeText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, 240);
}

function sanitizeList(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;

  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => sanitizeText(item))
    .filter(Boolean)
    .slice(0, 4);

  return cleaned.length ? cleaned : fallback;
}

function createLocalFallback(
  record: HouseRecord,
  model: string,
  generatedAt: string,
  warning: string,
): AiRecommendation {
  const { house, metrics, priority } = record;
  const useLabel = USE_LABELS[house.recommendedUse];
  const powerDropPercent = Math.round(metrics.powerDropRate * 100);

  return {
    source: "local-fallback",
    model,
    generatedAt,
    warning,
    summary: `${house.address} 후보는 ${useLabel} 활용 가능성이 높은 사전 검토 대상입니다. 최근 전력 평균은 ${metrics.recentPowerAverage.toFixed(
      1,
    )}kWh이며 AI 후보 신뢰도는 ${Math.round(house.aiConfidence * 100)}%입니다.`,
    recommendedAction: `${priority.department}에서 ${priority.actionLabel}을 진행하고, ${priority.urgencyLabel} 기준으로 현장 확인 일정을 잡습니다.`,
    checklist: [
      `건축물대장 용도(${house.usageType})와 실제 이용 흔적을 대조`,
      `최근 전력 사용 감소율 ${powerDropPercent}%의 원인 확인`,
      house.isDisasterZone
        ? "안심구역 중첩 여부와 구조 안전 위험을 우선 점검"
        : "진입로, 인근 교통, 생활 인프라 상태 확인",
      "소유자 연락 가능 여부와 활용·정비 동의 가능성 확인",
    ],
    caveats: [
      "이 결과는 현장조사 전 참고용 사전 스크리닝입니다.",
      "전력·위성·행정 데이터는 시차와 누락 가능성이 있어 단독 확정 근거로 사용할 수 없습니다.",
    ],
  };
}
