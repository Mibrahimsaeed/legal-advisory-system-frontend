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

import AppLogo from '@/components/app-logo';
import ChatPreview from '@/components/onboarding/chat-preview';
import NextButton from '@/components/onboarding/next-button';
import PageIndicator from '@/components/onboarding/page-indicator';
import { DocumentStackVisual, PrivacyVisual } from '@/components/onboarding/slide-visuals';
import { ThemedText } from '@/components/themed-text';
import { PressableScale } from '@/components/ui/pressable-scale';
import ScalesEmblem from '@/components/ui/scales-emblem';
import { Durations, Easings, staggerDelay } from '@/constants/motion';
import { Brand, Layout, Spacing } from '@/constants/theme';

type Slide = {
  key: string;
  visual: ReactNode;
  title: ReactNode;
  description: string;
};

function SlideTitle({ before, emphasis, after }: { before?: string; emphasis: string; after?: string }) {
  return (
    <ThemedText type="title" themeColor="brandText" style={styles.title}>
      {before ? `${before}\n` : ''}
      <ThemedText type="title" themeColor="brandText" style={[styles.title, styles.titleEmphasis]}>
        {emphasis}
      </ThemedText>
      {after ? `\n${after}` : ''}
    </ThemedText>
  );
}

const SLIDES: Slide[] = [
  {
    key: 'ask',
    visual: <ChatPreview />,
    title: <SlideTitle before="Ask legal" emphasis="questions" after="instantly" />,
    description:
      'Get simple, clear answers to complex legal topics in seconds — no confusing jargon.',
  },
  {
    key: 'documents',
    visual: <DocumentStackVisual />,
    title: <SlideTitle before="Understand" emphasis="documents" after="& your rights" />,
    description:
      'Contracts, notices, and the rules that protect you — summarised in plain language.',
  },
  {
    key: 'private',
    visual: <PrivacyVisual />,
    title: <SlideTitle before="Confidential &" emphasis="always" after="available" />,
    description:
      'Your questions stay private, any time of day. And when a real lawyer is needed, we say so.',
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
  const range = [(index - 1) * width, index * width, (index + 1) * width];

  // Text glides slightly faster than the page, the visual slightly
  // slower — a subtle depth cue while swiping.
  const visualStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, range, [0.2, 1, 0.2], 'clamp'),
    transform: [{ translateX: interpolate(scrollX.value, range, [28, 0, -28], 'clamp') }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, range, [0, 1, 0], 'clamp'),
    transform: [{ translateX: interpolate(scrollX.value, range, [64, 0, -64], 'clamp') }],
  }));

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.slideVisual, visualStyle]}>
        <Animated.View entering={FadeInDown.delay(staggerDelay(0, 120)).duration(Durations.slow).easing(Easings.enter)}>
          {slide.visual}
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.slideText, textStyle]}>
        <Animated.View entering={FadeInDown.delay(staggerDelay(1, 200)).duration(Durations.slow).easing(Easings.enter)}>
          {slide.title}
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(staggerDelay(2, 200)).duration(Durations.slow).easing(Easings.enter)}>
          <ThemedText type="small" themeColor="brandTextSecondary" style={styles.description}>
            {slide.description}
          </ThemedText>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
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

  const skipStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [(SLIDES.length - 2) * width, (SLIDES.length - 1) * width],
      [1, 0],
      'clamp',
    ),
  }));

  const finish = () => router.replace('/login');

  const handleNext = () => {
    if (isLast) {
      finish();
      return;
    }
    scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={styles.watermark} pointerEvents="none">
        <ScalesEmblem size={280} strokeWidth={1.5} />
      </View>

      <Animated.View entering={FadeIn.duration(Durations.slow)} style={styles.header}>
        <AppLogo size={34} />
        <Animated.View style={skipStyle}>
          <PressableScale
            onPress={finish}
            haptic="selection"
            hitSlop={12}
            disabled={isLast}
            accessibilityLabel="Skip onboarding"
            style={styles.skipButton}
          >
            <ThemedText type="smallMedium" themeColor="brandTextSecondary">
              Skip
            </ThemedText>
          </PressableScale>
        </Animated.View>
      </Animated.View>

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

      <Animated.View entering={FadeIn.delay(250).duration(Durations.slow)} style={styles.footer}>
        <PageIndicator count={SLIDES.length} scrollX={scrollX} pageWidth={width} />
        <NextButton page={page} total={SLIDES.length} onPress={handleNext} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.ivory,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding + 4,
    paddingTop: Spacing.sm,
  },
  skipButton: {
    minHeight: Layout.touchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  pager: {
    flex: 1,
  },
  slide: {
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  slideVisual: {
    alignItems: 'center',
  },
  slideText: {
    width: '100%',
    paddingHorizontal: Spacing.xxl + 4,
    marginTop: Spacing.xxl + 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
  },
  titleEmphasis: {
    fontStyle: 'italic',
  },
  description: {
    marginTop: Spacing.lg + 2,
    maxWidth: 300,
    fontSize: 15,
    lineHeight: 23,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding + 8,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
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
