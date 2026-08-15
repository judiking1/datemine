import type { CalendarData, DailyContext } from "@datemine/domain";

/**
 * Seed published data (Layer 2 — no personal names). A handful of hand-written cards
 * so the app renders today. The full ~3,650-card dataset is curated later (P2) through
 * the ingest→review pipeline; the app reads it the same way regardless of size.
 *
 * Keyed by "MM-DD" because these are recurring annual events.
 */
export const seedCardsByMonthDay: Readonly<Record<string, Omit<DailyContext, "date">>> = {
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
};
