import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatPreview from "@/components/onboarding/ChatPreview";
import NextButton from "@/components/onboarding/NextButton";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import PageIndicator from "@/components/onboarding/PageIndicator";
import SkipButton from "@/components/onboarding/SkipButton";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <SkipButton onPress={() => router.replace("/login")} />

      <View style={styles.content}>
        <ChatPreview />

        <OnboardingTitle
          titleLine1="Ask Legal"
          goldWord="Questions"
          titleLine2="Instantly"
          description="Get simple, clear answers to complex legal topics in seconds. No more confusing jargon."
        />
      </View>

      <View style={styles.bottom}>
        <PageIndicator current={1} total={3} />

        <NextButton
          onPress={() => router.push("/onboarding/screen2")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16233F",
  },

  content: {
    flex: 1,
    paddingTop: 28,
    alignItems: "center",
  },

  bottom: {
    position: "absolute",
    left: 30,
    right: 30,
    bottom: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});