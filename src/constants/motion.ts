/**
 * Motion tokens — every animation in the app draws from these so timing
 * and character stay consistent. Durations in ms.
 */

import { Easing } from 'react-native-reanimated';

export const Durations = {
  /** Micro feedback: press states, toggles. */
  fast: 160,
  /** Standard UI transitions: fades, small movements. */
  base: 240,
  /** Entrances of larger elements. */
  gentle: 340,
  /** Screen-level choreography. */
  slow: 480,
  /** Hero moments (splash, onboarding). */
  slower: 700,
} as const;

export const Easings = {
  /** Default — fast start, soft landing. */
  standard: Easing.bezier(0.2, 0, 0, 1),
  /** Decelerating entrances. */
  enter: Easing.out(Easing.cubic),
  /** Accelerating exits. */
  exit: Easing.in(Easing.cubic),
  /** Expressive, for hero moments. */
  emphasized: Easing.bezier(0.05, 0.7, 0.1, 1),
} as const;

/** Spring presets for `withSpring`. */
export const Springs = {
  /** Settles quickly with no visible bounce — releases, layout. */
  gentle: { damping: 22, stiffness: 190, mass: 1 },
  /** Tight and immediate — press-in feedback. */
  snappy: { damping: 19, stiffness: 320, mass: 0.8 },
  /** A single soft overshoot — playful entrances. */
  bouncy: { damping: 13, stiffness: 240, mass: 0.9 },
} as const;

export const StaggerStep = 70;

/** Delay for the nth item of a staggered list entrance. */
export function staggerDelay(index: number, base = 0, step = StaggerStep): number {
  return base + index * step;
}
