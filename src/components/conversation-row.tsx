import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Durations, Easings } from '@/constants/motion';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { getTopic } from '@/data/legal-topics';
import { useTheme } from '@/hooks/use-theme';
import type { Conversation } from '@/providers/conversations-provider';
import { formatRelativeTime } from '@/utils/format-time';

type ConversationRowProps = {
  conversation: Conversation;
  /** Stagger offset for list entrances (ms). */
  enterDelay?: number;
};

/** List row for a conversation — used on Home, History, and Search. */
export function ConversationRow({ conversation, enterDelay = 0 }: ConversationRowProps) {
  const router = useRouter();
  const theme = useTheme();
  const topic = getTopic(conversation.topicId);
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <Animated.View
      entering={FadeInDown.delay(enterDelay).duration(Durations.gentle).easing(Easings.enter)}
    >
      <Card
        onPress={() => router.push({ pathname: '/chat/[id]', params: { id: conversation.id } })}
        accessibilityLabel={`Open conversation: ${conversation.title}`}
        style={styles.card}
      >
        <View style={styles.row}>
          <View style={[styles.iconSquare, { backgroundColor: theme.accentSoft }]}>
            <Icon name={topic?.icon ?? 'chat'} size={IconSize.md} color={theme.accentText} />
          </View>

          <View style={styles.textBlock}>
            <ThemedText type="smallMedium" numberOfLines={1}>
              {conversation.title}
            </ThemedText>
            {lastMessage ? (
              <ThemedText type="small" themeColor="textMuted" numberOfLines={1}>
                {lastMessage.role === 'assistant' ? 'AI: ' : 'You: '}
                {lastMessage.text.replace(/\s+/g, ' ')}
              </ThemedText>
            ) : null}
          </View>

          <ThemedText type="caption" themeColor="textMuted" style={styles.time}>
            {formatRelativeTime(conversation.updatedAt)}
          </ThemedText>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md + 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconSquare: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  time: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
