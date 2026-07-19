import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Springs } from '@/constants/motion';
import { haptics } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed. */
  scaleTo?: number;
  /** Opacity while pressed (1 = no dim). */
  dimTo?: number;
  haptic?: 'none' | 'selection' | 'light' | 'medium';
  /** Android ripple color (e.g. text color at ~15% alpha). Omit for no ripple. */
  ripple?: string;
};

/**
 * The app's press-feedback primitive: springs down on touch, springs back
 * on release, with optional haptic on press. All transforms run on the UI
 * thread; reduced-motion users get the dim only.
 */
export function PressableScale({
  style,
  scaleTo = 0.97,
  dimTo = 1,
  haptic = 'none',
  ripple,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: PressableScaleProps) {
  const pressed = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reducedMotion ? 1 : 1 + (scaleTo - 1) * pressed.value }],
    opacity: 1 + (dimTo - 1) * pressed.value,
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      android_ripple={ripple ? { color: ripple, foreground: true } : undefined}
      {...rest}
      onPressIn={(event) => {
        pressed.value = withSpring(1, Springs.snappy);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.value = withSpring(0, Springs.gentle);
        onPressOut?.(event);
      }}
      onPress={(event) => {
        if (haptic !== 'none') haptics[haptic]();
        onPress?.(event);
      }}
      style={[style, animatedStyle]}
    />
  );
}
