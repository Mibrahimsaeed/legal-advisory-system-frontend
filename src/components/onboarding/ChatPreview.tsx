import { StyleSheet, Text, View } from "react-native";

export default function ChatPreview() {
  return (
    <View style={styles.container}>
      {/* User Question */}
      <View style={styles.questionContainer}>
        <View style={styles.questionBubble}>
          <Text style={styles.questionText}>
            Can my employer fire me{"\n"}
            without notice?
          </Text>
        </View>
      </View>

      {/* AI Answer */}
      <View style={styles.answerContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>

        <View style={styles.answerBubble}>
          <Text style={styles.answerText}>
            It depends on your employment
            {"\n"}
            contract and local labour
            {"\n"}
            laws. Some situations allow
            {"\n"}
            immediate termination...
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 258,
    height: 228,
    marginTop: 24,

    alignSelf: "center",

    borderRadius: 24,

    backgroundColor: "#24365C",

    padding: 18,

    justifyContent: "space-between",
  },

  questionContainer: {
    alignItems: "flex-end",
  },

  questionBubble: {
    backgroundColor: "#4B5568",

    borderRadius: 18,

    paddingHorizontal: 16,
    paddingVertical: 12,

    maxWidth: "85%",
  },

  questionText: {
    color: "#FCF8EE",
    fontSize: 13,
    lineHeight: 20,
  },

  answerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  avatar: {
    width: 32,
    height: 32,

    borderRadius: 16,

    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6B7280",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  avatarIcon: {
    fontSize: 15,
  },

  answerBubble: {
    flex: 1,

    backgroundColor: "#4B5568",

    borderRadius: 18,

    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  answerText: {
    color: "#FCF8EE",
    fontSize: 13,
    lineHeight: 20,
  },
});