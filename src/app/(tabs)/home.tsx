import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ConversationRow } from '@/components/conversation-row';
import { TopicCard } from '@/components/home/topic-card';
import { TAB_BAR_CONTENT_HEIGHT } from '@/components/navigation/tab-bar';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ThemedStatusBar } from '@/components/ui/themed-status-bar';
import { Durations, Easings, staggerDelay } from '@/constants/motion';
import { Brand, IconSize, Layout, Radius, Shadows, Spacing } from '@/constants/theme';
import { LegalTopics } from '@/data/legal-topics';
import { getInitials, MockUser } from '@/data/user';
import { useTheme } from '@/hooks/use-theme';
import { useConversations } from '@/providers/conversations-provider';
import { getGreeting } from '@/utils/format-time';

const RECENT_LIMIT = 3;

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { conversations } = useConversations();
  const recent = conversations.slice(0, RECENT_LIMIT);
  const firstName = MockUser.name.split(' ')[0];

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
        {/* Greeting */}
        <Animated.View
          entering={FadeInDown.delay(staggerDelay(0)).duration(Durations.gentle).easing(Easings.enter)}
          style={styles.headerRow}
        >
          <View style={styles.greetingBlock}>
            <ThemedText type="small" themeColor="textSecondary">
              {getGreeting()}, {firstName}
            </ThemedText>
            <ThemedText type="title" style={styles.headline}>
              How can we help?
            </ThemedText>
          </View>

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
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: 'new' } })}
            haptic="light"
            scaleTo={0.98}
            accessibilityLabel="Ask a legal question"
            style={[styles.askCard, Shadows.raised]}
          >
            <View style={styles.askIconCircle}>
              <Icon name="sparkles" size={IconSize.lg} color={Brand.white} />
            </View>
            <View style={styles.askTextBlock}>
              <ThemedText type="subtitle" style={styles.askTitle}>
                Ask a legal question
              </ThemedText>
              <ThemedText type="small" style={styles.askSubtitle}>
                Plain-language answers, in seconds
              </ThemedText>
            </View>
            <View style={styles.askArrowCircle}>
              <Icon name="forward" size={IconSize.md} color={Brand.ink} />
            </View>
          </PressableScale>
        </Animated.View>

        {/* Topics */}
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
          {conversations.length > RECENT_LIMIT ? (
            <PressableScale
              onPress={() => router.push('/history')}
              haptic="selection"
              hitSlop={10}
              accessibilityLabel="See all conversations"
            >
              <ThemedText type="caption" themeColor="link">
                See all
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
  },
  greetingBlock: {
    flex: 1,
    gap: Spacing.xs,
  },
  headline: {
    fontSize: 27,
    lineHeight: 33,
  },
  avatar: {
    width: 44,
    height: 44,
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
    backgroundColor: Brand.ink,
  },
  askIconCircle: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askTextBlock: {
    flex: 1,
    gap: 2,
  },
  askTitle: {
    color: Brand.white,
  },
  askSubtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
  },
  askArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Brand.white,
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
