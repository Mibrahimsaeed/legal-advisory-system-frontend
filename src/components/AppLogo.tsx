import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

type AppLogoProps = {
  size?: number;
};

export default function AppLogo({ size = 96 }: AppLogoProps) {
  const theme = useTheme();
  const iconSize = size * 0.6;
  const stroke = theme.brandAccent;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <Line x1="12" y1="2.5" x2="12" y2="19.5" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        <Circle cx="12" cy="2.2" r="0.9" fill={stroke} />
        <Line x1="5" y1="5" x2="19" y2="5" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        <Line x1="8" y1="20" x2="16" y2="20" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />

        <Line x1="5" y1="5" x2="2.3" y2="10.5" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        <Line x1="5" y1="5" x2="7.7" y2="10.5" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        <Path d="M2.3 10.5 a2.7 2.7 0 0 0 5.4 0" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />

        <Line x1="19" y1="5" x2="16.3" y2="10.5" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        <Line x1="19" y1="5" x2="21.7" y2="10.5" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        <Path d="M16.3 10.5 a2.7 2.7 0 0 0 5.4 0" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
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
