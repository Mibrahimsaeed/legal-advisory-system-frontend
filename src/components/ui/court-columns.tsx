import { Image, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';
import { useThemeContext } from '@/providers/theme-provider';

type CourtColumnsBackgroundProps = {
  style?: ViewStyle;
  opacity?: number;
};

/**
 * Architectural court pillars background image (assets/images/court_pillars.png)
 * displaying the dark Corinthian pillars on steps at top-right.
 */
export function CourtColumnsBackground({ style, opacity }: CourtColumnsBackgroundProps) {
  const theme = useTheme();
  const { scheme } = useThemeContext();

  const isDark = scheme === 'dark';
  const imgOpacity = opacity ?? (isDark ? 0.9 : 0.4);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }, style]} pointerEvents="none">
      {/* Court Pillars Image */}
      <Image
        source={require('../../../assets/images/court_pillars.png')}
        style={[
          styles.image,
          { opacity: imgOpacity },
          !isDark && (styles.lightBlend as any),
        ]}
        resizeMode="cover"
      />

      {/* Subtle Linear Gradient Overlay Fading Left & Bottom */}
      <Svg width="100%" height="100%" style={styles.overlay}>
        <Defs>
          {/* Vertical fade to background */}
          <LinearGradient id="courtOverlayVertical" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.background} stopOpacity={0} />
            <Stop offset="50%" stopColor={theme.background} stopOpacity={isDark ? 0.2 : 0.2} />
            <Stop offset="85%" stopColor={theme.background} stopOpacity={isDark ? 0.85 : 0.8} />
            <Stop offset="100%" stopColor={theme.background} stopOpacity={1} />
          </LinearGradient>

          {/* Horizontal fade from left to right */}
          <LinearGradient id="courtOverlayHorizontal" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={theme.background} stopOpacity={isDark ? 0.85 : 0.75} />
            <Stop offset="45%" stopColor={theme.background} stopOpacity={isDark ? 0.4 : 0.3} />
            <Stop offset="100%" stopColor={theme.background} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="url(#courtOverlayHorizontal)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#courtOverlayVertical)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  lightBlend: {
    mixBlendMode: 'multiply',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
