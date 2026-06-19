export const OFFICIAL_EVIDENCE = [
  {
    eyebrow: "국가 통계",
    metric: "160만 호",
    title: "2024년 미거주 주택",
    detail:
      "통계청 인구주택총조사 기준 미거주 주택은 전체 주택의 8.0% 수준으로 집계되었습니다.",
    sourceName: "대한민국 정책브리핑",
    href: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156721680",
  },
  {
    eyebrow: "정책 격차",
    metric: "13만 호",
    title: "법적 빈집 관리 대상",
    detail:
      "국토연구원은 법적 빈집 규모를 약 13만 호로 제시하며, 행정 기준과 현장 체감 사이의 간극을 지적합니다.",
    sourceName: "국토연구원",
    href: "https://www.krihs.re.kr/boardDownload.es?bid=0008&list_no=398058&seq=1",
  },
  {
    eyebrow: "심사 정합성",
    metric: "AI 활용",
    title: "데이터 융합형 서비스",
    detail:
      "공모전 주제에 맞춰 공공데이터 융합과 AI 기반 후보 탐지 흐름을 서비스 구조로 구현했습니다.",
    sourceName: "국토교통 데이터 활용 경진대회",
    href: "https://www.bigdata-transportation.kr/pageant/dashboard/CMPE_000000000020042",
  },
] as const;

export const VALIDATION_STEPS = [
  "지자체 빈집대장과 탐지 후보 주소 매칭",
  "한전 가명 전력사용 패턴으로 장기 미거주 후보 검증",
  "현장 확인 결과를 학습 데이터로 환류해 AI 추정 기준 보정",
] as const;
