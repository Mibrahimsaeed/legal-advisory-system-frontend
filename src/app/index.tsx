import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeIn,
  FadeInUp,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import AppLogo from '@/components/app-logo';
import { ThemedText } from '@/components/themed-text';
import { CourtColumnsBackground } from '@/components/ui/court-columns';
import { Durations, Easings, Springs } from '@/constants/motion';
import { Layout, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useThemeContext } from '@/providers/theme-provider';

const HOLD_MS = 2200;
const EXIT_MS = 400;

export default function SplashScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { scheme } = useThemeContext();
  const reducedMotion = useReducedMotion();

  const logoScale = useSharedValue(0.85);
  const logoOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const exitProgress = useSharedValue(0);

  useEffect(() => {
    const goNext = () => router.replace('/onboarding');

    if (reducedMotion) {
      logoOpacity.value = 1;
      logoScale.value = 1;
      progressWidth.value = 1;
      const timeout = setTimeout(goNext, 1400);
      return () => clearTimeout(timeout);
    }

    // Entrance animation
    logoOpacity.value = withTiming(1, { duration: Durations.gentle, easing: Easings.enter });
    logoScale.value = withSpring(1, Springs.bouncy);
    progressWidth.value = withTiming(1, { duration: HOLD_MS, easing: Easings.standard });

    // Exit transition
    exitProgress.value = withDelay(
      HOLD_MS,
      withTiming(1, { duration: EXIT_MS, easing: Easings.exit }, (finished) => {
        if (finished) runOnJS(goNext)();
      }),
    );

    return () => {
      cancelAnimation(exitProgress);
      cancelAnimation(progressWidth);
    };
  }, [reducedMotion, router, logoOpacity, logoScale, progressWidth, exitProgress]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: 1 - exitProgress.value,
    transform: [{ translateY: -12 * exitProgress.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      {/* Court Pillars Background Texture */}
      <CourtColumnsBackground opacity={scheme === 'dark' ? 0.22 : 0.12} />

      <Animated.View style={[styles.content, containerStyle]}>
        <Animated.View style={logoStyle}>
          <AppLogo size={90} showText />
        </Animated.View>
      </Animated.View>

      {/* Footer Branding & Loading Bar */}
      <Animated.View
        style={[styles.footer, containerStyle]}
        entering={reducedMotion ? undefined : FadeIn.delay(400).duration(600)}
      >
        <ThemedText style={[styles.footerTitle, { color: theme.text }]}>
          AI-Powered Legal Guidance
        </ThemedText>
        <ThemedText style={[styles.footerSubtitle, { color: theme.textSecondary }]}>
          Trusted answers. Better decisions.
        </ThemedText>

        {/* Golden Progress Bar Line */}
        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
          <Animated.View style={[styles.progressBar, { backgroundColor: theme.gold }, progressStyle]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xxl + 12,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Layout.screenPadding + 12,
  },
  footerTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtitle: {
    fontSize: 13,
    marginBottom: Spacing.xl,
  },
  progressTrack: {
    height: 3,
    width: 140,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});
