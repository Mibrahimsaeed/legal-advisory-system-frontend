import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Durations, Easings } from '@/constants/motion';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ChatMessage } from '@/providers/conversations-provider';

type MessageBubbleProps = {
  message: ChatMessage;
  /** Animate entrance (new messages only, not history). */
  animate: boolean;
};

export function MessageBubble({ message, animate }: MessageBubbleProps) {
  const theme = useTheme();
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={
        animate ? FadeInDown.duration(Durations.gentle).easing(Easings.enter) : undefined
      }
      style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}
    >
      {!isUser ? (
        <View style={[styles.avatar, { backgroundColor: theme.accentSoft }]}>
          <Icon name="sparkles" size={13} color={theme.accentText} />
        </View>
      ) : null}

      <View
        accessible
        accessibilityLabel={`${isUser ? 'You' : 'Assistant'}: ${message.text}`}
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: theme.bubbleUser, borderBottomRightRadius: Radius.xs }
            : {
                backgroundColor: theme.bubbleAssistant,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.border,
                borderTopLeftRadius: Radius.xs,
              },
        ]}
      >
        <ThemedText
          type="small"
          style={[styles.text, { color: isUser ? theme.bubbleUserText : theme.text }]}
        >
          {message.text}
        </ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    marginVertical: Spacing.xs + 2,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg - 2,
    paddingVertical: Spacing.md - 2,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
});
