import { useState, type ReactNode, type Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Durations, Easings } from '@/constants/motion';
import { Fonts, IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  error?: string;
  helper?: string;
  icon?: IconName;
  /** Rendered at the trailing edge, after the built-in secure-entry toggle. */
  right?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
};

/**
 * Single-line input with an animated focus ring, optional leading icon,
 * built-in show/hide toggle for secure entry, and animated error text.
 */
export function TextField({
  label,
  error,
  helper,
  icon,
  right,
  containerStyle,
  secureTextEntry,
  onFocus,
  onBlur,
  ref,
  ...inputProps
}: TextFieldProps) {
  const theme = useTheme();
  const focusProgress = useSharedValue(0);
  const [secureHidden, setSecureHidden] = useState(true);

  const fieldAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? theme.danger
      : interpolateColor(focusProgress.value, [0, 1], [theme.inputBorder, theme.accentStrong]),
  }));

  return (
    <View style={containerStyle}>
      {label ? (
        <ThemedText
          type="smallMedium"
          themeColor={error ? 'danger' : 'textSecondary'}
          style={styles.label}
        >
          {label}
        </ThemedText>
      ) : null}

      <Animated.View
        style={[styles.field, { backgroundColor: theme.inputBackground }, fieldAnimatedStyle]}
      >
        {icon ? <Icon name={icon} size={IconSize.md} color={theme.iconMuted} /> : null}

        <TextInput
          ref={ref}
          {...inputProps}
          secureTextEntry={secureTextEntry ? secureHidden : false}
          accessibilityLabel={label ?? inputProps.placeholder}
          placeholderTextColor={theme.placeholder}
          selectionColor={theme.accent}
          onFocus={(event) => {
            focusProgress.value = withTiming(1, { duration: Durations.base, easing: Easings.standard });
            onFocus?.(event);
          }}
          onBlur={(event) => {
            focusProgress.value = withTiming(0, { duration: Durations.base, easing: Easings.standard });
            onBlur?.(event);
          }}
          style={[styles.input, { color: theme.text }]}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setSecureHidden((value) => !value)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={secureHidden ? 'Show password' : 'Hide password'}
          >
            <Icon name={secureHidden ? 'eye' : 'eyeOff'} size={IconSize.md} color={theme.iconMuted} />
          </Pressable>
        ) : null}

        {right}
      </Animated.View>

      {error ? (
        <Animated.View
          entering={FadeInDown.duration(Durations.fast).easing(Easings.enter)}
          exiting={FadeOut.duration(Durations.fast)}
        >
          <ThemedText
            type="caption"
            themeColor="danger"
            accessibilityRole="alert"
            style={styles.helperText}
          >
            {error}
          </ThemedText>
        </Animated.View>
      ) : helper ? (
        <ThemedText type="caption" themeColor="textMuted" style={styles.helperText}>
          {helper}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: Spacing.sm - 2,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.lg - 2,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    paddingVertical: 0,
  },
  helperText: {
    marginTop: Spacing.xs + 2,
  },
});
