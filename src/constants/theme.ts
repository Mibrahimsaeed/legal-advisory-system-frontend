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
  background: '#FFFFFF',
  surface: '#F5F4EF',
  surfaceMuted: '#EDEBE4',
  surfaceElevated: '#FFFFFF',
  border: '#E7E5DD',
  borderStrong: '#D6D3C9',
  overlay: 'rgba(20, 20, 20, 0.45)',

  // Text
  text: Brand.ink,
  textSecondary: '#5B5A54',
  textMuted: '#9C9A92',

  // Actions
  primary: Brand.ink,
  primaryPressed: '#000000',
  onPrimary: '#FFFFFF',
  accent: Brand.ink,
  accentStrong: Brand.ink,
  accentText: Brand.ink,
  accentSoft: '#EFEEE8',
  link: Brand.ink,

  // Feedback
  success: '#2E9E5B',
  successSoft: '#E7F6EC',
  warning: Brand.amber,
  warningSoft: '#FBF1DE',
  danger: Brand.danger,
  dangerSoft: '#FBE3DE',

  // Controls
  inputBackground: '#FFFFFF',
  inputBorder: '#DEDBD1',
  placeholder: '#B2AFA5',
  icon: Brand.ink,
  iconMuted: '#9C9A92',

  // Chat
  bubbleUser: '#F0EFE9',
  bubbleUserText: Brand.ink,
  bubbleAssistant: '#F5F4EF',

  ...brandTokens,
} as const;

const dark: Record<keyof typeof light, string> = {
  // Surfaces
  background: '#121212',
  surface: '#1C1C1C',
  surfaceMuted: '#242424',
  surfaceElevated: '#242424',
  border: 'rgba(255, 255, 255, 0.10)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',
  overlay: 'rgba(0, 0, 0, 0.6)',

  // Text
  text: '#F5F4EF',
  textSecondary: '#B7B5AB',
  textMuted: '#7A7972',

  // Actions
  primary: '#FFFFFF',
  primaryPressed: '#E7E5DD',
  onPrimary: Brand.ink,
  accent: '#FFFFFF',
  accentStrong: '#FFFFFF',
  accentText: '#FFFFFF',
  accentSoft: 'rgba(255, 255, 255, 0.08)',
  link: '#FFFFFF',

  // Feedback
  success: '#57C883',
  successSoft: 'rgba(87, 200, 131, 0.12)',
  warning: Brand.amber,
  warningSoft: 'rgba(231, 169, 59, 0.12)',
  danger: '#F1735C',
  dangerSoft: 'rgba(241, 115, 92, 0.12)',

  // Controls
  inputBackground: '#1C1C1C',
  inputBorder: 'rgba(255, 255, 255, 0.16)',
  placeholder: '#5E5D56',
  icon: '#FFFFFF',
  iconMuted: '#7A7972',

  // Chat
  bubbleUser: '#242424',
  bubbleUserText: '#FFFFFF',
  bubbleAssistant: '#1C1C1C',

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
