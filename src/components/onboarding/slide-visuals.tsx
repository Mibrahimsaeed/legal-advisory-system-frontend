import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Easings } from '@/constants/motion';
import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';

const INK_FAINT = 'rgba(20, 20, 20, 0.08)';
const INK_SOFT = 'rgba(20, 20, 20, 0.35)';

function Bar({ width, strong = false }: { width: number | `${number}%`; strong?: boolean }) {
  return (
    <View
      style={{
        width,
        height: 8,
        borderRadius: 4,
        backgroundColor: strong ? INK_SOFT : INK_FAINT,
      }}
    />
  );
}

/**
 * Slide 2 visual — a floating stack of "reviewed documents".
 */
export function DocumentStackVisual() {
  const float = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easings.standard }),
        withTiming(0, { duration: 1600, easing: Easings.standard }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(float);
  }, [float, reducedMotion]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -5 * float.value }],
  }));

  return (
    <View style={styles.stage}>
      <View style={[styles.docCard, styles.docBack]} />
      <View style={[styles.docCard, styles.docMiddle]} />
      <Animated.View style={[styles.docCard, styles.docFront, frontStyle]}>
        <View style={styles.docHeader}>
          <View style={styles.docIconCircle}>
            <Icon name="document" size={16} color={Brand.ink} />
          </View>
          <View style={styles.docHeaderBars}>
            <Bar width={110} strong />
            <Bar width={70} />
          </View>
        </View>
        <View style={styles.docBody}>
          <Bar width="100%" />
          <Bar width="88%" />
          <Bar width="94%" />
          <Bar width="60%" />
        </View>
        <View style={styles.docFooter}>
          <Icon name="shield" size={15} color={Brand.ink} />
          <ThemedText type="caption" themeColor="brandAccent">
            Reviewed in plain language
          </ThemedText>
        </View>
      </Animated.View>
    </View>
  );
}

function FeatureBadge({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.featureBadge}>
      <Icon name={icon} size={14} color={Brand.ink} />
      <ThemedText type="caption" themeColor="brandText">
        {label}
      </ThemedText>
    </View>
  );
}

/**
 * Slide 3 visual — a slowly rotating dashed ring around a lock, with
 * promise badges beneath.
 */
export function PrivacyVisual() {
  const rotation = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    rotation.value = withRepeat(withTiming(360, { duration: 14000, easing: Easing.linear }), -1);
    return () => cancelAnimation(rotation);
  }, [rotation, reducedMotion]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.stage}>
      <View style={styles.privacyBadgeStack}>
        <Animated.View style={[styles.ring, ringStyle]}>
          <Svg width={150} height={150}>
            <Circle
              cx={75}
              cy={75}
              r={70}
              stroke={Brand.ink}
              strokeOpacity={0.3}
              strokeWidth={1.5}
              strokeDasharray="2 10"
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
        <View style={styles.lockCircle}>
          <Icon name="lock" size={26} color={Brand.ink} />
        </View>
      </View>

      <View style={styles.featureRow}>
        <FeatureBadge icon="shield" label="Private" />
        <FeatureBadge icon="clock" label="24 / 7" />
        <FeatureBadge icon="check" label="Clear" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: 276,
    height: 236,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docCard: {
    position: 'absolute',
    width: 220,
    borderRadius: Radius.xl - 4,
    backgroundColor: Brand.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(20, 20, 20, 0.08)',
    ...Shadows.card,
  },
  docBack: {
    height: 190,
    opacity: 0.45,
    transform: [{ rotate: '-7deg' }, { translateX: -14 }],
  },
  docMiddle: {
    height: 195,
    opacity: 0.7,
    transform: [{ rotate: '5deg' }, { translateX: 12 }],
  },
  docFront: {
    padding: Spacing.lg,
    gap: Spacing.lg - 2,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
  },
  docIconCircle: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: Brand.ivoryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docHeaderBars: {
    gap: 6,
  },
  docBody: {
    gap: 8,
  },
  docFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  privacyBadgeStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  lockCircle: {
    width: 84,
    height: 84,
    borderRadius: Radius.full,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: 'rgba(20, 20, 20, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  featureRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    marginTop: Spacing.xl,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Brand.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(20, 20, 20, 0.08)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    height: 30,
  },
});
