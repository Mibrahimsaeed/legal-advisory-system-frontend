import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { TAB_BAR_CONTENT_HEIGHT } from '@/components/navigation/tab-bar';
import { SegmentedControl, type SegmentOption } from '@/components/profile/segmented-control';
import { SettingRow } from '@/components/profile/setting-row';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemedStatusBar } from '@/components/ui/themed-status-bar';
import { Durations, Easings, staggerDelay } from '@/constants/motion';
import { Layout, Radius, Spacing } from '@/constants/theme';
import { getInitials, MockUser } from '@/data/user';
import { useTheme } from '@/hooks/use-theme';
import { useConversations } from '@/providers/conversations-provider';
import { useThemeContext, type ThemePreference } from '@/providers/theme-provider';
import { haptics, isHapticsEnabled, setHapticsEnabled } from '@/utils/haptics';

const APPEARANCE_OPTIONS: SegmentOption<ThemePreference>[] = [
  { value: 'system', label: 'Auto', icon: 'themeAuto' },
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
];

function Section({
  label,
  index,
  children,
}: {
  label: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(staggerDelay(index, 80)).duration(Durations.gentle).easing(Easings.enter)}
      style={styles.section}
    >
      <ThemedText type="overline" themeColor="textMuted" style={styles.sectionLabel}>
        {label}
      </ThemedText>
      <Card style={styles.sectionCard}>{children}</Card>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { preference, setPreference } = useThemeContext();
  const { conversations, clearAll } = useConversations();

  const [notifications, setNotifications] = useState(true);
  const [hapticsOn, setHapticsOn] = useState(isHapticsEnabled());

  const toggleHaptics = (value: boolean) => {
    setHapticsOn(value);
    setHapticsEnabled(value);
    if (value) haptics.selection();
  };

  const confirmClear = () => {
    Alert.alert(
      'Clear conversation history?',
      `This removes ${conversations.length === 1 ? 'your saved conversation' : `all ${conversations.length} conversations`} from this device.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearAll();
            haptics.success();
          },
        },
      ],
    );
  };

  const switchColors = {
    trackColor: { false: theme.borderStrong, true: theme.accentStrong },
    thumbColor: '#FFFFFF',
    ios_backgroundColor: theme.borderStrong,
  };

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <ThemedStatusBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + TAB_BAR_CONTENT_HEIGHT + Spacing.xxl },
        ]}
      >
        {/* Identity */}
        <Animated.View
          entering={FadeInDown.duration(Durations.gentle).easing(Easings.enter)}
          style={styles.identity}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.accentSoft, borderColor: theme.accentStrong },
            ]}
          >
            <ThemedText type="heading" themeColor="accentText">
              {getInitials(MockUser.name)}
            </ThemedText>
          </View>
          <ThemedText type="heading" style={styles.name}>
            {MockUser.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textMuted">
            {MockUser.email}
          </ThemedText>
        </Animated.View>

        {/* Appearance */}
        <Section label="Appearance" index={1}>
          <SegmentedControl options={APPEARANCE_OPTIONS} value={preference} onChange={setPreference} />
          <ThemedText type="caption" themeColor="textMuted" style={styles.appearanceHint}>
            Auto follows your device setting.
          </ThemedText>
        </Section>

        {/* Preferences */}
        <Section label="Preferences" index={2}>
          <SettingRow
            icon="bell"
            label="Notifications"
            description="Answer updates and reminders"
            right={<Switch value={notifications} onValueChange={setNotifications} {...switchColors} />}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="sparkles"
            label="Haptic feedback"
            description="Subtle taps on interactions"
            right={<Switch value={hapticsOn} onValueChange={toggleHaptics} {...switchColors} />}
          />
        </Section>

        {/* Data */}
        <Section label="Data" index={3}>
          <SettingRow
            icon="trash"
            label="Clear conversation history"
            description={
              conversations.length > 0
                ? `${conversations.length} ${conversations.length === 1 ? 'conversation' : 'conversations'} on this device`
                : 'Nothing saved right now'
            }
            onPress={conversations.length > 0 ? confirmClear : undefined}
            danger
          />
        </Section>

        {/* About */}
        <Section label="About" index={4}>
          <SettingRow icon="info" label="Version" right={
            <ThemedText type="small" themeColor="textMuted">
              {appVersion}
            </ThemedText>
          } />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="shield"
            label="Our promise"
            description="Answers are general information, not legal advice. For decisions with real consequences, consult a licensed lawyer."
          />
        </Section>

        {/* Sign out */}
        <Animated.View
          entering={FadeInDown.delay(staggerDelay(5, 80)).duration(Durations.gentle).easing(Easings.enter)}
        >
          <Button
            title="Sign out"
            variant="secondary"
            icon="signOut"
            onPress={() => router.replace('/login')}
            fullWidth
            style={styles.signOut}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.xl,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
  },
  identity: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    marginBottom: 2,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionLabel: {
    marginBottom: Spacing.sm + 2,
  },
  sectionCard: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  appearanceHint: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 38 + Spacing.md,
  },
  signOut: {
    marginTop: Spacing.xxl,
  },
});
