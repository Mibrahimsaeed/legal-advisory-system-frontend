import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { AuthHero } from '@/components/auth/auth-hero';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { TextField } from '@/components/ui/text-field';
import { Durations, Easings } from '@/constants/motion';
import { Brand, Layout, Radius, Spacing } from '@/constants/theme';
import { useMockSubmit } from '@/hooks/use-mock-submit';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/utils/haptics';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { loading, run } = useMockSubmit();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const passwordRef = useRef<TextInput>(null);

  const handleSignIn = () => {
    const nextErrors: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address';
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      haptics.warning();
      return;
    }
    run(() => router.replace('/home'));
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.screen} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <AuthHero title="Welcome back" subtitle="Sign in to continue your legal questions" />

          <Animated.View
            entering={FadeInUp.delay(160).duration(Durations.slow).easing(Easings.enter)}
            style={[styles.sheet, { backgroundColor: theme.background }]}
          >
            <ScrollView
              contentContainerStyle={styles.sheetContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <TextField
                label="Email"
                icon="mail"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                returnKeyType="next"
                value={email}
                error={errors.email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
                }}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <TextField
                ref={passwordRef}
                label="Password"
                icon="lock"
                placeholder="Your password"
                secureTextEntry
                autoComplete="password"
                returnKeyType="done"
                value={password}
                error={errors.password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
                }}
                onSubmitEditing={handleSignIn}
                containerStyle={styles.passwordField}
              />

              <Button
                title="Sign in"
                onPress={handleSignIn}
                loading={loading}
                fullWidth
                style={styles.submit}
              />

              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                <ThemedText type="caption" themeColor="textMuted">
                  or
                </ThemedText>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              </View>

              <Button
                title="Continue as guest"
                variant="secondary"
                onPress={() => router.replace('/home')}
                fullWidth
              />

              <View style={styles.footerRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  New here?
                </ThemedText>
                <PressableScale
                  onPress={() => router.push('/signup')}
                  haptic="selection"
                  hitSlop={10}
                  accessibilityLabel="Create an account"
                >
                  <ThemedText type="link">Create an account</ThemedText>
                </PressableScale>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.navy,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: Radius.xl + 4,
    borderTopRightRadius: Radius.xl + 4,
  },
  sheetContent: {
    padding: Layout.screenPadding + 4,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  passwordField: {
    marginTop: Spacing.lg,
  },
  submit: {
    marginTop: Spacing.xl,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.lg + 4,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs + 2,
    marginTop: Spacing.xl + 4,
  },
});
