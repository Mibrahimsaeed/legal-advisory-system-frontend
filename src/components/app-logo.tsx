import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { Brand } from '@/constants/theme';

type AppLogoProps = {
  size?: number;
  /** Stroke color; defaults to brand ink. */
  color?: string;
  /** Draw the surrounding ring. */
  ring?: boolean;
};

/**
 * The scales-of-justice mark, drawn as strokes so it stays crisp at any
 * size and can be tinted per surface.
 */
export default function AppLogo({ size = 96, color = Brand.ink, ring = false }: AppLogoProps) {
  const iconSize = size * (ring ? 0.52 : 0.62);
  const strokeWidth = 1.5;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        ring && { borderWidth: 1, borderColor: `${Brand.ink}22`, backgroundColor: `${Brand.ink}0A` },
      ]}
    >
      <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        {/* Center post and finial */}
        <Line x1="12" y1="2.5" x2="12" y2="19.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Circle cx="12" cy="2.2" r="0.9" fill={color} />
        {/* Crossbar and base */}
        <Line x1="5" y1="5" x2="19" y2="5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Line x1="8" y1="20" x2="16" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Left pan */}
        <Line x1="5" y1="5" x2="2.3" y2="10.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Line x1="5" y1="5" x2="7.7" y2="10.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path
          d="M2.3 10.5 a2.7 2.7 0 0 0 5.4 0"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right pan */}
        <Line x1="19" y1="5" x2="16.3" y2="10.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Line x1="19" y1="5" x2="21.7" y2="10.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path
          d="M16.3 10.5 a2.7 2.7 0 0 0 5.4 0"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
