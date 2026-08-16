import { toIsoDate } from "@datemine/domain";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "./theme";
import { draftIsoDates, publishedIsoDates } from "./upcoming";

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Build the day cells for a month, padded so the 1st lands on its weekday. Each cell
 * carries a stable key (iso for real days, a namespaced pad key for blanks). */
function monthCells(year: number, month0: number): { key: string; iso: string | null }[] {
  const first = new Date(year, month0, 1).getDay();
  const days = new Date(year, month0 + 1, 0).getDate();
  const cells: { key: string; iso: string | null }[] = [];
  for (let i = 0; i < first; i++) cells.push({ key: `lead-${year}-${month0}-${i}`, iso: null });
  for (let d = 1; d <= days; d++) {
    const iso = `${year}-${pad(month0 + 1)}-${pad(d)}`;
    cells.push({ key: iso, iso });
  }
  for (let i = cells.length; i % 7 !== 0; i++)
    cells.push({ key: `tail-${year}-${month0}-${i}`, iso: null });
  return cells;
}

export function Calendar({
  selected,
  onSelect,
  reviewMode = false,
}: {
  selected: string;
  onSelect: (isoDate: string) => void;
  reviewMode?: boolean;
}): React.JSX.Element {
  const [view, setView] = useState(() => ({
    year: Number(selected.slice(0, 4)),
    month0: Number(selected.slice(5, 7)) - 1,
  }));
  const today = toIsoDate(new Date());
  const published = publishedIsoDates(view.year);
  const drafts = reviewMode ? draftIsoDates(view.year) : new Set<string>();
  const cells = monthCells(view.year, view.month0);

  const stepMonth = (delta: number) => {
    const d = new Date(view.year, view.month0 + delta, 1);
    setView({ year: d.getFullYear(), month0: d.getMonth() });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Pressable style={styles.navBtn} onPress={() => stepMonth(-1)} accessibilityLabel="이전 달">
          <Text style={styles.navText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>
          {view.year}년 {view.month0 + 1}월
        </Text>
        <Pressable style={styles.navBtn} onPress={() => stepMonth(1)} accessibilityLabel="다음 달">
          <Text style={styles.navText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEK_LABELS.map((w) => (
          <Text key={w} style={styles.weekLabel}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map(({ key, iso }) => {
          if (!iso) return <View key={key} style={styles.cell} />;
          const day = Number(iso.slice(8));
          const isPublished = published.has(iso);
          const isDraft = !isPublished && drafts.has(iso);
          const isSelected = iso === selected;
          const isToday = iso === today;
          return (
            <Pressable
              key={iso}
              style={[
                styles.cell,
                styles.dayCell,
                isPublished && styles.published,
                isDraft && styles.draft,
                isSelected && styles.selected,
              ]}
              onPress={() => onSelect(iso)}
            >
              <Text
                style={[
                  styles.dayText,
                  (isPublished || isDraft) && styles.dataText,
                  isToday && styles.todayText,
                ]}
              >
                {day}
              </Text>
              {isToday && <View style={styles.todayDot} />}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <View style={[styles.legendDot, { backgroundColor: theme.color.accent }]} />
        <Text style={styles.legend}>발행됨</Text>
        {reviewMode && (
          <>
            <View style={[styles.legendDot, { backgroundColor: "#FFD166" }]} />
            <Text style={styles.legend}>검수 대기</Text>
          </>
        )}
        <View style={[styles.legendRing]} />
        <Text style={styles.legend}>선택/오늘</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: theme.space.md,
    gap: theme.space.sm,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: { color: theme.color.text, fontSize: 24, fontWeight: "700" },
  title: { color: theme.color.text, fontSize: theme.font.body, fontWeight: "700" },
  weekRow: { flexDirection: "row" },
  weekLabel: {
    flex: 1,
    textAlign: "center",
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    fontWeight: "600",
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dayCell: { borderRadius: theme.radius.md, borderWidth: 2, borderColor: "transparent" },
  dayText: { color: theme.color.textMuted, fontSize: theme.font.body },
  // Data days: solid fills so they clearly stand out from empty days.
  published: { backgroundColor: theme.color.accent },
  draft: { backgroundColor: "#4A3B12" },
  // Selection/today: border only, so it never masquerades as a data day.
  selected: { borderColor: theme.color.text },
  dataText: { color: theme.color.text, fontWeight: "800" },
  todayText: { textDecorationLine: "underline" },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.color.textMuted,
    marginTop: 1,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: theme.space.xs,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendRing: {
    width: 10,
    height: 10,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: theme.color.text,
  },
  legend: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    marginRight: theme.space.sm,
  },
});
