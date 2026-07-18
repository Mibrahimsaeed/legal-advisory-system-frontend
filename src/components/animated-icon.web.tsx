import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import AppLogo from '@/components/AppLogo';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const HOLD_MS = 1800;
const FADE_MS = 500;

type AnimatedSplashOverlayProps = {
  onFinish: () => void;
};

export function AnimatedSplashOverlay({ onFinish }: AnimatedSplashOverlayProps) {
  const opacity = useSharedValue(1);
  const theme = useTheme();

  useEffect(() => {
    opacity.value = withDelay(HOLD_MS, withTiming(0, { duration: FADE_MS, easing: Easing.out(Easing.ease) }));
    const timeout = setTimeout(onFinish, HOLD_MS + FADE_MS);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.overlay, animatedStyle, { backgroundColor: theme.brandBackground }]}>
      <AppLogo size={96} />
      <ThemedText type="subtitle" themeColor="brandText" style={[styles.title, { fontFamily: Fonts?.serif }]}>
        Legal Advisor AI
      </ThemedText>
      <ThemedText type="small" themeColor="brandAccent" style={[styles.tagline, { fontFamily: Fonts?.mono }]}>
        UNDERSTAND LAW WITH AI
      </ThemedText>
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.dotActive, { backgroundColor: theme.brandAccent }]} />
        <View style={[styles.dot, { backgroundColor: theme.brandTextSecondary }]} />
        <View style={[styles.dot, { backgroundColor: theme.brandTextSecondary }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.five },
  title: { marginTop: Spacing.four, textAlign: 'center' },
  tagline: { marginTop: Spacing.two, textAlign: 'center', letterSpacing: 3, textTransform: 'uppercase' },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.five },
  dot: { width: 6, height: 6, borderRadius: 3, opacity: 0.5 },
  dotActive: { width: 24, opacity: 1 },
});
