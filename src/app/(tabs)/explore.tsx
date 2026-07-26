import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConversationRow } from '@/components/conversation-row';
import { TopicCard } from '@/components/home/topic-card';
import { LoginPromptModal } from '@/components/modals/login-prompt-modal';
import { PaywallModal } from '@/components/modals/paywall-modal';
import { SidebarDrawer } from '@/components/navigation/sidebar-drawer';
import { TAB_BAR_CONTENT_HEIGHT } from '@/components/navigation/tab-bar';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ThemedStatusBar } from '@/components/ui/themed-status-bar';
import { Durations, Easings, staggerDelay } from '@/constants/motion';
import { IconSize, Layout, Radius, Shadows, Spacing } from '@/constants/theme';
import { LegalTopics } from '@/data/legal-topics';
import { getInitials, MockUser } from '@/data/user';
import { useTheme } from '@/hooks/use-theme';
import { useConversations } from '@/providers/conversations-provider';
import { getGreeting } from '@/utils/format-time';

const RECENT_LIMIT = 3;

export default function ExploreScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { conversations, totalUserMessages, isPro, setPaywallModalVisible } = useConversations();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const recent = conversations.slice(0, RECENT_LIMIT);
  const firstName = MockUser.name.split(' ')[0];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <ThemedStatusBar />

      {/* Drawer & Global Modals */}
      <SidebarDrawer visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <LoginPromptModal />
      <PaywallModal />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + TAB_BAR_CONTENT_HEIGHT + Spacing.xxl },
        ]}
      >
        {/* Top App Header with Sidebar Button & Profile */}
        <Animated.View
          entering={FadeInDown.delay(staggerDelay(0)).duration(Durations.gentle).easing(Easings.enter)}
          style={styles.headerRow}
        >
          {/* Menu Drawer Button */}
          <PressableScale
            onPress={() => setSidebarOpen(true)}
            haptic="selection"
            accessibilityLabel="Open history drawer"
            style={[styles.menuButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <Icon name="history" size={20} color={theme.text} />
          </PressableScale>

          <View style={styles.greetingBlock}>
            <ThemedText type="small" themeColor="textSecondary">
              {getGreeting()}, {firstName}
            </ThemedText>
            <ThemedText type="title" style={styles.headline}>
              Explore Legal Topics
            </ThemedText>
          </View>

          {/* Usage Badge or Profile */}
          {!isPro ? (
            <PressableScale
              onPress={() => setPaywallModalVisible(true)}
              haptic="selection"
              style={[styles.usageBadge, { backgroundColor: theme.accentSoft, borderColor: theme.gold }]}
            >
              <ThemedText style={[styles.usageBadgeText, { color: theme.gold }]}>
                {totalUserMessages}/20
              </ThemedText>
            </PressableScale>
          ) : (
            <PressableScale
              onPress={() => router.push('/profile')}
              haptic="selection"
              accessibilityLabel="Open profile"
              style={[styles.avatar, { backgroundColor: theme.accentSoft, borderColor: theme.accentStrong }]}
            >
              <ThemedText type="smallMedium" themeColor="accentText">
                {getInitials(MockUser.name)}
              </ThemedText>
            </PressableScale>
          )}
        </Animated.View>

        {/* Search */}
        <Animated.View
          entering={FadeInDown.delay(staggerDelay(1)).duration(Durations.gentle).easing(Easings.enter)}
        >
          <PressableScale
            onPress={() => router.push('/search')}
            haptic="selection"
            accessibilityLabel="Search legal topics and conversations"
            style={[
              styles.searchBar,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Icon name="search" size={IconSize.md} color={theme.iconMuted} />
            <ThemedText type="small" themeColor="textMuted">
              Search topics or your questions…
            </ThemedText>
          </PressableScale>
        </Animated.View>

        {/* Ask CTA */}
        <Animated.View
          entering={FadeInDown.delay(staggerDelay(2)).duration(Durations.gentle).easing(Easings.enter)}
        >
          <PressableScale
            onPress={() => router.push('/(tabs)/chat')}
            haptic="light"
            scaleTo={0.98}
            accessibilityLabel="Ask a legal question"
            style={[styles.askCard, Shadows.raised, { backgroundColor: theme.gold }]}
          >
            <View style={styles.askIconCircle}>
              <Icon name="sparkles" size={IconSize.lg} color={theme.onPrimary} />
            </View>
            <View style={styles.askTextBlock}>
              <ThemedText type="subtitle" style={{ color: theme.onPrimary }}>
                Ask a legal question
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.onPrimary, opacity: 0.85 }}>
                Plain-language answers, in seconds
              </ThemedText>
            </View>
            <View style={[styles.askArrowCircle, { backgroundColor: theme.onPrimary }]}>
              <Icon name="forward" size={IconSize.md} color={theme.gold} />
            </View>
          </PressableScale>
        </Animated.View>

        {/* Topics Grid */}
        <View style={styles.sectionHeader}>
          <ThemedText type="overline" themeColor="textMuted">
            Browse topics
          </ThemedText>
        </View>
        <View style={styles.topicsGrid}>
          {LegalTopics.map((topic, index) => (
            <TopicCard key={topic.id} topic={topic} enterDelay={staggerDelay(index, 240, 50)} />
          ))}
        </View>

        {/* Recent conversations */}
        <View style={[styles.sectionHeader, styles.sectionHeaderRow]}>
          <ThemedText type="overline" themeColor="textMuted">
            Recent conversations
          </ThemedText>
          {conversations.length > 0 ? (
            <PressableScale
              onPress={() => setSidebarOpen(true)}
              haptic="selection"
              hitSlop={10}
              accessibilityLabel="See all conversations in sidebar"
            >
              <ThemedText type="caption" themeColor="link">
                Sidebar history →
              </ThemedText>
            </PressableScale>
          ) : null}
        </View>

        {recent.length > 0 ? (
          <View style={styles.recentList}>
            {recent.map((conversation, index) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                enterDelay={staggerDelay(index, 420, 60)}
              />
            ))}
          </View>
        ) : (
          <Animated.View
            entering={FadeInDown.delay(420).duration(Durations.gentle).easing(Easings.enter)}
            style={[styles.emptyRecent, { borderColor: theme.border }]}
          >
            <Icon name="chat" size={IconSize.lg} color={theme.iconMuted} />
            <ThemedText type="small" themeColor="textMuted" style={styles.emptyRecentText}>
              Your conversations will appear here
            </ThemedText>
          </Animated.View>
        )}

        {/* Disclaimer */}
        <ThemedText type="caption" themeColor="textMuted" style={styles.disclaimer}>
          Legal Advisor AI provides general information, not legal advice.
        </ThemedText>
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
    paddingTop: Spacing.md,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingBlock: {
    flex: 1,
    gap: Spacing.xs,
    marginLeft: 4,
  },
  headline: {
    fontSize: 25,
    lineHeight: 31,
  },
  usageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  usageBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
    height: 48,
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg + 2,
  },
  askCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg - 2,
    marginTop: Spacing.lg,
    borderRadius: Radius.xl - 4,
    padding: Spacing.lg + 2,
  },
  askIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askTextBlock: {
    flex: 1,
    gap: 2,
  },
  askArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  recentList: {
    gap: Spacing.md - 2,
  },
  emptyRecent: {
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
  },
  emptyRecentText: {
    textAlign: 'center',
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
