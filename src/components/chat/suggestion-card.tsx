import { StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Durations, Easings } from '@/constants/motion';
import { IconSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SuggestionCardProps = {
  question: string;
  onPress: (question: string) => void;
  enterDelay?: number;
};

/** Tappable starter question for an empty chat. */
export function SuggestionCard({ question, onPress, enterDelay = 0 }: SuggestionCardProps) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(enterDelay).duration(Durations.gentle).easing(Easings.enter)}
    >
      <Card
        onPress={() => onPress(question)}
        accessibilityLabel={`Ask: ${question}`}
        style={styles.card}
      >
        <Icon name="idea" size={IconSize.md} color={theme.accent} />
        <ThemedText type="small" themeColor="textSecondary" style={styles.text}>
          {question}
        </ThemedText>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg - 2,
  },
  text: {
    flex: 1,
  },
});
