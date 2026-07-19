import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Easings } from '@/constants/motion';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SkeletonProps = {
  width: DimensionValue;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** Loading placeholder with a gentle opacity pulse (static under reduced motion). */
export function Skeleton({ width, height, radius = Radius.sm, style }: SkeletonProps) {
  const pulse = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const theme = useTheme();

  useEffect(() => {
    if (reducedMotion) return;
    pulse.value = withRepeat(withTiming(1, { duration: 900, easing: Easings.standard }), -1, true);
    return () => cancelAnimation(pulse);
  }, [pulse, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 0.6 : 0.45 + pulse.value * 0.4,
  }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: theme.surfaceMuted },
        animatedStyle,
        style,
      ]}
    />
  );
}
