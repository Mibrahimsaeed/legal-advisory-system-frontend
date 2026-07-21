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
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { loading, run } = useMockSubmit();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleCreate = () => {
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) nextErrors.name = 'Enter your full name';
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address';
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      haptics.warning();
      return;
    }
    run(() => router.replace('/home'));
  };

  const goToSignIn = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.screen} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <AuthHero title="Create your account" subtitle="A few details and you're in" showBack />

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
                label="Full name"
                icon="profile"
                placeholder="Jordan Smith"
                autoComplete="name"
                returnKeyType="next"
                value={name}
                error={errors.name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
                }}
                onSubmitEditing={() => emailRef.current?.focus()}
              />

              <TextField
                ref={emailRef}
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
                containerStyle={styles.field}
              />

              <TextField
                ref={passwordRef}
                label="Password"
                icon="lock"
                placeholder="At least 6 characters"
                secureTextEntry
                autoComplete="new-password"
                returnKeyType="done"
                value={password}
                error={errors.password}
                helper="Use at least 6 characters"
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
                }}
                onSubmitEditing={handleCreate}
                containerStyle={styles.field}
              />

              <Button
                title="Create account"
                onPress={handleCreate}
                loading={loading}
                fullWidth
                style={styles.submit}
              />

              <ThemedText type="caption" themeColor="textMuted" style={styles.terms}>
                By continuing you agree that answers are general information, not legal advice.
              </ThemedText>

              <View style={styles.footerRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Already have an account?
                </ThemedText>
                <PressableScale
                  onPress={goToSignIn}
                  haptic="selection"
                  hitSlop={10}
                  accessibilityLabel="Sign in"
                >
                  <ThemedText type="link">Sign in</ThemedText>
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
    backgroundColor: Brand.ivory,
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
  field: {
    marginTop: Spacing.lg,
  },
  submit: {
    marginTop: Spacing.xl,
  },
  terms: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs + 2,
    marginTop: Spacing.xl,
  },
});
