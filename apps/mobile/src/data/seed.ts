import type { CalendarData, DailyContext } from "@datemine/domain";

/**
 * Seed published data (Layer 2 — no personal names). A handful of hand-written cards
 * so the app renders today. The full ~3,650-card dataset is curated later (P2) through
 * the ingest→review pipeline; the app reads it the same way regardless of size.
 *
 * Keyed by "MM-DD" because these are recurring annual events.
 */
export const seedCardsByMonthDay: Readonly<Record<string, Omit<DailyContext, "date">>> = {
  "03-01": {
    dayType: "holiday",
    significance: "삼일절. 독립운동 정신을 기리는 국경일. 반일·역사 감수성이 가장 예민한 날.",
    advice: "국경일 콘텐츠에 일본풍 이미지 섞지 마라. 벚꽃·후지산 한 컷이 역사 인식 논란을 부른다.",
    riskPatterns: [
      {
        pattern: "국경일 콘텐츠·홍보물에 일본 상징물 배치",
        whyItBackfires:
          "삼일절·광복절엔 대중의 역사 감수성이 최고조다. 후지산·벚꽃·기모노 등이 국경일 옆에 놓이면 검수 부재로 읽힌다.",
        exampleSummary:
          "한 기관의 홍보물이 국경일 지면에 일본 상징 이미지를 배치했다가 역사 인식 논란으로 사과한 사례가 반복됐다.",
        severity: 3,
        category: "nationalism",
        domains: ["business", "media", "general"],
      },
    ],
    reviewedAt: "2026-08-16T00:00:00Z",
  },
  "04-01": {
    dayType: "anniversary",
    significance: "만우절. 장난·거짓 콘셉트 마케팅이 쏟아지는 날. 시국을 잘못 읽으면 바로 역풍.",
    advice:
      "장난은 치되 민감 시국엔 접어라. 재난·참사·감염병 국면의 만우절 농담은 조롱으로 읽힌다.",
    riskPatterns: [
      {
        pattern: "민감 시국에 강행하는 거짓말·장난성 마케팅",
        whyItBackfires:
          "만우절 장난은 평시엔 재치지만, 재난·추모·감염병 국면에선 '분위기 파악 실패'로 뒤집힌다. SNS 게시물은 뒤늦게 지워도 박제된다.",
        exampleSummary:
          "민감한 시기에 강행한 장난성 공지·이벤트가 부적절 논란으로 사과·철회된 사례가 반복됐다.",
        severity: 2,
        category: "ad",
        domains: ["business", "creator", "media"],
      },
    ],
    reviewedAt: "2026-08-16T00:00:00Z",
  },
  "06-06": {
    dayType: "memorial",
    significance: "현충일. 순국선열·전몰장병을 추모하는 날. 추모 분위기를 존중해야 한다.",
    advice: "오늘은 할인·이벤트·밝은 프로모션 자제. 추모일에 축제 톤은 곧바로 역풍이다.",
    riskPatterns: [
      {
        pattern: "추모일에 할인·이벤트·경축성 프로모션 진행",
        whyItBackfires:
          "추모일의 대중 정서는 엄숙이다. 상업적 축제 톤은 '날의 의미를 모른다'는 비판으로 직결된다.",
        exampleSummary:
          "추모일에 밝은 톤의 프로모션·이벤트를 진행했다가 부적절 논란으로 게시물을 내린 사례가 반복됐다.",
        severity: 2,
        category: "disaster",
        domains: ["business", "creator", "general"],
      },
    ],
    reviewedAt: "2026-08-16T00:00:00Z",
  },
  "08-15": {
    dayType: "holiday",
    significance: "1945년 광복. 매년 이맘때 가문·집안 내력을 자랑하다 친일 이력이 검증대에 오른다.",
    advice: "오늘은 집안 자랑 접어라. 조상 미화 한마디가 파묘의 신호탄이 된다.",
    riskPatterns: [
      {
        pattern: "가문·조상·명문가 미화 발언",
        whyItBackfires:
          "광복절 전후엔 대중이 유명인의 가족사를 역으로 검증한다. 미화가 클수록 반작용도 크다.",
        exampleSummary:
          "한 방송 출연자가 명문가 내력을 자랑했다가 선대의 친일 행적이 드러나 여론이 악화된 사례가 반복됐다.",
        severity: 3,
        category: "history",
        domains: ["general", "entertainment", "politics"],
      },
      {
        pattern: "국경일 마케팅에 일본풍 콘셉트·상징 사용",
        whyItBackfires:
          "광복절엔 반일 정서가 강해진다. 일본풍 이벤트·의상·상징은 시의성 검수 실패로 비친다.",
        exampleSummary:
          "광복절 시기 일본풍 콘셉트의 행사·게시물이 부적절 논란으로 번진 사례가 반복됐다.",
        severity: 2,
        category: "nationalism",
        domains: ["business", "creator", "media"],
      },
    ],
    reviewedAt: "2026-08-10T00:00:00Z",
  },
  "07-17": {
    dayType: "solarTerm",
    significance: "초복. 삼복더위의 시작. 보양·먹방 콘텐츠가 몰린다.",
    advice: "보양식 콘텐츠 낼 거면 동물권·혐오 표현 조심. 자극적 먹방이 역풍 맞는 시기다.",
    riskPatterns: [
      {
        pattern: "특정 식문화 조롱·동물권 자극 발언",
        whyItBackfires:
          "복날엔 식문화 논쟁이 과열된다. 어느 편이든 단정적 조롱은 양쪽에서 공격받는다.",
        exampleSummary:
          "복날 즈음 식문화를 단정적으로 비하한 발언이 광범위한 반발을 부른 사례가 반복됐다.",
        severity: 2,
        category: "food",
        domains: ["creator", "entertainment"],
      },
    ],
    reviewedAt: "2026-07-10T00:00:00Z",
  },
};

/** Calendar backbone for the daily-content guarantee (fallback when no card exists). */
export const seedCalendar: CalendarData = {
  fixedEvents: [
    {
      month: 3,
      day: 1,
      dayType: "holiday",
      name: "삼일절",
      significance: "1919년 3·1 독립운동을 기리는 국경일.",
    },
    {
      month: 4,
      day: 1,
      dayType: "anniversary",
      name: "만우절",
      significance: "장난·거짓 콘셉트가 쏟아지는 날.",
    },
    {
      month: 6,
      day: 6,
      dayType: "memorial",
      name: "현충일",
      significance: "순국선열과 전몰장병을 추모하는 날.",
    },
    {
      month: 8,
      day: 15,
      dayType: "holiday",
      name: "광복절",
      significance: "1945년 광복을 기념하는 국경일.",
    },
  ],
  solarTermsByYear: {
    2026: {
      "2026-07-17": { name: "초복", significance: "삼복더위의 시작." },
    },
  },
  // Lunar holidays shift each year; solar dates are supplied per year (like solar terms).
  lunarHolidaysByYear: {
    2026: {
      "2026-02-17": {
        name: "설날",
        significance: "음력 새해. 가족이 모이며 성역할·잔소리 갈등이 반복된다.",
        dayType: "holiday",
        lunarKey: "seollal",
      },
      "2026-09-25": {
        name: "추석",
        significance: "한가위. 차례·명절 노동의 성역할과 세대 잔소리가 반복된다.",
        dayType: "holiday",
        lunarKey: "chuseok",
      },
      "2026-03-03": {
        name: "정월대보름",
        significance: "음력 첫 보름. 달집·쥐불놀이 등 불놀이 풍속과 산불철이 겹친다.",
        dayType: "holiday",
        lunarKey: "daeboreum",
      },
      "2026-05-24": {
        name: "부처님오신날",
        significance: "석가탄신일. 봉축 시즌의 종교 감수성이 예민해진다.",
        dayType: "holiday",
        lunarKey: "buddha",
      },
      "2026-08-19": {
        name: "칠석",
        significance: "음력 7월 7일. 견우직녀 세시명절이 '한국판 발렌타인'으로 상업화된다.",
        dayType: "holiday",
        lunarKey: "chilseok",
      },
    },
  },
};

/**
 * Published cards for lunar holidays, keyed by stable lunarKey (not date) so they hold
 * across years even though the solar date moves.
 */
export const seedCardsByLunarKey: Readonly<Record<string, Omit<DailyContext, "date">>> = {
  seollal: lunarFamilyCard("설날"),
  chuseok: lunarFamilyCard("추석"),
};

function lunarFamilyCard(name: string): Omit<DailyContext, "date"> {
  return {
    dayType: "holiday",
    significance: `${name}. 가족이 모이는 명절엔 성역할·잔소리 콘텐츠가 매년 논란이 된다.`,
    advice: `${name} 콘텐츠 낼 거면 "며느리=주방", 취업·결혼 잔소리 밈은 접어라. 공감보다 피로가 먼저 온다.`,
    riskPatterns: [
      {
        pattern: "명절 성역할 고정 재현(며느리 노동·주방)",
        whyItBackfires:
          "명절 노동의 성 편중은 이미 사회 쟁점이다. 광고·콘텐츠가 이를 당연시하면 성차별 재현으로 비판받는다.",
        exampleSummary:
          "명절 광고가 여성을 가사·주방 담당으로만 그렸다가 성차별 논란으로 비판받은 사례가 반복됐다.",
        severity: 3,
        category: "gender",
        domains: ["business", "media", "general"],
      },
      {
        pattern: "취업·결혼·출산 '명절 잔소리' 소재의 무신경한 활용",
        whyItBackfires:
          "잔소리는 세대갈등의 상징이 됐다. 가볍게 웃음 소재로 쓰면 당사자 세대엔 조롱·압박으로 읽힌다.",
        exampleSummary:
          "명절 잔소리를 소재로 한 콘텐츠가 세대 감수성 부족으로 역풍을 맞은 사례가 반복됐다.",
        severity: 2,
        category: "generation",
        domains: ["creator", "media", "general"],
      },
    ],
    reviewedAt: "2026-08-16T00:00:00Z",
  };
}
