/**
 * Legal Advisor AI design system — the single source of truth for color,
 * typography, spacing, radius, elevation, and layout tokens.
 *
 * A minimal monochrome "paper & ink" palette: warm ivory/white surfaces
 * with near-black ink for text and primary actions. Dark mode inverts to
 * near-black surfaces with ivory ink. No brand color beyond black/white —
 * amber is reserved for tiny semantic accents (ratings) only.
 *
 * The `brand*` tokens are identical in both schemes: splash, onboarding,
 * and auth hero surfaces are brand-locked to ivory regardless of the
 * system color scheme.
 */

import '@/global.css';

import { Platform, type ViewStyle } from 'react-native';

/** Raw brand hues. Prefer the semantic `Colors` tokens in screens. */
export const Brand = {
  ink: '#141414',
  inkRaised: '#1F1F1F',
  ivory: '#F7F6F2',
  ivoryDeep: '#EFEDE7',
  cream: '#FBFAF7',
  white: '#FFFFFF',
  gray: '#8B8A85',
  grayLight: '#DEDCD5',
  amber: '#E7A93B',
  danger: '#E2513A',
} as const;

const brandTokens = {
  brandBackground: Brand.ivory,
  brandBackgroundDeep: Brand.cream,
  brandSurface: Brand.white,
  brandBubble: Brand.ivoryDeep,
  brandBorder: 'rgba(20, 20, 20, 0.08)',
  brandText: Brand.ink,
  brandTextSecondary: Brand.gray,
  brandAccent: Brand.ink,
  brandAccentBright: Brand.ink,
} as const;

const light = {
  // Surfaces
  background: '#F8F6F2',
  surface: '#FFFFFF',
  card: '#FCFBF9',
  surfaceMuted: '#F4F2EC',
  surfaceElevated: '#FFFFFF',
  border: '#E8E3DB',
  borderStrong: '#D9D3C8',
  overlay: 'rgba(24, 24, 24, 0.45)',

  // Text
  text: '#181818',
  textSecondary: '#6E6B66',
  textMuted: '#99958F',

  // Gold
  gold: '#C89B52',
  goldBright: '#E5D1A8',
  goldHover: '#B7863E',
  lightGold: '#E5D1A8',

  // Actions
  primary: '#C89B52',
  primaryPressed: '#B7863E',
  onPrimary: '#FFFFFF',
  accent: '#C89B52',
  accentStrong: '#B7863E',
  accentText: '#181818',
  accentSoft: '#E5D1A8',
  link: '#C89B52',

  // Feedback
  success: '#2E9E5B',
  successSoft: '#E7F6EC',
  warning: '#C89B52',
  warningSoft: '#FBF1DE',
  danger: Brand.danger,
  dangerSoft: '#FBE3DE',

  // Controls
  inputBackground: '#FFFFFF',
  inputBorder: '#E8E3DB',
  placeholder: '#A3A099',
  icon: '#181818',
  iconMuted: '#6E6B66',

  // Chat
  bubbleUser: '#E5D1A8',
  bubbleUserText: '#181818',
  bubbleAssistant: '#FCFBF9',

  ...brandTokens,
} as const;

const dark: Record<keyof typeof light, string> = {
  // Surfaces
  background: '#0E1116',
  surface: '#161B22',
  card: '#1C222C',
  surfaceMuted: '#161B22',
  surfaceElevated: '#1C222C',
  border: '#2A313D',
  borderStrong: '#3B4454',
  overlay: 'rgba(0, 0, 0, 0.65)',

  // Text
  text: '#F5F3EE',
  textSecondary: '#B6B9BF',
  textMuted: '#7F848E',

  // Gold
  gold: '#D4A85E',
  goldBright: '#E6BE79',
  goldHover: '#E6BE79',
  lightGold: '#2D271E',

  // Actions
  primary: '#D4A85E',
  primaryPressed: '#E6BE79',
  onPrimary: '#0E1116',
  accent: '#D4A85E',
  accentStrong: '#E6BE79',
  accentText: '#F5F3EE',
  accentSoft: 'rgba(212, 168, 94, 0.15)',
  link: '#E6BE79',

  // Feedback
  success: '#57C883',
  successSoft: 'rgba(87, 200, 131, 0.12)',
  warning: '#D4A85E',
  warningSoft: 'rgba(212, 168, 94, 0.15)',
  danger: '#F1735C',
  dangerSoft: 'rgba(241, 115, 92, 0.12)',

  // Controls
  inputBackground: '#161B22',
  inputBorder: '#2A313D',
  placeholder: '#5E6573',
  icon: '#F5F3EE',
  iconMuted: '#B6B9BF',

  // Chat
  bubbleUser: '#1C222C',
  bubbleUserText: '#F5F3EE',
  bubbleAssistant: '#161B22',

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
  shadowColor: Brand.ink,
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: offsetY },
  elevation,
});

/** Elevation system — soft ink-tinted shadows. */
export const Shadows = {
  none: { shadowOpacity: 0, elevation: 0 } satisfies ViewStyle as ViewStyle,
  /** Resting cards. */
  card: shadow(0.05, 12, 4, 2),
  /** Pressed/hovered cards, sticky headers. */
  raised: shadow(0.08, 18, 6, 5),
  /** FABs, modals, floating bars. */
  floating: shadow(0.14, 24, 10, 9),
} as const;
