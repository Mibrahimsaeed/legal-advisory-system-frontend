import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Durations } from '@/constants/motion';
import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

const HEIGHTS: Record<ButtonSize, number> = { sm: 40, md: 48, lg: 56 };
const PADDINGS: Record<ButtonSize, number> = { sm: Spacing.lg, md: 20, lg: Spacing.xl };
const RADII: Record<ButtonSize, number> = { sm: Radius.sm, md: Radius.md, lg: Radius.lg };
const FONT_SIZES: Record<ButtonSize, number> = { sm: 14, md: 15, lg: 16 };

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const inactive = disabled || loading;

  const palette: Record<ButtonVariant, { bg: string; text: string; border?: string; shadow?: ViewStyle }> = {
    primary: { bg: theme.primary, text: theme.onPrimary, shadow: Shadows.card },
    gold: { bg: Brand.goldBright, text: Brand.navy, shadow: Shadows.goldGlow },
    secondary: { bg: 'transparent', text: theme.text, border: theme.borderStrong },
    ghost: { bg: 'transparent', text: theme.accentText },
    danger: { bg: theme.danger, text: '#FFF7F5', shadow: Shadows.card },
  };
  const colors = palette[variant];

  return (
    <PressableScale
      onPress={onPress}
      disabled={inactive}
      haptic="light"
      scaleTo={0.97}
      ripple={`${colors.text}2E`}
      accessibilityState={{ disabled: inactive, busy: loading }}
      accessibilityLabel={title}
      style={[
        styles.base,
        {
          height: HEIGHTS[size],
          paddingHorizontal: PADDINGS[size],
          borderRadius: RADII[size],
          backgroundColor: colors.bg,
        },
        colors.border ? { borderWidth: 1.5, borderColor: colors.border } : null,
        !inactive && colors.shadow,
        inactive && styles.inactive,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <Animated.View entering={FadeIn.duration(Durations.fast)} exiting={FadeOut.duration(Durations.fast)}>
          <ActivityIndicator size="small" color={colors.text} />
        </Animated.View>
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' ? (
            <Icon name={icon} size={FONT_SIZES[size] + 2} color={colors.text} />
          ) : null}
          <ThemedText
            type="subtitle"
            style={{ color: colors.text, fontSize: FONT_SIZES[size], lineHeight: FONT_SIZES[size] + 6 }}
          >
            {title}
          </ThemedText>
          {icon && iconPosition === 'right' ? (
            <Icon name={icon} size={FONT_SIZES[size] + 2} color={colors.text} />
          ) : null}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inactive: {
    opacity: 0.55,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
});
