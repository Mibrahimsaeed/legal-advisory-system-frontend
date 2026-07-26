import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import ScalesEmblem from '@/components/ui/scales-emblem';
import { TypingDots } from '@/components/ui/typing-dots';
import { Durations, Easings } from '@/constants/motion';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const QUESTION = 'Can my employer fire me without notice?';
const ANSWER =
  "It depends on your contract and local labour law — immediate dismissal is usually reserved for serious misconduct. Here's what to check...";

const DOTS_AT_MS = 600;
const TYPING_AT_MS = 1400;
const CHAR_INTERVAL_MS = 20;

export default function ChatPreview() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<'idle' | 'dots' | 'typing' | 'done'>(
    reducedMotion ? 'done' : 'idle',
  );
  const [typed, setTyped] = useState(reducedMotion ? ANSWER : '');
  const caretOpacity = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let interval: ReturnType<typeof setInterval> | undefined;

    timers.push(setTimeout(() => setPhase('dots'), DOTS_AT_MS));
    timers.push(
      setTimeout(() => {
        setPhase('typing');
        let index = 0;
        interval = setInterval(() => {
          index += 1;
          setTyped(ANSWER.slice(0, index));
          if (index >= ANSWER.length) {
            clearInterval(interval);
            setPhase('done');
          }
        }, CHAR_INTERVAL_MS);
      }, TYPING_AT_MS),
    );

    caretOpacity.value = withRepeat(
      withSequence(withTiming(0, { duration: 420 }), withTiming(1, { duration: 420 })),
      -1,
    );

    return () => {
      timers.forEach(clearTimeout);
      if (interval) clearInterval(interval);
      cancelAnimation(caretOpacity);
    };
  }, [reducedMotion, caretOpacity]);

  const caretStyle = useAnimatedStyle(() => ({ opacity: caretOpacity.value }));

  return (
    <View style={styles.container}>
      {/* Background Watermark */}
      <View style={styles.watermark} pointerEvents="none">
        <ScalesEmblem size={180} color={theme.border} strokeWidth={1} />
      </View>

      <View style={styles.chatStack}>
        {/* User Question */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(200).duration(Durations.gentle).easing(Easings.enter)}
          style={styles.questionRow}
        >
          <View style={[styles.bubble, styles.questionBubble, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText style={[styles.bubbleText, { color: theme.text }]}>
              {QUESTION}
            </ThemedText>
          </View>
        </Animated.View>

        {/* AI Answer */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(500).duration(Durations.gentle).easing(Easings.enter)}
          style={styles.answerRow}
        >
          <View style={[styles.avatar, { backgroundColor: theme.gold }]}>
            <Icon name="sparkles" size={14} color={theme.onPrimary} />
          </View>

          <View style={[styles.bubble, styles.answerBubble, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {phase === 'idle' || phase === 'dots' ? (
              <TypingDots color={theme.textSecondary} />
            ) : (
              <ThemedText style={[styles.bubbleText, { color: theme.textSecondary }]}>
                {typed}
                {phase === 'typing' ? (
                  <Animated.Text style={[{ color: theme.gold }, caretStyle]}>▍</Animated.Text>
                ) : null}
              </ThemedText>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 210,
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  watermark: {
    position: 'absolute',
    left: 10,
    top: -10,
    opacity: 0.2,
  },
  chatStack: {
    gap: Spacing.lg,
  },
  questionRow: {
    alignItems: 'flex-end',
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  bubble: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
  },
  questionBubble: {
    maxWidth: '85%',
    borderBottomRightRadius: Radius.xs,
  },
  answerBubble: {
    flex: 1,
    borderTopLeftRadius: Radius.xs,
    minHeight: 96,
  },
  bubbleText: {
    fontSize: 13.5,
    lineHeight: 20,
  },
});
