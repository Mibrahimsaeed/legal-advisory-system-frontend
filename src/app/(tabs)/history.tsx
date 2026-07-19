import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { ConversationRow } from '@/components/conversation-row';
import { TAB_BAR_CONTENT_HEIGHT } from '@/components/navigation/tab-bar';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { TextField } from '@/components/ui/text-field';
import { ThemedStatusBar } from '@/components/ui/themed-status-bar';
import { Durations, Easings, staggerDelay } from '@/constants/motion';
import { IconSize, Layout, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useConversations, type Conversation } from '@/providers/conversations-provider';

function matchesQuery(conversation: Conversation, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  if (conversation.title.toLowerCase().includes(needle)) return true;
  return conversation.messages.some((message) => message.text.toLowerCase().includes(needle));
}

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { conversations } = useConversations();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => conversations.filter((conversation) => matchesQuery(conversation, query)),
    [conversations, query],
  );

  const hasConversations = conversations.length > 0;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <ThemedStatusBar />

      <Animated.View
        entering={FadeInDown.duration(Durations.gentle).easing(Easings.enter)}
        style={styles.header}
      >
        <View style={styles.headerText}>
          <ThemedText type="title" style={styles.headline}>
            Conversations
          </ThemedText>
          <ThemedText type="caption" themeColor="textMuted">
            {conversations.length === 1 ? '1 saved question' : `${conversations.length} saved questions`}
          </ThemedText>
        </View>

        <PressableScale
          onPress={() => router.push({ pathname: '/chat/[id]', params: { id: 'new' } })}
          haptic="light"
          accessibilityLabel="Start a new question"
          style={[styles.newButton, { backgroundColor: theme.primary }]}
        >
          <Icon name="plus" size={IconSize.md} color={theme.onPrimary} weight="semibold" />
        </PressableScale>
      </Animated.View>

      {hasConversations ? (
        <>
          <Animated.View
            entering={FadeInDown.delay(80).duration(Durations.gentle).easing(Easings.enter)}
            style={styles.searchWrapper}
          >
            <TextField
              icon="search"
              placeholder="Search your conversations…"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              returnKeyType="search"
              right={
                query.length > 0 ? (
                  <PressableScale onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
                    <Icon name="close" size={IconSize.sm} color={theme.iconMuted} />
                  </PressableScale>
                ) : null
              }
            />
          </Animated.View>

          <Animated.FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            itemLayoutAnimation={LinearTransition.duration(Durations.base)}
            renderItem={({ item, index }) => (
              <View style={styles.rowSpacing}>
                <ConversationRow conversation={item} enterDelay={staggerDelay(index, 140, 50)} />
              </View>
            )}
            ListEmptyComponent={
              <EmptyState
                icon="search"
                title="No matches"
                message={`Nothing in your conversations mentions “${query.trim()}”.`}
              />
            }
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + TAB_BAR_CONTENT_HEIGHT + Spacing.xxl },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        </>
      ) : (
        <EmptyState
          icon="history"
          title="No conversations yet"
          message="Ask your first legal question and it will be saved here for quick reference."
          action={{
            label: 'Ask a question',
            onPress: () => router.push({ pathname: '/chat/[id]', params: { id: 'new' } }),
          }}
          style={styles.emptyScreen}
        />
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  headerText: {
    gap: Spacing.xs,
  },
  headline: {
    fontSize: 27,
    lineHeight: 33,
  },
  newButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Layout.screenPadding,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
  },
  rowSpacing: {
    marginBottom: Spacing.md - 2,
  },
  emptyScreen: {
    marginTop: Spacing.xxxl,
  },
});
