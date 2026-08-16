import { toIsoDate } from "@datemine/domain";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "./src/Calendar";
import { DateNav } from "./src/DateNav";
import { getDailyContext } from "./src/getToday";
import { ReferenceList } from "./src/ReferenceList";
import { theme } from "./src/theme";
import { TodayCard } from "./src/TodayCard";

export default function App(): React.JSX.Element {
  const [selectedDate, setSelectedDate] = useState(() => toIsoDate(new Date()));
  const [showCalendar, setShowCalendar] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const context = getDailyContext(selectedDate, reviewMode);

  const pick = (isoDate: string) => {
    setSelectedDate(isoDate);
    setShowCalendar(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <Text style={styles.brand}>datemine</Text>
              <Pressable
                style={[styles.reviewToggle, reviewMode && styles.reviewToggleOn]}
                onPress={() => setReviewMode((v) => !v)}
              >
                <Text style={[styles.reviewToggleText, reviewMode && styles.reviewToggleTextOn]}>
                  검수 모드 {reviewMode ? "ON" : "OFF"}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.tagline}>오늘, 무슨 말은 참아야 할까</Text>
          </View>
          <DateNav date={selectedDate} onChange={setSelectedDate} />
          <Pressable
            style={styles.calToggle}
            onPress={() => setShowCalendar((v) => !v)}
          >
            <Text style={styles.calToggleText}>
              {showCalendar ? "달력 닫기 ▲" : "달력으로 날짜 고르기 ▾"}
            </Text>
          </Pressable>
          {showCalendar && (
            <Calendar selected={selectedDate} onSelect={pick} reviewMode={reviewMode} />
          )}
          <TodayCard context={context} />
          <ReferenceList onSelect={setSelectedDate} />
          <Text style={styles.footer}>
            공개 보도로 반복 확인된 유형을 익명화한 자료입니다. 특정 개인·단체를 지목하지
            않습니다.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  scroll: {
    padding: theme.space.lg,
    gap: theme.space.md,
  },
  header: {
    gap: theme.space.xs,
    marginBottom: theme.space.sm,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: theme.color.accent,
    fontSize: theme.font.heading,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  reviewToggle: {
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.xs,
  },
  reviewToggleOn: {
    borderColor: "#FFD166",
    backgroundColor: "#4A3B12",
  },
  reviewToggleText: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    fontWeight: "700",
  },
  reviewToggleTextOn: {
    color: "#FFD166",
  },
  tagline: {
    color: theme.color.textMuted,
    fontSize: theme.font.body,
  },
  calToggle: {
    alignItems: "center",
    paddingVertical: theme.space.xs,
  },
  calToggleText: {
    color: theme.color.accent,
    fontSize: theme.font.caption,
    fontWeight: "700",
  },
  footer: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    lineHeight: 18,
    opacity: 0.7,
    marginTop: theme.space.sm,
  },
});
