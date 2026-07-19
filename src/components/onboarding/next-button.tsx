import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Springs } from '@/constants/motion';
import { Brand, Radius, Shadows } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const OUTER = 72;
const RING_RADIUS = 33;
const RING_STROKE = 2.5;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type NextButtonProps = {
  /** Zero-based current page. */
  page: number;
  total: number;
  onPress: () => void;
};

/**
 * Gold circular advance button wrapped in a progress ring that fills as
 * onboarding progresses; the arrow becomes a checkmark on the last page.
 */
export default function NextButton({ page, total, onPress }: NextButtonProps) {
  const progress = useSharedValue((page + 1) / total);
  const isLast = page >= total - 1;

  useEffect(() => {
    progress.value = withSpring((page + 1) / total, Springs.gentle);
  }, [page, total, progress]);

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <PressableScale
      onPress={onPress}
      haptic="medium"
      scaleTo={0.93}
      accessibilityLabel={isLast ? 'Get started' : 'Next'}
      style={styles.container}
    >
      <Svg width={OUTER} height={OUTER} style={styles.ring}>
        <Circle
          cx={OUTER / 2}
          cy={OUTER / 2}
          r={RING_RADIUS}
          stroke="rgba(247, 243, 232, 0.15)"
          strokeWidth={RING_STROKE}
          fill="none"
        />
        <AnimatedCircle
          cx={OUTER / 2}
          cy={OUTER / 2}
          r={RING_RADIUS}
          stroke={Brand.gold}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE}`}
          animatedProps={ringProps}
          fill="none"
          transform={`rotate(-90 ${OUTER / 2} ${OUTER / 2})`}
        />
      </Svg>

      <View style={styles.core}>
        <Animated.View key={isLast ? 'check' : 'arrow'} entering={ZoomIn.duration(200)}>
          <Icon name={isLast ? 'check' : 'forward'} size={24} color={Brand.navy} weight="semibold" />
        </Animated.View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    width: OUTER,
    height: OUTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  core: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Brand.goldBright,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.goldGlow,
  },
});
