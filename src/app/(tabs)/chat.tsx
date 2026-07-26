import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import AppLogo from '@/components/app-logo';
import { ChatInput } from '@/components/chat/chat-input';
import { MessageBubble } from '@/components/chat/message-bubble';
import { SuggestionCard } from '@/components/chat/suggestion-card';
import { LoginPromptModal } from '@/components/modals/login-prompt-modal';
import { PaywallModal } from '@/components/modals/paywall-modal';
import { SidebarDrawer } from '@/components/navigation/sidebar-drawer';
import { TAB_BAR_CONTENT_HEIGHT } from '@/components/navigation/tab-bar';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
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

export default function MainChatTab() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; topic?: string }>();

  const {
    conversations,
    getConversation,
    startConversation,
    sendMessage,
    typingIn,
    totalUserMessages,
    isLoggedIn,
    isPro,
    setLoginModalVisible,
    setPaywallModalVisible,
  } = useConversations();

  // Active conversation state: default to most recent or start fresh
  const activeId = params.id ?? (conversations.length > 0 ? conversations[0].id : null);
  const [conversationId, setConversationId] = useState<string | null>(activeId);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const conversation = conversationId ? getConversation(conversationId) : undefined;
  const topic = getTopic(params.topic ?? conversation?.topicId);
  const messages = conversation?.messages ?? [];
  const isTyping = conversationId !== null && typingIn === conversationId;

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
      const newId = startConversation(text, topic?.id);
      setConversationId(newId);
    }
  };

  const handleNewQuestion = () => {
    setConversationId(null);
  };

  const suggestions = topic
    ? [topic.sampleQuestion, 'What documents should I gather first?', 'When do I actually need a lawyer?']
    : GENERIC_SUGGESTIONS;

  const showEmptyState = messages.length === 0;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <ThemedStatusBar />

      {/* Global Modals & Sidebar */}
      <SidebarDrawer visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <LoginPromptModal />
      <PaywallModal />

      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <PressableScale
          onPress={() => setSidebarOpen(true)}
          haptic="selection"
          accessibilityLabel="Open sidebar history"
          style={[styles.headerButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <Icon name="history" size={18} color={theme.text} />
        </PressableScale>

        <View style={styles.brandTitleRow}>
          <AppLogo size={28} showText={false} />
          <ThemedText style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {conversation?.title ?? 'LexAura AI'}
          </ThemedText>
        </View>

        <View style={styles.headerRightRow}>
          {!isLoggedIn ? (
            <PressableScale
              onPress={() => setLoginModalVisible(true)}
              haptic="selection"
              style={[styles.usageBadge, { backgroundColor: theme.accentSoft, borderColor: theme.gold }]}
            >
              <ThemedText style={[styles.usageBadgeText, { color: theme.gold }]}>
                {totalUserMessages}/10
              </ThemedText>
            </PressableScale>
          ) : !isPro ? (
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
            <View style={[styles.usageBadge, { backgroundColor: theme.gold }]}>
              <ThemedText style={[styles.usageBadgeText, { color: theme.onPrimary }]}>PRO ⭐</ThemedText>
            </View>
          )}

          <PressableScale
            onPress={handleNewQuestion}
            haptic="light"
            accessibilityLabel="New question"
            style={[styles.headerButton, { backgroundColor: theme.gold }]}
          >
            <Icon name="plus" size={16} color={theme.onPrimary} weight="semibold" />
          </PressableScale>
        </View>
      </View>

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
                {topic ? `Let’s talk ${topic.title.toLowerCase()}` : 'What legal question can I answer today?'}
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
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: Spacing.md },
            ]}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.xs + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  brandTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 4,
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  usageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
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
    width: 64,
    height: 64,
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
    maxWidth: 290,
  },
  suggestions: {
    marginTop: Spacing.xl,
    gap: Spacing.sm + 2,
  },
  suggestionsLabel: {
    marginBottom: Spacing.xs,
  },
});
