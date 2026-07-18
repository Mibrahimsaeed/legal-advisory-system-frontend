import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function NextButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: "#D4B06A",
  justifyContent: "center",
  alignItems: "center",
},

  arrow: {
    fontSize: 40,
    color: "#16233F",
    fontWeight: "bold",
  },
});