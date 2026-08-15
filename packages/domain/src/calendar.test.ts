import { describe, expect, it } from "vitest";
import { type CalendarData, resolveDay, toIsoDate } from "./calendar";
import { type DailyContext, isPublishable } from "./published";

const data: CalendarData = {
  fixedEvents: [
    {
      month: 8,
      day: 15,
      dayType: "holiday",
      name: "광복절",
      significance: "1945년 광복. 매년 이맘때 가문·조상 미화 발언이 검증대에 오른다.",
    },
  ],
  solarTermsByYear: {
    2026: {
      "2026-07-17": { name: "초복", significance: "삼복더위의 시작." },
    },
  },
  lunarHolidaysByYear: {
    2026: {
      "2026-09-25": {
        name: "추석",
        significance: "한가위. 성역할·잔소리 논란이 반복된다.",
        dayType: "holiday",
        lunarKey: "chuseok",
      },
    },
  },
};

describe("resolveDay — daily-content guarantee", () => {
  it("resolves a fixed named event", () => {
    const entry = resolveDay("2026-08-15", data);
    expect(entry.dayType).toBe("holiday");
    expect(entry.name).toBe("광복절");
  });

  it("resolves a solar term when no fixed event matches", () => {
    const entry = resolveDay("2026-07-17", data);
    expect(entry.dayType).toBe("solarTerm");
    expect(entry.name).toBe("초복");
  });

  it("resolves a lunar holiday by its per-year solar date and exposes lunarKey", () => {
    const entry = resolveDay("2026-09-25", data);
    expect(entry.name).toBe("추석");
    expect(entry.lunarKey).toBe("chuseok");
  });

  it("never returns an empty day — ordinary fallback always has content", () => {
    // Sweep a full year: every day must resolve to a non-empty entry.
    const start = new Date(2026, 0, 1);
    for (let i = 0; i < 365; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const entry = resolveDay(toIsoDate(d), data);
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.significance.length).toBeGreaterThan(0);
    }
  });

  it("falls back to ordinary for a plain day", () => {
    const entry = resolveDay("2026-03-03", data);
    expect(entry.dayType).toBe("ordinary");
  });
});

describe("isPublishable — review gate", () => {
  const base: DailyContext = {
    date: "2026-08-15",
    dayType: "holiday",
    significance: "…",
    riskPatterns: [],
    advice: "오늘은 집안 자랑 접어라.",
  };

  it("blocks content that has not passed the review gate", () => {
    expect(isPublishable(base)).toBe(false);
  });

  it("allows content once reviewed", () => {
    expect(isPublishable({ ...base, reviewedAt: "2026-08-14T00:00:00Z" })).toBe(true);
  });
});
