import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppLogo from '@/components/app-logo';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { CourtColumnsBackground } from '@/components/ui/court-columns';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { TextField } from '@/components/ui/text-field';
import { Durations, Easings } from '@/constants/motion';
import { Radius, Spacing } from '@/constants/theme';
import { useMockSubmit } from '@/hooks/use-mock-submit';
import { useTheme } from '@/hooks/use-theme';
import { useThemeContext } from '@/providers/theme-provider';
import { haptics } from '@/utils/haptics';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { scheme } = useThemeContext();
  const { loading, run } = useMockSubmit();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

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
    run(() => router.replace('/(tabs)/chat'));
  };

  const goToSignIn = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      {/* Court Columns Background Image */}
      <CourtColumnsBackground />

      <SafeAreaView style={styles.transparentContainer} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.transparentContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Navigation Bar with Back Button */}
            <View style={styles.topBar}>
              <PressableScale
                onPress={goToSignIn}
                haptic="selection"
                hitSlop={8}
                accessibilityLabel="Go back"
                style={[
                  styles.backButton,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Icon name="back" size={18} color={theme.text} />
              </PressableScale>
            </View>

            {/* Top Hero Section */}
            <View style={styles.heroSection}>
              <AppLogo size={80} showText />

              {/* Accent Line under logo text */}
              <View style={[styles.accentLine, { backgroundColor: theme.gold }]} />

              <ThemedText style={[styles.welcomeTitle, { color: theme.text }]}>
                Create your account
              </ThemedText>
              <ThemedText style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                A few details and you're in
              </ThemedText>
            </View>

            {/* Main Form Card */}
            <Animated.View
              entering={FadeInUp.delay(120).duration(Durations.slow).easing(Easings.enter)}
              style={[
                styles.formCard,
                {
                  backgroundColor: scheme === 'dark' ? 'rgba(22, 27, 34, 0.65)' : 'rgba(255, 255, 255, 0.82)',
                  borderColor: theme.border,
                  backdropFilter: 'blur(16px)',
                } as any,
              ]}
            >
              {/* Full Name Input */}
              <View style={styles.fieldGroup}>
                <ThemedText style={[styles.fieldLabel, { color: theme.text }]}>
                  Full name
                </ThemedText>
                <TextField
                  icon="profile"
                  placeholder="Jordan Smith"
                  autoComplete="name"
                  returnKeyType="next"
                  value={name}
                  error={errors.name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>

              {/* Email Input */}
              <View style={styles.fieldGroup}>
                <ThemedText style={[styles.fieldLabel, { color: theme.text }]}>
                  Email
                </ThemedText>
                <TextField
                  ref={emailRef}
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
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              {/* Password Input */}
              <View style={styles.fieldGroup}>
                <ThemedText style={[styles.fieldLabel, { color: theme.text }]}>
                  Password
                </ThemedText>
                <TextField
                  ref={passwordRef}
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
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onSubmitEditing={handleCreate}
                />
              </View>

              {/* Primary Action Button */}
              <Button
                title="Create account"
                onPress={handleCreate}
                loading={loading}
                fullWidth
                style={styles.submitButton}
              />

              {/* Terms Disclaimer */}
              <ThemedText style={[styles.termsText, { color: theme.textSecondary }]}>
                By continuing you agree that answers are general information, not legal advice.
              </ThemedText>

              {/* Sign In Prompt */}
              <View style={styles.accountPromptRow}>
                <ThemedText style={[styles.accountPromptText, { color: theme.textSecondary }]}>
                  Already have an account?{' '}
                </ThemedText>
                <PressableScale onPress={goToSignIn} haptic="selection">
                  <ThemedText style={[styles.accountPromptText, styles.signInLink, { color: theme.gold }]}>
                    Sign in
                  </ThemedText>
                </PressableScale>
              </View>
            </Animated.View>

            {/* Footer Guarantee Section */}
            <View style={styles.privacyFooter}>
              <Icon name="shield" size={20} color={theme.gold} />
              <ThemedText style={[styles.privacyTitle, { color: theme.gold }]}>
                Your privacy. Our priority.
              </ThemedText>
              <ThemedText style={[styles.privacySubtitle, { color: theme.textSecondary }]}>
                All conversations are secure and confidential.
              </ThemedText>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  transparentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  topBar: {
    height: 44,
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  accentLine: {
    height: 2,
    width: 24,
    borderRadius: 1,
    marginTop: 8,
    marginBottom: Spacing.md,
  },
  welcomeTitle: {
    fontFamily: 'Georgia',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 13.5,
    textAlign: 'center',
  },
  formCard: {
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.md + 4,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.sm + 4,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 4,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  accountPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  accountPromptText: {
    fontSize: 13.5,
  },
  signInLink: {
    fontWeight: '600',
  },
  privacyFooter: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    gap: 4,
  },
  privacyTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    marginTop: 4,
  },
  privacySubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});
