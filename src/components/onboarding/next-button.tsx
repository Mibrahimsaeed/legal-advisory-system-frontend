import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NextButtonProps = {
  onPress: () => void;
};

export default function NextButton({ onPress }: NextButtonProps) {
  const theme = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      haptic="medium"
      scaleTo={0.93}
      accessibilityLabel="Next"
      style={styles.container}
    >
      <View style={[styles.core, { backgroundColor: theme.gold }, Shadows.card]}>
        <Icon name="forward" size={22} color={theme.onPrimary} weight="semibold" />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
