import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Durations } from '@/constants/motion';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  icon: IconName;
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({ icon, title, message, action, style }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(Durations.gentle)} style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.accentSoft }]}>
        <Icon name={icon} size={IconSize.xl} color={theme.accentText} />
      </View>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
      {action ? (
        <Button
          title={action.label}
          onPress={action.onPress}
          variant="secondary"
          size="md"
          style={styles.action}
        />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: Spacing.sm,
    maxWidth: 280,
  },
  action: {
    marginTop: Spacing.xl,
  },
});
