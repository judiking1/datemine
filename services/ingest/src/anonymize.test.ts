import { describe, expect, it } from "vitest";
import { toRiskPattern } from "./anonymize";
import type { RawCaseRecord } from "./raw";

const rawCase: RawCaseRecord = {
  id: "c1",
  occurredOn: "2026-08-07",
  category: "history",
  domains: ["entertainment", "general"],
  who: "홍길동", // internal-only real name
  what: "가문 자랑",
  consequence: "친일 이력 검증으로 여론 악화",
  sources: ["https://example.com/a", "https://example.com/b"],
  recurrence: "08-15",
};

describe("toRiskPattern — anonymization", () => {
  it("produces a published pattern with no name and carries tags", () => {
    const pattern = toRiskPattern([rawCase], {
      pattern: "가문·조상 미화 발언",
      whyItBackfires: "검증대에 오른다.",
      exampleSummary: "한 출연자가 가문을 자랑했다가 선대 이력이 드러난 사례가 반복됐다.",
      severity: 3,
    });
    expect(pattern.category).toBe("history");
    expect(pattern.domains).toEqual(["entertainment", "general"]);
    expect(pattern.severity).toBe(3);
  });

  it("throws loudly if a real name leaks into published text", () => {
    expect(() =>
      toRiskPattern([rawCase], {
        pattern: "가문 미화",
        whyItBackfires: "홍길동 사례처럼 검증된다.", // leak
        exampleSummary: "요약",
        severity: 2,
      }),
    ).toThrow(/Anonymization leak/);
  });
});
