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
import { TypingDots } from '@/components/ui/typing-dots';
import { Durations, Easings } from '@/constants/motion';
import { Brand, Radius, Spacing } from '@/constants/theme';

const QUESTION = 'Can my employer fire me without notice?';
const ANSWER =
  'It depends on your contract and local labour law — immediate dismissal is usually reserved for serious misconduct. Here’s what to check…';

const DOTS_AT_MS = 900;
const TYPING_AT_MS = 1700;
const CHAR_INTERVAL_MS = 22;

/**
 * The onboarding hero: a miniature conversation where the assistant's
 * answer types itself out after a brief "thinking" pause.
 */
export default function ChatPreview() {
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
    <View style={styles.card}>
      {/* User question */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.delay(300).duration(Durations.gentle).easing(Easings.enter)}
        style={styles.questionRow}
      >
        <View style={[styles.bubble, styles.questionBubble]}>
          <ThemedText type="small" themeColor="brandText" style={styles.bubbleText}>
            {QUESTION}
          </ThemedText>
        </View>
      </Animated.View>

      {/* Assistant answer */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.delay(700).duration(Durations.gentle).easing(Easings.enter)}
        style={styles.answerRow}
      >
        <View style={styles.avatar}>
          <Icon name="sparkles" size={15} color={Brand.gold} />
        </View>

        <View style={[styles.bubble, styles.answerBubble]}>
          {phase === 'idle' || phase === 'dots' ? (
            <TypingDots color={Brand.khaki} />
          ) : (
            <ThemedText type="small" themeColor="brandText" style={styles.bubbleText}>
              {typed}
              {phase === 'typing' ? (
                <Animated.Text style={[styles.caret, caretStyle]}>▍</Animated.Text>
              ) : null}
            </ThemedText>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 276,
    borderRadius: Radius.xl,
    backgroundColor: Brand.navyRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(247, 243, 232, 0.12)',
    padding: Spacing.lg + 2,
    gap: Spacing.lg - 2,
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
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(201, 166, 103, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(201, 166, 103, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg - 2,
    paddingVertical: Spacing.md - 2,
    backgroundColor: Brand.navyBubble,
  },
  questionBubble: {
    maxWidth: '86%',
    borderBottomRightRadius: Radius.xs,
  },
  answerBubble: {
    flex: 1,
    borderTopLeftRadius: Radius.xs,
    minHeight: 108,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  caret: {
    color: Brand.gold,
    fontSize: 13,
  },
});
