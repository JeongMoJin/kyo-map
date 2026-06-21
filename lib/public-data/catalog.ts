export const YEONGJU_VACANT_HOUSE_FILE_URL =
  "https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000003185907&fileDetailSn=1&insertDataPrcus=N";

export const YEONGJU_VACANT_HOUSE_API_URL =
  "https://api.odcloud.kr/api/15144406/v1/uddi:601778db-fb09-4eed-bc35-c502c972364c";

export interface PublicDataSource {
  key: string;
  name: string;
  provider: string;
  basisDate?: string;
  updateCycle?: string;
  sourceUrl: string;
  apiUrl?: string;
  fileUrl?: string;
  requiresKey: boolean;
  serviceRole: string;
  privacyNote: string;
}

export const PUBLIC_DATA_SOURCES: PublicDataSource[] = [
  {
    key: "yeongju-vacant-house",
    name: "경상북도 영주시_빈집 현황",
    provider: "경상북도 영주시",
    basisDate: "2025-07-10",
    updateCycle: "연간",
    sourceUrl: "https://www.data.go.kr/data/15144406/fileData.do",
    apiUrl: YEONGJU_VACANT_HOUSE_API_URL,
    fileUrl: YEONGJU_VACANT_HOUSE_FILE_URL,
    requiresKey: false,
    serviceRole:
      "공개 가능한 읍면동/리/등급/면적 단위 빈집 현황을 직접 수집해 후보군 집계와 현장조사 우선순위 산정에 사용합니다.",
    privacyNote:
      "정확 지번과 소유자 정보는 공개 데이터에서 제외되어 공개 화면에는 리 단위 후보군으로만 표시합니다.",
  },
  {
    key: "building-hub-ledger",
    name: "국토교통부_건축HUB_건축물대장정보",
    provider: "국토교통부",
    sourceUrl: "https://www.data.go.kr/data/15134735/openapi.do",
    requiresKey: true,
    serviceRole:
      "건축연도, 용도, 구조, 면적 등 건축물 속성을 결합해 위험도와 재생 가능성을 보정합니다.",
    privacyNote:
      "개별 필지 기반 내부 검토용으로 사용하며 공개 화면에는 필요한 최소 속성만 노출합니다.",
  },
  {
    key: "legal-dong-code",
    name: "법정동 코드 정보",
    provider: "행정안전부",
    sourceUrl: "https://www.data.go.kr/data/15077871/openapi.do",
    requiresKey: true,
    serviceRole:
      "주소 정규화, 지자체 단위 집계, 건축물대장/공간정보 조인을 위한 기준 코드로 사용합니다.",
    privacyNote: "행정구역 코드성 데이터로 개인정보 위험은 낮습니다.",
  },
  {
    key: "kpx-power-usage",
    name: "한국전력 용도업종별 전력사용량",
    provider: "한국전력공사",
    sourceUrl: "https://www.data.go.kr/data/15147130/openapi.do",
    requiresKey: true,
    serviceRole:
      "장기 저사용 패턴을 빈집 후보 검증 신호로 사용합니다. 실제 운영에서는 가명/집계 단위 계약이 필요합니다.",
    privacyNote:
      "개별 계량기 데이터는 민감도가 높아 가명정보 결합 또는 집계 단위만 사용해야 합니다.",
  },
  {
    key: "ngii-vworld-imagery",
    name: "국토지리정보원 항공/위성 영상 및 VWorld 공간정보",
    provider: "국토지리정보원/VWorld",
    sourceUrl: "https://www.vworld.kr/dtmk/dtmk_ntads_s002.do",
    requiresKey: true,
    serviceRole:
      "건축물 외형 변화, 지붕 손상, 식생 침투 등 영상 기반 빈집 후보 신호를 추출합니다.",
    privacyNote:
      "공개 공간영상 기반 분석이며 개인 식별 목적 분석은 금지합니다.",
  },
];

export const INTEGRATION_ENV_KEYS = [
  {
    key: "OPENAI_API_KEY",
    label: "OpenAI Responses API",
    purpose: "후보지 위험도, 우선순위, 정책 조치안을 구조화 JSON으로 분석합니다.",
    requiredForProduction: true,
  },
  {
    key: "OPENAI_MODEL",
    label: "OpenAI model",
    purpose: "운영 모델명을 지정합니다. 미설정 시 서버 기본값을 사용합니다.",
    requiredForProduction: false,
  },
  {
    key: "DATA_GO_KR_SERVICE_KEY",
    label: "공공데이터포털 API key",
    purpose: "ODCloud JSON API와 건축물대장/법정동 API 호출에 사용합니다.",
    requiredForProduction: true,
  },
  {
    key: "VWORLD_API_KEY",
    label: "VWorld API key",
    purpose: "공간정보/영상/지오코딩 연계에 사용합니다.",
    requiredForProduction: true,
  },
  {
    key: "KAKAO_REST_API_KEY",
    label: "Kakao local API key",
    purpose: "주소 지오코딩 보조 채널로 사용합니다.",
    requiredForProduction: false,
  },
] as const;
