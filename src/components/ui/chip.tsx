import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  icon?: IconName;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Pill chip for topics, suggestions, and filters. */
export function Chip({ label, icon, selected = false, onPress, style }: ChipProps) {
  const theme = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      scaleTo={0.96}
      accessibilityState={{ selected }}
      style={[
        styles.base,
        {
          backgroundColor: selected ? theme.accentSoft : theme.surface,
          borderColor: selected ? theme.accentStrong : theme.border,
        },
        style,
      ]}
    >
      {icon ? (
        <Icon name={icon} size={IconSize.sm} color={selected ? theme.accentText : theme.accent} />
      ) : null}
      <ThemedText type="smallMedium" themeColor={selected ? 'accentText' : 'textSecondary'}>
        {label}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    height: 38,
    paddingHorizontal: Spacing.lg - 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
});
