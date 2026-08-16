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
  const context = getDailyContext(selectedDate);

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
            <Text style={styles.brand}>datemine</Text>
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
          {showCalendar && <Calendar selected={selectedDate} onSelect={pick} />}
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
  brand: {
    color: theme.color.accent,
    fontSize: theme.font.heading,
    fontWeight: "800",
    letterSpacing: 0.5,
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
