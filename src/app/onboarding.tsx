import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import ChatPreview from '@/components/onboarding/chat-preview';
import { FeatureCardsVisual } from '@/components/onboarding/feature-cards';
import NextButton from '@/components/onboarding/next-button';
import PageIndicator from '@/components/onboarding/page-indicator';
import { PedestalScalesVisual } from '@/components/onboarding/pedestal-scales';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { CourtColumnsBackground } from '@/components/ui/court-columns';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Durations, Easings, staggerDelay } from '@/constants/motion';
import { Layout, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useThemeContext } from '@/providers/theme-provider';

type Slide = {
  key: string;
  visual: ReactNode;
  title: ReactNode;
  description?: string;
};

function TitleSlide1() {
  const theme = useTheme();
  return (
    <ThemedText style={[styles.title, { color: theme.text }]}>
      Ask legal{'\n'}
      <ThemedText style={[styles.title, styles.italic, { color: theme.gold }]}>
        questions{'\n'}
      </ThemedText>
      instantly
    </ThemedText>
  );
}

function TitleSlide2() {
  const theme = useTheme();
  return (
    <ThemedText style={[styles.title, { color: theme.text }]}>
      Built for{' '}
      <ThemedText style={[styles.title, styles.italic, { color: theme.gold }]}>
        clarity{'\n'}
      </ThemedText>
      and{' '}
      <ThemedText style={[styles.title, styles.italic, { color: theme.gold }]}>
        confidence
      </ThemedText>
    </ThemedText>
  );
}

function TitleSlide3() {
  const theme = useTheme();
  return (
    <ThemedText style={[styles.title, { color: theme.text }]}>
      Your legal{'\n'}
      companion{'\n'}
      <ThemedText style={[styles.title, { color: theme.text }]}>
        24/7
      </ThemedText>
    </ThemedText>
  );
}

const SLIDES: Slide[] = [
  {
    key: 'ask',
    visual: <ChatPreview />,
    title: <TitleSlide1 />,
    description:
      'Get simple, clear answers to complex legal topics in seconds — no confusing jargon.',
  },
  {
    key: 'clarity',
    visual: <FeatureCardsVisual />,
    title: <TitleSlide2 />,
  },
  {
    key: 'companion',
    visual: <PedestalScalesVisual />,
    title: <TitleSlide3 />,
    description:
      'From contracts to workplace issues, get the guidance you need, anytime.',
  },
];

function OnboardingSlide({
  index,
  scrollX,
  width,
  slide,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  slide: Slide;
}) {
  const theme = useTheme();
  const range = [(index - 1) * width, index * width, (index + 1) * width];

  const visualStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, range, [0.1, 1, 0.1], 'clamp'),
    transform: [{ translateX: interpolate(scrollX.value, range, [24, 0, -24], 'clamp') }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, range, [0, 1, 0], 'clamp'),
    transform: [{ translateX: interpolate(scrollX.value, range, [48, 0, -48], 'clamp') }],
  }));

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.slideText, textStyle]}>
        <Animated.View entering={FadeInDown.delay(staggerDelay(0, 150)).duration(Durations.slow).easing(Easings.enter)}>
          {slide.title}
        </Animated.View>
        {slide.description ? (
          <Animated.View entering={FadeInDown.delay(staggerDelay(1, 150)).duration(Durations.slow).easing(Easings.enter)}>
            <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
              {slide.description}
            </ThemedText>
          </Animated.View>
        ) : null}
      </Animated.View>

      <Animated.View style={[styles.slideVisual, visualStyle]}>
        <Animated.View entering={FadeInDown.delay(staggerDelay(2, 150)).duration(Durations.slow).easing(Easings.enter)}>
          {slide.visual}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { scheme } = useThemeContext();
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [page, setPage] = useState(0);
  const isLast = page >= SLIDES.length - 1;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  useAnimatedReaction(
    () => (width > 0 ? Math.round(scrollX.value / width) : 0),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setPage)(Math.min(Math.max(current, 0), SLIDES.length - 1));
      }
    },
  );

  const finish = () => router.replace('/(tabs)/chat');

  const handleNext = () => {
    if (isLast) {
      finish();
      return;
    }
    scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      {/* Background Court Columns */}
      <CourtColumnsBackground opacity={scheme === 'dark' ? 0.18 : 0.08} />

      {/* Top Header */}
      <Animated.View entering={FadeIn.duration(Durations.slow)} style={styles.header}>
        <View style={{ flex: 1 }} />
        <PressableScale
          onPress={finish}
          haptic="selection"
          hitSlop={12}
          accessibilityLabel="Skip onboarding"
          style={styles.skipButton}
        >
          <ThemedText style={[styles.skipText, { color: theme.textSecondary }]}>
            Skip
          </ThemedText>
        </PressableScale>
      </Animated.View>

      {/* Pager */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        {SLIDES.map((slide, index) => (
          <OnboardingSlide key={slide.key} index={index} scrollX={scrollX} width={width} slide={slide} />
        ))}
      </Animated.ScrollView>

      {/* Footer Navigation */}
      <Animated.View entering={FadeIn.delay(200).duration(Durations.slow)} style={styles.footer}>
        {!isLast ? (
          <View style={styles.standardFooter}>
            <PageIndicator count={SLIDES.length} scrollX={scrollX} pageWidth={width} />
            <NextButton onPress={handleNext} />
          </View>
        ) : (
          <View style={styles.lastFooter}>
            <Button
              title="Get Started"
              variant="primary"
              onPress={finish}
              fullWidth
              style={styles.getStartedButton}
            />
            <View style={styles.accountRow}>
              <ThemedText style={[styles.accountText, { color: theme.textSecondary }]}>
                Already have an account?{' '}
              </ThemedText>
              <PressableScale onPress={() => router.replace('/login')} haptic="light">
                <ThemedText style={[styles.accountText, styles.signInLink, { color: theme.gold }]}>
                  Sign in
                </ThemedText>
              </PressableScale>
            </View>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: Layout.screenPadding + 4,
    paddingTop: Spacing.xs,
    height: 44,
  },
  skipButton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pager: {
    flex: 1,
  },
  slide: {
    paddingTop: Spacing.md,
    paddingHorizontal: Layout.screenPadding + 4,
  },
  slideText: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '400',
  },
  italic: {
    fontStyle: 'italic',
  },
  description: {
    marginTop: Spacing.md,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 320,
  },
  slideVisual: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: Layout.screenPadding + 8,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  standardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastFooter: {
    alignItems: 'center',
    width: '100%',
  },
  getStartedButton: {
    marginBottom: Spacing.md,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  accountText: {
    fontSize: 13.5,
  },
  signInLink: {
    fontWeight: '600',
  },
});
