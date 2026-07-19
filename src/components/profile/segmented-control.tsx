import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Springs } from '@/constants/motion';
import { IconSize, Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/utils/haptics';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconName;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

const PADDING = 3;

/** Three-way selector with a spring-sliding thumb (used for Appearance). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const [segmentWidth, setSegmentWidth] = useState(0);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(selectedIndex * segmentWidth, Springs.gentle);
  }, [selectedIndex, segmentWidth, translateX]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[styles.track, { backgroundColor: theme.surfaceMuted }]}
      onLayout={(event) =>
        setSegmentWidth((event.nativeEvent.layout.width - PADDING * 2) / options.length)
      }
    >
      {segmentWidth > 0 ? (
        <Animated.View
          style={[
            styles.thumb,
            Shadows.card,
            { width: segmentWidth, backgroundColor: theme.surface, borderColor: theme.border },
            thumbStyle,
          ]}
        />
      ) : null}

      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              if (!selected) {
                haptics.selection();
                onChange(option.value);
              }
            }}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={styles.segment}
          >
            {option.icon ? (
              <Icon
                name={option.icon}
                size={IconSize.sm}
                color={selected ? theme.accentText : theme.iconMuted}
              />
            ) : null}
            <ThemedText
              type="smallMedium"
              themeColor={selected ? 'text' : 'textMuted'}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: PADDING,
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: Radius.md - 3,
    borderWidth: StyleSheet.hairlineWidth,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs + 2,
    height: 40,
  },
});
