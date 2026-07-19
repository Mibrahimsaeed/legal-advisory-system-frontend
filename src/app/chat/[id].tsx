import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

import { ChatInput } from '@/components/chat/chat-input';
import { MessageBubble } from '@/components/chat/message-bubble';
import { SuggestionCard } from '@/components/chat/suggestion-card';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ThemedStatusBar } from '@/components/ui/themed-status-bar';
import { TypingDots } from '@/components/ui/typing-dots';
import { Durations, Easings, staggerDelay } from '@/constants/motion';
import { IconSize, Layout, Radius, Spacing } from '@/constants/theme';
import { getTopic } from '@/data/legal-topics';
import { useTheme } from '@/hooks/use-theme';
import { useConversations, type ChatMessage } from '@/providers/conversations-provider';

const GENERIC_SUGGESTIONS = [
  'Can my employer fire me without notice?',
  'What should a freelance contract include?',
  'When do I actually need a lawyer?',
];

function TypingIndicator() {
  const theme = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.duration(Durations.gentle).easing(Easings.enter)}
      exiting={FadeOut.duration(Durations.fast)}
      style={styles.typingRow}
    >
      <View style={[styles.typingAvatar, { backgroundColor: theme.accentSoft }]}>
        <Icon name="sparkles" size={13} color={theme.accentText} />
      </View>
      <View
        style={[
          styles.typingBubble,
          { backgroundColor: theme.bubbleAssistant, borderColor: theme.border },
        ]}
      >
        <TypingDots color={theme.textMuted} />
      </View>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string; topic?: string }>();
  const isNew = params.id === 'new';

  const { getConversation, startConversation, sendMessage, typingIn } = useConversations();
  const [conversationId, setConversationId] = useState<string | null>(isNew ? null : params.id);

  const conversation = conversationId ? getConversation(conversationId) : undefined;
  const topic = getTopic(params.topic ?? conversation?.topicId);
  const messages = conversation?.messages ?? [];
  const isTyping = conversationId !== null && typingIn === conversationId;

  // Only animate messages that arrive after mount — history should not replay.
  const mountTime = useRef(Date.now());
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messages.length, isTyping]);

  const handleSend = (text: string) => {
    if (conversationId) {
      sendMessage(conversationId, text);
    } else {
      setConversationId(startConversation(text, topic?.id));
    }
  };

  if (!isNew && !conversation) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
        <ThemedStatusBar />
        <ScreenHeader title="Conversation" />
        <EmptyState
          icon="chat"
          title="Conversation not found"
          message="It may have been cleared. Start a new question any time."
          action={{ label: 'Ask a new question', onPress: () => router.replace({ pathname: '/chat/[id]', params: { id: 'new' } }) }}
          style={styles.notFound}
        />
      </SafeAreaView>
    );
  }

  const suggestions = topic
    ? [topic.sampleQuestion, 'What documents should I gather first?', 'When do I actually need a lawyer?']
    : GENERIC_SUGGESTIONS;

  const showEmptyState = messages.length === 0;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <ThemedStatusBar />

      <ScreenHeader
        title={conversation?.title ?? (topic ? `${topic.title} question` : 'New question')}
        subtitle="AI Legal Assistant"
      />

      {/* Header and input live in the same measured tree, so no extra
          keyboard offset is needed — the KAV frame is window-accurate. */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {showEmptyState ? (
          <View style={styles.emptyWrapper}>
            <Animated.View
              entering={FadeInDown.duration(Durations.slow).easing(Easings.enter)}
              style={styles.emptyHero}
            >
              <View style={[styles.emptyIconCircle, { backgroundColor: theme.accentSoft }]}>
                <Icon name="sparkles" size={IconSize.xl} color={theme.accentText} />
              </View>
              <ThemedText type="heading" style={styles.emptyTitle}>
                {topic ? `Let’s talk ${topic.title.toLowerCase()}` : 'What can we look into?'}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptySubtitle}>
                Describe your situation in plain words — no legal jargon needed.
              </ThemedText>
            </Animated.View>

            <View style={styles.suggestions}>
              <ThemedText type="overline" themeColor="textMuted" style={styles.suggestionsLabel}>
                Try asking
              </ThemedText>
              {suggestions.map((question, index) => (
                <SuggestionCard
                  key={question}
                  question={question}
                  onPress={handleSend}
                  enterDelay={staggerDelay(index, 200)}
                />
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={reversedMessages}
            inverted
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble message={item} animate={item.createdAt > mountTime.current} />
            )}
            ListHeaderComponent={isTyping ? <TypingIndicator /> : null}
            ListFooterComponent={
              <Animated.View
                entering={FadeIn.duration(Durations.slow)}
                style={[styles.disclaimer, { backgroundColor: theme.surfaceMuted }]}
              >
                <Icon name="info" size={IconSize.sm} color={theme.textMuted} />
                <ThemedText type="caption" themeColor="textMuted">
                  General information — not legal advice
                </ThemedText>
              </Animated.View>
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    marginVertical: Spacing.xs + 2,
  },
  typingAvatar: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  typingBubble: {
    borderRadius: Radius.lg,
    borderTopLeftRadius: Radius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg - 2,
    paddingVertical: Spacing.sm,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: Spacing.xs + 2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    marginBottom: Spacing.md,
  },
  notFound: {
    marginTop: Spacing.xxxl,
  },
  emptyWrapper: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  emptyHero: {
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: Spacing.sm,
    maxWidth: 280,
  },
  suggestions: {
    marginTop: Spacing.xxl,
    gap: Spacing.sm + 2,
  },
  suggestionsLabel: {
    marginBottom: Spacing.xs,
  },
});
