import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

type PageIndicatorProps = {
  count: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
};

function IndicatorDot({
  index,
  scrollX,
  pageWidth,
}: {
  index: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
}) {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const range = [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth];
    return {
      width: interpolate(scrollX.value, range, [6, 24, 6], 'clamp'),
      backgroundColor: interpolateColor(
        scrollX.value,
        range,
        [theme.border, theme.gold, theme.border],
      ),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

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
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
