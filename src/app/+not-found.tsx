import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui/empty-state';
import { ThemedStatusBar } from '@/components/ui/themed-status-bar';
import { useTheme } from '@/hooks/use-theme';

/** Branded unmatched-route screen. */
export default function NotFoundScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <ThemedStatusBar />
      <EmptyState
        icon="search"
        title="Page not found"
        message="The screen you're looking for doesn't exist or has moved."
        action={{
          label: 'Go to Home',
          onPress: () => router.replace('/home'),
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
});
