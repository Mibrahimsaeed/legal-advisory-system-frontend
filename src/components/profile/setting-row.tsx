import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SettingRowProps = {
  icon: IconName;
  label: string;
  description?: string;
  /** Trailing content: a Switch, a value label, or nothing (chevron shown when pressable). */
  right?: ReactNode;
  onPress?: () => void;
  danger?: boolean;
};

/** One row inside a settings card. */
export function SettingRow({ icon, label, description, right, onPress, danger = false }: SettingRowProps) {
  const theme = useTheme();
  const tint = danger ? theme.danger : theme.accentText;
  const iconBg = danger ? theme.dangerSoft : theme.accentSoft;

  const content = (
    <View style={styles.row}>
      <View style={[styles.iconSquare, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={IconSize.md} color={tint} />
      </View>

      <View style={styles.textBlock}>
        <ThemedText type="bodyMedium" themeColor={danger ? 'danger' : 'text'} style={styles.label}>
          {label}
        </ThemedText>
        {description ? (
          <ThemedText type="caption" themeColor="textMuted">
            {description}
          </ThemedText>
        ) : null}
      </View>

      {right ?? (onPress ? <Icon name="chevronRight" size={IconSize.sm} color={theme.iconMuted} /> : null)}
    </View>
  );

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        haptic="selection"
        scaleTo={0.99}
        dimTo={0.85}
        accessibilityLabel={label}
        style={styles.pressable}
      >
        {content}
      </PressableScale>
    );
  }

  return <View style={styles.pressable}>{content}</View>;
}

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: Spacing.md - 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconSquare: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
  },
});
