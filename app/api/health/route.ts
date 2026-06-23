import { getAiRuntimeStatus } from "@/lib/ai-recommendation";
import { HOUSES } from "@/lib/houses";

export async function GET() {
  const ai = getAiRuntimeStatus();
  const checks = [
    {
      name: "sample-data",
      ok: HOUSES.length > 0,
      detail: `${HOUSES.length} candidates loaded`,
    },
    {
      name: "openai",
      ok: ai.openAiConfigured,
      detail: ai.openAiConfigured
        ? `${ai.model} configured`
        : "OPENAI_API_KEY missing; local fallback enabled",
    },
  ];
  const degraded = checks.some((check) => !check.ok);

  return Response.json({
    ok: true,
    status: degraded ? "degraded" : "ok",
    service: "gonggajido",
    dataSource: "sample-local",
    candidateCount: HOUSES.length,
    ai: {
      openAiConfigured: ai.openAiConfigured,
      model: ai.model,
      maxOutputTokens: ai.maxOutputTokens,
      timeoutMs: ai.timeoutMs,
    },
    checks,
    generatedAt: new Date().toISOString(),
  });
}
