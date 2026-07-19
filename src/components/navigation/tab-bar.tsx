import { Tabs } from 'expo-router';
import { useEffect, type ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Springs } from '@/constants/motion';
import { IconSize, Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/utils/haptics';

export const TAB_BAR_CONTENT_HEIGHT = 62;

/**
 * Props expo-router passes to a custom `tabBar`, derived from the public
 * Tabs component (react-navigation is vendored inside expo-router v56, so
 * its types are not importable directly).
 */
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_ICONS: Record<string, { idle: IconName; active: IconName }> = {
  home: { idle: 'home', active: 'homeFilled' },
  history: { idle: 'history', active: 'history' },
  profile: { idle: 'profile', active: 'profileFilled' },
};

function TabItem({
  label,
  routeName,
  isFocused,
  onPress,
}: {
  label: string;
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const focusProgress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    focusProgress.value = withSpring(isFocused ? 1 : 0, Springs.gentle);
  }, [isFocused, focusProgress]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: focusProgress.value,
    transform: [{ scale: reducedMotion ? 1 : 0.75 + 0.25 * focusProgress.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: reducedMotion ? 0 : -1.5 * focusProgress.value }],
  }));

  const icons = TAB_ICONS[routeName] ?? { idle: 'home', active: 'homeFilled' };

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.95}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      style={styles.item}
    >
      <Animated.View style={[styles.pill, { backgroundColor: theme.accentSoft }, pillStyle]} />
      <Animated.View style={iconStyle}>
        <Icon
          name={isFocused ? icons.active : icons.idle}
          size={IconSize.lg}
          color={isFocused ? theme.accentText : theme.iconMuted}
        />
      </Animated.View>
      <ThemedText
        type="caption"
        style={{ color: isFocused ? theme.accentText : theme.iconMuted }}
      >
        {label}
      </ThemedText>
    </PressableScale>
  );
}

/** Custom bottom tab bar: soft gold pill on the active tab, selection haptics. */
export function AppTabBar({ state, descriptors, navigation }: TabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        Shadows.raised,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, Spacing.sm),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          haptics.selection();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            label={label}
            routeName={route.name}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  item: {
    flex: 1,
    height: TAB_BAR_CONTENT_HEIGHT - Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  pill: {
    position: 'absolute',
    top: 0,
    bottom: 6,
    left: Spacing.md,
    right: Spacing.md,
    borderRadius: Radius.md,
  },
});
