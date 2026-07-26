import { Image, StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type AppLogoProps = {
  size?: number;
  showText?: boolean;
  ring?: boolean;
  style?: ViewStyle;
};

/**
 * LexAura logo using assets/images/logo.png.
 */
export default function AppLogo({
  size = 100,
  showText = true,
  style,
}: AppLogoProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      {showText && (
        <View style={styles.textContainer}>
          <ThemedText style={[styles.brandTitle, { color: theme.text }]}>
            LexAura
          </ThemedText>
          <ThemedText style={[styles.brandSubtitle, { color: theme.gold }]}>
            LEGAL ADVISOR
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  brandTitle: {
    fontFamily: 'Georgia',
    fontSize: 34,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3.5,
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
