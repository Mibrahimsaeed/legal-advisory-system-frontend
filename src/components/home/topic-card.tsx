import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Durations, Easings } from '@/constants/motion';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import type { LegalTopic } from '@/data/legal-topics';
import { useTheme } from '@/hooks/use-theme';

type TopicCardProps = {
  topic: LegalTopic;
  enterDelay?: number;
};

/** Grid tile for a legal topic; opens a new chat seeded with the topic. */
export function TopicCard({ topic, enterDelay = 0 }: TopicCardProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(enterDelay).duration(Durations.gentle).easing(Easings.enter)}
      style={styles.wrapper}
    >
      <Card
        onPress={() =>
          router.push({ pathname: '/chat/[id]', params: { id: 'new', topic: topic.id } })
        }
        accessibilityLabel={`Ask about ${topic.title}`}
        style={styles.card}
      >
        <View style={[styles.iconSquare, { backgroundColor: theme.accentSoft }]}>
          <Icon name={topic.icon} size={IconSize.md} color={theme.accentText} />
        </View>
        <ThemedText type="smallMedium" style={styles.title}>
          {topic.title}
        </ThemedText>
        <ThemedText type="caption" themeColor="textMuted" numberOfLines={2}>
          {topic.blurb}
        </ThemedText>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  card: {
    padding: Spacing.lg - 2,
    minHeight: 124,
  },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: Radius.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: Spacing.md - 2,
    marginBottom: 2,
  },
});
