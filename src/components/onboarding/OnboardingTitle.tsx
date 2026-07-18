import { StyleSheet, Text, View } from "react-native";

type Props = {
  titleLine1: string;
  goldWord: string;
  titleLine2: string;
  description: string;
};

export default function OnboardingTitle({
  titleLine1,
  goldWord,
  titleLine2,
  description,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
  {titleLine1}
  {"\n"}
  <Text style={styles.gold}>{goldWord}</Text>
  {"\n"}
  {titleLine2}
</Text>

      <Text style={styles.description}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    width: "100%",
    paddingHorizontal: 38,
    alignItems: "flex-start",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FCF8EE",
    textAlign: "left",
    lineHeight: 38,
  },

  gold: {
    color: "#C9A667",
  },

  description: {
    marginTop: 20,
    width: 280,
    color: "#B9AE93",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "left",
  },
});