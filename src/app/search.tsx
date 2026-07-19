import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ConversationRow } from '@/components/conversation-row';
import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { TextField } from '@/components/ui/text-field';
import { ThemedStatusBar } from '@/components/ui/themed-status-bar';
import { Durations, Easings, staggerDelay } from '@/constants/motion';
import { IconSize, Layout, Radius, Spacing } from '@/constants/theme';
import { LegalTopics } from '@/data/legal-topics';
import { useTheme } from '@/hooks/use-theme';
import { useConversations } from '@/providers/conversations-provider';

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { conversations, startConversation } = useConversations();
  const [query, setQuery] = useState('');
  const trimmed = query.trim();
  const needle = trimmed.toLowerCase();

  const matchingTopics = useMemo(
    () =>
      needle
        ? LegalTopics.filter(
            (topic) =>
              topic.title.toLowerCase().includes(needle) ||
              topic.blurb.toLowerCase().includes(needle),
          )
        : LegalTopics,
    [needle],
  );

  const matchingConversations = useMemo(
    () =>
      needle
        ? conversations.filter(
            (conversation) =>
              conversation.title.toLowerCase().includes(needle) ||
              conversation.messages.some((message) =>
                message.text.toLowerCase().includes(needle),
              ),
          )
        : conversations.slice(0, 3),
    [conversations, needle],
  );

  const nothingFound = needle.length > 0 && matchingTopics.length === 0 && matchingConversations.length === 0;

  const askAI = () => {
    const id = startConversation(trimmed);
    router.replace({ pathname: '/chat/[id]', params: { id } });
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <ThemedStatusBar />

      {/* Search header */}
      <Animated.View
        entering={FadeInDown.duration(Durations.gentle).easing(Easings.enter)}
        style={styles.header}
      >
        <PressableScale
          onPress={() => router.back()}
          haptic="selection"
          hitSlop={8}
          accessibilityLabel="Close search"
          style={[styles.closeButton, { backgroundColor: theme.surfaceMuted }]}
        >
          <Icon name="close" size={IconSize.md} color={theme.icon} />
        </PressableScale>

        <TextField
          icon="search"
          placeholder="Search topics or questions…"
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          containerStyle={styles.searchField}
          right={
            query.length > 0 ? (
              <PressableScale onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
                <Icon name="close" size={IconSize.sm} color={theme.iconMuted} />
              </PressableScale>
            ) : null
          }
        />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {nothingFound ? (
          <EmptyState
            icon="search"
            title="No results"
            message={`Nothing matches “${trimmed}” yet — but the assistant can take it from here.`}
            action={{ label: 'Ask the AI instead', onPress: askAI }}
            style={styles.empty}
          />
        ) : (
          <>
            {matchingTopics.length > 0 ? (
              <>
                <ThemedText type="overline" themeColor="textMuted" style={styles.sectionLabel}>
                  Topics
                </ThemedText>
                <View style={styles.topicWrap}>
                  {matchingTopics.map((topic, index) => (
                    <Animated.View
                      key={topic.id}
                      entering={FadeInDown.delay(staggerDelay(index, 60, 40))
                        .duration(Durations.gentle)
                        .easing(Easings.enter)}
                    >
                      <Chip
                        label={topic.title}
                        icon={topic.icon}
                        onPress={() =>
                          router.replace({
                            pathname: '/chat/[id]',
                            params: { id: 'new', topic: topic.id },
                          })
                        }
                      />
                    </Animated.View>
                  ))}
                </View>
              </>
            ) : null}

            {matchingConversations.length > 0 ? (
              <>
                <ThemedText type="overline" themeColor="textMuted" style={styles.sectionLabel}>
                  {needle ? 'In your conversations' : 'Recent'}
                </ThemedText>
                <View style={styles.conversationList}>
                  {matchingConversations.map((conversation, index) => (
                    <ConversationRow
                      key={conversation.id}
                      conversation={conversation}
                      enterDelay={staggerDelay(index, 160, 50)}
                    />
                  ))}
                </View>
              </>
            ) : null}

            {needle ? (
              <Animated.View
                entering={FadeInDown.delay(240).duration(Durations.gentle).easing(Easings.enter)}
              >
                <PressableScale
                  onPress={askAI}
                  haptic="light"
                  accessibilityLabel={`Ask the assistant about ${trimmed}`}
                  style={[styles.askRow, { borderColor: theme.accentStrong, backgroundColor: theme.accentSoft }]}
                >
                  <Icon name="sparkles" size={IconSize.md} color={theme.accentText} />
                  <ThemedText type="smallMedium" themeColor="accentText" style={styles.askText}>
                    Ask the AI about “{trimmed}”
                  </ThemedText>
                  <Icon name="forward" size={IconSize.sm} color={theme.accentText} />
                </PressableScale>
              </Animated.View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchField: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xxl,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
  },
  sectionLabel: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  topicWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm + 2,
  },
  conversationList: {
    gap: Spacing.md - 2,
  },
  askRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    marginTop: Spacing.xl,
  },
  askText: {
    flex: 1,
  },
  empty: {
    marginTop: Spacing.xxl,
  },
});
