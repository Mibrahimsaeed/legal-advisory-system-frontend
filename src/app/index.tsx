import { View, Text, StyleSheet, Button, Alert } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Expo Router is Working!</Text>

      <Text style={styles.subtitle}>
        If you see this screen, your setup is correct.
      </Text>

      <Button
        title="Test Button"
        onPress={() => Alert.alert("Success", "React Native is working 🎉")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
  },
});