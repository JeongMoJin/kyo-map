// 공가지도 샘플 빈집 데이터 생성 스크립트
// AI 도구: ViT(위성영상 분류), LSTM(전력사용 학습), GPT-4o(용도 추천) — 개념적 파이프라인
import fs from "node:fs";
import path from "node:path";

const REGIONS = [
  // 경북 (20%) — 지방소멸 핵심
  { sido: "경상북도", sigungu: "의성군", eupmyeon: ["봉양면", "단촌면", "점곡면", "사곡면", "옥산면", "춘산면"], lat: 36.35, lng: 128.70, weight: 7 },
  { sido: "경상북도", sigungu: "영양군", eupmyeon: ["영양읍", "일월면", "입암면", "석보면", "청기면"], lat: 36.67, lng: 129.11, weight: 5 },
  { sido: "경상북도", sigungu: "봉화군", eupmyeon: ["봉화읍", "물야면", "춘양면", "법전면", "재산면"], lat: 36.89, lng: 128.73, weight: 4 },
  { sido: "경상북도", sigungu: "청송군", eupmyeon: ["청송읍", "부남면", "현동면", "현서면"], lat: 36.43, lng: 129.05, weight: 4 },
  // 전남 (20%)
  { sido: "전라남도", sigungu: "고흥군", eupmyeon: ["고흥읍", "도양읍", "풍양면", "도화면", "점암면"], lat: 34.60, lng: 127.29, weight: 6 },
  { sido: "전라남도", sigungu: "장흥군", eupmyeon: ["장흥읍", "관산읍", "대덕읍", "용산면", "안양면"], lat: 34.68, lng: 126.91, weight: 5 },
  { sido: "전라남도", sigungu: "곡성군", eupmyeon: ["곡성읍", "오곡면", "삼기면", "석곡면"], lat: 35.28, lng: 127.29, weight: 4 },
  { sido: "전라남도", sigungu: "구례군", eupmyeon: ["구례읍", "문척면", "간전면", "토지면"], lat: 35.20, lng: 127.46, weight: 5 },
  // 강원 (20%)
  { sido: "강원특별자치도", sigungu: "정선군", eupmyeon: ["정선읍", "고한읍", "사북읍", "남면", "북평면"], lat: 37.38, lng: 128.66, weight: 6 },
  { sido: "강원특별자치도", sigungu: "평창군", eupmyeon: ["평창읍", "미탄면", "방림면", "대화면", "봉평면"], lat: 37.37, lng: 128.39, weight: 5 },
  { sido: "강원특별자치도", sigungu: "영월군", eupmyeon: ["영월읍", "상동읍", "주천면", "한반도면"], lat: 37.18, lng: 128.46, weight: 5 },
  { sido: "강원특별자치도", sigungu: "양양군", eupmyeon: ["양양읍", "서면", "손양면", "현북면"], lat: 38.08, lng: 128.62, weight: 4 },
  // 충북 (20%)
  { sido: "충청북도", sigungu: "단양군", eupmyeon: ["단양읍", "매포읍", "대강면", "가곡면", "영춘면"], lat: 36.98, lng: 128.37, weight: 6 },
  { sido: "충청북도", sigungu: "괴산군", eupmyeon: ["괴산읍", "감물면", "장연면", "연풍면", "칠성면"], lat: 36.81, lng: 127.79, weight: 5 },
  { sido: "충청북도", sigungu: "보은군", eupmyeon: ["보은읍", "속리산면", "장안면", "마로면"], lat: 36.49, lng: 127.73, weight: 5 },
  { sido: "충청북도", sigungu: "옥천군", eupmyeon: ["옥천읍", "동이면", "안남면", "청산면"], lat: 36.31, lng: 127.57, weight: 4 },
  // 기타·수도권 (20%)
  { sido: "전라북도", sigungu: "무주군", eupmyeon: ["무주읍", "무풍면", "설천면", "부남면"], lat: 36.00, lng: 127.66, weight: 3 },
  { sido: "전라북도", sigungu: "장수군", eupmyeon: ["장수읍", "산서면", "번암면", "계남면"], lat: 35.65, lng: 127.52, weight: 3 },
  { sido: "경상남도", sigungu: "의령군", eupmyeon: ["의령읍", "칠곡면", "대의면", "가례면"], lat: 35.32, lng: 128.26, weight: 3 },
  { sido: "경상남도", sigungu: "합천군", eupmyeon: ["합천읍", "봉산면", "묘산면", "가야면"], lat: 35.57, lng: 128.17, weight: 3 },
  { sido: "인천광역시", sigungu: "강화군", eupmyeon: ["강화읍", "길상면", "삼산면", "서도면"], lat: 37.75, lng: 126.48, weight: 2 },
  { sido: "경기도", sigungu: "연천군", eupmyeon: ["연천읍", "백학면", "미산면", "신서면"], lat: 38.08, lng: 127.08, weight: 2 },
  { sido: "제주특별자치도", sigungu: "서귀포시", eupmyeon: ["성산읍", "표선면", "남원읍"], lat: 33.31, lng: 126.67, weight: 2 },
];

const SURNAMES_RI = ["화전리", "도동리", "신평리", "대흥리", "월곡리", "송정리", "상촌리", "하촌리", "수양리", "백운리", "청림리", "죽전리", "용흥리", "금곡리", "만수리", "덕산리", "평촌리", "장수리", "내동리", "외동리"];

const USAGE_TYPES = ["주거", "상업", "농가주택"];
const OWNER_TYPES = ["개인", "개인", "개인", "지자체", "기타"]; // 개인 비중 높게

const REASON_TEMPLATES = {
  귀촌: [
    "지난 11개월간 전력사용량이 월평균 2kWh 이하로 유지되어 실거주 가능성이 매우 낮습니다. 인근 관광자원과 인접해 {use} 용도로 재생을 추천합니다.",
    "건물 외벽 구조는 양호하나 최근 18개월간 인입 전력이 전무한 상태입니다. 교통 접근성과 마을 커뮤니티를 고려할 때 {use} 후보지로 적합합니다.",
    "위성영상 분석 결과 지붕 손상률 12% 이하, 주변 농경지 휴경률 45%. 소규모 리모델링으로 {use} 활용이 가능할 것으로 판단됩니다.",
    "건축대장상 최근 소유권 변동이 없고 수도 사용량도 0에 수렴합니다. 정주 여건 개선 후 {use} 프로그램 연계가 유효합니다.",
  ],
  창업: [
    "지방 구도심 상권 내 공실로, 도보 5분 거리에 주민센터·시장이 위치합니다. 청년창업 공간 또는 로컬 브랜드 거점({use})으로 재생 가치가 높습니다.",
    "과거 점포로 이용된 이력이 있으며 간판·셔터 노후화가 확인됩니다. 리모델링 후 카페·공방 등 {use} 시설 전환이 유망합니다.",
    "고속도로 IC 접근성이 우수하고 유동인구 회복세가 관측됩니다. 농산물 판매·체험형 {use} 공간으로의 활용을 추천합니다.",
  ],
  철거: [
    "위성영상 분석 결과 지붕 붕괴율 38%, 주변 식생 침투율이 임계치를 초과했습니다. 붕괴위험 안심구역 내 위치해 {use} 우선 검토가 필요합니다.",
    "건축물 노후도 지수 4등급, 최근 재해 이력이 있는 경사지에 위치합니다. 안전을 고려한 {use} 및 공유지 전환을 권고합니다.",
    "구조 안전진단상 D등급 판정 가능성이 높고, 인접 가옥과의 이격거리도 법정 기준 미만입니다. 정비 및 {use}가 가장 합리적 선택으로 판단됩니다.",
  ],
};

// 간단 seeded PRNG로 재현성 확보
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260417);
const rInt = (a, b) => Math.floor(rand() * (b - a + 1)) + a;
const rFloat = (a, b) => rand() * (b - a) + a;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

// 가중치 기반 지역 선택
const regionPool = [];
REGIONS.forEach((r) => {
  for (let i = 0; i < r.weight; i++) regionPool.push(r);
});

function generatePowerUsage(recommendedUse) {
  // 빈집 신호: 최근 6~12개월 전력 사용량이 0에 가깝게 떨어짐
  const arr = [];
  const emptyMonths = recommendedUse === "철거" ? 12 : rInt(6, 11);
  const baseLoad = recommendedUse === "창업" ? rFloat(8, 25) : rFloat(15, 45);
  for (let i = 0; i < 12; i++) {
    if (i >= 12 - emptyMonths) {
      arr.push(Math.round(rFloat(0, 2.5) * 10) / 10);
    } else {
      arr.push(Math.round(baseLoad * rFloat(0.7, 1.2) * 10) / 10);
    }
  }
  return arr;
}

function decideRecommendation(region, buildYear, usageType) {
  const r = rand();
  // 경상북도 쏠림 + 농가주택 + 오래된 건물일수록 귀촌
  if (usageType === "상업") return r < 0.85 ? "창업" : "철거";
  if (buildYear < 1975 && r < 0.35) return "철거";
  if (usageType === "농가주택") return r < 0.85 ? "귀촌" : "철거";
  return r < 0.55 ? "귀촌" : r < 0.8 ? "창업" : "철거";
}

const houses = [];
for (let i = 1; i <= 100; i++) {
  const region = pick(regionPool);
  const eup = pick(region.eupmyeon);
  const ri = pick(SURNAMES_RI);
  const bun = `${rInt(1, 899)}-${rInt(1, 40)}`;

  // 지역 중심에서 ±0.08도 내로 랜덤 분산
  const lat = +(region.lat + rFloat(-0.08, 0.08)).toFixed(6);
  const lng = +(region.lng + rFloat(-0.08, 0.08)).toFixed(6);

  const buildYear = rInt(1960, 2005);
  const area = rInt(45, 180);
  const usageType = rand() < 0.55 ? "농가주택" : rand() < 0.7 ? "주거" : "상업";
  const ownerType = pick(OWNER_TYPES);
  const recommendedUse = decideRecommendation(region, buildYear, usageType);
  const isDisasterZone = recommendedUse === "철거" ? rand() < 0.75 : rand() < 0.08;
  const aiConfidence = +(recommendedUse === "철거" ? rFloat(0.82, 0.99) : rFloat(0.6, 0.96)).toFixed(2);
  const powerUsage = generatePowerUsage(recommendedUse);
  const nearestIC = +rFloat(0.5, 15).toFixed(1);
  const nearestStation = +rFloat(1, 30).toFixed(1);

  const useLabelForReason =
    recommendedUse === "귀촌"
      ? pick(["귀촌·농촌 민박", "청년 귀촌 타운하우스", "농촌 체험·숙박"])
      : recommendedUse === "창업"
        ? pick(["로컬 창업·카페", "지역 공방·갤러리", "소규모 공유오피스"])
        : pick(["철거 및 안전 정비", "소공원 조성", "마을쉼터 전환"]);
  const reason = pick(REASON_TEMPLATES[recommendedUse]).replace("{use}", useLabelForReason);

  houses.push({
    id: `H${String(i).padStart(5, "0")}`,
    lat,
    lng,
    address: `${region.sido} ${region.sigungu} ${eup} ${ri} ${bun}`,
    buildYear,
    area,
    usageType,
    ownerType,
    aiConfidence,
    recommendedUse,
    reason,
    isDisasterZone,
    powerUsage,
    nearestIC,
    nearestStation,
  });
}

const outDir = path.join(process.cwd(), "data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "houses.json"), JSON.stringify(houses, null, 2), "utf8");
console.log(`Generated ${houses.length} houses -> data/houses.json`);
