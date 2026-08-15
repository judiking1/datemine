import type { DailyContext, DayType } from "@datemine/domain";
import { StyleSheet, Text, View } from "react-native";
import { severityColor, theme } from "./theme";

const DAY_TYPE_LABEL: Record<DayType, string> = {
  holiday: "국경일",
  memorial: "추모일",
  anniversary: "기념일",
  election: "선거",
  solarTerm: "절기",
  ordinary: "평일",
};

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}. ${month}. ${day}`;
}

export function TodayCard({ context }: { context: DailyContext }): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.date}>{formatDate(context.date)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{DAY_TYPE_LABEL[context.dayType]}</Text>
        </View>
      </View>

      <Text style={styles.advice}>{context.advice}</Text>
      <Text style={styles.significance}>{context.significance}</Text>

      {context.riskPatterns.map((risk) => (
        <View key={risk.pattern} style={styles.risk}>
          <View style={styles.riskHeader}>
            <View style={[styles.dot, { backgroundColor: severityColor(risk.severity) }]} />
            <Text style={styles.riskPattern}>{risk.pattern}</Text>
          </View>
          <Text style={styles.riskWhy}>{risk.whyItBackfires}</Text>
          <Text style={styles.riskExample}>{risk.exampleSummary}</Text>
        </View>
      ))}
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
  risk: {
    backgroundColor: theme.color.bg,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    gap: theme.space.xs,
  },
  riskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
});
