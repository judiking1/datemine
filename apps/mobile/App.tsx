import { toIsoDate } from "@datemine/domain";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getDailyContext } from "./src/getToday";
import { theme } from "./src/theme";
import { TodayCard } from "./src/TodayCard";

export default function App(): React.JSX.Element {
  const today = toIsoDate(new Date());
  const context = getDailyContext(today);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.brand}>datemine</Text>
            <Text style={styles.tagline}>오늘, 무슨 말은 참아야 할까</Text>
          </View>
          <TodayCard context={context} />
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
  footer: {
    color: theme.color.textMuted,
    fontSize: theme.font.caption,
    lineHeight: 18,
    opacity: 0.7,
    marginTop: theme.space.sm,
  },
});
