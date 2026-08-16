import {
  type DailyContext,
  type DayType,
  type RiskCategory,
  type RiskPattern,
  riskCategoryLabel,
} from "@datemine/domain";
import { StyleSheet, Text, View } from "react-native";
import { severityMeta, theme } from "./theme";

/** Group risk patterns by category, preserving first-seen order. */
function groupByCategory(
  patterns: readonly RiskPattern[],
): { category: RiskCategory | undefined; items: RiskPattern[] }[] {
  const groups: { category: RiskCategory | undefined; items: RiskPattern[] }[] = [];
  for (const p of patterns) {
    let group = groups.find((g) => g.category === p.category);
    if (!group) {
      group = { category: p.category, items: [] };
      groups.push(group);
    }
    group.items.push(p);
  }
  return groups;
}

const DAY_TYPE_LABEL: Record<DayType, string> = {
  holiday: "국경일",
  memorial: "추모일",
  anniversary: "기념일",
  election: "선거",
  solarTerm: "절기",
  ordinary: "평일",
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  const weekday = WEEKDAYS[new Date(`${isoDate}T00:00:00`).getDay()];
  return `${year}. ${month}. ${day} (${weekday})`;
}

export function TodayCard({ context }: { context: DailyContext }): React.JSX.Element {
  const hasRisks = context.riskPatterns.length > 0;
  const groups = groupByCategory(context.riskPatterns);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.date}>{formatDate(context.date)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{DAY_TYPE_LABEL[context.dayType]}</Text>
        </View>
      </View>

      {hasRisks && <Text style={styles.adviceLabel}>종합 충고</Text>}
      <Text style={styles.advice}>{context.advice}</Text>
      <Text style={styles.significance}>{context.significance}</Text>

      {hasRisks && (
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>카테고리별 행동지침</Text>
          <Text style={styles.sectionCount}>{groups.length}</Text>
        </View>
      )}

      {groups.map((group) => (
        <View key={group.category ?? "_"} style={styles.group}>
          {group.category && (
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{riskCategoryLabel(group.category)}</Text>
              {group.items.length > 1 && (
                <Text style={styles.groupCount}>{group.items.length}</Text>
              )}
            </View>
          )}
          {group.items.map((risk) => {
            const sev = severityMeta(risk.severity);
            return (
              <View key={risk.pattern} style={[styles.risk, { borderLeftColor: sev.color }]}>
                <View style={styles.riskHeader}>
                  <View style={[styles.sevChip, { backgroundColor: sev.color }]}>
                    <Text style={styles.sevChipText}>{sev.label}</Text>
                  </View>
                </View>
                <Text style={styles.riskPattern}>{risk.pattern}</Text>
                <Text style={styles.riskWhy}>{risk.whyItBackfires}</Text>
                <Text style={styles.riskExample}>{risk.exampleSummary}</Text>
              </View>
            );
          })}
        </View>
      ))}

      {!hasRisks && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            오늘 특정된 지뢰는 없다. 그래도 방심은 금물 — 흐름을 읽고 한 박자 참아라.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: theme.space.lg,
    gap: theme.space.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: theme.color.bg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.xs,
  },
  badgeText: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    fontWeight: "600",
  },
  adviceLabel: {
    color: theme.color.accent,
    fontSize: theme.font.caption,
    fontWeight: "800",
    letterSpacing: 1,
  },
  advice: {
    color: theme.color.text,
    fontSize: theme.font.title,
    fontWeight: "700",
    lineHeight: 34,
  },
  significance: {
    color: theme.color.textMuted,
    fontSize: theme.font.body,
    lineHeight: 22,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.sm,
    marginTop: theme.space.xs,
  },
  sectionLabel: {
    color: theme.color.text,
    fontSize: theme.font.caption,
    fontWeight: "700",
    letterSpacing: 1,
  },
  sectionCount: {
    color: theme.color.accent,
    fontSize: theme.font.caption,
    fontWeight: "800",
  },
  group: {
    gap: theme.space.sm,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.sm,
  },
  groupTitle: {
    color: theme.color.text,
    fontSize: theme.font.body,
    fontWeight: "700",
  },
  groupCount: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    fontWeight: "700",
    backgroundColor: theme.color.bg,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 1,
  },
  risk: {
    backgroundColor: theme.color.bg,
    borderRadius: theme.radius.md,
    borderLeftWidth: 3,
    padding: theme.space.md,
    gap: theme.space.xs,
  },
  riskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.xs,
    marginBottom: theme.space.xs,
  },
  sevChip: {
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
  },
  sevChipText: {
    color: "#0B0B0F",
    fontSize: theme.font.caption,
    fontWeight: "800",
  },
  riskPattern: {
    color: theme.color.text,
    fontSize: theme.font.heading,
    fontWeight: "600",
  },
  riskWhy: {
    color: theme.color.textMuted,
    fontSize: theme.font.body,
    lineHeight: 21,
  },
  riskExample: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    fontStyle: "italic",
    lineHeight: 19,
  },
  empty: {
    backgroundColor: theme.color.bg,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
  },
  emptyText: {
    color: theme.color.textMuted,
    fontSize: theme.font.body,
    lineHeight: 21,
  },
});
