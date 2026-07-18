import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',

    brandBackground: '#16233F',
    brandBackgroundElement: '#24365C',
    brandAccent: '#C9A667',
    brandText: '#FCF8EE',
    brandTextSecondary: '#B9AE93',
  },

  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',

    brandBackground: '#16233F',
    brandBackgroundElement: '#24365C',
    brandAccent: '#C9A667',
    brandText: '#FCF8EE',
    brandTextSecondary: '#B9AE93',
  },
} as const;

export type Theme = keyof typeof Colors;
export type ThemeColor = keyof typeof Colors.light;

export const Fonts = {
  serif: Platform.select({
    ios: 'Times New Roman',
    android: 'serif',
    web: 'Georgia',
  })!,
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    web: 'monospace',
  })!,
};

export const Spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
} as const;
