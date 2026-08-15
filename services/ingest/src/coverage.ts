import { RISK_CATEGORY, type RiskCategory } from "@datemine/domain";

/**
 * Coverage model: the survey unit is a cell = (dateKey × category). Every cell is
 * tracked so collection can guarantee no gaps and report progress. `dateKey` is either
 * a recurring "MM-DD" or a full "yyyy-mm-dd"; see docs/DATA-PIPELINE.md.
 */
export type CellStatus = "unsurveyed" | "surveyed-none" | "surveyed-issue" | "published";

export interface CoverageCell {
  readonly dateKey: string;
  readonly category: RiskCategory;
  readonly status: CellStatus;
}

export interface CoverageReport {
  readonly total: number;
  readonly surveyed: number;
  readonly published: number;
  /** 0..1 fraction of cells surveyed at least once. */
  readonly surveyedRatio: number;
}

const ALL_CATEGORIES = Object.keys(RISK_CATEGORY) as RiskCategory[];

/** Build the full unsurveyed cell grid for a set of date keys × all categories. */
export function buildCellGrid(dateKeys: readonly string[]): CoverageCell[] {
  const cells: CoverageCell[] = [];
  for (const dateKey of dateKeys) {
    for (const category of ALL_CATEGORIES) {
      cells.push({ dateKey, category, status: "unsurveyed" });
    }
  }
  return cells;
}

export function summarizeCoverage(cells: readonly CoverageCell[]): CoverageReport {
  const total = cells.length;
  let surveyed = 0;
  let published = 0;
  for (const cell of cells) {
    if (cell.status !== "unsurveyed") surveyed++;
    if (cell.status === "published") published++;
  }
  return {
    total,
    surveyed,
    published,
    surveyedRatio: total === 0 ? 0 : surveyed / total,
  };
}

/** Cells still needing a first survey — the next batch targets. */
export function nextBatch(cells: readonly CoverageCell[], limit: number): CoverageCell[] {
  return cells.filter((c) => c.status === "unsurveyed").slice(0, Math.max(0, limit));
}
