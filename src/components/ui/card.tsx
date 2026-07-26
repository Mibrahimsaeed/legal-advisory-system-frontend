import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Remove the default inner padding. */
  unpadded?: boolean;
  accessibilityLabel?: string;
}>;

/**
 * Surface container: soft radius, hairline border, gentle elevation.
 * Given `onPress` it becomes pressable with scale feedback.
 */
export function Card({ children, onPress, style, unpadded = false, accessibilityLabel }: CardProps) {
  const theme = useTheme();
  const surfaceStyle = [
    styles.base,
    { backgroundColor: theme.card, borderColor: theme.border },
    Shadows.card,
    !unpadded && styles.padded,
    style,
  ];

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        scaleTo={0.98}
        haptic="selection"
        accessibilityLabel={accessibilityLabel}
        style={surfaceStyle}
      >
        {children}
      </PressableScale>
    );
  }

  return <View style={surfaceStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  padded: {
    padding: Spacing.lg,
  },
});
