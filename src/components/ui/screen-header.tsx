import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /** Hide the back button (e.g. on tab roots). */
  hideBack?: boolean;
  right?: ReactNode;
};

/** In-screen header for pushed screens: back button, title block, right slot. */
export function ScreenHeader({ title, subtitle, hideBack = false, right }: ScreenHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {!hideBack ? (
        <PressableScale
          onPress={() => router.back()}
          haptic="selection"
          hitSlop={8}
          accessibilityLabel="Go back"
          style={[styles.backButton, { backgroundColor: theme.surfaceMuted }]}
        >
          <Icon name="back" size={IconSize.md} color={theme.icon} />
        </PressableScale>
      ) : null}

      <View style={styles.titleBlock}>
        <ThemedText type="subtitle" numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="textMuted" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg + 4,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    gap: 1,
  },
});
