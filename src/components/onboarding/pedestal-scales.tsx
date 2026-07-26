import { Image, StyleSheet, View } from 'react-native';

/**
 * Onboarding Slide 3 visual using assets/images/logo.png.
 */
export function PedestalScalesVisual() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  logoImage: {
    width: 220,
    height: 220,
  },
});
