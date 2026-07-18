import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppLogo from "./AppLogo";

type Props = {
  onFinish?: () => void;
};

export function AnimatedSplashOverlay({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <AppLogo size={105} />

      <Text style={styles.title}>
        Legal Advisor AI
      </Text>

      <Text style={styles.subtitle}>
        UNDERSTAND LAW WITH AI
      </Text>
    </View>
  );
}

export function AnimatedIcon() {
  const router = useRouter();

  return (
    <AnimatedSplashOverlay
      onFinish={() => router.replace("/onboarding")}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16233F",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "40%",
    paddingHorizontal: 30,
  },

  title: {
    marginTop: 22,
    fontSize: 28,
    fontWeight: "600",
    color: "#FCF8EE",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 3.5,
    color: "#C9A667",
    textAlign: "center",
  },
});