import { describe, expect, it } from "vitest";
import { buildCellGrid, nextBatch, summarizeCoverage } from "./coverage";

describe("coverage model", () => {
  it("builds a full grid of dateKeys × all categories", () => {
    const grid = buildCellGrid(["08-15", "07-17"]);
    // 2 date keys × N categories, all unsurveyed.
    expect(grid.length % 2).toBe(0);
    expect(grid.every((c) => c.status === "unsurveyed")).toBe(true);
  });

  it("summarizes progress", () => {
    const grid = buildCellGrid(["08-15"]);
    const withOne = grid.map((c, i) => (i === 0 ? { ...c, status: "published" as const } : c));
    const report = summarizeCoverage(withOne);
    expect(report.published).toBe(1);
    expect(report.surveyed).toBe(1);
    expect(report.surveyedRatio).toBeGreaterThan(0);
  });

  it("nextBatch returns only unsurveyed cells up to the limit", () => {
    const grid = buildCellGrid(["08-15", "07-17"]);
    const batch = nextBatch(grid, 5);
    expect(batch.length).toBe(5);
    expect(batch.every((c) => c.status === "unsurveyed")).toBe(true);
  });
});
