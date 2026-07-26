import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
import { Layout, Radius, Spacing } from '@/constants/theme';
import { useMockSubmit } from '@/hooks/use-mock-submit';
import { useTheme } from '@/hooks/use-theme';
import { useThemeContext } from '@/providers/theme-provider';
import { haptics } from '@/utils/haptics';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { scheme } = useThemeContext();
  const { loading, run } = useMockSubmit();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const passwordRef = useRef<any>(null);

  const handleSignIn = () => {
    const nextErrors: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address';
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      haptics.warning();
      return;
    }
    run(() => router.replace('/(tabs)/chat'));
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
            {/* Top Hero Section */}
            <View style={styles.heroSection}>
              <AppLogo size={80} showText />

              {/* Accent Line under logo text */}
              <View style={[styles.accentLine, { backgroundColor: theme.gold }]} />

              <ThemedText style={[styles.welcomeTitle, { color: theme.text }]}>
                Welcome back
              </ThemedText>
              <ThemedText style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                Sign in to continue your legal questions
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
              {/* Email Input */}
              <View style={styles.fieldGroup}>
                <ThemedText style={[styles.fieldLabel, { color: theme.text }]}>
                  Email
                </ThemedText>
                <TextField
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
                  placeholder="Your password"
                  secureTextEntry
                  autoComplete="password"
                  returnKeyType="done"
                  value={password}
                  error={errors.password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onSubmitEditing={handleSignIn}
                />
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setRememberMe((prev) => !prev)}
                  style={styles.rememberRow}
                >
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: theme.border },
                      rememberMe && { backgroundColor: theme.gold, borderColor: theme.gold },
                    ]}
                  >
                    {rememberMe && <Icon name="check" size={11} color={theme.onPrimary} />}
                  </View>
                  <ThemedText style={[styles.optionText, { color: theme.textSecondary }]}>
                    Remember me
                  </ThemedText>
                </TouchableOpacity>

                <PressableScale onPress={() => {}} haptic="light">
                  <ThemedText style={[styles.optionText, styles.forgotText, { color: theme.gold }]}>
                    Forgot password?
                  </ThemedText>
                </PressableScale>
              </View>

              {/* Primary Action Button */}
              <Button
                title="Sign in"
                onPress={handleSignIn}
                loading={loading}
                fullWidth
                style={styles.signInButton}
              />

              {/* Or Divider */}
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                <ThemedText style={[styles.dividerText, { color: theme.textSecondary }]}>
                  or
                </ThemedText>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              </View>

              {/* Secondary Action Button: Continue as guest */}
              <Button
                title="Continue as guest"
                variant="secondary"
                icon="profile"
                onPress={() => router.replace('/(tabs)/chat')}
                fullWidth
              />

              {/* Create Account Prompt */}
              <View style={styles.accountPromptRow}>
                <ThemedText style={[styles.accountPromptText, { color: theme.textSecondary }]}>
                  Don't have an account?{' '}
                </ThemedText>
                <PressableScale onPress={() => router.push('/signup')} haptic="selection">
                  <ThemedText style={[styles.accountPromptText, styles.signUpLink, { color: theme.gold }]}>
                    Sign up
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
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -2,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 13,
  },
  forgotText: {
    fontWeight: '600',
  },
  signInButton: {
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
  },
  accountPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  accountPromptText: {
    fontSize: 13.5,
  },
  signUpLink: {
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
