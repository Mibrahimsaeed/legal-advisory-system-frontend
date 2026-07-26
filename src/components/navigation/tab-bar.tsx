import { Tabs } from 'expo-router';
import { useEffect, type ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Springs } from '@/constants/motion';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useThemeContext } from '@/providers/theme-provider';
import { useConversations } from '@/providers/conversations-provider';
import { haptics } from '@/utils/haptics';

export const TAB_BAR_CONTENT_HEIGHT = 56;

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_ICONS: Record<string, { idle: IconName; active: IconName }> = {
  chat: { idle: 'chat', active: 'chat' },
  explore: { idle: 'search', active: 'search' },
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
  const { scheme } = useThemeContext();
  const reducedMotion = useReducedMotion();
  const focusProgress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    focusProgress.value = withSpring(isFocused ? 1 : 0, Springs.gentle);
  }, [isFocused, focusProgress]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: focusProgress.value,
    transform: [{ scale: reducedMotion ? 1 : 0.85 + 0.15 * focusProgress.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: reducedMotion ? 0 : -1 * focusProgress.value }],
  }));

  const icons = TAB_ICONS[routeName] ?? { idle: 'chat', active: 'chat' };
  const isDark = scheme === 'dark';

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.95}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      style={styles.item}
    >
      {/* Floating Active Pill Accent */}
      <Animated.View
        style={[
          styles.pill,
          {
            backgroundColor: isDark ? 'rgba(212, 168, 94, 0.16)' : 'rgba(200, 155, 82, 0.14)',
            borderColor: isDark ? 'rgba(212, 168, 94, 0.35)' : 'rgba(200, 155, 82, 0.3)',
          },
          pillStyle,
        ]}
      />

      <Animated.View style={iconStyle}>
        <Icon
          name={isFocused ? icons.active : icons.idle}
          size={IconSize.md}
          color={isFocused ? theme.gold : theme.textSecondary}
        />
      </Animated.View>

      <ThemedText
        style={[
          styles.label,
          { color: isFocused ? theme.gold : theme.textSecondary, fontWeight: isFocused ? '600' : '400' },
        ]}
      >
        {label}
      </ThemedText>
    </PressableScale>
  );
}

/** Modern Floating Dock Navigation Bar — rendered ONLY when logged in */
export function AppTabBar({ state, descriptors, navigation }: TabBarProps) {
  const theme = useTheme();
  const { scheme } = useThemeContext();
  const { isLoggedIn } = useConversations();
  const insets = useSafeAreaInsets();
  const isDark = scheme === 'dark';

  // HIDE navigation bar completely when user is NOT logged in!
  if (!isLoggedIn) {
    return null;
  }

  return (
    <View style={styles.dockWrapper} pointerEvents="box-none">
      <View
        style={[
          styles.dockContainer,
          {
            backgroundColor: isDark ? 'rgba(22, 27, 34, 0.92)' : 'rgba(255, 255, 255, 0.94)',
            borderColor: isDark ? 'rgba(212, 168, 94, 0.25)' : 'rgba(200, 155, 82, 0.2)',
            marginBottom: Math.max(insets.bottom, 12),
            backdropFilter: 'blur(20px)',
          } as any,
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
    </View>
  );
}

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    maxWidth: 380,
    height: TAB_BAR_CONTENT_HEIGHT,
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: Spacing.xs,
    right: Spacing.xs,
    borderRadius: 22,
    borderWidth: 1,
  },
  label: {
    fontSize: 11.5,
    lineHeight: 13,
  },
});
