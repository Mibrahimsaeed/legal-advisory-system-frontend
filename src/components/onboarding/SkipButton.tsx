import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function SkipButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={styles.container}
    >
      <Text style={styles.text}>Skip</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 52,
    right: 30,
    zIndex: 100,
  },

  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B9AE93",
    letterSpacing: 0.3,
  },
});