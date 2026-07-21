import { View, type ViewStyle } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { Brand } from '@/constants/theme';

type ScalesEmblemProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: ViewStyle;
};

/**
 * Minimal scales-of-justice emblem — a single clean line icon used as a
 * faint brand watermark on navy surfaces (splash, onboarding).
 */
export default function ScalesEmblem({
  size = 200,
  color = Brand.ink,
  strokeWidth = 2,
  style,
}: ScalesEmblemProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Finial */}
        <Circle cx={50} cy={9} r={3.5} stroke={color} strokeWidth={strokeWidth} />
        {/* Post */}
        <Line x1={50} y1={12.5} x2={50} y2={80} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Beam */}
        <Line x1={20} y1={24} x2={80} y2={24} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Beam-to-post joint */}
        <Circle cx={50} cy={24} r={2.5} fill={color} />
        {/* Left chains + pan */}
        <Line x1={20} y1={24} x2={12} y2={48} stroke={color} strokeWidth={strokeWidth * 0.7} />
        <Line x1={20} y1={24} x2={28} y2={48} stroke={color} strokeWidth={strokeWidth * 0.7} />
        <Path d="M 9 48 Q 20 61 31 48" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Right chains + pan */}
        <Line x1={80} y1={24} x2={72} y2={48} stroke={color} strokeWidth={strokeWidth * 0.7} />
        <Line x1={80} y1={24} x2={88} y2={48} stroke={color} strokeWidth={strokeWidth * 0.7} />
        <Path d="M 69 48 Q 80 61 91 48" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Base */}
        <Line x1={32} y1={80} x2={68} y2={80} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </Svg>
    </View>
  );
}
