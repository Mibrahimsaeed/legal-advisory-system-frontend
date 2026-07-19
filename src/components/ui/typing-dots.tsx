import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Easings } from '@/constants/motion';

type TypingDotsProps = {
  color: string;
  size?: number;
};

function Dot({ color, size, delay }: { color: string; size: number; delay: number }) {
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300, easing: Easings.standard }),
          withTiming(0, { duration: 300, easing: Easings.standard }),
          withTiming(0, { duration: 260 }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(progress);
  }, [delay, progress, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 0.6 : 0.35 + progress.value * 0.65,
    transform: [{ translateY: reducedMotion ? 0 : -3 * progress.value }],
  }));

  return (
    <Animated.View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

/** The classic three-dot "assistant is typing" indicator. */
export function TypingDots({ color, size = 6 }: TypingDotsProps) {
  return (
    <View style={styles.row} accessibilityLabel="Assistant is typing">
      {[0, 1, 2].map((index) => (
        <Dot key={index} color={color} size={size} delay={index * 150} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
  },
});
