import { StyleSheet, View } from "react-native";

type Props = {
  current: number;
  total?: number;
};

export default function PageIndicator({
  current,
  total = 3,
}: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const active = index + 1 === current;

        return (
          <View
            key={index}
            style={[
              styles.dot,
              active && styles.activeDot,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5F6470",
  },

  activeDot: {
    width: 24,
    borderRadius: 3,
    backgroundColor: "#C9A667",
  },
});