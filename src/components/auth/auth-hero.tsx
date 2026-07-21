import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import AppLogo from '@/components/app-logo';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Durations, Easings, staggerDelay } from '@/constants/motion';
import { Brand, IconSize, Layout, Radius, Spacing } from '@/constants/theme';

type AuthHeroProps = {
  title: string;
  subtitle: string;
  showBack?: boolean;
};

/** Ivory hero block shared by the auth screens: logo, serif title, subtitle. */
export function AuthHero({ title, subtitle, showBack = false }: AuthHeroProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {showBack ? (
        <PressableScale
          onPress={() => router.back()}
          haptic="selection"
          hitSlop={8}
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <Icon name="back" size={IconSize.md} color={Brand.ink} />
        </PressableScale>
      ) : null}

      <Animated.View
        entering={FadeInDown.delay(staggerDelay(0, 80)).duration(Durations.slow).easing(Easings.enter)}
        style={styles.logo}
      >
        <AppLogo size={64} ring />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(staggerDelay(1, 80)).duration(Durations.slow).easing(Easings.enter)}>
        <ThemedText type="title" themeColor="brandText" style={styles.title}>
          {title}
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(staggerDelay(2, 80)).duration(Durations.slow).easing(Easings.enter)}>
        <ThemedText type="small" themeColor="brandTextSecondary" style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl + 4,
  },
  backButton: {
    position: 'absolute',
    left: Layout.screenPadding,
    top: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Brand.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(20, 20, 20, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logo: {
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
