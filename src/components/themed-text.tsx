import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subtitle'
  | 'body'
  | 'bodyMedium'
  | 'small'
  | 'smallMedium'
  | 'caption'
  | 'overline'
  | 'link'
  | 'code';

export type ThemedTextProps = TextProps & {
  type?: TextVariant;
  themeColor?: ThemeColor;
};

/**
 * Typography component. Display and title speak in the brand serif; the
 * rest uses the platform sans. Color always comes from the theme.
 */
export function ThemedText({ style, type = 'body', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color = theme[themeColor ?? (type === 'link' ? 'link' : 'text')];

  return (
    <Text
      maxFontSizeMultiplier={1.5}
      style={[{ color }, styles[type], style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: Fonts.serif,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: 400,
    letterSpacing: -0.3,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: 400,
    letterSpacing: -0.2,
  },
  heading: {
    fontFamily: Fonts.sans,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 600,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: 600,
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
  },
  bodyMedium: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  small: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 400,
  },
  smallMedium: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  caption: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
    letterSpacing: 0.2,
  },
  overline: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: 600,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  link: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 500,
  },
  code: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 500,
  },
});
