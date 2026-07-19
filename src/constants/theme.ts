/**
 * Legal Advisor AI design system — the single source of truth for color,
 * typography, spacing, radius, elevation, and layout tokens.
 *
 * Light mode is a warm ivory "law library" palette with deep navy ink.
 * Dark mode lives on the brand navy. Gold is reserved for accents and
 * primary actions on dark surfaces so it always reads as intentional.
 *
 * The `brand*` tokens are identical in both schemes: splash, onboarding,
 * and auth hero surfaces are brand-locked to navy regardless of the
 * system color scheme.
 */

import '@/global.css';

import { Platform, type ViewStyle } from 'react-native';

/** Raw brand hues. Prefer the semantic `Colors` tokens in screens. */
export const Brand = {
  navyDeep: '#0D1424',
  navy: '#16233F',
  navyRaised: '#1F2E50',
  navyBubble: '#2C3B60',
  gold: '#C9A667',
  goldBright: '#D4B06A',
  goldDeep: '#A9873F',
  ivory: '#F7F3E8',
  khaki: '#B9AE93',
} as const;

const brandTokens = {
  brandBackground: Brand.navy,
  brandBackgroundDeep: Brand.navyDeep,
  brandSurface: Brand.navyRaised,
  brandBubble: Brand.navyBubble,
  brandBorder: 'rgba(247, 243, 232, 0.10)',
  brandText: Brand.ivory,
  brandTextSecondary: Brand.khaki,
  brandAccent: Brand.gold,
  brandAccentBright: Brand.goldBright,
} as const;

const light = {
  // Surfaces
  background: '#FAF7F0',
  surface: '#FFFFFF',
  surfaceMuted: '#F2EDDF',
  surfaceElevated: '#FFFFFF',
  border: '#E7E0CD',
  borderStrong: '#D7CDB2',
  overlay: 'rgba(13, 20, 36, 0.45)',

  // Text
  text: '#1B2537',
  textSecondary: '#565E6E',
  textMuted: '#9096A1',

  // Actions
  primary: Brand.navy,
  primaryPressed: '#0F1A30',
  onPrimary: Brand.ivory,
  accent: Brand.gold,
  accentStrong: '#B08F53',
  accentText: '#8A6B2D',
  accentSoft: '#F1E7CF',
  link: '#8A6B2D',

  // Feedback
  success: '#3F7A57',
  successSoft: '#E3EFE6',
  warning: '#A97B2F',
  warningSoft: '#F6ECD9',
  danger: '#B3453B',
  dangerSoft: '#F8E7E4',

  // Controls
  inputBackground: '#FFFFFF',
  inputBorder: '#E0D8C2',
  placeholder: '#9BA0AA',
  icon: '#3C4557',
  iconMuted: '#8E93A0',

  // Chat
  bubbleUser: Brand.navy,
  bubbleUserText: Brand.ivory,
  bubbleAssistant: '#FFFFFF',

  ...brandTokens,
} as const;

const dark: Record<keyof typeof light, string> = {
  // Surfaces
  background: Brand.navyDeep,
  surface: '#15203A',
  surfaceMuted: '#1B2946',
  surfaceElevated: '#213154',
  border: '#26355A',
  borderStrong: '#35476F',
  overlay: 'rgba(4, 8, 16, 0.60)',

  // Text
  text: '#F2EEE2',
  textSecondary: Brand.khaki,
  textMuted: '#7E869B',

  // Actions
  primary: Brand.goldBright,
  primaryPressed: '#C29B54',
  onPrimary: Brand.navy,
  accent: Brand.gold,
  accentStrong: Brand.goldBright,
  accentText: '#E2C589',
  accentSoft: 'rgba(201, 166, 103, 0.14)',
  link: '#E2C589',

  // Feedback
  success: '#82BD98',
  successSoft: 'rgba(90, 160, 115, 0.16)',
  warning: '#DDB472',
  warningSoft: 'rgba(200, 150, 70, 0.16)',
  danger: '#E28B80',
  dangerSoft: 'rgba(190, 90, 78, 0.18)',

  // Controls
  inputBackground: '#15203A',
  inputBorder: '#2B3B63',
  placeholder: '#79819B',
  icon: '#C6C2B2',
  iconMuted: '#79819B',

  // Chat
  bubbleUser: '#33436C',
  bubbleUserText: '#F2EEE2',
  bubbleAssistant: '#15203A',

  ...brandTokens,
};

export type ThemeColor = keyof typeof light;
export type ColorPalette = Record<ThemeColor, string>;

export const Colors: Record<'light' | 'dark', ColorPalette> = { light, dark };

export const Fonts = {
  /** System sans — SF Pro on iOS, Roboto on Android. */
  sans: Platform.select({ web: "Inter, system-ui, -apple-system, sans-serif", default: undefined }),
  /** Bookish serif for display headings — the "law library" voice. */
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    web: "Georgia, 'Times New Roman', serif",
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    web: 'ui-monospace, Menlo, Consolas, monospace',
  }),
};

/** 4pt spacing scale. */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 999,
} as const;

export const IconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 40,
} as const;

export const Layout = {
  /** Default horizontal padding for screens. */
  screenPadding: 20,
  /** Content cap for large screens / web. */
  maxContentWidth: 720,
  /** Minimum touch target. */
  touchTarget: 44,
} as const;

const shadow = (
  opacity: number,
  radius: number,
  offsetY: number,
  elevation: number,
): ViewStyle => ({
  shadowColor: Brand.navyDeep,
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: offsetY },
  elevation,
});

/** Elevation system — soft navy-tinted shadows, never harsh. */
export const Shadows = {
  none: { shadowOpacity: 0, elevation: 0 } satisfies ViewStyle as ViewStyle,
  /** Resting cards. */
  card: shadow(0.06, 12, 4, 2),
  /** Pressed/hovered cards, sticky headers. */
  raised: shadow(0.1, 18, 6, 5),
  /** FABs, modals, floating bars. */
  floating: shadow(0.16, 24, 10, 9),
  /** Gold glow behind primary brand CTAs. */
  goldGlow: {
    shadowColor: Brand.gold,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  } satisfies ViewStyle as ViewStyle,
} as const;
