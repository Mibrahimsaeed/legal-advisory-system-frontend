import { useRouter } from 'expo-router';
import { Modal, StyleSheet, View } from 'react-native';

import AppLogo from '@/components/app-logo';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useConversations } from '@/providers/conversations-provider';

export function LoginPromptModal() {
  const router = useRouter();
  const theme = useTheme();
  const { loginModalVisible, setLoginModalVisible, totalUserMessages, setIsLoggedIn } = useConversations();

  if (!loginModalVisible) return null;

  const handleSignIn = () => {
    setLoginModalVisible(false);
    setIsLoggedIn(true);
    router.push('/login');
  };

  const handleSignUp = () => {
    setLoginModalVisible(false);
    setIsLoggedIn(true);
    router.push('/signup');
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={loginModalVisible}
      onRequestClose={() => setLoginModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Close button */}
          <PressableScale
            onPress={() => setLoginModalVisible(false)}
            hitSlop={10}
            style={[styles.closeButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <Icon name="close" size={16} color={theme.text} />
          </PressableScale>

          {/* Logo & Header */}
          <View style={styles.header}>
            <AppLogo size={64} showText={false} />
            <ThemedText style={[styles.title, { color: theme.text }]}>
              Sign in to save your history
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              You've sent {totalUserMessages} legal questions! Log in or create a free account to save your conversations across devices.
            </ThemedText>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button title="Sign in" onPress={handleSignIn} fullWidth />
            <Button
              title="Create free account"
              variant="secondary"
              onPress={handleSignUp}
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 19,
  },
  actions: {
    width: '100%',
    gap: Spacing.md,
  },
});
