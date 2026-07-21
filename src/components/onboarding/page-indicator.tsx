import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { Brand } from '@/constants/theme';

type PageIndicatorProps = {
  count: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
};

const INACTIVE = 'rgba(20, 20, 20, 0.18)';

function IndicatorDot({
  index,
  scrollX,
  pageWidth,
}: {
  index: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const range = [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth];
    return {
      width: interpolate(scrollX.value, range, [7, 26, 7], 'clamp'),
      backgroundColor: interpolateColor(scrollX.value, range, [INACTIVE, Brand.ink, INACTIVE]),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

/** Scroll-driven page dots — the active dot stretches and fills gold as you swipe. */
export default function PageIndicator({ count, scrollX, pageWidth }: PageIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, index) => (
        <IndicatorDot key={index} index={index} scrollX={scrollX} pageWidth={pageWidth} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
});
