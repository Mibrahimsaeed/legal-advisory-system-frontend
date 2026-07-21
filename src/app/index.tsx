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
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import AppLogo from '@/components/app-logo';
import { ThemedText } from '@/components/themed-text';
import ScalesEmblem from '@/components/ui/scales-emblem';
import { Durations, Easings, Springs } from '@/constants/motion';
import { Brand, Spacing } from '@/constants/theme';

/** How long the composed splash holds before the exit transition. */
const HOLD_MS = 2100;
const EXIT_MS = 420;
const GLOW_SIZE = 300;

/**
 * Animated brand splash. Continues the native splash (same ivory) with the
 * logo scaling in over a breathing ink glow, then fades the whole
 * composition out and hands off to onboarding.
 */
export default function SplashScreen() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const exitProgress = useSharedValue(0);

  useEffect(() => {
    const goNext = () => router.replace('/onboarding');

    if (reducedMotion) {
      logoOpacity.value = 1;
      logoScale.value = 1;
      glowOpacity.value = 1;
      const timeout = setTimeout(goNext, 1400);
      return () => clearTimeout(timeout);
    }

    // Entrance: logo springs in over a glow that breathes.
    logoOpacity.value = withTiming(1, { duration: Durations.gentle, easing: Easings.enter });
    logoScale.value = withSpring(1, Springs.bouncy);
    glowOpacity.value = withDelay(150, withTiming(1, { duration: Durations.slow }));
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 1100, easing: Easings.standard }),
        withTiming(0.96, { duration: 1100, easing: Easings.standard }),
      ),
      -1,
      true,
    );

    // Exit: fade + drift up, then navigate.
    exitProgress.value = withDelay(
      HOLD_MS,
      withTiming(1, { duration: EXIT_MS, easing: Easings.exit }, (finished) => {
        if (finished) runOnJS(goNext)();
      }),
    );

    return () => {
      cancelAnimation(glowScale);
      cancelAnimation(exitProgress);
    };
    // Runs once on mount; the shared values and router are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: 1 - exitProgress.value,
    transform: [{ translateY: -16 * exitProgress.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.watermark} pointerEvents="none">
        <ScalesEmblem size={320} strokeWidth={1.5} />
      </View>

      <Animated.View style={[styles.content, containerStyle]}>
        <View style={styles.logoStack}>
          <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none">
            <Svg width={GLOW_SIZE} height={GLOW_SIZE}>
              <Defs>
                <RadialGradient id="splashGlow" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={Brand.ink} stopOpacity={0.08} />
                  <Stop offset="55%" stopColor={Brand.ink} stopOpacity={0.03} />
                  <Stop offset="100%" stopColor={Brand.ink} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={GLOW_SIZE / 2} cy={GLOW_SIZE / 2} r={GLOW_SIZE / 2} fill="url(#splashGlow)" />
            </Svg>
          </Animated.View>

          <Animated.View style={logoStyle}>
            <AppLogo size={128} ring />
          </Animated.View>
        </View>

        <Animated.View entering={reducedMotion ? undefined : FadeInUp.delay(380).duration(520).easing(Easings.enter)}>
          <ThemedText type="display" themeColor="brandText" style={styles.title}>
            Legal Advisor AI
          </ThemedText>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(640).duration(520)}>
          <ThemedText type="overline" themeColor="brandAccent" style={styles.tagline}>
            Understand law with AI
          </ThemedText>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={styles.footer}
        entering={reducedMotion ? undefined : FadeIn.delay(900).duration(600)}
      >
        <ThemedText type="caption" themeColor="brandTextSecondary">
          General guidance · Not a substitute for a lawyer
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.ivory,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  title: {
    marginTop: Spacing.xl,
    textAlign: 'center',
  },
  tagline: {
    marginTop: Spacing.md,
    textAlign: 'center',
    letterSpacing: 3,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xxl + Spacing.lg,
    alignItems: 'center',
  },
  watermark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.05,
  },
});
